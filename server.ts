import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Type } from '@google/genai';
import {
  AIProviderManager,
  generateRequestId
} from './src/server/aiProviderManager.js';
import { AIConnectionConfig } from './src/types/aiConnection.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '2mb' }));

/**
 * Extracts AI Connection Config safely from headers or request body.
 * Supports: Google Gemini, OpenAI, Anthropic Claude, OpenAI-Compatible.
 * Never requires owner GEMINI_API_KEY.
 */
function extractConnectionConfig(req: express.Request, allowServerFallback = false): AIConnectionConfig | null {
  // 1. Check body if passed explicitly
  if (req.body?.connectionConfig && req.body.connectionConfig.apiKey) {
    return {
      provider: req.body.connectionConfig.provider,
      apiKey: String(req.body.connectionConfig.apiKey).trim(),
      model: String(req.body.connectionConfig.model).trim(),
      baseUrl: req.body.connectionConfig.baseUrl ? String(req.body.connectionConfig.baseUrl).trim() : null,
      providerName: req.body.connectionConfig.providerName ? String(req.body.connectionConfig.providerName).trim() : null
    };
  }

  // 2. Check HTTP headers (x-ai-provider, x-ai-api-key, etc.)
  const provider = req.headers['x-ai-provider'] as any;
  const apiKey = req.headers['x-ai-api-key'] as string;
  const model = req.headers['x-ai-model'] as string;
  const rawBaseUrl = req.headers['x-ai-base-url'] as string;
  const rawProviderName = req.headers['x-ai-provider-name'] as string;

  if (provider && apiKey) {
    return {
      provider,
      apiKey: apiKey.trim(),
      model: (model || 'gemini-2.5-flash').trim(),
      baseUrl: rawBaseUrl ? decodeURIComponent(rawBaseUrl).trim() : null,
      providerName: rawProviderName ? decodeURIComponent(rawProviderName).trim() : null
    };
  }

  // 3. Optional fallback: Only when explicitly permitted (not by default for BYOK)
  if (
    allowServerFallback &&
    process.env.GEMINI_API_KEY &&
    !process.env.GEMINI_API_KEY.includes('MY_GEMINI_API_KEY') &&
    process.env.GEMINI_API_KEY.length > 15
  ) {
    return {
      provider: 'gemini',
      apiKey: process.env.GEMINI_API_KEY.trim(),
      model: 'gemini-2.5-flash',
      baseUrl: null,
      providerName: 'Google Gemini'
    };
  }

  return null;
}

const SYSTEM_BASE_PROMPT = `أنت مهندس معماري لمنظومات الأفلييت (Affiliate Funnel Architect & Direct Response Strategist) في المرحلة الثانية (B — Build) من نظام R.B.T.L.S.
المبدأ الحاكم: "الفانل مش مجموعة صفحات — الفانل رحلة قرار منظمة (A Funnel Is Not a Collection of Pages. A Funnel Is a Guided Decision Journey)."

قواعد صارمة لا يمكن كسرها:
1. كل مخرج يجب أن يرتبط مباشرة بـ: الجمهور المحدد (Audience)، المشكلة الأساسية (Problem)، النتيجة المرغوبة (Desired Outcome)، العرض المختار (Offer)، مصدر الترافيك (Traffic Source)، مستوى الوعي (Awareness Stage)، ودرجة ثقة البحث (Research Confidence).
2. ممنوع تمامًا اختلاق شهادات عملاء وهمية (Fake Testimonials) أو إحصائيات غير موثقة أو ندرة زائفة (Fake Scarcity) أو وعود ثراء سريع. استخدم عناصر نائبة مثل [أضف شهادة موثقة هنا] عند عدم وجود إثبات في مكتبة الإثبات.
3. ممنوع الادعاء بأن المسوق جرب المنتج شخصيًا إلا إذا كان personalExperienceConfirmed = true.
4. احترم العناصر المقفلة (lockedElements) ولا تقم بتغييرها.
5. إذا كانت ثقة البحث (researchConfidence) أقل من 50، قلّص حجم الفانل تلقائيًا إلى أقل نسخة قابلة للاختبار (Minimum Viable Funnel).
6. اكتب بلغة عربية طبيعية، واضحة، احترافية، ومباشرة بدون حشو أو مصطلحات شركات جوفاء.`;

// ==========================================
// AI Connection & Discovery Endpoints
// ==========================================

app.post('/api/ai/test-connection', async (req, res) => {
  const config = extractConnectionConfig(req);
  if (!config) {
    return res.status(400).json({
      success: false,
      requestId: generateRequestId('req_test'),
      error: {
        code: 'MISSING_PROVIDER_CONFIG',
        message: 'يرجى إدخال مفتاح API واختيار المزود لاختبار الاتصال.'
      }
    });
  }

  const result = await AIProviderManager.testConnection(config);
  return res.json({
    success: result.success,
    requestId: generateRequestId('req_test'),
    provider: result.provider,
    model: result.model,
    discoveredModels: result.discoveredModels,
    data: { message: result.messageAr },
    error: result.error
  });
});

app.post('/api/ai/models', async (req, res) => {
  const config = extractConnectionConfig(req);
  if (!config) {
    return res.status(400).json({
      success: false,
      requestId: generateRequestId('req_models'),
      error: {
        code: 'MISSING_PROVIDER_CONFIG',
        message: 'يرجى إدخال مفتاح API الخاص بالمزود لتحديث قائمة الموديلات.'
      }
    });
  }

  try {
    const models = await AIProviderManager.discoverModels(config);
    return res.json({
      success: true,
      requestId: generateRequestId('req_models'),
      provider: config.provider,
      data: { models }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      requestId: generateRequestId('req_models'),
      provider: config.provider,
      error: {
        code: 'CONNECTION_FAILED',
        message: err.message || 'فشل جلب قائمة الموديلات من المزود.'
      }
    });
  }
});

// ==========================================
// Build Engine AI Endpoints
// ==========================================

// 1. Parse Research Brief
app.post('/api/build/parse-brief', async (req, res) => {
  const requestId = generateRequestId('req_parse');
  const config = extractConnectionConfig(req);
  const { rawBrief } = req.body;

  const result = await AIProviderManager.generateStructured({
    task: 'PARSE_BRIEF',
    systemInstruction: SYSTEM_BASE_PROMPT,
    prompt: `استخرج بيانات البحث التسويقي التالية من النص أو الـJSON الملصق، وضعها في الحقول المطلوبة باللغة العربية الواضحة:\n\n${rawBrief}`,
    schema: {
      type: Type.OBJECT,
      properties: {
        projectName: { type: Type.STRING },
        market: { type: Type.STRING },
        niche: { type: Type.STRING },
        audience: { type: Type.STRING },
        primaryProblem: { type: Type.STRING },
        desiredOutcome: { type: Type.STRING },
        offerCategory: { type: Type.STRING },
        selectedOffer: { type: Type.STRING },
        trafficHypothesis: { type: Type.STRING },
        primaryContentChannel: { type: Type.STRING },
        awarenessStage: {
          type: Type.STRING,
          description: 'One of: Unaware, Problem Aware, Solution Aware, Product Aware, Most Aware'
        },
        ctaGoal: { type: Type.STRING },
        businessModel: { type: Type.STRING },
        evidence: { type: Type.STRING },
        researchConfidence: { type: Type.INTEGER },
        buyerIntent: { type: Type.STRING },
        audienceObjections: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        strategicRisks: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: [
        'projectName',
        'market',
        'niche',
        'audience',
        'primaryProblem',
        'desiredOutcome',
        'selectedOffer',
        'trafficHypothesis',
        'awarenessStage',
        'researchConfidence',
        'audienceObjections'
      ]
    },
    connectionConfig: config,
    requestId
  });

  return res.json(result);
});

// 2. Stage 1 — Customer Journey Architect + Awareness Engine + Message Match
// Supports: mode: 'journey_strategy' (Fast decision first) | mode: 'journey_details' (On-demand expansion)
app.post('/api/build/journey', async (req, res) => {
  const requestId = generateRequestId('req_journey');
  const config = extractConnectionConfig(req);
  const { researchInput, lockedElements, mode = 'journey_strategy', selectedStepOrder } = req.body;

  if (mode === 'journey_details') {
    const prompt = `أنت تصمم تفاصيل إضافية وتشخيصاً معمقاً لمرحلة محددة في رحلة العميل (Customer Journey Deep Diagnostics):
المدخلات: ${JSON.stringify(researchInput)}
المرحلة المستهدفة: ${selectedStepOrder || 1}
قم بتقديم تفاصيل سلوكية ونفسية دقيقة ومكثفة لتلك المرحلة بدون إطالة زائدة.`;

    const result = await AIProviderManager.generateStructured({
      task: 'GENERATE_JOURNEY_DETAILS',
      systemInstruction: SYSTEM_BASE_PROMPT,
      prompt,
      schema: {
        type: Type.OBJECT,
        properties: {
          stepOrder: { type: Type.INTEGER },
          deepMindsetAnalysisAr: { type: Type.STRING },
          recommendedFrictionReducersAr: { type: Type.ARRAY, items: { type: Type.STRING } },
          trustSignalsNeededAr: { type: Type.ARRAY, items: { type: Type.STRING } },
          microCommitmentAdviceAr: { type: Type.STRING }
        },
        required: [
          'stepOrder',
          'deepMindsetAnalysisAr',
          'recommendedFrictionReducersAr',
          'trustSignalsNeededAr',
          'microCommitmentAdviceAr'
        ]
      },
      connectionConfig: config,
      requestId
    });

    return res.json(result);
  }

  // Fast Decision First: journey_strategy
  const prompt = `بناءً على مدخلات البحث، قم بإنشاء استراتيجية رحلة العميل السريعة وعالية الأثر (Customer Journey Strategy):
المطلوب إجابة مركزة وسريعة (Concise & High-Impact) بدون حشو إنشائي لتمكين الطالب من اتخاذ القرار فوراً:
البحث: ${JSON.stringify(researchInput, null, 2)}
العناصر المقفلة: ${JSON.stringify(lockedElements || {})}`;

  const result = await AIProviderManager.generateStructured({
    task: 'GENERATE_JOURNEY_STRATEGY',
    systemInstruction: SYSTEM_BASE_PROMPT,
    prompt,
    schema: {
      type: Type.OBJECT,
      properties: {
        currentState: { type: Type.STRING },
        problemAwarenessAnalysis: { type: Type.STRING },
        triggerEvent: { type: Type.STRING },
        searchDiscoveryBehavior: { type: Type.STRING },
        contentEntryPoint: { type: Type.STRING },
        questionInMind: { type: Type.STRING },
        primaryObjection: { type: Type.STRING },
        trustGap: { type: Type.STRING },
        desiredOutcome: { type: Type.STRING },
        commitmentLevel: { type: Type.STRING },
        offerReadiness: { type: Type.STRING },
        purchaseFriction: { type: Type.STRING },
        decisionTrigger: { type: Type.STRING },
        desiredNextStep: { type: Type.STRING },
        journeySteps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              stepOrder: { type: Type.INTEGER },
              stageNameEn: { type: Type.STRING },
              stageNameAr: { type: Type.STRING },
              visitorMindset: { type: Type.STRING },
              messageFocus: { type: Type.STRING },
              recommendedAction: { type: Type.STRING }
            },
            required: [
              'stepOrder',
              'stageNameEn',
              'stageNameAr',
              'visitorMindset',
              'messageFocus',
              'recommendedAction'
            ]
          }
        },
        awarenessEngine: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              level: { type: Type.STRING },
              labelAr: { type: Type.STRING },
              isCurrentTarget: { type: Type.BOOLEAN },
              messageFocus: { type: Type.STRING },
              recommendedCta: { type: Type.STRING },
              warningNotToSay: { type: Type.STRING }
            },
            required: [
              'level',
              'labelAr',
              'isCurrentTarget',
              'messageFocus',
              'recommendedCta',
              'warningNotToSay'
            ]
          }
        },
        messageMatchChain: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              step: { type: Type.STRING },
              stepAr: { type: Type.STRING },
              promiseText: { type: Type.STRING },
              status: {
                type: Type.STRING,
                description: 'ALIGNED or MESSAGE MISMATCH or DRIFT WARNING'
              },
              diagnosticNote: { type: Type.STRING }
            },
            required: ['step', 'stepAr', 'promiseText', 'status', 'diagnosticNote']
          }
        },
        overallMessageMatchStatus: {
          type: Type.STRING,
          description: 'ALIGNED or MESSAGE MISMATCH'
        },
        messageMismatchReason: { type: Type.STRING }
      },
      required: [
        'currentState',
        'problemAwarenessAnalysis',
        'triggerEvent',
        'searchDiscoveryBehavior',
        'contentEntryPoint',
        'questionInMind',
        'primaryObjection',
        'trustGap',
        'desiredOutcome',
        'commitmentLevel',
        'offerReadiness',
        'purchaseFriction',
        'decisionTrigger',
        'desiredNextStep',
        'journeySteps',
        'awarenessEngine',
        'messageMatchChain',
        'overallMessageMatchStatus'
      ]
    },
    connectionConfig: config,
    requestId
  });

  return res.json(result);
});

// 3. Stage 2 — Funnel Strategy (Supports: mode: 'funnel_options' | mode: 'funnel_details')
// Critical: confirmedByStudent is always false upon AI generation
app.post('/api/build/funnel', async (req, res) => {
  const requestId = generateRequestId('req_funnel');
  const config = extractConnectionConfig(req);
  const { researchInput, customerJourney, mode = 'funnel_options', selectedFunnelId } = req.body;

  if (mode === 'funnel_details') {
    const prompt = `أنت مهندس الفانل المعماري (Funnel Architect). قم ببناء خريطة تدفق الفانل البصرية الكاملة والنسخة المصغرة القابلة للتشغيل (Minimum Viable Funnel) للنموذج المختار:
الفانل المختار: ${selectedFunnelId || 'النموذج الموصى به'}
البحث: ${JSON.stringify(researchInput)}
رحلة العميل: ${JSON.stringify(customerJourney)}`;

    const result = await AIProviderManager.generateStructured({
      task: 'GENERATE_FUNNEL_DETAILS',
      systemInstruction: SYSTEM_BASE_PROMPT,
      prompt,
      schema: {
        type: Type.OBJECT,
        properties: {
          funnelMapNodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                order: { type: Type.INTEGER },
                nodeTitleAr: { type: Type.STRING },
                nodeTypeEn: { type: Type.STRING },
                purpose: { type: Type.STRING },
                visitorQuestion: { type: Type.STRING },
                mainMessage: { type: Type.STRING },
                cta: { type: Type.STRING },
                trackingEvent: { type: Type.STRING }
              },
              required: [
                'id',
                'order',
                'nodeTitleAr',
                'nodeTypeEn',
                'purpose',
                'visitorQuestion',
                'mainMessage',
                'cta',
                'trackingEvent'
              ]
            }
          },
          minimumViableFunnel: {
            type: Type.OBJECT,
            properties: {
              minimumBuild: { type: Type.ARRAY, items: { type: Type.STRING } },
              optionalLater: { type: Type.ARRAY, items: { type: Type.STRING } },
              scaleVersion: { type: Type.ARRAY, items: { type: Type.STRING } },
              overbuildWarningAr: { type: Type.STRING }
            },
            required: ['minimumBuild', 'optionalLater', 'scaleVersion', 'overbuildWarningAr']
          }
        },
        required: ['funnelMapNodes', 'minimumViableFunnel']
      },
      connectionConfig: config,
      requestId
    });

    return res.json(result);
  }

  // Phase A: funnel_options (Fast Decision First)
  const prompt = `بناءً على مدخلات البحث ورحلة العميل، قيّم 4 نماذج فانل مختلفة على 10 أبعاد، واختر الأنسب مع تقديم خريطة الفانل والنسخة المصغرة بسرعة ودقة:
البحث: ${JSON.stringify(researchInput)}
رحلة العميل: ${JSON.stringify(customerJourney)}`;

  const result = await AIProviderManager.generateStructured({
    task: 'GENERATE_FUNNEL_OPTIONS',
    systemInstruction: SYSTEM_BASE_PROMPT,
    prompt,
    schema: {
      type: Type.OBJECT,
      properties: {
        evaluatedModels: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              nameEn: { type: Type.STRING },
              nameAr: { type: Type.STRING },
              summaryAr: { type: Type.STRING },
              badge: {
                type: Type.STRING,
                description:
                  'One of: BEST STARTING MODEL, VALID ALTERNATIVE, TEST LATER, TOO COMPLEX NOW, NOT RECOMMENDED'
              },
              dimensions: {
                type: Type.OBJECT,
                properties: {
                  trafficFit: { type: Type.INTEGER },
                  audienceAwarenessFit: { type: Type.INTEGER },
                  trustRequirement: { type: Type.INTEGER },
                  offerComplexity: { type: Type.INTEGER },
                  purchaseFriction: { type: Type.INTEGER },
                  emailOpportunity: { type: Type.INTEGER },
                  implementationDifficulty: { type: Type.INTEGER },
                  speedToLaunch: { type: Type.INTEGER },
                  trackingClarity: { type: Type.INTEGER },
                  longTermAssetValue: { type: Type.INTEGER }
                },
                required: [
                  'trafficFit',
                  'audienceAwarenessFit',
                  'trustRequirement',
                  'offerComplexity',
                  'purchaseFriction',
                  'emailOpportunity',
                  'implementationDifficulty',
                  'speedToLaunch',
                  'trackingClarity',
                  'longTermAssetValue'
                ]
              },
              tradeoffsAr: { type: Type.STRING },
              whyFitsOrFailsAr: { type: Type.STRING }
            },
            required: [
              'id',
              'nameEn',
              'nameAr',
              'summaryAr',
              'badge',
              'dimensions',
              'tradeoffsAr',
              'whyFitsOrFailsAr'
            ]
          }
        },
        primaryFunnelId: { type: Type.STRING },
        secondaryFunnelId: { type: Type.STRING },
        whyPrimaryFitsAr: { type: Type.STRING },
        mainRiskAr: { type: Type.STRING },
        whatMustBeTrueAr: { type: Type.STRING },
        doNotBuildYetAr: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        funnelMapNodes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              order: { type: Type.INTEGER },
              nodeTitleAr: { type: Type.STRING },
              nodeTypeEn: { type: Type.STRING },
              purpose: { type: Type.STRING },
              visitorQuestion: { type: Type.STRING },
              mainMessage: { type: Type.STRING },
              cta: { type: Type.STRING },
              trackingEvent: { type: Type.STRING }
            },
            required: [
              'id',
              'order',
              'nodeTitleAr',
              'nodeTypeEn',
              'purpose',
              'visitorQuestion',
              'mainMessage',
              'cta',
              'trackingEvent'
            ]
          }
        },
        minimumViableFunnel: {
          type: Type.OBJECT,
          properties: {
            minimumBuild: { type: Type.ARRAY, items: { type: Type.STRING } },
            optionalLater: { type: Type.ARRAY, items: { type: Type.STRING } },
            scaleVersion: { type: Type.ARRAY, items: { type: Type.STRING } },
            overbuildWarningAr: { type: Type.STRING }
          },
          required: ['minimumBuild', 'optionalLater', 'scaleVersion', 'overbuildWarningAr']
        }
      },
      required: [
        'evaluatedModels',
        'primaryFunnelId',
        'secondaryFunnelId',
        'whyPrimaryFitsAr',
        'mainRiskAr',
        'whatMustBeTrueAr',
        'doNotBuildYetAr',
        'funnelMapNodes',
        'minimumViableFunnel'
      ]
    },
    connectionConfig: config,
    requestId
  });

  // Critical requirement: The AI CANNOT confirm on behalf of the student
  if (result.success && result.data) {
    result.data.confirmedByStudent = false;
  }

  return res.json(result);
});

// 4. Stage 3 — Lead Magnet Engine (Supports: mode: 'lead_magnet_options' | mode: 'lead_magnet_details')
app.post('/api/build/lead-magnet', async (req, res) => {
  const requestId = generateRequestId('req_leadmagnet');
  const config = extractConnectionConfig(req);
  const {
    researchInput,
    customerJourney,
    funnelStrategy,
    mode = 'lead_magnet_options',
    selectedConceptId,
    selectedConcept
  } = req.body;

  if (mode === 'lead_magnet_details') {
    const prompt = `أنت مهندس الـLead Magnet المعماري (Lead Magnet Architect). قم ببناء الهيكل التفصيلي القابل للتنفيذ (Content Architecture)، وصياغة الوعد النهائي المعتمد (Promise Statement)، والجسر الاستراتيجي المحكم نحو العرض (Strategic Offer Bridge) للمفهوم المختار:
المفهوم المختار: ${JSON.stringify(selectedConcept || { id: selectedConceptId })}
البحث: ${JSON.stringify(researchInput)}
الفانل المعتمد: ${JSON.stringify(funnelStrategy?.primaryFunnelId)}`;

    const result = await AIProviderManager.generateStructured({
      task: 'GENERATE_LEAD_MAGNET_DETAILS',
      systemInstruction: SYSTEM_BASE_PROMPT,
      prompt,
      schema: {
        type: Type.OBJECT,
        properties: {
          promiseStatement: {
            type: Type.OBJECT,
            properties: {
              specificProblem: { type: Type.STRING },
              usefulOutcome: { type: Type.STRING },
              reasonableTimeEffort: { type: Type.STRING },
              fullPromiseAr: { type: Type.STRING }
            },
            required: [
              'specificProblem',
              'usefulOutcome',
              'reasonableTimeEffort',
              'fullPromiseAr'
            ]
          },
          contentArchitecture: {
            type: Type.OBJECT,
            properties: {
              formatType: { type: Type.STRING },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sectionNameAr: { type: Type.STRING },
                    sectionRoleEn: { type: Type.STRING },
                    detailsAr: { type: Type.STRING },
                    actionableItems: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ['sectionNameAr', 'sectionRoleEn', 'detailsAr', 'actionableItems']
                }
              },
              ctaInsideAsset: { type: Type.STRING }
            },
            required: ['formatType', 'sections', 'ctaInsideAsset']
          },
          offerBridge: {
            type: Type.OBJECT,
            properties: {
              leadMagnetProblem: { type: Type.STRING },
              insightDelivered: { type: Type.STRING },
              remainingGap: { type: Type.STRING },
              solutionCategory: { type: Type.STRING },
              offerConnection: { type: Type.STRING }
            },
            required: [
              'leadMagnetProblem',
              'insightDelivered',
              'remainingGap',
              'solutionCategory',
              'offerConnection'
            ]
          }
        },
        required: ['promiseStatement', 'contentArchitecture', 'offerBridge']
      },
      connectionConfig: config,
      requestId
    });

    if (result.success && result.data && result.data.promiseStatement) {
      result.data.promiseStatement.status = 'APPROVED';
    }

    return res.json(result);
  }

  // Phase A: lead_magnet_options (Fast Decision First)
  const prompt = `بناءً على البحث ورحلة العميل والفانل، ابتكر 5 أفكار Lead Magnet متنوعة الصيغ وقيمها في الأبعاد العشرة، مع صياغة الوعد المبدئي لكل منها بسرعة ودقة:
البحث: ${JSON.stringify(researchInput)}
الفانل المختار: ${JSON.stringify(funnelStrategy?.primaryFunnelId)}`;

  const result = await AIProviderManager.generateStructured({
    task: 'GENERATE_LEAD_MAGNET_OPTIONS',
    systemInstruction: SYSTEM_BASE_PROMPT,
    prompt,
    schema: {
      type: Type.OBJECT,
      properties: {
        concepts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              titleAr: { type: Type.STRING },
              formatEn: { type: Type.STRING },
              formatAr: { type: Type.STRING },
              coreIdeaAr: { type: Type.STRING },
              promiseAr: { type: Type.STRING },
              scores: {
                type: Type.OBJECT,
                properties: {
                  problemRelevance: { type: Type.INTEGER },
                  speedToValue: { type: Type.INTEGER },
                  specificity: { type: Type.INTEGER },
                  desiredOutcomeFit: { type: Type.INTEGER },
                  leadToOfferBridge: { type: Type.INTEGER },
                  perceivedValue: { type: Type.INTEGER },
                  easeOfConsumption: { type: Type.INTEGER },
                  easeOfCreation: { type: Type.INTEGER },
                  differentiation: { type: Type.INTEGER },
                  trafficFit: { type: Type.INTEGER }
                },
                required: [
                  'problemRelevance',
                  'speedToValue',
                  'specificity',
                  'desiredOutcomeFit',
                  'leadToOfferBridge',
                  'perceivedValue',
                  'easeOfConsumption',
                  'easeOfCreation',
                  'differentiation',
                  'trafficFit'
                ]
              },
              highlightTag: {
                type: Type.STRING,
                description:
                  'One of: Strongest Concept, Easiest Concept, Best Conversion Hypothesis, Best Strategic Bridge'
              },
              whyDifferentAr: { type: Type.STRING }
            },
            required: [
              'id',
              'titleAr',
              'formatEn',
              'formatAr',
              'coreIdeaAr',
              'promiseAr',
              'scores',
              'whyDifferentAr'
            ]
          }
        },
        selectedConceptId: { type: Type.STRING },
        promiseStatement: {
          type: Type.OBJECT,
          properties: {
            specificProblem: { type: Type.STRING },
            usefulOutcome: { type: Type.STRING },
            reasonableTimeEffort: { type: Type.STRING },
            fullPromiseAr: { type: Type.STRING }
          },
          required: [
            'specificProblem',
            'usefulOutcome',
            'reasonableTimeEffort',
            'fullPromiseAr'
          ]
        },
        contentArchitecture: {
          type: Type.OBJECT,
          properties: {
            formatType: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sectionNameAr: { type: Type.STRING },
                  sectionRoleEn: { type: Type.STRING },
                  detailsAr: { type: Type.STRING },
                  actionableItems: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ['sectionNameAr', 'sectionRoleEn', 'detailsAr', 'actionableItems']
              }
            },
            ctaInsideAsset: { type: Type.STRING }
          },
          required: ['formatType', 'sections', 'ctaInsideAsset']
        },
        offerBridge: {
          type: Type.OBJECT,
          properties: {
            leadMagnetProblem: { type: Type.STRING },
            insightDelivered: { type: Type.STRING },
            remainingGap: { type: Type.STRING },
            solutionCategory: { type: Type.STRING },
            offerConnection: { type: Type.STRING }
          },
          required: [
            'leadMagnetProblem',
            'insightDelivered',
            'remainingGap',
            'solutionCategory',
            'offerConnection'
          ]
        }
      },
      required: [
        'concepts',
        'selectedConceptId',
        'promiseStatement',
        'contentArchitecture',
        'offerBridge'
      ]
    },
    connectionConfig: config,
    requestId
  });

  if (result.success && result.data) {
    result.data.confirmedByStudent = false;
    if (result.data.promiseStatement) {
      result.data.promiseStatement.status = 'APPROVED';
    }
  }

  return res.json(result);
});

// 5. Stage 4 — Page Architect & Copy Generator (Supports: mode: 'pages_strategy' | mode: 'page_details')
app.post('/api/build/pages', async (req, res) => {
  const requestId = generateRequestId('req_pages');
  const config = extractConnectionConfig(req);
  const {
    researchInput,
    leadMagnet,
    proofLibrary,
    mode = 'pages_strategy',
    selectedHeadlineId,
    headlineText
  } = req.body;

  if (mode === 'page_details') {
    const prompt = `أنت كاتب نصوص تحويلية ومهندس صفحات مباشر (Direct-Response Page Copywriter). قم بصياغة النصوص الكاملة لصفحة الهبوط والشكر والجسر والمقارنة بناءً على العنوان المختار:
العنوان المختار: ${headlineText || selectedHeadlineId || 'العنوان الرئيسي الموصى به'}
البحث: ${JSON.stringify(researchInput)}
الـLead Magnet: ${JSON.stringify(leadMagnet?.promiseStatement)}
مكتبة الإثبات: ${JSON.stringify(proofLibrary || [])}
قواعد: بدون شهادات وهمية، بدون وعود ثراء سريع، ومع إفصاح أفلييت شفاف.`;

    const result = await AIProviderManager.generateStructured({
      task: 'GENERATE_PAGE_DETAILS',
      systemInstruction: SYSTEM_BASE_PROMPT,
      prompt,
      schema: {
        type: Type.OBJECT,
        properties: {
          landingPage: {
            type: Type.OBJECT,
            properties: {
              selectedHeadlineId: { type: Type.STRING },
              headlineAr: { type: Type.STRING },
              subheadlineAr: { type: Type.STRING },
              supportingCopyAr: { type: Type.STRING },
              whatYouGetBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
              whyItMattersAr: { type: Type.STRING },
              whoItIsForAr: { type: Type.ARRAY, items: { type: Type.STRING } },
              whoItIsNotForAr: { type: Type.ARRAY, items: { type: Type.STRING } },
              credibilityPlaceholderAr: { type: Type.STRING },
              ctaButtonTextAr: { type: Type.STRING },
              privacyMicrocopyAr: { type: Type.STRING },
              objectionHandlingAr: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    objection: { type: Type.STRING },
                    response: { type: Type.STRING }
                  },
                  required: ['objection', 'response']
                }
              },
              faqItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                  },
                  required: ['question', 'answer']
                }
              },
              mobileNotesAr: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: [
              'headlineAr',
              'subheadlineAr',
              'supportingCopyAr',
              'whatYouGetBullets',
              'whyItMattersAr',
              'whoItIsForAr',
              'whoItIsNotForAr',
              'credibilityPlaceholderAr',
              'ctaButtonTextAr',
              'privacyMicrocopyAr',
              'objectionHandlingAr',
              'faqItems',
              'mobileNotesAr'
            ]
          },
          thankYouPage: {
            type: Type.OBJECT,
            properties: {
              primaryObjectiveAr: { type: Type.STRING },
              deliveryInstructionAr: { type: Type.STRING },
              expectationSettingAr: { type: Type.STRING },
              microCommitmentAskAr: { type: Type.STRING },
              offerPreFrameAr: { type: Type.STRING },
              whitelistInstructionAr: { type: Type.STRING },
              nextStepCtaAr: { type: Type.STRING }
            },
            required: [
              'primaryObjectiveAr',
              'deliveryInstructionAr',
              'expectationSettingAr',
              'microCommitmentAskAr',
              'offerPreFrameAr',
              'whitelistInstructionAr',
              'nextStepCtaAr'
            ]
          },
          bridgePage: {
            type: Type.OBJECT,
            properties: {
              isStrategicallyRequired: { type: Type.BOOLEAN },
              problemRecapAr: { type: Type.STRING },
              whatToLookForAr: { type: Type.STRING },
              whySolutionCategoryMattersAr: { type: Type.STRING },
              productIntroductionAr: { type: Type.STRING },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              potentialLimitations: { type: Type.ARRAY, items: { type: Type.STRING } },
              whoItSuitsAr: { type: Type.ARRAY, items: { type: Type.STRING } },
              whoItMayNotSuitAr: { type: Type.ARRAY, items: { type: Type.STRING } },
              ctaTextAr: { type: Type.STRING },
              affiliateDisclosureAr: { type: Type.STRING }
            },
            required: [
              'isStrategicallyRequired',
              'problemRecapAr',
              'whatToLookForAr',
              'whySolutionCategoryMattersAr',
              'productIntroductionAr',
              'pros',
              'potentialLimitations',
              'whoItSuitsAr',
              'whoItMayNotSuitAr',
              'ctaTextAr',
              'affiliateDisclosureAr'
            ]
          },
          reviewComparisonPage: {
            type: Type.OBJECT,
            properties: {
              isIncluded: { type: Type.BOOLEAN },
              pageType: { type: Type.STRING },
              decisionCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
              featureComparisonRows: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    feature: { type: Type.STRING },
                    offerNote: { type: Type.STRING },
                    alternativeNote: { type: Type.STRING }
                  },
                  required: ['feature', 'offerNote', 'alternativeNote']
                }
              },
              useCasesAr: { type: Type.ARRAY, items: { type: Type.STRING } },
              limitationsAr: { type: Type.ARRAY, items: { type: Type.STRING } },
              pricingVerificationNoteAr: { type: Type.STRING },
              affiliateDisclosureAr: { type: Type.STRING },
              ctaAr: { type: Type.STRING }
            },
            required: [
              'isIncluded',
              'pageType',
              'decisionCriteria',
              'featureComparisonRows',
              'useCasesAr',
              'limitationsAr',
              'pricingVerificationNoteAr',
              'affiliateDisclosureAr',
              'ctaAr'
            ]
          }
        },
        required: [
          'landingPage',
          'thankYouPage',
          'bridgePage',
          'reviewComparisonPage'
        ]
      },
      connectionConfig: config,
      requestId
    });

    if (result.success && result.data) {
      if (result.data.landingPage) result.data.landingPage.status = 'REVIEW';
      if (result.data.thankYouPage) result.data.thankYouPage.status = 'REVIEW';
      if (result.data.bridgePage) result.data.bridgePage.status = 'REVIEW';
      result.data.claimsAudit = [];
    }

    return res.json(result);
  }

  // Phase A: pages_strategy (Fast Decision First)
  const prompt = `بناءً على البحث والـLead Magnet، حدد خريطة الصفحات المطلوبة (Page Purpose Map) و10 عناوين مقترحة بزوايا مختلفة مع هيكل مبدئي للصفحات بسرعة ودقة:
البحث: ${JSON.stringify(researchInput)}
الـLead Magnet: ${JSON.stringify(leadMagnet?.promiseStatement)}`;

  const result = await AIProviderManager.generateStructured({
    task: 'GENERATE_PAGES_STRATEGY',
    systemInstruction: SYSTEM_BASE_PROMPT,
    prompt,
    schema: {
      type: Type.OBJECT,
      properties: {
        pagePurposeMap: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              pageNameEn: { type: Type.STRING },
              pageNameAr: { type: Type.STRING },
              requiredNow: { type: Type.BOOLEAN },
              purpose: { type: Type.STRING },
              trafficSource: { type: Type.STRING },
              visitorAwareness: { type: Type.STRING },
              mainQuestion: { type: Type.STRING },
              primaryMessage: { type: Type.STRING },
              mainCta: { type: Type.STRING },
              secondaryCta: { type: Type.STRING },
              objectionHandled: { type: Type.STRING },
              trustElement: { type: Type.STRING },
              nextDestination: { type: Type.STRING },
              trackingEvent: { type: Type.STRING }
            },
            required: [
              'id',
              'pageNameEn',
              'pageNameAr',
              'requiredNow',
              'purpose',
              'mainQuestion',
              'primaryMessage',
              'mainCta',
              'nextDestination',
              'trackingEvent'
            ]
          }
        },
        headlineOptions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              angleEn: { type: Type.STRING },
              angleAr: { type: Type.STRING },
              headlineAr: { type: Type.STRING },
              clarityScore: { type: Type.INTEGER },
              relevanceScore: { type: Type.INTEGER },
              specificityScore: { type: Type.INTEGER },
              messageMatchScore: { type: Type.INTEGER },
              credibilityScore: { type: Type.INTEGER },
              isRecommended: { type: Type.BOOLEAN }
            },
            required: [
              'id',
              'angleEn',
              'angleAr',
              'headlineAr',
              'clarityScore',
              'relevanceScore',
              'specificityScore',
              'messageMatchScore',
              'credibilityScore',
              'isRecommended'
            ]
          }
        },
        landingPage: {
          type: Type.OBJECT,
          properties: {
            selectedHeadlineId: { type: Type.STRING },
            headlineAr: { type: Type.STRING },
            subheadlineAr: { type: Type.STRING },
            supportingCopyAr: { type: Type.STRING },
            whatYouGetBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
            whyItMattersAr: { type: Type.STRING },
            whoItIsForAr: { type: Type.ARRAY, items: { type: Type.STRING } },
            whoItIsNotForAr: { type: Type.ARRAY, items: { type: Type.STRING } },
            credibilityPlaceholderAr: { type: Type.STRING },
            ctaButtonTextAr: { type: Type.STRING },
            privacyMicrocopyAr: { type: Type.STRING },
            objectionHandlingAr: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  objection: { type: Type.STRING },
                  response: { type: Type.STRING }
                },
                required: ['objection', 'response']
              }
            },
            faqItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ['question', 'answer']
              }
            },
            mobileNotesAr: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: [
            'headlineAr',
            'subheadlineAr',
            'supportingCopyAr',
            'whatYouGetBullets',
            'whyItMattersAr',
            'whoItIsForAr',
            'whoItIsNotForAr',
            'credibilityPlaceholderAr',
            'ctaButtonTextAr',
            'privacyMicrocopyAr',
            'objectionHandlingAr',
            'faqItems',
            'mobileNotesAr'
          ]
        },
        thankYouPage: {
          type: Type.OBJECT,
          properties: {
            primaryObjectiveAr: { type: Type.STRING },
            deliveryInstructionAr: { type: Type.STRING },
            expectationSettingAr: { type: Type.STRING },
            microCommitmentAskAr: { type: Type.STRING },
            offerPreFrameAr: { type: Type.STRING },
            whitelistInstructionAr: { type: Type.STRING },
            nextStepCtaAr: { type: Type.STRING }
          },
          required: [
            'primaryObjectiveAr',
            'deliveryInstructionAr',
            'expectationSettingAr',
            'microCommitmentAskAr',
            'offerPreFrameAr',
            'whitelistInstructionAr',
            'nextStepCtaAr'
          ]
        },
        bridgePage: {
          type: Type.OBJECT,
          properties: {
            isStrategicallyRequired: { type: Type.BOOLEAN },
            problemRecapAr: { type: Type.STRING },
            whatToLookForAr: { type: Type.STRING },
            whySolutionCategoryMattersAr: { type: Type.STRING },
            productIntroductionAr: { type: Type.STRING },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            potentialLimitations: { type: Type.ARRAY, items: { type: Type.STRING } },
            whoItSuitsAr: { type: Type.ARRAY, items: { type: Type.STRING } },
            whoItMayNotSuitAr: { type: Type.ARRAY, items: { type: Type.STRING } },
            ctaTextAr: { type: Type.STRING },
            affiliateDisclosureAr: { type: Type.STRING }
          },
          required: [
            'isStrategicallyRequired',
            'problemRecapAr',
            'whatToLookForAr',
            'whySolutionCategoryMattersAr',
            'productIntroductionAr',
            'pros',
            'potentialLimitations',
            'whoItSuitsAr',
            'whoItMayNotSuitAr',
            'ctaTextAr',
            'affiliateDisclosureAr'
          ]
        },
        reviewComparisonPage: {
          type: Type.OBJECT,
          properties: {
            isIncluded: { type: Type.BOOLEAN },
            pageType: { type: Type.STRING },
            decisionCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
            featureComparisonRows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  offerNote: { type: Type.STRING },
                  alternativeNote: { type: Type.STRING }
                },
                required: ['feature', 'offerNote', 'alternativeNote']
              }
            },
            useCasesAr: { type: Type.ARRAY, items: { type: Type.STRING } },
            limitationsAr: { type: Type.ARRAY, items: { type: Type.STRING } },
            pricingVerificationNoteAr: { type: Type.STRING },
            affiliateDisclosureAr: { type: Type.STRING },
            ctaAr: { type: Type.STRING }
          },
          required: [
            'isIncluded',
            'pageType',
            'decisionCriteria',
            'featureComparisonRows',
            'useCasesAr',
            'limitationsAr',
            'pricingVerificationNoteAr',
            'affiliateDisclosureAr',
            'ctaAr'
          ]
        }
      },
      required: [
        'pagePurposeMap',
        'headlineOptions',
        'landingPage',
        'thankYouPage',
        'bridgePage',
        'reviewComparisonPage'
      ]
    },
    connectionConfig: config,
    requestId
  });

  if (result.success && result.data) {
    if (result.data.landingPage) result.data.landingPage.status = 'REVIEW';
    if (result.data.thankYouPage) result.data.thankYouPage.status = 'REVIEW';
    if (result.data.bridgePage) result.data.bridgePage.status = 'REVIEW';
    result.data.claimsAudit = [];
  }

  return res.json(result);
});

// 6. Stage 5 — Email System (Supports: mode: 'email_strategy' | mode: 'email_details')
app.post('/api/build/email', async (req, res) => {
  const requestId = generateRequestId('req_email');
  const config = extractConnectionConfig(req);
  const { researchInput, leadMagnet, pages, emailSystem, mode = 'email_strategy' } = req.body;

  if (mode === 'email_details') {
    const prompt = `أنت كاتب إيميلات احترافي (Direct-Response Email Copywriter). قم بصياغة نصوص الإيميلات الكاملة لجميع الإيميلات الواردة في المخطط بالعربية الطبيعية، بدون حشو، مع 3 خيارات عناوين لكل إيميل وفحص التضليل:
البحث: ${JSON.stringify(researchInput)}
المخطط المعتمد: ${JSON.stringify(emailSystem?.blueprint || [])}
وعد الـLead Magnet: ${JSON.stringify(leadMagnet?.promiseStatement)}`;

    const result = await AIProviderManager.generateStructured({
      task: 'GENERATE_EMAIL_DETAILS',
      systemInstruction: SYSTEM_BASE_PROMPT,
      prompt,
      schema: {
        type: Type.OBJECT,
        properties: {
          emailsCopy: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                emailNumber: { type: Type.INTEGER },
                subjectLineAr: { type: Type.STRING },
                subjectOptions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      mechanismEn: { type: Type.STRING },
                      mechanismAr: { type: Type.STRING },
                      subjectAr: { type: Type.STRING },
                      isDeceptiveRisk: { type: Type.BOOLEAN }
                    },
                    required: ['mechanismEn', 'mechanismAr', 'subjectAr', 'isDeceptiveRisk']
                  }
                },
                previewTextAr: { type: Type.STRING },
                openingAr: { type: Type.STRING },
                bodyAr: { type: Type.STRING },
                ctaTextAr: { type: Type.STRING },
                psTextAr: { type: Type.STRING }
              },
              required: [
                'emailNumber',
                'subjectLineAr',
                'subjectOptions',
                'previewTextAr',
                'openingAr',
                'bodyAr',
                'ctaTextAr',
                'psTextAr'
              ]
            }
          }
        },
        required: ['emailsCopy']
      },
      connectionConfig: config,
      requestId
    });

    if (result.success && result.data && Array.isArray(result.data.emailsCopy)) {
      result.data.emailsCopy = result.data.emailsCopy.map((e: any) => ({
        ...e,
        status: 'REVIEW'
      }));
    }

    return res.json(result);
  }

  // Phase A: email_strategy (Fast Decision First)
  const prompt = `بناءً على مدخلات البحث والـLead Magnet، حدد استراتيجية الإيميل وسبب اختيار الطول ومخطط السلسلة (Email Blueprint) مع مسودات أولية سريعة:
البحث: ${JSON.stringify(researchInput)}
وعد الـLead Magnet: ${JSON.stringify(leadMagnet?.promiseStatement)}
صفحة الجسر: ${JSON.stringify(pages?.bridgePage?.productIntroductionAr)}`;

  const result = await AIProviderManager.generateStructured({
    task: 'GENERATE_EMAIL_STRATEGY',
    systemInstruction: SYSTEM_BASE_PROMPT,
    prompt,
    schema: {
      type: Type.OBJECT,
      properties: {
        strategy: {
          type: Type.OBJECT,
          properties: {
            whyUserJoined: { type: Type.STRING },
            whatTheyAlreadyKnow: { type: Type.STRING },
            whatTheyNeedToBelieve: { type: Type.STRING },
            mainObjections: { type: Type.ARRAY, items: { type: Type.STRING } },
            trustGap: { type: Type.STRING },
            offerReadiness: { type: Type.STRING },
            desiredBehavior: { type: Type.STRING },
            recommendedEmailCount: { type: Type.INTEGER },
            lengthRationaleAr: { type: Type.STRING }
          },
          required: [
            'whyUserJoined',
            'whatTheyAlreadyKnow',
            'whatTheyNeedToBelieve',
            'mainObjections',
            'trustGap',
            'offerReadiness',
            'desiredBehavior',
            'recommendedEmailCount',
            'lengthRationaleAr'
          ]
        },
        journeyStepsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
        blueprint: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              emailNumber: { type: Type.INTEGER },
              sequenceTypeEn: { type: Type.STRING },
              purposeAr: { type: Type.STRING },
              subjectAngleAr: { type: Type.STRING },
              coreMessageAr: { type: Type.STRING },
              objectionHandledAr: { type: Type.STRING },
              ctaAr: { type: Type.STRING },
              behaviorTriggerAr: { type: Type.STRING }
            },
            required: [
              'emailNumber',
              'sequenceTypeEn',
              'purposeAr',
              'subjectAngleAr',
              'coreMessageAr',
              'objectionHandledAr',
              'ctaAr',
              'behaviorTriggerAr'
            ]
          }
        },
        emailsCopy: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              emailNumber: { type: Type.INTEGER },
              subjectLineAr: { type: Type.STRING },
              subjectOptions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    mechanismEn: { type: Type.STRING },
                    mechanismAr: { type: Type.STRING },
                    subjectAr: { type: Type.STRING },
                    isDeceptiveRisk: { type: Type.BOOLEAN }
                  },
                  required: ['mechanismEn', 'mechanismAr', 'subjectAr', 'isDeceptiveRisk']
                }
              },
              previewTextAr: { type: Type.STRING },
              openingAr: { type: Type.STRING },
              bodyAr: { type: Type.STRING },
              ctaTextAr: { type: Type.STRING },
              psTextAr: { type: Type.STRING }
            },
            required: [
              'emailNumber',
              'subjectLineAr',
              'subjectOptions',
              'previewTextAr',
              'openingAr',
              'bodyAr',
              'ctaTextAr',
              'psTextAr'
            ]
          }
        },
        personalizationFieldsUsed: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: [
        'strategy',
        'journeyStepsUsed',
        'blueprint',
        'emailsCopy',
        'personalizationFieldsUsed'
      ]
    },
    connectionConfig: config,
    requestId
  });

  if (result.success && result.data) {
    result.data.blueprintApprovedByStudent = true;
    result.data.emailsCopy = (result.data.emailsCopy || []).map((e: any) => ({
      ...e,
      status: 'REVIEW'
    }));
    result.data.emailClaimsAudit = [];
  }

  return res.json(result);
});

// 7. Stage 6 — Automation Architect (Supports: mode: 'automation_strategy' | mode: 'automation_details')
app.post('/api/build/automation', async (req, res) => {
  const requestId = generateRequestId('req_automation');
  const config = extractConnectionConfig(req);
  const {
    researchInput,
    leadMagnet,
    emailSystem,
    selectedPlatform = 'Platform-Agnostic',
    mode = 'automation_strategy'
  } = req.body;

  if (mode === 'automation_details') {
    const prompt = `أنت مهندس الأتمتة المعماري (Automation Architect). قم بتصميم تفاصيل عقد سير العمل (Workflow Nodes) والترجمة التقنية لمنصة ${selectedPlatform}:
المنصة المختارة: ${selectedPlatform}
البحث: ${JSON.stringify(researchInput)}
عدد الإيميلات: ${emailSystem?.blueprint?.length || 5}
التاجات المعتمدة: ${JSON.stringify(emailSystem?.strategy?.whyUserJoined || '')}`;

    const result = await AIProviderManager.generateStructured({
      task: 'GENERATE_AUTOMATION_DETAILS',
      systemInstruction: SYSTEM_BASE_PROMPT,
      prompt,
      schema: {
        type: Type.OBJECT,
        properties: {
          workflowNodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                order: { type: Type.INTEGER },
                stepType: {
                  type: Type.STRING,
                  description: 'TRIGGER, ACTION, DELAY, CONDITION, GOAL, or EXIT'
                },
                titleAr: { type: Type.STRING },
                detailAr: { type: Type.STRING },
                yesBranchAr: { type: Type.STRING },
                noBranchAr: { type: Type.STRING },
                tagInvolved: { type: Type.STRING }
              },
              required: ['id', 'order', 'stepType', 'titleAr', 'detailAr']
            }
          },
          platformTranslationNotesAr: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['workflowNodes', 'platformTranslationNotesAr']
      },
      connectionConfig: config,
      requestId
    });

    return res.json(result);
  }

  // Phase A: automation_strategy (Fast Decision First)
  const prompt = `صمّم نظام الأتمتة والتاجات القياسي (SOURCE, LEAD, ENGAGED, INTENT, CUSTOMER, STAGE) وشروط الخروج الآمنة بسرعة ودقة:
المنصة المختارة: ${selectedPlatform}
البحث: ${JSON.stringify(researchInput)}
وعد الـLead Magnet: ${JSON.stringify(leadMagnet?.promiseStatement?.fullPromiseAr)}
عدد الإيميلات: ${emailSystem?.blueprint?.length || 5}`;

  const result = await AIProviderManager.generateStructured({
    task: 'GENERATE_AUTOMATION_STRATEGY',
    systemInstruction: SYSTEM_BASE_PROMPT,
    prompt,
    schema: {
      type: Type.OBJECT,
      properties: {
        triggers: { type: Type.ARRAY, items: { type: Type.STRING } },
        conditions: { type: Type.ARRAY, items: { type: Type.STRING } },
        actions: { type: Type.ARRAY, items: { type: Type.STRING } },
        delays: { type: Type.ARRAY, items: { type: Type.STRING } },
        exitConditions: { type: Type.ARRAY, items: { type: Type.STRING } },
        goals: { type: Type.ARRAY, items: { type: Type.STRING } },
        fallbackPaths: { type: Type.ARRAY, items: { type: Type.STRING } },
        workflowNodes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              order: { type: Type.INTEGER },
              stepType: {
                type: Type.STRING,
                description: 'TRIGGER, ACTION, DELAY, CONDITION, GOAL, or EXIT'
              },
              titleAr: { type: Type.STRING },
              detailAr: { type: Type.STRING },
              yesBranchAr: { type: Type.STRING },
              noBranchAr: { type: Type.STRING },
              tagInvolved: { type: Type.STRING }
            },
            required: ['id', 'order', 'stepType', 'titleAr', 'detailAr']
          }
        },
        tags: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              tagName: { type: Type.STRING },
              category: {
                type: Type.STRING,
                description: 'SOURCE, LEAD, ENGAGED, INTENT, CUSTOMER, or STAGE'
              },
              purposeAr: { type: Type.STRING },
              appliedWhenAr: { type: Type.STRING }
            },
            required: ['tagName', 'category', 'purposeAr', 'appliedWhenAr']
          }
        },
        segments: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dimension: { type: Type.STRING },
              conditionAr: { type: Type.STRING },
              howMessagingChangesAr: { type: Type.STRING }
            },
            required: ['dimension', 'conditionAr', 'howMessagingChangesAr']
          }
        },
        platformTranslationNotesAr: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: [
        'triggers',
        'conditions',
        'actions',
        'delays',
        'exitConditions',
        'goals',
        'fallbackPaths',
        'workflowNodes',
        'tags',
        'segments',
        'platformTranslationNotesAr'
      ]
    },
    connectionConfig: config,
    requestId
  });

  if (result.success && result.data) {
    result.data.selectedPlatform = selectedPlatform;
    result.data.safetyChecks = [];
  }

  return res.json(result);
});

// 8. Stage 7 & 8 — CTA Architecture & Tracking Plan
app.post('/api/build/tracking-cta', async (req, res) => {
  const requestId = generateRequestId('req_tracking');
  const config = extractConnectionConfig(req);
  const { researchInput, funnelStrategy, pages } = req.body;

  const prompt = `صمّم خريطة الـCTA لكل مرحلة في رحلة العميل (بدون استخدام Buy Now في كل مكان)، وخطة التتبع والأحداث (Tracking Events) ومؤشرات الأداء (بدون اختلاق أرقام Benchmarks وهمية؛ استخدم Track your baseline first):
البحث: ${JSON.stringify(researchInput)}
عقد الفانل: ${JSON.stringify(funnelStrategy?.funnelMapNodes)}
الصفحات: ${JSON.stringify(pages?.pagePurposeMap)}`;

  const result = await AIProviderManager.generateStructured({
    task: 'GENERATE_TRACKING_CTA',
    systemInstruction: SYSTEM_BASE_PROMPT,
    prompt,
    schema: {
      type: Type.OBJECT,
      properties: {
        ctaMap: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              journeyStageAr: { type: Type.STRING },
              currentIntentAr: { type: Type.STRING },
              desiredNextActionAr: { type: Type.STRING },
              primaryCtaTextAr: { type: Type.STRING },
              ctaTypeEn: { type: Type.STRING },
              ctaFrictionLevel: { type: Type.STRING, description: 'LOW, MEDIUM, or HIGH' },
              ctaMessageAr: { type: Type.STRING },
              nextDestinationAr: { type: Type.STRING }
            },
            required: [
              'journeyStageAr',
              'currentIntentAr',
              'desiredNextActionAr',
              'primaryCtaTextAr',
              'ctaTypeEn',
              'ctaFrictionLevel',
              'ctaMessageAr',
              'nextDestinationAr'
            ]
          }
        },
        trackingEvents: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              eventName: { type: Type.STRING },
              funnelStepAr: { type: Type.STRING },
              triggerConditionAr: { type: Type.STRING },
              toolDestination: { type: Type.STRING },
              isAffiliatePlatformRestricted: { type: Type.BOOLEAN },
              restrictionNoteAr: { type: Type.STRING }
            },
            required: [
              'eventName',
              'funnelStepAr',
              'triggerConditionAr',
              'toolDestination',
              'isAffiliatePlatformRestricted'
            ]
          }
        },
        funnelMetrics: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              metricNameEn: { type: Type.STRING },
              metricNameAr: { type: Type.STRING },
              formulaOrMeaningAr: { type: Type.STRING },
              baselineInstructionAr: { type: Type.STRING }
            },
            required: [
              'metricNameEn',
              'metricNameAr',
              'formulaOrMeaningAr',
              'baselineInstructionAr'
            ]
          }
        },
        implementationGuide: {
          type: Type.OBJECT,
          properties: {
            ga4NotesAr: { type: Type.STRING },
            metaPixelNotesAr: { type: Type.STRING },
            posthogNotesAr: { type: Type.STRING },
            utmTemplate: { type: Type.STRING },
            subIdTemplate: { type: Type.STRING }
          },
          required: [
            'ga4NotesAr',
            'metaPixelNotesAr',
            'posthogNotesAr',
            'utmTemplate',
            'subIdTemplate'
          ]
        }
      },
      required: ['ctaMap', 'trackingEvents', 'funnelMetrics', 'implementationGuide']
    },
    connectionConfig: config,
    requestId
  });

  return res.json(result);
});

// 9. Stage 9 & 10 — QA & Final Build Blueprint Synthesis
app.post('/api/build/qa-blueprint', async (req, res) => {
  const requestId = generateRequestId('req_qa');
  const config = extractConnectionConfig(req);
  const { project } = req.body;

  const prompt = `قم بإجراء مراجعة جودة شاملة (QA) وتوليد المخطط التنفيذي النهائي (Build Blueprint) وترتيب التنفيذ، وما لا يجب بناؤه الآن (Do Not Build Yet)، وأول خطوة تنفيذية واحدة (One Action First)، وملف تسليم الترافيك (Traffic Handoff Brief) للمرحلة التالتة T — Traffic:
ملخص المشروع:
البحث: ${JSON.stringify(project.researchInput)}
الفانل: ${JSON.stringify(project.funnelStrategy?.whyPrimaryFitsAr)}
الـLead Magnet: ${JSON.stringify(project.leadMagnet?.promiseStatement)}
عنوان الهبوط: ${JSON.stringify(project.pages?.landingPage?.headlineAr)}
عدد الإيميلات: ${project.emailSystem?.blueprint?.length || 5}`;

  const result = await AIProviderManager.generateStructured({
    task: 'GENERATE_QA_BLUEPRINT',
    systemInstruction: SYSTEM_BASE_PROMPT,
    prompt,
    schema: {
      type: Type.OBJECT,
      properties: {
        qaChecks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: 'FUNNEL, COPY, EMAIL, AUTOMATION, or MOBILE'
              },
              questionAr: { type: Type.STRING },
              passed: { type: Type.BOOLEAN },
              findingAr: { type: Type.STRING },
              fixRecommendationAr: { type: Type.STRING }
            },
            required: ['category', 'questionAr', 'passed', 'findingAr']
          }
        },
        implementationOrder: { type: Type.ARRAY, items: { type: Type.STRING } },
        doNotBuildYet: { type: Type.ARRAY, items: { type: Type.STRING } },
        minimumViableBreakdown: {
          type: Type.OBJECT,
          properties: {
            buildNow: { type: Type.ARRAY, items: { type: Type.STRING } },
            buildAfterValidation: { type: Type.ARRAY, items: { type: Type.STRING } },
            scaleInfrastructure: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['buildNow', 'buildAfterValidation', 'scaleInfrastructure']
        },
        oneActionFirstAr: { type: Type.STRING },
        contentEntryBrief: {
          type: Type.OBJECT,
          properties: {
            primaryContentProblem: { type: Type.STRING },
            audienceAwareness: { type: Type.STRING },
            coreMessage: { type: Type.STRING },
            cta: { type: Type.STRING },
            destinationPage: { type: Type.STRING },
            entryContentTopics: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: [
            'primaryContentProblem',
            'audienceAwareness',
            'coreMessage',
            'cta',
            'destinationPage',
            'entryContentTopics'
          ]
        },
        trafficHandoff: {
          type: Type.OBJECT,
          properties: {
            completedStages: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextStage: { type: Type.STRING },
            audience: { type: Type.STRING },
            problem: { type: Type.STRING },
            offer: { type: Type.STRING },
            awareness: { type: Type.STRING },
            coreMessage: { type: Type.STRING },
            contentEntryPoint: { type: Type.STRING },
            cta: { type: Type.STRING },
            landingDestination: { type: Type.STRING },
            funnelGoal: { type: Type.STRING },
            leadMagnet: { type: Type.STRING },
            trackingEvents: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: [
            'completedStages',
            'nextStage',
            'audience',
            'problem',
            'offer',
            'awareness',
            'coreMessage',
            'contentEntryPoint',
            'cta',
            'landingDestination',
            'funnelGoal',
            'leadMagnet',
            'trackingEvents'
          ]
        }
      },
      required: [
        'qaChecks',
        'implementationOrder',
        'doNotBuildYet',
        'minimumViableBreakdown',
        'oneActionFirstAr',
        'contentEntryBrief',
        'trafficHandoff'
      ]
    },
    connectionConfig: config,
    requestId
  });

  return res.json(result);
});

// 10. Regenerate Specific Component with Context Preservation & Lock Enforcement
app.post('/api/build/regenerate-item', async (req, res) => {
  const requestId = generateRequestId('req_regen');
  const config = extractConnectionConfig(req);
  const { targetType, customInstruction, project } = req.body;

  if (targetType === 'REWRITE_EMAIL') {
    const emailNumber = req.body.emailNumber || 1;
    const result = await AIProviderManager.generateStructured({
      task: 'REWRITE_EMAIL',
      systemInstruction: SYSTEM_BASE_PROMPT,
      prompt: `أعد صياغة الإيميل رقم ${emailNumber} فقط مع الحفاظ على سياق المشروع والعناصر المقفلة.
تعليمات إضافية: ${customInstruction || 'اجعله أكثر وضوحًا وتركيزًا على حل المشكلة بدون مبالغة'}
البحث: ${JSON.stringify(project.researchInput)}
مخطط الإيميل: ${JSON.stringify(
        project.emailSystem?.blueprint?.find((b: any) => b.emailNumber === emailNumber)
      )}`,
      schema: {
        type: Type.OBJECT,
        properties: {
          emailNumber: { type: Type.INTEGER },
          subjectLineAr: { type: Type.STRING },
          previewTextAr: { type: Type.STRING },
          openingAr: { type: Type.STRING },
          bodyAr: { type: Type.STRING },
          ctaTextAr: { type: Type.STRING },
          psTextAr: { type: Type.STRING }
        },
        required: [
          'emailNumber',
          'subjectLineAr',
          'previewTextAr',
          'openingAr',
          'bodyAr',
          'ctaTextAr',
          'psTextAr'
        ]
      },
      connectionConfig: config,
      requestId
    });

    return res.json(result);
  }

  if (targetType === 'REGENERATE_HEADLINES') {
    const result = await AIProviderManager.generateStructured({
      task: 'REGENERATE_HEADLINES',
      systemInstruction: SYSTEM_BASE_PROMPT,
      prompt: `ولّد 6 عناوين جديدة لصفحة الهبوط بزوايا مختلفة ومتوافقة مع وعد الـLead Magnet والجمهور:
تعليمات إضافية: ${customInstruction || 'ركز على الوضوح والتحديد والنتيجة العملية'}
البحث: ${JSON.stringify(project.researchInput)}
وعد الـLead Magnet: ${JSON.stringify(project.leadMagnet?.promiseStatement?.fullPromiseAr)}`,
      schema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            angleEn: { type: Type.STRING },
            angleAr: { type: Type.STRING },
            headlineAr: { type: Type.STRING },
            clarityScore: { type: Type.INTEGER },
            relevanceScore: { type: Type.INTEGER },
            specificityScore: { type: Type.INTEGER },
            messageMatchScore: { type: Type.INTEGER },
            credibilityScore: { type: Type.INTEGER },
            isRecommended: { type: Type.BOOLEAN }
          },
          required: [
            'id',
            'angleEn',
            'angleAr',
            'headlineAr',
            'clarityScore',
            'relevanceScore',
            'specificityScore',
            'messageMatchScore',
            'credibilityScore',
            'isRecommended'
          ]
        }
      },
      connectionConfig: config,
      requestId
    });

    return res.json(result);
  }

  return res.status(400).json({
    success: false,
    requestId,
    error: {
      code: 'INVALID_INPUT',
      message: 'نوع عنصر إعادة التوليد غير مدعوم (Unsupported targetType).'
    }
  });
});

async function startServer() {
  const PORT = 3000;
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Affiliate Build Engine server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
