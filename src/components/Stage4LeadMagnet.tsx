import React from 'react';
import { CopyStatus, LeadMagnetData } from '../types/buildTypes';
import {
  Magnet,
  Sparkles,
  Lock,
  Unlock,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  Link2
} from 'lucide-react';

interface Stage4LeadMagnetProps {
  leadMagnet: LeadMagnetData | null;
  onGenerateLeadMagnet: () => Promise<void>;
  onGenerateLeadMagnetDetails?: () => Promise<void>;
  onSelectConcept: (conceptId: string) => void;
  onUpdatePromise: (newPromiseText: string, status: CopyStatus) => void;
  isLeadMagnetLocked: boolean;
  onToggleLeadMagnetLock: () => void;
  isPromiseLocked: boolean;
  onTogglePromiseLock: () => void;
  onProceedToPages: () => void;
  isGenerating: boolean;
}

export const Stage4LeadMagnet: React.FC<Stage4LeadMagnetProps> = ({
  leadMagnet,
  onGenerateLeadMagnet,
  onGenerateLeadMagnetDetails,
  onSelectConcept,
  onUpdatePromise,
  isLeadMagnetLocked,
  onToggleLeadMagnetLock,
  isPromiseLocked,
  onTogglePromiseLock,
  onProceedToPages,
  isGenerating
}) => {
  if (!leadMagnet) {
    return (
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-8 text-center space-y-4">
        <Magnet className="w-10 h-10 text-[#F5BF1E] mx-auto" />
        <h2 className="text-xl font-bold text-[#FCFCFA]">
          محرك الـLead Magnet الاستراتيجي (Lead Magnet Engine)
        </h2>
        <p className="text-sm text-[#A39E93] max-w-xl mx-auto">
          توليد وتقييم مفاهيم الـLead Magnet التي تحل جزءًا محددًا من المشكلة وتبني الجسر المنطقي نحو العرض.
        </p>
        <button
          type="button"
          disabled={isGenerating}
          onClick={onGenerateLeadMagnet}
          className="px-6 py-3 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-sm rounded-lg inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'بنولد أفكار Lead Magnet...' : 'توليد وتقييم أفكار الـLead Magnet'}</span>
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
            المرحلة 3 — Lead Magnet Strategy & Architecture
          </span>
          <h1 className="text-2xl font-bold text-[#FCFCFA] mt-0.5">
            محرك الـLead Magnet وهندسة المحتوى والجسر للعرض
          </h1>
          <p className="text-xs text-[#A39E93] mt-1">
            الـLead Magnet يجب أن يحل خطوة أولى حقيقية ويكشف الفجوة التي يحلها العرض المختار.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLeadMagnetLock}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${
              isLeadMagnetLocked
                ? 'bg-[#23170D] border-[#F5BF1E] text-[#FBD052]'
                : 'bg-[#141216] border-white/15 text-[#A39E93] hover:text-white'
            }`}
          >
            {isLeadMagnetLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{isLeadMagnetLocked ? 'الـLead Magnet مقفل' : 'قفل الـLead Magnet'}</span>
          </button>

          <button
            type="button"
            disabled={isGenerating || isLeadMagnetLocked}
            onClick={onGenerateLeadMagnet}
            className="px-4 py-2 bg-[#141216] hover:bg-[#23170D] disabled:opacity-40 border border-[#F5BF1E]/30 rounded-lg text-xs font-semibold text-[#FBD052] flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'بنولد أفكار Lead Magnet...' : 'توليد أفكار جديدة'}</span>
          </button>
        </div>
      </div>

      {/* Concepts Evaluation Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#FCFCFA]">
          تقييم مفاهيم الـLead Magnet المقترحة (10 معايير تقييم من 0 إلى 10)
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {leadMagnet.concepts.map((concept) => {
            const isSelected = concept.id === leadMagnet.selectedConceptId;
            const totalScore = Object.values(concept.scores).reduce((a, b) => a + b, 0);
            return (
              <div
                key={concept.id}
                className={`p-5 rounded-xl border flex flex-col justify-between gap-4 transition-all ${
                  isSelected
                    ? 'bg-[#23170D]/85 border-[#F5BF1E]'
                    : 'bg-[#0C0B0E] border-white/10'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[#F5BF1E] font-bold">
                      {concept.formatAr} (<bdi dir="ltr">{concept.formatEn}</bdi>)
                    </span>
                    {concept.highlightTag && (
                      <span className="font-mono text-emerald-400">
                        <bdi dir="ltr">★ {concept.highlightTag}</bdi>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#FCFCFA]">{concept.titleAr}</h3>
                  <p className="text-xs text-[#D6D3CD] leading-relaxed">{concept.coreIdeaAr}</p>
                  <div className="bg-[#040405] p-3 rounded-lg border border-white/8 text-xs">
                    <span className="text-[#FBD052] font-semibold">الوعد المحدد: </span>
                    <span className="text-[#FCFCFA]">{concept.promiseAr}</span>
                  </div>

                  {/* 10 Dimension Scores */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[11px] tabular-nums">
                    <div className="bg-[#040405] p-2 rounded border border-white/6">
                      <div className="text-[#A39E93]">الارتباط بالمشكلة</div>
                      <div className="font-mono font-bold text-[#F5BF1E]">
                        <bdi dir="ltr">{concept.scores.problemRelevance}/10</bdi>
                      </div>
                    </div>
                    <div className="bg-[#040405] p-2 rounded border border-white/6">
                      <div className="text-[#A39E93]">سرعة القيمة</div>
                      <div className="font-mono font-bold text-[#F5BF1E]">
                        <bdi dir="ltr">{concept.scores.speedToValue}/10</bdi>
                      </div>
                    </div>
                    <div className="bg-[#040405] p-2 rounded border border-white/6">
                      <div className="text-[#A39E93]">التحديد</div>
                      <div className="font-mono font-bold text-[#F5BF1E]">
                        <bdi dir="ltr">{concept.scores.specificity}/10</bdi>
                      </div>
                    </div>
                    <div className="bg-[#040405] p-2 rounded border border-white/6">
                      <div className="text-[#A39E93]">الجسر للعرض</div>
                      <div className="font-mono font-bold text-[#F5BF1E]">
                        <bdi dir="ltr">{concept.scores.leadToOfferBridge}/10</bdi>
                      </div>
                    </div>
                    <div className="bg-[#040405] p-2 rounded border border-white/6">
                      <div className="text-[#A39E93]">سهولة الاستهلاك</div>
                      <div className="font-mono font-bold text-[#F5BF1E]">
                        <bdi dir="ltr">{concept.scores.easeOfConsumption}/10</bdi>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#A39E93]">
                    <strong className="text-[#FCFCFA]">سبب التميز:</strong> {concept.whyDifferentAr}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#A39E93]">
                    المجموع: <strong className="text-[#FBD052]"><bdi dir="ltr">{totalScore}/100</bdi></strong>
                  </span>
                  <button
                    type="button"
                    disabled={isLeadMagnetLocked || isSelected}
                    onClick={() => onSelectConcept(concept.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-[#F5BF1E] text-[#040405]'
                        : 'bg-[#141216] hover:bg-[#23170D] text-[#FCFCFA] border border-white/15'
                    }`}
                  >
                    {isSelected ? 'المفهوم المعتمد ✓' : 'اختيار هذا الـLead Magnet'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lead Magnet Promise Builder */}
      <div className="bg-[#0C0B0E] border border-[#F5BF1E]/30 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#FCFCFA]">
              صياغة الوعد الأساسي للـLead Magnet (Promise Statement)
            </h2>
            <p className="text-xs text-[#A39E93]">
              مشكلة محددة + نتيجة مفيدة + وقت وجهد منطقي بدون ادعاءات مبالغ فيها.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={leadMagnet.promiseStatement.status}
              onChange={(e) =>
                onUpdatePromise(
                  leadMagnet.promiseStatement.fullPromiseAr,
                  e.target.value as CopyStatus
                )
              }
              className="bg-[#141216] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-[#FBD052] font-mono"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="REVIEW">REVIEW</option>
              <option value="APPROVED">APPROVED</option>
              <option value="NEEDS EVIDENCE">NEEDS EVIDENCE</option>
            </select>

            <button
              type="button"
              onClick={onTogglePromiseLock}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 ${
                isPromiseLocked
                  ? 'bg-[#23170D] border-[#F5BF1E] text-[#FBD052]'
                  : 'bg-[#141216] border-white/15 text-[#A39E93]'
              }`}
            >
              {isPromiseLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{isPromiseLocked ? 'الوعد مقفل' : 'قفل الوعد'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#141216] p-3.5 rounded-lg border border-white/8">
            <div className="text-[#F5BF1E] font-bold mb-1">1. المشكلة المحددة</div>
            <div className="text-[#FCFCFA]">{leadMagnet.promiseStatement.specificProblem}</div>
          </div>
          <div className="bg-[#141216] p-3.5 rounded-lg border border-white/8">
            <div className="text-[#F5BF1E] font-bold mb-1">2. النتيجة المفيدة</div>
            <div className="text-[#FCFCFA]">{leadMagnet.promiseStatement.usefulOutcome}</div>
          </div>
          <div className="bg-[#141216] p-3.5 rounded-lg border border-white/8">
            <div className="text-[#F5BF1E] font-bold mb-1">3. الإطار الزمني والجهد المنطقي</div>
            <div className="text-[#FCFCFA]">{leadMagnet.promiseStatement.reasonableTimeEffort}</div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#A39E93] mb-1.5">
            الصياغة النهائية المعتمدة للوعد:
          </label>
          <textarea
            rows={2}
            disabled={isPromiseLocked}
            value={leadMagnet.promiseStatement.fullPromiseAr}
            onChange={(e) =>
              onUpdatePromise(e.target.value, leadMagnet.promiseStatement.status)
            }
            className="w-full bg-[#141216] border border-white/15 rounded-lg p-3 text-sm text-[#FCFCFA] disabled:opacity-60 focus:outline-none focus:border-[#F5BF1E]"
          />
        </div>
      </div>

      {/* Lead Magnet Content Architecture */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#FCFCFA]">
              الهيكل التفصيلي الجاهز للتنفيذ (Content Architecture)
            </h2>
            <p className="text-xs text-[#A39E93]">
              نوع الهيكل: <bdi dir="ltr" className="text-[#F5BF1E] font-mono">{leadMagnet.contentArchitecture.formatType}</bdi>
            </p>
          </div>
          {onGenerateLeadMagnetDetails && (
            <button
              type="button"
              disabled={isGenerating}
              onClick={onGenerateLeadMagnetDetails}
              className="px-3 py-1.5 bg-[#141216] hover:bg-[#23170D] border border-[#F5BF1E]/30 rounded-lg text-xs font-semibold text-[#FBD052] flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>توليد وتوسيع الهيكل والجسر للعرض</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          {leadMagnet.contentArchitecture.sections.map((sec, idx) => (
            <div
              key={idx}
              className="bg-[#141216] border border-white/10 rounded-xl p-4 space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-[#FBD052]">{sec.sectionNameAr}</h3>
                <span className="text-xs font-mono text-[#A39E93]">
                  <bdi dir="ltr">{sec.sectionRoleEn}</bdi>
                </span>
              </div>
              <p className="text-xs text-[#D6D3CD]">{sec.detailsAr}</p>
              <ul className="space-y-1.5 text-xs text-[#FCFCFA] pt-1">
                {sec.actionableItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#F5BF1E] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-[#23170D] border border-[#F5BF1E]/30 rounded-lg p-4 text-xs">
          <strong className="text-[#F5BF1E]">الـCTA المدمج داخل نهاية الـLead Magnet: </strong>
          <span className="text-[#FCFCFA]">{leadMagnet.contentArchitecture.ctaInsideAsset}</span>
        </div>
      </div>

      {/* Lead Magnet -> Offer Bridge */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-[#F5BF1E]" />
          <h2 className="text-lg font-bold text-[#FCFCFA]">
            الجسر المنطقي من الـLead Magnet إلى العرض (Lead Magnet → Offer Bridge)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="bg-[#141216] p-3.5 rounded-xl border border-white/8 space-y-1">
            <div className="text-[#F5BF1E] font-bold">1. مشكلة الـLead Magnet</div>
            <p className="text-[#FCFCFA]">{leadMagnet.offerBridge.leadMagnetProblem}</p>
          </div>
          <div className="bg-[#141216] p-3.5 rounded-xl border border-white/8 space-y-1">
            <div className="text-[#F5BF1E] font-bold">2. الإدراك المكتسب (Insight)</div>
            <p className="text-[#FCFCFA]">{leadMagnet.offerBridge.insightDelivered}</p>
          </div>
          <div className="bg-[#141216] p-3.5 rounded-xl border border-white/8 space-y-1">
            <div className="text-[#F5BF1E] font-bold">3. الفجوة المتبقية (Remaining Gap)</div>
            <p className="text-[#FCFCFA]">{leadMagnet.offerBridge.remainingGap}</p>
          </div>
          <div className="bg-[#141216] p-3.5 rounded-xl border border-white/8 space-y-1">
            <div className="text-[#F5BF1E] font-bold">4. فئة الحل (Solution Category)</div>
            <p className="text-[#FCFCFA]">{leadMagnet.offerBridge.solutionCategory}</p>
          </div>
          <div className="bg-[#23170D] p-3.5 rounded-xl border border-[#F5BF1E]/40 space-y-1">
            <div className="text-[#FBD052] font-bold">5. ارتباط العرض (Offer Fit)</div>
            <p className="text-[#FCFCFA]">{leadMagnet.offerBridge.offerConnection}</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onProceedToPages}
            className="px-6 py-3 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-sm rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>الانتقال للمرحلة 5: هندسة الصفحات والنصوص</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
