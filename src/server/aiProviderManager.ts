import { GoogleGenAI } from '@google/genai';
import {
  AIConnectionConfig,
  NormalizedErrorCode,
  AIResponse
} from '../types/aiConnection.js';

export interface GenerateStructuredParams {
  task: string;
  systemInstruction?: string;
  prompt: string;
  schema?: any;
  connectionConfig?: AIConnectionConfig | null;
  requestId: string;
  timeoutMs?: number;
}

export function generateRequestId(prefix: string = 'req_build'): string {
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_]/g, '');
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${cleanPrefix}_${timestamp}_${random}`;
}

// Deterministically extract JSON from raw text
export function extractCleanJson(rawText: string): any {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Raw response is empty');
  }

  let text = rawText.trim();

  // Strip markdown code fences if present
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  } else {
    // If there's markdown somewhere inside the text, extract the outermost {} or []
    const firstBrace = text.indexOf('{');
    const firstBracket = text.indexOf('[');
    let startIdx = -1;
    let endIdx = -1;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIdx = firstBrace;
      endIdx = text.lastIndexOf('}');
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
      endIdx = text.lastIndexOf(']');
    }

    if (startIdx !== -1 && endIdx > startIdx) {
      text = text.substring(startIdx, endIdx + 1);
    }
  }

  return JSON.parse(text);
}

export function mapErrorToNormalizedCode(err: any): { code: NormalizedErrorCode; message: string } {
  const rawMsg = String(err?.message || err || '');
  const lower = rawMsg.toLowerCase();
  const status = Number(err?.status || err?.statusCode || 0);

  if (lower.includes('missing_provider_config') || lower.includes('no api key') || lower.includes('not configured')) {
    return {
      code: 'MISSING_PROVIDER_CONFIG',
      message: 'لم يتم تزويد مفتاح API الخاص بمزود الذكاء الاصطناعي. يرجى ضبط الاتصال أولاً.'
    };
  }

  // Model errors must be checked before generic API key errors so invalid models are not mislabeled as invalid keys
  if (
    status === 404 ||
    lower.includes('model_not_found') ||
    lower.includes('does not exist') ||
    lower.includes('is not found') ||
    lower.includes('unknown model') ||
    lower.includes('not available') ||
    lower.includes('unsupported model') ||
    lower.includes('invalid model') ||
    (lower.includes('model') && (lower.includes('not found') || lower.includes('cannot be found') || lower.includes('not supported')))
  ) {
    return {
      code: 'MODEL_NOT_AVAILABLE',
      message: 'الموديل المحدد غير متوفر أو غير متاح في حسابك لدى المزود.'
    };
  }

  if (status === 403 || lower.includes('permission_denied') || lower.includes('forbidden') || lower.includes('access_denied')) {
    return {
      code: 'PERMISSION_DENIED',
      message: 'تم رفض الإذن بالوصول إلى هذا الموديل أو الخدمة من حسابك.'
    };
  }

  if (
    status === 401 ||
    lower.includes('api_key_invalid') ||
    lower.includes('invalid api key') ||
    lower.includes('incorrect api key') ||
    lower.includes('invalid_api_key') ||
    lower.includes('unauthorized') ||
    lower.includes('authentication')
  ) {
    return {
      code: 'INVALID_API_KEY',
      message: 'مفتاح API غير صالح أو غير معتمد لدى المزود. يرجى مراجعة المفتاح.'
    };
  }

  if (
    status === 429 ||
    lower.includes('rate limit') ||
    lower.includes('quota') ||
    lower.includes('resource_exhausted') ||
    lower.includes('too many requests')
  ) {
    return {
      code: lower.includes('quota') ? 'QUOTA_EXCEEDED' : 'RATE_LIMIT',
      message: 'تم تجاوز حد الاستخدام المسموح به (Rate Limit / Quota) لدى مزود الذكاء الاصطناعي.'
    };
  }

  if (
    lower.includes('timeout') ||
    lower.includes('timed out') ||
    lower.includes('abort') ||
    err?.name === 'AbortError'
  ) {
    return {
      code: 'TIMEOUT',
      message: 'استغرقت استجابة المزود وقتًا طويلاً وتجاوزت المهلة المحددة (Timeout).'
    };
  }

  if (
    lower.includes('econnrefused') ||
    lower.includes('enotfound') ||
    lower.includes('fetch failed') ||
    lower.includes('network')
  ) {
    return {
      code: 'CONNECTION_FAILED',
      message: 'فشل الاتصال بخادم المزود. تأكد من اتصال الإنترنت وصحة عنوان Base URL.'
    };
  }

  if (lower.includes('json') || lower.includes('syntaxerror') || lower.includes('parse')) {
    return {
      code: 'STRUCTURED_OUTPUT_FAILED',
      message: 'استجاب الموديل ولكن تعذر استخراج مخرجات JSON مطابقة للهيكل المطلوب.'
    };
  }

  return {
    code: 'PROVIDER_ERROR',
    message: rawMsg || 'حدث خطأ غير متوقع أثناء معالجة الطلب لدى المزود.'
  };
}

export class AIProviderManager {
  /**
   * Safe server logger: Never logs secrets, keys, or credential bodies.
   */
  private static logSafe(meta: {
    requestId: string;
    task: string;
    provider: string;
    model: string;
    durationMs: number;
    status: 'SUCCESS' | 'ERROR';
    errorCode?: NormalizedErrorCode;
  }) {
    const codePart = meta.errorCode ? ` code=${meta.errorCode}` : '';
    console.log(
      `[AI_BUILD_ENGINE] [${meta.status}] reqId=${meta.requestId} task="${meta.task}" provider=${meta.provider} model=${meta.model} duration=${meta.durationMs}ms${codePart}`
    );
  }

  /**
   * Main unified entry point: generate structured JSON from any configured provider
   */
  public static async generateStructured<T = any>(
    params: GenerateStructuredParams
  ): Promise<AIResponse<T>> {
    const startTime = Date.now();
    const config = params.connectionConfig;

    if (!config || !config.apiKey || !config.apiKey.trim()) {
      const mapped = mapErrorToNormalizedCode('MISSING_PROVIDER_CONFIG');
      this.logSafe({
        requestId: params.requestId,
        task: params.task,
        provider: config?.provider || 'unknown',
        model: config?.model || 'unknown',
        durationMs: Date.now() - startTime,
        status: 'ERROR',
        errorCode: mapped.code
      });
      return {
        success: false,
        requestId: params.requestId,
        provider: config?.provider,
        model: config?.model,
        error: mapped
      };
    }

    const provider = config.provider;
    const model = config.model.trim();
    const timeoutMs = params.timeoutMs || 90000;

    try {
      let rawResultText = '';

      if (provider === 'gemini') {
        rawResultText = await this.executeGemini(config, params, timeoutMs);
      } else if (provider === 'openai') {
        rawResultText = await this.executeOpenAI(config, params, timeoutMs);
      } else if (provider === 'anthropic') {
        rawResultText = await this.executeAnthropic(config, params, timeoutMs);
      } else if (provider === 'openai-compatible') {
        rawResultText = await this.executeOpenAICompatible(config, params, timeoutMs);
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }

      const parsedData = extractCleanJson(rawResultText);

      this.logSafe({
        requestId: params.requestId,
        task: params.task,
        provider,
        model,
        durationMs: Date.now() - startTime,
        status: 'SUCCESS'
      });

      return {
        success: true,
        requestId: params.requestId,
        provider,
        model,
        data: parsedData as T
      };
    } catch (err: any) {
      const mapped = mapErrorToNormalizedCode(err);
      this.logSafe({
        requestId: params.requestId,
        task: params.task,
        provider,
        model,
        durationMs: Date.now() - startTime,
        status: 'ERROR',
        errorCode: mapped.code
      });

      return {
        success: false,
        requestId: params.requestId,
        provider,
        model,
        error: mapped
      };
    }
  }

  /**
   * Adapter: Google Gemini via @google/genai SDK
   */
  private static async executeGemini(
    config: AIConnectionConfig,
    params: GenerateStructuredParams,
    timeoutMs: number
  ): Promise<string> {
    const ai = new GoogleGenAI({
      apiKey: config.apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'rbtls-affiliate-build-engine'
        }
      }
    });

    // Run with timeout race
    const callPromise = ai.models.generateContent({
      model: config.model || 'gemini-2.5-flash',
      contents: params.prompt,
      config: {
        systemInstruction: params.systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: params.schema
      }
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('TIMEOUT: Gemini request exceeded timeout')), timeoutMs);
    });

    const response = await Promise.race([callPromise, timeoutPromise]);
    return response.text || '';
  }

  /**
   * Adapter: OpenAI REST API
   */
  private static async executeOpenAI(
    config: AIConnectionConfig,
    params: GenerateStructuredParams,
    timeoutMs: number
  ): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const schemaInstruction = params.schema
      ? `\n\nREQUIRED JSON SCHEMA:\n${JSON.stringify(params.schema, null, 2)}`
      : '';
    const systemPrompt = `${params.systemInstruction || ''}\n\nIMPORTANT: You must respond in valid JSON format ONLY. Do not wrap in markdown quotes if possible, return raw parseable JSON adhering to the user specification.${schemaInstruction}`;

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: params.prompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3
        }),
        signal: controller.signal
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const errMessage = errorBody?.error?.message || `OpenAI returned status ${res.status}`;
        const err: any = new Error(errMessage);
        err.status = res.status;
        throw err;
      }

      const json = await res.json();
      return json?.choices?.[0]?.message?.content || '';
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Adapter: Anthropic Claude REST API
   */
  private static async executeAnthropic(
    config: AIConnectionConfig,
    params: GenerateStructuredParams,
    timeoutMs: number
  ): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const schemaInstruction = params.schema
      ? `\n\nREQUIRED JSON SCHEMA:\n${JSON.stringify(params.schema, null, 2)}`
      : '';
    const systemPrompt = `${params.systemInstruction || ''}\n\nCRITICAL INSTRUCTION: You must respond with valid JSON ONLY. Output nothing before the initial { or [ and nothing after the closing } or ].${schemaInstruction}`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: config.model || 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [
            { role: 'user', content: `${params.prompt}\n\nPlease output valid structured JSON only.` }
          ],
          temperature: 0.3
        }),
        signal: controller.signal
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const errMessage = errorBody?.error?.message || `Anthropic returned status ${res.status}`;
        const err: any = new Error(errMessage);
        err.status = res.status;
        throw err;
      }

      const json = await res.json();
      const textBlock = json?.content?.find((c: any) => c.type === 'text');
      return textBlock?.text || '';
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Adapter: OpenAI-Compatible / Custom Provider (OpenRouter, Groq, Ollama, DeepSeek, etc.)
   */
  private static async executeOpenAICompatible(
    config: AIConnectionConfig,
    params: GenerateStructuredParams,
    timeoutMs: number
  ): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let baseUrl = (config.baseUrl || '').trim().replace(/\/+$/, '');
    if (!baseUrl) {
      baseUrl = 'https://api.openai.com/v1';
    }

    const endpoint = baseUrl.endsWith('/chat/completions')
      ? baseUrl
      : `${baseUrl}/chat/completions`;

    const schemaInstruction = params.schema
      ? `\n\nREQUIRED JSON SCHEMA:\n${JSON.stringify(params.schema, null, 2)}`
      : '';
    const systemPrompt = `${params.systemInstruction || ''}\n\nIMPORTANT: Respond with pure, parseable JSON ONLY. No conversational preamble or trailing explanation.${schemaInstruction}`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: params.prompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3
        }),
        signal: controller.signal
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const errMessage = errorBody?.error?.message || `Custom provider returned status ${res.status}`;
        const err: any = new Error(errMessage);
        err.status = res.status;
        throw err;
      }

      const json = await res.json();
      return json?.choices?.[0]?.message?.content || '';
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Test connection ping to verify user API key and model access.
   * Required order:
   * 1. Provider selected.
   * 2. API key supplied.
   * 3. Attempt model discovery where supported.
   * 4. Correct invalid selected model if needed.
   * 5. Run minimal generation test with FINAL model.
   */
  public static async testConnection(config: AIConnectionConfig): Promise<{
    success: boolean;
    provider: string;
    model: string;
    messageAr: string;
    discoveredModels?: string[];
    error?: { code: NormalizedErrorCode; message: string };
  }> {
    // 1. Provider selected
    if (!config.provider) {
      return {
        success: false,
        provider: 'unknown',
        model: config.model || '',
        messageAr: 'يرجى اختيار مزود الذكاء الاصطناعي.',
        error: { code: 'MISSING_PROVIDER_CONFIG', message: 'لم يتم اختيار المزود.' }
      };
    }

    // 2. API key supplied
    if (!config.apiKey || !config.apiKey.trim()) {
      return {
        success: false,
        provider: config.provider,
        model: config.model || '',
        messageAr: 'يرجى إدخال مفتاح الـAPI.',
        error: { code: 'MISSING_PROVIDER_CONFIG', message: 'يرجى إدخال مفتاح الـAPI.' }
      };
    }

    // 3. Attempt model discovery where supported
    let discovered: string[] = [];
    try {
      discovered = await this.discoverModels(config);
    } catch {
      // Discovery error alone should not fail test if model is supplied
    }

    // 4. Correct invalid selected model if needed
    let finalModel = (config.model || '').trim();
    if (discovered.length > 0) {
      if (!finalModel || !discovered.includes(finalModel)) {
        finalModel = discovered[0];
      }
    }

    if (!finalModel) {
      if (config.provider === 'openai-compatible') {
        return {
          success: false,
          provider: config.provider,
          model: '',
          messageAr: 'يرجى إدخال اسم الموديل يدويًا أو تحديث قائمة الموديلات.',
          error: { code: 'INVALID_MODEL', message: 'اسم الموديل مطلوب للمزود المخصص.' }
        };
      }
      finalModel =
        config.provider === 'gemini'
          ? 'gemini-2.5-flash'
          : config.provider === 'openai'
          ? 'gpt-4o'
          : 'claude-3-5-sonnet-20241022';
    }

    const finalConfig = { ...config, model: finalModel };

    // 5. Run minimal generation test with FINAL model
    const testReqId = generateRequestId('req_test');
    const result = await this.generateStructured<{ status: string }>({
      task: 'TEST_CONNECTION',
      prompt: 'Respond with valid JSON: {"status": "ok"}',
      systemInstruction: 'Respond only with {"status": "ok"}',
      connectionConfig: finalConfig,
      requestId: testReqId,
      timeoutMs: 15000
    });

    if (result.success) {
      return {
        success: true,
        provider: finalConfig.provider,
        model: finalConfig.model,
        discoveredModels: discovered,
        messageAr: 'تم التحقق من الاتصال بنجاح بالمزود والموديل المختار.'
      };
    } else {
      const fail = result as import('../types/aiConnection.js').AIFailureResponse;
      return {
        success: false,
        provider: finalConfig.provider,
        model: finalConfig.model,
        discoveredModels: discovered,
        messageAr: fail.error?.message || 'تعذر الاتصال بالمزود.',
        error: fail.error
      };
    }
  }

  /**
   * Model Discovery: live model discovery whenever technically supported
   */
  public static async discoverModels(config: AIConnectionConfig): Promise<string[]> {
    const provider = config.provider;

    // 1. Google Gemini: Live discovery via @google/genai SDK
    if (provider === 'gemini') {
      try {
        const ai = new GoogleGenAI({
          apiKey: config.apiKey,
          httpOptions: { headers: { 'User-Agent': 'rbtls-affiliate-build-engine' } }
        });
        const pager = await ai.models.list();
        const liveModels: string[] = [];
        for await (const m of pager) {
          const rawName = (m as any).name || '';
          const name = rawName.replace(/^models\//, '');
          const methods = (m as any).supportedGenerationMethods || [];
          if (
            name &&
            (name.includes('gemini') || methods.includes('generateContent')) &&
            !name.includes('embedding') &&
            !name.includes('aqa')
          ) {
            liveModels.push(name);
          }
        }
        if (liveModels.length > 0) {
          return liveModels.sort();
        }
      } catch (err: any) {
        console.log('[AI_DISCOVERY] Gemini live discovery fallback:', err?.message || err);
      }
      return [
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-2.0-flash'
      ];
    }

    // 2. OpenAI: Live discovery with future-safe non-chat filtering
    if (provider === 'openai') {
      try {
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${config.apiKey}` }
        });
        if (res.ok) {
          const data = await res.json();
          const nonChatKeywords = [
            'whisper',
            'tts',
            'dall-e',
            'embedding',
            'moderation',
            'babbage',
            'davinci',
            'curie',
            'ada',
            'realtime',
            'audio'
          ];
          const ids: string[] = (data.data || [])
            .map((m: any) => m.id)
            .filter((id: string) => !nonChatKeywords.some((kw) => id.toLowerCase().includes(kw)))
            .sort();
          if (ids.length > 0) return ids;
        }
      } catch (err: any) {
        console.log('[AI_DISCOVERY] OpenAI live discovery fallback:', err?.message || err);
      }
      return ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'o1', 'gpt-4-turbo'];
    }

    // 3. Anthropic: Live discovery via GET /v1/models if supported
    if (provider === 'anthropic') {
      try {
        const res = await fetch('https://api.anthropic.com/v1/models', {
          headers: {
            'x-api-key': config.apiKey,
            'anthropic-version': '2023-06-01'
          }
        });
        if (res.ok) {
          const data = await res.json();
          const ids: string[] = (data.data || []).map((m: any) => m.id).filter(Boolean).sort();
          if (ids.length > 0) return ids;
        }
      } catch (err: any) {
        console.log('[AI_DISCOVERY] Anthropic live discovery fallback:', err?.message || err);
      }
      return [
        'claude-3-5-sonnet-20241022',
        'claude-3-5-haiku-20241022',
        'claude-3-opus-20240229'
      ];
    }

    // 4. Custom / OpenAI-Compatible Provider: fetch from baseUrl
    if (provider === 'openai-compatible') {
      let baseUrl = (config.baseUrl || '').trim().replace(/\/+$/, '');
      if (baseUrl) {
        const candidateEndpoints = [
          baseUrl.endsWith('/v1') ? `${baseUrl}/models` : `${baseUrl}/v1/models`,
          `${baseUrl}/models`
        ];
        for (const url of candidateEndpoints) {
          try {
            const res = await fetch(url, {
              headers: { Authorization: `Bearer ${config.apiKey}` }
            });
            if (res.ok) {
              const data = await res.json();
              const rawList = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
              const ids: string[] = rawList
                .map((m: any) => (typeof m === 'string' ? m : m.id || m.name))
                .filter(Boolean);
              if (ids.length > 0) return ids;
            }
          } catch {
            // Try next candidate endpoint
          }
        }
      }
      // If discovery fails, do NOT reject API key; allow manual model entry
      return config.model ? [config.model] : [];
    }

    return [];
  }
}
