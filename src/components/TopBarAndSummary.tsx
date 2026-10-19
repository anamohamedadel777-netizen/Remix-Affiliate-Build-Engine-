import React from 'react';
import {
  AffiliateBuildProject,
  BuildStageId,
  BuildFinalStatus
} from '../types/buildTypes';
import { AIConnectionConfig } from '../types/aiConnection';
import { checkStageAccess } from '../utils/projectState';
import {
  Check,
  Lock,
  FileDown,
  KeyRound,
  SlidersHorizontal,
  ShieldCheck
} from 'lucide-react';

interface TopBarAndSummaryProps {
  project: AffiliateBuildProject;
  currentStage: BuildStageId;
  onSelectStage: (stage: BuildStageId) => void;
  integrityScores: {
    buildIntegrity: number;
    researchAlignment: number;
    automationConfidence: number;
    implementationReadiness: number;
  };
  finalStatus: BuildFinalStatus;
  aiConnection: AIConnectionConfig | null;
  onOpenAIConnection: () => void;
  onOpenMobileContext: () => void;
  onExportBlueprintJson: () => void;
}

export const STAGES_CONFIG: {
  id: BuildStageId;
  num: string;
  labelAr: string;
  shortEn: string;
}[] = [
  { id: 'INPUT', num: '01', labelAr: 'مدخلات البحث والجاهزية', shortEn: 'Build Input' },
  { id: 'JOURNEY', num: '02', labelAr: 'رحلة العميل وتطابق الرسالة', shortEn: 'Journey' },
  { id: 'FUNNEL', num: '03', labelAr: 'استراتيجية وخريطة الفانل', shortEn: 'Funnel' },
  { id: 'LEAD_MAGNET', num: '04', labelAr: 'محرك الـLead Magnet', shortEn: 'Lead Magnet' },
  { id: 'PAGES', num: '05', labelAr: 'هندسة ونصوص الصفحات', shortEn: 'Pages' },
  { id: 'EMAIL', num: '06', labelAr: 'منظومة الإيميلات', shortEn: 'Email' },
  { id: 'AUTOMATION', num: '07', labelAr: 'معمارية الأتمتة والتاجات', shortEn: 'Automation' },
  { id: 'TRACKING', num: '08', labelAr: 'خريطة الـCTA والتتبع', shortEn: 'Tracking' },
  { id: 'QA', num: '09', labelAr: 'فحص الجودة والادعاءات', shortEn: 'Build QA' },
  { id: 'BLUEPRINT', num: '10', labelAr: 'مخطط البناء وتسليم الترافيك', shortEn: 'Blueprint' }
];

export const TopBarAndSummary: React.FC<TopBarAndSummaryProps> = ({
  project,
  currentStage,
  onSelectStage,
  integrityScores,
  finalStatus,
  aiConnection,
  onOpenAIConnection,
  onOpenMobileContext,
  onExportBlueprintJson
}) => {
  const isStageCompleted = (stageId: BuildStageId): boolean => {
    switch (stageId) {
      case 'INPUT':
        return project.readiness.isReady || project.readiness.continuedAsHypothesis;
      case 'JOURNEY':
        return Boolean(project.customerJourney);
      case 'FUNNEL':
        return Boolean(project.funnelStrategy);
      case 'LEAD_MAGNET':
        return Boolean(project.leadMagnet);
      case 'PAGES':
        return Boolean(project.pages);
      case 'EMAIL':
        return Boolean(project.emailSystem);
      case 'AUTOMATION':
        return Boolean(project.automation);
      case 'TRACKING':
        return Boolean(project.trackingAndCta);
      case 'QA':
      case 'BLUEPRINT':
        return Boolean(project.qaAndBlueprint);
      default:
        return false;
    }
  };

  const lockedCount = Object.values(project.lockedElements).filter(Boolean).length;

  return (
    <div className="border-b border-[#F5BF1E]/15 bg-[#040405] no-print">
      {/* 3-Zone Top Bar Contract */}
      <header className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3.5 border-b border-white/8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onSelectStage('INPUT');
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-[#FCFCFA] whitespace-nowrap shrink-0"
        >
          محرك بناء الأفلييت <bdi dir="ltr" className="text-[#F5BF1E] font-mono text-xs sm:text-sm">R.B.T.L.S [B — Build]</bdi>
        </a>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-[#A39E93]">
          <button
            type="button"
            onClick={() => onSelectStage('JOURNEY')}
            className={`hover:text-[#FCFCFA] transition-colors whitespace-nowrap shrink-0 ${
              currentStage === 'JOURNEY' ? 'text-[#F5BF1E] underline underline-offset-8 font-bold' : ''
            }`}
          >
            رحلة العميل
          </button>
          <button
            type="button"
            onClick={() => onSelectStage('FUNNEL')}
            className={`hover:text-[#FCFCFA] transition-colors whitespace-nowrap shrink-0 ${
              currentStage === 'FUNNEL' ? 'text-[#F5BF1E] underline underline-offset-8 font-bold' : ''
            }`}
          >
            استراتيجية الفانل
          </button>
          <button
            type="button"
            onClick={() => onSelectStage('PAGES')}
            className={`hover:text-[#FCFCFA] transition-colors whitespace-nowrap shrink-0 ${
              currentStage === 'PAGES' ? 'text-[#F5BF1E] underline underline-offset-8 font-bold' : ''
            }`}
          >
            الصفحات والنصوص
          </button>
          <button
            type="button"
            onClick={() => onSelectStage('AUTOMATION')}
            className={`hover:text-[#FCFCFA] transition-colors whitespace-nowrap shrink-0 ${
              currentStage === 'AUTOMATION' ? 'text-[#F5BF1E] underline underline-offset-8 font-bold' : ''
            }`}
          >
            الإيميل والأتمتة
          </button>
          <button
            type="button"
            onClick={() => onSelectStage('BLUEPRINT')}
            className={`hover:text-[#FCFCFA] transition-colors whitespace-nowrap shrink-0 ${
              currentStage === 'BLUEPRINT' ? 'text-[#F5BF1E] underline underline-offset-8 font-bold' : ''
            }`}
          >
            المخطط النهائي
          </button>
        </nav>

        {/* Zone 3: Actions + AI Connection BYOK */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Universal AI Provider Connection Button */}
          <button
            type="button"
            onClick={onOpenAIConnection}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
              aiConnection
                ? 'bg-[#141216] border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
                : 'bg-[#23170D] border-[#F5BF1E]/50 text-[#FBD052] hover:bg-[#F5BF1E] hover:text-[#040405]'
            }`}
            title="ربط مزود الذكاء الاصطناعي (BYOK)"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {aiConnection
                ? `مزود الذكاء: ${aiConnection.provider}`
                : 'ربط مزود AI'}
            </span>
            <span className="sm:hidden">
              {aiConnection ? aiConnection.provider : 'مزود AI'}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenMobileContext}
            className="xl:hidden px-2.5 sm:px-3 py-2 text-xs font-medium text-[#FCFCFA] bg-[#141216] border border-white/15 rounded-lg hover:border-[#F5BF1E]/50 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#F5BF1E]" />
            <span className="hidden sm:inline">سياق المشروع</span>
          </button>

          <button
            type="button"
            onClick={onExportBlueprintJson}
            className="px-3 sm:px-4 py-2 text-xs font-bold text-[#040405] bg-[#F5BF1E] rounded-lg hover:bg-[#FBD052] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>تصدير المخطط</span>
          </button>
        </div>
      </header>

      {/* Persistent Project Summary Bar (Prevents Context Drift) */}
      <div className="bg-[#0C0B0E] border-b border-white/8 px-4 sm:px-6 py-2.5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#A39E93]">
            <span>
              الجمهور:{' '}
              <strong className="text-[#FCFCFA] font-medium">
                {project.researchInput.audience
                  ? project.researchInput.audience.slice(0, 48) +
                    (project.researchInput.audience.length > 48 ? '...' : '')
                  : 'لم يُحدد بعد'}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              العرض:{' '}
              <strong className="text-[#FBD052] font-medium">
                <bdi dir="ltr">{project.researchInput.selectedOffer || 'لم يُحدد بعد'}</bdi>
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              الوعي:{' '}
              <strong className="text-[#FCFCFA] font-mono">
                <bdi dir="ltr">{project.researchInput.awarenessStage}</bdi>
              </strong>
            </span>
            {lockedCount > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#F5BF1E] inline-flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>{lockedCount} عناصر مقفلة</span>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs tabular-nums">
            <span>
              ثقة البحث:{' '}
              <strong
                className={`font-mono ${
                  project.researchInput.researchConfidence < 50
                    ? 'text-amber-400'
                    : 'text-[#FCFCFA]'
                }`}
              >
                <bdi dir="ltr">{project.researchInput.researchConfidence}/100</bdi>
              </strong>
            </span>
            <span aria-hidden="true" className="text-white/20">/</span>
            <span>
              سلامة البناء (Build Integrity):{' '}
              <strong className="font-mono text-[#F5BF1E]">
                <bdi dir="ltr">{integrityScores.buildIntegrity}/100</bdi>
              </strong>
            </span>
            <span aria-hidden="true" className="text-white/20">/</span>
            <span>
              الحالة:{' '}
              <strong
                className={`font-mono ${
                  finalStatus === 'READY TO BUILD'
                    ? 'text-emerald-400'
                    : finalStatus.includes('GAP') || finalStatus === 'NOT READY'
                    ? 'text-red-400'
                    : 'text-[#FBD052]'
                }`}
              >
                <bdi dir="ltr">{finalStatus}</bdi>
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Interactive 10-Stage Build Progress Bar with Prerequisite Guards */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2.5 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {/* Research Prerequisite Indicator */}
          <div className="px-2.5 py-1.5 text-xs text-emerald-400/90 font-medium flex items-center gap-1 shrink-0">
            <Check className="w-3.5 h-3.5" />
            <span>Research</span>
          </div>
          <span className="text-white/20 text-xs">←</span>

          {STAGES_CONFIG.map((st) => {
            const active = currentStage === st.id;
            const completed = isStageCompleted(st.id);
            const access = checkStageAccess(st.id, project);

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectStage(st.id)}
                title={!access.canAccess ? access.reasonAr : st.labelAr}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#F5BF1E] text-[#040405] font-bold shadow-sm'
                    : completed
                    ? 'bg-[#141216] text-[#FCFCFA] hover:bg-[#23170D] border border-white/10'
                    : access.canAccess
                    ? 'text-[#A39E93] hover:text-[#FCFCFA] hover:bg-white/5 border border-transparent'
                    : 'text-white/30 hover:text-white/50 hover:bg-white/5 border border-dashed border-white/10 cursor-not-allowed'
                }`}
              >
                <span className="font-mono text-[11px] opacity-80">
                  <bdi dir="ltr">{st.num}.</bdi>
                </span>
                <span>{st.labelAr}</span>
                {completed && !active ? (
                  <Check className="w-3.5 h-3.5 text-[#F5BF1E]" />
                ) : !access.canAccess ? (
                  <Lock className="w-3 h-3 text-[#A39E93]/60" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
