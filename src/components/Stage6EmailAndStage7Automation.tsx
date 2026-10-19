import React, { useState } from 'react';
import {
  AutomationData,
  CopyStatus,
  EmailPlatform,
  EmailSystemData,
  GeneratedEmailCopy
} from '../types/buildTypes';
import { validateAutomationArchitecture } from '../utils/deterministicEngine';
import {
  Mail,
  Workflow,
  Sparkles,
  Lock,
  Unlock,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Tag
} from 'lucide-react';

interface Stage6EmailProps {
  emailSystem: EmailSystemData | null;
  onGenerateEmailSystem: () => Promise<void>;
  onRewriteSingleEmail: (emailNumber: number) => Promise<void>;
  onUpdateEmailCopy: (emailNumber: number, patch: Partial<GeneratedEmailCopy>) => void;
  isEmailSequenceLocked: boolean;
  onToggleEmailLock: () => void;
  onProceedToAutomation: () => void;
  isGenerating: boolean;
}

export const Stage6EmailSystem: React.FC<Stage6EmailProps> = ({
  emailSystem,
  onGenerateEmailSystem,
  onRewriteSingleEmail,
  onUpdateEmailCopy,
  isEmailSequenceLocked,
  onToggleEmailLock,
  onProceedToAutomation,
  isGenerating
}) => {
  const [selectedEmailNum, setSelectedEmailNum] = useState<number>(1);

  if (!emailSystem) {
    return (
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-8 text-center space-y-4">
        <Mail className="w-10 h-10 text-[#F5BF1E] mx-auto" />
        <h2 className="text-xl font-bold text-[#FCFCFA]">
          مهندس منظومة الإيميلات (Email Strategy & Sequence Engine)
        </h2>
        <p className="text-sm text-[#A39E93] max-w-xl mx-auto">
          بناء استراتيجية المتابعة البريدية، تحديد الطول الأنسب للسلسلة، وكتابة الإيميلات بالعربية الطبيعية بدون حشو.
        </p>
        <button
          type="button"
          disabled={isGenerating}
          onClick={onGenerateEmailSystem}
          className="px-6 py-3 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-sm rounded-lg inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'بنرتب سلسلة الإيميلات...' : 'توليد استراتيجية وسلسلة الإيميلات'}</span>
        </button>
      </div>
    );
  }

  const activeEmail =
    emailSystem.emailsCopy.find((e) => e.emailNumber === selectedEmailNum) ||
    emailSystem.emailsCopy[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#F5BF1E] font-semibold">
            المرحلة 5 — Email Strategy, Blueprint & Copy
          </span>
          <h1 className="text-2xl font-bold text-[#FCFCFA] mt-0.5">
            استراتيجية ومخطط ونصوص سلسلة الإيميلات
          </h1>
          <p className="text-xs text-[#A39E93] mt-1">
            كل إيميل له وظيفة ذهنية واحدة تنقل المشترك من تشخيص المشكلة إلى القناعة بالعرض.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleEmailLock}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${
              isEmailSequenceLocked
                ? 'bg-[#23170D] border-[#F5BF1E] text-[#FBD052]'
                : 'bg-[#141216] border-white/15 text-[#A39E93]'
            }`}
          >
            {isEmailSequenceLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{isEmailSequenceLocked ? 'السلسلة مقفلة' : 'قفل سلسلة الإيميلات'}</span>
          </button>

          <button
            type="button"
            disabled={isGenerating || isEmailSequenceLocked}
            onClick={onGenerateEmailSystem}
            className="px-4 py-2 bg-[#141216] hover:bg-[#23170D] disabled:opacity-40 border border-[#F5BF1E]/30 rounded-lg text-xs font-semibold text-[#FBD052] flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>إعادة بناء السلسلة</span>
          </button>
        </div>
      </div>

      {/* Email Strategy & Length Rationale */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-[#FCFCFA]">
            استراتيجية السلسلة وسبب اختيار الطول (<bdi dir="ltr">{emailSystem.strategy.recommendedEmailCount} Emails</bdi>)
          </h2>
          <span className="text-xs text-[#F5BF1E] font-mono">
            الحقول الشخصية المستخدمة: {emailSystem.personalizationFieldsUsed.join(' · ')}
          </span>
        </div>

        <div className="bg-[#23170D]/80 border border-[#F5BF1E]/35 rounded-xl p-4 text-xs text-[#FCFCFA] leading-relaxed">
          <strong className="text-[#F5BF1E]">لماذا {emailSystem.strategy.recommendedEmailCount} إيميلات تحديدًا؟ </strong>
          {emailSystem.strategy.lengthRationaleAr}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#141216] p-3.5 rounded-lg border border-white/8 space-y-1">
            <div className="text-[#F5BF1E] font-bold">لماذا انضم المشترك؟</div>
            <p className="text-[#FCFCFA]">{emailSystem.strategy.whyUserJoined}</p>
          </div>
          <div className="bg-[#141216] p-3.5 rounded-lg border border-white/8 space-y-1">
            <div className="text-[#F5BF1E] font-bold">ما الذي يحتاج أن يقتنع به؟</div>
            <p className="text-[#FCFCFA]">{emailSystem.strategy.whatTheyNeedToBelieve}</p>
          </div>
          <div className="bg-[#141216] p-3.5 rounded-lg border border-white/8 space-y-1">
            <div className="text-[#F5BF1E] font-bold">السلوك المطلوب (Desired Behavior)</div>
            <p className="text-[#FCFCFA]">{emailSystem.strategy.desiredBehavior}</p>
          </div>
        </div>
      </div>

      {/* Email Blueprint Table */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#FCFCFA]">
          مخطط سلسلة الإيميلات (Email Blueprint)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/12 text-[#A39E93]">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">النوع والوظيفة</th>
                <th className="py-3 px-3">زاوية العنوان</th>
                <th className="py-3 px-3">الرسالة المحورية</th>
                <th className="py-3 px-3">الاعتراض المعالج</th>
                <th className="py-3 px-3">الـCTA والتوقيت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {emailSystem.blueprint.map((bp) => (
                <tr
                  key={bp.emailNumber}
                  onClick={() => setSelectedEmailNum(bp.emailNumber)}
                  className={`cursor-pointer transition-colors ${
                    selectedEmailNum === bp.emailNumber
                      ? 'bg-[#23170D]/80'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <td className="py-3.5 px-3 font-mono font-bold text-[#F5BF1E]">
                    <bdi dir="ltr">0{bp.emailNumber}</bdi>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-[#FCFCFA]">{bp.purposeAr}</div>
                    <div className="text-[11px] font-mono text-[#A39E93]">
                      <bdi dir="ltr">{bp.sequenceTypeEn}</bdi>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-[#FBD052]">{bp.subjectAngleAr}</td>
                  <td className="py-3.5 px-3 text-[#FCFCFA]">{bp.coreMessageAr}</td>
                  <td className="py-3.5 px-3 text-[#A39E93]">{bp.objectionHandledAr}</td>
                  <td className="py-3.5 px-3">
                    <div className="text-emerald-400 font-semibold">{bp.ctaAr}</div>
                    <div className="text-[11px] text-[#A39E93]">{bp.behaviorTriggerAr}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Email Copy Editor & Subject Line Engine */}
      {activeEmail && (
        <div className="bg-[#0C0B0E] border border-[#F5BF1E]/30 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              {emailSystem.emailsCopy.map((em) => (
                <button
                  key={em.emailNumber}
                  type="button"
                  onClick={() => setSelectedEmailNum(em.emailNumber)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedEmailNum === em.emailNumber
                      ? 'bg-[#F5BF1E] text-[#040405]'
                      : 'bg-[#141216] text-[#A39E93] hover:text-white border border-white/10'
                  }`}
                >
                  الإيميل <bdi dir="ltr">0{em.emailNumber}</bdi>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={activeEmail.status}
                onChange={(e) =>
                  onUpdateEmailCopy(activeEmail.emailNumber, {
                    status: e.target.value as CopyStatus
                  })
                }
                className="bg-[#141216] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-[#FBD052] font-mono"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="REVIEW">REVIEW</option>
                <option value="APPROVED">APPROVED</option>
              </select>

              <button
                type="button"
                disabled={isGenerating || isEmailSequenceLocked}
                onClick={() => onRewriteSingleEmail(activeEmail.emailNumber)}
                className="px-3.5 py-1.5 bg-[#141216] hover:bg-[#23170D] disabled:opacity-40 border border-[#F5BF1E]/30 rounded-lg text-xs font-semibold text-[#FBD052] flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>إعادة كتابة الإيميل {activeEmail.emailNumber} فقط</span>
              </button>
            </div>
          </div>

          {/* Subject Line Engine */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#F5BF1E]">
              محرك عناوين الإيميل (Subject Line Options — خالية من الخداع):
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {(activeEmail.subjectOptions || []).map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isEmailSequenceLocked}
                  onClick={() =>
                    onUpdateEmailCopy(activeEmail.emailNumber, {
                      subjectLineAr: opt.subjectAr
                    })
                  }
                  className={`text-right p-3 rounded-lg border text-xs transition-colors ${
                    activeEmail.subjectLineAr === opt.subjectAr
                      ? 'bg-[#23170D] border-[#F5BF1E] text-[#FCFCFA]'
                      : 'bg-[#141216] border-white/8 text-[#D6D3CD] hover:border-white/25'
                  }`}
                >
                  <div className="text-[11px] text-[#F5BF1E] font-semibold mb-1">
                    {opt.mechanismAr} (<bdi dir="ltr">{opt.mechanismEn}</bdi>)
                  </div>
                  <div className="font-bold">{opt.subjectAr}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#A39E93] mb-1">
                عنوان الإيميل المعتمد (Subject Line)
              </label>
              <input
                type="text"
                disabled={isEmailSequenceLocked}
                value={activeEmail.subjectLineAr}
                onChange={(e) =>
                  onUpdateEmailCopy(activeEmail.emailNumber, {
                    subjectLineAr: e.target.value
                  })
                }
                className="w-full bg-[#141216] border border-white/15 rounded-lg p-2.5 text-sm font-bold text-[#FCFCFA]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A39E93] mb-1">
                النص التمهيدي (Preview Text)
              </label>
              <input
                type="text"
                disabled={isEmailSequenceLocked}
                value={activeEmail.previewTextAr}
                onChange={(e) =>
                  onUpdateEmailCopy(activeEmail.emailNumber, {
                    previewTextAr: e.target.value
                  })
                }
                className="w-full bg-[#141216] border border-white/15 rounded-lg p-2.5 text-xs text-[#FCFCFA]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#A39E93] mb-1">
              نص الرسالة الكامل (Email Body — عربي طبيعي ومقروء)
            </label>
            <textarea
              rows={7}
              disabled={isEmailSequenceLocked}
              value={activeEmail.bodyAr}
              onChange={(e) =>
                onUpdateEmailCopy(activeEmail.emailNumber, { bodyAr: e.target.value })
              }
              className="w-full bg-[#141216] border border-white/15 rounded-lg p-3.5 text-sm text-[#FCFCFA] leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#F5BF1E] font-bold mb-1">
                الـCTA داخل الإيميل
              </label>
              <input
                type="text"
                disabled={isEmailSequenceLocked}
                value={activeEmail.ctaTextAr}
                onChange={(e) =>
                  onUpdateEmailCopy(activeEmail.emailNumber, {
                    ctaTextAr: e.target.value
                  })
                }
                className="w-full bg-[#141216] border border-white/15 rounded-lg p-2.5 text-xs font-bold text-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A39E93] mb-1">
                حاشية الرسالة (P.S. اختياري)
              </label>
              <input
                type="text"
                disabled={isEmailSequenceLocked}
                value={activeEmail.psTextAr}
                onChange={(e) =>
                  onUpdateEmailCopy(activeEmail.emailNumber, { psTextAr: e.target.value })
                }
                className="w-full bg-[#141216] border border-white/15 rounded-lg p-2.5 text-xs text-[#FCFCFA]"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onProceedToAutomation}
          className="px-6 py-3 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-sm rounded-lg flex items-center gap-2"
        >
          <span>الانتقال للمرحلة 7: معمارية الأتمتة والتاجات</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface Stage7AutomationProps {
  automation: AutomationData | null;
  onGenerateAutomation: (platform?: EmailPlatform) => Promise<void>;
  onSelectPlatform: (platform: EmailPlatform) => void;
  onProceedToTracking: () => void;
  isGenerating: boolean;
}

const PLATFORMS: EmailPlatform[] = [
  'Platform-Agnostic',
  'Systeme.io',
  'ConvertKit',
  'ActiveCampaign',
  'GoHighLevel',
  'MailerLite',
  'Beehiiv',
  'Custom'
];

export const Stage7AutomationArchitect: React.FC<Stage7AutomationProps> = ({
  automation,
  onGenerateAutomation,
  onSelectPlatform,
  onProceedToTracking,
  isGenerating
}) => {
  if (!automation) {
    return (
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-8 text-center space-y-4">
        <Workflow className="w-10 h-10 text-[#F5BF1E] mx-auto" />
        <h2 className="text-xl font-bold text-[#FCFCFA]">
          مهندس الأتمتة والتاجات (Automation Architect)
        </h2>
        <p className="text-sm text-[#A39E93] max-w-xl mx-auto">
          تصميم المشغلات، التاجات القياسية، شروط التفرع، وشروط الخروج الآمنة لمنع إرسال رسائل بيع للمشترين.
        </p>
        <button
          type="button"
          disabled={isGenerating}
          onClick={() => onGenerateAutomation('Platform-Agnostic')}
          className="px-6 py-3 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-sm rounded-lg inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'بنراجع منطق الأتمتة...' : 'توليد خريطة الأتمتة والتاجات'}</span>
        </button>
      </div>
    );
  }

  const safetyChecks = validateAutomationArchitecture(automation);

  return (
    <div className="space-y-8">
      {/* Header & Platform Switcher */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#F5BF1E] font-semibold">
              المرحلة 6 — Automation Architect & Tagging System
            </span>
            <h1 className="text-2xl font-bold text-[#FCFCFA] mt-0.5">
              معمارية الأتمتة، نظام التاجات، وفحص الأمان
            </h1>
            <p className="text-xs text-[#A39E93] mt-1">
              الوضع الافتراضي مستقل عن المنصات (<bdi dir="ltr">Platform-Agnostic</bdi>) مع إمكانية الترجمة لأشهر منصات الإيميل.
            </p>
          </div>

          <button
            type="button"
            disabled={isGenerating}
            onClick={() => onGenerateAutomation(automation.selectedPlatform)}
            className="px-4 py-2 bg-[#141216] hover:bg-[#23170D] border border-[#F5BF1E]/30 rounded-lg text-xs font-semibold text-[#FBD052] flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'بنراجع منطق الأتمتة...' : 'تحديث منطق الأتمتة'}</span>
          </button>
        </div>

        {/* Platform Selector */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <span className="text-xs text-[#A39E93] ml-2">ترجمة المفاهيم حسب المنصة:</span>
          {PLATFORMS.map((plat) => (
            <button
              key={plat}
              type="button"
              onClick={() => onSelectPlatform(plat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                automation.selectedPlatform === plat
                  ? 'bg-[#F5BF1E] text-[#040405] font-bold'
                  : 'bg-[#141216] text-[#A39E93] hover:text-white border border-white/10'
              }`}
            >
              <bdi dir="ltr">{plat}</bdi>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Automation Map */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-bold text-[#FCFCFA]">
          خريطة مسار الأتمتة خطوة بخطوة (Automation Workflow Map)
        </h2>

        <div className="space-y-3">
          {automation.workflowNodes.map((node, idx) => (
            <div key={node.id} className="space-y-2">
              <div className="bg-[#141216] border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#F5BF1E]">
                      <bdi dir="ltr">[{node.stepType}]</bdi>
                    </span>
                    <h3 className="text-sm font-bold text-[#FCFCFA]">{node.titleAr}</h3>
                  </div>
                  {node.tagInvolved && (
                    <span className="text-xs font-mono text-emerald-400">
                      <bdi dir="ltr">{node.tagInvolved}</bdi>
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#D6D3CD]">{node.detailAr}</p>

                {(node.yesBranchAr || node.noBranchAr) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                    {node.yesBranchAr && (
                      <div className="bg-[#040405] p-2.5 rounded border border-emerald-500/30">
                        <strong className="text-emerald-400">مسار نعم (YES): </strong>
                        <span className="text-[#FCFCFA]">{node.yesBranchAr}</span>
                      </div>
                    )}
                    {node.noBranchAr && (
                      <div className="bg-[#040405] p-2.5 rounded border border-amber-500/30">
                        <strong className="text-amber-400">مسار لا (NO): </strong>
                        <span className="text-[#FCFCFA]">{node.noBranchAr}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {idx < automation.workflowNodes.length - 1 && (
                <div className="text-center text-[#F5BF1E] font-mono text-xs">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Clean Tagging Architecture */}
      <div className="bg-[#0C0B0E] border border-white/10 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#F5BF1E]" />
          <div>
            <h2 className="text-lg font-bold text-[#FCFCFA]">
              معمارية التاجات النظيفة (Clean Tagging System)
            </h2>
            <p className="text-xs text-[#A39E93]">
              بدون عشرات التاجات العشوائية — كل تاج يتبع الصيغة الموحدة وله سبب تشغيلي واضح.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {automation.tags.map((tg, i) => (
            <div
              key={i}
              className="bg-[#141216] border border-white/10 rounded-xl p-4 space-y-1.5"
            >
              <div className="font-mono font-bold text-[#F5BF1E] text-sm">
                <bdi dir="ltr">{tg.tagName}</bdi>
              </div>
              <p className="text-[#FCFCFA]">{tg.purposeAr}</p>
              <div className="text-[11px] text-[#A39E93]">
                يُطبق عند: {tg.appliedWhenAr}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automation Safety QA */}
      <div className="bg-[#0C0B0E] border border-[#F5BF1E]/30 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#FCFCFA]">
          فحص أمان الأتمتة الحتمي (Automation Safety QA)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {safetyChecks.map((chk, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                chk.passed
                  ? 'bg-[#141216] border-emerald-500/30'
                  : 'bg-red-950/30 border-red-500/40'
              }`}
            >
              {chk.passed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold text-[#FCFCFA]">{chk.ruleNameAr}</div>
                <p className="text-[#A39E93]">{chk.verificationNoteAr}</p>
              </div>
            </div>
          ))}
        </div>

        {automation.platformTranslationNotesAr.length > 0 && (
          <div className="bg-[#141216] border border-white/10 rounded-xl p-4 space-y-2 text-xs">
            <div className="font-bold text-[#FBD052]">
              ملاحظات التنفيذ على المنصات (<bdi dir="ltr">{automation.selectedPlatform}</bdi>):
            </div>
            <ul className="space-y-1.5 text-[#D6D3CD]">
              {automation.platformTranslationNotesAr.map((note, idx) => (
                <li key={idx}>• {note}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onProceedToTracking}
            className="px-6 py-3 bg-[#F5BF1E] hover:bg-[#FBD052] text-[#040405] font-bold text-sm rounded-lg flex items-center gap-2"
          >
            <span>الانتقال للمرحلة 8: خريطة الـCTA وخطة التتبع</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
