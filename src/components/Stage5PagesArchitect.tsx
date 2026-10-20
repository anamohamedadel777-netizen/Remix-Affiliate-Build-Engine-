import React, { useState } from 'react';
import {
  AffiliateBuildProject,
  CopyStatus,
  PagesData
} from '../types/buildTypes';
import { generateStandalonePageHtml } from '../utils/deterministicEngine';
import {
  Layout,
  Sparkles,
  Lock,
  Unlock,
  Code2,
  Copy,
  CheckCircle2,
  Download,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';

interface Stage5PagesArchitectProps {
  project: AffiliateBuildProject;
  pages: PagesData | null;
  onGeneratePages: () => Promise<void>;
  onGeneratePagesDetails?: () => Promise<void>;
  onGeneratePageCopy?: (pageId: 'landing' | 'thank-you' | 'bridge' | 'comparison') => Promise<void>;
  onRegenerateHeadlines: () => Promise<void>;
  onSelectHeadline: (headlineId: string, headlineText: string) => void;
  onUpdateLandingCopy: (patch: Partial<NonNullable<PagesData['landingPage']>>) => void;
  onUpdateBridgeCopy: (patch: Partial<NonNullable<PagesData['bridgePage']>>) => void;
  isHeadlineLocked: boolean;
  onToggleHeadlineLock: () => void;
  isMainCtaLocked: boolean;
  onToggleMainCtaLock: () => void;
  onProceedToEmail: () => void;
  isGenerating: boolean;
}

export const Stage5PagesArchitect: React.FC<Stage5PagesArchitectProps> = ({
  project,
  pages,
  onGeneratePages,
  onGeneratePagesDetails,
  onGeneratePageCopy,
  onRegenerateHeadlines,
  onSelectHeadline,
  onUpdateLandingCopy,
  onUpdateBridgeCopy,
  isHeadlineLocked,
  onToggleHeadlineLock,
  isMainCtaLocked,
  onToggleMainCtaLock,
  onProceedToEmail,
  isGenerating
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'MAP' | 'HEADLINES' | 'LANDING' | 'THANK_YOU' | 'BRIDGE' | 'COMPARISON' | 'HTML_EXPORT'
  >('MAP');
  const [exportHtmlType, setExportHtmlType] = useState<'LANDING' | 'BRIDGE'>('LANDING');
  const [copiedHtml, setCopiedHtml] = useState(false);

  if (!pages) {
    return (
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-8 text-center space-y-4">
        <Layout className="w-10 h-10 text-[#F5BF1E] mx-auto" />
        <h2 className="text-xl font-bold text-[#FCFCFA]">
          مهندس الصفحات والنصوص التحويلية (Page Architect)
        </h2>
        <p className="text-sm text-[#A39E93] max-w-xl mx-auto">
          تحديد الصفحات المطلوبة فعليًا، توليد 10 زوايا للعناوين، وبناء نصوص صفحة الهبوط والشكر والجسر بدون ادعاءات وهمية.
        </p>
        <button
          type="button"
          disabled={isGenerating}
          onClick={onGeneratePages}
          className="px-6 py-3 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-sm rounded-lg inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'بنبني هيكل ونصوص الصفحات...' : 'توليد خريطة الصفحات والنصوص'}</span>
        </button>
      </div>
    );
  }

  const generatedHtmlCode = generateStandalonePageHtml(project, exportHtmlType);

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generatedHtmlCode);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([generatedHtmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportHtmlType.toLowerCase()}-page-rtl.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#F5BF1E] font-semibold">
            المرحلة 4 — Page Architect & Conversion Copy
          </span>
          <h1 className="text-2xl font-bold text-[#FCFCFA] mt-0.5">
            هندسة الصفحات، محرك العناوين، وتصدير <bdi dir="ltr">RTL HTML</bdi>
          </h1>
          <p className="text-xs text-[#A39E93] mt-1">
            لكل صفحة وظيفة واحدة فقط؛ بدون شهادات وهمية أو ندرة زائفة ومع إفصاح أفلييت شفاف.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onGeneratePagesDetails && (
            <button
              type="button"
              disabled={isGenerating}
              onClick={onGeneratePagesDetails}
              className="px-4 py-2 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold rounded-lg text-xs flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>توليد نصوص الصفحات الكاملة بالعنوان المختار</span>
            </button>
          )}

          <button
            type="button"
            disabled={isGenerating}
            onClick={onGeneratePages}
            className="px-4 py-2 bg-[#141216] hover:bg-[#23170D] border border-[#F5BF1E]/30 rounded-lg text-xs font-semibold text-[#FBD052] flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>إعادة خريطة الصفحات والعناوين</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#0C0B0E] border border-white/10 rounded-xl">
        {[
          { id: 'MAP', label: '1. خريطة الصفحات (Page Purpose Map)' },
          { id: 'HEADLINES', label: '2. محرك العناوين (10 زوايا)' },
          { id: 'LANDING', label: '3. صفحة الهبوط (Landing Page)' },
          { id: 'THANK_YOU', label: '4. صفحة الشكر (Thank You)' },
          { id: 'BRIDGE', label: '5. صفحة الجسر (Bridge Page)' },
          { id: 'COMPARISON', label: '6. المراجعة والمقارنة' },
          { id: 'HTML_EXPORT', label: '7. Generate Page HTML (كود جاهز)' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'bg-[#F5BF1E] text-[#040405]'
                : 'text-[#A39E93] hover:text-[#FCFCFA]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Page Purpose Map */}
      {activeSubTab === 'MAP' && (
        <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#FCFCFA]">
            خريطة وظائف الصفحات المطلوبة (Page Purpose Map)
          </h2>
          <div className="space-y-4">
            {pages.pagePurposeMap.map((pg) => (
              <div
                key={pg.id}
                className="bg-[#141216] border border-white/10 rounded-xl p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 pb-3">
                  <div>
                    <span className="text-xs font-mono text-[#F5BF1E]">
                      <bdi dir="ltr">{pg.pageNameEn}</bdi>
                    </span>
                    <h3 className="text-base font-bold text-[#FCFCFA]">{pg.pageNameAr}</h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">
                    {pg.requiredNow ? 'مطلوبة في البناء الأساسي ✓' : 'اختيارية لاحقًا'} · حدث التتبع:{' '}
                    <bdi dir="ltr">{pg.trackingEvent}</bdi>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="text-[#A39E93]">الوظيفة (Purpose):</div>
                    <div className="text-[#FCFCFA] mt-0.5">{pg.purpose}</div>
                  </div>
                  <div>
                    <div className="text-[#A39E93]">سؤال الزائر الرئيسي:</div>
                    <div className="text-[#FBD052] mt-0.5">{pg.mainQuestion}</div>
                  </div>
                  <div>
                    <div className="text-[#A39E93]">الرسالة الأساسية:</div>
                    <div className="text-[#FCFCFA] mt-0.5">{pg.primaryMessage}</div>
                  </div>
                  <div>
                    <div className="text-[#A39E93]">الـCTA الأساسي:</div>
                    <div className="text-emerald-400 font-bold mt-0.5">{pg.mainCta}</div>
                  </div>
                  <div>
                    <div className="text-[#A39E93]">الاعتراض المعالج + عنصر الثقة:</div>
                    <div className="text-[#FCFCFA] mt-0.5">
                      {pg.objectionHandled} — ({pg.trustElement})
                    </div>
                  </div>
                  <div>
                    <div className="text-[#A39E93]">الوجهة التالية (Next Destination):</div>
                    <div className="text-[#F5BF1E] font-semibold mt-0.5">
                      {pg.nextDestination}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Headline Engine */}
      {activeSubTab === 'HEADLINES' && (
        <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#FCFCFA]">
                محرك العناوين التحويلية (Headline Engine — 10 Angles)
              </h2>
              <p className="text-xs text-[#A39E93]">
                تقييم كل عنوان من 0 إلى 10 في الوضوح، الصلة، التحديد، تطابق الرسالة، والمصداقية.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleHeadlineLock}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 ${
                  isHeadlineLocked
                    ? 'bg-[#23170D] border-[#F5BF1E] text-[#FBD052]'
                    : 'bg-[#141216] border-white/15 text-[#A39E93]'
                }`}
              >
                {isHeadlineLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{isHeadlineLocked ? 'العنوان مقفل' : 'قفل العنوان المختار'}</span>
              </button>

              <button
                type="button"
                disabled={isGenerating || isHeadlineLocked}
                onClick={onRegenerateHeadlines}
                className="px-3.5 py-1.5 bg-[#141216] hover:bg-[#23170D] disabled:opacity-40 border border-[#F5BF1E]/30 rounded-lg text-xs font-semibold text-[#FBD052] flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>توليد عناوين جديدة فقط</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {pages.headlineOptions.map((hl) => {
              const isSelected = pages.landingPage.headlineAr === hl.headlineAr;
              return (
                <div
                  key={hl.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#23170D]/80 border-[#F5BF1E]'
                      : 'bg-[#141216] border-white/10'
                  }`}
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#F5BF1E] font-bold">{hl.angleAr}</span>
                      <span className="text-[#A39E93] font-mono">
                        (<bdi dir="ltr">{hl.angleEn}</bdi>)
                      </span>
                      {hl.isRecommended && (
                        <span className="text-emerald-400 font-semibold">★ موصى به</span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-[#FCFCFA] leading-relaxed">
                      {hl.headlineAr}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums text-[#A39E93]">
                      <span>وضوح: <strong className="text-[#FCFCFA]">{hl.clarityScore}</strong></span>
                      <span>·</span>
                      <span>تحديد: <strong className="text-[#FCFCFA]">{hl.specificityScore}</strong></span>
                      <span>·</span>
                      <span>تطابق: <strong className="text-[#F5BF1E]">{hl.messageMatchScore}</strong></span>
                      <span>·</span>
                      <span>مصداقية: <strong className="text-emerald-400">{hl.credibilityScore}</strong></span>
                    </div>

                    <button
                      type="button"
                      disabled={isHeadlineLocked || isSelected}
                      onClick={() => onSelectHeadline(hl.id, hl.headlineAr)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        isSelected
                          ? 'bg-[#F5BF1E] text-[#040405]'
                          : 'bg-[#040405] hover:bg-[#23170D] text-[#FCFCFA] border border-white/15'
                      }`}
                    >
                      {isSelected ? 'العنوان المعتمد ✓' : 'اعتماد العنوان'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Landing Page Architecture & Copy */}
      {activeSubTab === 'LANDING' && (
        !pages.landingPage ? (
          <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-8 text-center space-y-4">
            <Layout className="w-10 h-10 text-[#F5BF1E] mx-auto" />
            <h2 className="text-xl font-bold text-[#FCFCFA]">
              نسخة هذه الصفحة لم تُبنَ بعد
            </h2>
            <p className="text-xs text-[#A39E93] max-w-md mx-auto">
              اضغط لبناء نصوص وهندسة صفحة الهبوط المباشرة بناءً على العنوان المعتمد ووعد الـLead Magnet.
            </p>
            {(onGeneratePageCopy || onGeneratePagesDetails) && (
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => onGeneratePageCopy ? onGeneratePageCopy('landing') : onGeneratePagesDetails?.()}
                className="px-5 py-2.5 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-xs rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'جاري بناء صفحة الهبوط...' : 'بناء نسخة صفحة الهبوط'}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#FCFCFA]">
                  نصوص وهندسة صفحة الهبوط (Landing Page Copy)
                </h2>
                <p className="text-xs text-[#A39E93]">
                  جميع الحقول قابلة للتعديل المباشر ومحمية ضد اختلاق الشهادات الوهمية.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={pages.landingPage.status}
                  onChange={(e) =>
                    onUpdateLandingCopy({ status: e.target.value as CopyStatus })
                  }
                  className="bg-[#141216] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-[#FBD052] font-mono"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="NEEDS EVIDENCE">NEEDS EVIDENCE</option>
                </select>

                <button
                  type="button"
                  onClick={onToggleMainCtaLock}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 ${
                    isMainCtaLocked
                      ? 'bg-[#23170D] border-[#F5BF1E] text-[#FBD052]'
                      : 'bg-[#141216] border-white/15 text-[#A39E93]'
                  }`}
                >
                  {isMainCtaLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{isMainCtaLocked ? 'الـCTA مقفل' : 'قفل الـCTA'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#F5BF1E] mb-1">
                  العنوان الرئيسي (Headline)
                </label>
                <input
                  type="text"
                  disabled={isHeadlineLocked}
                  value={pages.landingPage.headlineAr}
                  onChange={(e) => onUpdateLandingCopy({ headlineAr: e.target.value })}
                  className="w-full bg-[#141216] border border-white/15 rounded-lg p-3 text-sm font-bold text-[#FCFCFA] disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F5BF1E] mb-1">
                  العنوان الفرعي (Subheadline)
                </label>
                <textarea
                  rows={2}
                  value={pages.landingPage.subheadlineAr}
                  onChange={(e) => onUpdateLandingCopy({ subheadlineAr: e.target.value })}
                  className="w-full bg-[#141216] border border-white/15 rounded-lg p-3 text-sm text-[#FCFCFA]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F5BF1E] mb-1">
                  النص الداعم (Supporting Copy)
                </label>
                <textarea
                  rows={3}
                  value={pages.landingPage.supportingCopyAr}
                  onChange={(e) => onUpdateLandingCopy({ supportingCopyAr: e.target.value })}
                  className="w-full bg-[#141216] border border-white/15 rounded-lg p-3 text-sm text-[#FCFCFA]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#F5BF1E] mb-1">
                    نقاط القيمة (What You'll Get Bullets)
                  </label>
                  <textarea
                    rows={5}
                    value={pages.landingPage.whatYouGetBullets.join('\n')}
                    onChange={(e) =>
                      onUpdateLandingCopy({
                        whatYouGetBullets: e.target.value.split('\n').filter(Boolean)
                      })
                    }
                    className="w-full bg-[#141216] border border-white/15 rounded-lg p-3 text-xs text-[#FCFCFA]"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#F5BF1E] mb-1">
                      نص زر الـCTA الأساسي
                    </label>
                    <input
                      type="text"
                      disabled={isMainCtaLocked}
                      value={pages.landingPage.ctaButtonTextAr}
                      onChange={(e) => onUpdateLandingCopy({ ctaButtonTextAr: e.target.value })}
                      className="w-full bg-[#141216] border border-white/15 rounded-lg p-2.5 text-sm font-bold text-[#FBD052] disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#A39E93] mb-1">
                      نص طمأنة الخصوصية (Privacy Microcopy)
                    </label>
                    <input
                      type="text"
                      value={pages.landingPage.privacyMicrocopyAr}
                      onChange={(e) =>
                        onUpdateLandingCopy({ privacyMicrocopyAr: e.target.value })
                      }
                      className="w-full bg-[#141216] border border-white/15 rounded-lg p-2.5 text-xs text-[#FCFCFA]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-400 mb-1">
                      موضع المصداقية (Credibility Safe Placeholder)
                    </label>
                    <input
                      type="text"
                      value={pages.landingPage.credibilityPlaceholderAr}
                      onChange={(e) =>
                        onUpdateLandingCopy({ credibilityPlaceholderAr: e.target.value })
                      }
                      className="w-full bg-[#23170D] border border-[#F5BF1E]/30 rounded-lg p-2.5 text-xs text-[#FBD052]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* 4. Thank You Page */}
      {activeSubTab === 'THANK_YOU' && (
        !pages.thankYouPage ? (
          <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-8 text-center space-y-4">
            <Layout className="w-10 h-10 text-[#F5BF1E] mx-auto" />
            <h2 className="text-xl font-bold text-[#FCFCFA]">
              نسخة هذه الصفحة لم تُبنَ بعد
            </h2>
            <p className="text-xs text-[#A39E93] max-w-md mx-auto">
              صفحة الشكر لا تكتفي بعبارة "شكرًا لك" بل تسلم الأصل، تضبط التوقعات، وتمهد للخطوة التالية.
            </p>
            {(onGeneratePageCopy || onGeneratePagesDetails) && (
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => onGeneratePageCopy ? onGeneratePageCopy('thank-you') : onGeneratePagesDetails?.()}
                className="px-5 py-2.5 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-xs rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'جاري بناء صفحة الشكر...' : 'بناء نسخة صفحة الشكر'}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#FCFCFA]">
              هندسة صفحة الشكر والتمهيد (Thank-You Page Engine)
            </h2>
            <p className="text-xs text-[#A39E93]">
              صفحة الشكر لا تكتفي بعبارة "شكرًا لك" بل تسلم الأصل، تضبط التوقعات، وتمهد للخطوة التالية.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#141216] p-4 rounded-xl border border-white/8 space-y-1">
                <div className="text-[#F5BF1E] font-bold">الهدف الرئيسي للصفحة</div>
                <p className="text-[#FCFCFA]">{pages.thankYouPage.primaryObjectiveAr}</p>
              </div>
              <div className="bg-[#141216] p-4 rounded-xl border border-white/8 space-y-1">
                <div className="text-[#F5BF1E] font-bold">تعليمات تسليم الـLead Magnet</div>
                <p className="text-[#FCFCFA]">{pages.thankYouPage.deliveryInstructionAr}</p>
              </div>
              <div className="bg-[#141216] p-4 rounded-xl border border-white/8 space-y-1">
                <div className="text-[#F5BF1E] font-bold">الالتزام الصغير المطلوب (Micro-Commitment)</div>
                <p className="text-[#FCFCFA]">{pages.thankYouPage.microCommitmentAskAr}</p>
              </div>
              <div className="bg-[#141216] p-4 rounded-xl border border-white/8 space-y-1">
                <div className="text-[#F5BF1E] font-bold">التمهيد الذكي للعرض (Offer Pre-Frame)</div>
                <p className="text-[#FCFCFA]">{pages.thankYouPage.offerPreFrameAr}</p>
              </div>
              <div className="bg-[#23170D] p-4 rounded-xl border border-[#F5BF1E]/40 md:col-span-2 space-y-1">
                <div className="text-[#FBD052] font-bold">الـCTA الانتقالي في صفحة الشكر</div>
                <p className="text-sm font-bold text-[#FCFCFA]">
                  {pages.thankYouPage.nextStepCtaAr}
                </p>
              </div>
            </div>
          </div>
        )
      )}

      {/* 5. Bridge Page Engine */}
      {activeSubTab === 'BRIDGE' && (
        !pages.bridgePage ? (
          <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-8 text-center space-y-4">
            <Layout className="w-10 h-10 text-[#F5BF1E] mx-auto" />
            <h2 className="text-xl font-bold text-[#FCFCFA]">
              نسخة هذه الصفحة لم تُبنَ بعد
            </h2>
            <p className="text-xs text-[#A39E93] max-w-md mx-auto">
              يربط مشكلة الجمهور بالحل في برنامج الأفلييت مع الحفاظ التام على الشفافية وعدم انتحال ملكية المنتج.
            </p>
            {(onGeneratePageCopy || onGeneratePagesDetails) && (
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => onGeneratePageCopy ? onGeneratePageCopy('bridge') : onGeneratePagesDetails?.()}
                className="px-5 py-2.5 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-xs rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'جاري بناء صفحة الجسر...' : 'بناء نسخة صفحة الجسر'}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-[#FCFCFA]">
                  مهندس صفحة الجسر (Bridge Page Engine)
                </h2>
                <p className="text-xs text-[#A39E93]">
                  يربط مشكلة الجمهور بالحل في برنامج الأفلييت مع الحفاظ التام على الشفافية وعدم انتحال ملكية المنتج.
                </p>
              </div>
            </div>

            <div className="bg-[#23170D] border border-[#F5BF1E]/35 rounded-xl p-4 text-xs space-y-1.5">
              <div className="font-bold text-[#F5BF1E]">
                إفصاح الأفلييت الإلزامي (Affiliate Disclosure):
              </div>
              <input
                type="text"
                value={pages.bridgePage.affiliateDisclosureAr}
                onChange={(e) =>
                  onUpdateBridgeCopy({ affiliateDisclosureAr: e.target.value })
                }
                className="w-full bg-[#040405] border border-white/15 rounded-lg p-2.5 text-xs text-[#FCFCFA]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#141216] p-4 rounded-xl border border-white/8 space-y-1">
                <div className="text-[#F5BF1E] font-bold">1. تذكير المشكلة والفجوة</div>
                <p className="text-[#FCFCFA] leading-relaxed">{pages.bridgePage.problemRecapAr}</p>
              </div>
              <div className="bg-[#141216] p-4 rounded-xl border border-white/8 space-y-1">
                <div className="text-[#F5BF1E] font-bold">2. معايير اختيار الحل الصحيح</div>
                <p className="text-[#FCFCFA] leading-relaxed">{pages.bridgePage.whatToLookForAr}</p>
              </div>
              <div className="bg-[#141216] p-4 rounded-xl border border-white/8 md:col-span-2 space-y-1">
                <div className="text-[#F5BF1E] font-bold">3. تقديم المنتج بشفافية</div>
                <textarea
                  rows={2}
                  value={pages.bridgePage.productIntroductionAr}
                  onChange={(e) =>
                    onUpdateBridgeCopy({ productIntroductionAr: e.target.value })
                  }
                  className="w-full bg-[#040405] border border-white/15 rounded-lg p-2.5 text-xs text-[#FCFCFA]"
                />
              </div>

              <div className="bg-[#141216] p-4 rounded-xl border border-emerald-500/25 space-y-2">
                <div className="text-emerald-400 font-bold">أبرز المميزات (Pros)</div>
                <ul className="space-y-1 text-[#FCFCFA]">
                  {pages.bridgePage.pros.map((p, i) => (
                    <li key={i}>✓ {p}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#141216] p-4 rounded-xl border border-amber-500/25 space-y-2">
                <div className="text-amber-400 font-bold">القيود والملاحظات الشفافة (Limitations)</div>
                <ul className="space-y-1 text-[#FCFCFA]">
                  {pages.bridgePage.potentialLimitations.map((l, i) => (
                    <li key={i}>• {l}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )
      )}

      {/* 6. Review / Comparison Structure */}
      {activeSubTab === 'COMPARISON' && (
        !pages.reviewComparisonPage ? (
          <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-8 text-center space-y-4">
            <Layout className="w-10 h-10 text-[#F5BF1E] mx-auto" />
            <h2 className="text-xl font-bold text-[#FCFCFA]">
              نسخة هذه الصفحة لم تُبنَ بعد
            </h2>
            <p className="text-xs text-[#A39E93] max-w-md mx-auto">
              مقارنة مبنية على معايير قرار واضحة بدون ترتيب زائف أو أسعار مخترعة.
            </p>
            {(onGeneratePageCopy || onGeneratePagesDetails) && (
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => onGeneratePageCopy ? onGeneratePageCopy('comparison') : onGeneratePagesDetails?.()}
                className="px-5 py-2.5 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-xs rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'جاري بناء صفحة المقارنة...' : 'بناء نسخة صفحة المراجعة والمقارنة'}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#FCFCFA]">
                هيكل صفحة المراجعة والمقارنة (<bdi dir="ltr">{pages.reviewComparisonPage.pageType}</bdi>)
              </h2>
              <p className="text-xs text-[#A39E93]">
                مقارنة مبنية على معايير قرار واضحة بدون ترتيب زائف أو أسعار مخترعة.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/15 text-[#A39E93]">
                    <th className="py-3 px-3">معيار المقارنة</th>
                    <th className="py-3 px-3 text-[#F5BF1E]">العرض المختار</th>
                    <th className="py-3 px-3">البديل التقليدي / اليدوي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {pages.reviewComparisonPage.featureComparisonRows.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-3 font-bold text-[#FCFCFA]">{row.feature}</td>
                      <td className="py-3 px-3 text-emerald-300">{row.offerNote}</td>
                      <td className="py-3 px-3 text-[#A39E93]">{row.alternativeNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 rounded-lg bg-[#141216] border border-white/10 text-xs text-[#A39E93]">
              <strong className="text-[#FBD052]">تنبيه التسعير: </strong>
              {pages.reviewComparisonPage.pricingVerificationNoteAr}
            </div>
          </div>
        )
      )}

      {/* 7. Optional HTML Export */}
      {activeSubTab === 'HTML_EXPORT' && (
        <div className="bg-[#0C0B0E] border border-[#F5BF1E]/35 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Code2 className="w-5 h-5 text-[#F5BF1E]" />
              <div>
                <h2 className="text-lg font-bold text-[#FCFCFA]">
                  تصدير كود الصفحة الجاهز — Generate Page HTML (RTL)
                </h2>
                <p className="text-xs text-[#A39E93]">
                  كود <bdi dir="ltr">HTML/CSS</bdi> متجاوب باللون الأسود والذهبي (<bdi dir="ltr">#040405 / #F5BF1E / #FCFCFA</bdi>) مع ضبط <bdi dir="ltr">&lt;bdi dir="ltr"&gt;</bdi> تلقائيًا.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-[#141216] p-1 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setExportHtmlType('LANDING')}
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    exportHtmlType === 'LANDING'
                      ? 'bg-[#F5BF1E] text-[#040405]'
                      : 'text-[#A39E93]'
                  }`}
                >
                  صفحة الهبوط
                </button>
                <button
                  type="button"
                  onClick={() => setExportHtmlType('BRIDGE')}
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    exportHtmlType === 'BRIDGE'
                      ? 'bg-[#F5BF1E] text-[#040405]'
                      : 'text-[#A39E93]'
                  }`}
                >
                  صفحة الجسر
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyHtml}
                className="px-3.5 py-2 bg-[#141216] hover:bg-[#23170D] border border-white/15 rounded-lg text-xs text-[#FCFCFA] flex items-center gap-1.5"
              >
                {copiedHtml ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تم نسخ الكود</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#F5BF1E]" />
                    <span>نسخ كود HTML</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadHtml}
                className="px-4 py-2 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold rounded-lg text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل ملف .html</span>
              </button>
            </div>
          </div>

          <pre
            dir="ltr"
            className="bg-[#040405] border border-white/10 rounded-xl p-4 text-xs font-mono text-[#D6D3CD] overflow-x-auto max-h-[380px]"
          >
            {generatedHtmlCode}
          </pre>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onProceedToEmail}
          className="px-6 py-3 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-sm rounded-lg flex items-center gap-2"
        >
          <span>الانتقال للمرحلة 6: منظومة الإيميلات</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
