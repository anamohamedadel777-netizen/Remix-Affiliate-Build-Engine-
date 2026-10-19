import React, { useState } from 'react';
import {
  AffiliateBuildProject,
  BuildFinalStatus,
  BuildIntegrityScores,
  ExperimentLogItem,
  FunnelVersionSnapshot,
  QaAndBlueprintData,
  TrackingAndCtaData
} from '../types/buildTypes';
import { scanCopyForRiskyClaims } from '../utils/deterministicEngine';
import {
  Activity,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Copy,
  Printer,
  FileDown,
  Plus,
  GitCommit,
  FlaskConical,
  Rocket
} from 'lucide-react';

interface Stage8Props {
  trackingAndCta: TrackingAndCtaData | null;
  onGenerateTrackingCta: () => Promise<void>;
  onProceedToQa: () => void;
  isGenerating: boolean;
}

export const Stage8TrackingAndCta: React.FC<Stage8Props> = ({
  trackingAndCta,
  onGenerateTrackingCta,
  onProceedToQa,
  isGenerating
}) => {
  if (!trackingAndCta) {
    return (
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-8 text-center space-y-4">
        <Activity className="w-10 h-10 text-[#F5BF1E] mx-auto" />
        <h2 className="text-xl font-bold text-[#FCFCFA]">
          مهندس الـCTA وخطة التتبع القياسية (CTA & Tracking Architect)
        </h2>
        <p className="text-sm text-[#A39E93] max-w-xl mx-auto">
          ربط كل خطوة في الفانل بـCTA مناسب لمستوى الوعي وبحدث تتبع واضح ومؤشرات أداء بدون أرقام مخترعة.
        </p>
        <button
          type="button"
          disabled={isGenerating}
          onClick={onGenerateTrackingCta}
          className="px-6 py-3 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-sm rounded-lg inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'بنجهز خريطة الـCTA والتتبع...' : 'توليد خريطة الـCTA وخطة التتبع'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#F5BF1E] font-semibold">
            المرحلة 7 و 8 — CTA Architecture & Tracking Plan
          </span>
          <h1 className="text-2xl font-bold text-[#FCFCFA] mt-0.5">
            خريطة تدرج الـCTA وخطة التتبع والقياس
          </h1>
          <p className="text-xs text-[#A39E93] mt-1">
            مطابقة الـCTA لوعي الزائر في كل خطوة + ربط الأحداث بـGA4 وPostHog وSubIDs.
          </p>
        </div>

        <button
          type="button"
          disabled={isGenerating}
          onClick={onGenerateTrackingCta}
          className="px-4 py-2 bg-[#141216] hover:bg-[#23170D] border border-[#F5BF1E]/30 rounded-lg text-xs font-semibold text-[#FBD052] flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>تحديث خطة التتبع</span>
        </button>
      </div>

      {/* Stage 7: CTA Architecture Map */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#FCFCFA]">
            خريطة معمارية الـCTA (CTA Progression Map)
          </h2>
          <p className="text-xs text-[#A39E93]">
            لا نستخدم "اشترِ الآن" في كل مكان؛ يتدرج الطلب حسب نية الزائر واحتكاك القرار.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/12 text-[#A39E93]">
                <th className="py-3 px-3">مرحلة الرحلة</th>
                <th className="py-3 px-3">نية الزائر الحالية</th>
                <th className="py-3 px-3">الـCTA الأساسي</th>
                <th className="py-3 px-3">النوع والاحتكاك</th>
                <th className="py-3 px-3">الوجهة التالية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {trackingAndCta.ctaMap.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3.5 px-3 font-bold text-[#FCFCFA]">{row.journeyStageAr}</td>
                  <td className="py-3.5 px-3 text-[#D6D3CD]">{row.currentIntentAr}</td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-[#F5BF1E]">{row.primaryCtaTextAr}</div>
                    <div className="text-[11px] text-[#A39E93]">{row.ctaMessageAr}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono">
                    <bdi dir="ltr">{row.ctaTypeEn}</bdi> ·{' '}
                    <span
                      className={
                        row.ctaFrictionLevel === 'LOW'
                          ? 'text-emerald-400'
                          : row.ctaFrictionLevel === 'MEDIUM'
                          ? 'text-[#FBD052]'
                          : 'text-amber-400'
                      }
                    >
                      <bdi dir="ltr">{row.ctaFrictionLevel}</bdi>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#FCFCFA]">
                    <bdi dir="ltr">{row.nextDestinationAr}</bdi>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stage 8: Tracking Events Plan */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#FCFCFA]">
          أحداث التتبع الإلزامية (Funnel Tracking Events)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {trackingAndCta.trackingEvents.map((ev, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border space-y-1.5 ${
                ev.isAffiliatePlatformRestricted
                  ? 'bg-[#23170D]/70 border-[#F5BF1E]/40 md:col-span-2'
                  : 'bg-[#141216] border-white/10'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono font-bold text-[#F5BF1E] text-sm">
                  <bdi dir="ltr">{ev.eventName}</bdi>
                </span>
                <span className="font-mono text-[#A39E93]">
                  <bdi dir="ltr">{ev.toolDestination}</bdi>
                </span>
              </div>
              <div className="font-bold text-[#FCFCFA]">{ev.funnelStepAr}</div>
              <p className="text-[#D6D3CD]">{ev.triggerConditionAr}</p>
              {ev.isAffiliatePlatformRestricted && ev.restrictionNoteAr && (
                <div className="pt-1 text-amber-300 font-medium">
                  ⚠️ {ev.restrictionNoteAr}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Funnel Metrics (No Fake Benchmarks) + Implementation Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#FCFCFA]">
              مؤشرات الأداء (Funnel Metrics — بدون أرقام وهمية)
            </h2>
            <p className="text-xs text-[#A39E93]">
              القاعدة الذهبية: <bdi dir="ltr" className="text-[#F5BF1E] font-mono">Track your baseline first</bdi>
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {trackingAndCta.funnelMetrics.map((m, i) => (
              <div
                key={i}
                className="bg-[#141216] p-3.5 rounded-lg border border-white/8 space-y-1"
              >
                <div className="font-bold text-[#FCFCFA]">
                  {m.metricNameAr} (<bdi dir="ltr" className="font-mono text-[#F5BF1E]">{m.metricNameEn}</bdi>)
                </div>
                <p className="text-[#D6D3CD]">{m.formulaOrMeaningAr}</p>
                <div className="text-[11px] text-emerald-400">{m.baselineInstructionAr}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4 text-xs">
          <h2 className="text-lg font-bold text-[#FCFCFA]">
            قوالب التنفيذ التقني (UTM & SubID Templates)
          </h2>

          <div className="space-y-3">
            <div className="bg-[#141216] p-3.5 rounded-lg border border-white/8 space-y-1">
              <div className="font-bold text-[#F5BF1E]">قالب معاملات UTM لروابط المحتوى:</div>
              <code dir="ltr" className="block bg-[#040405] p-2.5 rounded text-[#FCFCFA] font-mono overflow-x-auto">
                {trackingAndCta.implementationGuide.utmTemplate}
              </code>
            </div>

            <div className="bg-[#141216] p-3.5 rounded-lg border border-white/8 space-y-1">
              <div className="font-bold text-[#F5BF1E]">قالب Affiliate SubID لرابط العرض:</div>
              <code dir="ltr" className="block bg-[#040405] p-2.5 rounded text-[#FCFCFA] font-mono overflow-x-auto">
                {trackingAndCta.implementationGuide.subIdTemplate}
              </code>
            </div>

            <div className="bg-[#141216] p-3.5 rounded-lg border border-white/8 space-y-1.5">
              <div className="font-bold text-[#FBD052]">إرشادات GA4 & PostHog & Meta Pixel:</div>
              <p className="text-[#D6D3CD]">{trackingAndCta.implementationGuide.ga4NotesAr}</p>
              <p className="text-[#D6D3CD]">{trackingAndCta.implementationGuide.posthogNotesAr}</p>
              <p className="text-[#A39E93]">{trackingAndCta.implementationGuide.metaPixelNotesAr}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onProceedToQa}
          className="px-6 py-3 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-sm rounded-lg flex items-center gap-2"
        >
          <span>الانتقال للمرحلة 9: فحص الجودة الشامل (QA)</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface Stage9QaProps {
  project: AffiliateBuildProject;
  qaAndBlueprint: QaAndBlueprintData | null;
  integrityScores: BuildIntegrityScores;
  finalStatus: BuildFinalStatus;
  statusExplanationAr: string;
  onRunQaSynthesis: () => Promise<void>;
  onProceedToBlueprint: () => void;
  isGenerating: boolean;
}

export const Stage9BuildQa: React.FC<Stage9QaProps> = ({
  project,
  qaAndBlueprint,
  integrityScores,
  finalStatus,
  statusExplanationAr,
  onRunQaSynthesis,
  onProceedToBlueprint,
  isGenerating
}) => {
  const deterministicClaims = scanCopyForRiskyClaims(project);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#F5BF1E] font-semibold">
            المرحلة 9 — Build Quality Assurance & Claim Checker
          </span>
          <h1 className="text-2xl font-bold text-[#FCFCFA] mt-0.5">
            فحص الجودة الشامل، فاحص الادعاءات، ومؤشر سلامة البناء
          </h1>
          <p className="text-xs text-[#A39E93] mt-1">
            التحقق من سلامة الفانل، النصوص، الإيميلات، الأتمتة، وتوافق الجوال قبل إصدار المخطط النهائي.
          </p>
        </div>

        <button
          type="button"
          disabled={isGenerating}
          onClick={onRunQaSynthesis}
          className="px-4 py-2 bg-[#141216] hover:bg-[#23170D] border border-[#F5BF1E]/30 rounded-lg text-xs font-semibold text-[#FBD052] flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'بنعمل QA للفانل...' : 'إعادة فحص الجودة الشامل'}</span>
        </button>
      </div>

      {/* Build Integrity Separate 0-100 Scores */}
      <div className="bg-[#0C0B0E] border border-[#F5BF1E]/35 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="text-xs text-[#A39E93]">حالة قرار البناء النهائية (Build Status)</div>
            <div className="text-xl font-bold font-mono text-[#F5BF1E] mt-0.5">
              <bdi dir="ltr">{finalStatus}</bdi>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#FCFCFA] max-w-2xl">{statusExplanationAr}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
          <div className="bg-[#141216] p-4 rounded-xl border border-white/10">
            <div className="text-xs text-[#A39E93]">سلامة البناء (Build Integrity)</div>
            <div className="text-2xl font-mono font-bold text-[#F5BF1E] mt-1">
              <bdi dir="ltr">{integrityScores.buildIntegrity}/100</bdi>
            </div>
          </div>
          <div className="bg-[#141216] p-4 rounded-xl border border-white/10">
            <div className="text-xs text-[#A39E93]">التوافق مع البحث (Research Alignment)</div>
            <div className="text-2xl font-mono font-bold text-[#FCFCFA] mt-1">
              <bdi dir="ltr">{integrityScores.researchAlignment}/100</bdi>
            </div>
          </div>
          <div className="bg-[#141216] p-4 rounded-xl border border-white/10">
            <div className="text-xs text-[#A39E93]">ثقة الأتمتة (Automation Confidence)</div>
            <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
              <bdi dir="ltr">{integrityScores.automationConfidence}/100</bdi>
            </div>
          </div>
          <div className="bg-[#141216] p-4 rounded-xl border border-white/10">
            <div className="text-xs text-[#A39E93]">جاهزية التنفيذ (Implementation Readiness)</div>
            <div className="text-2xl font-mono font-bold text-[#FBD052] mt-1">
              <bdi dir="ltr">{integrityScores.implementationReadiness}/100</bdi>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Checker (Anti-Fake Proof / Risky Claim Guard) */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#F5BF1E]" />
          <div>
            <h2 className="text-lg font-bold text-[#FCFCFA]">
              فاحص الادعاءات والمصداقية (Claim Checker)
            </h2>
            <p className="text-xs text-[#A39E93]">
              يصنف الادعاءات إلى: <bdi dir="ltr">FACT · USER-PROVIDED FACT · MARKETING POSITION · HYPOTHESIS · UNVERIFIED CLAIM · RISKY CLAIM</bdi>
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {deterministicClaims.map((claim) => (
            <div
              key={claim.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                claim.isSafe
                  ? 'bg-[#141216] border-emerald-500/30'
                  : 'bg-red-950/30 border-red-500/50'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#FBD052]">{claim.sourceLocation}</span>
                  <span>·</span>
                  <span
                    className={`font-mono font-bold ${
                      claim.isSafe ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    <bdi dir="ltr">{claim.classification}</bdi>
                  </span>
                </div>
                <p className="text-[#FCFCFA] font-medium">"{claim.claimText}"</p>
                <p className="text-[#A39E93]">{claim.warningOrFixAr}</p>
              </div>
              <div className="shrink-0 font-mono text-xs">
                {claim.isSafe ? (
                  <span className="text-emerald-400">آمن ومعتمد ✓</span>
                ) : (
                  <span className="text-red-400 font-bold">يتطلب تعديل !</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Layer QA Checklist (Funnel, Copy, Email, Automation, Mobile) */}
      {qaAndBlueprint && (
        <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#FCFCFA]">
            قائمة مراجعة الجودة التفصيلية (Funnel · Copy · Email · Automation · Mobile QA)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {qaAndBlueprint.qaChecks.map((chk, idx) => (
              <div
                key={idx}
                className="bg-[#141216] border border-white/10 rounded-xl p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#F5BF1E] font-bold">
                    <bdi dir="ltr">{chk.category} QA</bdi>
                  </span>
                  {chk.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div className="font-bold text-[#FCFCFA]">{chk.questionAr}</div>
                <p className="text-[#A39E93]">{chk.findingAr}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onProceedToBlueprint}
          className="px-6 py-3 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-sm rounded-lg flex items-center gap-2"
        >
          <span>الانتقال للمرحلة 10: مخطط البناء النهائي وتسليم الترافيك</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface Stage10BlueprintProps {
  project: AffiliateBuildProject;
  integrityScores: BuildIntegrityScores;
  finalStatus: BuildFinalStatus;
  statusExplanationAr: string;
  onCreateNewVersion: (snapshot: Omit<FunnelVersionSnapshot, 'versionId' | 'createdAt'>) => void;
  onAddExperiment: (exp: Omit<ExperimentLogItem, 'id'>) => void;
  onExportJson: () => void;
}

export const Stage10BuildBlueprint: React.FC<Stage10BlueprintProps> = ({
  project,
  integrityScores,
  finalStatus,
  statusExplanationAr,
  onCreateNewVersion,
  onAddExperiment,
  onExportJson
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [showVersionForm, setShowVersionForm] = useState(false);
  const [vLabel, setVLabel] = useState(`Funnel V${project.versions.length + 1}`);
  const [vChanged, setVChanged] = useState('');
  const [vWhy, setVWhy] = useState('');
  const [vHypothesis, setVHypothesis] = useState('');

  const [showExpForm, setShowExpForm] = useState(false);
  const [expName, setExpName] = useState('');
  const [expHyp, setExpHyp] = useState('');
  const [expVar, setExpVar] = useState('');
  const [expControl, setExpControl] = useState('');
  const [expVariant, setExpVariant] = useState('');
  const [expMetric, setExpMetric] = useState('Landing Page Conversion Rate');

  const qa = project.qaAndBlueprint;
  const primaryFunnel = project.funnelStrategy?.evaluatedModels.find(
    (m) => m.id === project.funnelStrategy?.primaryFunnelId
  );
  const selectedLm = project.leadMagnet?.concepts.find(
    (c) => c.id === project.leadMagnet?.selectedConceptId
  );

  const handleCopyMarkdownBlueprint = () => {
    const text = `# Affiliate Build Blueprint — ${project.researchInput.projectName}
الحالة النهائية: ${finalStatus}
سلامة البناء: ${integrityScores.buildIntegrity}/100 | التوافق مع البحث: ${integrityScores.researchAlignment}/100

## 1. مدخلات البحث
- الجمهور: ${project.researchInput.audience}
- المشكلة: ${project.researchInput.primaryProblem}
- النتيجة المرغوبة: ${project.researchInput.desiredOutcome}
- العرض: ${project.researchInput.selectedOffer}
- الترافيك والوعي: ${project.researchInput.trafficHypothesis} (${project.researchInput.awarenessStage})

## 2. الفانل والـLead Magnet
- الفانل المعتمد: ${primaryFunnel?.nameAr || ''}
- الـLead Magnet: ${selectedLm?.titleAr || ''}
- الوعد: ${project.leadMagnet?.promiseStatement.fullPromiseAr || ''}

## 3. عنوان صفحة الهبوط والـCTA
- العنوان: ${project.pages?.landingPage.headlineAr || ''}
- الـCTA: ${project.pages?.landingPage.ctaButtonTextAr || ''}

## 4. أول خطوة تنفذها الآن (One Action First)
${qa?.oneActionFirstAr || ''}

## 5. ملف تسليم مرحلة الترافيك (R.B.T.L.S -> Stage T: Traffic)
- الرسالة المحورية: ${qa?.trafficHandoff.coreMessage || ''}
- نقطة دخول المحتوى: ${qa?.trafficHandoff.contentEntryPoint || ''}
- الوجهة: ${qa?.trafficHandoff.landingDestination || ''}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleSaveVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vChanged.trim()) return;
    onCreateNewVersion({
      versionLabel: vLabel,
      whatChangedAr: vChanged,
      whyChangedAr: vWhy || 'تحسين معدل التحويل بناءً على المراجعة',
      hypothesisAr: vHypothesis || 'تعديل الرسالة سيزيد من وضوح القيمة للزائر',
      expectedEffectAr: 'رفع نسبة الانتقال للخطوة التالية',
      resultNoteAr: 'قيد الاختبار',
      primaryFunnelNameAr: primaryFunnel?.nameAr || '',
      leadMagnetTitleAr: selectedLm?.titleAr || '',
      mainHeadlineAr: project.pages?.landingPage.headlineAr || '',
      mainCtaAr: project.pages?.landingPage.ctaButtonTextAr || '',
      emailCount: project.emailSystem?.blueprint.length || 5
    });
    setVChanged('');
    setVWhy('');
    setVHypothesis('');
    setShowVersionForm(false);
  };

  const handleSaveExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expName.trim()) return;
    onAddExperiment({
      experimentName: expName,
      hypothesis: expHyp,
      variable: expVar,
      control: expControl,
      variant: expVariant,
      primaryMetric: expMetric,
      result: 'Track your baseline first',
      learning: 'قيد جمع البيانات'
    });
    setExpName('');
    setExpHyp('');
    setExpVar('');
    setExpControl('');
    setExpVariant('');
    setShowExpForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Final Build Decision Banner */}
      <div className="bg-[#0C0B0E] border-2 border-[#F5BF1E] rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs text-[#F5BF1E] font-bold">
              Affiliate Build Blueprint — قرار البناء النهائي
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#FCFCFA] mt-1">
              Build Decision: <bdi dir="ltr" className="text-[#F5BF1E] font-mono">{finalStatus}</bdi>
            </h1>
            <p className="text-sm text-[#D6D3CD] mt-1">{statusExplanationAr}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              type="button"
              onClick={handleCopyMarkdownBlueprint}
              className="px-3.5 py-2 bg-[#141216] hover:bg-[#23170D] border border-white/15 rounded-lg text-xs font-semibold text-[#FCFCFA] flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-[#F5BF1E]" />
              <span>{copiedSummary ? 'تم نسخ المخطط!' : 'نسخ الملخص للحافظة'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-[#141216] hover:bg-[#23170D] border border-white/15 rounded-lg text-xs font-semibold text-[#FCFCFA] flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[#F5BF1E]" />
              <span>طباعة التقرير</span>
            </button>
            <button
              type="button"
              onClick={onExportJson}
              className="px-4 py-2 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>تحميل Blueprint JSON</span>
            </button>
          </div>
        </div>

        {/* 4 Core Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 tabular-nums">
          <div className="bg-[#141216] p-3.5 rounded-xl border border-white/8">
            <div className="text-xs text-[#A39E93]">التوافق مع البحث (Research Alignment)</div>
            <div className="text-xl font-mono font-bold text-[#FCFCFA] mt-0.5">
              <bdi dir="ltr">{integrityScores.researchAlignment}/100</bdi>
            </div>
          </div>
          <div className="bg-[#141216] p-3.5 rounded-xl border border-white/8">
            <div className="text-xs text-[#A39E93]">سلامة البناء (Build Integrity)</div>
            <div className="text-xl font-mono font-bold text-[#F5BF1E] mt-0.5">
              <bdi dir="ltr">{integrityScores.buildIntegrity}/100</bdi>
            </div>
          </div>
          <div className="bg-[#141216] p-3.5 rounded-xl border border-white/8">
            <div className="text-xs text-[#A39E93]">جاهزية التنفيذ (Implementation Readiness)</div>
            <div className="text-xl font-mono font-bold text-[#FBD052] mt-0.5">
              <bdi dir="ltr">{integrityScores.implementationReadiness}/100</bdi>
            </div>
          </div>
          <div className="bg-[#141216] p-3.5 rounded-xl border border-white/8">
            <div className="text-xs text-[#A39E93]">ثقة الأتمتة (Automation Confidence)</div>
            <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5">
              <bdi dir="ltr">{integrityScores.automationConfidence}/100</bdi>
            </div>
          </div>
        </div>
      </div>

      {/* ONE ACTION FIRST (أول حاجة تنفذها دلوقتي) */}
      {qa && (
        <div className="bg-gradient-to-l from-[#23170D] to-[#0C0B0E] border-2 border-[#F5BF1E] rounded-xl p-6 space-y-2">
          <div className="text-xs font-bold text-[#F5BF1E]">
            أول حاجة تنفذها دلوقتي — ONE ACTION FIRST
          </div>
          <div className="text-lg sm:text-xl font-bold text-[#FCFCFA]">
            "{qa.oneActionFirstAr}"
          </div>
          <p className="text-xs text-[#A39E93]">
            لا تفتح 5 أدوات في نفس الوقت — ابدأ بهذه الخطوة الواحدة فقط حتى تنهيها.
          </p>
        </div>
      )}

      {/* Implementation Sequence + Do Not Build Yet */}
      {qa && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#FCFCFA]">
              الترتيب الصحيح للتنفيذ (Implementation Order)
            </h2>
            <ol className="space-y-2.5 text-xs text-[#FCFCFA]">
              {qa.implementationOrder.map((step, idx) => (
                <li
                  key={idx}
                  className="bg-[#141216] p-3 rounded-lg border border-white/8 font-medium"
                >
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0C0B0E] border border-red-500/35 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-red-300">
                متبنيش ده دلوقتي — Do Not Build Yet
              </h2>
              <ul className="space-y-2 text-xs text-[#D6D3CD]">
                {qa.doNotBuildYet.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-3 text-xs">
              <h3 className="text-base font-bold text-[#FBD052]">
                تقسيم مراحل البناء (Minimum Viable Breakdown)
              </h3>
              <div>
                <div className="font-bold text-emerald-400 mb-1">ابنِ الآن للاختبار (Build Now):</div>
                <p className="text-[#FCFCFA]">{qa.minimumViableBreakdown.buildNow.join(' · ')}</p>
              </div>
              <div>
                <div className="font-bold text-[#F5BF1E] mb-1">
                  ابنِ بعد التحقق (Build After Validation):
                </div>
                <p className="text-[#D6D3CD]">
                  {qa.minimumViableBreakdown.buildAfterValidation.join(' · ')}
                </p>
              </div>
              <div>
                <div className="font-bold text-[#A39E93] mb-1">
                  بنية التوسع لاحقًا (Scale Infrastructure):
                </div>
                <p className="text-[#A39E93]">
                  {qa.minimumViableBreakdown.scaleInfrastructure.join(' · ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete 15-Point Blueprint Summary Grid */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-bold text-[#FCFCFA]">
          ملخص المخطط المعماري المتكامل (15-Point Build Blueprint)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#141216] p-4 rounded-xl border border-white/8 space-y-1">
            <div className="text-[#F5BF1E] font-bold">1. الجمهور والمشكلة</div>
            <p className="text-[#FCFCFA]">{project.researchInput.audience}</p>
            <p className="text-[#A39E93]">{project.researchInput.primaryProblem}</p>
          </div>
          <div className="bg-[#141216] p-4 rounded-xl border border-white/8 space-y-1">
            <div className="text-[#F5BF1E] font-bold">2. الفانل المعتمد</div>
            <p className="text-[#FCFCFA] font-bold">{primaryFunnel?.nameAr}</p>
            <p className="text-[#A39E93]">{project.funnelStrategy?.whyPrimaryFitsAr}</p>
          </div>
          <div className="bg-[#141216] p-4 rounded-xl border border-white/8 space-y-1">
            <div className="text-[#F5BF1E] font-bold">3. الـLead Magnet والوعد</div>
            <p className="text-[#FCFCFA] font-bold">{selectedLm?.titleAr}</p>
            <p className="text-[#A39E93]">{project.leadMagnet?.promiseStatement.fullPromiseAr}</p>
          </div>
          <div className="bg-[#141216] p-4 rounded-xl border border-white/8 space-y-1">
            <div className="text-[#F5BF1E] font-bold">4. الصفحات المطلوبة</div>
            <p className="text-[#FCFCFA]">
              {project.pages?.pagePurposeMap
                .filter((p) => p.requiredNow)
                .map((p) => p.pageNameAr)
                .join(' ← ')}
            </p>
          </div>
          <div className="bg-[#141216] p-4 rounded-xl border border-white/8 space-y-1">
            <div className="text-[#F5BF1E] font-bold">5. سلسلة الإيميلات</div>
            <p className="text-[#FCFCFA]">
              {project.emailSystem?.blueprint.length} رسائل متتابعة تنتقل من تسليم الـLead Magnet إلى مقارنة الحلول.
            </p>
          </div>
          <div className="bg-[#141216] p-4 rounded-xl border border-white/8 space-y-1">
            <div className="text-[#F5BF1E] font-bold">6. التاجات والأتمتة</div>
            <p className="text-[#FCFCFA] font-mono">
              <bdi dir="ltr">{project.automation?.tags.map((t) => t.tagName).join(', ')}</bdi>
            </p>
          </div>
        </div>
      </div>

      {/* Funnel Versioning & Experiment Log (Preparation for Stage L — Learn) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 no-print">
        {/* Funnel Versioning */}
        <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-[#F5BF1E]" />
              <h2 className="text-base font-bold text-[#FCFCFA]">
                إصدارات الفانل (Funnel Versioning — V1 / V2)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowVersionForm(!showVersionForm)}
              className="text-xs text-[#F5BF1E] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>حفظ إصدار جديد</span>
            </button>
          </div>

          {showVersionForm && (
            <form
              onSubmit={handleSaveVersion}
              className="bg-[#141216] p-4 rounded-xl border border-[#F5BF1E]/30 space-y-2.5 text-xs"
            >
              <input
                type="text"
                value={vLabel}
                onChange={(e) => setVLabel(e.target.value)}
                placeholder="اسم الإصدار (مثال: Funnel V2)"
                className="w-full bg-[#040405] border border-white/15 rounded p-2 text-[#FCFCFA]"
              />
              <input
                type="text"
                value={vChanged}
                onChange={(e) => setVChanged(e.target.value)}
                placeholder="ما الذي تغير في هذه النسخة؟"
                className="w-full bg-[#040405] border border-white/15 rounded p-2 text-[#FCFCFA]"
                required
              />
              <input
                type="text"
                value={vHypothesis}
                onChange={(e) => setVHypothesis(e.target.value)}
                placeholder="الفرضية والتأثير المتوقع..."
                className="w-full bg-[#040405] border border-white/15 rounded p-2 text-[#FCFCFA]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowVersionForm(false)}
                  className="px-3 py-1 text-[#A39E93]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#F5BF1E] text-[#040405] font-bold rounded"
                >
                  حفظ النسخة
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2.5 text-xs">
            {project.versions.map((ver) => (
              <div
                key={ver.versionId}
                className="bg-[#141216] p-3.5 rounded-lg border border-white/8 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#F5BF1E]">
                    <bdi dir="ltr">{ver.versionLabel}</bdi>
                  </span>
                  <span className="text-[11px] text-[#A39E93]">{ver.resultNoteAr}</span>
                </div>
                <div className="text-[#FCFCFA] font-semibold">{ver.whatChangedAr}</div>
                <div className="text-[#A39E93]">الفرضية: {ver.hypothesisAr}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Experiment Log */}
        <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-[#F5BF1E]" />
              <h2 className="text-base font-bold text-[#FCFCFA]">
                سجل التجارب المستقبلي (Experiment Log — Stage L)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowExpForm(!showExpForm)}
              className="text-xs text-[#F5BF1E] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة تجربة</span>
            </button>
          </div>

          {showExpForm && (
            <form
              onSubmit={handleSaveExperiment}
              className="bg-[#141216] p-4 rounded-xl border border-[#F5BF1E]/30 space-y-2.5 text-xs"
            >
              <input
                type="text"
                value={expName}
                onChange={(e) => setExpName(e.target.value)}
                placeholder="اسم التجربة (مثال: اختبار عنوان صفحة الهبوط)"
                className="w-full bg-[#040405] border border-white/15 rounded p-2 text-[#FCFCFA]"
                required
              />
              <input
                type="text"
                value={expHyp}
                onChange={(e) => setExpHyp(e.target.value)}
                placeholder="الفرضية (Hypothesis)"
                className="w-full bg-[#040405] border border-white/15 rounded p-2 text-[#FCFCFA]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={expControl}
                  onChange={(e) => setExpControl(e.target.value)}
                  placeholder="النسخة الأصلية (Control)"
                  className="bg-[#040405] border border-white/15 rounded p-2 text-[#FCFCFA]"
                />
                <input
                  type="text"
                  value={expVariant}
                  onChange={(e) => setExpVariant(e.target.value)}
                  placeholder="النسخة البديلة (Variant)"
                  className="bg-[#040405] border border-white/15 rounded p-2 text-[#FCFCFA]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExpForm(false)}
                  className="px-3 py-1 text-[#A39E93]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#F5BF1E] text-[#040405] font-bold rounded"
                >
                  إضافة للسجل
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2.5 text-xs">
            {project.experiments.map((ex) => (
              <div
                key={ex.id}
                className="bg-[#141216] p-3.5 rounded-lg border border-white/8 space-y-1"
              >
                <div className="font-bold text-[#FBD052]">{ex.experimentName}</div>
                <p className="text-[#FCFCFA]">{ex.hypothesis}</p>
                <div className="text-[11px] text-[#A39E93]">
                  المتغير: {ex.variable} · المقياس: <bdi dir="ltr">{ex.primaryMetric}</bdi>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* R.B.T.L.S HANDOFF TO STAGE T — TRAFFIC */}
      {qa && (
        <div className="bg-[#0C0B0E] border-2 border-[#F5BF1E]/50 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Rocket className="w-6 h-6 text-[#F5BF1E]" />
              <div>
                <div className="text-xs font-mono text-emerald-400">
                  Completed: R — Research ✓ · B — Build ✓
                </div>
                <h2 className="text-xl font-bold text-[#FCFCFA]">
                  ملف التسليم للمرحلة التالية: <bdi dir="ltr" className="text-[#F5BF1E]">T — Traffic Handoff Brief</bdi>
                </h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#141216] p-3.5 rounded-lg border border-white/8">
              <div className="text-[#F5BF1E] font-bold">الجمهور والوعي</div>
              <p className="text-[#FCFCFA] mt-1">
                {qa.trafficHandoff.audience} (<bdi dir="ltr">{qa.trafficHandoff.awareness}</bdi>)
              </p>
            </div>
            <div className="bg-[#141216] p-3.5 rounded-lg border border-white/8">
              <div className="text-[#F5BF1E] font-bold">الرسالة المحورية للترافيك</div>
              <p className="text-[#FCFCFA] mt-1">{qa.trafficHandoff.coreMessage}</p>
            </div>
            <div className="bg-[#141216] p-3.5 rounded-lg border border-white/8">
              <div className="text-[#F5BF1E] font-bold">نقطة دخول المحتوى والـCTA</div>
              <p className="text-[#FCFCFA] mt-1">{qa.trafficHandoff.contentEntryPoint}</p>
              <p className="text-emerald-400 font-semibold mt-1">CTA: {qa.trafficHandoff.cta}</p>
            </div>
          </div>

          <div className="bg-[#141216] p-4 rounded-xl border border-white/8 space-y-2 text-xs">
            <div className="font-bold text-[#FBD052]">
              5 مواضيع محتوى مبدئية جاهزة لبدء مرحلة الترافيك (Content Entry Brief):
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[#FCFCFA]">
              {qa.contentEntryBrief.entryContentTopics.map((topic, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#F5BF1E] font-bold">{i + 1}.</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
