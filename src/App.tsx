import React, { useState, useEffect, useMemo } from 'react';
import {
  AffiliateBuildProject,
  BuildStageId,
  CopyStatus,
  EmailPlatform,
  ExperimentLogItem,
  FunnelVersionSnapshot,
  GeneratedEmailCopy,
  LockedElementsMap,
  MessageMatchLink,
  PagesData,
  ProofItem,
  ResearchInput
} from './types/buildTypes';
import {
  AIConnectionConfig,
  NormalizedErrorCode
} from './types/aiConnection';
import {
  getStoredAIConnection,
  saveAIConnection
} from './utils/aiConnectionStorage';
import {
  createEmptyBuildProject,
  createEmptyResearchInput,
  checkStageAccess,
  invalidateDownstream,
  sanitizeProjectForExport,
  isLegacyDemoProject
} from './utils/projectState';
import { RESEARCH_PROJECT_PRESETS } from './data/presets';
import {
  calculateBuildIntegrityAndStatus,
  evaluateBuildReadiness
} from './utils/deterministicEngine';
import { TopBarAndSummary } from './components/TopBarAndSummary';
import { ContextSidebar } from './components/ContextSidebar';
import { AIConnectionModal } from './components/AIConnectionModal';
import { Stage1InputAndReadiness } from './components/Stage1InputAndReadiness';
import { Stage2JourneyAndMessageMatch } from './components/Stage2JourneyAndMessageMatch';
import { Stage3FunnelStrategy } from './components/Stage3FunnelStrategy';
import { Stage4LeadMagnet } from './components/Stage4LeadMagnet';
import { Stage5PagesArchitect } from './components/Stage5PagesArchitect';
import {
  Stage6EmailSystem,
  Stage7AutomationArchitect
} from './components/Stage6EmailAndStage7Automation';
import {
  Stage8TrackingAndCta,
  Stage9BuildQa,
  Stage10BuildBlueprint
} from './components/Stage8TrackingStage9QaAndBlueprint';
import { AlertTriangle, RefreshCw, Loader2, KeyRound } from 'lucide-react';

const STORAGE_KEY = 'rbtls_affiliate_build_engine_v1';

export default function App() {
  // Legacy State Migration: If stored project is an old demo project (e.g. demo-project-v1), discard it!
  const [project, setProject] = useState<AffiliateBuildProject>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && isLegacyDemoProject(parsed)) {
          const fresh = createEmptyBuildProject();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
          return fresh;
        }
        if (parsed && parsed.id && parsed.researchInput) {
          // Preserve genuine user projects
          return {
            ...parsed,
            schemaVersion: parsed.schemaVersion || 2
          };
        }
      }
    } catch {
      // Fallback
    }
    return createEmptyBuildProject();
  });

  // Problem 1 Fix: Universal Multi-Provider BYOK (session-only storage)
  const [aiConnection, setAiConnection] = useState<AIConnectionConfig | null>(() =>
    getStoredAIConnection()
  );
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessageAr, setLoadingMessageAr] = useState('');
  const [errorState, setErrorState] = useState<{
    messageAr: string;
    code: string;
    requestId: string;
    retryFn: (() => Promise<void>) | null;
  } | null>(null);
  const [mobileContextOpen, setMobileContextOpen] = useState(false);

  // Save project data to localStorage automatically (strictly without credentials)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch {
      // Ignore quota errors
    }
  }, [project]);

  // Deterministic readiness & integrity calculation
  const readiness = useMemo(
    () =>
      evaluateBuildReadiness(
        project.researchInput,
        project.readiness.continuedAsHypothesis
      ),
    [project.researchInput, project.readiness.continuedAsHypothesis]
  );

  const { scores: integrityScores, finalStatus, statusExplanationAr } = useMemo(
    () => calculateBuildIntegrityAndStatus({ ...project, readiness }),
    [project, readiness]
  );

  // Check if any locked module needs review due to missing upstream dependency
  const lockedModulesNeedingReview = useMemo(() => {
    const list: string[] = [];
    if (project.lockedElements.funnel && !project.customerJourney) {
      list.push('نموذج الفانل المختار');
    }
    if (project.lockedElements.leadMagnet && !project.funnelStrategy) {
      list.push('فكرة الـLead Magnet');
    }
    if (project.lockedElements.headline && !project.leadMagnet) {
      list.push('عنوان صفحة الهبوط');
    }
    if (project.lockedElements.emailSequence && !project.pages) {
      list.push('سلسلة الإيميلات');
    }
    return list;
  }, [project]);

  // Problem 4 Fix: Navigation Prerequisite Guards
  const handleSelectStage = (stage: BuildStageId) => {
    const access = checkStageAccess(stage, project);
    if (!access.canAccess) {
      setErrorState({
        messageAr: access.reasonAr || 'كمّل المرحلة السابقة الأول علشان نحافظ على ترابط البناء.',
        code: 'STAGE_LOCKED',
        requestId: '',
        retryFn: null
      });
      return;
    }

    setErrorState(null);
    setProject((prev) => ({
      ...prev,
      currentStage: stage,
      updatedAt: new Date().toISOString()
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Problem 3 Fix: Downstream Invalidation when Research Input Changes
  const handleUpdateResearchInput = (patch: Partial<ResearchInput>) => {
    setProject((prev) => {
      const nextInput = { ...prev.researchInput, ...patch };
      const nextReadiness = evaluateBuildReadiness(
        nextInput,
        prev.readiness.continuedAsHypothesis
      );

      // Safe Downstream Invalidation: clear downstream stages to avoid stale data
      const updated = {
        ...prev,
        researchInput: nextInput,
        readiness: nextReadiness,
        updatedAt: new Date().toISOString()
      };

      return invalidateDownstream(updated, 'INPUT');
    });
  };

  // Explicit demo preset loading (Only on demand, never default)
  const handleLoadPreset = (presetId: string) => {
    const found = RESEARCH_PROJECT_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    const nextReadiness = evaluateBuildReadiness(found.input, false);
    setProject((prev) => {
      const updated = {
        ...prev,
        researchInput: { ...found.input },
        readiness: nextReadiness,
        updatedAt: new Date().toISOString()
      };
      return invalidateDownstream(updated, 'INPUT');
    });
  };

  const handleContinueAsHypothesis = () => {
    setProject((prev) => ({
      ...prev,
      readiness: evaluateBuildReadiness(prev.researchInput, true),
      updatedAt: new Date().toISOString()
    }));
  };

  const handleToggleLock = (key: keyof LockedElementsMap) => {
    setProject((prev) => ({
      ...prev,
      lockedElements: {
        ...prev.lockedElements,
        [key]: !prev.lockedElements[key]
      }
    }));
  };

  const handleAddProof = (proof: Omit<ProofItem, 'id'>) => {
    setProject((prev) => ({
      ...prev,
      proofLibrary: [
        ...prev.proofLibrary,
        { ...proof, id: `proof-${Date.now()}` }
      ]
    }));
  };

  const handleRemoveProof = (id: string) => {
    setProject((prev) => ({
      ...prev,
      proofLibrary: prev.proofLibrary.filter((p) => p.id !== id)
    }));
  };

  const handleSaveProjectNow = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch {
      // Ignore
    }
  };

  const handleDuplicateProject = () => {
    setProject((prev) => ({
      ...prev,
      id: `proj-${Date.now()}`,
      researchInput: {
        ...prev.researchInput,
        projectName: `${prev.researchInput.projectName} (نسخة)`
      },
      updatedAt: new Date().toISOString()
    }));
  };

  // Problem 2 Fix: "مشروع جديد" creates empty project, never restores demo content
  const handleNewProject = () => {
    const empty = createEmptyBuildProject();
    setProject(empty);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(empty));
    } catch {
      // Ignore
    }
    setErrorState(null);
  };

  // Problem 2 Fix: Reset Current Module resets to null, NOT demo content
  const handleResetCurrentModule = () => {
    const stage = project.currentStage;
    setProject((prev) => {
      const copy = { ...prev, updatedAt: new Date().toISOString() };
      if (stage === 'INPUT') {
        copy.researchInput = createEmptyResearchInput();
        copy.readiness = evaluateBuildReadiness(copy.researchInput, false);
        return invalidateDownstream(copy, 'INPUT');
      } else if (stage === 'JOURNEY') {
        copy.customerJourney = null;
        return invalidateDownstream(copy, 'JOURNEY');
      } else if (stage === 'FUNNEL' && !prev.lockedElements.funnel) {
        copy.funnelStrategy = null;
        return invalidateDownstream(copy, 'FUNNEL');
      } else if (stage === 'LEAD_MAGNET' && !prev.lockedElements.leadMagnet) {
        copy.leadMagnet = null;
        return invalidateDownstream(copy, 'LEAD_MAGNET');
      } else if (stage === 'PAGES') {
        copy.pages = null;
        return invalidateDownstream(copy, 'PAGES');
      } else if (stage === 'EMAIL' && !prev.lockedElements.emailSequence) {
        copy.emailSystem = null;
        return invalidateDownstream(copy, 'EMAIL');
      } else if (stage === 'AUTOMATION') {
        copy.automation = null;
      } else if (stage === 'TRACKING') {
        copy.trackingAndCta = null;
      } else if (stage === 'QA' || stage === 'BLUEPRINT') {
        copy.qaAndBlueprint = null;
      }
      return copy;
    });
  };

  // Problem 10 Fix: Blueprint export strictly sanitized against credentials
  const handleExportBlueprintJson = () => {
    const sanitizedPayload = sanitizeProjectForExport(
      project,
      integrityScores,
      finalStatus
    );

    const blob = new Blob([JSON.stringify(sanitizedPayload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affiliate-build-blueprint-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Problem 6 & 7 Fix: Normalized Error Handling, Preserved Error Code, Unique Request IDs
  async function runAiOperation<T>(
    loadingMsg: string,
    endpoint: string,
    body: any,
    onSuccess: (data: T) => void
  ) {
    setIsGenerating(true);
    setLoadingMessageAr(loadingMsg);
    setErrorState(null);

    // Single consistent transport: credentials sent in JSON POST body over HTTPS
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...body,
          connectionConfig: aiConnection
        })
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        setErrorState({
          messageAr: 'فشل تحليل الاستجابة من الخادم.',
          code: 'INVALID_RESPONSE',
          requestId: `req_err_${Date.now()}`,
          retryFn: async () => runAiOperation(loadingMsg, endpoint, body, onSuccess)
        });
        return;
      }

      // 1. Check HTTP and normalized server failure
      if (!res.ok || json.success === false) {
        const serverCode: NormalizedErrorCode =
          json?.error?.code || `HTTP_${res.status}`;
        const serverMessage =
          json?.error?.message || 'حصلت مشكلة أثناء بناء هذا الجزء.';

        setErrorState({
          messageAr: serverMessage,
          code: serverCode,
          requestId: json?.requestId || 'unknown',
          retryFn: async () => runAiOperation(loadingMsg, endpoint, body, onSuccess)
        });
        return;
      }

      // 2. Structured Output Verification after success === true
      if (!json.data) {
        setErrorState({
          messageAr: 'لم يتم استلام محتوى صالح من المزود.',
          code: 'STRUCTURED_OUTPUT_FAILED',
          requestId: json.requestId || 'unknown',
          retryFn: async () => runAiOperation(loadingMsg, endpoint, body, onSuccess)
        });
        return;
      }

      onSuccess(json.data);
    } catch (err: any) {
      setErrorState({
        messageAr: 'تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت أو حالة السيرفر.',
        code: 'CONNECTION_FAILED',
        requestId: `req_conn_${Date.now()}`,
        retryFn: async () => runAiOperation(loadingMsg, endpoint, body, onSuccess)
      });
    } finally {
      setIsGenerating(false);
      setLoadingMessageAr('');
    }
  }

  // 1. Parse Raw Research Brief
  const handleParseRawBrief = async (rawBrief: string) => {
    await runAiOperation<Partial<ResearchInput>>(
      'بنستخرج بيانات البحث ونحلل الفجوات...',
      '/api/build/parse-brief',
      { rawBrief },
      (extracted) => {
        handleUpdateResearchInput({
          ...extracted,
          inputMethod: 'PASTE',
          researchIntegrityStatus: 'EXTRACTED FROM BRIEF'
        });
      }
    );
  };

  // 2. Generate Customer Journey (Fast Strategy First + Immediate Transition)
  const handleGenerateJourney = async () => {
    await runAiOperation<any>(
      'بنرسم استراتيجية رحلة العميل السريعة وبنراجع Message Match...',
      '/api/build/journey',
      {
        mode: 'journey_strategy',
        researchInput: project.researchInput,
        lockedElements: project.lockedElements
      },
      (data) => {
        setProject((prev) => {
          const updated = {
            ...prev,
            customerJourney: data,
            currentStage: 'JOURNEY' as BuildStageId
          };
          return invalidateDownstream(updated, 'JOURNEY');
        });
      }
    );
  };

  // On-demand: Deep diagnosis for journey
  const handleGenerateJourneyDetails = async (stepOrder = 1) => {
    await runAiOperation<any>(
      'بنحلل التفاصيل السلوكية والنفسية للمرحلة المحددة...',
      '/api/build/journey',
      {
        mode: 'journey_details',
        selectedStepOrder: stepOrder,
        researchInput: project.researchInput
      },
      (_data) => {
        // Detailed insights loaded
      }
    );
  };

  // 3. Generate Funnel Strategy (Phase A: Fast options comparison)
  const handleGenerateFunnel = async () => {
    if (project.lockedElements.funnel) return;
    await runAiOperation<any>(
      'بنقارن نماذج الفانل على 10 أبعاد استراتيجية...',
      '/api/build/funnel',
      {
        mode: 'funnel_options',
        researchInput: project.researchInput,
        customerJourney: project.customerJourney
      },
      (data) => {
        setProject((prev) => {
          const updated = {
            ...prev,
            funnelStrategy: {
              ...data,
              confirmedByStudent: false // Never auto-confirmed!
            }
          };
          return invalidateDownstream(updated, 'FUNNEL');
        });
      }
    );
  };

  // Phase B: On-demand Funnel Details (Expands map nodes & MVF for selected funnel)
  const handleExpandFunnelDetails = async () => {
    if (!project.funnelStrategy) return;
    await runAiOperation<any>(
      'بنبني تفاصيل خريطة الفانل والنسخة المصغرة للنموذج المختار...',
      '/api/build/funnel',
      {
        mode: 'funnel_details',
        selectedFunnelId: project.funnelStrategy.primaryFunnelId,
        researchInput: project.researchInput,
        customerJourney: project.customerJourney
      },
      (data) => {
        setProject((prev) => {
          if (!prev.funnelStrategy) return prev;
          return {
            ...prev,
            funnelStrategy: {
              ...prev.funnelStrategy,
              funnelMapNodes: data.funnelMapNodes || prev.funnelStrategy.funnelMapNodes,
              minimumViableFunnel: data.minimumViableFunnel || prev.funnelStrategy.minimumViableFunnel
            }
          };
        });
      }
    );
  };

  // 4. Generate Lead Magnet (Phase A: 5 evaluated concepts with scores)
  const handleGenerateLeadMagnet = async () => {
    if (project.lockedElements.leadMagnet) return;
    await runAiOperation<any>(
      'بنولد ونقيم 5 أفكار Lead Magnet متنوعة...',
      '/api/build/lead-magnet',
      {
        mode: 'lead_magnet_options',
        researchInput: project.researchInput,
        customerJourney: project.customerJourney,
        funnelStrategy: project.funnelStrategy
      },
      (data) => {
        setProject((prev) => {
          const updated = {
            ...prev,
            leadMagnet: {
              ...data,
              confirmedByStudent: false,
              promiseStatement:
                prev.lockedElements.promise && prev.leadMagnet
                  ? prev.leadMagnet.promiseStatement
                  : data.promiseStatement
            }
          };
          return invalidateDownstream(updated, 'LEAD_MAGNET');
        });
      }
    );
  };

  // Phase B: On-demand Lead Magnet Details (Sections, Actionable items, Offer Bridge)
  const handleGenerateLeadMagnetDetails = async () => {
    if (!project.leadMagnet) return;
    const currentConcept = project.leadMagnet.concepts.find(
      (c) => c.id === project.leadMagnet?.selectedConceptId
    );
    await runAiOperation<any>(
      'بنبني الهيكل التنفيذي التفصيلي والجسر للعرض...',
      '/api/build/lead-magnet',
      {
        mode: 'lead_magnet_details',
        selectedConceptId: project.leadMagnet.selectedConceptId,
        selectedConcept: currentConcept,
        researchInput: project.researchInput,
        customerJourney: project.customerJourney,
        funnelStrategy: project.funnelStrategy
      },
      (detailsData) => {
        setProject((prev) => {
          if (!prev.leadMagnet) return prev;
          return {
            ...prev,
            leadMagnet: {
              ...prev.leadMagnet,
              promiseStatement: prev.lockedElements.promise
                ? prev.leadMagnet.promiseStatement
                : detailsData.promiseStatement || prev.leadMagnet.promiseStatement,
              contentArchitecture:
                detailsData.contentArchitecture || prev.leadMagnet.contentArchitecture,
              offerBridge: detailsData.offerBridge || prev.leadMagnet.offerBridge
            }
          };
        });
      }
    );
  };

  // 5. Generate Pages (Phase A: Fast page purpose map & 10 headlines)
  const handleGeneratePages = async () => {
    await runAiOperation<PagesData>(
      'بنبني خريطة الصفحات ومحرك العناوين...',
      '/api/build/pages',
      {
        mode: 'pages_strategy',
        researchInput: project.researchInput,
        leadMagnet: project.leadMagnet,
        proofLibrary: project.proofLibrary
      },
      (data) => {
        setProject((prev) => {
          const updated = {
            ...prev,
            pages: {
              ...data,
              landingPage: {
                ...data.landingPage,
                headlineAr:
                  prev.lockedElements.headline && prev.pages
                    ? prev.pages.landingPage.headlineAr
                    : data.landingPage.headlineAr,
                ctaButtonTextAr:
                  prev.lockedElements.mainCta && prev.pages
                    ? prev.pages.landingPage.ctaButtonTextAr
                    : data.landingPage.ctaButtonTextAr,
                status: 'REVIEW' as CopyStatus
              },
              thankYouPage: { ...data.thankYouPage, status: 'REVIEW' as CopyStatus },
              bridgePage: { ...data.bridgePage, status: 'REVIEW' as CopyStatus },
              claimsAudit: []
            }
          };
          return invalidateDownstream(updated, 'PAGES');
        });
      }
    );
  };

  // Phase B: On-demand Page Details (Complete copy for all pages with selected headline)
  const handleGeneratePagesDetails = async () => {
    if (!project.pages) return;
    await runAiOperation<any>(
      'بنصيغ النصوص الكاملة لصفحة الهبوط والشكر والجسر...',
      '/api/build/pages',
      {
        mode: 'page_details',
        selectedHeadlineId: project.pages.landingPage.selectedHeadlineId,
        headlineText: project.pages.landingPage.headlineAr,
        researchInput: project.researchInput,
        leadMagnet: project.leadMagnet,
        proofLibrary: project.proofLibrary
      },
      (detailsData) => {
        setProject((prev) => {
          if (!prev.pages) return prev;
          return {
            ...prev,
            pages: {
              ...prev.pages,
              landingPage: {
                ...prev.pages.landingPage,
                ...detailsData.landingPage,
                headlineAr:
                  prev.lockedElements.headline && prev.pages
                    ? prev.pages.landingPage.headlineAr
                    : detailsData.landingPage?.headlineAr || prev.pages.landingPage.headlineAr,
                ctaButtonTextAr:
                  prev.lockedElements.mainCta && prev.pages
                    ? prev.pages.landingPage.ctaButtonTextAr
                    : detailsData.landingPage?.ctaButtonTextAr || prev.pages.landingPage.ctaButtonTextAr,
                status: 'REVIEW' as CopyStatus
              },
              thankYouPage: {
                ...prev.pages.thankYouPage,
                ...detailsData.thankYouPage,
                status: 'REVIEW' as CopyStatus
              },
              bridgePage: {
                ...prev.pages.bridgePage,
                ...detailsData.bridgePage,
                status: 'REVIEW' as CopyStatus
              },
              reviewComparisonPage: {
                ...prev.pages.reviewComparisonPage,
                ...detailsData.reviewComparisonPage
              }
            }
          };
        });
      }
    );
  };

  const handleRegenerateHeadlinesOnly = async () => {
    if (project.lockedElements.headline) return;
    await runAiOperation<any[]>(
      'بنولد زوايا عناوين جديدة مع الحفاظ على باقي المشروع...',
      '/api/build/regenerate-item',
      {
        targetType: 'REGENERATE_HEADLINES',
        project
      },
      (newHeadlines) => {
        if (Array.isArray(newHeadlines) && newHeadlines.length > 0) {
          setProject((prev) =>
            prev.pages
              ? {
                  ...prev,
                  pages: {
                    ...prev.pages,
                    headlineOptions: newHeadlines
                  }
                }
              : prev
          );
        }
      }
    );
  };

  // 6. Generate Email System (Phase A: Fast Strategy & Blueprint)
  const handleGenerateEmailSystem = async () => {
    if (project.lockedElements.emailSequence) return;
    await runAiOperation<any>(
      'بنحدد استراتيجية السلسلة ومخطط الإيميلات...',
      '/api/build/email',
      {
        mode: 'email_strategy',
        researchInput: project.researchInput,
        leadMagnet: project.leadMagnet,
        pages: project.pages
      },
      (data) => {
        setProject((prev) => {
          const updated = {
            ...prev,
            emailSystem: data
          };
          return invalidateDownstream(updated, 'EMAIL');
        });
      }
    );
  };

  // Phase B: On-demand All Emails Copy (Full rich direct-response copy)
  const handleGenerateAllEmailsCopy = async () => {
    if (project.lockedElements.emailSequence || !project.emailSystem) return;
    await runAiOperation<any>(
      'بنصيغ نصوص جميع الإيميلات الكاملة مع خيارات العناوين...',
      '/api/build/email',
      {
        mode: 'email_details',
        researchInput: project.researchInput,
        leadMagnet: project.leadMagnet,
        pages: project.pages,
        emailSystem: project.emailSystem
      },
      (detailsData) => {
        if (detailsData.emailsCopy && Array.isArray(detailsData.emailsCopy)) {
          setProject((prev) => {
            if (!prev.emailSystem) return prev;
            return {
              ...prev,
              emailSystem: {
                ...prev.emailSystem,
                emailsCopy: detailsData.emailsCopy
              }
            };
          });
        }
      }
    );
  };

  const handleRewriteSingleEmail = async (emailNumber: number) => {
    if (project.lockedElements.emailSequence) return;
    await runAiOperation<any>(
      `بنعيد صياغة الإيميل رقم ${emailNumber} مع الحفاظ على باقي السلسلة...`,
      '/api/build/regenerate-item',
      {
        targetType: 'REWRITE_EMAIL',
        emailNumber,
        project
      },
      (updatedEmail) => {
        setProject((prev) => {
          if (!prev.emailSystem) return prev;
          return {
            ...prev,
            emailSystem: {
              ...prev.emailSystem,
              emailsCopy: prev.emailSystem.emailsCopy.map((em) =>
                em.emailNumber === emailNumber
                  ? {
                      ...em,
                      ...updatedEmail,
                      subjectOptions: em.subjectOptions,
                      status: 'REVIEW' as CopyStatus
                    }
                  : em
              )
            }
          };
        });
      }
    );
  };

  // 7. Generate Automation (Phase A: Fast Taxonomy & Triggers)
  const handleGenerateAutomation = async (platform?: EmailPlatform) => {
    const chosenPlatform = platform || project.automation?.selectedPlatform || 'Platform-Agnostic';
    await runAiOperation<any>(
      'بنبني نظام التاجات وشروط الخروج الآمنة...',
      '/api/build/automation',
      {
        mode: 'automation_strategy',
        researchInput: project.researchInput,
        leadMagnet: project.leadMagnet,
        emailSystem: project.emailSystem,
        selectedPlatform: chosenPlatform
      },
      (data) => {
        setProject((prev) => {
          const updated = {
            ...prev,
            automation: data
          };
          return invalidateDownstream(updated, 'AUTOMATION');
        });
      }
    );
  };

  // Phase B: On-demand Automation Details (Workflow nodes & platform translation)
  const handleExpandAutomationDetails = async () => {
    if (!project.automation) return;
    await runAiOperation<any>(
      'بنبني مسارات سير العمل التفصيلية وترجمتها للمنصة...',
      '/api/build/automation',
      {
        mode: 'automation_details',
        researchInput: project.researchInput,
        leadMagnet: project.leadMagnet,
        emailSystem: project.emailSystem,
        selectedPlatform: project.automation.selectedPlatform
      },
      (detailsData) => {
        setProject((prev) => {
          if (!prev.automation) return prev;
          return {
            ...prev,
            automation: {
              ...prev.automation,
              workflowNodes: detailsData.workflowNodes || prev.automation.workflowNodes,
              platformTranslationNotesAr:
                detailsData.platformTranslationNotesAr || prev.automation.platformTranslationNotesAr
            }
          };
        });
      }
    );
  };

  // 8. Generate Tracking & CTA
  const handleGenerateTrackingCta = async () => {
    await runAiOperation<any>(
      'بنجهز خريطة الـCTA وخطة التتبع...',
      '/api/build/tracking-cta',
      {
        researchInput: project.researchInput,
        funnelStrategy: project.funnelStrategy,
        pages: project.pages
      },
      (data) => {
        setProject((prev) => {
          const updated = {
            ...prev,
            trackingAndCta: data
          };
          return invalidateDownstream(updated, 'TRACKING');
        });
      }
    );
  };

  // 9. Generate QA & Final Blueprint Synthesis
  const handleRunQaSynthesis = async () => {
    await runAiOperation<any>(
      'بنعمل QA للفانل...',
      '/api/build/qa-blueprint',
      { project },
      (data) => {
        setProject((prev) => ({
          ...prev,
          qaAndBlueprint: {
            ...data,
            scores: integrityScores,
            finalStatus,
            statusExplanationAr
          }
        }));
      }
    );
  };

  return (
    <div id="top" className="min-h-screen bg-[#040405] text-[#FCFCFA] flex flex-col">
      {/* Top Header, Persistent Project Summary Bar, and 10-Stage Stepper */}
      <TopBarAndSummary
        project={{ ...project, readiness }}
        currentStage={project.currentStage}
        onSelectStage={handleSelectStage}
        integrityScores={integrityScores}
        finalStatus={finalStatus}
        aiConnection={aiConnection}
        onOpenAIConnection={() => setAiModalOpen(true)}
        onOpenMobileContext={() => setMobileContextOpen(true)}
        onExportBlueprintJson={handleExportBlueprintJson}
      />

      {/* Meaningful Loading Banner */}
      {isGenerating && loadingMessageAr && (
        <div className="bg-[#23170D] border-b border-[#F5BF1E]/40 px-4 py-3 no-print">
          <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-3 text-sm font-bold text-[#FBD052]">
            <Loader2 className="w-4 h-4 text-[#F5BF1E] animate-spin" />
            <span>{loadingMessageAr}</span>
          </div>
        </div>
      )}

      {/* Locked Elements Needing Review Banner (Problem 9) */}
      {lockedModulesNeedingReview.length > 0 && (
        <div className="bg-amber-950/40 border-b border-amber-500/40 px-4 py-2.5 no-print text-xs text-amber-200">
          <div className="max-w-[1440px] mx-auto flex items-center gap-2">
            <span className="text-amber-400 font-bold">⚠️ العنصر المقفول يحتاج مراجعة:</span>
            <span>
              تم تعديل بيانات أسبق تؤثر على: <strong>{lockedModulesNeedingReview.join('، ')}</strong>. راجع ترابطها مع المعطيات الجديدة.
            </span>
          </div>
        </div>
      )}

      {/* Normalized Arabic Error State Banner (Problem 6 & 7) */}
      {errorState && (
        <div className="bg-red-950/70 border-b border-red-500/50 px-4 py-3.5 no-print animate-in fade-in">
          <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-red-200 font-bold">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>تعذر إنشاء هذا الجزء: {errorState.messageAr}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-red-300/80 font-mono">
                {errorState.code && (
                  <span className="bg-red-900/40 px-2 py-0.5 rounded border border-red-500/30">
                    Debug Code: <bdi dir="ltr">{errorState.code}</bdi>
                  </span>
                )}
                {errorState.requestId && (
                  <span className="bg-red-900/40 px-2 py-0.5 rounded border border-red-500/30">
                    Request ID: <bdi dir="ltr">{errorState.requestId}</bdi>
                  </span>
                )}
                <span className="text-emerald-300/80 font-sans">
                  (تم الحفاظ على جميع المراحل المكتملة بأمان)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {errorState.code === 'MISSING_PROVIDER_CONFIG' && (
                <button
                  type="button"
                  onClick={() => setAiModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-xs rounded-lg flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>ربط مزود AI الآن</span>
                </button>
              )}
              {errorState.retryFn && (
                <button
                  type="button"
                  onClick={() => errorState.retryFn && errorState.retryFn()}
                  className="px-4 py-1.5 bg-[#141216] hover:bg-[#23170D] border border-white/20 text-[#FCFCFA] font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#F5BF1E]" />
                  <span>إعادة المحاولة</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main 1440px Workspace with Persistent Context Sidebar */}
      <div className="max-w-[1440px] w-full mx-auto flex-1 flex items-start gap-6 px-4 sm:px-6 py-6">
        {/* Persistent Context Sidebar */}
        <ContextSidebar
          project={{ ...project, readiness }}
          onToggleLock={handleToggleLock}
          onAddProof={handleAddProof}
          onRemoveProof={handleRemoveProof}
          onTogglePersonalExperience={(val) =>
            handleUpdateResearchInput({ personalExperienceConfirmed: val })
          }
          onRenameProject={(newName) =>
            handleUpdateResearchInput({ projectName: newName })
          }
          onDuplicateProject={handleDuplicateProject}
          onResetCurrentModule={handleResetCurrentModule}
          onNewProject={handleNewProject}
          onSaveProjectNow={handleSaveProjectNow}
          mobileOpen={mobileContextOpen}
          onCloseMobile={() => setMobileContextOpen(false)}
        />

        {/* Active Stage Viewport */}
        <main className="flex-1 min-w-0 pb-16">
          {project.currentStage === 'INPUT' && (
            <Stage1InputAndReadiness
              researchInput={project.researchInput}
              readiness={readiness}
              onUpdateInput={handleUpdateResearchInput}
              onLoadPreset={handleLoadPreset}
              onParseRawBrief={handleParseRawBrief}
              onContinueAsHypothesis={handleContinueAsHypothesis}
              onProceedToJourney={() => handleSelectStage('JOURNEY')}
              isGenerating={isGenerating}
              lockedAudience={project.lockedElements.audience}
            />
          )}

          {project.currentStage === 'JOURNEY' && (
            <Stage2JourneyAndMessageMatch
              journey={project.customerJourney}
              onGenerateJourney={handleGenerateJourney}
              onUpdateMessageChain={(
                updatedChain: MessageMatchLink[],
                overallStatus: 'ALIGNED' | 'MESSAGE MISMATCH',
                reason?: string
              ) => {
                setProject((prev) =>
                  prev.customerJourney
                    ? {
                        ...prev,
                        customerJourney: {
                          ...prev.customerJourney,
                          messageMatchChain: updatedChain,
                          overallMessageMatchStatus: overallStatus,
                          messageMismatchReason: reason
                        }
                      }
                    : prev
                );
              }}
              onProceedToFunnel={() => handleSelectStage('FUNNEL')}
              isGenerating={isGenerating}
            />
          )}

          {project.currentStage === 'FUNNEL' && (
            <Stage3FunnelStrategy
              funnelStrategy={project.funnelStrategy}
              onGenerateFunnel={handleGenerateFunnel}
              onSelectPrimaryFunnel={(modelId) => {
                if (project.lockedElements.funnel) return;
                setProject((prev) => {
                  if (!prev.funnelStrategy) return prev;
                  // Problem 5 & 3: Unconfirm primary funnel on selection and invalidate downstream
                  const updatedFunnel = {
                    ...prev.funnelStrategy,
                    primaryFunnelId: modelId,
                    confirmedByStudent: false
                  };
                  return invalidateDownstream(
                    { ...prev, funnelStrategy: updatedFunnel },
                    'FUNNEL'
                  );
                });
              }}
              onConfirmFunnel={() => {
                setProject((prev) =>
                  prev.funnelStrategy
                    ? {
                        ...prev,
                        funnelStrategy: {
                          ...prev.funnelStrategy,
                          confirmedByStudent: true
                        }
                      }
                    : prev
                );
              }}
              isFunnelLocked={project.lockedElements.funnel}
              onToggleFunnelLock={() => handleToggleLock('funnel')}
              onProceedToLeadMagnet={() => handleSelectStage('LEAD_MAGNET')}
              isGenerating={isGenerating}
            />
          )}

          {project.currentStage === 'LEAD_MAGNET' && (
            <Stage4LeadMagnet
              leadMagnet={project.leadMagnet}
              onGenerateLeadMagnet={handleGenerateLeadMagnet}
              onSelectConcept={(conceptId) => {
                if (project.lockedElements.leadMagnet) return;
                setProject((prev) => {
                  if (!prev.leadMagnet) return prev;
                  const chosen = prev.leadMagnet.concepts.find(
                    (c) => c.id === conceptId
                  );
                  const updatedLeadMagnet = {
                    ...prev.leadMagnet,
                    selectedConceptId: conceptId,
                    promiseStatement:
                      chosen && !prev.lockedElements.promise
                        ? {
                            ...prev.leadMagnet.promiseStatement,
                            fullPromiseAr: chosen.promiseAr
                          }
                        : prev.leadMagnet.promiseStatement
                  };
                  return invalidateDownstream(
                    { ...prev, leadMagnet: updatedLeadMagnet },
                    'LEAD_MAGNET'
                  );
                });
              }}
              onUpdatePromise={(newPromiseText, status) => {
                setProject((prev) =>
                  prev.leadMagnet
                    ? {
                        ...prev,
                        leadMagnet: {
                          ...prev.leadMagnet,
                          promiseStatement: {
                            ...prev.leadMagnet.promiseStatement,
                            fullPromiseAr: newPromiseText,
                            status
                          }
                        }
                      }
                    : prev
                );
              }}
              isLeadMagnetLocked={project.lockedElements.leadMagnet}
              onToggleLeadMagnetLock={() => handleToggleLock('leadMagnet')}
              isPromiseLocked={project.lockedElements.promise}
              onTogglePromiseLock={() => handleToggleLock('promise')}
              onProceedToPages={() => handleSelectStage('PAGES')}
              isGenerating={isGenerating}
            />
          )}

          {project.currentStage === 'PAGES' && (
            <Stage5PagesArchitect
              project={project}
              pages={project.pages}
              onGeneratePages={handleGeneratePages}
              onRegenerateHeadlines={handleRegenerateHeadlinesOnly}
              onSelectHeadline={(headlineId, headlineText) => {
                if (project.lockedElements.headline) return;
                setProject((prev) =>
                  prev.pages
                    ? {
                        ...prev,
                        pages: {
                          ...prev.pages,
                          landingPage: {
                            ...prev.pages.landingPage,
                            selectedHeadlineId: headlineId,
                            headlineAr: headlineText
                          }
                        }
                      }
                    : prev
                );
              }}
              onUpdateLandingCopy={(patch) => {
                setProject((prev) =>
                  prev.pages
                    ? {
                        ...prev,
                        pages: {
                          ...prev.pages,
                          landingPage: {
                            ...prev.pages.landingPage,
                            ...patch
                          }
                        }
                      }
                    : prev
                );
              }}
              onUpdateBridgeCopy={(patch) => {
                setProject((prev) =>
                  prev.pages
                    ? {
                        ...prev,
                        pages: {
                          ...prev.pages,
                          bridgePage: {
                            ...prev.pages.bridgePage,
                            ...patch
                          }
                        }
                      }
                    : prev
                );
              }}
              isHeadlineLocked={project.lockedElements.headline}
              onToggleHeadlineLock={() => handleToggleLock('headline')}
              isMainCtaLocked={project.lockedElements.mainCta}
              onToggleMainCtaLock={() => handleToggleLock('mainCta')}
              onProceedToEmail={() => handleSelectStage('EMAIL')}
              isGenerating={isGenerating}
            />
          )}

          {project.currentStage === 'EMAIL' && (
            <Stage6EmailSystem
              emailSystem={project.emailSystem}
              onGenerateEmailSystem={handleGenerateEmailSystem}
              onRewriteSingleEmail={handleRewriteSingleEmail}
              onUpdateEmailCopy={(
                emailNumber: number,
                patch: Partial<GeneratedEmailCopy>
              ) => {
                setProject((prev) =>
                  prev.emailSystem
                    ? {
                        ...prev,
                        emailSystem: {
                          ...prev.emailSystem,
                          emailsCopy: prev.emailSystem.emailsCopy.map((em) =>
                            em.emailNumber === emailNumber
                              ? { ...em, ...patch }
                              : em
                          )
                        }
                      }
                    : prev
                );
              }}
              isEmailSequenceLocked={project.lockedElements.emailSequence}
              onToggleEmailLock={() => handleToggleLock('emailSequence')}
              onProceedToAutomation={() => handleSelectStage('AUTOMATION')}
              isGenerating={isGenerating}
            />
          )}

          {project.currentStage === 'AUTOMATION' && (
            <Stage7AutomationArchitect
              automation={project.automation}
              onGenerateAutomation={handleGenerateAutomation}
              onSelectPlatform={(platform) => {
                setProject((prev) =>
                  prev.automation
                    ? {
                        ...prev,
                        automation: {
                          ...prev.automation,
                          selectedPlatform: platform
                        }
                      }
                    : prev
                );
              }}
              onProceedToTracking={() => handleSelectStage('TRACKING')}
              isGenerating={isGenerating}
            />
          )}

          {project.currentStage === 'TRACKING' && (
            <Stage8TrackingAndCta
              trackingAndCta={project.trackingAndCta}
              onGenerateTrackingCta={handleGenerateTrackingCta}
              onProceedToQa={() => handleSelectStage('QA')}
              isGenerating={isGenerating}
            />
          )}

          {project.currentStage === 'QA' && (
            <Stage9BuildQa
              project={project}
              qaAndBlueprint={project.qaAndBlueprint}
              integrityScores={integrityScores}
              finalStatus={finalStatus}
              statusExplanationAr={statusExplanationAr}
              onRunQaSynthesis={handleRunQaSynthesis}
              onProceedToBlueprint={() => handleSelectStage('BLUEPRINT')}
              isGenerating={isGenerating}
            />
          )}

          {project.currentStage === 'BLUEPRINT' && (
            <Stage10BuildBlueprint
              project={project}
              integrityScores={integrityScores}
              finalStatus={finalStatus}
              statusExplanationAr={statusExplanationAr}
              onCreateNewVersion={(
                snapshot: Omit<FunnelVersionSnapshot, 'versionId' | 'createdAt'>
              ) => {
                setProject((prev) => ({
                  ...prev,
                  versions: [
                    ...prev.versions,
                    {
                      ...snapshot,
                      versionId: `v-${Date.now()}`,
                      createdAt: new Date().toISOString()
                    }
                  ]
                }));
              }}
              onAddExperiment={(exp: Omit<ExperimentLogItem, 'id'>) => {
                setProject((prev) => ({
                  ...prev,
                  experiments: [
                    ...prev.experiments,
                    { ...exp, id: `exp-${Date.now()}` }
                  ]
                }));
              }}
              onExportJson={handleExportBlueprintJson}
            />
          )}
        </main>
      </div>

      {/* Universal AI Provider BYOK Modal */}
      <AIConnectionModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onConnectionUpdated={(newConfig) => {
          setAiConnection(newConfig);
          if (newConfig && errorState?.code === 'MISSING_PROVIDER_CONFIG') {
            setErrorState(null);
          }
        }}
      />
    </div>
  );
}
