import { AIConnectionConfig, AIProviderType } from '../types/aiConnection';

export const AI_CONNECTION_STORAGE_KEY = 'rbtls_ai_connection';

export const DEFAULT_MODELS_BY_PROVIDER: Record<AIProviderType, string> = {
  gemini: 'gemini-2.5-flash',
  openai: 'gpt-4o',
  anthropic: 'claude-3-5-sonnet-20241022',
  'openai-compatible': ''
};

export const PROVIDER_LABELS_AR: Record<AIProviderType, string> = {
  gemini: 'Google Gemini',
  openai: 'OpenAI',
  anthropic: 'Anthropic Claude',
  'openai-compatible': 'Custom / OpenAI-Compatible'
};

export function getStoredAIConnection(): AIConnectionConfig | null {
  try {
    const raw = sessionStorage.getItem(AI_CONNECTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.provider && parsed.apiKey) {
      return {
        provider: parsed.provider,
        apiKey: parsed.apiKey.trim(),
        model: parsed.model ? parsed.model.trim() : (parsed.provider === 'openai-compatible' ? '' : DEFAULT_MODELS_BY_PROVIDER[parsed.provider as AIProviderType] || 'gemini-2.5-flash'),
        baseUrl: parsed.baseUrl?.trim() || null,
        providerName: parsed.providerName?.trim() || null
      };
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

export function saveAIConnection(config: AIConnectionConfig): void {
  try {
    sessionStorage.setItem(
      AI_CONNECTION_STORAGE_KEY,
      JSON.stringify({
        provider: config.provider,
        apiKey: config.apiKey.trim(),
        model: config.model.trim(),
        baseUrl: config.baseUrl?.trim() || null,
        providerName: config.providerName?.trim() || null
      })
    );
  } catch (err) {
    console.error('Failed to save AI connection to sessionStorage', err);
  }
}

export function clearStoredAIConnection(): void {
  try {
    sessionStorage.removeItem(AI_CONNECTION_STORAGE_KEY);
  } catch {
    // Ignore
  }
}
