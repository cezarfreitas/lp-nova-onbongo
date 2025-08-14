import axios from 'axios';
import crypto from 'crypto';
import { statements } from '../database/index.js';
import { Lead, ConversionEvent } from '../types/index.js';

interface ConversionConfig {
  meta_pixel_id?: string;
  meta_access_token?: string;
  meta_test_event_code?: string;
  tiktok_pixel_id?: string;
  tiktok_access_token?: string;
  tiktok_test_event_code?: string;
  conversion_value?: string;
}

class ConversionsService {
  private async getConfig(): Promise<ConversionConfig> {
    const keys = [
      'meta_pixel_id',
      'meta_access_token',
      'meta_test_event_code',
      'tiktok_pixel_id',
      'tiktok_access_token',
      'tiktok_test_event_code',
      'conversion_value'
    ];

    const config: ConversionConfig = {};

    for (const key of keys) {
      const setting = await statements.getSetting.get(key);
      if (setting && setting.value) {
        config[key as keyof ConversionConfig] = setting.value;
      }
    }

    return config;
  }

  private hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async sendMetaConversion(lead: Lead): Promise<{ success: boolean; error?: string; response?: any }> {
    try {
      const config = this.getConfig();
      
      if (!config.meta_pixel_id || !config.meta_access_token) {
        throw new Error('Meta Pixel ID ou Access Token não configurados');
      }

      const eventId = this.generateEventId();
      const conversionValue = parseFloat(config.conversion_value || '50');

      // Preparar dados do usuário (hash para privacidade)
      const userData: any = {};
      
      if (lead.whatsapp) {
        // Normalizar telefone (remover formatação)
        const phone = lead.whatsapp.replace(/\D/g, '');
        userData.ph = [this.hashData(phone)];
      }
      
      if (lead.nome_completo) {
        const nameParts = lead.nome_completo.trim().split(' ');
        if (nameParts.length > 0) {
          userData.fn = [this.hashData(nameParts[0].toLowerCase())];
        }
        if (nameParts.length > 1) {
          userData.ln = [this.hashData(nameParts[nameParts.length - 1].toLowerCase())];
        }
      }

      if (lead.ip_address) {
        userData.client_ip_address = lead.ip_address;
      }

      if (lead.user_agent) {
        userData.client_user_agent = lead.user_agent;
      }

      // Dados do evento
      const eventData = {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: 'http://b2b.onbongo.com.br',
        user_data: userData,
        custom_data: {
          content_name: 'Lead Generation',
          content_category: lead.tipo_cadastro,
          value: conversionValue,
          currency: 'BRL'
        }
      };

      // Adicionar UTM data se disponível
      if (lead.utm_source || lead.utm_medium || lead.utm_campaign) {
        eventData.custom_data = {
          ...eventData.custom_data,
          utm_source: lead.utm_source,
          utm_medium: lead.utm_medium,
          utm_campaign: lead.utm_campaign,
          utm_content: lead.utm_content,
          utm_term: lead.utm_term
        };
      }

      const payload = {
        data: [eventData]
      };

      // Adicionar test event code se configurado
      if (config.meta_test_event_code) {
        payload.test_event_code = config.meta_test_event_code;
      }

      const url = `https://graph.facebook.com/v18.0/${config.meta_pixel_id}/events`;
      
      const response = await axios.post(url, payload, {
        params: {
          access_token: config.meta_access_token
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Salvar evento no banco
      statements.insertConversionEvent.run(
        lead.id,
        'Lead',
        'facebook',
        eventId,
        conversionValue,
        'BRL',
        'sent',
        JSON.stringify(response.data),
        null,
        new Date().toISOString()
      );

      console.log('✅ Meta Conversion enviada:', { leadId: lead.id, eventId });
      
      return { success: true, response: response.data };

    } catch (error: any) {
      console.error('❌ Erro ao enviar Meta Conversion:', error.response?.data || error.message);
      
      // Salvar erro no banco
      statements.insertConversionEvent.run(
        lead.id,
        'Lead',
        'facebook',
        null,
        null,
        'BRL',
        'failed',
        error.response?.data ? JSON.stringify(error.response.data) : null,
        error.message,
        null
      );

      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message 
      };
    }
  }

  async sendTikTokConversion(lead: Lead): Promise<{ success: boolean; error?: string; response?: any }> {
    try {
      const config = this.getConfig();
      
      if (!config.tiktok_pixel_id || !config.tiktok_access_token) {
        throw new Error('TikTok Pixel ID ou Access Token não configurados');
      }

      const eventId = this.generateEventId();
      const conversionValue = parseFloat(config.conversion_value || '50');

      // Preparar dados do usuário (hash para privacidade)
      const userData: any = {};
      
      if (lead.whatsapp) {
        const phone = lead.whatsapp.replace(/\D/g, '');
        userData.phone_number = this.hashData(phone);
      }

      if (lead.ip_address) {
        userData.ip = lead.ip_address;
      }

      if (lead.user_agent) {
        userData.user_agent = lead.user_agent;
      }

      const eventData = {
        pixel_code: config.tiktok_pixel_id,
        event: 'SubmitForm',
        event_id: eventId,
        timestamp: new Date().toISOString(),
        context: {
          page: {
            url: 'http://b2b.onbongo.com.br',
            referrer: lead.referrer || ''
          },
          user: userData
        },
        properties: {
          contents: [{
            content_type: 'product',
            content_id: 'lead_generation',
            content_name: 'Lead Generation Form'
          }],
          content_type: 'form',
          value: conversionValue,
          currency: 'BRL'
        }
      };

      const payload = {
        business_sdk_config: {
          business_sdk_code: config.tiktok_pixel_id
        },
        data: [eventData]
      };

      // Adicionar test event code se configurado
      if (config.tiktok_test_event_code) {
        payload.test_event_code = config.tiktok_test_event_code;
      }

      const url = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';
      
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': config.tiktok_access_token
        }
      });

      // Salvar evento no banco
      statements.insertConversionEvent.run(
        lead.id,
        'SubmitForm',
        'tiktok',
        eventId,
        conversionValue,
        'BRL',
        'sent',
        JSON.stringify(response.data),
        null,
        new Date().toISOString()
      );

      console.log('✅ TikTok Conversion enviada:', { leadId: lead.id, eventId });
      
      return { success: true, response: response.data };

    } catch (error: any) {
      console.error('❌ Erro ao enviar TikTok Conversion:', error.response?.data || error.message);
      
      // Salvar erro no banco
      statements.insertConversionEvent.run(
        lead.id,
        'SubmitForm',
        'tiktok',
        null,
        null,
        'BRL',
        'failed',
        error.response?.data ? JSON.stringify(error.response.data) : null,
        error.message,
        null
      );

      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  async sendAllConversions(lead: Lead): Promise<void> {
    const results = await Promise.allSettled([
      this.sendMetaConversion(lead),
      this.sendTikTokConversion(lead)
    ]);

    // Verificar se pelo menos uma conversão foi enviada com sucesso
    const hasSuccess = results.some(result => 
      result.status === 'fulfilled' && result.value.success
    );

    // Atualizar status no lead
    statements.updateLeadConversionStatus.run(hasSuccess, lead.id);

    console.log(`📊 Conversões processadas para lead ${lead.id}:`, {
      meta: results[0].status === 'fulfilled' ? results[0].value.success : false,
      tiktok: results[1].status === 'fulfilled' ? results[1].value.success : false
    });
  }
}

export default new ConversionsService();
