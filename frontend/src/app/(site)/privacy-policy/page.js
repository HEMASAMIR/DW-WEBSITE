export const metadata = {
  title: "سياسة الخصوصية | أكاديمية دويتش فيلت | Deutsche Welt Akademie",
  description: "سياسة الخصوصية وحماية بيانات المستخدمين والطلاب لتطبيق وموقع أكاديمية دويتش فيلت لتعليم اللغة الألمانية مع الهير خالد الحلواني.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-200" dir="rtl">
      <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-md">
        
        {/* Header */}
        <div className="text-center pb-8 border-b border-slate-800">
          <span className="inline-block bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            Deutsche Welt Akademie 🇩🇪
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
            سياسة الخصوصية وحماية البيانات
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            تطبيق وموقع أكاديمية دويتش فيلت لتعليم اللغة الألمانية مع الهير خالد الحلواني
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="bg-slate-800 text-slate-300 text-xs font-mono px-3 py-1 rounded-md border border-slate-700">
              معرف الحزمة: com.deutschwelt.academy
            </span>
            <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-md border border-slate-700">
              آخر تحديث: أكتوبر 2026
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 space-y-8 text-slate-300 leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-blue-500">1.</span> مقدمة وتعهد الخصوصية
            </h2>
            <p className="text-slate-300">
              نحن في <strong className="text-white">أكاديمية دويتش فيلت (Deutsche Welt Akademie)</strong> نلتزم بأعلى معايير حماية الخصوصية والأمان لبيانات طلابنا ومستخدمينا عبر تطبيق الهاتف المحمول (Android & iOS) والموقع الإلكتروني. تهدف هذه الوثيقة إلى توضيح كيفية جمع واستخدام وحماية بياناتك وفقاً لسياسات Google Play و Apple App Store والقوانين الدولية لحماية البيانات.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-blue-500">2.</span> البيانات التي نقوم بجمعها
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-300 pr-2">
              <li><strong className="text-white">بيانات الحساب:</strong> الاسم الكامل، البريد الإلكتروني، رقم الهاتف، والمستوى التعليمي (A1, A2, B1, B2).</li>
              <li><strong className="text-white">سجلات التعلم والتقدم:</strong> إحصائيات مشاهدة المحاضرات، التدريبات التقييمية، والواجبات المكتملة.</li>
              <li><strong className="text-white">بيانات الجهاز والاتصال:</strong> معرف الجهاز الفريد وإصدار النظام لضمان استقرار التطبيق وتلقي إشعارات الحصص والتنبيهات التعليمية.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-blue-500">3.</span> الغرض من استخدام البيانات
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-300 pr-2">
              <li>إدارة الحساب وتمكين الطالب من متابعة الكورسات والدروس بأمان.</li>
              <li>تخصيص المتابعة الأكاديمية وتقديم الدعم المباشر عبر واتساب.</li>
              <li>إرسال التنبيهات الضرورية الخاصة بمواعيد الحصص المباشرة والواجبات.</li>
              <li><strong className="text-emerald-400">نحن لا نقوم ببيع أو مشاركة أو تأجير أي بيانات شخصية لأي طرف ثالث أو شبكات إعلانية على الإطلاق.</strong></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-blue-500">4.</span> أمان البيانات وحمايتها
            </h2>
            <p className="text-slate-300">
              تخضع جميع الاتصالات بين التطبيق وخوادمنا لتشفير عالي الأمان عبر بروتوكول SSL/HTTPS، مع حماية الجلسات بآليات التخزين المشفرة محلياً وسحابياً لمنع أي وصول غير مصرح به.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-blue-500">5.</span> حذف الحساب والبيانات (Account Deletion)
            </h2>
            <p className="text-slate-300 mb-3">
              يحق لأي مستخدم في أي وقت طلب حذف حسابه وكافة بياناته المرتبطة به نهائياً وبلا رجعة من خلال التطبيق مباشرة من صفحة الملف الشخصي، أو بمراسلة الإدارة الأكاديمية عبر:
            </p>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <p className="text-white font-semibold">📧 البريد الإلكتروني الرسمي:</p>
                <p className="text-blue-400 font-mono text-sm">admin@deutschwelt.com</p>
              </div>
              <div>
                <p className="text-white font-semibold">💬 دعم واتساب الأكاديمي:</p>
                <p className="text-emerald-400 font-mono text-sm" dir="ltr">+20 105 567 3184</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs sm:text-sm text-slate-500">
          © 2026 أكاديمية دويتش فيلت - جميع الحقوق محفوظة | Herr Khaled Elhalwany
        </div>

      </div>
    </div>
  );
}
