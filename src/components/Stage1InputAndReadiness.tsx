import React, { useState } from 'react';
import {
  AwarenessLevel,
  ReadinessCheckResult,
  ResearchInput
} from '../types/buildTypes';
import { RESEARCH_PROJECT_PRESETS } from '../data/presets';
import {
  Upload,
  FileText,
  Edit3,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface Stage1InputAndReadinessProps {
  researchInput: ResearchInput;
  readiness: ReadinessCheckResult;
  onUpdateInput: (updated: Partial<ResearchInput>) => void;
  onLoadPreset: (presetId: string) => void;
  onParseRawBrief: (rawText: string) => Promise<void>;
  onContinueAsHypothesis: () => void;
  onProceedToJourney: () => void;
  isGenerating: boolean;
  lockedAudience: boolean;
}

export const Stage1InputAndReadiness: React.FC<Stage1InputAndReadinessProps> = ({
  researchInput,
  readiness,
  onUpdateInput,
  onLoadPreset,
  onParseRawBrief,
  onContinueAsHypothesis,
  onProceedToJourney,
  isGenerating,
  lockedAudience
}) => {
  const [activeTab, setActiveTab] = useState<'IMPORT' | 'PASTE' | 'MANUAL'>(
    researchInput.inputMethod || 'IMPORT'
  );
  const [pastedBriefText, setPastedBriefText] = useState('');
  const [importError, setImportError] = useState('');

  const handleTabSwitch = (tab: 'IMPORT' | 'PASTE' | 'MANUAL') => {
    setActiveTab(tab);
    onUpdateInput({ inputMethod: tab });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(String(event.target?.result || '{}'));
        const source = json.researchInput || json.research_input || json;
        onUpdateInput({
          inputMethod: 'IMPORT',
          projectName: source.projectName || source.project_name || 'مشروع مستورد من Research Engine',
          market: source.market || '',
          niche: source.niche || '',
          audience: source.audience || '',
          primaryProblem: source.primaryProblem || source.problem || '',
          desiredOutcome: source.desiredOutcome || source.desired_outcome || '',
          offerCategory: source.offerCategory || '',
          selectedOffer: source.selectedOffer || source.offer || '',
          trafficHypothesis: source.trafficHypothesis || source.traffic || '',
          primaryContentChannel: source.primaryContentChannel || '',
          awarenessStage: (source.awarenessStage as AwarenessLevel) || 'Solution Aware',
          ctaGoal: source.ctaGoal || '',
          researchConfidence: Number(source.researchConfidence ?? 75)
        });
      } catch {
        setImportError('تعذر قراءة ملف JSON. تأكد من صحة تنسيق ملف مخرجات Affiliate Research Engine.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      {/* Core Principle Banner */}
      <div className="bg-[#0C0B0E] border border-[#F5BF1E]/25 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs text-[#F5BF1E] font-semibold">
            المرحلة الثانية في نظام <bdi dir="ltr">R.B.T.L.S — Stage B: Build</bdi>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#FCFCFA]">
            الفانل مش مجموعة صفحات — الفانل رحلة قرار منظمة
          </h1>
          <p className="text-sm text-[#A39E93]">
            سلسلة الترابط الإلزامية:{' '}
            <bdi dir="ltr" className="text-[#FCFCFA] font-mono text-xs">
              Market → Niche → Audience → Problem → Offer
            </bdi>{' '}
            ثم{' '}
            <bdi dir="ltr" className="text-[#FBD052] font-mono text-xs">
              Message → Funnel → Lead Magnet → Pages → Email → Automation
            </bdi>
          </p>
        </div>
      </div>

      {/* 3 Input Method Tabs */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#0C0B0E] border border-white/10 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => handleTabSwitch('IMPORT')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'IMPORT'
                ? 'bg-[#F5BF1E] text-[#040405]'
                : 'text-[#A39E93] hover:text-[#FCFCFA]'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>1. استيراد مشروع بحث (موصى به)</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('PASTE')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'PASTE'
                ? 'bg-[#F5BF1E] text-[#040405]'
                : 'text-[#A39E93] hover:text-[#FCFCFA]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. لصق ملخص البحث (Paste Research Brief)</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('MANUAL')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'MANUAL'
                ? 'bg-[#F5BF1E] text-[#040405]'
                : 'text-[#A39E93] hover:text-[#FCFCFA]'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>3. إدخال يدوي مباشر</span>
          </button>
        </div>

        {/* Option 1: Import Research Project */}
        {activeTab === 'IMPORT' && (
          <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#FCFCFA]">
                  اختر مشروع بحث جاهز أو ارفع ملف <bdi dir="ltr">JSON</bdi> من أداة البحث
                </h2>
                <p className="text-xs text-[#A39E93]">
                  يقوم المحرك بإعادة استخدام كافة مخرجات البحث تلقائيًا دون سؤالك عنها مرة أخرى.
                </p>
              </div>
              <label className="px-4 py-2 bg-[#141216] hover:bg-[#23170D] border border-[#F5BF1E]/30 rounded-lg text-xs font-semibold text-[#FBD052] cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2">
                <Upload className="w-3.5 h-3.5" />
                <span>رفع ملف Research JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {importError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                {importError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {RESEARCH_PROJECT_PRESETS.map((preset) => {
                const isSelected =
                  researchInput.projectName === preset.input.projectName;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onLoadPreset(preset.id)}
                    className={`text-right p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#23170D] border-[#F5BF1E] shadow-sm'
                        : 'bg-[#141216] border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="text-xs font-mono text-[#F5BF1E]">
                        {preset.badgeAr}
                      </div>
                      <h3 className="text-sm font-bold text-[#FCFCFA]">
                        {preset.input.projectName}
                      </h3>
                      <p className="text-xs text-[#A39E93] leading-relaxed">
                        {preset.summaryAr}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-white/8 flex items-center justify-between text-[11px] text-[#A39E93]">
                      <span>
                        العرض: <bdi dir="ltr">{preset.input.selectedOffer.slice(0, 22)}</bdi>
                      </span>
                      <span className="text-[#FBD052] font-semibold">
                        {isSelected ? 'المشروع النشط ✓' : 'استيراد ←'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Option 2: Paste Research Brief */}
        {activeTab === 'PASTE' && (
          <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#FCFCFA]">
              الصق تقرير البحث أو الملاحظات المنظمة لاستخراج الحقول تلقائيًا
            </h2>
            <p className="text-xs text-[#A39E93]">
              سيقوم المحرك باستخراج السوق، الجمهور، المشكلة، العرض، الاعتراضات، ومستوى الوعي لتراجعها وتؤكدها.
            </p>
            <textarea
              rows={5}
              value={pastedBriefText}
              onChange={(e) => setPastedBriefText(e.target.value)}
              placeholder="الصق هنا تقرير البحث أو ملاحظاتك حول الجمهور والمشكلة والعرض ومصدر الترافيك..."
              className="w-full bg-[#141216] border border-white/15 rounded-lg p-3.5 text-sm text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E]"
            />
            <div className="flex justify-end">
              <button
                type="button"
                disabled={isGenerating || !pastedBriefText.trim()}
                onClick={() => onParseRawBrief(pastedBriefText)}
                className="px-5 py-2.5 bg-[#F5BF1E] hover:bg-[#FBD052] disabled:opacity-50 text-[#040405] font-bold text-xs rounded-lg flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isGenerating
                    ? 'جاري استخراج وتحليل بيانات البحث...'
                    : 'استخراج بيانات البحث وتعبئة الحقول'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Option 3: Manual Start Warning */}
        {activeTab === 'MANUAL' && (
          <div className="bg-[#23170D] border border-[#F5BF1E]/40 rounded-xl p-4 flex items-center gap-3 text-xs text-[#FBD052]">
            <AlertTriangle className="w-5 h-5 text-[#F5BF1E] shrink-0" />
            <div>
              <strong>تنبيه منهجي:</strong> الأفضل إن مرحلة <bdi dir="ltr">Build</bdi> تبدأ بعد <bdi dir="ltr">Research</bdi> واضحة. أدخل المعلومات الأساسية بالأسفل بدقة لتجنب بناء فانل عشوائي.
            </div>
          </div>
        )}
      </div>

      {/* Research Dependency Warning when Confidence < 50 */}
      {researchInput.researchConfidence < 50 && (
        <div className="bg-[#23170D] border border-amber-500/50 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>
              تحذير اعتمادية البحث — ثقة البحث منخفضة (<bdi dir="ltr">{researchInput.researchConfidence}/100</bdi>)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#FCFCFA] leading-relaxed">
            "إحنا نقدر نبني Minimum Funnel للاختبار، لكن مش منطقي نبني نظام كبير قبل التحقق من المشكلة والعرض."
          </p>
          <p className="text-xs text-[#A39E93]">
            تم تفعيل وضع <bdi dir="ltr" className="text-[#F5BF1E] font-mono">CONSERVATIVE_MVF</bdi> تلقائيًا لتقليص تعقيد البناء وحمايتك من إهدار الوقت.
          </p>
        </div>
      )}

      {/* Structured Research Inputs Form (Editable / Reviewable) */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#FCFCFA]">
              بيانات الترابط الأساسية (Research Foundation)
            </h2>
            <p className="text-xs text-[#A39E93]">
              راجع أو عدّل المدخلات قبل تشغيل مهندس رحلة العميل. كل صفحة وإيميل وأتمتة ستُبنى حصريًا من هذه البيانات.
            </p>
          </div>
          <div className="text-xs text-[#A39E93] font-mono">
            حالة البحث: <span className="text-[#F5BF1E]">{researchInput.researchIntegrityStatus}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#A39E93] mb-1.5">
              السوق والنيتش (Market & Niche)
            </label>
            <input
              type="text"
              value={researchInput.niche}
              onChange={(e) => onUpdateInput({ niche: e.target.value })}
              className="w-full bg-[#141216] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A39E93] mb-1.5">
              العرض المختار (Selected Offer)
            </label>
            <input
              type="text"
              value={researchInput.selectedOffer}
              onChange={(e) => onUpdateInput({ selectedOffer: e.target.value })}
              className="w-full bg-[#141216] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#A39E93] mb-1.5">
              الجمهور المحدد بدقة (Target Audience){' '}
              {lockedAudience && <span className="text-[#F5BF1E]">(مقفل ضد التغيير)</span>}
            </label>
            <textarea
              rows={2}
              disabled={lockedAudience}
              value={researchInput.audience}
              onChange={(e) => onUpdateInput({ audience: e.target.value })}
              className="w-full bg-[#141216] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#FCFCFA] disabled:opacity-60 focus:outline-none focus:border-[#F5BF1E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A39E93] mb-1.5">
              المشكلة الأساسية (Primary Problem)
            </label>
            <textarea
              rows={3}
              value={researchInput.primaryProblem}
              onChange={(e) => onUpdateInput({ primaryProblem: e.target.value })}
              className="w-full bg-[#141216] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A39E93] mb-1.5">
              النتيجة المرغوبة (Desired Outcome)
            </label>
            <textarea
              rows={3}
              value={researchInput.desiredOutcome}
              onChange={(e) => onUpdateInput({ desiredOutcome: e.target.value })}
              className="w-full bg-[#141216] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A39E93] mb-1.5">
              مصدر الترافيك الأساسي وقناة المحتوى
            </label>
            <input
              type="text"
              value={researchInput.trafficHypothesis}
              onChange={(e) => onUpdateInput({ trafficHypothesis: e.target.value })}
              className="w-full bg-[#141216] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#A39E93] mb-1.5">
                مستوى وعي الجمهور (Awareness Stage)
              </label>
              <select
                value={researchInput.awarenessStage}
                onChange={(e) =>
                  onUpdateInput({ awarenessStage: e.target.value as AwarenessLevel })
                }
                className="w-full bg-[#141216] border border-white/12 rounded-lg px-3 py-2.5 text-sm text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E]"
              >
                <option value="Unaware">Unaware (غير واعي بالمشكلة)</option>
                <option value="Problem Aware">Problem Aware (واعي بالمشكلة)</option>
                <option value="Solution Aware">Solution Aware (واعي بالحل)</option>
                <option value="Product Aware">Product Aware (واعي بالمنتج)</option>
                <option value="Most Aware">Most Aware (الأكثر وعيًا)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A39E93] mb-1.5">
                درجة ثقة البحث (<bdi dir="ltr">{researchInput.researchConfidence}/100</bdi>)
              </label>
              <input
                type="range"
                min={10}
                max={100}
                value={researchInput.researchConfidence}
                onChange={(e) =>
                  onUpdateInput({ researchConfidence: Number(e.target.value) })
                }
                className="w-full accent-[#F5BF1E] mt-2"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#A39E93] mb-1.5">
              هدف الـCTA الأولي (CTA Goal)
            </label>
            <input
              type="text"
              value={researchInput.ctaGoal}
              onChange={(e) => onUpdateInput({ ctaGoal: e.target.value })}
              className="w-full bg-[#141216] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#A39E93] mb-1.5">
              أهم اعتراضات الجمهور المرصودة في البحث (مفصولة بسطر جديد)
            </label>
            <textarea
              rows={3}
              value={researchInput.audienceObjections.join('\n')}
              onChange={(e) =>
                onUpdateInput({
                  audienceObjections: e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean)
                })
              }
              className="w-full bg-[#141216] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E]"
            />
          </div>
        </div>
      </div>

      {/* Build Readiness Check Panel */}
      <div className="bg-[#0C0B0E] border border-white/12 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {readiness.gaps.length === 0 ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-[#F5BF1E] shrink-0" />
            )}
            <div>
              <h2 className="text-lg font-bold text-[#FCFCFA]">
                فحص جاهزية البناء (Build Readiness Check)
              </h2>
              <p className="text-xs text-[#A39E93]">
                لا يقوم المحرك بتوليد فانل عشوائي إذا كانت مدخلات القرار الأساسية غامضة.
              </p>
            </div>
          </div>

          <div className="text-sm font-mono tabular-nums">
            درجة الجاهزية:{' '}
            <strong className="text-[#F5BF1E]">
              <bdi dir="ltr">{readiness.readinessScore}/100</bdi>
            </strong>
          </div>
        </div>

        {readiness.gaps.length > 0 && (
          <div className="bg-[#23170D] border border-[#F5BF1E]/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#FBD052]">
                فجوة قبل البناء — Build Gap
              </h3>
              <span className="text-xs text-[#A39E93]">
                {readiness.gaps.length} ملاحظات تحتاج انتباهك
              </span>
            </div>

            <div className="p-3.5 bg-[#040405] border border-[#F5BF1E]/30 rounded-lg">
              <div className="text-xs text-[#F5BF1E] font-bold mb-1">
                الأولوية الأولى للإصلاح الآن (One Priority Fix):
              </div>
              <div className="text-sm text-[#FCFCFA] font-semibold">
                {readiness.priorityFixAr}
              </div>
            </div>

            <ul className="space-y-2 text-xs text-[#D6D3CD]">
              {readiness.gaps.map((g, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#F5BF1E] font-bold">•</span>
                  <span>
                    <strong>{g.labelAr}:</strong> {g.issueAr}
                  </span>
                </li>
              ))}
            </ul>

            {!readiness.isReady && (
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                <span className="text-xs text-[#A39E93]">
                  هل تدرك المخاطرة وتريد المتابعة لاختبار الفرضية مبدئيًا؟
                </span>
                <button
                  type="button"
                  onClick={onContinueAsHypothesis}
                  className="px-4 py-2 bg-[#141216] hover:bg-[#040405] border border-[#F5BF1E] text-[#FBD052] text-xs font-bold rounded-lg transition-colors"
                >
                  Continue as Hypothesis — أكمل كفرضية
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="text-xs text-[#A39E93]">
            {readiness.continuedAsHypothesis
              ? 'تم التفعيل: المتابعة كفرضية (سيتم بناء Minimum Funnel محافظ).'
              : readiness.priorityFixAr}
          </div>

          <button
            type="button"
            disabled={!readiness.isReady || isGenerating}
            onClick={onProceedToJourney}
            className="px-6 py-3 bg-[#F5BF1E] hover:bg-[#FBD052] disabled:opacity-40 text-[#040405] font-bold text-sm rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>الانتقال للمرحلة 2: هندسة رحلة العميل</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
