import { ResearchInput, AffiliateBuildProject } from '../types/buildTypes';

export const RESEARCH_PROJECT_PRESETS: {
  id: string;
  badgeAr: string;
  summaryAr: string;
  input: ResearchInput;
}[] = [
  {
    id: 'preset-freelance-ai-workflow',
    badgeAr: 'بحث معتمد — ثقة 84/100',
    summaryAr: 'مصممين مستقلين بيفقدوا ساعات مدفوعة في المهام الإدارية المتكررة — عرض أداة أتمتة سير العمل بالذكاء الاصطناعي عبر يوتيوب.',
    input: {
      inputMethod: 'IMPORT',
      projectName: 'فانل أتمتة سير العمل للمصممين المستقلين',
      market: 'B2B Productivity & Creative Operations',
      niche: 'إدارة المشاريع وأتمتة سير العمل للمصممين المستقلين (Freelance Designers)',
      audience: 'مصممين مستقلين (UI/UX & Brand Designers) يديرون من 3 إلى 6 عملاء في نفس الوقت بدون فريق إداري.',
      primaryProblem: 'ضياع أكثر من 10 ساعات أسبوعيًا من الوقت القابل للفوترة (Billable Hours) في مهام إدارية متكررة: متابعة التعديلات، إرسال العقود، وتنظيم ملفات التسليم.',
      desiredOutcome: 'استعادة 8–10 ساعات أسبوعيًا للتصميم الفعلي أو قبول عميل إضافي بدون سهر أو فوضى في المتابعة.',
      offerCategory: 'AI Workflow & Client Portal Software (SaaS)',
      selectedOffer: 'MotionFlow Studio AI — نظام إدارة عملاء وأتمتة مهام للمصممين',
      offerUrl: 'https://example.com/motionflow-partner',
      trafficHypothesis: 'Organic YouTube (فيديوهات عملية عن تنظيم وقت المصمم وتسليم المشاريع)',
      primaryContentChannel: 'YouTube Long-form + Shorts',
      awarenessStage: 'Solution Aware',
      ctaGoal: 'تحميل قائمة مراجعة (Checklist) لتشخيص المهام القابلة للأتمتة ثم الانتقال لصفحة مقارنة عملية.',
      businessModel: 'Recurring SaaS Affiliate (عمولة شهرية مستمرة 30%)',
      currentAssets: 'قناة يوتيوب في بدايتها + حساب لينكدإن نشط، لا توجد قائمة بريدية حالية.',
      evidence: 'أكثر من 45 سؤال متكرر في مجتمعات المصممين العرب حول ضياع الوقت في تعديلات العملاء العشوائية على واتساب وإيميل.',
      researchConfidence: 84,
      strategicRisks: [
        'المصمم قد يظن أن الأداة تحتاج وقت طويل للإعداد والتعلم.',
        'وجود أدوات مجانية مثل Notion يجعل الزائر يتردد في دفع اشتراك شهري إلا لو رأى فرق الأتمتة الفعلي.'
      ],
      validationNotes: 'تم التحقق من وجود نية شراء لدى المصممين الذين يتجاوز دخلهم 1,500 دولار شهريًا لأن الساعة الواحدة لديهم ذات قيمة مالية واضحة.',
      buyerIntent: 'متوسط إلى مرتفع (يبحثون عن أنظمة جاهزة بدل بناء قوالب من الصفر)',
      audienceObjections: [
        'معنديش وقت أتعلم أداة معقدة جديدة وأنا مضغوط في تسليمات العملاء.',
        'جربت Notion وTrello قبل كده وبيرجعوا يتحولوا لفوضى بعد أسبوعين.',
        'هل الأداة تدعم إرسال روابط مراجعة سهلة للعميل بدون ما يسجل حساب؟'
      ],
      contentOpportunities: [
        'كيف تحسب تكلفة الساعة الضائعة في تعديلات العملاء على واتساب',
        'مقارنة بين إدارة العميل يدويًا على Notion وبين الأتمتة التلقائية',
        'خطوات تسليم مشروع تصميم كامل في 15 دقيقة بدل ساعتين'
      ],
      researchIntegrityStatus: 'VALIDATED RESEARCH BRIEF',
      personalExperienceConfirmed: false
    }
  },
  {
    id: 'preset-ecom-retention',
    badgeAr: 'بحث معتمد — ثقة 79/100',
    summaryAr: 'أصحاب متاجر إلكترونية يعانون من ارتفاع السلات المتروكة واعتماد كامل على الإعلانات الممولة.',
    input: {
      inputMethod: 'IMPORT',
      projectName: 'فانل استعادة السلات المتروكة للمتاجر الإلكترونية',
      market: 'E-Commerce Marketing & Retention Tools',
      niche: 'أتمتة البريد الإلكتروني والـSMS لمتاجر سلة وشوبيفاي في الخليج ومصر',
      audience: 'أصحاب متاجر إلكترونية يحققون أكثر من 150 طلب شهريًا ولكن يعتمدون بنسبة 90% على إعلانات تيك توك وميتا.',
      primaryProblem: 'ارتفاع تكلفة الاستحواذ على العميل (CAC) وضياع 70% من زوار صفحة الدفع بدون نظام متابعة آلي لاستعادة السلات المتروكة.',
      desiredOutcome: 'استعادة 12% إلى 18% من السلات المتروكة تلقائيًا عبر سلسلة رسائل ذكية بدون زيادة ميزانية الإعلانات.',
      offerCategory: 'E-Commerce Email & SMS Automation Platform',
      selectedOffer: 'Omnisend / Klaviyo Partner Program',
      offerUrl: 'https://example.com/ecom-automation-affiliate',
      trafficHypothesis: 'محتوى تعليمي ومقارنات مباشرة عبر LinkedIn وYouTube',
      primaryContentChannel: 'YouTube & LinkedIn Case Breakdowns',
      awarenessStage: 'Problem Aware',
      ctaGoal: 'حساب قيمة المبيعات الضائعة شهريًا عبر حاسبة سريعة ثم الحصول على قوالب رسائل الاستعادة.',
      businessModel: 'Recurring SaaS Affiliate',
      currentAssets: 'صفحة هبوط مبدئية فقط بدون نظام أتمتة إيميل.',
      evidence: 'شكاوى يومية في جروبات التجارة الإلكترونية من غلاء الإعلانات وضعف الربحية الصافية.',
      researchConfidence: 79,
      strategicRisks: [
        'اعتقاد صاحب المتجر أن الإيميل لا يعمل في السوق العربي مقارنة بالواتساب.',
        'الخوف من صعوبة الربط التقني مع المتجر.'
      ],
      validationNotes: 'الربط المباشر بضغطة واحدة مع شوبيفاي وسلة يقلل احتكاك التنفيذ بشكل كبير.',
      buyerIntent: 'مرتفع عند أصحاب المتاجر النشطة الذين يبحثون عن رفع هامش الربح.',
      audienceObjections: [
        'عملائي في الخليج ومصر مش بيفتحوا الإيميل أصلًا.',
        'الربط التقني وتصميم الرسائل هياخد مني وقت ومجهود.',
        'هل فيه فترة تجربة مجانية أختبر بيها العائد الأول؟'
      ],
      contentOpportunities: [
        'حاسبة الأرباح المفقودة من السلات المتروكة في متجرك',
        'لماذا تفشل رسائل التذكير التقليدية وكيف تكتب رسالة استعادة بدون خصم يحرق الربح',
        'مقارنة عملية بين أشهر 3 أدوات أتمتة للمتاجر'
      ],
      researchIntegrityStatus: 'VALIDATED RESEARCH BRIEF',
      personalExperienceConfirmed: false
    }
  },
  {
    id: 'preset-low-confidence-hypothesis',
    badgeAr: 'فرضية أولية — ثقة 38/100 (اختبار الحماية)',
    summaryAr: 'مشروع بثقة بحثية منخفضة لاختبار كيف يقوم المحرك بتقليص حجم البناء تلقائيًا ومنع التعقيد المبكر.',
    input: {
      inputMethod: 'IMPORT',
      projectName: 'فرضية اختبار أداة تلخيص محاضرات لطلاب الجامعات',
      market: 'EdTech & AI Study Tools',
      niche: 'أدوات تلخيص المحاضرات الصوتية بالذكاء الاصطناعي',
      audience: 'طلاب الجامعات في التخصصات الطبية والهندسية',
      primaryProblem: 'تراكم ساعات المحاضرات المسجلة قبل الامتحانات وضيق الوقت للمراجعة.',
      desiredOutcome: 'تحويل المحاضرة المسجلة إلى ملخص منظم وأسئلة مراجعة خلال دقائق.',
      offerCategory: 'AI Note-Taking & Study App',
      selectedOffer: 'StudyPulse AI Pro',
      offerUrl: 'https://example.com/studypulse-affiliate',
      trafficHypothesis: 'TikTok & Reels Organic',
      primaryContentChannel: 'TikTok Short Videos',
      awarenessStage: 'Problem Aware',
      ctaGoal: 'تجربة قالب أو قائمة prompts مجانية لتلخيص محاضرة واحدة.',
      businessModel: 'Low-Ticket Subscription Affiliate',
      currentAssets: 'لا توجد أصول سابقة — بداية من الصفر.',
      evidence: 'ملاحظات أولية غير مؤكدة حول استعداد الطلاب للدفع بالدولار.',
      researchConfidence: 38,
      strategicRisks: [
        'ضعف القدرة الشرائية لدى شريحة كبيرة من الطلاب أو عدم توفر بطاقات دفع دولية.',
        'توفر بدائل مجانية مثل ChatGPT العادي.'
      ],
      validationNotes: 'يحتاج إلى اختبار سريع جدًا بأقل مجهود بناء ممكن (Minimum Funnel) للتأكد من التحويل الفعلي.',
      buyerIntent: 'غير مؤكد بعد',
      audienceObjections: [
        'ليه أشترك في أداة مدفوعة وأنا ممكن أستخدم ChatGPT مجانًا؟',
        'هل الأداة تفهم المحاضرات اللي فيها عربي وإنجليزي مع بعض؟'
      ],
      contentOpportunities: [
        'طريقة تلخيص محاضرة مدتها ساعتين في 10 دقائق',
        'مقارنة بين التلخيص اليدوي والتلخيص الذكي قبل الامتحان'
      ],
      researchIntegrityStatus: 'LOW CONFIDENCE HYPOTHESIS',
      personalExperienceConfirmed: false
    }
  }
];

export const INITIAL_COMPLETE_DEMO_PROJECT: AffiliateBuildProject = {
  id: 'demo-project-v1',
  updatedAt: new Date().toISOString(),
  currentStage: 'INPUT',
  researchInput: RESEARCH_PROJECT_PRESETS[0].input,
  readiness: {
    isReady: true,
    canContinueAsHypothesis: true,
    continuedAsHypothesis: false,
    confidenceMode: 'FULL_BUILD',
    gaps: [],
    priorityFixAr: 'جميع مدخلات البحث الأساسية واضحة ومترابطة — يمكنك البدء ببناء رحلة العميل مباشرة.',
    readinessScore: 94
  },
  lockedElements: {
    audience: false,
    funnel: false,
    leadMagnet: false,
    promise: false,
    headline: false,
    mainCta: false,
    emailSequence: false
  },
  proofLibrary: [
    {
      id: 'proof-1',
      type: 'Statistic',
      title: 'متوسط الوقت الضائع في متابعة التعديلات',
      content: 'يقضي المصمم المستقل في المتوسط 9 إلى 12 ساعة أسبوعيًا في جمع الملاحظات المبعثرة بين رسائل واتساب والإيميل.',
      source: 'استبيان مجتمع المصممين المستقلين (عينة 45 مصمم)',
      verifiedByUser: true
    }
  ],
  customerJourney: {
    currentState: 'مصمم مستقل يدير 4 عملاء في وقت واحد، يعتمد على الواتساب وNotion اليدوي، ويشعر بالإرهاق من كثرة الرسائل الإدارية غير المدفوعة.',
    problemAwarenessAnalysis: 'يعرف أن وقته يضيع (Problem Aware) ويعرف وجود أدوات إدارة (Solution Aware)، لكنه يظن أن المشكلة في تنظيمه الشخصي وليس في غياب الأتمتة.',
    triggerEvent: 'تأخر تسليم مشروع مهم أو ضياع تعديل طلبه العميل وسط محادثات الواتساب الطويلة.',
    searchDiscoveryBehavior: 'يبحث في يوتيوب عن: "تنظيم وقت الفريلانسر"، "نظام إدارة عملاء التصميم"، أو "قالب Notion للمصممين".',
    contentEntryPoint: 'فيديو يوتيوب عملي يوضح لماذا تفشل القوالب اليدوية في حماية وقت المصمم وكيف تعمل الأتمتة.',
    questionInMind: 'إزاي أوقف نزيف الساعات الإدارية بدون ما أقعد أسبوع كامل أتعلم أداة معقدة؟',
    primaryObjection: 'معنديش وقت أتعلم أداة جديدة، والعملاء مش هيحبوا يدخلوا على منصة معقدة.',
    trustGap: 'يحتاج أن يرى أن التشخيص منطقي وأن الأداة مبنية خصيصًا لتقليل خطوات العميل وليس زيادتها.',
    desiredOutcome: 'استعادة 8–10 ساعات أسبوعيًا للتصميم الفعلي أو الراحة بدون فوضى تعديلات.',
    commitmentLevel: 'مستعد لتجربة خطوة سريعة مجانية (10 دقائق) لتشخيص نقاط الهدر قبل التفكير في أي اشتراك.',
    offerReadiness: 'متوسط — يحتاج أداة تشخيص سريعة (Lead Magnet) ثم صفحة مقارنة/جسر توضح الفرق بين القالب اليدوي والأتمتة.',
    purchaseFriction: 'الحاجة لنقل بيانات العملاء الحاليين + تكلفة الاشتراك الشهري.',
    decisionTrigger: 'اكتشاف أن ساعة عمل واحدة يوفرها أسبوعيًا تغطي قيمة اشتراك الأداة أكثر من 3 مرات.',
    desiredNextStep: 'تحميل قائمة الفحص المكونة من 12 نقطة لتحديد المهام الإدارية التي تسرق وقته.',
    journeySteps: [
      {
        stepOrder: 1,
        stageNameEn: 'Traffic Source',
        stageNameAr: 'مصدر الزيارات (يوتيوب)',
        visitorMindset: 'أشعر بضغط من كثرة تعديلات العملاء وضياع الوقت الإداري.',
        messageFocus: 'لماذا تسرق المهام الإدارية 10 ساعات من أسبوعك كمصمم مستقل؟',
        recommendedAction: 'الضغط على رابط قائمة الفحص في وصف الفيديو.'
      },
      {
        stepOrder: 2,
        stageNameEn: 'First Interaction',
        stageNameAr: 'التفاعل الأول (صفحة الهبوط)',
        visitorMindset: 'هل هذه القائمة ستفيدني فعلًا في حالتي أم مجرد كلام نظري؟',
        messageFocus: 'حدد في 7 دقائق أي المهام الإدارية تستهلك وقتك المدفوع ويمكن أتمتتها فورًا.',
        recommendedAction: 'إدخال البريد الإلكتروني لاستلام قائمة الـ12 نقطة.'
      },
      {
        stepOrder: 3,
        stageNameEn: 'Problem Recognition',
        stageNameAr: 'تشخيص المشكلة (الـLead Magnet)',
        visitorMindset: 'اكتشفت أن 70% من وقتي الضائع سببه غياب بوابة موحدة لمراجعة التعديلات.',
        messageFocus: 'القوالب اليدوية تطلب منك إدخال كل شيء بنفسك؛ الأتمتة تقوم بالمتابعة نيابة عنك.',
        recommendedAction: 'الانتقال لمشاهدة المقارنة العملية في صفحة الجسر (Bridge Page).'
      },
      {
        stepOrder: 4,
        stageNameEn: 'Solution Education & Trust',
        stageNameAr: 'بناء الثقة وتوضيح الحل (الإيميل + صفحة الجسر)',
        visitorMindset: 'ما الفرق الحقيقي بين Notion وبين أداة أتمتة متخصصة للمصممين؟',
        messageFocus: 'مقارنة شفافة بالخطوات والوقت المستغرق لإعداد مشروع جديد.',
        recommendedAction: 'استكشاف العرض وتجربته مجانًا على مشروع واحد.'
      },
      {
        stepOrder: 5,
        stageNameEn: 'Purchase Decision',
        stageNameAr: 'قرار التجربة / الشراء (صفحة العرض)',
        visitorMindset: 'أريد تجربة النظام على عميل واحد هذا الأسبوع لأرى النتيجة بنفسي.',
        messageFocus: 'ابدأ تجربة مجانية واختبر بوابة العميل الآلية في أقل من 15 دقيقة.',
        recommendedAction: 'التسجيل في العرض عبر رابط الأفلييت.'
      }
    ],
    awarenessEngine: [
      {
        level: 'Unaware',
        labelAr: 'غير واعي بالمشكلة (Unaware)',
        isCurrentTarget: false,
        messageFocus: 'لا تستهدف هذه الشريحة الآن؛ تحتاج تعليمًا طويلًا.',
        recommendedCta: 'غير مستهدف في الفانل الأولي',
        warningNotToSay: 'لا تعرض أداة مدفوعة لشخص لا يشعر بضغط الوقت.'
      },
      {
        level: 'Problem Aware',
        labelAr: 'واعي بالمشكلة (Problem Aware)',
        isCurrentTarget: true,
        messageFocus: 'توضيح تكلفة الساعات الإدارية الضائعة في الواتساب والإيميل.',
        recommendedCta: 'احصل على قائمة فحص الـ12 نقطة لتشخيص وقتك الضائع',
        warningNotToSay: 'لا تبدأ بشرح المميزات التقنية للبرنامج قبل تشخيص سبب الفوضى.'
      },
      {
        level: 'Solution Aware',
        labelAr: 'واعي بالحل (Solution Aware) — التركيز الأساسي',
        isCurrentTarget: true,
        messageFocus: 'لماذا القوالب اليدوية لا تحل المشكلة وكيف تعمل أتمتة سير العمل للمصممين.',
        recommendedCta: 'شاهد المقارنة العملية بين الإدارة اليدوية والأتمتة',
        warningNotToSay: 'لا تدّعِ أن الأداة ستجلب له عملاء جدد؛ ركز فقط على توفير وقت إدارة العملاء الحاليين.'
      },
      {
        level: 'Product Aware',
        labelAr: 'واعي بالمنتج (Product Aware)',
        isCurrentTarget: true,
        messageFocus: 'الرد على اعتراض صعوبة الاستخدام وتوضيح المميزات والقيود بشفافية.',
        recommendedCta: 'جرّب النظام على مشروع واحد مجانًا',
        warningNotToSay: 'لا تخفِ قيود الأداة أو تستخدم إلحاحًا زائفًا.'
      },
      {
        level: 'Most Aware',
        labelAr: 'الأكثر وعيًا (Most Aware)',
        isCurrentTarget: false,
        messageFocus: 'تذكير مباشر بخطوات البدء السريع في 15 دقيقة.',
        recommendedCta: 'ابدأ تجربتك الآن',
        warningNotToSay: 'لا تعيد شرح المشكلة من الصفر.'
      }
    ],
    messageMatchChain: [
      {
        step: 'Traffic Message',
        stepAr: 'رسالة مصدر الترافيك (يوتيوب)',
        promiseText: 'إزاي توقف ضياع 10 ساعات أسبوعيًا في متابعة تعديلات العملاء اليدوية',
        status: 'ALIGNED',
        diagnosticNote: 'تركيز واضح على مشكلة الوقت الضائع للمصمم المستقل.'
      },
      {
        step: 'Landing Page Message',
        stepAr: 'رسالة صفحة الهبوط',
        promiseText: 'قائمة فحص من 12 نقطة لتحديد المهام الإدارية التي تسرق وقتك كمصمم وكيف تؤتمتها',
        status: 'ALIGNED',
        diagnosticNote: 'امتداد مباشر لوعد الفيديو بدون تغيير الموضوع.'
      },
      {
        step: 'Lead Magnet Promise',
        stepAr: 'وعد الـLead Magnet',
        promiseText: 'تشخيص عملي في 7 دقائق لأكثر 3 مهام تستنزف ساعاتك القابلة للفوترة',
        status: 'ALIGNED',
        diagnosticNote: 'يقدم نتيجة سريعة قابلة للتطبيق تقود لاكتشاف فجوة الأتمتة.'
      },
      {
        step: 'Email Message',
        stepAr: 'رسالة سلسلة الإيميلات',
        promiseText: 'لماذا لا تكفي القوالب اليدوية وكيف تنتقل إلى سير عمل مؤتمت بالكامل',
        status: 'ALIGNED',
        diagnosticNote: 'يبني الجسر المنطقي بين التشخيص وفئة الحل.'
      },
      {
        step: 'Offer Message',
        stepAr: 'رسالة العرض (Offer)',
        promiseText: 'MotionFlow Studio AI — أتمتة متابعة العملاء والتعديلات والفواتير في مكان واحد',
        status: 'ALIGNED',
        diagnosticNote: 'العرض يحل الفجوة المتبقية بعد قائمة الفحص مباشرة.'
      }
    ],
    overallMessageMatchStatus: 'ALIGNED'
  },
  funnelStrategy: {
    evaluatedModels: [
      {
        id: 'lead-magnet-bridge-funnel',
        nameEn: 'Lead Magnet + Bridge Comparison Funnel',
        nameAr: 'فانل Lead Magnet مع صفحة جسر ومقارنة (موصى به)',
        summaryAr: 'تحويل مشاهد يوتيوب إلى مشترك عبر قائمة فحص عملية، ثم توجيهه لصفحة مقارنة شفافة تشرح لماذا تتفوق الأتمتة على القوالب اليدوية قبل إرساله للعرض.',
        badge: 'BEST STARTING MODEL',
        dimensions: {
          trafficFit: 9,
          audienceAwarenessFit: 9,
          trustRequirement: 9,
          offerComplexity: 8,
          purchaseFriction: 8,
          emailOpportunity: 10,
          implementationDifficulty: 7,
          speedToLaunch: 8,
          trackingClarity: 9,
          longTermAssetValue: 10
        },
        tradeoffsAr: 'يتطلب بناء صفحة جسر خفيفة مع سلسلة من 5 إيميلات، لكنه يبني أصلًا بريديًا ويرفع التحويل لأن العرض يحتاج قناعة قبل الاشتراك.',
        whyFitsOrFailsAr: 'مناسب جدًا لأن الجمهور Solution Aware ولديه اعتراض حول جدوى الانتقال من Notion إلى أداة مدفوعة.'
      },
      {
        id: 'direct-review-funnel',
        nameEn: 'Direct Comparison / Review Funnel',
        nameAr: 'فانل المقارنة والمراجعة المباشر',
        summaryAr: 'إرسال الزائر من الفيديو مباشرة إلى صفحة مقارنة تفصيلية بين الأدوات بدون التزام بريدي أولي.',
        badge: 'VALID ALTERNATIVE',
        dimensions: {
          trafficFit: 8,
          audienceAwarenessFit: 8,
          trustRequirement: 7,
          offerComplexity: 7,
          purchaseFriction: 6,
          emailOpportunity: 3,
          implementationDifficulty: 9,
          speedToLaunch: 9,
          trackingClarity: 8,
          longTermAssetValue: 5
        },
        tradeoffsAr: 'أسرع في الإطلاق، لكنك تفقد 90% من الزوار الذين لم يتخذوا قرار الشراء من أول جلسة.',
        whyFitsOrFailsAr: 'يصلح كاختبار سريع جدًا ولكن يفضل دمج التقاط البريد الإلكتروني لبناء متابعة.'
      },
      {
        id: 'quiz-assessment-funnel',
        nameEn: 'Interactive Assessment Quiz Funnel',
        nameAr: 'فانل اختبار تشخيصي تفاعلي (Quiz Funnel)',
        summaryAr: 'اختبار من 6 أسئلة يحسب عدد الساعات المالية الضائعة للمصمم ويوصي بالأداة.',
        badge: 'TEST LATER',
        dimensions: {
          trafficFit: 8,
          audienceAwarenessFit: 9,
          trustRequirement: 8,
          offerComplexity: 8,
          purchaseFriction: 8,
          emailOpportunity: 9,
          implementationDifficulty: 4,
          speedToLaunch: 5,
          trackingClarity: 6,
          longTermAssetValue: 8
        },
        tradeoffsAr: 'تحويله ممتاز لكنه أبطأ في البناء التقني ومراجعة المنطق للمبتدئ.',
        whyFitsOrFailsAr: 'اختبر أولًا قائمة الفحص البسيطة؛ إذا نجحت الفرضية يمكنك ترقيتها إلى Quiz تفاعلي في النسخة الثانية.'
      },
      {
        id: 'webinar-funnel',
        nameEn: 'Automated Webinar Training Funnel',
        nameAr: 'فانل ويبينار تدريبي كامل',
        summaryAr: 'محاضرة مسجلة مدتها 45 دقيقة مع سلسلة تذكيرات معقدة.',
        badge: 'TOO COMPLEX NOW',
        dimensions: {
          trafficFit: 5,
          audienceAwarenessFit: 5,
          trustRequirement: 9,
          offerComplexity: 9,
          purchaseFriction: 5,
          emailOpportunity: 7,
          implementationDifficulty: 2,
          speedToLaunch: 3,
          trackingClarity: 5,
          longTermAssetValue: 6
        },
        tradeoffsAr: 'مجهود إنتاج ضخم جدًا لعرض SaaS باشتراك شهري بسيط.',
        whyFitsOrFailsAr: 'المصمم المضغوط في الوقت لن يشاهد ويبينار 45 دقيقة لقرار أداة إنتاجية.'
      }
    ],
    primaryFunnelId: 'lead-magnet-bridge-funnel',
    secondaryFunnelId: 'direct-review-funnel',
    whyPrimaryFitsAr: 'يجمع بين سرعة تقديم قيمة عملية للمصمم (Checklist) وبين بناء علاقة بريدية تسمح بالرد على الاعتراض الرئيسي (لماذا أترك القوالب اليدوية وأستخدم أداة أتمتة).',
    mainRiskAr: 'أن تكون قائمة الفحص عامة جدًا فلا يشعر المصمم بالحاجة للانتقال إلى أداة الأتمتة.',
    whatMustBeTrueAr: 'يجب أن تكشف قائمة الفحص بوضوح عن المهام التي يستحيل أتمتتها بالقوالب الثابتة بحيث تصبح الأداة هي الخطوة المنطقية التالية.',
    doNotBuildYetAr: [
      'لا تبنِ ويبينار مسجل أو كورس مجاني متعدد الحلقات الآن.',
      'لا تكتب سلسلة من 15 إيميل قبل اختبار أول 5 إيميلات.',
      'لا تبنِ مجتمع خاص على ديسكورد أو تيليجرام في هذه المرحلة.',
      'لا تضف أكثر من Lead Magnet واحد لنفس الجمهور.'
    ],
    confirmedByStudent: true,
    funnelMapNodes: [
      {
        id: 'node-1',
        order: 1,
        nodeTitleAr: 'فيديو يوتيوب عملي (مصدر الترافيك)',
        nodeTypeEn: 'Traffic Source',
        purpose: 'جذب المصمم الذي يعاني من فوضى إدارة العملاء وتوضيح تكلفة الوقت الضائع.',
        visitorQuestion: 'ليه يومي بيخلص وأنا لسه مخلصتش شغل التصميم الأساسي؟',
        mainMessage: 'المشكلة ليست في سرعتك كمصمم بل في الساعات الإدارية غير المرئية.',
        cta: 'حمّل قائمة فحص الـ12 نقطة من الرابط في الوصف',
        trackingEvent: 'page_view'
      },
      {
        id: 'node-2',
        order: 2,
        nodeTitleAr: 'صفحة هبوط الـLead Magnet',
        nodeTypeEn: 'Landing Page',
        purpose: 'تحويل الزائر إلى مشترك بريدي مقابل أداة تشخيص سريعة ومحددة.',
        visitorQuestion: 'هل القائمة دي هتساعدني أحدد إيه اللي بيضيع وقتي بالظبط في 10 دقايق؟',
        mainMessage: 'قائمة فحص الـ12 نقطة لأتمتة سير عمل المصمم المستقل واستعادة 8 ساعات أسبوعيًا.',
        cta: 'أرسل لي قائمة الفحص مجانًا',
        trackingEvent: 'form_submitted'
      },
      {
        id: 'node-3',
        order: 3,
        nodeTitleAr: 'صفحة الشكر والتمهيد (Thank You Page)',
        nodeTypeEn: 'Thank You Page',
        purpose: 'تأكيد إرسال القائمة وتوجيه الزائر المستعد مباشرة إلى صفحة المقارنة العملية.',
        visitorQuestion: 'القائمة وصلت؟ وإيه الخطوة اللي أعملها بعد ما أعلم على المهام؟',
        mainMessage: 'تم إرسال القائمة لبريدك — شاهد الآن كيف تنتقل من الإدارة اليدوية إلى الأتمتة.',
        cta: 'شاهد مقارنة الأتمتة العملية (3 دقائق)',
        trackingEvent: 'thank_you_viewed'
      },
      {
        id: 'node-4',
        order: 4,
        nodeTitleAr: 'سلسلة المتابعة البريدية (5 إيميلات)',
        nodeTypeEn: 'Email Sequence',
        purpose: 'تسليم الأصل، تعميق الوعي بتكلفة القوالب اليدوية، ومعالجة الاعتراضات.',
        visitorQuestion: 'هل أحتاج فعلًا أداة مدفوعة ولا أكتفي بـNotion؟',
        mainMessage: 'القالب اليدوي ينظم الفوضى لكنه لا ينفذ المهام نيابة عنك.',
        cta: 'اطلع على المقارنة العملية وتجربة الأداة',
        trackingEvent: 'email_clicked'
      },
      {
        id: 'node-5',
        order: 5,
        nodeTitleAr: 'صفحة الجسر والمقارنة (Bridge Page)',
        nodeTypeEn: 'Bridge Page',
        purpose: 'ربط الفجوة التي كشفتها قائمة الفحص بالحل العملي في العرض بشفافية.',
        visitorQuestion: 'هل MotionFlow Studio يناسب طريقة شغلي وهل إعداده سهل؟',
        mainMessage: 'مراجعة شفافة: متى يناسبك MotionFlow Studio ومتى لا تحتاجه.',
        cta: 'ابدأ التجربة المجانية على مشروعك القادم',
        trackingEvent: 'bridge_page_viewed'
      },
      {
        id: 'node-6',
        order: 6,
        nodeTitleAr: 'صفحة العرض الرسمي (Affiliate Offer)',
        nodeTypeEn: 'Affiliate Offer',
        purpose: 'إتمام التسجيل في التجربة المجانية أو الاشتراك عبر رابط الأفلييت.',
        visitorQuestion: 'كيف أبدأ تجربة الأداة الآن بدون مخاطرة؟',
        mainMessage: 'أنشئ بوابة عميلك الأول في 15 دقيقة.',
        cta: 'Start Free Trial',
        trackingEvent: 'affiliate_link_clicked'
      }
    ],
    minimumViableFunnel: {
      minimumBuild: [
        'قائمة فحص عملية من صفحتين (Checklist) بصيغة واضحة ومباشرة.',
        'صفحة هبوط واحدة مركزة (Landing Page) لطلب القائمة.',
        'صفحة شكر (Thank You Page) تسلم الرابط وتمهد لصفحة الجسر.',
        'صفحة جسر ومقارنة (Bridge Page) تشرح لماذا وكيف تستخدم الأداة بشفافية.',
        'سلسلة مركزة من 5 إيميلات فقط (تسليم + تعليم + معالجة اعتراض + انتقال للعرض).'
      ],
      optionalLater: [
        'إضافة فيديو قصير 3 دقائق داخل صفحة الجسر يشرح لوحة التحكم.',
        'إضافة مسار إعادة استهداف لمن فتح الإيميل ولم يضغط على رابط المقارنة.'
      ],
      scaleVersion: [
        'بناء حاسبة تفاعلية لحساب قيمة الساعات الضائعة بالدولار.',
        'تقسيم المشتركين حسب عدد العملاء الشهري (1-2 عميل مقابل +4 عملاء).'
      ],
      overbuildWarningAr: 'تحذير ضد المبالغة في البناء: لا تبدأ ببناء 10 صفحات أو 20 إيميل قبل التأكد من أن الزوار يحملون قائمة الفحص ويضغطون على صفحة المقارنة.'
    }
  },
  leadMagnet: {
    concepts: [
      {
        id: 'lm-checklist-12',
        titleAr: 'قائمة فحص الـ12 نقطة لأتمتة سير عمل المصمم المستقل (The 12-Point AI Workflow Checklist)',
        formatEn: 'Checklist',
        formatAr: 'قائمة فحص تشخيصية (Checklist)',
        coreIdeaAr: 'قائمة عملية يقيم بها المصمم 12 مهمة متكررة في رحلة العميل (من العرض المالي حتى التسليم النهائي) ليحدد أيها يسرق وقته ويمكن أتمتته.',
        promiseAr: 'حدد في 7 دقائق المهام الإدارية التي تسرق منك 8–10 ساعات أسبوعيًا وكيف تحولها لمسار تلقائي.',
        scores: {
          problemRelevance: 10,
          speedToValue: 9,
          specificity: 9,
          desiredOutcomeFit: 9,
          leadToOfferBridge: 10,
          perceivedValue: 8,
          easeOfConsumption: 10,
          easeOfCreation: 9,
          differentiation: 8,
          trafficFit: 9
        },
        highlightTag: 'Best Strategic Bridge',
        whyDifferentAr: 'ليست كتابًا نظريًا طويلًا؛ تمنح المصمم تشخيصًا فوريًا يظهر له بالضبط أين تقف القوالب اليدوية عاجزة.'
      },
      {
        id: 'lm-hour-calculator',
        titleAr: 'حاسبة تكلفة التعديلات العشوائية للمصمم المستقل',
        formatEn: 'Calculator / Spreadsheet',
        formatAr: 'جدول حسابي سريع (Spreadsheet Calculator)',
        coreIdeaAr: 'شيت يحسب للمصمم كم دولارًا يخسره شهريًا بسبب ساعات المتابعة غير المفوترة.',
        promiseAr: 'احسب في 3 دقائق القيمة المالية الحقيقية للساعات الإدارية المهدرة في مشاريعك الحالية.',
        scores: {
          problemRelevance: 9,
          speedToValue: 9,
          specificity: 9,
          desiredOutcomeFit: 8,
          leadToOfferBridge: 8,
          perceivedValue: 9,
          easeOfConsumption: 8,
          easeOfCreation: 7,
          differentiation: 9,
          trafficFit: 8
        },
        highlightTag: 'Strongest Concept',
        whyDifferentAr: 'يحول المشكلة من شعور بالإرهاق إلى رقم مالي واضح يبرر الاستثمار في أداة.'
      },
      {
        id: 'lm-onboarding-swipe',
        titleAr: 'قوالب رسائل استلام المشاريع وتحديد التعديلات (Swipe File)',
        formatEn: 'Swipe File',
        formatAr: 'ملف قوالب جاهزة للنسخ (Swipe File)',
        coreIdeaAr: '5 رسائل جاهزة لضبط حدود التعديلات مع العميل منذ اليوم الأول.',
        promiseAr: 'انسخ 5 رسائل مجربة لتنظيم طلبات العميل وتقليل التعديلات العشوائية.',
        scores: {
          problemRelevance: 8,
          speedToValue: 10,
          specificity: 8,
          desiredOutcomeFit: 7,
          leadToOfferBridge: 6,
          perceivedValue: 8,
          easeOfConsumption: 10,
          easeOfCreation: 10,
          differentiation: 6,
          trafficFit: 9
        },
        highlightTag: 'Easiest Concept',
        whyDifferentAr: 'سريع جدًا في الإنشاء والاستهلاك، لكن جسره نحو أداة الأتمتة أضعف قليلًا من قائمة الفحص.'
      },
      {
        id: 'lm-comparison-matrix',
        titleAr: 'دليل مقارنة أنظمة إدارة العملاء للمصممين: Notion مقابل الأتمتة الذكية',
        formatEn: 'Comparison Guide',
        formatAr: 'مصفوفة مقارنة (Comparison Matrix)',
        coreIdeaAr: 'مقارنة معيارية بالوقت والخطوات بين الإدارة اليدوية وأدوات الأتمتة.',
        promiseAr: 'اعرف متى يكفيك Notion المجاني ومتى تحتاج نظام أتمتة مخصص للمصممين.',
        scores: {
          problemRelevance: 9,
          speedToValue: 8,
          specificity: 9,
          desiredOutcomeFit: 9,
          leadToOfferBridge: 10,
          perceivedValue: 8,
          easeOfConsumption: 8,
          easeOfCreation: 8,
          differentiation: 8,
          trafficFit: 8
        },
        highlightTag: 'Best Conversion Hypothesis',
        whyDifferentAr: 'ممتاز للزوار القريبين جدًا من قرار الشراء.'
      },
      {
        id: 'lm-client-portal-template',
        titleAr: 'هيكل بوابة تسليم العميل في 15 دقيقة (Decision Framework)',
        formatEn: 'Decision Framework',
        formatAr: 'إطار عمل تطبيقي (Framework)',
        coreIdeaAr: 'خريطة من صفحة واحدة لتوحيد مكان العقود والتعديلات والملفات.',
        promiseAr: 'رتّب رحلة عميلك من الموافقة على العرض حتى استلام الدفعة النهائية في صفحة واحدة.',
        scores: {
          problemRelevance: 9,
          speedToValue: 8,
          specificity: 8,
          desiredOutcomeFit: 9,
          leadToOfferBridge: 9,
          perceivedValue: 8,
          easeOfConsumption: 9,
          easeOfCreation: 8,
          differentiation: 7,
          trafficFit: 8
        },
        whyDifferentAr: 'يركز على البنية التحتية لرحلة العميل.'
      }
    ],
    selectedConceptId: 'lm-checklist-12',
    confirmedByStudent: true,
    promiseStatement: {
      specificProblem: 'ضياع ساعات العمل القابلة للفوترة في متابعة التعديلات والملفات والعقود يدويًا.',
      usefulOutcome: 'تحديد المهام الإدارية التي تستهلك وقتك وترتيب أولويات أتمتتها خطوة بخطوة.',
      reasonableTimeEffort: 'تطبيق التشخيص في 7 دقائق فقط بدون تعقيد تقني.',
      fullPromiseAr: 'قائمة فحص عملية من 12 نقطة تساعد المصمم المستقل على تشخيص المهام الإدارية المتكررة التي تسرق ساعاته المدفوعة، وتحديد ما يمكن أتمتته خلال 7 دقائق.',
      status: 'APPROVED'
    },
    contentArchitecture: {
      formatType: 'Interactive / Printable Checklist',
      sections: [
        {
          sectionNameAr: '1. الغلاف والافتتاحية السريعة (Opening & Context)',
          sectionRoleEn: 'Cover & Context',
          detailsAr: 'توضيح الهدف من القائمة: كيف تفرق بين وقت الإبداع المدفوع ووقت الإدارة غير المرئي.',
          actionableItems: [
            'قاعدة الساعة الضائعة: كيف تحسب تكلفة 10 ساعات إدارية أسبوعيًا.',
            'طريقة استخدام القائمة في 7 دقائق (أحمر = يدوي بالكامل، أصفر = شبه منظم، أخضر = مؤتمت).'
          ]
        },
        {
          sectionNameAr: '2. المرحلة الأولى: ما قبل بدء المشروع (Onboarding & Contracts)',
          sectionRoleEn: 'Stage 1 Checklist',
          detailsAr: 'فحص 4 مهام أساسية عند دخول عميل جديد.',
          actionableItems: [
            'نقطة 1: إرسال عرض السعر والعقد وتوقيعه إلكترونيًا بدون طباعة أو مسح ضوئي.',
            'نقطة 2: تحصيل دفعة البداية تلقائيًا فور توقيع العقد.',
            'نقطة 3: استبيان استلام المتطلبات (Creative Brief) الموحد بدل الأسئلة المتفرقة.',
            'نقطة 4: إنشاء مجلدات المشروع وجدول التسليمات تلقائيًا.'
          ]
        },
        {
          sectionNameAr: '3. المرحلة الثانية: إدارة التعديلات والمراجعات (Feedback Loop)',
          sectionRoleEn: 'Stage 2 Checklist',
          detailsAr: 'أخطر منطقة تستنزف وقت المصمم في واتساب.',
          actionableItems: [
            'نقطة 5: جمع ملاحظات العميل في رابط مراجعة واحد بدل الرسائل الصوتية المتفرقة.',
            'نقطة 6: ربط كل جولة تعديلات بعدد الجولات المتفق عليها في العقد تلقائيًا.',
            'نقطة 7: إشعارات تلقائية للعميل عند تأخر رده لأكثر من 48 ساعة.',
            'نقطة 8: توثيق الموافقة على النسخة قبل الانتقال للمرحلة التالية.'
          ]
        },
        {
          sectionNameAr: '4. المرحلة الثالثة: التسليم النهائي والفوترة (Offboarding)',
          sectionRoleEn: 'Stage 3 Checklist',
          detailsAr: 'إغلاق المشروع بسلاسة بدون مطاردة الفواتير.',
          actionableItems: [
            'نقطة 9: ربط تسليم الملفات المصدرية بسداد الدفعة النهائية تلقائيًا.',
            'نقطة 10: إرسال رسالة شكر وطلب تقييم (Testimonial) مجدولة تلقائيًا.',
            'نقطة 11: أرشفة المشروع وبياناته بنقرة واحدة.',
            'نقطة 12: تذكير دوري للعميل بعد 60 يومًا لعرض خدمات إضافية.'
          ]
        },
        {
          sectionNameAr: '5. تفسير النتيجة والخطوة التالية (Interpretation & Next Step)',
          sectionRoleEn: 'Bridge & CTA',
          detailsAr: 'ربط نتيجة الفحص بالحل المنطقي.',
          actionableItems: [
            'إذا كان لديك أكثر من 5 نقاط باللون الأحمر، فالمشكلة ليست في التنظيم الشخصي بل في غياب نظام الأتمتة.',
            'دعوة لمشاهدة المقارنة العملية في صفحة الجسر: كيف تجمع هذه النقاط الـ12 في نظام واحد.'
          ]
        }
      ],
      ctaInsideAsset: 'شاهد المقارنة العملية: كيف تؤتمت النقاط الـ12 في أقل من 15 دقيقة عبر MotionFlow Studio'
    },
    offerBridge: {
      leadMagnetProblem: 'المصمم لا يعرف بالضبط أين تتسرب ساعات عمله الأسبوعية وسط زحمة العملاء.',
      insightDelivered: 'القائمة تكشف أن 80% من الوقت الضائع يتركز في متابعة التعديلات وتحصيل الموافقات يدويًا.',
      remainingGap: 'معرفة نقاط الهدر لا تكفي وحدها؛ بناء هذا النظام يدويًا على Notion يحتاج ربط عشرات الأدوات الخارجية.',
      solutionCategory: 'بوابة عملاء ونظام أتمتة سير عمل متكامل للمصممين (AI Client Workflow Portal).',
      offerConnection: 'MotionFlow Studio AI يقدم هذه النقاط الـ12 جاهزة ومؤتمتة في مكان واحد بدون إعداد تقني معقد.'
    }
  },
  pages: {
    pagePurposeMap: [
      {
        id: 'page-optin',
        pageNameEn: 'Landing / Opt-In Page',
        pageNameAr: 'صفحة هبوط قائمة الفحص (Landing Page)',
        requiredNow: true,
        purpose: 'تحويل مشاهد الفيديو المهتم إلى مشترك بريدي عبر تقديم قائمة فحص الـ12 نقطة.',
        trafficSource: 'YouTube Organic',
        visitorAwareness: 'Problem / Solution Aware',
        mainQuestion: 'هل القائمة دي عملية وهتساعدني فعلًا أوفر وقتي كمصمم؟',
        primaryMessage: 'شخّص في 7 دقائق المهام الإدارية التي تسرق ساعاتك القابلة للفوترة.',
        mainCta: 'أرسل لي قائمة الفحص مجانًا',
        secondaryCta: 'لا يوجد — هدف واحد فقط لمنع التشتيت',
        objectionHandled: 'القائمة مختصرة في صفحتين عمليتين ولا تحتاج قراءة كتاب طويل.',
        trustElement: 'معاينة واضحة للمراحل الثلاث داخل القائمة + بيانات بحثية من مجتمع المصممين.',
        nextDestination: 'صفحة الشكر والتمهيد (Thank You Page)',
        trackingEvent: 'form_submitted'
      },
      {
        id: 'page-thankyou',
        pageNameEn: 'Thank You Page',
        pageNameAr: 'صفحة الشكر والخطوة التالية (Thank You Page)',
        requiredNow: true,
        purpose: 'تأكيد وصول القائمة للبريد وتوجيه الزائر المستعد مباشرة إلى صفحة المقارنة العملية.',
        trafficSource: 'Direct from Opt-In Form',
        visitorAwareness: 'Solution Aware',
        mainQuestion: 'وصلت القائمة؟ وإزاي أطبق الأتمتة على النقاط الحمراء اللي هتطلع لي؟',
        primaryMessage: 'تم إرسال القائمة لبريدك — وإليك كيف تطبق الأتمتة عمليًا بدون تعقيد.',
        mainCta: 'شاهد مقارنة الأتمتة العملية الآن',
        secondaryCta: 'افتح بريدك الإلكتروني لتحميل ملف الـPDF',
        objectionHandled: 'ماذا أفعل بعد اكتشاف نقاط الهدر في سير عملي؟',
        trustElement: 'تعليمات واضحة بدون وعود مبالغ فيها.',
        nextDestination: 'صفحة الجسر والمقارنة (Bridge Page)',
        trackingEvent: 'thank_you_viewed'
      },
      {
        id: 'page-bridge',
        pageNameEn: 'Bridge & Comparison Page',
        pageNameAr: 'صفحة الجسر والمقارنة الشفافة (Bridge Page)',
        requiredNow: true,
        purpose: 'ربط الفجوة التي كشفتها قائمة الفحص بالحل العملي (MotionFlow Studio AI) مع الحفاظ على شفافية الأفلييت.',
        trafficSource: 'Thank You Page & Email Sequence',
        visitorAwareness: 'Solution to Product Aware',
        mainQuestion: 'ليه أستخدم MotionFlow Studio بدل ما أكمل على Notion والواتساب؟',
        primaryMessage: 'مقارنة عملية بالخطوات والوقت: الإدارة اليدوية مقابل الأتمتة المتخصصة للمصممين.',
        mainCta: 'جرّب MotionFlow Studio مجانًا على مشروع واحد',
        secondaryCta: 'راجع جدول المقارنة التفصيلي',
        objectionHandled: 'هل يحتاج النظام وقتًا طويلًا للتعلم أو يربك العميل؟',
        trustElement: 'ذكر المميزات والقيود بوضوح + إفصاح أفلييت صريح وشفاف.',
        nextDestination: 'صفحة العرض الرسمي (Affiliate Offer Page)',
        trackingEvent: 'affiliate_link_clicked'
      }
    ],
    headlineOptions: [
      {
        id: 'hl-1',
        angleEn: 'Specificity + Outcome',
        angleAr: 'التحديد + النتيجة العملية',
        headlineAr: 'قائمة فحص من 12 نقطة للمصمم المستقل: اكتشف في 7 دقائق أين تضيع ساعاتك المدفوعة في متابعة العملاء',
        clarityScore: 10,
        relevanceScore: 10,
        specificityScore: 9,
        messageMatchScore: 10,
        credibilityScore: 9,
        isRecommended: true
      },
      {
        id: 'hl-2',
        angleEn: 'Problem Recognition',
        angleAr: 'ملامسة المشكلة اليومية',
        headlineAr: 'لماذا ينتهي أسبوعك وأنت مرهق من رسائل التعديلات؟ شخّص نقاط الهدر في سير عملك كمصمم عبر هذه القائمة العملية',
        clarityScore: 9,
        relevanceScore: 9,
        specificityScore: 8,
        messageMatchScore: 9,
        credibilityScore: 9,
        isRecommended: true
      },
      {
        id: 'hl-3',
        angleEn: 'Decision Framework',
        angleAr: 'إطار القرار والمقارنة',
        headlineAr: 'قبل أن تبدأ مشروعك القادم: افحص الـ12 مهمة التي تفصل بين المصمم المرهق إداريًا والمصمم المؤتمت',
        clarityScore: 9,
        relevanceScore: 9,
        specificityScore: 8,
        messageMatchScore: 9,
        credibilityScore: 9,
        isRecommended: true
      },
      {
        id: 'hl-4',
        angleEn: 'Avoidance',
        angleAr: 'تجنب الاستنزاف',
        headlineAr: 'توقف عن إدارة تعديلات العملاء عبر محادثات واتساب المبعثرة — راجع قائمة أتمتة سير العمل للمصممين',
        clarityScore: 9,
        relevanceScore: 8,
        specificityScore: 8,
        messageMatchScore: 8,
        credibilityScore: 9,
        isRecommended: false
      },
      {
        id: 'hl-5',
        angleEn: 'Speed to Value',
        angleAr: 'سرعة الوصول للقيمة',
        headlineAr: 'في 7 دقائق فقط: حدد المهام الإدارية التي يمكنك أتمتتها هذا الأسبوع لاستعادة وقت التصميم الفعلي',
        clarityScore: 8,
        relevanceScore: 9,
        specificityScore: 8,
        messageMatchScore: 8,
        credibilityScore: 8,
        isRecommended: false
      },
      {
        id: 'hl-6',
        angleEn: 'Mistake Angle',
        angleAr: 'زاوية الخطأ الشائع',
        headlineAr: 'الخطأ الإداري الذي يلتهم ربحية المصمم المستقل عند التعامل مع أكثر من 3 عملاء في نفس الوقت',
        clarityScore: 8,
        relevanceScore: 8,
        specificityScore: 7,
        messageMatchScore: 8,
        credibilityScore: 9,
        isRecommended: false
      },
      {
        id: 'hl-7',
        angleEn: 'Comparison Angle',
        angleAr: 'زاوية المقارنة',
        headlineAr: 'القوالب اليدوية مقابل الأتمتة: قائمة فحص لتقييم جاهزية نظام إدارة العملاء لديك كمصمم',
        clarityScore: 8,
        relevanceScore: 8,
        specificityScore: 8,
        messageMatchScore: 9,
        credibilityScore: 9,
        isRecommended: false
      },
      {
        id: 'hl-8',
        angleEn: 'Outcome Angle',
        angleAr: 'زاوية النتيجة المباشرة',
        headlineAr: 'كيف تحول استلام المشاريع ومراجعة التعديلات وتسليم الملفات إلى مسار منظم وواضح',
        clarityScore: 8,
        relevanceScore: 8,
        specificityScore: 7,
        messageMatchScore: 8,
        credibilityScore: 9,
        isRecommended: false
      },
      {
        id: 'hl-9',
        angleEn: 'Curiosity',
        angleAr: 'الفضول المنطقي',
        headlineAr: 'كم ساعة غير مدفوعة قضيتها هذا الشهر في مهام لا علاقة لها بالتصميم؟ افحص سير عملك الآن',
        clarityScore: 8,
        relevanceScore: 9,
        specificityScore: 7,
        messageMatchScore: 8,
        credibilityScore: 9,
        isRecommended: false
      },
      {
        id: 'hl-10',
        angleEn: 'Framework Angle',
        angleAr: 'زاوية النظام العملي',
        headlineAr: 'نظام الـ3 مراحل لتقييم وأتمتة رحلة العميل للمصممين المستقلين (Contract → Feedback → Delivery)',
        clarityScore: 9,
        relevanceScore: 8,
        specificityScore: 9,
        messageMatchScore: 8,
        credibilityScore: 9,
        isRecommended: false
      }
    ],
    landingPage: {
      selectedHeadlineId: 'hl-1',
      headlineAr: 'قائمة فحص من 12 نقطة للمصمم المستقل: اكتشف في 7 دقائق أين تضيع ساعاتك المدفوعة في متابعة العملاء',
      subheadlineAr: 'أداة تشخيص سريعة ومجانية تساعدك على تحديد المهام الإدارية المتكررة (العقود، جمع التعديلات، الفواتير) التي يمكنك أتمتتها بدل إدارتها يدويًا على واتساب وإيميل.',
      supportingCopyAr: 'معظم المصممين المستقلين لا يعانون من نقص المهارة في التصميم، بل من استنزاف طاقتهم في مهام إدارية غير مدفوعة تتكرر مع كل عميل جديد. صممنا قائمة الفحص هذه لتمنحك رؤية واضحة في أقل من 7 دقائق حول نقاط الاختناق في سير عملك الحالي.',
      whatYouGetBullets: [
        'فحص المرحلة الأولى (Onboarding): 4 نقاط لضبط العقود والـBrief والدفعة المقدمة بدون مراسلات يدوية طويلة.',
        'فحص المرحلة الثانية (Feedback Loop): 4 نقاط لتوحيد تعليقات العميل ومنع فوضى التعديلات المفتوحة.',
        'فحص المرحلة الثالثة (Delivery & Offboarding): 4 نقاط لربط تسليم الملفات النهائية بسداد الفواتير تلقائيًا.',
        'مؤشر تشخيص فوري يوضح لك أي المهام يجب أتمتتها أولًا لتوفير أكبر قدر من الساعات الأسبوعية.'
      ],
      whyItMattersAr: 'كل ساعة توفرها من المتابعة الإدارية هي ساعة يمكنك تخصيصها لمشروع مدفوع جديد أو للراحة الذهنية بدون قلق من نسيان تعديل طلبه العميل.',
      whoItIsForAr: [
        'مصممو UI/UX والهوية البصرية المستقلون الذين يديرون من 2 إلى 6 عملاء شهريًا.',
        'من يشعر أن قوالب Notion أو Trello اليدوية تتحول إلى عبء إضافي وقت ضغط التسليمات.'
      ],
      whoItIsNotForAr: [
        'من يبحث عن كورس لتعلم أساسيات التصميم الجرافيكي من الصفر.',
        'الشركات الضخمة التي لديها فريق كامل من مديري المشاريع (Account Managers).'
      ],
      credibilityPlaceholderAr: '[أضف هنا دليلًا موثقًا أو اقتباسًا حقيقيًا من مصمم بعد تجربة القائمة — لا تختلق تقييمات وهمية]',
      ctaButtonTextAr: 'أرسل لي قائمة الفحص مجانًا الآن',
      privacyMicrocopyAr: 'مجاني 100% — سنرسل لك القائمة فورًا لبريدك، ويمكنك إلغاء الاشتراك بنقرة واحدة في أي وقت.',
      objectionHandlingAr: [
        {
          objection: 'هل القائمة طويلة وتحتاج وقتًا لقراءتها؟',
          response: 'لا، القائمة مصممة في صفحتين عمليتين فقط، ويمكنك المرور على النقاط الـ12 في 7 دقائق.'
        },
        {
          objection: 'هل أحتاج خبرة تقنية في البرمجة أو الأتمتة؟',
          response: 'إطلاقًا، القائمة تركز على تشخيص خطوات العمل اليومية بلغة بسيطة وواضحة للمصمم.'
        }
      ],
      faqItems: [
        {
          question: 'كيف سأستلم قائمة الفحص؟',
          answer: 'بمجرد إدخال بريدك الإلكتروني ستصلك رسالة فورية تحتوي على رابط مباشر لقائمة الفحص.'
        },
        {
          question: 'هل تناسب القائمة المصمم الذي يعمل بمفرده؟',
          answer: 'نعم، تم تصميمها خصيصًا للمصمم المستقل (Solo Freelancer) الذي يقوم بدور المصمم ومدير المشروع في نفس الوقت.'
        }
      ],
      mobileNotesAr: [
        'إبقاء العنوان الرئيسي وزر الـCTA ونموذج البريد فوق خط الطي (Above the Fold) على شاشات الموبايل.',
        'استخدام حقل إدخال واحد أو حقلين كحد أقصى (الاسم الاختياري + البريد الإلكتروني) لتقليل الاحتكاك.'
      ],
      status: 'APPROVED'
    },
    thankYouPage: {
      primaryObjectiveAr: 'تأكيد إرسال القائمة وتوجيه الزائر المستعد مباشرة لمشاهدة مقارنة الأتمتة في صفحة الجسر.',
      deliveryInstructionAr: 'تم إرسال "قائمة فحص الـ12 نقطة" إلى بريدك الإلكتروني الآن (ستصل خلال دقيقة واحدة).',
      expectationSettingAr: 'افتح القائمة وحدد النقاط التي تديرها يدويًا حاليًا باللون الأحمر.',
      microCommitmentAskAr: 'تأكد من نقل رسالتنا إلى البريد الأساسي (Primary) حتى تصلك أمثلة تطبيق الأتمتة خلال الأيام القادمة.',
      offerPreFrameAr: 'إذا وجدت أن لديك أكثر من 4 مهام يدوية تستهلك وقتك، فقد أعددنا لك صفحة مقارنة عملية توضح كيف تجمع هذه الخطوات في نظام واحد مؤتمت.',
      whitelistInstructionAr: 'ابحث عن رسالة بعنوان: "[قائمة الفحص بالداخل] 12 نقطة لتشخيص سير عملك كمصمم".',
      nextStepCtaAr: 'شاهد المقارنة العملية: الإدارة اليدوية مقابل الأتمتة (Bridge Page)',
      status: 'APPROVED'
    },
    bridgePage: {
      isStrategicallyRequired: true,
      problemRecapAr: 'بعد مراجعة قائمة الـ12 نقطة، يلاحظ أغلب المصممين أن المشكلة الحقيقية ليست في غياب القوالب، بل في أن القوالب اليدوية تنتظر منك تحديث كل خطوة بنفسك.',
      whatToLookForAr: 'أي نظام أتمتة تختاره كمصمم يجب أن يحقق 3 شروط: (1) بوابة عميل لا تطلب من العميل تسجيل حساب معقد، (2) ربط تلقائي بين العقد والفاتورة والتسليم، (3) إعداد سريع في أقل من ساعة.',
      whySolutionCategoryMattersAr: 'الانتقال من أدوات الملاحظات العامة إلى نظام إدارة عملاء مؤتمت يختصر رسائل المتابعة المتكررة ويحمي حدود التعديلات تلقائيًا.',
      productIntroductionAr: 'لهذا السبب نوصي باستكشاف فئة أنظمة الأتمتة المخصصة للمصممين مثل MotionFlow Studio AI، الذي يدمج العقود ومراجعة التعديلات والفواتير في مسار واحد.',
      pros: [
        'يوفر بوابة مراجعة مباشرة للعميل عبر رابط واحد بدون تعقيد.',
        'يربط تسليم الملفات النهائية بسداد الفاتورة تلقائيًا.',
        'قوالب سير عمل جاهزة للمصممين تقلل وقت الإعداد الأولي.'
      ],
      potentialLimitations: [
        'واجهة النظام باللغة الإنجليزية (رغم دعم كتابة المحتوى والعقود بالعربية).',
        'قد لا يكون ضروريًا للمصمم المبتدئ الذي يتعامل مع عميل واحد كل شهرين.'
      ],
      whoItSuitsAr: [
        'المصمم المستقل الذي يدير عدة مشاريع متزامنة ويريد استعادة 8–10 ساعات أسبوعيًا.',
        'من يريد تقديم تجربة احترافية منظمة لعملائه تبرر رفع أسعاره.'
      ],
      whoItMayNotSuitAr: [
        'من لا يزال في مرحلة البحث عن أول عميل له في العمل الحر.',
        'من يفضل إدارة كل شيء يدويًا ولا يمانع قضاء ساعات في المراسلات.'
      ],
      ctaTextAr: 'استكشف MotionFlow Studio AI وابدأ التجربة المجانية',
      affiliateDisclosureAr: 'إفصاح شفاف: قد أحصل على عمولة إذا اشتركت من خلال الروابط الموجودة في هذه الصفحة بدون أي تكلفة إضافية عليك. نحن نوصي بالأداة بناءً على ملاءمتها لحل مشكلة أتمتة سير العمل المشروحة أعلاه.',
      status: 'APPROVED'
    },
    reviewComparisonPage: {
      isIncluded: true,
      pageType: 'X vs Y Page',
      decisionCriteria: [
        'الوقت المستغرق لإعداد مشروع عميل جديد',
        'سهولة مراجعة التعديلات بالنسبة للعميل',
        'الربط التلقائي بين العقد والفاتورة والتسليم',
        'التكلفة مقابل الساعات القابلة للفوترة التي يتم توفيرها'
      ],
      featureComparisonRows: [
        {
          feature: 'إنشاء عقد وفاتورة وبوابة مشروع',
          offerNote: 'تلقائي في خطوة واحدة (أقل من 5 دقائق)',
          alternativeNote: 'يدوي عبر 3 أدوات منفصلة (30–45 دقيقة)'
        },
        {
          feature: 'متابعة التعديلات والموافقات',
          offerNote: 'مرتبطة بعدد الجولات المتفق عليها مع تذكير آلي',
          alternativeNote: 'مبعثرة في رسائل واتساب وتحتاج متابعة يدوية'
        },
        {
          feature: 'تسليم الملفات النهائية',
          offerNote: 'يُفتح تلقائيًا فور تأكيد الدفعة النهائية',
          alternativeNote: 'يتطلب مراجعة بنكية وإرسال روابط يدويًا'
        }
      ],
      useCasesAr: [
        'إدارة مشاريع تصميم الهوية البصرية متعددة المراحل',
        'مشاريع تصميم واجهات المستخدم (UI/UX) التي تتطلب موافقات متتالية'
      ],
      limitationsAr: [
        'يتطلب اشتراكًا شهريًا بعد انتهاء الفترة التجريبية (تحقق من السعر الحالي في الموقع الرسمي).'
      ],
      pricingVerificationNoteAr: 'ملاحظة تسعير: راجع صفحة الأسعار الرسمية للعرض للتأكد من الباقة الحالية وتفاصيل الفترة التجريبية.',
      affiliateDisclosureAr: 'قد أحصل على عمولة عند الاشتراك عبر الرابط بدون أي تكلفة إضافية عليك.',
      ctaAr: 'قارن الباقات وجرّب النظام مجانًا على مشروعك القادم'
    },
    claimsAudit: [
      {
        id: 'claim-1',
        sourceLocation: 'صفحة الهبوط — العنوان الرئيسي',
        claimText: 'اكتشف في 7 دقائق أين تضيع ساعاتك المدفوعة في متابعة العملاء',
        classification: 'MARKETING POSITION',
        warningOrFixAr: 'وعد زمني معقول ومرتبط بطول القائمة (12 نقطة). آمن للاستخدام.',
        isSafe: true
      },
      {
        id: 'claim-2',
        sourceLocation: 'المدخلات البحثية — الإحصائية',
        claimText: 'يقضي المصمم المستقل في المتوسط 9 إلى 12 ساعة أسبوعيًا في جمع الملاحظات المبعثرة',
        classification: 'USER-PROVIDED FACT',
        warningOrFixAr: 'مرتبط بمكتبة الإثبات (استبيان مجتمع المصممين). اذكر المصدر عند الاستخدام.',
        isSafe: true
      }
    ]
  },
  emailSystem: {
    strategy: {
      whyUserJoined: 'حمّل قائمة فحص الـ12 نقطة ليعرف أين يضيع وقته في إدارة العملاء.',
      whatTheyAlreadyKnow: 'يعرف أنه يفقد ساعات أسبوعية في المراسلات والتعديلات.',
      whatTheyNeedToBelieve: 'أن القوالب اليدوية الثابتة لا تكفي لأنها لا تنفذ المتابعة التلقائية، وأن إعداد أداة أتمتة متخصصة أسهل وأسرع مما يتخيل.',
      mainObjections: [
        'معنديش وقت أتعلم أداة جديدة.',
        'أستخدم Notion حاليًا ومش عايز أدفع اشتراك شهري إضافي.',
        'أخاف أن يجد العميل صعوبة في استخدام البوابة.'
      ],
      trustGap: 'يحتاج أمثلة واقعية وشفافية حول متى تفيده الأداة ومتى لا يحتاجها.',
      offerReadiness: 'جاهز لاستكشاف العرض بعد الإيميل الثالث والرابع.',
      desiredBehavior: 'الضغط على صفحة الجسر/المقارنة ثم بدء التجربة المجانية للعرض.',
      recommendedEmailCount: 5,
      lengthRationaleAr: 'اخترنا 5 إيميلات فقط لأن العرض عبارة عن أداة SaaS بتجربة مجانية واضحة، والجمهور Solution Aware؛ الإطالة إلى 10 أو 14 إيميل ستؤدي لملل المشترك وتأخير الاختبار.'
    },
    journeyStepsUsed: [
      'Delivery & Quick Win',
      'Problem Clarification (Why Manual Templates Fail)',
      'Cost of Highest Repetitive Task',
      'Solution Comparison & Bridge',
      'Objection Handling & Trial Invitation'
    ],
    blueprintApprovedByStudent: true,
    blueprint: [
      {
        emailNumber: 1,
        sequenceTypeEn: 'Lead Magnet Delivery',
        purposeAr: 'تسليم قائمة الفحص فورًا وتشجيع المشترك على تحديد النقاط الحمراء في 7 دقائق.',
        subjectAngleAr: 'تسليم مباشر وواضح',
        coreMessageAr: 'إليك قائمة الفحص + ركز على القسم الثاني (حلقة التعديلات) لأنه أكبر سارق للوقت.',
        objectionHandledAr: 'ضيق الوقت لقراءة الملف.',
        ctaAr: 'حمّل قائمة الفحص واطلع على المقارنة العملية',
        behaviorTriggerAr: 'فور إرسال نموذج الاشتراك (Form Submitted)'
      },
      {
        emailNumber: 2,
        sequenceTypeEn: 'Problem Clarification',
        purposeAr: 'توضيح لماذا لا تحل القوالب اليدوية (مثل Notion) مشكلة الوقت الضائع.',
        subjectAngleAr: 'فكرة مخالفة للتوقع (Contrarian)',
        coreMessageAr: 'القالب اليدوي ينظم المعلومات لكنه يعتمد عليك في كل خطوة متابعة.',
        objectionHandledAr: 'أنا عندي قالب Notion بالفعل.',
        ctaAr: 'شاهد الفرق بين القالب اليدوي والمسار المؤتمت',
        behaviorTriggerAr: 'بعد يوم واحد من الإيميل الأول'
      },
      {
        emailNumber: 3,
        sequenceTypeEn: 'Educational / Cost Analysis',
        purposeAr: 'حساب تكلفة المهمة الأكثر استنزافًا: مطاردة موافقات وتعديلات العميل.',
        subjectAngleAr: 'سؤال تشخيصي محدد',
        coreMessageAr: 'إذا كانت ساعتك تساوي 25 دولارًا وتضيع 8 ساعات أسبوعيًا، فأنت تخسر 800 دولار شهريًا من وقتك.',
        objectionHandledAr: 'هل تستحق الأداة دفع اشتراك شهري؟',
        ctaAr: 'راجع كيف تعالج بوابة العميل هذه المشكلة',
        behaviorTriggerAr: 'بعد يومين'
      },
      {
        emailNumber: 4,
        sequenceTypeEn: 'Solution Comparison & Offer Intro',
        purposeAr: 'مقارنة فئات الحلول وتقديم MotionFlow Studio AI مع صفحة الجسر.',
        subjectAngleAr: 'إطار قرار واضح',
        coreMessageAr: 'مقارنة شفافة بالمميزات والقيود: متى يناسبك MotionFlow Studio ومتى لا تحتاجه.',
        objectionHandledAr: 'الخوف من الانحياز التسويقي.',
        ctaAr: 'اقرأ المراجعة الشفافة وجرّب الأداة مجانًا',
        behaviorTriggerAr: 'بعد 3 أيام'
      },
      {
        emailNumber: 5,
        sequenceTypeEn: 'Objection Handling & Follow-Up',
        purposeAr: 'الرد على اعتراض "ليس لدي وقت لإعداد نظام جديد" عبر خطة الـ15 دقيقة.',
        subjectAngleAr: 'إزالة عائق التنفيذ',
        coreMessageAr: 'لا تنقل كل عملائك دفعة واحدة — جرّب النظام على مشروع واحد جديد فقط في 15 دقيقة.',
        objectionHandledAr: 'صعوبة الإعداد ونقل المشاريع.',
        ctaAr: 'ابدأ تجربتك المجانية على مشروع واحد الآن',
        behaviorTriggerAr: 'بعد 4 أيام (لمن لم يضغط على العرض بعد)'
      }
    ],
    emailsCopy: [
      {
        emailNumber: 1,
        subjectLineAr: '[قائمة الفحص بالداخل] 12 نقطة لتشخيص سير عملك كمصمم في 7 دقائق',
        subjectOptions: [
          {
            mechanismEn: 'Specific Benefit',
            mechanismAr: 'فائدة محددة ومباشرة',
            subjectAr: '[قائمة الفحص بالداخل] 12 نقطة لتشخيص سير عملك كمصمم في 7 دقائق',
            isDeceptiveRisk: false
          },
          {
            mechanismEn: 'Question',
            mechanismAr: 'سؤال تشخيصي',
            subjectAr: 'كم نقطة حمراء ستظهر في سير عملك اليوم؟ (رابط القائمة بالداخل)',
            isDeceptiveRisk: false
          },
          {
            mechanismEn: 'Curiosity',
            mechanismAr: 'فضول عملي',
            subjectAr: 'المرحلة رقم 2 في هذه القائمة هي سبب ضياع أغلب وقت المصممين',
            isDeceptiveRisk: false
          }
        ],
        previewTextAr: 'رابط التحميل المباشر + نصيحة سريعة للبدء في أقل من 7 دقائق.',
        openingAr: 'أهلًا بك، يسعدني انضمامك.',
        bodyAr: 'كما وعدتك، هذا هو الرابط المباشر لتحميل "قائمة فحص الـ12 نقطة لأتمتة سير عمل المصمم المستقل".\n\nنصيحة سريعة قبل أن تبدأ:\nلا تحاول تعديل كل شيء في يوم واحد. ابدأ أولًا بالقسم الثاني في القائمة (إدارة التعديلات والمراجعات)، وضع علامة حمراء أمام كل خطوة لا تزال تنفذها يدويًا عبر رسائل واتساب أو الإيميل.\n\nإذا وجدت أكثر من 4 نقاط باللون الأحمر، فقد جهزت لك صفحة مقارنة عملية توضح كيف يمكنك تحويل هذه المهام اليدوية إلى مسار مؤتمت بالكامل.',
        ctaTextAr: 'حمّل القائمة واطلع على مقارنة الأتمتة العملية',
        psTextAr: 'ملاحظة: في رسالة الغد سأشارك معك لماذا تفشل أغلب قوالب Notion اليدوية بعد أسبوعين من ضغط العمل.',
        status: 'APPROVED'
      },
      {
        emailNumber: 2,
        subjectLineAr: 'لماذا لا تحل القوالب الجاهزة مشكلة ضياع وقت المصمم؟',
        subjectOptions: [
          {
            mechanismEn: 'Contrarian Idea',
            mechanismAr: 'فكرة عكس الشائع',
            subjectAr: 'لماذا لا تحل القوالب الجاهزة مشكلة ضياع وقت المصمم؟',
            isDeceptiveRisk: false
          },
          {
            mechanismEn: 'Problem Recognition',
            mechanismAr: 'ملامسة المشكلة',
            subjectAr: 'الفرق الخفي بين "تنظيم الفوضى" وبين "أتمتة العمل"',
            isDeceptiveRisk: false
          }
        ],
        previewTextAr: 'القالب اليدوي ينتظرك لتكتب فيه كل شيء.. الأتمتة تعمل نيابة عنك.',
        openingAr: 'أهلًا بك مرة أخرى،',
        bodyAr: 'عندما يشعر المصمم المستقل بفوضى في إدارة 3 أو 4 عملاء، يكون رد الفعل الطبيعي هو البحث عن قالب Notion جديد.\n\nالمشكلة ليست في Notion نفسه، بل في أنه يظل نظامًا يدويًا:\nأنت من ينشئ الصفحة، وأنت من ينسخ ملاحظات العميل من واتساب، وأنت من يرسل تذكير الفاتورة.\n\nبمجرد أن تنشغل في تسليم مشروع عاجل، يتوقف تحديث القالب وتعود الفوضى من جديد.\n\nالحل الحقيقي ليس قالبًا أجمل، بل نظام يربط العقد، وبوابة التعديلات، والفاتورة تلقائيًا بدون تدخل يدوي منك في كل خطوة.',
        ctaTextAr: 'شاهد كيف يعمل المسار المؤتمت مقارنة بالقوالب اليدوية',
        psTextAr: 'إذا جربت قائمة الفحص أمس، أخبرني: كم نقطة حمراء ظهرت لديك؟',
        status: 'APPROVED'
      },
      {
        emailNumber: 3,
        subjectLineAr: 'حسبة بسيطة: كم تكلفك "تعديلات الواتساب" كل شهر؟',
        subjectOptions: [
          {
            mechanismEn: 'Question + Specificity',
            mechanismAr: 'سؤال مع رقم محدد',
            subjectAr: 'حسبة بسيطة: كم تكلفك "تعديلات الواتساب" كل شهر؟',
            isDeceptiveRisk: false
          },
          {
            mechanismEn: 'Mistake',
            mechanismAr: 'خطأ حسابي شائع',
            subjectAr: 'التكلفة غير المرئية التي ينساها أغلب المصممين عند تسعير مشاريعهم',
            isDeceptiveRisk: false
          }
        ],
        previewTextAr: 'عندما تضيع 8 ساعات أسبوعيًا في الإدارة، كم تساوي هذه الساعات ماليًا؟',
        openingAr: 'أهلًا بك،',
        bodyAr: 'لنقم بحسبة سريعة وواقعية:\n\nلنفترض أن قيمة ساعة عملك الفعلية في التصميم هي 20 دولارًا فقط، وأنك تفقد 8 ساعات أسبوعيًا في جمع الملاحظات المتفرقة، وتذكير العملاء بالموافقات، وإعداد الفواتير.\n\nهذا يعني أكثر من 30 ساعة شهريًا — أي ما يعادل قيمة مشروع تصميم كامل يضيع في مهام إدارية غير مدفوعة.\n\nأكبر نقطة تسريب للوقت في قائمة الفحص هي غياب "بوابة مراجعة موحدة" تجمع تعليقات العميل وتربطها تلقائيًا بعدد جولات التعديل المتفق عليها.',
        ctaTextAr: 'تعرف على طريقة إغلاق فجوة التعديلات الإدارية',
        psTextAr: '',
        status: 'APPROVED'
      },
      {
        emailNumber: 4,
        subjectLineAr: 'مراجعة شفافة: متى يناسبك MotionFlow Studio ومتى لا تحتاجه؟',
        subjectOptions: [
          {
            mechanismEn: 'Decision',
            mechanismAr: 'مساعدة على اتخاذ قرار',
            subjectAr: 'مراجعة شفافة: متى يناسبك MotionFlow Studio ومتى لا تحتاجه؟',
            isDeceptiveRisk: false
          },
          {
            mechanismEn: 'Specific Benefit',
            mechanismAr: 'تقييم عملي',
            subjectAr: 'كيف تجمع النقاط الـ12 في نظام واحد (مميزات وقيود الأداة بصراحة)',
            isDeceptiveRisk: false
          }
        ],
        previewTextAr: 'بدون مبالغة تسويقية: لمن تصلح هذه الأداة ومن الأفضل له البقاء على النظام اليدوي.',
        openingAr: 'أهلًا بك،',
        bodyAr: 'بعد أن حددنا نقاط الهدر في سير العمل، السؤال المنطقي هو: ما الأداة التي تجمع العقود، وبوابة التعديلات، والفواتير في مسار واحد دون تعقيد؟\n\nأعددت لك صفحة مقارنة صريحة حول أداة MotionFlow Studio AI.\n\nستجد في الصفحة:\n1. كيف تعالج الأداة مشكلة التعديلات المبعثرة وتسليم الملفات.\n2. ما هي قيود الأداة التي يجب أن تعرفها قبل التجربة.\n3. لمن تناسب الأداة فعلًا (إذا كان لديك 2–6 عملاء شهريًا) ومتى لا تحتاجها.\n\n(ملاحظة شفافة: الصفحة تحتوي على رابط أفلييت قد أحصل منه على عمولة دون أي تكلفة إضافية عليك).',
        ctaTextAr: 'اقرأ المقارنة الكاملة وابدأ التجربة المجانية',
        psTextAr: '',
        status: 'APPROVED'
      },
      {
        emailNumber: 5,
        subjectLineAr: 'قاعدة الـ15 دقيقة لتجربة أي نظام جديد بدون تعطيل شغلك',
        subjectOptions: [
          {
            mechanismEn: 'Objection Removal',
            mechanismAr: 'إزالة عائق الوقت',
            subjectAr: 'قاعدة الـ15 دقيقة لتجربة أي نظام جديد بدون تعطيل شغلك',
            isDeceptiveRisk: false
          },
          {
            mechanismEn: 'Reminder',
            mechanismAr: 'تذكير عملي هادئ',
            subjectAr: 'لا تنقل كل مشاريعك دفعة واحدة — ابدأ بمشروع واحد فقط',
            isDeceptiveRisk: false
          }
        ],
        previewTextAr: 'كيف تختبر أتمتة سير العمل على عميلك القادم فقط بدون أي ضغط.',
        openingAr: 'أهلًا بك،',
        bodyAr: 'أكبر سبب يمنع المصمم المضغوط من تحسين سير عمله هو اعتقاده أنه يحتاج يومين كاملين لنقل كل مشاريعه القديمة إلى النظام الجديد.\n\nالطريقة الأذكى والأبسط:\nاترك مشاريعك الحالية كما هي حتى تنتهي، وجرّب MotionFlow Studio AI على "عميلك الجديد القادم فقط".\n\nاستخدم قالب البوابة الجاهز (يستغرق إعداده حوالي 15 دقيقة)، وراقب الفرق في سرعة توقيع العقد وجمع ملاحظات التعديلات.\n\nإذا وفر عليك ساعات المتابعة كما تتوقع، اعتمد النظام؛ وإلا يمكنك إلغاء التجربة المجانية بكل بساطة.',
        ctaTextAr: 'جرّب MotionFlow Studio على مشروعك القادم مجانًا',
        psTextAr: 'هذه آخر رسالة في سلسلة التشخيص، أتمنى لك أسبوع عمل هادئ ومنظم.',
        status: 'APPROVED'
      }
    ],
    personalizationFieldsUsed: ['First Name (اختياري)', 'Traffic Source (YouTube)'],
    emailClaimsAudit: [
      {
        id: 'e-claim-1',
        sourceLocation: 'الإيميل 3 — مثال حسابي',
        claimText: 'لنفترض أن قيمة ساعة عملك الفعلية في التصميم هي 20 دولارًا فقط',
        classification: 'HYPOTHESIS',
        warningOrFixAr: 'مثال افتراضي مصاغ بوضوح بعبارة "لنفترض" ولا يدعي أرباحًا مضمونة.',
        isSafe: true
      }
    ]
  },
  automation: {
    selectedPlatform: 'Platform-Agnostic',
    triggers: ['Form Submitted: نموذج تحميل قائمة فحص الـ12 نقطة'],
    conditions: [
      'هل فتح الإيميل الأول خلال 24 ساعة؟',
      'هل ضغط على رابط صفحة الجسر / العرض؟ (INTENT | MotionFlow)',
      'هل تم تأكيد الاشتراك في العرض؟ (CUSTOMER | MotionFlow)'
    ],
    actions: [
      'إضافة تاج المصدر: SOURCE | YouTube',
      'إضافة تاج الليد: LEAD | 12-Point Workflow Checklist',
      'إرسال إيميل تسليم القائمة فورًا',
      'إضافة تاج التفاعل عند فتح الإيميل: ENGAGED | Email',
      'إضافة تاج النية عند زيارة العرض: INTENT | MotionFlow'
    ],
    delays: ['انتظار 24 ساعة بين كل رسالة في السلسلة التثقيفية'],
    exitConditions: [
      'خروج فوري من سلسلة الترويج عند حصول المشترك على تاج CUSTOMER | MotionFlow',
      'إلغاء الاشتراك (Unsubscribe) أو ارتداد البريد (Hard Bounce)'
    ],
    goals: ['النقر على رابط العرض في صفحة الجسر (INTENT | MotionFlow) ثم بدء التجربة المجانية'],
    fallbackPaths: [
      'إذا لم يفتح إيميل التسليم خلال 24 ساعة → إعادة إرسال لمرة واحدة فقط بعنوان بديل ثم إكمال السلسلة الطبيعية دون إزعاج.'
    ],
    workflowNodes: [
      {
        id: 'auto-1',
        order: 1,
        stepType: 'TRIGGER',
        titleAr: 'إرسال نموذج صفحة الهبوط (Form Submitted)',
        detailAr: 'الزائر يدخل بريده الإلكتروني لطلب قائمة فحص الـ12 نقطة.',
        tagInvolved: 'LEAD | 12-Point Workflow Checklist'
      },
      {
        id: 'auto-2',
        order: 2,
        stepType: 'ACTION',
        titleAr: 'تطبيق تاج المصدر والليد وإرسال الإيميل رقم 1 فورًا',
        detailAr: 'منع التكرار: إذا كان المشترك يحمل التاج مسبقًا، يتم تسليم الملف دون إدخاله في السلسلة مرتين.',
        tagInvolved: 'SOURCE | YouTube'
      },
      {
        id: 'auto-3',
        order: 3,
        stepType: 'DELAY',
        titleAr: 'انتظار 24 ساعة',
        detailAr: 'منح المصمم وقتًا كافيًا لفتح القائمة وتطبيق التشخيص في 7 دقائق.'
      },
      {
        id: 'auto-4',
        order: 4,
        stepType: 'CONDITION',
        titleAr: 'فحص التفاعل: هل فتح الإيميل الأول؟',
        detailAr: 'تحديد المسار المناسب للمشترك بناءً على التفاعل.',
        yesBranchAr: 'إضافة تاج ENGAGED | Email وإرسال الإيميل 2 (لماذا تفشل القوالب اليدوية)',
        noBranchAr: 'إرسال تذكير خفيف لمرة واحدة برابط القائمة ثم متابعة السلسلة'
      },
      {
        id: 'auto-5',
        order: 5,
        stepType: 'CONDITION',
        titleAr: 'فحص نقر العرض: هل ضغط على رابط صفحة الجسر أو العرض؟',
        detailAr: 'رصد الاهتمام الفعلي بأداة الأتمتة خلال الإيميلات 3 و 4.',
        yesBranchAr: 'إضافة تاج INTENT | MotionFlow وإرسال إيميل معالجة اعتراض الإعداد السريع (إيميل 5)',
        noBranchAr: 'إكمال السلسلة التثقيفية المعتادة حتى الإيميل 5 ثم التوقف',
        tagInvolved: 'INTENT | MotionFlow'
      },
      {
        id: 'auto-6',
        order: 6,
        stepType: 'EXIT',
        titleAr: 'شرط الخروج الآمن (Goal / Exit Condition)',
        detailAr: 'في حال حصول المشترك على تاج CUSTOMER | MotionFlow أو انتهاء الإيميل 5، يخرج من الأتمتة الترويجية فورًا.',
        tagInvolved: 'CUSTOMER | MotionFlow'
      }
    ],
    tags: [
      {
        tagName: 'SOURCE | YouTube',
        category: 'SOURCE',
        purposeAr: 'معرفة أن المشترك قادم من محتوى يوتيوب العضوي لمطابقة سياق الرسائل.',
        appliedWhenAr: 'عند الاشتراك عبر نموذج صفحة الهبوط المخصصة ليوتيوب.'
      },
      {
        tagName: 'LEAD | 12-Point Workflow Checklist',
        category: 'LEAD',
        purposeAr: 'توثيق الأصل المجاني الذي طلبه المشترك ومنع تكرار إرساله.',
        appliedWhenAr: 'فور إرسال نموذج الطلب.'
      },
      {
        tagName: 'STAGE | Solution Aware',
        category: 'STAGE',
        purposeAr: 'تحديد مستوى وعي المشترك عند الدخول.',
        appliedWhenAr: 'عند بداية السلسلة.'
      },
      {
        tagName: 'ENGAGED | Email',
        category: 'ENGAGED',
        purposeAr: 'تمييز المشتركين الذين يفتحون الرسائل ويتفاعلون مع المحتوى.',
        appliedWhenAr: 'عند فتح أي إيميل أو النقر على رابط القائمة.'
      },
      {
        tagName: 'INTENT | MotionFlow',
        category: 'INTENT',
        purposeAr: 'تمييز المشترك المهتم الذي زار صفحة المقارنة أو ضغط على رابط العرض.',
        appliedWhenAr: 'عند النقر على رابط Bridge Page أو Affiliate Offer.'
      },
      {
        tagName: 'CUSTOMER | MotionFlow',
        category: 'CUSTOMER',
        purposeAr: 'استبعاد المشتري الفعلي من أي رسائل بيعية لاحقة.',
        appliedWhenAr: 'عند تأكيد التحويل أو التحديث اليدوي/Webhook.'
      }
    ],
    segments: [
      {
        dimension: 'Offer Click Intent (INTENT | MotionFlow)',
        conditionAr: 'مشتركون ضغطوا على صفحة الجسر/العرض ولم يشتروا بعد',
        howMessagingChangesAr: 'التركيز في الإيميل الخامس على سهولة الإعداد في 15 دقيقة وتجربة مشروع واحد فقط بدل إعادة شرح المشكلة.'
      },
      {
        dimension: 'Customer Status (CUSTOMER | MotionFlow)',
        conditionAr: 'مشتركون يحملون تاج العميل المؤكد',
        howMessagingChangesAr: 'إيقاف كافة رسائل الترويج للعرض فورًا.'
      }
    ],
    safetyChecks: [
      {
        ruleNameAr: 'منع تكرار التسجيل في نفس السلسلة (Duplicate Enrollment Prevention)',
        passed: true,
        verificationNoteAr: 'يتم فحص وجود تاج LEAD | 12-Point Workflow Checklist قبل إدخال المشترك في السلسلة.'
      },
      {
        ruleNameAr: 'استبعاد العملاء المشترين من رسائل البيع (Customer Exclusion)',
        passed: true,
        verificationNoteAr: 'شرط خروج فوري مربوط بتاج CUSTOMER | MotionFlow.'
      },
      {
        ruleNameAr: 'عدم وجود حلقات لا نهائية (Zero Infinite Loops)',
        passed: true,
        verificationNoteAr: 'جميع الفروع تنتهي عند الإيميل الخامس أو شرط الخروج.'
      },
      {
        ruleNameAr: 'اتساق تسمية التاجات (Tag Naming Hygiene)',
        passed: true,
        verificationNoteAr: 'جميع التاجات(6) تتبع الصيغة الموحدة CATEGORY | Value.'
      }
    ],
    platformTranslationNotesAr: [
      'Systeme.io: استخدم Automation Rules أو Workflow يبدأ بـ Funnel Form Subscribed ثم Apply Tag ثم Send Email ثم Delay 1 Day.',
      'ConvertKit (Kit): استخدم Visual Automation تبدأ بـ Joins a Form، مع استخدام Link Trigger لإضافة تاج INTENT | MotionFlow عند النقر على رابط صفحة الجسر.',
      'MailerLite: استخدم Workflow يبدأ بـ When subscriber completes a form، واستخدم خطوة Condition لفحص النقر على رابط العرض.'
    ]
  },
  trackingAndCta: {
    ctaMap: [
      {
        journeyStageAr: '1. فيديو يوتيوب (Traffic Entry)',
        currentIntentAr: 'يريد حل مشكلة ضياع الوقت في تعديلات العملاء',
        desiredNextActionAr: 'الانتقال لصفحة هبوط قائمة الفحص',
        primaryCtaTextAr: 'حمّل قائمة فحص الـ12 نقطة من الرابط في الوصف',
        ctaTypeEn: 'Download',
        ctaFrictionLevel: 'LOW',
        ctaMessageAr: 'شخّص سير عملك في 7 دقائق مجانًا',
        nextDestinationAr: 'Landing Page'
      },
      {
        journeyStageAr: '2. صفحة الهبوط (Landing Page)',
        currentIntentAr: 'يقيم هل القائمة تستحق إدخال بريده الإلكتروني',
        desiredNextActionAr: 'إدخال البريد الإلكتروني وإرسال النموذج',
        primaryCtaTextAr: 'أرسل لي قائمة الفحص مجانًا الآن',
        ctaTypeEn: 'Download',
        ctaFrictionLevel: 'LOW',
        ctaMessageAr: 'استلم القائمة فورًا في بريدك بدون أي التزام',
        nextDestinationAr: 'Thank You Page'
      },
      {
        journeyStageAr: '3. صفحة الشكر (Thank You Page)',
        currentIntentAr: 'ينتظر استلام القائمة ومستعد لمعرفة كيفية حل النقاط الحمراء',
        desiredNextActionAr: 'زيارة صفحة المقارنة العملية (Bridge Page)',
        primaryCtaTextAr: 'شاهد مقارنة الأتمتة العملية (3 دقائق)',
        ctaTypeEn: 'Compare Options',
        ctaFrictionLevel: 'LOW',
        ctaMessageAr: 'تعرف كيف تحول النقاط اليدوية إلى مسار مؤتمت',
        nextDestinationAr: 'Bridge Page'
      },
      {
        journeyStageAr: '4. سلسلة الإيميلات (Email Sequence)',
        currentIntentAr: 'يقارن بين البقاء على القوالب اليدوية أو تجربة أداة أتمتة',
        desiredNextActionAr: 'الضغط على رابط صفحة الجسر لمراجعة الفروق',
        primaryCtaTextAr: 'اقرأ المراجعة الشفافة وجرّب الأداة مجانًا',
        ctaTypeEn: 'Read Review',
        ctaFrictionLevel: 'MEDIUM',
        ctaMessageAr: 'مقارنة عملية بالمميزات والقيود بدون مبالغة',
        nextDestinationAr: 'Bridge Page'
      },
      {
        journeyStageAr: '5. صفحة الجسر والمقارنة (Bridge Page)',
        currentIntentAr: 'مقتنع بفئة الحل ويريد التأكد من سهولة التجربة',
        desiredNextActionAr: 'الانتقال لصفحة العرض وبدء التجربة المجانية',
        primaryCtaTextAr: 'ابدأ التجربة المجانية على مشروعك القادم',
        ctaTypeEn: 'Start Trial',
        ctaFrictionLevel: 'MEDIUM',
        ctaMessageAr: 'جرّب النظام على عميل واحد في 15 دقيقة',
        nextDestinationAr: 'Affiliate Offer Page'
      }
    ],
    trackingEvents: [
      {
        eventName: 'landing_page_view',
        funnelStepAr: 'صفحة الهبوط',
        triggerConditionAr: 'عند تحميل صفحة هبوط قائمة الفحص',
        toolDestination: 'GA4 / PostHog',
        isAffiliatePlatformRestricted: false
      },
      {
        eventName: 'form_started',
        funnelStepAr: 'نموذج الاشتراك',
        triggerConditionAr: 'عند التركيز في حقل البريد الإلكتروني',
        toolDestination: 'GA4 / PostHog',
        isAffiliatePlatformRestricted: false
      },
      {
        eventName: 'form_submitted',
        funnelStepAr: 'نموذج الاشتراك',
        triggerConditionAr: 'عند إرسال النموذج بنجاح',
        toolDestination: 'GA4 / Email Platform',
        isAffiliatePlatformRestricted: false
      },
      {
        eventName: 'thank_you_viewed',
        funnelStepAr: 'صفحة الشكر',
        triggerConditionAr: 'عند وصول المشترك لصفحة الشكر (تحويل الليد المؤكد)',
        toolDestination: 'GA4 / Meta Pixel (Lead)',
        isAffiliatePlatformRestricted: false
      },
      {
        eventName: 'resource_downloaded',
        funnelStepAr: 'ملف قائمة الفحص',
        triggerConditionAr: 'عند النقر على رابط تحميل ملف الـChecklist',
        toolDestination: 'GA4 / Email Link Trigger',
        isAffiliatePlatformRestricted: false
      },
      {
        eventName: 'email_opened',
        funnelStepAr: 'سلسلة الإيميلات',
        triggerConditionAr: 'عند فتح أي رسالة في السلسلة',
        toolDestination: 'Email Automation Platform',
        isAffiliatePlatformRestricted: false
      },
      {
        eventName: 'email_clicked',
        funnelStepAr: 'سلسلة الإيميلات',
        triggerConditionAr: 'عند النقر على رابط صفحة الجسر داخل الإيميل',
        toolDestination: 'Email Automation Platform + UTM',
        isAffiliatePlatformRestricted: false
      },
      {
        eventName: 'bridge_page_viewed',
        funnelStepAr: 'صفحة الجسر والمقارنة',
        triggerConditionAr: 'عند فتح صفحة الجسر',
        toolDestination: 'GA4 / PostHog',
        isAffiliatePlatformRestricted: false
      },
      {
        eventName: 'affiliate_link_clicked',
        funnelStepAr: 'زر الانتقال للعرض داخل صفحة الجسر',
        triggerConditionAr: 'عند النقر على رابط الأفلييت الخارجي (Outbound Click)',
        toolDestination: 'GA4 + Affiliate SubID',
        isAffiliatePlatformRestricted: false
      },
      {
        eventName: 'purchase_confirmed',
        funnelStepAr: 'صفحة العرض الخارجية (التاجر)',
        triggerConditionAr: 'عند إتمام الاشتراك المدفوع على موقع التاجر',
        toolDestination: 'Affiliate Network Dashboard / Postback URL',
        isAffiliatePlatformRestricted: true,
        restrictionNoteAr: 'تنبيه تقني: لا يمكنك تركيب كود تتبع مباشر داخل موقع التاجر الخارجي؛ اعتمد على حدث affiliate_link_clicked مع تمرير SubID لربط النقرات بالمبيعات داخل لوحة تحكم برنامج الأفلييت.'
      }
    ],
    funnelMetrics: [
      {
        metricNameEn: 'Landing Page Conversion Rate',
        metricNameAr: 'معدل تحويل صفحة الهبوط (Opt-In Rate)',
        formulaOrMeaningAr: 'عدد مرات thank_you_viewed مقسومًا على landing_page_view',
        baselineInstructionAr: 'Track your baseline first — راقب خط الأساس الخاص بك أول 100 زائر قبل الحكم.'
      },
      {
        metricNameEn: 'Email Click-to-Bridge Rate',
        metricNameAr: 'معدل النقر من الإيميل إلى صفحة الجسر',
        formulaOrMeaningAr: 'نسبة المشتركين الذين ضغطوا على رابط المقارنة داخل السلسلة',
        baselineInstructionAr: 'Track your baseline first — يقيس مدى نجاح الإيميلات في بناء الجسر المنطقي.'
      },
      {
        metricNameEn: 'Bridge Page Click-Through Rate (Bridge CTR)',
        metricNameAr: 'معدل الانتقال من صفحة الجسر إلى العرض',
        formulaOrMeaningAr: 'عدد affiliate_link_clicked مقسومًا على bridge_page_viewed',
        baselineInstructionAr: 'Track your baseline first — يوضح مدى إقناع المقارنة الشفافة.'
      },
      {
        metricNameEn: 'Earnings Per Lead (EPL)',
        metricNameAr: 'متوسط العائد لكل مشترك بريدي',
        formulaOrMeaningAr: 'إجمالي العمولات المحققة مقسومًا على إجمالي المشتركين',
        baselineInstructionAr: 'Track your baseline first — يُحسب بعد توفر بيانات التحويل الفعلية من لوحة الأفلييت.'
      }
    ],
    implementationGuide: {
      ga4NotesAr: 'قم بتفعيل Enhanced Measurement في GA4، وأنشئ حدث مخصص باسم affiliate_link_clicked عند النقر على الأزرار التي تحتوي على رابط العرض.',
      metaPixelNotesAr: 'إذا استخدمت إعلانات لاحقًا، اربط حدث Lead بصفحة الشكر (thank_you_viewed) وليس بمجرد فتح صفحة الهبوط.',
      posthogNotesAr: 'أنشئ Funnel داخل PostHog بالترتيب: landing_page_view → thank_you_viewed → bridge_page_viewed → affiliate_link_clicked.',
      utmTemplate: 'utm_source=youtube&utm_medium=organic&utm_campaign=[video_topic_slug]&utm_content=[cta_placement]',
      subIdTemplate: '?ref=[your_affiliate_id]&subid1=youtube_organic&subid2=bridge_page_v1'
    }
  },
  qaAndBlueprint: {
    qaChecks: [
      {
        category: 'FUNNEL',
        questionAr: 'هل تتطابق رسالة مصدر الترافيك مع وعد صفحة الهبوط والـLead Magnet؟',
        passed: true,
        findingAr: 'نعم، السلسلة بالكامل تدور حول تشخيص وأتمتة الـ10 ساعات الإدارية الضائعة للمصمم المستقل.'
      },
      {
        category: 'FUNNEL',
        questionAr: 'هل يقود الـLead Magnet منطقيًا نحو العرض بدون تلاعب؟',
        passed: true,
        findingAr: 'قائمة الفحص تكشف المهام اليدوية، والـOffer يؤتمت نفس المهام الـ12 مباشرة.'
      },
      {
        category: 'FUNNEL',
        questionAr: 'هل الفانل محمي من المبالغة في البناء (Overbuilding)؟',
        passed: true,
        findingAr: 'يحتوي على 3 صفحات أساسية فقط و5 إيميلات مركزة.'
      },
      {
        category: 'COPY',
        questionAr: 'هل النصوص خالية من الشهادات الوهمية أو الندرة الكاذبة أو الأرباح المضمونة؟',
        passed: true,
        findingAr: 'تم استخدام عنصر نائب صريح للشهادات [أضف دليلًا موثقًا] مع إفصاح أفلييت شفاف.'
      },
      {
        category: 'EMAIL',
        questionAr: 'هل لكل إيميل وظيفة واحدة واضحة بدون تكرار ممل؟',
        passed: true,
        findingAr: 'الإيميلات الـ5 تتدرج من التسليم إلى توضيح قصور القوالب اليدوية ثم التكلفة ثم المقارنة ثم إزالة عائق الإعداد.'
      },
      {
        category: 'AUTOMATION',
        questionAr: 'هل توجد شروط خروج واضحة واستبعاد للمشترين الفعليين؟',
        passed: true,
        findingAr: 'تاج CUSTOMER | MotionFlow يخرج المشترك فورًا من السلسلة الترويجية.'
      },
      {
        category: 'MOBILE',
        questionAr: 'هل هيكل الصفحات ولوحة التحكم متوافق مع الجوال بدون تداخل أو وميض أبيض؟',
        passed: true,
        findingAr: 'تم ضبط اتجاه RTL وعناصر <bdi dir="ltr"> للمصطلحات الإنجليزية والأرقام.'
      }
    ],
    scores: {
      buildIntegrity: 92,
      researchAlignment: 95,
      automationConfidence: 90,
      implementationReadiness: 91,
      subDimensions: {
        journeyClarity: 94,
        messageMatch: 96,
        funnelSimplicity: 90,
        leadMagnetFit: 94,
        pageConsistency: 91,
        emailContinuity: 92,
        automationLogic: 90,
        trackingCompleteness: 89
      }
    },
    finalStatus: 'READY TO BUILD',
    statusExplanationAr: 'جميع عناصر الفانل مترابطة مباشرة بمدخلات البحث (الجمهور، المشكلة، العرض، ومستوى الوعي)، مع سلسلة رسائل متطابقة وأقل عدد ممكن من الصفحات والأتمتة لبدء الاختبار الفعلي.',
    implementationOrder: [
      '1. تثبيت هيكل الفانل المختار (Lead Magnet + Bridge Page).',
      '2. تجهيز ملف قائمة فحص الـ12 نقطة (PDF من صفحتين أو صفحة Notion للقراءة).',
      '3. بناء صفحة الجسر والمقارنة (Bridge Page) مع وضع رابط الأفلييت والإفصاح الشفاف.',
      '4. بناء صفحة الهبوط (Landing Page) وصفحة الشكر (Thank You Page).',
      '5. إعداد التاجات الـ6 الأساسية في منصة البريد الإلكتروني.',
      '6. إدخال الإيميلات الـ5 وتفعيل مسار الأتمتة الأساسي.',
      '7. تركيب أحداث التتبع ومعاملات UTM وSubID.',
      '8. إجراء اختبار كامل بالإيميل الشخصي للتأكد من وصول القائمة وعمل الروابط.'
    ],
    doNotBuildYet: [
      'لا تبنِ ويبينار مسجل أو كورس مجاني الآن.',
      'لا تكتب أكثر من 5 إيميلات قبل جمع بيانات أول 100 مشترك.',
      'لا تنشئ مجتمعًا خاصًا أو مجموعة تيليجرام في هذه المرحلة.',
      'لا تضف مسارات تقسيم معقدة قبل التحقق من تحويل صفحة الجسر الأساسية.',
      'لا تصمم أكثر من Lead Magnet واحد.'
    ],
    minimumViableBreakdown: {
      buildNow: [
        'ملف قائمة فحص الـ12 نقطة (Checklist)',
        'صفحة هبوط القائمة (Landing Page)',
        'صفحة الشكر والتمهيد (Thank You Page)',
        'صفحة الجسر والمقارنة الشفافة (Bridge Page)',
        'إيميل التسليم + 4 إيميلات متابعة مركزة',
        'تتبع النقرات على رابط الأفلييت بـSubID'
      ],
      buildAfterValidation: [
        'فيديو قصير 3 دقائق داخل صفحة الجسر يشرح الأداة عمليًا',
        'اختبار A/B بين عنوانين لصفحة الهبوط'
      ],
      scaleInfrastructure: [
        'تحويل قائمة الفحص إلى أداة تقييم تفاعلية (Interactive Quiz / Calculator)',
        'إضافة مسارات محتوى مخصصة حسب حجم أعمال المصمم'
      ]
    },
    oneActionFirstAr: 'جهّز محتوى "قائمة فحص الـ12 نقطة" في ملف نظيف من صفحتين قبل فتح أي أداة تصميم صفحات أو كتابة الإيميلات.',
    contentEntryBrief: {
      primaryContentProblem: 'ضياع ساعات المصمم المستقل القابلة للفوترة في متابعة التعديلات والعقود يدويًا.',
      audienceAwareness: 'Solution Aware',
      coreMessage: 'القوالب اليدوية تنظم الفوضى لكنها لا تنفذ المتابعة نيابة عنك — اكتشف المهام الـ12 القابلة للأتمتة.',
      cta: 'حمّل قائمة فحص الـ12 نقطة مجانًا من الرابط في الوصف',
      destinationPage: 'صفحة هبوط قائمة الفحص (Landing Page)',
      entryContentTopics: [
        'كيف تحسب تكلفة الساعات الإدارية الضائعة في تعديلات الواتساب كمصمم مستقل',
        'لماذا تفشل قوالب Notion اليدوية عندما تدير 4 عملاء في نفس الوقت؟',
        '3 مراحل في رحلة العميل يجب أتمتتها قبل رفع أسعارك كمصمم',
        'كيف تجمع العقود والتعديلات والفواتير في رابط واحد للعميل',
        'مقارنة عملية: كم دقيقة يستغرق إعداد مشروع جديد يدويًا مقابل الأتمتة؟'
      ]
    },
    trafficHandoff: {
      completedStages: ['R — Research ✓', 'B — Build ✓'],
      nextStage: 'T — Traffic',
      audience: 'مصممين مستقلين (UI/UX & Brand Designers) يديرون من 3 إلى 6 عملاء في نفس الوقت.',
      problem: 'ضياع أكثر من 10 ساعات أسبوعيًا من الوقت القابل للفوترة في مهام إدارية متكررة ومتابعة تعديلات العملاء.',
      offer: 'MotionFlow Studio AI — نظام إدارة عملاء وأتمتة مهام للمصممين',
      awareness: 'Solution Aware',
      coreMessage: 'توقف عن إدارة تعديلات العملاء يدويًا؛ شخّص نقاط الهدر الـ12 وحوّل رحلة العميل لمسار مؤتمت.',
      contentEntryPoint: 'فيديوهات يوتيوب تطبيقية حول إنتاجية المصمم وإدارة العملاء',
      cta: 'حمّل قائمة فحص الـ12 نقطة لأتمتة سير عمل المصمم المستقل',
      landingDestination: 'Landing Page → Thank You Page → Bridge Page → Affiliate Offer',
      funnelGoal: 'تحويل الزائر إلى مشترك بريدي مؤهل ثم توجيهه لتجربة العرض عبر صفحة المقارنة.',
      leadMagnet: 'قائمة فحص الـ12 نقطة لأتمتة سير عمل المصمم المستقل (Checklist)',
      trackingEvents: [
        'landing_page_view',
        'form_submitted',
        'thank_you_viewed',
        'bridge_page_viewed',
        'affiliate_link_clicked'
      ]
    }
  },
  versions: [
    {
      versionId: 'v1',
      versionLabel: 'Funnel V1 (النسخة الأساسية)',
      createdAt: new Date().toISOString(),
      whatChangedAr: 'تأسيس الفانل الأولي (Checklist + Bridge Page + 5 Emails).',
      whyChangedAr: 'بناء أقل نسخة قابلة للاختبار بناءً على مخرجات مرحلة البحث.',
      hypothesisAr: 'المصممون الذين يشاهدون محتوى تنظيم الوقت سيحملون قائمة الفحص بنسبة تحويل جيدة لأنها تستغرق 7 دقائق فقط.',
      expectedEffectAr: 'بناء خط الأساس لتحويل صفحة الهبوط ونقر صفحة الجسر.',
      resultNoteAr: 'قيد التنفيذ والاختبار الأولي.',
      primaryFunnelNameAr: 'فانل Lead Magnet مع صفحة جسر ومقارنة',
      leadMagnetTitleAr: 'قائمة فحص الـ12 نقطة لأتمتة سير عمل المصمم المستقل',
      mainHeadlineAr: 'قائمة فحص من 12 نقطة للمصمم المستقل: اكتشف في 7 دقائق أين تضيع ساعاتك المدفوعة في متابعة العملاء',
      mainCtaAr: 'أرسل لي قائمة الفحص مجانًا الآن',
      emailCount: 5
    }
  ],
  experiments: [
    {
      id: 'exp-1',
      experimentName: 'اختبار زاوية عنوان صفحة الهبوط (الوقت الضائع مقابل خطأ القوالب اليدوية)',
      hypothesis: 'التركيز على الساعات المدفوعة الضائعة (7 دقائق لتشخيص 10 ساعات) سيحقق معدل اشتراك أعلى من التركيز العام على الأتمتة.',
      variable: 'العنوان الرئيسي لصفحة الهبوط (Main Headline)',
      control: 'قائمة فحص من 12 نقطة للمصمم المستقل: اكتشف في 7 دقائق أين تضيع ساعاتك المدفوعة',
      variant: 'لماذا تفشل القوالب اليدوية؟ افحص الـ12 مهمة التي تسرق ربحيتك كمصمم مستقل',
      primaryMetric: 'Landing Page Conversion Rate (thank_you_viewed / landing_page_view)',
      result: 'بانتظار جمع أول 200 زيارة (Track baseline first)',
      learning: 'لا تحكم على التجربة قبل الوصول لحجم زيارات كافٍ.'
    }
  ]
};
