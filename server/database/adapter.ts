import jsonStorage from './json-storage.js';
import { Lead, Setting, AdminUser } from '../types/index.js';

// Adapter para manter compatibilidade com a interface SQLite
export const statements = {
  // Leads
  insertLead: {
    run: async (
      nome_completo: string,
      whatsapp: string,
      tipo_cadastro: string,
      cnpj: string | null,
      ip_address: string,
      user_agent: string,
      utm_source: string | null,
      utm_medium: string | null,
      utm_campaign: string | null,
      utm_content: string | null,
      utm_term: string | null,
      referrer: string | null,
      browser_id: string,
      session_id: string
    ) => {
      const lead = await jsonStorage.insertLead({
        nome_completo,
        whatsapp,
        tipo_cadastro: tipo_cadastro as 'lojista' | 'consumidor',
        cnpj: cnpj || undefined,
        ip_address,
        user_agent,
        utm_source: utm_source || undefined,
        utm_medium: utm_medium || undefined,
        utm_campaign: utm_campaign || undefined,
        utm_content: utm_content || undefined,
        utm_term: utm_term || undefined,
        referrer: referrer || undefined,
        browser_id,
        session_id
      });
      return { lastInsertRowid: lead.id };
    }
  },

  getLeads: {
    all: async (limit: number, offset: number) => {
      const result = await jsonStorage.getLeads(limit, offset);
      return result.leads;
    }
  },

  getLeadById: {
    get: async (id: number) => {
      return await jsonStorage.getLeadById(id);
    }
  },

  updateLeadWebhookStatus: {
    run: async (sent: boolean, id: number) => {
      await jsonStorage.updateLeadWebhookStatus(id, sent);
    }
  },

  updateLeadConversionStatus: {
    run: async (sent: boolean, id: number) => {
      await jsonStorage.updateLeadConversionStatus(id, sent);
    }
  },

  // Settings
  getSetting: {
    get: async (key: string) => {
      const value = await jsonStorage.getSetting(key);
      return value ? { value } : null;
    }
  },

  setSetting: {
    run: async (key: string, value: string) => {
      await jsonStorage.setSetting(key, value);
    }
  },

  getAllSettings: {
    all: async () => {
      return await jsonStorage.getAllSettings();
    }
  },

  // Admin Users
  getAdminByUsername: {
    get: async (username: string) => {
      return await jsonStorage.getAdminByUsername(username);
    }
  },

  updateLastLogin: {
    run: async (id: number) => {
      await jsonStorage.updateLastLogin(id);
    }
  },

  // Webhook Logs
  insertWebhookLog: {
    run: async (
      lead_id: number,
      endpoint: string,
      method: string,
      payload: string,
      response_status: number | null,
      response_body: string | null,
      error_message: string | null
    ) => {
      await jsonStorage.insertWebhookLog({
        lead_id,
        endpoint,
        method,
        payload,
        response_status: response_status || undefined,
        response_body: response_body || undefined,
        error_message: error_message || undefined
      });
    }
  },

  // Conversion Events
  insertConversionEvent: {
    run: async (
      lead_id: number,
      event_type: string,
      platform: string,
      event_id: string | null,
      conversion_value: number | null,
      currency: string,
      sent_status: string,
      response_data: string | null,
      error_message: string | null,
      sent_at: string | null
    ) => {
      await jsonStorage.insertConversionEvent({
        lead_id,
        event_type,
        platform: platform as 'facebook' | 'google' | 'tiktok',
        event_id: event_id || undefined,
        conversion_value: conversion_value || undefined,
        currency,
        sent_status: sent_status as 'pending' | 'sent' | 'failed',
        response_data: response_data || undefined,
        error_message: error_message || undefined,
        sent_at: sent_at || undefined
      });
    }
  },

  getConversionEvents: {
    all: async (limit: number, offset: number) => {
      const result = await jsonStorage.getConversionEvents(limit, offset);
      return result.events;
    }
  },

  // DB instance for custom queries
  db: {
    prepare: (query: string) => ({
      get: async () => {
        // Implementar queries específicas conforme necessário
        if (query.includes('COUNT(*) as count FROM leads')) {
          const { total } = await jsonStorage.getLeads(1, 0);
          return { count: total };
        }
        return null;
      }
    })
  },

  // Dashboard stats
  getDashboardStats: async () => {
    return await jsonStorage.getDashboardStats();
  }
};

export const initDatabase = async () => {
  await jsonStorage.initialize();
};

export default jsonStorage;
