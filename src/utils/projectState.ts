import {
  AffiliateBuildProject,
  BuildStageId,
  ResearchInput
} from '../types/buildTypes';
import { evaluateBuildReadiness } from './deterministicEngine';

export function createEmptyResearchInput(): ResearchInput {
  return {
    inputMethod: 'MANUAL',
    projectName: 'مشروع بناء جديد',
    market: '',
    niche: '',
    audience: '',
    primaryProblem: '',
    desiredOutcome: '',
    offerCategory: '',
    selectedOffer: '',
    offerUrl: '',
    trafficHypothesis: '',
    primaryContentChannel: '',
    awarenessStage: 'Problem Aware',
    ctaGoal: '',
    businessModel: '',
    currentAssets: '',
    evidence: '',
    researchConfidence: 0,
    strategicRisks: [],
    validationNotes: '',
    buyerIntent: '',
    audienceObjections: [],
    contentOpportunities: [],
    researchIntegrityStatus: 'NEW_UNVALIDATED',
    personalExperienceConfirmed: false
  };
}

export function createEmptyBuildProject(): AffiliateBuildProject {
  const emptyInput = createEmptyResearchInput();
  return {
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    updatedAt: new Date().toISOString(),
    currentStage: 'INPUT',
    researchInput: emptyInput,
    readiness: evaluateBuildReadiness(emptyInput, false),
    lockedElements: {
      audience: false,
      funnel: false,
      leadMagnet: false,
      promise: false,
      headline: false,
      mainCta: false,
      emailSequence: false
    },
    proofLibrary: [],
    customerJourney: null,
    funnelStrategy: null,
    leadMagnet: null,
    pages: null,
    emailSystem: null,
    automation: null,
    trackingAndCta: null,
    qaAndBlueprint: null,
    versions: [],
    experiments: []
  };
}

export interface StageAccessCheck {
  canAccess: boolean;
  reasonAr?: string;
  requiredStage?: BuildStageId;
}

/**
 * Stage Prerequisite Guards:
 * Protects integrity so users cannot bypass upstream required modules.
 */
export function checkStageAccess(
  stageId: BuildStageId,
  project: AffiliateBuildProject
): StageAccessCheck {
  switch (stageId) {
    case 'INPUT':
      return { canAccess: true };

    case 'JOURNEY': {
      if (!project.readiness.isReady && !project.readiness.continuedAsHypothesis) {
        return {
          canAccess: false,
          reasonAr: 'كمّل المرحلة السابقة الأول علشان نحافظ على ترابط البناء (يجب استيفاء شروط الجاهزية أو الاستمرار كفرضية).',
          requiredStage: 'INPUT'
        };
      }
      return { canAccess: true };
    }

    case 'FUNNEL': {
      const journeyCheck = checkStageAccess('JOURNEY', project);
      if (!journeyCheck.canAccess) return journeyCheck;
      if (!project.customerJourney) {
        return {
          canAccess: false,
          reasonAr: 'كمّل مرحلة رحلة العميل (Customer Journey) الأول علشان نحافظ على ترابط البناء.',
          requiredStage: 'JOURNEY'
        };
      }
      return { canAccess: true };
    }

    case 'LEAD_MAGNET': {
      const funnelCheck = checkStageAccess('FUNNEL', project);
      if (!funnelCheck.canAccess) return funnelCheck;
      if (!project.funnelStrategy) {
        return {
          canAccess: false,
          reasonAr: 'كمّل مرحلة استراتيجية الفانل الأول علشان نحافظ على ترابط البناء.',
          requiredStage: 'FUNNEL'
        };
      }
      if (!project.funnelStrategy.confirmedByStudent) {
        return {
          canAccess: false,
          reasonAr: 'يجب تأكيد اختيار هذا الفانل أولاً بالضغط على زر "تأكيد اختيار هذا الفانل" قبل الانتقال للـLead Magnet.',
          requiredStage: 'FUNNEL'
        };
      }
      return { canAccess: true };
    }

    case 'PAGES': {
      const lmCheck = checkStageAccess('LEAD_MAGNET', project);
      if (!lmCheck.canAccess) return lmCheck;
      if (!project.leadMagnet) {
        return {
          canAccess: false,
          reasonAr: 'كمّل مرحلة الـLead Magnet واعتمد وعده وهيكله أولاً.',
          requiredStage: 'LEAD_MAGNET'
        };
      }
      return { canAccess: true };
    }

    case 'EMAIL': {
      const pagesCheck = checkStageAccess('PAGES', project);
      if (!pagesCheck.canAccess) return pagesCheck;
      if (!project.pages) {
        return {
          canAccess: false,
          reasonAr: 'كمّل مرحلة هندسة ونصوص الصفحات أولاً لبناء سلسلة الإيميلات المتوافقة معها.',
          requiredStage: 'PAGES'
        };
      }
      return { canAccess: true };
    }

    case 'AUTOMATION': {
      const emailCheck = checkStageAccess('EMAIL', project);
      if (!emailCheck.canAccess) return emailCheck;
      if (!project.emailSystem) {
        return {
          canAccess: false,
          reasonAr: 'كمّل مرحلة منظومة الإيميلات وسلسلة الرسائل أولاً لتصميم شروط ومسارات الأتمتة.',
          requiredStage: 'EMAIL'
        };
      }
      return { canAccess: true };
    }

    case 'TRACKING': {
      if (!project.funnelStrategy || !project.pages) {
        return {
          canAccess: false,
          reasonAr: 'خطة الـCTA والتتبع تتطلب وجود استراتيجية الفانل وهندسة الصفحات أولاً.',
          requiredStage: !project.funnelStrategy ? 'FUNNEL' : 'PAGES'
        };
      }
      return { canAccess: true };
    }

    case 'QA': {
      if (
        !project.customerJourney ||
        !project.funnelStrategy ||
        !project.pages ||
        !project.emailSystem
      ) {
        return {
          canAccess: false,
          reasonAr: 'فحص الجودة (Build QA) يتطلب اكتمال الوحدات الأساسية للبناء: رحلة العميل، الفانل، الصفحات، والإيميلات.',
          requiredStage: 'PAGES'
        };
      }
      return { canAccess: true };
    }

    case 'BLUEPRINT': {
      if (!project.qaAndBlueprint) {
        return {
          canAccess: false,
          reasonAr: 'المخطط التنفيذي النهائي وتسليم الترافيك يتطلب تشغيل فحص الجودة (Build QA) أولاً.',
          requiredStage: 'QA'
        };
      }
      return { canAccess: true };
    }

    default:
      return { canAccess: true };
  }
}

/**
 * Downstream Invalidation:
 * When an upstream module changes, safely clear all downstream dependent results.
 */
export function invalidateDownstream(
  prevProject: AffiliateBuildProject,
  changedStage: BuildStageId
): AffiliateBuildProject {
  const next = { ...prevProject, updatedAt: new Date().toISOString() };

  if (changedStage === 'INPUT') {
    next.customerJourney = null;
    next.funnelStrategy = null;
    next.leadMagnet = null;
    next.pages = null;
    next.emailSystem = null;
    next.automation = null;
    next.trackingAndCta = null;
    next.qaAndBlueprint = null;
  } else if (changedStage === 'JOURNEY') {
    next.funnelStrategy = null;
    next.leadMagnet = null;
    next.pages = null;
    next.emailSystem = null;
    next.automation = null;
    next.trackingAndCta = null;
    next.qaAndBlueprint = null;
  } else if (changedStage === 'FUNNEL') {
    next.leadMagnet = null;
    next.pages = null;
    next.emailSystem = null;
    next.automation = null;
    next.trackingAndCta = null;
    next.qaAndBlueprint = null;
  } else if (changedStage === 'LEAD_MAGNET') {
    next.pages = null;
    next.emailSystem = null;
    next.automation = null;
    next.trackingAndCta = null;
    next.qaAndBlueprint = null;
  } else if (changedStage === 'PAGES') {
    next.emailSystem = null;
    next.automation = null;
    next.trackingAndCta = null;
    next.qaAndBlueprint = null;
  } else if (changedStage === 'EMAIL') {
    next.automation = null;
    next.qaAndBlueprint = null;
  } else if (changedStage === 'AUTOMATION' || changedStage === 'TRACKING') {
    next.qaAndBlueprint = null;
  }

  return next;
}

/**
 * Deterministic Sanitizer for Blueprint Exports:
 * Strictly prevents any credential, token, key, secret, or connection config from leaking.
 */
export function sanitizeProjectForExport(
  project: AffiliateBuildProject,
  scores: any,
  finalStatus: string
) {
  const sanitizeDeep = (val: any): any => {
    if (!val || typeof val !== 'object') return val;
    if (Array.isArray(val)) return val.map(sanitizeDeep);

    const clean: Record<string, any> = {};
    for (const [key, prop] of Object.entries(val)) {
      const lower = key.toLowerCase();
      if (
        lower.includes('key') ||
        lower.includes('secret') ||
        lower.includes('token') ||
        lower.includes('auth') ||
        lower.includes('credential') ||
        lower.includes('password') ||
        lower.includes('connection')
      ) {
        continue;
      }
      clean[key] = sanitizeDeep(prop);
    }
    return clean;
  };

  const safe = sanitizeDeep(project);

  return {
    build_meta: {
      engine: 'Affiliate Build Engine — R.B.T.L.S Stage B',
      exportedAt: new Date().toISOString(),
      finalStatus,
      scores
    },
    research_input: safe.researchInput,
    customer_journey: safe.customerJourney,
    selected_funnel: safe.funnelStrategy,
    selected_lead_magnet: safe.leadMagnet,
    page_architecture: safe.pages,
    email_strategy: safe.emailSystem?.strategy,
    email_blueprint: safe.emailSystem?.blueprint,
    emails_copy: safe.emailSystem?.emailsCopy,
    automation: safe.automation,
    cta_map: safe.trackingAndCta?.ctaMap,
    tracking_plan: safe.trackingAndCta?.trackingEvents,
    qa: safe.qaAndBlueprint?.qaChecks,
    implementation_order: safe.qaAndBlueprint?.implementationOrder,
    next_action: safe.qaAndBlueprint?.oneActionFirstAr,
    traffic_handoff: safe.qaAndBlueprint?.trafficHandoff
  };
}
