import React, { useState } from 'react';
import {
  AffiliateBuildProject,
  LockedElementsMap,
  ProofItem
} from '../types/buildTypes';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Plus,
  Trash2,
  RotateCcw,
  Copy,
  Save,
  X,
  CheckCircle2
} from 'lucide-react';

interface ContextSidebarProps {
  project: AffiliateBuildProject;
  onToggleLock: (key: keyof LockedElementsMap) => void;
  onAddProof: (proof: Omit<ProofItem, 'id'>) => void;
  onRemoveProof: (id: string) => void;
  onTogglePersonalExperience: (val: boolean) => void;
  onRenameProject: (newName: string) => void;
  onDuplicateProject: () => void;
  onResetCurrentModule: () => void;
  onNewProject: () => void;
  onSaveProjectNow: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const LOCK_LABELS: { key: keyof LockedElementsMap; labelAr: string }[] = [
  { key: 'audience', labelAr: 'قفل الجمهور المستهدف (Audience)' },
  { key: 'funnel', labelAr: 'قفل نموذج الفانل المختار (Funnel)' },
  { key: 'leadMagnet', labelAr: 'قفل فكرة الـLead Magnet' },
  { key: 'promise', labelAr: 'قفل الوعد الأساسي (Core Promise)' },
  { key: 'headline', labelAr: 'قفل عنوان صفحة الهبوط (Headline)' },
  { key: 'mainCta', labelAr: 'قفل الـCTA الأساسي' },
  { key: 'emailSequence', labelAr: 'قفل تسلسل الإيميلات المعتمدة' }
];

export const ContextSidebar: React.FC<ContextSidebarProps> = ({
  project,
  onToggleLock,
  onAddProof,
  onRemoveProof,
  onTogglePersonalExperience,
  onRenameProject,
  onDuplicateProject,
  onResetCurrentModule,
  onNewProject,
  onSaveProjectNow,
  mobileOpen,
  onCloseMobile
}) => {
  const [newProofTitle, setNewProofTitle] = useState('');
  const [newProofContent, setNewProofContent] = useState('');
  const [newProofSource, setNewProofSource] = useState('');
  const [newProofType, setNewProofType] = useState<ProofItem['type']>('Testimonial');
  const [showAddProofForm, setShowAddProofForm] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  const selectedFunnelName =
    project.funnelStrategy?.evaluatedModels.find(
      (m) => m.id === project.funnelStrategy?.primaryFunnelId
    )?.nameAr || 'لم يتم تثبيت الفانل بعد';

  const handleCreateProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProofTitle.trim() || !newProofContent.trim()) return;
    onAddProof({
      type: newProofType,
      title: newProofTitle.trim(),
      content: newProofContent.trim(),
      source: newProofSource.trim() || 'مقدم من المستخدم',
      verifiedByUser: true
    });
    setNewProofTitle('');
    setNewProofContent('');
    setNewProofSource('');
    setShowAddProofForm(false);
  };

  const handleSaveClick = () => {
    onSaveProjectNow();
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  const sidebarContent = (
    <div className="space-y-6 text-sm">
      {/* Project Header & Controls */}
      <div className="space-y-3 pb-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#F5BF1E] font-semibold">بوصلة المشروع الثابتة</span>
          {mobileOpen && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 text-[#A39E93] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <input
          type="text"
          value={project.researchInput.projectName}
          onChange={(e) => onRenameProject(e.target.value)}
          aria-label="اسم مشروع البناء"
          className="w-full bg-[#141216] border border-white/12 rounded-lg px-3 py-2 text-xs font-bold text-[#FCFCFA] focus:outline-none focus:border-[#F5BF1E]"
        />

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            type="button"
            onClick={onNewProject}
            className="px-2.5 py-1.5 bg-[#141216] hover:bg-[#23170D] border border-[#F5BF1E]/30 rounded-md text-xs text-[#FBD052] font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            title="بدء مشروع جديد فارغ تماماً"
          >
            <Plus className="w-3.5 h-3.5 text-[#F5BF1E]" />
            <span>مشروع جديد</span>
          </button>
          <button
            type="button"
            onClick={handleSaveClick}
            className="px-2.5 py-1.5 bg-[#141216] hover:bg-[#23170D] border border-white/10 rounded-md text-xs text-[#FCFCFA] flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
          >
            {saveFeedback ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>تم الحفظ</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-[#F5BF1E]" />
                <span>حفظ</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={onDuplicateProject}
            className="px-2.5 py-1.5 bg-[#141216] hover:bg-[#23170D] border border-white/10 rounded-md text-xs text-[#FCFCFA] flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
          >
            <Copy className="w-3.5 h-3.5 text-[#A39E93]" />
            <span>نسخ المشروع</span>
          </button>
          <button
            type="button"
            onClick={onResetCurrentModule}
            className="px-2.5 py-1.5 bg-[#141216] hover:bg-red-950/40 border border-white/10 rounded-md text-xs text-[#A39E93] hover:text-red-300 flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
            title="تفريغ مخرجات المرحلة الحالية بدون لمس باقي المراحل"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تفريغ المرحلة</span>
          </button>
        </div>
      </div>

      {/* Core Traceability Context */}
      <div className="space-y-3.5 pb-5 border-b border-white/10">
        <h3 className="text-xs font-bold text-[#FCFCFA]">مرجع الترابط الإلزامي (Context Anchor)</h3>
        <div className="space-y-2.5 text-xs">
          <div>
            <div className="text-[#A39E93] mb-0.5">الجمهور (Audience):</div>
            <div className="text-[#FCFCFA] leading-relaxed">{project.researchInput.audience}</div>
          </div>
          <div>
            <div className="text-[#A39E93] mb-0.5">المشكلة الأساسية (Problem):</div>
            <div className="text-[#FCFCFA] leading-relaxed">{project.researchInput.primaryProblem}</div>
          </div>
          <div>
            <div className="text-[#A39E93] mb-0.5">النتيجة المرغوبة (Desired Outcome):</div>
            <div className="text-[#FCFCFA] leading-relaxed">{project.researchInput.desiredOutcome}</div>
          </div>
          <div>
            <div className="text-[#A39E93] mb-0.5">العرض (Selected Offer):</div>
            <div className="text-[#FBD052] font-semibold">
              <bdi dir="ltr">{project.researchInput.selectedOffer}</bdi>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-[#141216] p-2 rounded-lg border border-white/8">
              <div className="text-[11px] text-[#A39E93]">الترافيك</div>
              <div className="text-[#FCFCFA] font-medium truncate">
                {project.researchInput.primaryContentChannel || project.researchInput.trafficHypothesis}
              </div>
            </div>
            <div className="bg-[#141216] p-2 rounded-lg border border-white/8">
              <div className="text-[11px] text-[#A39E93]">مستوى الوعي</div>
              <div className="text-[#F5BF1E] font-mono">
                <bdi dir="ltr">{project.researchInput.awarenessStage}</bdi>
              </div>
            </div>
          </div>
          <div className="bg-[#141216] p-2.5 rounded-lg border border-[#F5BF1E]/20">
            <div className="text-[11px] text-[#A39E93]">الفانل المعتمد حاليًا</div>
            <div className="text-[#FCFCFA] font-semibold mt-0.5">{selectedFunnelName}</div>
          </div>
        </div>
      </div>

      {/* Lock Approved Elements */}
      <div className="space-y-3 pb-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#FCFCFA]">قفل العناصر المعتمدة (Lock Assets)</h3>
          <span className="text-[11px] text-[#A39E93]">حماية عند إعادة التوليد</span>
        </div>
        <div className="space-y-1.5">
          {LOCK_LABELS.map((item) => {
            const isLocked = project.lockedElements[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onToggleLock(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs border transition-colors ${
                  isLocked
                    ? 'bg-[#23170D] border-[#F5BF1E]/40 text-[#FBD052]'
                    : 'bg-[#141216] border-white/8 text-[#A39E93] hover:text-[#FCFCFA]'
                }`}
              >
                <span>{item.labelAr}</span>
                {isLocked ? (
                  <Lock className="w-3.5 h-3.5 text-[#F5BF1E] shrink-0" />
                ) : (
                  <Unlock className="w-3.5 h-3.5 opacity-60 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Proof Library (No Fake Testimonials Rule) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#FCFCFA] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#F5BF1E]" />
            <span>مكتبة الإثبات الموثق (Proof Library)</span>
          </h3>
          <button
            type="button"
            onClick={() => setShowAddProofForm(!showAddProofForm)}
            className="text-xs text-[#F5BF1E] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة دليل</span>
          </button>
        </div>

        <label className="flex items-start gap-2 bg-[#141216] p-2.5 rounded-lg border border-white/8 cursor-pointer text-xs">
          <input
            type="checkbox"
            checked={project.researchInput.personalExperienceConfirmed}
            onChange={(e) => onTogglePersonalExperience(e.target.checked)}
            className="mt-1 accent-[#F5BF1E]"
          />
          <span className="text-[#A39E93] leading-snug">
            أؤكد أنني جربت المنتج شخصيًا (يسمح بذكر التجربة الشخصية في صفحة الجسر والإيميلات).
          </span>
        </label>

        {showAddProofForm && (
          <form
            onSubmit={handleCreateProof}
            className="bg-[#141216] p-3 rounded-lg border border-[#F5BF1E]/30 space-y-2.5 text-xs"
          >
            <div>
              <label className="block text-[#A39E93] mb-1">نوع الدليل</label>
              <select
                value={newProofType}
                onChange={(e) => setNewProofType(e.target.value as ProofItem['type'])}
                className="w-full bg-[#040405] border border-white/15 rounded px-2 py-1.5 text-[#FCFCFA]"
              >
                <option value="Testimonial">شهادة عميل حقيقية (Testimonial)</option>
                <option value="Statistic">إحصائية موثقة (Statistic)</option>
                <option value="Case Study">دراسة حالة (Case Study)</option>
                <option value="Personal Result">نتيجة شخصية موثقة (Personal Result)</option>
                <option value="Product Review">مراجعة موثقة (Product Review)</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="عنوان الدليل (مثال: توفير 9 ساعات أسبوعيًا)"
              value={newProofTitle}
              onChange={(e) => setNewProofTitle(e.target.value)}
              className="w-full bg-[#040405] border border-white/15 rounded px-2.5 py-1.5 text-[#FCFCFA]"
              required
            />
            <textarea
              placeholder="نص الدليل أو الإحصائية الحقيقية..."
              value={newProofContent}
              onChange={(e) => setNewProofContent(e.target.value)}
              rows={2}
              className="w-full bg-[#040405] border border-white/15 rounded px-2.5 py-1.5 text-[#FCFCFA]"
              required
            />
            <input
              type="text"
              placeholder="المصدر (مثال: استبيان، لقطة شاشة، موقع رسمي)"
              value={newProofSource}
              onChange={(e) => setNewProofSource(e.target.value)}
              className="w-full bg-[#040405] border border-white/15 rounded px-2.5 py-1.5 text-[#FCFCFA]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddProofForm(false)}
                className="px-2.5 py-1 text-[#A39E93]"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-[#F5BF1E] text-[#040405] font-bold rounded"
              >
                حفظ الدليل
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {project.proofLibrary.map((pf) => (
            <div
              key={pf.id}
              className="bg-[#141216] p-2.5 rounded-lg border border-white/8 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#FBD052]">{pf.title}</span>
                <button
                  type="button"
                  onClick={() => onRemoveProof(pf.id)}
                  className="text-[#A39E93] hover:text-red-400"
                  title="حذف الدليل"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[#FCFCFA] leading-relaxed">{pf.content}</p>
              <div className="text-[11px] text-[#A39E93]">
                النوع: <bdi dir="ltr">{pf.type}</bdi> · المصدر: {pf.source}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden xl:block w-[320px] shrink-0 bg-[#0C0B0E] border border-white/8 p-5 self-start sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl no-print">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden bg-black/80 flex justify-end no-print">
          <div className="w-full max-w-sm bg-[#0C0B0E] h-full overflow-y-auto p-5 border-r border-[#F5BF1E]/25">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
