/**
 * Smart Diagnostic & Technician Knowledge Engine for Appliance Faults
 * Analyzes reported symptoms and provides instant technical diagnosis, probable root cause,
 * recommended parts, and estimated repair duration based on 30+ years of repair expertise.
 */

export interface DiagnosticResult {
  probableCause: string;
  recommendedParts: string[];
  severity: 'منخفض' | 'متوسط' | 'مرتفع' | 'طوارئ فوري';
  estimatedDuration: string;
  technicianAdvice: string[];
  safetyNotes: string;
}

/**
 * Intelligent Egyptian appliance fault diagnosis engine
 */
export async function diagnoseApplianceFault(
  deviceType: string,
  problemDescription: string,
  _brand = ''
): Promise<DiagnosticResult> {
  const desc = problemDescription.toLowerCase();
  const dev = deviceType.toLowerCase();

  // Rule-based high accuracy diagnostic knowledge base
  if (dev.includes('غسال') || dev.includes('washer')) {
    if (desc.includes('صوت') || desc.includes('عصر') || desc.includes('خض') || desc.includes('خشونة') || desc.includes('طرد')) {
      return {
        probableCause: 'تآكل رولمان البلي (Bearing) أو تلف طلمبة الصرف أو مساعدين الحلة',
        recommendedParts: ['طقم رولمان بلي ياباني أصلي NACHI', 'أولسيه عازل مياه', 'مساعدين هيدروليك أصلي', 'طلمبة طرد مياه إيطالي'],
        severity: 'متوسط',
        estimatedDuration: '45 - 90 دقيقة',
        technicianAdvice: [
          'فحص حركة الحلة يدوياً والتأكد من عدم وجود بوش أفقي أو رأسي',
          'التأكد من سلامة الصليب وسوست التعليق العلوية',
          'اختبار مضخة الطرد والتأكد من خلو الفلتر من العوالق أو العملات المعدنية'
        ],
        safetyNotes: 'يجب فصل التيار الكهربائي والتأكد من تفريغ المياه قبل فك المساعدين أو الرولمان بلي'
      };
    }

    if (desc.includes('بارومة') || desc.includes('صدأ') || desc.includes('تآكل') || desc.includes('شاسيه') || desc.includes('دوكو')) {
      return {
        probableCause: 'تآكل الشاسيه والقاعدة السفلية بسبب رطوبة وتسريب المياه المزمن',
        recommendedParts: ['صاج مصفح مجلفن 1.2 مم', 'معجون حديد معالج', 'دهان دوكو فرن مقاوم للرطوبة', 'أرجل اتزان جديدة'],
        severity: 'مرتفع',
        estimatedDuration: '24 - 48 ساعة (ورشة السمكرة والدوكو)',
        technicianAdvice: [
          'قص كامل الأجزاء المصابة بالبارومة حتى الوصول للصاج السليم',
          'لحام شاسيه صاج مجلفن وتثبيت القواعد بإحكام',
          'معالجة العزل المائي للكاوتش لمنع تكرار تسريب المياه على الشاسيه'
        ],
        safetyNotes: 'التأكد من عزل الأسلاك الكهربائية السفلية عن الصاج أثناء السمكرة'
      };
    }

    return {
      probableCause: 'عطل في دائرة التحكم الإلكترونية (الكارتة) أو حساس الميزان (برشر)',
      recommendedParts: ['كارتة تحكم إلكترونية أصلية', 'حساس منسوب المياه (برشر)', 'مفتاح قفل الباب (لوك)'],
      severity: 'متوسط',
      estimatedDuration: '30 - 60 دقيقة',
      technicianAdvice: [
        'قياس جهد الدخول للكارتة وفحص الفيوز ومكثف الباور',
        'فحص خرطوم البرشر من أي انسداد بالرواسب'
      ],
      safetyNotes: 'تجنب لمس مكثفات الباور المرتفعة على الكارتة قبل تفريغها'
    };
  }

  if (dev.includes('ثلاج') || dev.includes('فريزر') || dev.includes('fridge') || dev.includes('freezer')) {
    if (desc.includes('تبريد') || desc.includes('فريون') || desc.includes('ثلج') || desc.includes('تسريب') || desc.includes('ماتور') || desc.includes('كمبروسر')) {
      return {
        probableCause: 'تسريب في دائرة التبريد (اليودر) أو تلف الفلتر أو ضعف ضغط الكمبروسر',
        recommendedParts: ['فلتر دراير نحاس أصلي', 'بلف خدمة وشحن إيطالي', 'شحن فريون R134a / R600a أصلي', 'موتور Danfoss / Cubigel'],
        severity: desc.includes('ماتور') ? 'مرتفع' : 'متوسط',
        estimatedDuration: '60 - 90 دقيقة',
        technicianAdvice: [
          'ضغط دائرة التبريد بغاز النيتروجين لكشف مكان التنفيس بدقة',
          'عمل فاكيوم عميق لمدة لا تقل عن 20 دقيقة قبل الشحن',
          'شحن الفريون بالجرام وفقاً للبيانات المكتوبة على تكت الجهاز'
        ],
        safetyNotes: 'استخدام أجهزة قياس الضغط المعتمدة وعدم التسخين المباشر على مواسير الفريون القابلة للاشتعال R600a'
      };
    }

    if (desc.includes('بارومة') || desc.includes('صدأ') || desc.includes('باب') || desc.includes('جوان')) {
      return {
        probableCause: 'تآكل الحلق السفلي والشاسيه وتلف الجوان المغناطيسي للأبواب',
        recommendedParts: ['صاج مجلفن معالج 1.2 مم', 'جوان باب مغناطيسي أصلي', 'دهان دوكو فرن فضي حراري'],
        severity: 'مرتفع',
        estimatedDuration: '24 - 48 ساعة (علاج بارومة ودوكو فرن)',
        technicianAdvice: [
          'استبدال الصاج التالف وشحن الفراغات بالفوم العازل',
          'تعديل زوايا مفصلات الباب وضمان الإغلاق المحكم لمنع تسريب البرودة'
        ],
        safetyNotes: 'الحرص على عدم إتلاف مواسير اليودر المدفونة داخل الحلق أثناء السمكرة'
      };
    }
  }

  // Default General Appliance Diagnosis
  return {
    probableCause: 'عطل كهربائي / ميكانيكي بحاجة لمعاينة ميدانية وفحص مكونات التشغيل',
    recommendedParts: ['مجموعة تشغيل كهربائية أصلية', 'حساسات أمان وحماية', 'قطع غيار مطابقة للمصنع'],
    severity: 'متوسط',
    estimatedDuration: '30 - 60 دقيقة',
    technicianAdvice: [
      'فحص الجهد الكهربائي ومصدر التغذية الرئيسي',
      'فحص استهلاك الأمبير عند الإقلاع وتجربة دائرة التحكم'
    ],
    safetyNotes: 'فصل التيار الكهربائي واستخدام مفك الفحص وأجهزة القياس المعتمدة'
  };
}
