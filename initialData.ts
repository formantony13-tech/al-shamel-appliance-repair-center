import { RepairWork, CustomerReview, AppSystemSettings, ApplianceForSale } from '../types';
import realAlaskaFreezer from '../assets/images/real_alaska_freezer_1788256277335.jpg';
import silverWasherRepair from '../assets/images/silver_washer_repair_1788256297679.jpg';
import samsungWasherBefore from '../assets/images/samsung_washer_before_1788256315096.jpg';
import samsungWasherAfter from '../assets/images/samsung_washer_after_1788256332451.jpg';
import fridgeRustBefore from '../assets/images/fridge_rust_before_1788256351312.jpg';
import fridgeRestoredAfter from '../assets/images/fridge_restored_after_1788256368740.jpg';
import sharpFridgeSale from '../assets/images/sharp_fridge_sale_1788359978990.jpg';
import lgWasherSale from '../assets/images/lg_washer_sale_1788359996645.jpg';
import kiriaziFreezerSale from '../assets/images/kiriazi_freezer_sale_1788360011974.jpg';
import cookerStoveSale from '../assets/images/cooker_stove_sale_1788360063132.jpg';
import realCompressorRepair from '../assets/images/real_compressor_repair_1788360027168.jpg';
import realWasherBoardRepair from '../assets/images/real_washer_board_1788360044372.jpg';

export const INITIAL_SETTINGS: AppSystemSettings = {
  centerName: 'مركز قطب للحل السريع',
  centerSlogan: 'مهما كانت المشكلة صعبة.. إحنا نحلها لك!',
  phone1: '201066007455',
  phone1Display: '01066007455',
  phone2: '201010965540',
  phone2Display: '01010965540',
  whatsappNumber: '201066007455',
  locationName: 'فروعنا تغطي محافظات: البحيرة • الغربية • الشرقية',
  yearsExperience: '30+',
  operatingHours: 'يومياً على مدار 24 ساعة لخدمتكم بمحافظات البحيرة والغربية والشرقية',
  googleMapsLink: 'https://maps.app.goo.gl/oKTLj5erUH9ox3Kt5',
  facebookPage: 'https://www.facebook.com/share/19Jhvhxgr5/',
  facebookGroup: 'https://www.facebook.com/share/g/189yB2ww3f/',
  heroBadge: 'مركز قطب • خبرة أكثر من 30 سنة | فروع البحيرة • الغربية • الشرقية',
  heroHeadline: 'مهما كانت المشكلة في الأجهزة المنزلية صعبة.. إحنا هنحلها لك فوراً!',
  heroHeadlineHighlight: 'الثلاجة، الغسالة، أو الديب فريزر',
  heroSubheadline: 'في خلال 24 ساعة بيكون عندك أسطول صيانة وفني محترف أينما كنت في محافظات البحيرة، الغربية، والشرقية مع قطع غيار أصلية 100% وضمان معتمد.',
  heroBannerImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  warrantyDurationDefault: '6 شهور ضمان معتمد',
  maintenancePriceStart: 'الكشف مجاني عند إتمام الصيانة',
  emergencyNotice: 'طوارئ الصيانة والزيارات المنزلية الفورية متاحة 24/7 في كافة المراكز والقرى'
};


export const INITIAL_WORKS: RepairWork[] = [
  {
    id: 'work-real-1',
    title: 'علاج بارومة وتجديد صاج ودهان دوكو فرن كامل لثلاجة بابين بعد تآكل الشاسيه',
    category: 'ثلاجات',
    deviceType: 'ثلاجة بابين (Two-Door Refrigerator)',
    brand: 'ثلاجة بابين منزلية',
    problem: 'قبل الصيانة: تآكل شديد في الصاج الخارجي، وسقوط دهان المصنع الأصفر، وتفشي البارومة في شاسيه وقاعدة الثلاجة بالكامل.',
    solution: 'بعد الصيانة: قص الأجزاء التالفة، لحام صاج مجلفن معالج ضد الصدأ، ورش دهان دوكو فرن فضي رمادي لامع مطابق لمواصفات المصنع وتغليفها حرارياً بالاسترتش للحماية.',
    date: '2026-02-28',
    image: fridgeRestoredAfter,
    beforeImage: fridgeRustBefore,
    partsReplaced: ['شاسيه صاج مجلفن معالج 1.2 مم', 'جوانات أبواب مغناطيسية جديدة', 'دهان دوكو فرن عازل للرطوبة والحرارة'],
    warranty: 'ضمان سنتين معتمد ضد البارومة والصدأ'
  },
  {
    id: 'work-real-2',
    title: 'تجديد شامل وعلاج بارومة وصيانة ميكانيكا وحلة لغسالة سامسونج داياموند',
    category: 'غسالات',
    deviceType: 'غسالة سامسونج داياموند أوتوماتيك (Samsung Diamond)',
    brand: 'سامسونج / Samsung',
    problem: 'قبل الصيانة: تفكك الشاسيه وتآكل الصاج السفلي بسبب تسريب المياه مع صدأ الحلة واهتزاز شديد بالكهرباء والموتور.',
    solution: 'بعد الصيانة: فك وتجديد الشاسيه بالكامل، صيانة الحلة الداخلية والكهرباء، دهان وتجميع الجهاز وتغليفه باسترتش حماية ليعود كالجديد تماماً.',
    date: '2026-02-24',
    image: samsungWasherAfter,
    beforeImage: samsungWasherBefore,
    partsReplaced: ['صاج سفلي مصفح مجلفن', 'طقم مساعدين هيدروليك أصلي', 'أولسيه ورولمان بلي ياباني', 'طلمبة طرد أصلية'],
    warranty: 'ضمان سنة كاملة معتمد من مركز قطب'
  },
  {
    id: 'work-real-3',
    title: 'صيانة دائرة تبريد وشحن فريون أصلي لديب فريزر ألاسكا رأسي أبيض',
    category: 'ديب فريزر',
    deviceType: 'ديب فريزر ألاسكا رأسي أدراج (Alaska Upright Freezer)',
    brand: 'ألاسكا / Alaska',
    problem: 'الديب فريزر فصل تجميد ولمبة الإنذار تضيء، مع ضعف شديد في تبريد الأدراج وتراكم رطوبة.',
    solution: 'كشف وضغط النيتروجين لمعالجة التسريب بشبكة اليودر، تغيير الفلتر النحاسي، عمل فاكيوم عميق وشحن فريون أصلي مع ضبط الثرموستات ولمبات البيان.',
    date: '2026-02-20',
    image: realAlaskaFreezer,
    partsReplaced: ['فلتر دراير نحاس أصلي', 'بلف شحن إيطالي', 'شحن فريون بيور معتمد'],
    warranty: 'ضمان 6 شهور معتمد'
  },
  {
    id: 'work-real-4',
    title: 'صيانة ميكانيكا وعزل صوت وتغيير طلمبة لغسالة أوتوماتيك فضية باب أمامي',
    category: 'غسالات',
    deviceType: 'غسالة أوتوماتيك فضي باب أمامي (Front-Load Silver Washer)',
    brand: 'غسالة أوتوماتيك سيلفر',
    problem: 'صوت خشونة مرتفع في العصر، عدم إتمام دورة الصرف بالكامل وتسريب مياه أسفل الباب.',
    solution: 'تغيير طقم رولمان بلي ياباني مانع للصوت، استبدال كاوتشة جوان الباب وطلمبة الصرف واختبار الاتزان الديناميكي للحلة.',
    date: '2026-02-15',
    image: silverWasherRepair,
    partsReplaced: ['رولمان بلي ياباني أصلي NACHI', 'كاوتش جوان باب أصلي', 'طلمبة طرد مياه إيطالي'],
    warranty: 'ضمان 6 شهور معتمد'
  },
  {
    id: 'work-1',
    title: 'لحام وتغيير كمبروسر دانفوس أصلي مع ضغط نيتروجين وشحن فريون بيور',
    category: 'ثلاجات',
    deviceType: 'ثلاجة كريازي نوفروست (Kiriazi NoFrost Refrigerator)',
    brand: 'كريازي / Kiriazi',
    problem: 'الموتور محروق وتوقف التبريد بالكامل مع وجود تسريب زيت في مواسير التبريد الخلفية.',
    solution: 'تم تنظيف الدائرة من الزيت، لحام وصلات النحاس بفضة عالية الجودة، تركيب كمبروسر دانفوس جديد وشحن الفريون بميزان الجرام الدقيق.',
    date: '2026-02-10',
    image: realCompressorRepair,
    partsReplaced: ['موتور Danfoss ألماني 1/4 حصان', 'فلتر دراير نحاس أصلي', 'بلف خدمة إيطالي', 'شحن فريون R134a أصلي'],
    warranty: 'ضمان سنة كاملة معتمد'
  },
  {
    id: 'work-board',
    title: 'فحص وإصلاح كارتة الكترونية ديجيتال لغسالة أوتوماتيك وعلاج أعطال الباور',
    category: 'غسالات',
    deviceType: 'كارتة تحكم غسالة ديجيتال (Electronic Control Board)',
    brand: 'زانوسي / إل جي / توشيبا',
    problem: 'الغسالة قاطعة باور تماماً ولا تستجيب لزر التشغيل مع وجود آثار حريق على ترانزستور الباور ومكثفات التنعيم.',
    solution: 'فحص ميكروسكوبي وتغيير آي سي الباور (Power IC) والمكثفات التالفة، إعادة برمجة الكارتة وتجربتها على بنك الاختبار بكفاءة 100%.',
    date: '2026-02-05',
    image: realWasherBoardRepair,
    partsReplaced: ['آي سي باور أصلي Power IC', 'طقم مكثفات ياباني 105C', 'ريلاي أحمال ثقيلة 16A'],
    warranty: 'ضمان 6 شهور معتمد'
  },
  {
    id: 'work-8',
    title: 'صيانة وشحن فريون R410a تكييف كاريير 2.25 حصان سبليت إنفرتر',
    category: 'تكييفات',
    deviceType: 'تكييف كاريير سبليت',
    brand: 'كاريير / Carrier',
    problem: 'ضعف التبريد وخروج هواء دافئ وتسريب مياه من حوض الوحدة الداخلية.',
    solution: 'غسيل كيميائي للمبخر والمكثف، معالجة التسريب بشبكة النحاس، وشحن فريون كامل مع تنظيف خط الصرف.',
    date: '2026-01-20',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80',
    partsReplaced: ['شحن فريون أصلي', 'عازل حراري للمواسير'],
    warranty: 'ضمان 6 شهور'
  },
  {
    id: 'work-9',
    title: 'تجديد عيون وفونيات ومحابس وإشعال ذاتي لبوتاجاز 5 شعلة ستانلس',
    category: 'بوتاجازات',
    deviceType: 'بوتاجاز 5 شعلة ستانلس ستيل',
    brand: 'يونيفرسال / Universal',
    problem: 'هباب أسود على الأواني، نار الفرن ضعيفة وتنطفئ عند ترك المفتاح.',
    solution: 'تغيير فونيات الغاز الأصلية بالمقاس المناسب، تسليك وتليين المحابس بشحم حراري، وتغيير حساس الأمان الثرموكبل.',
    date: '2026-01-15',
    image: cookerStoveSale,
    partsReplaced: ['طقم فونيات غاز إيطالي', 'حساس ثرموكبل أمان أصلي', 'شمعات إشعال'],
    warranty: 'ضمان 6 شهور'
  }
];

export const INITIAL_PRODUCTS_FOR_SALE: ApplianceForSale[] = [
  {
    id: 'sale-001',
    title: 'ثلاجة شارب 16 قدم نوفروست ديجيتال سيلفر - بحالة الزيرو وفحص شامل',
    category: 'ثلاجات',
    brand: 'شارب / Sharp',
    model: 'SJ-PC48A-SL',
    price: 9800,
    originalPrice: 18500,
    status: 'AVAILABLE',
    condition: 'مجددة بحالة الزيرو (Refurbished Like New)',
    specs: [
      'سعة 16 قدم (384 لتر) نوفروست',
      'تبريد هايبرد (Hybrid Cooling System) لمنع جفاف الأطعمة',
      'فلتر Ag+ Nano Deodorizer مانع للروائح والبكتيريا',
      'أرفف زجاج بايركس حراري شديدة التحمل',
      'شحن فريون أصلي مع كشف تبريد 48 ساعة متواصلة'
    ],
    warranty: 'ضمان 6 شهور معتمد وشامل من مركز قطب',
    image: sharpFridgeSale,
    description: 'ثلاجة شارب ياباني تقفيل ممتاز، تم عمل فحص شامل لدائرة التبريد، شحن فريون بيور، جوانات أبواب جديدة، دهان وشاسيه فابريكا كالجديدة تماماً بدون أي خدوش أو بارومة.',
    location: 'فرع دمنهور / متاح التوصيل لكافة محافظات البحيرة والغربية والشرقية',
    featured: true,
    createdAt: '2026-02-28T10:00:00.000Z'
  },
  {
    id: 'sale-002',
    title: 'غسالة إل جي 8 كيلو أوتوماتيك Direct Drive إنفرتر سيلفر تيتانيوم',
    category: 'غسالات',
    brand: 'إل جي / LG',
    model: 'F4J5TNP7S 8KG Inverter',
    price: 8900,
    originalPrice: 16000,
    status: 'AVAILABLE',
    condition: 'استعمال خفيف مجددة بقطع غيار أصلية',
    specs: [
      'سعة 8 كجم غسيل - عصر 1400 لفة/دقيقة',
      'موتور Direct Drive دفع مباشر بدون سير فائق الهدوء',
      'تقنية 6 Motion لحركات الغسيل المتعددة للحفاظ على الأقمشة',
      'سخان داخلي ديجيتال وشاشة لمس LED متطورة',
      'طقم رولمان بلي ياباني وطلمبة طرد جديدة تماماً'
    ],
    warranty: 'ضمان سنة كاملة على الموتور + 6 شهور على الجهاز',
    image: lgWasherSale,
    description: 'غسالة إل جي أوتوماتيك بحالة ممتازة جداً، فحص واختبار كامل لجميع البرامج وسرعات العصر مع الحلة الإستانلس النقية.',
    location: 'فرع طنطا / متاح التوصيل للمنازل مع التركيب والتشغيل الفوري',
    featured: true,
    createdAt: '2026-02-26T12:00:00.000Z'
  },
  {
    id: 'sale-003',
    title: 'ديب فريزر كريازي 6 درج رأسي نوفروست ديجيتال أبيض سوبر كول',
    category: 'ديب فريزر',
    brand: 'كريازي / Kiriazi',
    model: 'E250N 6 Drawers',
    price: 8400,
    originalPrice: 15500,
    status: 'AVAILABLE',
    condition: 'مجدد بالكامل ومفحوص تجميد عميق',
    specs: [
      '6 أدراج واسعة خامة مقواة ضد الكسر',
      'خاصية النوفروست الكامل والتجميد السريع Super Freeze',
      'موتور أصلي كفاءة طاقة عالية مع شحن فريون بيور',
      'عزل حراري عالي الجودة لحفظ التجميد في انقطاع الكهرباء'
    ],
    warranty: 'ضمان 6 شهور معتمد مع فاتورة رسمية',
    image: kiriaziFreezerSale,
    description: 'ديب فريزر كريازي رأسي بحالة المصنع، تم اختباره تبريد وتجميد تحت أقصى درجات الضغط، مثالي لتخزين اللحوم والمأكولات المنزلية والتجارية.',
    location: 'فرع الزقازيق / متاح الشحن لكافة المراكز والقرى',
    featured: true,
    createdAt: '2026-02-25T14:30:00.000Z'
  },
  {
    id: 'sale-004',
    title: 'بوتاجاز يونيفرسال 5 شعلة ستانلس ستيل مقاس 60×90 أمان كامل ومروحة',
    category: 'بوتاجازات',
    brand: 'يونيفرسال / Universal',
    model: 'Diamond Pro 90x60',
    price: 5600,
    originalPrice: 10500,
    status: 'AVAILABLE',
    condition: 'مجدد فابريكا بحالة ممتازة',
    specs: [
      'مقاس 90×60 سم - 5 شعلات نحاس إيطالي سريعة الاشتعال',
      'شواية دوارة ومروحة توزيع حرارة داخل الفرن (Convection Fan)',
      'إشعال ذاتي متكامل للشعلات والفرن والشواية',
      'حوامل أواني زهر عريضة شديدة الثبات والتحمل'
    ],
    warranty: 'ضمان 6 شهور معتمد من مركز قطب',
    image: cookerStoveSale,
    description: 'بوتاجاز 5 شعلة ستانلس ستيل كامل نظيف جداً، تم تسليك وتجديد جميع الفونيات والمحابس والزجاج الحراري للفرن، جاهز للاستخدام الفوري.',
    location: 'متاح بكافة الفروع / خدمة توصيل منزلي سريعة',
    featured: false,
    createdAt: '2026-02-22T09:15:00.000Z'
  },
  {
    id: 'sale-005',
    title: 'ديب فريزر ألاسكا رأسي 5 درج أبيض مجدد بضمان المركز',
    category: 'ديب فريزر',
    brand: 'ألاسكا / Alaska',
    model: 'Alaska Upright 5D',
    price: 6900,
    originalPrice: 12500,
    status: 'RESERVED',
    condition: 'مجدد بحالة ممتازة',
    specs: [
      '5 أدراج تجميد واسعة',
      'دائرة تبريد معالجة وشحن فريون أصلي',
      'عزل فوم عالي الكثافة'
    ],
    warranty: 'ضمان 6 شهور معتمد',
    image: realAlaskaFreezer,
    description: 'ديب فريزر ألاسكا عملي وقوي جداً في التجميد، محجوز حالياً لعميل بالبحيرة (يمكنك التواصل للاستفسار عن وحدات مشابهة).',
    location: 'فرع أبو المطامير / دمنهور',
    featured: false,
    createdAt: '2026-02-20T16:00:00.000Z'
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'review-1',
    name: 'الحاج فريد النحاس',
    deviceType: 'ديب فريزر ألاسكا رأسي',
    rating: 5,
    comment: 'ديب فريزر المحل فصل فجأة وكان فيه لحوم ومجمدات هتبوظ، اتصلت بمركز قطب للحل السريع الفني جه في وقت قياسي وصلح العطل وشحن الفريون واداني ضمان معتمد. أمانة وسرعة ممتازة.',
    date: 'منذ يومين - طنطا (محافظة الغربية)',
    image: '',
    avatarLetter: 'ف',
    verified: true
  },
  {
    id: 'review-2',
    name: 'المهندس مصطفى القاضي',
    deviceType: 'غسالة سامسونج داياموند',
    rating: 5,
    comment: 'الغسالة كانت متهالكة والبارومة واكلة الصاج من تحت. مركز قطب اخدوا الشاسيه وعملوا سمكرة ودوكو وركبولها رولمان بلي، رجعت كأنها جديدة لسه طالعة من كرتونتها! خبرة الـ 30 سنة باينة في أدق التفاصيل.',
    date: 'منذ 5 أيام - دمنهور (محافظة البحيرة)',
    image: '',
    avatarLetter: 'م',
    verified: true
  },
  {
    id: 'review-3',
    name: 'أستاذ سامح عبد العال',
    deviceType: 'تجديد ثلاجة بابين دوكو فرن',
    rating: 5,
    comment: 'الثلاجة كانت مصدية ولونها أصفر متهالك والبارومة واكلاها، رجعوها لون سيلفر دوكو فرن تحفة كأنها جديدة بالظبط ومغلفة باسترتش. تسلم إيديكم يا مركز قطب.',
    date: 'منذ أسبوع - الزقازيق (محافظة الشرقية)',
    image: '',
    avatarLetter: 'س',
    verified: true
  },
  {
    id: 'review-4',
    name: 'أم عبد الرحمن',
    deviceType: 'غسالة أوتوماتيك سيلفر',
    rating: 5,
    comment: 'الغسالة كانت بتعمل صوت عالي جداً في العصر، الفني جه غير الرولمان بلي وظبط الحلة وغير طلمبة الطرد. أسعارهم معقولة جداً وتعامل محترم.',
    date: 'منذ 10 أيام - كفر الزيات (محافظة الغربية)',
    image: '',
    avatarLetter: 'ع',
    verified: true
  },
  {
    id: 'review-5',
    name: 'الحاج محمود الجمل',
    deviceType: 'ثلاجة نوفروست إنفرتر',
    rating: 5,
    comment: 'خدمة سريعة في نفس اليوم في العاشر من رمضان وقطع الغيار أصلية ومضمونة، شكراً لمركز قطب.',
    date: 'منذ أسبوعين - العاشر من رمضان (محافظة الشرقية)',
    image: '',
    avatarLetter: 'م',
    verified: true
  }
];

