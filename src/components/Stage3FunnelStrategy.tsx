import React from 'react';
import { FunnelStrategyData } from '../types/buildTypes';
import {
  GitBranch,
  Sparkles,
  CheckCircle2,
  Lock,
  Unlock,
  AlertOctagon,
  ArrowLeft,
  RefreshCw,
  Layers
} from 'lucide-react';

interface Stage3FunnelStrategyProps {
  funnelStrategy: FunnelStrategyData | null;
  onGenerateFunnel: () => Promise<void>;
  onExpandFunnelDetails?: () => Promise<void>;
  onSelectPrimaryFunnel: (modelId: string) => void;
  onConfirmFunnel: () => void;
  isFunnelLocked: boolean;
  onToggleFunnelLock: () => void;
  onProceedToLeadMagnet: () => void;
  isGenerating: boolean;
}

export const Stage3FunnelStrategy: React.FC<Stage3FunnelStrategyProps> = ({
  funnelStrategy,
  onGenerateFunnel,
  onExpandFunnelDetails,
  onSelectPrimaryFunnel,
  onConfirmFunnel,
  isFunnelLocked,
  onToggleFunnelLock,
  onProceedToLeadMagnet,
  isGenerating
}) => {
  if (!funnelStrategy) {
    return (
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-8 text-center space-y-4">
        <GitBranch className="w-10 h-10 text-[#F5BF1E] mx-auto" />
        <h2 className="text-xl font-bold text-[#FCFCFA]">
          مهندس استراتيجية الفانل (Funnel Strategy Engine)
        </h2>
        <p className="text-sm text-[#A39E93] max-w-xl mx-auto">
          مقارنة نماذج الفانل الممكنة على 10 أبعاد استراتيجية واختيار أقل فانل قابل للتشغيل (Minimum Viable Funnel).
        </p>
        <button
          type="button"
          disabled={isGenerating}
          onClick={onGenerateFunnel}
          className="px-6 py-3 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-sm rounded-lg inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'بنقارن نماذج الفانل...' : 'تحليل ومقارنة نماذج الفانل'}</span>
        </button>
      </div>
    );
  }

  const primaryModel = funnelStrategy.evaluatedModels.find(
    (m) => m.id === funnelStrategy.primaryFunnelId
  );
  const secondaryModel = funnelStrategy.evaluatedModels.find(
    (m) => m.id === funnelStrategy.secondaryFunnelId
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#F5BF1E] font-semibold">
            المرحلة 2 — Funnel Strategy & Minimum Viable Funnel
          </span>
          <h1 className="text-2xl font-bold text-[#FCFCFA] mt-0.5">
            تقييم نماذج الفانل وخريطة التدفق
          </h1>
          <p className="text-xs text-[#A39E93] mt-1">
            لا نفرض نفس الفانل على كل مشروع؛ نختار النموذج بناءً على الترافيك والوعي واحتكاك الشراء.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFunnelLock}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              isFunnelLocked
                ? 'bg-[#23170D] border-[#F5BF1E] text-[#FBD052]'
                : 'bg-[#141216] border-white/15 text-[#A39E93] hover:text-white'
            }`}
          >
            {isFunnelLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{isFunnelLocked ? 'الفانل مقفل ومعتمد' : 'قفل الفانل المختار'}</span>
          </button>

          <button
            type="button"
            disabled={isGenerating || isFunnelLocked}
            onClick={onGenerateFunnel}
            className="px-4 py-2 bg-[#141216] hover:bg-[#23170D] disabled:opacity-40 border border-[#F5BF1E]/30 rounded-lg text-xs font-semibold text-[#FBD052] flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'بنقارن نماذج الفانل...' : 'إعادة تقييم الفانلز'}</span>
          </button>
        </div>
      </div>

      {/* Funnel Models Comparison Cards & 10-Dimension Matrix */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#FCFCFA]">
          مقارنة نماذج الفانل المرشحة (10 أبعاد تقييم من 0 إلى 10)
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {funnelStrategy.evaluatedModels.map((model) => {
            const isPrimary = model.id === funnelStrategy.primaryFunnelId;
            return (
              <div
                key={model.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between gap-4 ${
                  isPrimary
                    ? 'bg-[#23170D]/80 border-[#F5BF1E]'
                    : 'bg-[#0C0B0E] border-white/10'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`text-xs font-mono font-bold ${
                        model.badge === 'BEST STARTING MODEL'
                          ? 'text-[#F5BF1E]'
                          : model.badge === 'VALID ALTERNATIVE'
                          ? 'text-emerald-400'
                          : model.badge === 'TEST LATER'
                          ? 'text-amber-300'
                          : 'text-red-400'
                      }`}
                    >
                      <bdi dir="ltr">{model.badge}</bdi>
                    </span>
                    <span className="text-xs text-[#A39E93] font-mono">
                      <bdi dir="ltr">{model.nameEn}</bdi>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#FCFCFA]">{model.nameAr}</h3>
                  <p className="text-xs text-[#D6D3CD] leading-relaxed">{model.summaryAr}</p>

                  {/* 10 Dimensions Compact Tabular Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-[11px] tabular-nums">
                    <div className="bg-[#040405] p-2 rounded border border-white/8">
                      <div className="text-[#A39E93]">ملاءمة الترافيك</div>
                      <div className="font-mono font-bold text-[#FBD052]">
                        <bdi dir="ltr">{model.dimensions.trafficFit}/10</bdi>
                      </div>
                    </div>
                    <div className="bg-[#040405] p-2 rounded border border-white/8">
                      <div className="text-[#A39E93]">ملاءمة الوعي</div>
                      <div className="font-mono font-bold text-[#FBD052]">
                        <bdi dir="ltr">{model.dimensions.audienceAwarenessFit}/10</bdi>
                      </div>
                    </div>
                    <div className="bg-[#040405] p-2 rounded border border-white/8">
                      <div className="text-[#A39E93]">بناء الثقة</div>
                      <div className="font-mono font-bold text-[#FBD052]">
                        <bdi dir="ltr">{model.dimensions.trustRequirement}/10</bdi>
                      </div>
                    </div>
                    <div className="bg-[#040405] p-2 rounded border border-white/8">
                      <div className="text-[#A39E93]">فرصة الإيميل</div>
                      <div className="font-mono font-bold text-[#FBD052]">
                        <bdi dir="ltr">{model.dimensions.emailOpportunity}/10</bdi>
                      </div>
                    </div>
                    <div className="bg-[#040405] p-2 rounded border border-white/8">
                      <div className="text-[#A39E93]">سرعة الإطلاق</div>
                      <div className="font-mono font-bold text-[#FBD052]">
                        <bdi dir="ltr">{model.dimensions.speedToLaunch}/10</bdi>
                      </div>
                    </div>
                    <div className="bg-[#040405] p-2 rounded border border-white/8">
                      <div className="text-[#A39E93]">سهولة التنفيذ</div>
                      <div className="font-mono font-bold text-[#FCFCFA]">
                        <bdi dir="ltr">{model.dimensions.implementationDifficulty}/10</bdi>
                      </div>
                    </div>
                    <div className="bg-[#040405] p-2 rounded border border-white/8">
                      <div className="text-[#A39E93]">تجاوز الاحتكاك</div>
                      <div className="font-mono font-bold text-[#FCFCFA]">
                        <bdi dir="ltr">{model.dimensions.purchaseFriction}/10</bdi>
                      </div>
                    </div>
                    <div className="bg-[#040405] p-2 rounded border border-white/8">
                      <div className="text-[#A39E93]">استيعاب التعقيد</div>
                      <div className="font-mono font-bold text-[#FCFCFA]">
                        <bdi dir="ltr">{model.dimensions.offerComplexity}/10</bdi>
                      </div>
                    </div>
                    <div className="bg-[#040405] p-2 rounded border border-white/8">
                      <div className="text-[#A39E93]">وضوح التتبع</div>
                      <div className="font-mono font-bold text-[#FCFCFA]">
                        <bdi dir="ltr">{model.dimensions.trackingClarity}/10</bdi>
                      </div>
                    </div>
                    <div className="bg-[#040405] p-2 rounded border border-white/8">
                      <div className="text-[#A39E93]">قيمة الأصل طويل الأمد</div>
                      <div className="font-mono font-bold text-[#FCFCFA]">
                        <bdi dir="ltr">{model.dimensions.longTermAssetValue}/10</bdi>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 text-xs">
                    <div className="text-[#A39E93]">
                      <strong className="text-[#FCFCFA]">المقايضة (Tradeoffs):</strong>{' '}
                      {model.tradeoffsAr}
                    </div>
                    <div className="text-[#A39E93]">
                      <strong className="text-[#FBD052]">لماذا يناسب أو لا يناسب:</strong>{' '}
                      {model.whyFitsOrFailsAr}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-[#A39E93]">
                    {isPrimary ? 'النموذج الأساسي المعتمد ✓' : 'يمكنك التبديل لهذا النموذج'}
                  </span>
                  <button
                    type="button"
                    disabled={isFunnelLocked || isPrimary}
                    onClick={() => onSelectPrimaryFunnel(model.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      isPrimary
                        ? 'bg-[#F5BF1E] text-[#040405]'
                        : 'bg-[#141216] hover:bg-[#23170D] text-[#FCFCFA] border border-white/15'
                    }`}
                  >
                    {isPrimary ? 'الفانل المختار حاليًا' : 'اعتماد كفانل أساسي'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Funnel Decision Rationale */}
      <div className="bg-[#0C0B0E] border border-[#F5BF1E]/30 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-bold text-[#FCFCFA]">
          قرار الفانل النهائي (Funnel Decision Summary)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#141216] p-4 rounded-lg border border-white/8 space-y-1">
            <div className="text-[#F5BF1E] font-bold">الفانل الأساسي الموصى به (Primary Funnel)</div>
            <div className="text-sm font-bold text-[#FCFCFA]">{primaryModel?.nameAr}</div>
            <p className="text-[#A39E93]">{funnelStrategy.whyPrimaryFitsAr}</p>
          </div>
          <div className="bg-[#141216] p-4 rounded-lg border border-white/8 space-y-1">
            <div className="text-[#A39E93] font-bold">البديل الثاني الصالح (Secondary Funnel)</div>
            <div className="text-sm font-bold text-[#FCFCFA]">{secondaryModel?.nameAr}</div>
            <p className="text-[#A39E93]">{secondaryModel?.summaryAr}</p>
          </div>
          <div className="bg-[#141216] p-4 rounded-lg border border-white/8 space-y-1">
            <div className="text-amber-400 font-bold">المخاطرة الرئيسية (Main Risk)</div>
            <p className="text-[#FCFCFA]">{funnelStrategy.mainRiskAr}</p>
          </div>
          <div className="bg-[#141216] p-4 rounded-lg border border-white/8 space-y-1">
            <div className="text-emerald-400 font-bold">ما الذي يجب أن يتحقق لينجح؟ (What Must Be True)</div>
            <p className="text-[#FCFCFA]">{funnelStrategy.whatMustBeTrueAr}</p>
          </div>
        </div>
      </div>

      {/* Visual Funnel Map Nodes & MVF (Phase B on-demand) */}
      {!funnelStrategy.funnelMapNodes || funnelStrategy.funnelMapNodes.length === 0 ? (
        <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-8 text-center space-y-4">
          <Layers className="w-10 h-10 text-[#F5BF1E] mx-auto" />
          <h2 className="text-xl font-bold text-[#FCFCFA]">
            خريطة الفانل لم تُبنَ بعد
          </h2>
          <p className="text-xs text-[#A39E93] max-w-md mx-auto">
            تمت مقارنة وتقييم نماذج الفانل بنجاح. راجع النماذج واعتمد الأنسب، ثم اضغط لبناء خريطة التدفق البصرية الكاملة وخطة الـMVF.
          </p>
          {onExpandFunnelDetails && (
            <button
              type="button"
              disabled={isGenerating}
              onClick={onExpandFunnelDetails}
              className="px-5 py-2.5 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-xs rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'جاري بناء خريطة الفانل والـMVF...' : 'بناء خريطة الفانل المختار'}</span>
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#FCFCFA]">
                  خريطة الفانل البصرية (Visual Funnel Map)
                </h2>
                <p className="text-xs text-[#A39E93]">
                  كل عقدة في الفانل لها وظيفة واحدة، وتجيب على سؤال واحد، وتدفع الزائر لخطوة واحدة.
                </p>
              </div>
              {onExpandFunnelDetails && (
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={onExpandFunnelDetails}
                  className="px-3 py-1.5 bg-[#141216] hover:bg-[#23170D] border border-[#F5BF1E]/30 rounded-lg text-xs font-semibold text-[#FBD052] flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تحديث خريطة الفانل والـMVF</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {funnelStrategy.funnelMapNodes.map((node, i) => (
                <div key={node.id} className="space-y-2">
                  <div className="bg-[#141216] border border-white/10 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <div>
                      <span className="text-xs font-mono text-[#F5BF1E]">
                        خطوة <bdi dir="ltr">0{node.order}</bdi> · <bdi dir="ltr">{node.nodeTypeEn}</bdi>
                      </span>
                      <h3 className="text-sm font-bold text-[#FCFCFA] mt-0.5">
                        {node.nodeTitleAr}
                      </h3>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#A39E93]">الوظيفة (Purpose)</div>
                      <div className="text-xs text-[#FCFCFA] mt-0.5">{node.purpose}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#A39E93]">سؤال الزائر هنا</div>
                      <div className="text-xs text-[#FBD052] mt-0.5">{node.visitorQuestion}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#A39E93]">الرسالة والـCTA</div>
                      <div className="text-xs text-[#FCFCFA] mt-0.5">{node.mainMessage}</div>
                      <div className="text-xs text-emerald-400 font-semibold mt-1">
                        CTA: {node.cta}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#A39E93]">حدث التتبع (Tracking Event)</div>
                      <div className="text-xs font-mono text-[#F5BF1E] mt-1">
                        <bdi dir="ltr">{node.trackingEvent}</bdi>
                      </div>
                    </div>
                  </div>
                  {funnelStrategy.funnelMapNodes && i < funnelStrategy.funnelMapNodes.length - 1 && (
                    <div className="text-center text-[#F5BF1E] font-mono text-xs">↓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Minimum Viable Funnel (MVF) Protection */}
          {funnelStrategy.minimumViableFunnel && (
            <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-[#F5BF1E]" />
                <div>
                  <h2 className="text-lg font-bold text-[#FCFCFA]">
                    أقل فانل قابل للتشغيل — Minimum Viable Funnel
                  </h2>
                  <p className="text-xs text-[#A39E93]">
                    حماية المبتدئ من فخ المبالغة في البناء (Overbuilding) قبل التحقق من التحويل.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#23170D]/70 border border-[#F5BF1E]/40 rounded-xl p-4 space-y-2.5">
                  <div className="font-bold text-[#F5BF1E] text-sm">
                    1. ابنِ هذا الآن فقط (Minimum Build)
                  </div>
                  <ul className="space-y-2 text-[#FCFCFA]">
                    {funnelStrategy.minimumViableFunnel.minimumBuild.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#F5BF1E] font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#141216] border border-white/10 rounded-xl p-4 space-y-2.5">
                  <div className="font-bold text-[#FBD052] text-sm">
                    2. اختياري بعد أول نتائج (Optional Later)
                  </div>
                  <ul className="space-y-2 text-[#D6D3CD]">
                    {funnelStrategy.minimumViableFunnel.optionalLater.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#A39E93]">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#141216] border border-white/10 rounded-xl p-4 space-y-2.5">
                  <div className="font-bold text-[#A39E93] text-sm">
                    3. نسخة التوسع مستقبلاً (Scale Version)
                  </div>
                  <ul className="space-y-2 text-[#A39E93]">
                    {funnelStrategy.minimumViableFunnel.scaleVersion.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      )}

        {/* Do Not Build Yet */}
        <div className="bg-red-950/25 border border-red-500/30 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-red-300 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4" />
            <span>متبنيش ده دلوقتي (Do Not Build Yet):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#D6D3CD]">
            {funnelStrategy.doNotBuildYetAr.map((dont, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>{dont}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Explicit Confirmation Bar */}
        <div className="bg-[#141216] border border-white/10 rounded-xl p-4 space-y-3 pt-3">
          {!funnelStrategy.confirmedByStudent && (
            <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-lg text-xs text-amber-200 flex items-center gap-2">
              <span className="text-amber-400 font-bold text-sm">⚠️</span>
              <span>
                <strong>تنبيه منهجي:</strong> الذكاء الاصطناعي يقترح الفانل لكنه لا يعتمده بالنيابة عنك. يجب مراجعة الأبعاد والضغط على <strong>"تأكيد اختيار هذا الفانل"</strong> لتفعيل الانتقال للمرحلة التالية.
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <button
              type="button"
              onClick={onConfirmFunnel}
              className={`px-4 py-2.5 border text-xs font-bold rounded-lg flex items-center gap-2 transition-all ${
                funnelStrategy.confirmedByStudent
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-[#23170D] border-[#F5BF1E] text-[#FBD052] hover:bg-[#F5BF1E] hover:text-[#040405]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {funnelStrategy.confirmedByStudent
                  ? 'تم تأكيد واعتماد الفانل من الطالب ✓'
                  : 'تأكيد اختيار هذا الفانل'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (funnelStrategy.confirmedByStudent) {
                  onProceedToLeadMagnet();
                }
              }}
              disabled={!funnelStrategy.confirmedByStudent}
              title={
                !funnelStrategy.confirmedByStudent
                  ? 'يجب تأكيد اختيار هذا الفانل أولاً قبل المتابعة'
                  : ''
              }
              className={`px-6 py-3 font-bold text-sm rounded-lg flex items-center gap-2 transition-all ${
                funnelStrategy.confirmedByStudent
                  ? 'bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] cursor-pointer'
                  : 'bg-white/10 text-[#A39E93] cursor-not-allowed opacity-50'
              }`}
            >
              <span>الانتقال للمرحلة 4: هندسة الـLead Magnet</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
  );
};
