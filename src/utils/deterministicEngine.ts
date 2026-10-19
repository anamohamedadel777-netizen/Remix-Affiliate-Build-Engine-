import {
  AffiliateBuildProject,
  BuildFinalStatus,
  BuildIntegrityScores,
  ClaimAuditItem,
  ReadinessCheckResult,
  ReadinessGap,
  ResearchInput,
  AutomationData,
  AutomationSafetyCheck
} from '../types/buildTypes';

export function evaluateBuildReadiness(
  input: ResearchInput,
  continuedAsHypothesis: boolean = false
): ReadinessCheckResult {
  const gaps: ReadinessGap[] = [];

  if (!input.audience || input.audience.trim().length < 12) {
    gaps.push({
      field: 'audience',
      labelAr: 'الجمهور المستهدف (Audience)',
      issueAr: 'الجمهور غير محدد أو واسع جدًا. حدد شريحة واضحة (مثال: مصممين مستقلين يديرون 3–6 عملاء).',
      severity: 'CRITICAL'
    });
  } else if (
    input.audience.trim().split(/\s+/).length <= 2 &&
    !input.audience.includes('الذين')
  ) {
    gaps.push({
      field: 'audience',
      labelAr: 'دقة الجمهور المستهدف',
      issueAr: 'العرض قد يكون واضحًا، لكن الجمهور واسع جدًا ويحتاج تضييقًا.',
      severity: 'WARNING'
    });
  }

  if (!input.primaryProblem || input.primaryProblem.trim().length < 15) {
    gaps.push({
      field: 'primaryProblem',
      labelAr: 'المشكلة الأساسية (Primary Problem)',
      issueAr: 'الجمهور واضح، لكن المشكلة الأساسية غير محددة بدقة.',
      severity: 'CRITICAL'
    });
  }

  if (!input.desiredOutcome || input.desiredOutcome.trim().length < 10) {
    gaps.push({
      field: 'desiredOutcome',
      labelAr: 'النتيجة المرغوبة (Desired Outcome)',
      issueAr: 'لم يتم تحديد النتيجة الملموسة التي يبحث عنها العميل.',
      severity: 'CRITICAL'
    });
  }

  if (!input.selectedOffer || input.selectedOffer.trim().length < 3) {
    gaps.push({
      field: 'selectedOffer',
      labelAr: 'العرض المختار (Selected Offer)',
      issueAr: 'يجب تحديد العرض أو البرنامج التسويقي الذي سيبنى حوله الفانل.',
      severity: 'CRITICAL'
    });
  }

  if (!input.trafficHypothesis || input.trafficHypothesis.trim().length < 3) {
    gaps.push({
      field: 'trafficHypothesis',
      labelAr: 'مصدر الترافيك الأساسي (Traffic Source)',
      issueAr: 'غير واضح من أين سيأتي الزائر (يوتيوب، مقالات، إعلانات، إلخ).',
      severity: 'CRITICAL'
    });
  }

  if (!input.awarenessStage) {
    gaps.push({
      field: 'awarenessStage',
      labelAr: 'مستوى وعي الزائر (Awareness Stage)',
      issueAr: 'لسه مش واضح هل الزائر Problem Aware ولا Solution Aware.',
      severity: 'CRITICAL'
    });
  }

  if (!input.ctaGoal || input.ctaGoal.trim().length < 5) {
    gaps.push({
      field: 'ctaGoal',
      labelAr: 'هدف الخطوة الأولى (CTA Goal)',
      issueAr: 'لم يتم تحديد الإجراء المطلوب من الزائر في أول تفاعل.',
      severity: 'WARNING'
    });
  }

  const criticalCount = gaps.filter((g) => g.severity === 'CRITICAL').length;
  const warningCount = gaps.filter((g) => g.severity === 'WARNING').length;

  let readinessScore = 100 - criticalCount * 22 - warningCount * 8;
  if (input.researchConfidence < 50) {
    readinessScore = Math.min(readinessScore, 62);
  }
  readinessScore = Math.max(0, Math.min(100, readinessScore));

  const priorityFixAr =
    gaps.length > 0
      ? gaps[0].issueAr
      : input.researchConfidence < 50
      ? 'ثقة البحث منخفضة (< 50/100): نوصي ببناء Minimum Viable Funnel صغير جدًا للاختبار قبل التوسع.'
      : 'جميع مدخلات البحث الأساسية مكتملة ومترابطة.';

  const confidenceMode =
    input.researchConfidence < 50 ? 'CONSERVATIVE_MVF' : 'FULL_BUILD';

  return {
    isReady: criticalCount === 0 || continuedAsHypothesis,
    canContinueAsHypothesis: true,
    continuedAsHypothesis,
    confidenceMode,
    gaps,
    priorityFixAr,
    readinessScore
  };
}

export function scanCopyForRiskyClaims(
  project: AffiliateBuildProject
): ClaimAuditItem[] {
  const items: ClaimAuditItem[] = [];
  const personalConfirmed = project.researchInput.personalExperienceConfirmed;

  const textsToInspect: { loc: string; text: string }[] = [];
  if (project.pages) {
    textsToInspect.push(
      { loc: 'صفحة الهبوط — العنوان الرئيسي', text: project.pages.landingPage.headlineAr },
      { loc: 'صفحة الهبوط — العنوان الفرعي', text: project.pages.landingPage.subheadlineAr },
      { loc: 'صفحة الهبوط — النص الداعم', text: project.pages.landingPage.supportingCopyAr },
      { loc: 'صفحة الجسر — تقديم المنتج', text: project.pages.bridgePage.productIntroductionAr }
    );
  }
  if (project.emailSystem) {
    project.emailSystem.emailsCopy.forEach((em) => {
      textsToInspect.push({
        loc: `الإيميل ${em.emailNumber} (${em.subjectLineAr})`,
        text: `${em.subjectLineAr} ${em.bodyAr}`
      });
    });
  }

  const riskyPatterns: {
    regex: RegExp;
    classification: ClaimAuditItem['classification'];
    warning: string;
  }[] = [
    {
      regex: /مضمون|ضمان 100%|ربح مضمون|نتائج مضمونة|guaranteed/i,
      classification: 'RISKY CLAIM',
      warning: 'ادعاء نتائج مضمونة غير مسموح به بدون إثبات رسمي؛ استبدله بتوضيح خطوات العمل الواقعية.'
    },
    {
      regex: /أفضل أداة في العالم|الأول في العالم|لا يوجد له منافس|best tool in the world/i,
      classification: 'UNVERIFIED CLAIM',
      warning: 'تجنب صيغ التفضيل المطلقة غير المثبتة؛ اشرح لمن تناسب الأداة وما هي مميزاتها المحددة.'
    },
    {
      regex: /اربح\s*\d+\s*دولار|اكسب\s*\d+\s*دولار|make\s*\$\d+/i,
      classification: 'RISKY CLAIM',
      warning: 'ادعاءات الأرباح المالية المباشرة عالية الخطورة؛ ركز على توفير الوقت أو تحسين سير العمل.'
    },
    {
      regex: /آلاف العملاء|ملايين المستخدمين|thousands of customers/i,
      classification: 'UNVERIFIED CLAIM',
      warning: 'لا تذكر أرقام عملاء غير موثقة في مكتبة الإثبات (Proof Library).'
    }
  ];

  if (!personalConfirmed) {
    riskyPatterns.push({
      regex: /جربت الأداة بنفسي|من تجربتي الشخصية مع الأداة|استخدمت البرنامج بنفسي لمدة/i,
      classification: 'UNVERIFIED CLAIM',
      warning: 'تنبيه شفافية: لم تقم بتفعيل خيار "التجربة الشخصية المؤكدة"؛ لا تدعِ استخدام المنتج شخصيًا.'
    });
  }

  textsToInspect.forEach((entry, idx) => {
    riskyPatterns.forEach((pat, pIdx) => {
      const match = entry.text.match(pat.regex);
      if (match) {
        items.push({
          id: `auto-claim-${idx}-${pIdx}`,
          sourceLocation: entry.loc,
          claimText: match[0],
          classification: pat.classification,
          warningOrFixAr: pat.warning,
          isSafe: false
        });
      }
    });
  });

  if (items.length === 0) {
    items.push({
      id: 'safe-claim-baseline',
      sourceLocation: 'الفحص الشامل للنصوص والرسائل',
      claimText: 'جميع الوعود مبنية على تشخيص المشكلة وتوضيح خطوات العمل بدون مبالغات أو شهادات مخترعة.',
      classification: 'MARKETING POSITION',
      warningOrFixAr: 'النصوص متوافقة مع معايير الصدق والشفافية.',
      isSafe: true
    });
  }

  return items;
}

export function validateAutomationArchitecture(
  automation: AutomationData
): AutomationSafetyCheck[] {
  const checks: AutomationSafetyCheck[] = [];

  // 1. Tag convention check: CATEGORY | Value
  const validPrefixRegex = /^(SOURCE|LEAD|ENGAGED|INTENT|CUSTOMER|STAGE)\s*\|\s*.+/;
  const invalidTags = automation.tags.filter((t) => !validPrefixRegex.test(t.tagName));
  const tagNames = automation.tags.map((t) => t.tagName.toLowerCase());
  const hasDuplicates = new Set(tagNames).size !== tagNames.length;

  checks.push({
    ruleNameAr: 'معيار تسمية التاجات وعدم تضاربها (Tag Naming & Conflict Check)',
    passed: invalidTags.length === 0 && !hasDuplicates && automation.tags.length <= 12,
    verificationNoteAr:
      invalidTags.length === 0 && !hasDuplicates
        ? `جميع التاجات (${automation.tags.length}) تتبع الصيغة القياسية CATEGORY | Name بدون تكرار.`
        : `يوجد تاجات غير متوافقة مع الصيغة القياسية أو مكررة (${invalidTags.map((t) => t.tagName).join('، ')}).`
  });

  // 2. Customer exclusion check
  const hasCustomerTag = automation.tags.some((t) => t.category === 'CUSTOMER');
  const hasExitForCustomer = automation.exitConditions.some((c) =>
    /customer|مشتري|عميل|شراء/i.test(c)
  );
  checks.push({
    ruleNameAr: 'استبعاد المشترين الفعليين من رسائل البيع (Customer Exclusion Safety)',
    passed: hasCustomerTag && hasExitForCustomer,
    verificationNoteAr:
      hasCustomerTag && hasExitForCustomer
        ? 'يوجد تاج CUSTOMER وشرط خروج فوري يمنع إرسال عروض ترويجية لمن اشترى بالفعل.'
        : 'تنبيه: يجب إضافة تاج CUSTOMER وشرط خروج واضح لمنع إزعاج المشترين.'
  });

  // 3. Trigger & Exit presence
  const hasTrigger = automation.triggers.length > 0;
  const hasExit = automation.exitConditions.length > 0;
  checks.push({
    ruleNameAr: 'اكتمال نقطة البداية ونقطة الخروج (Trigger & Exit Integrity)',
    passed: hasTrigger && hasExit,
    verificationNoteAr:
      hasTrigger && hasExit
        ? 'لكل مسار أتمتة نقطة انطلاق (Trigger) ونقطة خروج (Exit) محددة تمنع الحلقات اللانهائية.'
        : 'المسار يفتقر إلى Trigger واضح أو Exit Condition.'
  });

  // 4. Duplicate enrollment prevention
  const hasLeadTag = automation.tags.some((t) => t.category === 'LEAD');
  checks.push({
    ruleNameAr: 'منع تكرار التسجيل وإرسال نفس الملف مرتين (Duplicate Enrollment Guard)',
    passed: hasLeadTag,
    verificationNoteAr: hasLeadTag
      ? 'يتم الاعتماد على تاج LEAD للتحقق من عدم إدخال المشترك في نفس سلسلة الترحيب مرتين.'
      : 'أضف تاج LEAD لمنع تكرار إرسال ملف الـLead Magnet لنفس الشخص.'
  });

  return checks;
}

export function calculateBuildIntegrityAndStatus(
  project: AffiliateBuildProject
): {
  scores: BuildIntegrityScores;
  finalStatus: BuildFinalStatus;
  statusExplanationAr: string;
} {
  const r = project.researchInput;
  const readiness = evaluateBuildReadiness(r, project.readiness.continuedAsHypothesis);

  // 1. Research Alignment
  let researchAlignment = readiness.readinessScore;
  if (r.researchConfidence >= 75) researchAlignment = Math.min(100, researchAlignment + 5);

  // 2. Journey Clarity
  const journeyClarity = project.customerJourney
    ? Math.min(100, 60 + project.customerJourney.journeySteps.length * 8)
    : 20;

  // 3. Message Match
  let messageMatch = 30;
  if (project.customerJourney) {
    const mismatchCount = project.customerJourney.messageMatchChain.filter(
      (m) => m.status === 'MESSAGE MISMATCH'
    ).length;
    const driftCount = project.customerJourney.messageMatchChain.filter(
      (m) => m.status === 'DRIFT WARNING'
    ).length;
    messageMatch = Math.max(20, 96 - mismatchCount * 35 - driftCount * 12);
  }

  // 4. Funnel Simplicity (Protect against overbuilding)
  let funnelSimplicity = 88;
  const pageCount = project.pages
    ? project.pages.pagePurposeMap.filter((p) => p.requiredNow).length
    : 3;
  const emailCount = project.emailSystem ? project.emailSystem.blueprint.length : 5;
  const tagCount = project.automation ? project.automation.tags.length : 6;

  if (pageCount > 5 || emailCount > 9 || tagCount > 12) {
    funnelSimplicity = 45;
  } else if (r.researchConfidence < 50 && (pageCount > 3 || emailCount > 5)) {
    funnelSimplicity = 52;
  } else {
    funnelSimplicity = 92;
  }

  // 5. Lead Magnet Fit
  let leadMagnetFit = 30;
  if (project.leadMagnet) {
    const selected = project.leadMagnet.concepts.find(
      (c) => c.id === project.leadMagnet?.selectedConceptId
    );
    if (selected) {
      const vals = Object.values(selected.scores);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      leadMagnetFit = Math.round(avg * 10);
    } else {
      leadMagnetFit = 75;
    }
  }

  // 6. Page Consistency & Claim Safety
  const claims = scanCopyForRiskyClaims(project);
  const unsafeClaims = claims.filter((c) => !c.isSafe).length;
  const pageConsistency = project.pages
    ? Math.max(35, 92 - unsafeClaims * 20)
    : 25;

  // 7. Email Continuity
  const emailContinuity = project.emailSystem
    ? Math.min(96, 70 + Math.min(5, project.emailSystem.emailsCopy.length) * 5)
    : 25;

  // 8. Automation Logic
  let automationLogic = 25;
  if (project.automation) {
    const safety = validateAutomationArchitecture(project.automation);
    const passedCount = safety.filter((s) => s.passed).length;
    automationLogic = Math.round((passedCount / Math.max(1, safety.length)) * 94);
  }

  // 9. Tracking Completeness
  const trackingCompleteness = project.trackingAndCta
    ? Math.min(95, 55 + project.trackingAndCta.trackingEvents.length * 4)
    : 25;

  const buildIntegrity = Math.round(
    (journeyClarity +
      messageMatch +
      funnelSimplicity +
      leadMagnetFit +
      pageConsistency +
      emailContinuity +
      automationLogic +
      trackingCompleteness) /
      8
  );

  const automationConfidence = automationLogic;
  const implementationReadiness = Math.round(
    (buildIntegrity * 0.6 + researchAlignment * 0.25 + trackingCompleteness * 0.15)
  );

  let finalStatus: BuildFinalStatus = 'READY TO BUILD';
  let statusExplanationAr =
    'البنية التحتية للفانل مترابطة بالكامل مع مخرجات البحث، الرسالة موحدة عبر كافة المراحل، والأتمتة آمنة وجاهزة للتنفيذ الفوري.';

  if (readiness.gaps.some((g) => g.severity === 'CRITICAL') && !readiness.continuedAsHypothesis) {
    finalStatus = 'RESEARCH GAP';
    statusExplanationAr = `توجد فجوة أساسية في مدخلات البحث: ${readiness.priorityFixAr}`;
  } else if (messageMatch < 65) {
    finalStatus = 'MESSAGE GAP';
    statusExplanationAr =
      'يوجد عدم تطابق (Message Mismatch) بين وعد الترافيك وصفحة الهبوط أو العرض. وحّد الرسالة قبل البناء.';
  } else if (funnelSimplicity < 60) {
    finalStatus = 'OVERBUILT';
    statusExplanationAr =
      'الفانل يحتوي على صفحات أو إيميلات أو تاجات أكثر من اللازم لمرحلة الاختبار الحالية. قلّص البناء إلى Minimum Viable Funnel.';
  } else if (automationConfidence < 65) {
    finalStatus = 'AUTOMATION GAP';
    statusExplanationAr =
      'منطق الأتمتة يفتقر إلى شروط خروج آمنة أو استبعاد المشترين الفعليين.';
  } else if (r.researchConfidence < 50 || readiness.continuedAsHypothesis) {
    finalStatus = 'TEST MINIMUM FUNNEL FIRST';
    statusExplanationAr =
      'بما أن ثقة البحث أقل من 50% (أو تم المتابعة كفرضية)، ابدأ فقط بأقل فانل قابل للتشغيل (Minimum Funnel) للتحقق من الفرضية بأقل مجهود.';
  } else if (unsafeClaims > 0 || buildIntegrity < 80) {
    finalStatus = 'READY WITH MINOR GAPS';
    statusExplanationAr =
      'البنية الأساسية جاهزة، ولكن يُنصح بمراجعة الملاحظات التحذيرية أو فاحص الادعاءات قبل الإطلاق.';
  }

  return {
    scores: {
      buildIntegrity,
      researchAlignment,
      automationConfidence,
      implementationReadiness,
      subDimensions: {
        journeyClarity,
        messageMatch,
        funnelSimplicity,
        leadMagnetFit,
        pageConsistency,
        emailContinuity,
        automationLogic,
        trackingCompleteness
      }
    },
    finalStatus,
    statusExplanationAr
  };
}

/**
 * Generates clean, responsive RTL Arabic HTML with <bdi dir="ltr"> wrapping
 * for English terms, numbers, percentages, and URLs, following the strict
 * #040405 / #F5BF1E / #FCFCFA / #23170D design spec.
 */
function wrapLtrSegments(text: string): string {
  if (!text) return '';
  return text.replace(
    /([A-Za-z0-9][A-Za-z0-9\s\-_./:%+$&?=#@]*[A-Za-z0-9%+$])/g,
    '<bdi dir="ltr">$1</bdi>'
  );
}

export function generateStandalonePageHtml(
  project: AffiliateBuildProject,
  pageType: 'LANDING' | 'BRIDGE'
): string {
  const lp = project.pages?.landingPage;
  const bp = project.pages?.bridgePage;
  const offerUrl = project.researchInput.offerUrl || '#offer-link';

  if (pageType === 'LANDING' && lp) {
    const bulletsHtml = lp.whatYouGetBullets
      .map(
        (b) =>
          `<li style="margin-bottom: 12px; padding-right: 16px; border-right: 2px solid #F5BF1E;">${wrapLtrSegments(
            b
          )}</li>`
      )
      .join('\n');

    const faqHtml = lp.faqItems
      .map(
        (f) => `
        <div style="background: #120E0A; border: 1px solid rgba(245,191,30,0.18); border-radius: 10px; padding: 18px; margin-bottom: 12px;">
          <h4 style="margin: 0 0 8px 0; color: #FBD052; font-size: 17px;">${wrapLtrSegments(f.question)}</h4>
          <p style="margin: 0; color: #D6D3CD; font-size: 15px;">${wrapLtrSegments(f.answer)}</p>
        </div>`
      )
      .join('\n');

    return `<!doctype html>
<html lang="ar" dir="rtl" style="background-color:#040405;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#040405" />
  <title>${lp.headlineAr}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    html, body {
      background-color: #040405;
      color: #FCFCFA;
      font-family: 'Cairo', sans-serif;
      margin: 0;
      padding: 0;
      overscroll-behavior-y: none;
      line-height: 1.7;
    }
    .container {
      max-width: 780px;
      margin: 0 auto;
      padding: 48px 20px 80px;
    }
    .kicker {
      display: inline-block;
      color: #F5BF1E;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 14px;
    }
    h1 {
      font-size: clamp(24px, 4vw, 36px);
      line-height: 1.4;
      margin: 0 0 18px 0;
      color: #FCFCFA;
      text-wrap: balance;
    }
    .subheadline {
      font-size: 18px;
      color: #D1CEC7;
      margin-bottom: 32px;
    }
    .optin-card {
      background: linear-gradient(180deg, #23170D 0%, #0C0A08 100%);
      border: 1px solid rgba(245, 191, 30, 0.3);
      border-radius: 14px;
      padding: 28px;
      margin-bottom: 40px;
    }
    .input-field {
      width: 100%;
      box-sizing: border-box;
      padding: 14px 16px;
      border-radius: 8px;
      border: 1px solid rgba(252,252,250,0.18);
      background: #040405;
      color: #FCFCFA;
      font-family: 'Cairo', sans-serif;
      font-size: 15px;
      margin-bottom: 14px;
    }
    .cta-btn {
      width: 100%;
      background-color: #F5BF1E;
      color: #040405;
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
      font-size: 17px;
      padding: 14px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    .cta-btn:hover {
      background-color: #FBD052;
    }
    .microcopy {
      font-size: 13px;
      color: #A39E93;
      text-align: center;
      margin-top: 10px;
    }
    .section-box {
      border-top: 1px solid rgba(252,252,250,0.08);
      padding-top: 28px;
      margin-top: 28px;
    }
    h2 {
      font-size: 22px;
      color: #FBD052;
      margin: 0 0 16px 0;
    }
  </style>
</head>
<body>
  <main class="container">
    <div class="kicker">${wrapLtrSegments(project.leadMagnet?.concepts.find(c => c.id === project.leadMagnet?.selectedConceptId)?.formatAr || 'أداة مجانية')}</div>
    <h1>${wrapLtrSegments(lp.headlineAr)}</h1>
    <p class="subheadline">${wrapLtrSegments(lp.subheadlineAr)}</p>

    <section class="optin-card">
      <form onsubmit="event.preventDefault(); window.dispatchEvent(new CustomEvent('form_submitted')); this.innerHTML='<p style=\\'color:#F5BF1E;font-weight:700;text-align:center;\\'>تم استلام طلبك بنجاح! راجع بريدك الإلكتروني الآن.</p>';">
        <input class="input-field" type="text" name="first_name" placeholder="الاسم الأول (اختياري)" />
        <input class="input-field" type="email" name="email" required placeholder="بريدك الإلكتروني الأساسي..." />
        <button type="submit" class="cta-btn">${wrapLtrSegments(lp.ctaButtonTextAr)}</button>
        <p class="microcopy">${wrapLtrSegments(lp.privacyMicrocopyAr)}</p>
      </form>
    </section>

    <section class="section-box">
      <h2>ماذا ستكتشف بالداخل؟</h2>
      <p style="color:#D6D3CD; margin-bottom:18px;">${wrapLtrSegments(lp.supportingCopyAr)}</p>
      <ul style="list-style:none; padding:0; margin:0;">
        ${bulletsHtml}
      </ul>
    </section>

    <section class="section-box">
      <h2>الأسئلة الشائعة</h2>
      ${faqHtml}
    </section>
  </main>
</body>
</html>`;
  }

  // Bridge Page HTML
  const prosHtml = (bp?.pros || [])
    .map((p) => `<li style="margin-bottom:8px;">✓ ${wrapLtrSegments(p)}</li>`)
    .join('\n');
  const consHtml = (bp?.potentialLimitations || [])
    .map((c) => `<li style="margin-bottom:8px;">• ${wrapLtrSegments(c)}</li>`)
    .join('\n');

  return `<!doctype html>
<html lang="ar" dir="rtl" style="background-color:#040405;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#040405" />
  <title>مراجعة ومقارنة عملية — ${project.researchInput.selectedOffer}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    html, body {
      background-color: #040405;
      color: #FCFCFA;
      font-family: 'Cairo', sans-serif;
      margin: 0;
      padding: 0;
      overscroll-behavior-y: none;
      line-height: 1.7;
    }
    .container {
      max-width: 820px;
      margin: 0 auto;
      padding: 44px 20px 80px;
    }
    .disclosure {
      background: #141216;
      border: 1px solid rgba(245,191,30,0.22);
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 13px;
      color: #D6D3CD;
      margin-bottom: 28px;
    }
    h1 {
      font-size: clamp(24px, 3.8vw, 34px);
      color: #FCFCFA;
      margin: 0 0 16px 0;
    }
    .card {
      background: #0C0B0E;
      border: 1px solid rgba(252,252,250,0.09);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 18px;
      margin-bottom: 24px;
    }
    .cta-btn {
      display: inline-block;
      background-color: #F5BF1E;
      color: #040405;
      font-weight: 700;
      font-size: 17px;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      text-align: center;
    }
  </style>
</head>
<body>
  <main class="container">
    <div class="disclosure">
      ${wrapLtrSegments(bp?.affiliateDisclosureAr || 'قد أحصل على عمولة إذا اشتريت من خلال بعض الروابط بدون تكلفة إضافية عليك.')}
    </div>
    <h1>كيف تنتقل من التشخيص اليدوي إلى الأتمتة العملية عبر <bdi dir="ltr">${project.researchInput.selectedOffer}</bdi></h1>
    <div class="card">
      <h2 style="color:#FBD052; font-size:20px; margin-top:0;">لماذا لا تكفي القوالب اليدوية وحدها؟</h2>
      <p>${wrapLtrSegments(bp?.problemRecapAr || '')}</p>
      <p>${wrapLtrSegments(bp?.whatToLookForAr || '')}</p>
    </div>

    <div class="card">
      <h2 style="color:#FBD052; font-size:20px; margin-top:0;">كيف يعمل الحل المقترح؟</h2>
      <p>${wrapLtrSegments(bp?.productIntroductionAr || '')}</p>
    </div>

    <div class="grid-2">
      <div class="card" style="border-color: rgba(245,191,30,0.3);">
        <h3 style="color:#F5BF1E; margin-top:0;">أبرز نقاط القوة</h3>
        <ul style="list-style:none; padding:0; margin:0;">${prosHtml}</ul>
      </div>
      <div class="card">
        <h3 style="color:#A39E93; margin-top:0;">قيود وملاحظات مهمة قبل التجربة</h3>
        <ul style="list-style:none; padding:0; margin:0;">${consHtml}</ul>
      </div>
    </div>

    <div class="card" style="text-align:center; background: linear-gradient(180deg, #23170D 0%, #0C0B0E 100%);">
      <h3 style="margin-top:0;">الخطوة العملية التالية</h3>
      <p style="color:#D1CEC7; margin-bottom:20px;">جرّب النظام على مشروع واحد فقط وقارن الوقت الذي توفره بنفسك.</p>
      <a class="cta-btn" href="${offerUrl}" target="_blank" rel="noopener noreferrer">
        ${wrapLtrSegments(bp?.ctaTextAr || 'ابدأ التجربة الآن')}
      </a>
    </div>
  </main>
</body>
</html>`;
}
