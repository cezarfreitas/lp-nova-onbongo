import axios from 'axios';
import { statements } from '../database/index.js';
import { Lead, WebhookConfig } from '../types/index.js';

class WebhookService {
  private async getConfig(): Promise<WebhookConfig> {
    const endpointResult = await statements.getSetting.get('webhook_endpoint');
    const endpoint = endpointResult?.value;
    const methodResult = await statements.getSetting.get('webhook_method');
    const method = methodResult?.value || 'POST';
    const headersResult = await statements.getSetting.get('webhook_headers');
    const headersJson = headersResult?.value || '{}';
    const authTokenResult = await statements.getSetting.get('webhook_auth_token');
    const authToken = authTokenResult?.value;

    let headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    try {
      const customHeaders = JSON.parse(headersJson);
      headers = { ...headers, ...customHeaders };
    } catch (error) {
      console.warn('Headers do webhook inválidos, usando padrão');
    }

    if (authToken) {
      headers['Authorization'] = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
    }

    return {
      endpoint: endpoint || '',
      method,
      headers,
      auth_token: authToken
    };
  }

  private formatLeadData(lead: Lead) {
    return {
      id: lead.id,
      timestamp: lead.created_at,
      lead_data: {
        nome_completo: lead.nome_completo,
        whatsapp: lead.whatsapp,
        tipo_cadastro: lead.tipo_cadastro,
        cnpj: lead.cnpj || null
      },
      tracking_data: {
        ip_address: lead.ip_address,
        user_agent: lead.user_agent,
        utm_source: lead.utm_source,
        utm_medium: lead.utm_medium,
        utm_campaign: lead.utm_campaign,
        utm_content: lead.utm_content,
        utm_term: lead.utm_term,
        referrer: lead.referrer,
        browser_id: lead.browser_id,
        session_id: lead.session_id
      },
      metadata: {
        source: 'onbongo_b2b',
        version: '1.0',
        webhook_sent_at: new Date().toISOString()
      }
    };
  }

  async sendWebhook(lead: Lead): Promise<{ success: boolean; error?: string; response?: any }> {
    try {
      const config = await this.getConfig();
      
      if (!config.endpoint) {
        console.log('⚠️ Webhook endpoint não configurado, pulando envio');
        return { success: true }; // Não é erro se não estiver configurado
      }

      const payload = this.formatLeadData(lead);
      
      console.log(`📤 Enviando webhook para: ${config.endpoint}`);

      const response = await axios({
        method: config.method as any,
        url: config.endpoint,
        data: payload,
        headers: config.headers,
        timeout: 30000, // 30 segundos
        validateStatus: (status) => status < 500 // Aceitar 4xx como válido
      });

      // Salvar log de sucesso
      statements.insertWebhookLog.run(
        lead.id,
        config.endpoint,
        config.method,
        JSON.stringify(payload),
        response.status,
        JSON.stringify(response.data),
        null
      );

      // Atualizar status no lead
      statements.updateLeadWebhookStatus.run(true, lead.id);

      console.log(`✅ Webhook enviado com sucesso para lead ${lead.id}:`, {
        status: response.status,
        endpoint: config.endpoint
      });

      return { success: true, response: response.data };

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.statusText || 
                          error.message;

      console.error(`❌ Erro ao enviar webhook para lead ${lead.id}:`, {
        error: errorMessage,
        status: error.response?.status,
        endpoint: this.getConfig().endpoint
      });

      // Salvar log de erro
      statements.insertWebhookLog.run(
        lead.id,
        this.getConfig().endpoint,
        this.getConfig().method,
        JSON.stringify(this.formatLeadData(lead)),
        error.response?.status || null,
        error.response?.data ? JSON.stringify(error.response.data) : null,
        errorMessage
      );

      // Não atualizar status como enviado em caso de erro
      statements.updateLeadWebhookStatus.run(false, lead.id);

      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }

  async retryWebhook(leadId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const lead = statements.getLeadById.get(leadId) as Lead;
      
      if (!lead) {
        return { success: false, error: 'Lead não encontrado' };
      }

      return await this.sendWebhook(lead);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async testWebhook(): Promise<{ success: boolean; error?: string; response?: any }> {
    try {
      const config = await this.getConfig();
      
      if (!config.endpoint) {
        return { success: false, error: 'Endpoint do webhook não configurado' };
      }

      const testPayload = {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'Este é um teste do webhook ONBONGO B2B',
        lead_data: {
          nome_completo: 'Teste Webhook',
          whatsapp: '11999999999',
          tipo_cadastro: 'lojista',
          cnpj: '12.345.678/0001-90'
        },
        metadata: {
          source: 'onbongo_b2b',
          version: '1.0',
          test: true
        }
      };

      console.log(`��� Testando webhook: ${config.endpoint}`);

      const response = await axios({
        method: config.method as any,
        url: config.endpoint,
        data: testPayload,
        headers: config.headers,
        timeout: 30000
      });

      console.log(`✅ Teste do webhook realizado com sucesso:`, {
        status: response.status,
        endpoint: config.endpoint
      });

      return { success: true, response: response.data };

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.statusText || 
                          error.message;

      console.error(`❌ Erro no teste do webhook:`, {
        error: errorMessage,
        status: error.response?.status
      });

      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }
}

export default new WebhookService();
