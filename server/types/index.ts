export interface Lead {
  id?: number;
  nome_completo: string;
  whatsapp: string;
  tipo_cadastro: 'lojista' | 'consumidor';
  cnpj?: string;
  ip_address?: string;
  user_agent?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  browser_id?: string;
  session_id?: string;
  conversion_sent?: boolean;
  webhook_sent?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Setting {
  key: string;
  value: string;
  description?: string;
}

export interface AdminUser {
  id?: number;
  username: string;
  password_hash?: string;
  email?: string;
  is_active?: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WebhookLog {
  id?: number;
  lead_id: number;
  endpoint: string;
  method: string;
  payload: string;
  response_status?: number;
  response_body?: string;
  error_message?: string;
  sent_at?: string;
}

export interface ConversionEvent {
  id?: number;
  lead_id: number;
  event_type: string;
  platform: 'facebook' | 'google' | 'tiktok';
  event_id?: string;
  conversion_value?: number;
  currency?: string;
  sent_status: 'pending' | 'sent' | 'failed';
  response_data?: string;
  error_message?: string;
  sent_at?: string;
  created_at?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TrackingData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  ip_address?: string;
  user_agent?: string;
  browser_id?: string;
  session_id?: string;
}

export interface WebhookConfig {
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  auth_token?: string;
}

export interface ConversionConfig {
  meta: {
    pixel_id: string;
    access_token: string;
    test_event_code?: string;
  };
  ga4: {
    measurement_id: string;
  };
  tiktok: {
    pixel_id: string;
    access_token: string;
    test_event_code?: string;
  };
}
