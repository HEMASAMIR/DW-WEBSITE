"""
Management command to seed the CourseLevel table with the 4 German levels.
Run once after migration: python manage.py seed_levels

Usage:
    python manage.py seed_levels           # Create if not exists
    python manage.py seed_levels --reset   # Delete all and recreate
"""

from django.core.management.base import BaseCommand
from academy.models import CourseLevel


LEVELS = [
    {
        'name': 'A1',
        'title': 'المستوى A1 - للمبتدئين من الصفر (Grundstufe A1)',
        'description': 'تأسيس اللغة الألمانية وقواعدها والنطق الصحيح والتعريف بالنفس والحوارات الأساسية مع الأستاذ خالد.',
        'price': '1200.00',
        'old_price': '1600.00',
        'order': 1,
        'is_active': True,
        'bunny_collection_id': '',  # Fill this with your Bunny collection ID
    },
    {
        'name': 'A2',
        'title': 'المستوى A2 - المحادثة والتأسيس الثاني (Aufbaukurs A2)',
        'description': 'توسيع حصيلة المفردات وتطوير حوارات الحياة اليومية وقواعد المستوى الثاني مع الأستاذ خالد.',
        'price': '1400.00',
        'old_price': '1850.00',
        'order': 2,
        'is_active': True,
        'bunny_collection_id': '',
    },
    {
        'name': 'B1',
        'title': 'المستوى B1 - مؤهل السفر وشركات الكول سنتر (Mittelstufe B1)',
        'description': 'التأهيل الكامل لامتحانات معهد جوته Goethe B1 والعمل بشركات Concentrix و Vodafone DE مع الأستاذ خالد.',
        'price': '1800.00',
        'old_price': '2400.00',
        'order': 3,
        'is_active': True,
        'bunny_collection_id': '',
    },
    {
        'name': 'B2',
        'title': 'المستوى B2 - الطلاقة والكفاءة التخصصية (Oberstufe & Medizin)',
        'description': 'إتقان المصطلحات المعقدة والنقاشات التخصصية للأطباء والمهندسين والراغبين بالسفر مع الأستاذ خالد.',
        'price': '2200.00',
        'old_price': '2900.00',
        'order': 4,
        'is_active': True,
        'bunny_collection_id': '',
    },
]


class Command(BaseCommand):
    help = 'Seed the database with the 4 German course levels (A1, A2, B1, B2)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Delete all existing levels and recreate them',
        )

    def handle(self, *args, **options):
        if options['reset']:
            CourseLevel.objects.all().delete()
            self.stdout.write(self.style.WARNING('Deleted all existing levels.'))

        created_count = 0
        updated_count = 0

        for level_data in LEVELS:
            level, created = CourseLevel.objects.update_or_create(
                name=level_data['name'],
                defaults=level_data,
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'[CREATED] {level.name} - {level.title}'))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f'[UPDATED] {level.name} - {level.title}'))

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Done! Created {created_count} new levels, updated {updated_count} existing levels.'
        ))
        self.stdout.write('')
        self.stdout.write(self.style.NOTICE(
            'Next step: Set bunny_collection_id for each level via Django Admin or shell:\n'
            '   python manage.py shell\n'
            '   >>> from academy.models import CourseLevel\n'
            '   >>> CourseLevel.objects.filter(name="A1").update(bunny_collection_id="your-collection-id")\n'
        ))
