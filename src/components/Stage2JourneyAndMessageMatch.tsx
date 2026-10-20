import React from 'react';
import { CustomerJourneyData, MessageMatchLink } from '../types/buildTypes';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Compass
} from 'lucide-react';

interface Stage2JourneyAndMessageMatchProps {
  journey: CustomerJourneyData | null;
  onGenerateJourney: () => Promise<void>;
  onGenerateJourneyDetails?: (stepOrder: number) => Promise<void>;
  onUpdateMessageChain: (updatedChain: MessageMatchLink[], overallStatus: 'ALIGNED' | 'MESSAGE MISMATCH', reason?: string) => void;
  onProceedToFunnel: () => void;
  isGenerating: boolean;
}

export const Stage2JourneyAndMessageMatch: React.FC<Stage2JourneyAndMessageMatchProps> = ({
  journey,
  onGenerateJourney,
  onGenerateJourneyDetails,
  onUpdateMessageChain,
  onProceedToFunnel,
  isGenerating
}) => {
  if (!journey) {
    return (
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-8 text-center space-y-4">
        <Compass className="w-10 h-10 text-[#F5BF1E] mx-auto" />
        <h2 className="text-xl font-bold text-[#FCFCFA]">
          مهندس رحلة العميل (Customer Journey Architect)
        </h2>
        <p className="text-sm text-[#A39E93] max-w-xl mx-auto">
          قبل اختيار شكل الفانل، يجب رسم رحلة القرار الذهنية للزائر من لحظة اكتشاف المحتوى وحتى قرار الشراء.
        </p>
        <button
          type="button"
          disabled={isGenerating}
          onClick={onGenerateJourney}
          className="px-6 py-3 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-sm rounded-lg inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'بنرسم رحلة العميل...' : 'توليد رحلة العميل وفحص تطابق الرسالة'}</span>
        </button>
      </div>
    );
  }

  const handlePromiseEdit = (idx: number, newPromise: string) => {
    const nextChain = journey.messageMatchChain.map((item, i) => {
      if (i !== idx) return item;
      const isGenericDrift =
        /تعلم كل شيء|اربح الملايين|دليل شامل لكل شيء|learn everything/i.test(newPromise);
      return {
        ...item,
        promiseText: newPromise,
        status: isGenericDrift ? ('MESSAGE MISMATCH' as const) : ('ALIGNED' as const),
        diagnosticNote: isGenericDrift
          ? 'انحراف في الوعد: الرسالة أصبحت عامة جدًا ولا تطابق المشكلة المحددة في الترافيك.'
          : 'الرسالة متسقة مع وعد المرحلة السابقة.'
      };
    });

    const hasMismatch = nextChain.some((m) => m.status === 'MESSAGE MISMATCH');
    onUpdateMessageChain(
      nextChain,
      hasMismatch ? 'MESSAGE MISMATCH' : 'ALIGNED',
      hasMismatch
        ? 'تم رصد اختلاف بين وعد الترافيك المحدد وبين رسالة إحدى مراحل الفانل.'
        : undefined
    );
  };

  const handleSimulateMismatch = () => {
    if (journey.messageMatchChain.length < 2) return;
    const simulated = journey.messageMatchChain.map((item, idx) => {
      if (idx === 1) {
        return {
          ...item,
          promiseText: 'تعلم كل شيء عن الذكاء الاصطناعي من الصفر (Learn everything about AI)',
          status: 'MESSAGE MISMATCH' as const,
          diagnosticNote:
            'الترافيك يعد بتوفير 10 ساعات عمل أسبوعيًا للمصمم، بينما صفحة الهبوط تتحدث بشكل عام عن تعلم الذكاء الاصطناعي!'
        };
      }
      return item;
    });
    onUpdateMessageChain(
      simulated,
      'MESSAGE MISMATCH',
      'الترافيك يعد بحل مشكلة محددة (توفير ساعات العمل الإداري)، بينما صفحة الهبوط تعد بدليل عام عن الذكاء الاصطناعي.'
    );
  };

  const handleRestoreAlignment = () => {
    const restored = journey.messageMatchChain.map((item, idx) => {
      if (idx === 1) {
        return {
          ...item,
          promiseText:
            'قائمة فحص من 12 نقطة لتحديد المهام الإدارية التي تسرق وقتك كمصمم وكيف تؤتمتها',
          status: 'ALIGNED' as const,
          diagnosticNote: 'امتداد مباشر لوعد الفيديو بدون تغيير الموضوع.'
        };
      }
      return { ...item, status: 'ALIGNED' as const };
    });
    onUpdateMessageChain(restored, 'ALIGNED', undefined);
  };

  const psychologyFields: { labelAr: string; value: string }[] = [
    { labelAr: 'الحالة الحالية (Current State)', value: journey.currentState },
    { labelAr: 'تحليل الوعي بالمشكلة (Problem Awareness)', value: journey.problemAwarenessAnalysis },
    { labelAr: 'المثير الأولي (Trigger)', value: journey.triggerEvent },
    { labelAr: 'سلوك البحث والاكتشاف (Search Behavior)', value: journey.searchDiscoveryBehavior },
    { labelAr: 'نقطة دخول المحتوى (Content Entry Point)', value: journey.contentEntryPoint },
    { labelAr: 'السؤال الذي يدور في ذهنه (Question in Mind)', value: journey.questionInMind },
    { labelAr: 'الاعتراض الرئيسي (Primary Objection)', value: journey.primaryObjection },
    { labelAr: 'فجوة الثقة (Trust Gap)', value: journey.trustGap },
    { labelAr: 'النتيجة المرغوبة (Desired Outcome)', value: journey.desiredOutcome },
    { labelAr: 'مستوى الالتزام المبدئي (Commitment Level)', value: journey.commitmentLevel },
    { labelAr: 'الجاهزية للعرض (Offer Readiness)', value: journey.offerReadiness },
    { labelAr: 'احتكاك الشراء (Purchase Friction)', value: journey.purchaseFriction },
    { labelAr: 'محفز القرار (Decision Trigger)', value: journey.decisionTrigger },
    { labelAr: 'الخطوة المنطقية التالية (Desired Next Step)', value: journey.desiredNextStep }
  ];

  return (
    <div className="space-y-8">
      {/* Header & Regenerate */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#F5BF1E] font-semibold">
            المرحلة 1 — Customer Journey Architect
          </span>
          <h1 className="text-2xl font-bold text-[#FCFCFA] mt-0.5">
            هندسة رحلة العميل وتطابق الرسالة (Message Match)
          </h1>
          <p className="text-xs text-[#A39E93] mt-1">
            تحليل الحالة الذهنية للزائر من لحظة خروجه من مصدر الترافيك حتى انتقاله للعرض.
          </p>
        </div>

        <button
          type="button"
          disabled={isGenerating}
          onClick={onGenerateJourney}
          className="px-4 py-2 bg-[#141216] hover:bg-[#23170D] border border-[#F5BF1E]/30 rounded-lg text-xs font-semibold text-[#FBD052] flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'بنرسم رحلة العميل...' : 'إعادة تحليل رحلة العميل بـGemini'}</span>
        </button>
      </div>

      {/* 14-Point Customer Decision Diagnostics */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#FCFCFA]">
          التشخيص النفسي والقراري للزائر (14 بُعدًا استراتيجيًا)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {psychologyFields.map((field, idx) => (
            <div
              key={idx}
              className="bg-[#141216] border border-white/8 rounded-lg p-4 space-y-1"
            >
              <div className="text-xs font-semibold text-[#F5BF1E]">
                {idx + 1}. {field.labelAr}
              </div>
              <p className="text-sm text-[#FCFCFA] leading-relaxed">{field.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Guided Decision Journey Flow */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-[#FCFCFA]">
            خريطة التدفق الذهني لرحلة القرار (Guided Decision Flow)
          </h2>
          <p className="text-xs text-[#A39E93]">
            <bdi dir="ltr">
              Traffic Source → First Interaction → Problem Recognition → Solution Education → Lead Capture → Trust Building → Offer Transition → Purchase Decision
            </bdi>
          </p>
        </div>

        <div className="space-y-3">
          {journey.journeySteps.map((step) => (
            <div
              key={step.stepOrder}
              className="bg-[#141216] border border-white/10 rounded-xl p-4 space-y-3"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                <div>
                  <div className="text-xs font-mono text-[#F5BF1E]">
                    الخطوة <bdi dir="ltr">0{step.stepOrder}</bdi> · <bdi dir="ltr">{step.stageNameEn}</bdi>
                  </div>
                  <div className="text-sm font-bold text-[#FCFCFA] mt-0.5">
                    {step.stageNameAr}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#A39E93]">ماذا يدور في ذهن الزائر؟</div>
                  <div className="text-xs text-[#FCFCFA] mt-0.5">{step.visitorMindset}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#A39E93]">تركيز الرسالة (Message Focus)</div>
                  <div className="text-xs text-[#FBD052] mt-0.5">{step.messageFocus}</div>
                </div>
                <div className="flex items-center justify-between lg:justify-end gap-2">
                  <div>
                    <div className="text-[11px] text-[#A39E93]">الخطوة التالية المطلوبة</div>
                    <div className="text-xs text-emerald-300 font-medium mt-0.5">
                      {step.recommendedAction}
                    </div>
                  </div>
                  {onGenerateJourneyDetails && (
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={() => onGenerateJourneyDetails(step.stepOrder)}
                      className="px-2.5 py-1 bg-[#040405] hover:bg-[#23170D] border border-[#F5BF1E]/30 rounded text-[11px] text-[#FBD052] whitespace-nowrap self-end"
                      title="توسيع التشخيص العميق لهذه الخطوة"
                    >
                      {step.details ? 'تحديث التفاصيل' : 'تفاصيل أعمق'}
                    </button>
                  )}
                </div>
              </div>

              {step.details && (
                <div className="pt-3 border-t border-white/8 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#0C0B0E]/60 p-3 rounded-lg">
                  <div>
                    <div className="text-[#F5BF1E] font-semibold mb-0.5">تحليل الحالة الذهنية العميق:</div>
                    <p className="text-[#FCFCFA]">{step.details.deepMindsetAnalysisAr}</p>
                  </div>
                  <div>
                    <div className="text-emerald-400 font-semibold mb-0.5">نصيحة الالتزام المصغر:</div>
                    <p className="text-[#FCFCFA]">{step.details.microCommitmentAdviceAr}</p>
                  </div>
                  {step.details.recommendedFrictionReducersAr?.length > 0 && (
                    <div>
                      <div className="text-[#A39E93] font-semibold mb-0.5">مقللات الاحتكاك المقترحة:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-[#D6D3CD]">
                        {step.details.recommendedFrictionReducersAr.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {step.details.trustSignalsNeededAr?.length > 0 && (
                    <div>
                      <div className="text-[#A39E93] font-semibold mb-0.5">إشارات الثقة المطلوبة:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-[#D6D3CD]">
                        {step.details.trustSignalsNeededAr.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Awareness Engine */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#FCFCFA]">
            محرك مستويات الوعي (Awareness Engine)
          </h2>
          <p className="text-xs text-[#A39E93]">
            ما الذي يجب قوله وما الذي يُمنع قوله في كل درجة وعي حتى لا تسبق الزائر برسالة بيعية مبكرة.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/12 text-[#A39E93]">
                <th className="py-3 px-3">مستوى الوعي</th>
                <th className="py-3 px-3">تركيز الرسالة المطلوب</th>
                <th className="py-3 px-3">الـCTA المناسب</th>
                <th className="py-3 px-3">تحذير (ما لا يجب قوله)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {journey.awarenessEngine.map((aw, i) => (
                <tr
                  key={i}
                  className={aw.isCurrentTarget ? 'bg-[#23170D]/70' : 'bg-transparent'}
                >
                  <td className="py-3.5 px-3 font-bold text-[#FCFCFA]">
                    <div>{aw.labelAr}</div>
                    {aw.isCurrentTarget && (
                      <span className="text-[11px] text-[#F5BF1E] font-normal">
                        ★ مستهدف في هذا الفانل
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-[#FCFCFA]">{aw.messageFocus}</td>
                  <td className="py-3.5 px-3 text-[#FBD052] font-medium">{aw.recommendedCta}</td>
                  <td className="py-3.5 px-3 text-[#A39E93]">{aw.warningNotToSay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Message Match Chain Checker */}
      <div className="bg-[#0C0B0E] border border-[#F5BF1E]/30 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            {journey.overallMessageMatchStatus === 'ALIGNED' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
            )}
            <div>
              <h2 className="text-lg font-bold text-[#FCFCFA]">
                فاحص تطابق الرسالة الإلزامي (Message Match Chain)
              </h2>
              <p className="text-xs text-[#A39E93]">
                تأكد أن وعد الترافيك وصفحة الهبوط والـLead Magnet والإيميل والعرض يتحدثون نفس اللغة.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {journey.overallMessageMatchStatus === 'ALIGNED' ? (
              <button
                type="button"
                onClick={handleSimulateMismatch}
                className="px-3 py-1.5 bg-[#141216] hover:bg-[#23170D] border border-white/15 rounded-lg text-xs text-[#A39E93] hover:text-[#FCFCFA]"
              >
                اختبار كاشف التعارض (محاكاة خطأ Message Mismatch)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRestoreAlignment}
                className="px-3 py-1.5 bg-[#F5BF1E] text-[#040405] font-bold rounded-lg text-xs"
              >
                إصلاح تطابق الرسالة تلقائيًا
              </button>
            )}
          </div>
        </div>

        {journey.overallMessageMatchStatus === 'MESSAGE MISMATCH' && (
          <div className="bg-red-950/40 border border-red-500/50 rounded-xl p-4 space-y-1 text-xs">
            <div className="font-bold text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>الحالة: <bdi dir="ltr">MESSAGE MISMATCH</bdi> — انقطاع في سلسلة الوعد!</span>
            </div>
            <p className="text-[#FCFCFA]">
              {journey.messageMismatchReason ||
                'الزائر القادم من الترافيك يجد وعدًا مختلفًا أو عامًا جدًا في صفحة الهبوط مما يرفع معدل الارتداد.'}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {journey.messageMatchChain.map((link, idx) => (
            <div key={idx} className="space-y-2">
              <div
                className={`p-4 rounded-xl border ${
                  link.status === 'MESSAGE MISMATCH'
                    ? 'bg-red-950/30 border-red-500/50'
                    : 'bg-[#141216] border-white/10'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-[#FBD052]">
                    {idx + 1}. {link.stepAr} (<bdi dir="ltr">{link.step}</bdi>)
                  </span>
                  <span
                    className={`text-xs font-mono ${
                      link.status === 'ALIGNED' ? 'text-emerald-400' : 'text-red-400 font-bold'
                    }`}
                  >
                    <bdi dir="ltr">{link.status}</bdi>
                  </span>
                </div>
                <input
                  type="text"
                  value={link.promiseText}
                  onChange={(e) => handlePromiseEdit(idx, e.target.value)}
                  className="w-full bg-[#040405] border border-white/12 rounded-lg px-3 py-2 text-sm text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E]"
                />
                <div className="text-[11px] text-[#A39E93] mt-1.5">
                  التشخيص: {link.diagnosticNote}
                </div>
              </div>
              {idx < journey.messageMatchChain.length - 1 && (
                <div className="text-center text-[#F5BF1E] font-mono text-xs">↓</div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onProceedToFunnel}
            className="px-6 py-3 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-sm rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>الانتقال للمرحلة 3: تقييم واختيار الفانل</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
