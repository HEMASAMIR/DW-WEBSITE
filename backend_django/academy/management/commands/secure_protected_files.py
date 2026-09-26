"""
Move existing book / course files out of the public MEDIA_ROOT into PROTECTED_MEDIA_ROOT.

    python manage.py secure_protected_files            # dry run (shows what would move)
    python manage.py secure_protected_files --apply    # move the files

Safe to run more than once: files already in protected storage are skipped.
"""

import os
import shutil

from django.conf import settings
from django.core.management.base import BaseCommand

from academy.models import CourseFile, DigitalBook


class Command(BaseCommand):
    help = 'Move paid files (books, course files) from public media/ to protected storage.'

    def add_arguments(self, parser):
        parser.add_argument('--apply', action='store_true', help='Actually move the files (default is a dry run).')

    def handle(self, *args, **options):
        apply = options['apply']
        public_root = os.path.abspath(settings.MEDIA_ROOT)
        protected_root = os.path.abspath(settings.PROTECTED_MEDIA_ROOT)
        moved = skipped = missing = 0

        for model in (DigitalBook, CourseFile):
            for obj in model.objects.exclude(file=''):
                name = obj.file.name
                src = os.path.join(public_root, name)
                dst = os.path.join(protected_root, name)

                if os.path.exists(dst):
                    skipped += 1
                    if apply and os.path.exists(src):
                        os.remove(src)  # leftover public copy
                    continue
                if not os.path.exists(src):
                    missing += 1
                    self.stderr.write(self.style.WARNING(f'missing: {model.__name__} #{obj.pk} {name}'))
                    continue

                self.stdout.write(f'{"move" if apply else "would move"}: {name}')
                if apply:
                    os.makedirs(os.path.dirname(dst), exist_ok=True)
                    shutil.move(src, dst)
                moved += 1

        verb = 'Moved' if apply else 'Would move'
        self.stdout.write(self.style.SUCCESS(f'{verb} {moved} file(s); {skipped} already protected; {missing} missing.'))
        if not apply and moved:
            self.stdout.write('Run again with --apply to move them.')
