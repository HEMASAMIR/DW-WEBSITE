"""Seed the academy's current branches (previously hard-coded in the website) when the table is empty."""

from django.db import migrations

BRANCHES = [
    ('فرع شبين الكوم', 'المنوفية', 'برج حجازي – الدور الثاني علوي، أمام مستشفى الجامعة مباشرة',
     'https://maps.app.goo.gl/NJRj414R5yurS7Gs8?g_st=ac', '+201055287454', 'فرع رئيسي'),
    ('فرع طنطا', 'الغربية', 'شارع الاستاد الرئيسي عمارة عزام اعلى ماجورو سوشي',
     'https://maps.app.goo.gl/kTmsQaMC9hyaQN5z7', '+201055287454', 'الغربية'),
    ('فرع مدينة نصر', 'القاهرة', '١٦ ش شريف سامي - بالقرب من (كوبري المنهل / جامع السلام) - الدور الأول',
     'https://maps.app.goo.gl/i55RDUisL7wcdwf3A', '01144151673', 'القاهرة'),
]


def seed(apps, schema_editor):
    Branch = apps.get_model('academy', 'Branch')
    if Branch.objects.exists():
        return
    for i, (name, city, address, map_url, phone, badge) in enumerate(BRANCHES, start=1):
        Branch.objects.create(name=name, city=city, address=address, map_url=map_url,
                              phone=phone, badge=badge, order=i, branch_type='physical')


class Migration(migrations.Migration):
    dependencies = [('academy', '0006_access_requests_branch_order')]
    operations = [migrations.RunPython(seed, migrations.RunPython.noop)]
