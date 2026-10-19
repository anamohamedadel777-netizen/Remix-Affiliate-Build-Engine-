export type AIProviderType =
  | 'gemini'
  | 'openai'
  | 'anthropic'
  | 'openai-compatible';

export interface AIConnectionConfig {
  provider: AIProviderType;
  apiKey: string;
  model: string;
  baseUrl?: string | null;
  providerName?: string | null;
}

export type NormalizedErrorCode =
  | 'MISSING_PROVIDER_CONFIG'
  | 'INVALID_API_KEY'
  | 'INVALID_MODEL'
  | 'MODEL_NOT_AVAILABLE'
  | 'PERMISSION_DENIED'
  | 'RATE_LIMIT'
  | 'QUOTA_EXCEEDED'
  | 'TIMEOUT'
  | 'CONNECTION_FAILED'
  | 'INVALID_RESPONSE'
  | 'STRUCTURED_OUTPUT_FAILED'
  | 'PROVIDER_ERROR'
  | 'INVALID_INPUT';

export interface AISuccessResponse<T = any> {
  success: true;
  requestId: string;
  provider: string;
  model: string;
  data: T;
}

export interface AIFailureResponse {
  success: false;
  requestId: string;
  provider?: string;
  model?: string;
  error: {
    code: NormalizedErrorCode;
    message: string;
    details?: string;
  };
}

export type AIResponse<T = any> = AISuccessResponse<T> | AIFailureResponse;
