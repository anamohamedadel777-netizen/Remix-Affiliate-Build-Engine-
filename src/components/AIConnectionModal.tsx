import React, { useState, useEffect } from 'react';
import {
  AIConnectionConfig,
  AIProviderType
} from '../types/aiConnection';
import {
  getStoredAIConnection,
  saveAIConnection,
  clearStoredAIConnection,
  DEFAULT_MODELS_BY_PROVIDER,
  PROVIDER_LABELS_AR
} from '../utils/aiConnectionStorage';
import {
  X,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Globe,
  ShieldCheck,
  Trash2
} from 'lucide-react';

interface AIConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionUpdated: (config: AIConnectionConfig | null) => void;
}

export const AIConnectionModal: React.FC<AIConnectionModalProps> = ({
  isOpen,
  onClose,
  onConnectionUpdated
}) => {
  const [provider, setProvider] = useState<AIProviderType>('gemini');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [providerName, setProviderName] = useState('');

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    messageAr: string;
    code?: string;
  } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize from sessionStorage on open
  useEffect(() => {
    if (isOpen) {
      const stored = getStoredAIConnection();
      if (stored) {
        setProvider(stored.provider);
        setApiKey(stored.apiKey);
        setModel(stored.model);
        setBaseUrl(stored.baseUrl || '');
        setProviderName(stored.providerName || '');
      } else {
        setProvider('gemini');
        setApiKey('');
        setModel(DEFAULT_MODELS_BY_PROVIDER.gemini);
        setBaseUrl('');
        setProviderName('');
      }
      setTestResult(null);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  // When provider changes, update default model if model not manually set or belongs to another provider
  const handleSelectProvider = (newProvider: AIProviderType) => {
    setProvider(newProvider);
    setTestResult(null);
    setAvailableModels([]);
    if (newProvider === 'openai-compatible') {
      if (!model || model.startsWith('gemini') || model.startsWith('claude')) {
        setModel('gpt-4o');
      }
      if (!baseUrl) {
        setBaseUrl('https://api.openai.com/v1');
      }
      if (!providerName) {
        setProviderName('Custom Provider');
      }
    } else {
      setModel(DEFAULT_MODELS_BY_PROVIDER[newProvider]);
    }
  };

  const currentConfig: AIConnectionConfig = {
    provider,
    apiKey: apiKey.trim(),
    model: model.trim() || DEFAULT_MODELS_BY_PROVIDER[provider],
    baseUrl: baseUrl.trim() || null,
    providerName: providerName.trim() || null
  };

  // 1. Test Connection
  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({
        success: false,
        messageAr: 'يرجى إدخال مفتاح API أولاً لاختبار الاتصال.'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ai-provider': currentConfig.provider,
          'x-ai-api-key': currentConfig.apiKey,
          'x-ai-model': currentConfig.model,
          'x-ai-base-url': encodeURIComponent(currentConfig.baseUrl || ''),
          'x-ai-provider-name': encodeURIComponent(currentConfig.providerName || '')
        },
        body: JSON.stringify({ connectionConfig: currentConfig })
      });

      const json = await res.json();
      if (json.success) {
        setTestResult({
          success: true,
          messageAr: json.data?.message || 'تم الاتصال بنجاح بالمزود والموديل المختار.'
        });
      } else {
        setTestResult({
          success: false,
          code: json.error?.code,
          messageAr: json.error?.message || 'فشل الاتصال بالمزود.'
        });
      }
    } catch {
      setTestResult({
        success: false,
        code: 'CONNECTION_FAILED',
        messageAr: 'تعذر الاتصال بخادم التطبيق لاختبار المفتاح.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  // 2. Refresh Models Discovery
  const handleRefreshModels = async () => {
    if (!apiKey.trim()) {
      setTestResult({
        success: false,
        messageAr: 'يرجى إدخال مفتاح API أولاً لجلب قائمة الموديلات المتاحة.'
      });
      return;
    }

    setIsLoadingModels(true);
    try {
      const res = await fetch('/api/ai/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ai-provider': currentConfig.provider,
          'x-ai-api-key': currentConfig.apiKey,
          'x-ai-model': currentConfig.model,
          'x-ai-base-url': encodeURIComponent(currentConfig.baseUrl || ''),
          'x-ai-provider-name': encodeURIComponent(currentConfig.providerName || '')
        },
        body: JSON.stringify({ connectionConfig: currentConfig })
      });

      const json = await res.json();
      if (json.success && Array.isArray(json.data?.models)) {
        setAvailableModels(json.data.models);
        if (json.data.models.length > 0 && !json.data.models.includes(model)) {
          setModel(json.data.models[0]);
        }
      }
    } catch {
      // Ignore
    } finally {
      setIsLoadingModels(false);
    }
  };

  // 3. Save Connection (sessionStorage only)
  const handleSaveConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setTestResult({
        success: false,
        messageAr: 'يرجى إدخال مفتاح API لحفظ الاتصال.'
      });
      return;
    }

    saveAIConnection(currentConfig);
    onConnectionUpdated(currentConfig);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  // 4. Disconnect / Clear
  const handleDisconnect = () => {
    clearStoredAIConnection();
    setApiKey('');
    setTestResult(null);
    onConnectionUpdated(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0C0B0E] border border-[#F5BF1E]/30 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#23170D] border border-[#F5BF1E]/40 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-[#F5BF1E]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#FCFCFA]">
                ربط مزود الذكاء الاصطناعي (BYOK)
              </h2>
              <p className="text-xs text-[#A39E93]">
                استخدم حسابك ومفتاحك الخاص بدون الاعتماد على مفتاح مركزي
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#A39E93] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSaveConnection} className="p-5 space-y-5 flex-1">
          {/* Provider Selection Tabs */}
          <div>
            <label className="block text-xs font-semibold text-[#A39E93] mb-2">
              اختر مزود الذكاء الاصطناعي (AI Provider)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['gemini', 'openai', 'anthropic', 'openai-compatible'] as AIProviderType[]).map(
                (p) => {
                  const isSelected = provider === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleSelectProvider(p)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#23170D] border-[#F5BF1E] text-[#FBD052] shadow-sm'
                          : 'bg-[#141216] border-white/10 text-[#A39E93] hover:text-white hover:border-white/20'
                      }`}
                    >
                      <Cpu className="w-4 h-4 text-[#F5BF1E]" />
                      <span className="truncate text-center">
                        {p === 'gemini'
                          ? 'Gemini'
                          : p === 'openai'
                          ? 'OpenAI'
                          : p === 'anthropic'
                          ? 'Claude'
                          : 'Custom / مخصص'}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Custom Provider Specific Fields */}
          {provider === 'openai-compatible' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#141216] border border-white/10 rounded-xl">
              <div>
                <label className="block text-xs text-[#A39E93] mb-1">
                  اسم المزود (Provider Name)
                </label>
                <input
                  type="text"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="مثال: OpenRouter / Groq / DeepSeek"
                  className="w-full bg-[#0C0B0E] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5BF1E]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#A39E93] mb-1">
                  عنوان Base URL
                </label>
                <div className="flex items-center bg-[#0C0B0E] border border-white/15 rounded-lg px-2.5 focus-within:border-[#F5BF1E]">
                  <Globe className="w-3.5 h-3.5 text-[#A39E93] shrink-0" />
                  <input
                    type="text"
                    dir="ltr"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://openrouter.ai/api/v1"
                    className="w-full bg-transparent px-2 py-2 text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#FCFCFA] flex items-center gap-1.5">
                <span>مفتاح الـAPI الخاص بـ {PROVIDER_LABELS_AR[provider]}</span>
                <span className="text-red-400 font-bold">*</span>
              </label>
              <span className="text-[11px] text-[#A39E93] font-mono">
                {provider === 'gemini'
                  ? 'AIzaSy...'
                  : provider === 'openai'
                  ? 'sk-...'
                  : provider === 'anthropic'
                  ? 'sk-ant-...'
                  : 'Bearer Key'}
              </span>
            </div>
            <input
              type="password"
              dir="ltr"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="الصق مفتاح API هنا..."
              autoComplete="off"
              className="w-full bg-[#141216] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#F5BF1E] transition-colors"
            />
          </div>

          {/* Model Selection and Refresh */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#FCFCFA]">
                الموديل المستخدم (Model ID)
              </label>
              <button
                type="button"
                onClick={handleRefreshModels}
                disabled={isLoadingModels || !apiKey.trim()}
                className="text-[11px] text-[#F5BF1E] hover:text-[#FBD052] flex items-center gap-1 disabled:opacity-40 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingModels ? 'animate-spin' : ''}`} />
                <span>تحديث قائمة الموديلات</span>
              </button>
            </div>

            {availableModels.length > 0 ? (
              <select
                dir="ltr"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-[#141216] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#F5BF1E]"
              >
                {availableModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                dir="ltr"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="أدخل اسم الموديل (مثل: gpt-4o أو claude-3-5-sonnet أو gemini-2.5-flash)"
                className="w-full bg-[#141216] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#F5BF1E]"
              />
            )}
          </div>

          {/* Test Connection Button & Result */}
          <div className="pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !apiKey.trim()}
                className="px-4 py-2 bg-[#141216] hover:bg-[#23170D] border border-white/15 hover:border-[#F5BF1E]/40 text-xs font-bold text-[#FCFCFA] rounded-xl flex items-center gap-2 disabled:opacity-40 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-[#F5BF1E]' : ''}`} />
                <span>{isTesting ? 'جاري الاختبار...' : 'اختبار الاتصال'}</span>
              </button>

              {apiKey.trim() && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-3 py-2 text-xs text-[#A39E93] hover:text-red-400 rounded-xl hover:bg-red-950/20 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>قطع الاتصال</span>
                </button>
              )}
            </div>

            {testResult && (
              <div
                className={`mt-3 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-950/40 border-red-500/30 text-red-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="font-semibold">{testResult.messageAr}</div>
                  {testResult.code && (
                    <div className="font-mono text-[11px] opacity-80">
                      Debug Code: {testResult.code}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Security Notice (Session Only Guarantee) */}
          <div className="p-3 bg-[#141216]/60 border border-white/8 rounded-xl flex items-start gap-2.5 text-[11px] text-[#A39E93]">
            <ShieldCheck className="w-4 h-4 text-[#F5BF1E] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-[#FCFCFA]">حماية البيانات والخصوصية:</strong> يتم حفظ مفتاحك
              في ذاكرة الجلسة فقط (<code className="font-mono text-[#FBD052]">sessionStorage</code>).
              المفتاح لا يتم حفظه أبدًا في بيانات المشروع الدائمة، ولا يظهر في ملفات التصدير (JSON Export)، ولا يُسجل في السجلات.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#A39E93] hover:text-white rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!apiKey.trim()}
              className="px-6 py-2.5 bg-[#F5BF1E] hover:bg-[#FBD052] disabled:opacity-40 text-[#040405] font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم حفظ الاتصال للجلسة ✓</span>
                </>
              ) : (
                <span>اعتماد الاتصال وحفظه للجلسة</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
