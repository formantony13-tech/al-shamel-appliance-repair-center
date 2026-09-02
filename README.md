# دليل تشغيل واستخدام منصة مركز قطب للحل السريع (Production v3.0) 🛠️

نظام متكامل لإدارة خدمات الصيانة المنزلية وحجوزات العملاء لمركز قطب للحل السريع (أبو المطامير ومحافظة البحيرة)، مبني بأحدث تقنيات React وTypeScript وFirebase Cloud Services.

---

## 🔐 1. نظام تسجيل الدخول والصلاحيات المعتمد (Firebase Auth RBAC)

تم بناء نظام الحماية والأمان على أساس **Google Firebase Authentication** بالكامل:
- **الوصول:** عبر النقر على زر **"لوحة الإدارة"** أو أيقونة القفل في أعلى الموقع أو أسفل الفوتر.
- **طريقة الدخول:** باستخدام البريد الإلكتروني وكلمة المرور المسجلة الخاصة بالمشرف أو عبر حساب Google المعتمد.
- **تفعيل الصلاحيات (RBAC):**
  - الحساب الرئيسي للمالك (Super Admin) يمتلك صلاحيات إدارة كافة جوانب النظام وتفويض المشرفين والفنيين.
  - لا توجد أي كلمات مرور افتراضية أو ثابتة في الكود البرمجي؛ فكل حساب يخضع للتحقق الآمن المباشر عبر خوادم Google Cloud.

---

## 📱 2. أقسام ووظائف لوحة الإدارة (Admin Dashboard)

1. **نظرة عامة وإحصائيات (Overview):**
   - متابعة مؤشرات الأداء اللحظية (الطلبات الجديدة، قيد الفحص والإصلاح، المكتملة).
   - إحصائيات الإيرادات وتكاليف قطع الغيار وفترة الضمان.
   - تنبيهات التقييمات المعلقة بانتظار المراجعة.

2. **إدارة طلبات الصيانة (Bookings Management):**
   - استعراض الحجوزات الواردة وتصفيتها والبحث برقم الهاتف أو كود الحجز.
   - تحديث مراحل الطلب (`NEW`, `SCHEDULED`, `IN_PROGRESS`, `WAITING_FOR_PART`, `COMPLETED`, `CANCELLED`).
   - إسناد الفنيين، تسجيل التكلفة المقدرة، والملاحظات الداخلية.
   - تحويل الحجز مباشرة إلى أمر صيانة أو شهادة ضمان معتمدة.
   - التواصل المباشر مع العميل بنقرة واحدة عبر واتساب.

3. **أوامر الإصلاح الفنية والضمان (Repair Jobs):**
   - ورقة الفحص الفني الرسمية، التشخيص، قطع الغيار المستبدلة، وتكلفة المصنعية.
   - طباعة شهادة الضمان المعتمدة للعميل مع QR Code وكود التحقق.

4. **إدارة العملاء (Customers CRM):**
   - سجل موحد لكل عميل يتضمن تاريخ الصيانة وسجل الأجهزة المصانة.

5. **مراجعة واعتماد التقييمات (Reviews Moderation):**
   - اعتماد آراء وتقييمات العملاء وتوثيقها بكود الحجز لمنع التقييمات المزيفة.

6. **معرض الأعمال والإنجازات (Works Gallery):**
   - إضافة وتعديل أعمال الصيانة وتجديد الأجهزة مع صور قبل/بعد.

7. **معرض الأجهزة المجددة للبيع (Appliance Marketplace):**
   - إدارة الأجهزة المتاحة للبيع مع المواصفات والأسعار وفترات الضمان.

8. **إدارة المشرفين والصلاحيات (Admins & Access Control):**
   - إضافة المشرفين وتحديد الصلاحيات (`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `TECHNICIAN`).

9. **النسخ الاحتياطي وسجل التدقيق (Backup & Audit Trail):**
   - تصدير واستيراد نسخة احتياطية كاملة بصيغة JSON خاضعة لفحص Zod.
   - سجل تدقيق غير قابل للتعديل (Append-Only) لجميع العمليات الإدارية الحساسة.

---

## 🛡️ 3. الأمان وقواعد البيانات السحابية

- **Firestore Rules:** قواعد وصول صارمة تمنع قراءة بيانات الحجوزات والعملاء من غير المشرفين المصرح لهم.
- **Safe Tracking:** نظام تتبع آمن لا يفصح عن أي بيانات شخصية (PII) كالعناوين أو الملاحظات، ويشترط كود الحجز مع آخر 4 أرقام من الهاتف للتحقق.
- **Storage Partitioning:** تقسيم وسائط التخزين السحابي إلى مسارات عامة ومسارات خاصة محمية لمنع الوصول غير المصرح به للصور الخاصة بالعملاء.

## GitHub Pages deployment (V7)

This version includes a GitHub Actions workflow for GitHub Pages.

1. Push the repository to the `main` branch.
2. Open **Settings → Pages** on GitHub.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Open **Actions** and wait for **Deploy to GitHub Pages** to finish successfully.
5. Open the Pages URL shown by the deployment job.

The Vite base path is configured automatically for the repository `al-shamel-appliance-repair-center` when the build runs in GitHub Actions. Local development and Netlify continue to use `/`.

### If the repository name changes

Update the `base` path in `vite.config.ts` to `/<repository-name>/` for a GitHub Pages project site.
