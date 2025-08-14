import { promises as fs } from 'fs';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import bcrypt from 'bcryptjs';
import { Lead, Setting, AdminUser, WebhookLog, ConversionEvent } from '../types/index.js';

// Criar diretório data se não existir
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const dbPath = join(dataDir, 'onbongo.json');

interface JsonDatabase {
  leads: Lead[];
  settings: Setting[];
  admin_users: AdminUser[];
  webhook_logs: WebhookLog[];
  conversion_events: ConversionEvent[];
  counters: {
    leads: number;
    admin_users: number;
    webhook_logs: number;
    conversion_events: number;
  };
}

// Estrutura inicial do banco
const defaultDb: JsonDatabase = {
  leads: [],
  settings: [
    // Google Analytics
    { key: 'ga4_measurement_id', value: '', description: 'Google Analytics 4 Measurement ID (G-XXXXXXX)' },
    
    // Meta/Facebook
    { key: 'meta_pixel_id', value: '', description: 'Meta Pixel ID' },
    { key: 'meta_access_token', value: '', description: 'Meta Conversions API Access Token' },
    { key: 'meta_test_event_code', value: '', description: 'Meta Test Event Code para desenvolvimento' },
    
    // TikTok
    { key: 'tiktok_pixel_id', value: '', description: 'TikTok Pixel ID' },
    { key: 'tiktok_access_token', value: '', description: 'TikTok Events API Access Token' },
    { key: 'tiktok_test_event_code', value: '', description: 'TikTok Test Event Code' },
    
    // Webhook
    { key: 'webhook_endpoint', value: '', description: 'Endpoint para envio de leads' },
    { key: 'webhook_method', value: 'POST', description: 'Método HTTP para webhook' },
    { key: 'webhook_headers', value: '{}', description: 'Headers personalizados em JSON' },
    { key: 'webhook_auth_token', value: '', description: 'Token de autenticação para webhook' },
    
    // Configurações gerais
    { key: 'site_domain', value: 'b2b.onbongo.com.br', description: 'Domínio do site para tracking' },
    { key: 'conversion_value', value: '50.00', description: 'Valor padrão de conversão em BRL' },
    { key: 'auto_send_conversions', value: 'true', description: 'Enviar conversões automaticamente' },
    { key: 'auto_send_webhook', value: 'true', description: 'Enviar webhook automaticamente' }
  ],
  admin_users: [],
  webhook_logs: [],
  conversion_events: [],
  counters: {
    leads: 0,
    admin_users: 0,
    webhook_logs: 0,
    conversion_events: 0
  }
};

class JsonStorage {
  private data: JsonDatabase = defaultDb;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      if (existsSync(dbPath)) {
        const fileContent = await fs.readFile(dbPath, 'utf8');
        this.data = { ...defaultDb, ...JSON.parse(fileContent) };
      } else {
        await this.createDefaultAdmin();
        await this.save();
      }
      
      this.isInitialized = true;
      console.log('✅ JSON Storage inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar JSON Storage:', error);
      this.data = defaultDb;
      await this.createDefaultAdmin();
    }
  }

  private async createDefaultAdmin() {
    const hashedPassword = bcrypt.hashSync('onbongo2024!', 10);
    this.data.admin_users = [{
      id: 1,
      username: 'admin',
      password_hash: hashedPassword,
      email: 'admin@onbongo.com.br',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }];
    this.data.counters.admin_users = 1;
    console.log('✅ Usuário admin criado (admin / onbongo2024!)');
  }

  private async save() {
    try {
      await fs.writeFile(dbPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (error) {
      console.error('❌ Erro ao salvar dados:', error);
    }
  }

  // Leads
  async insertLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
    await this.initialize();
    
    const newLead: Lead = {
      ...lead,
      id: ++this.data.counters.leads,
      conversion_sent: false,
      webhook_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.leads.push(newLead);
    await this.save();
    
    return newLead;
  }

  async getLeads(limit = 20, offset = 0): Promise<{ leads: Lead[]; total: number }> {
    await this.initialize();
    
    const total = this.data.leads.length;
    const leads = this.data.leads
      .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
      .slice(offset, offset + limit);

    return { leads, total };
  }

  async getLeadById(id: number): Promise<Lead | null> {
    await this.initialize();
    return this.data.leads.find(lead => lead.id === id) || null;
  }

  async updateLeadWebhookStatus(id: number, sent: boolean): Promise<void> {
    await this.initialize();
    const lead = this.data.leads.find(l => l.id === id);
    if (lead) {
      lead.webhook_sent = sent;
      lead.updated_at = new Date().toISOString();
      await this.save();
    }
  }

  async updateLeadConversionStatus(id: number, sent: boolean): Promise<void> {
    await this.initialize();
    const lead = this.data.leads.find(l => l.id === id);
    if (lead) {
      lead.conversion_sent = sent;
      lead.updated_at = new Date().toISOString();
      await this.save();
    }
  }

  // Settings
  async getSetting(key: string): Promise<string | null> {
    await this.initialize();
    const setting = this.data.settings.find(s => s.key === key);
    return setting?.value || null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    await this.initialize();
    const existingSetting = this.data.settings.find(s => s.key === key);
    
    if (existingSetting) {
      existingSetting.value = value;
    } else {
      this.data.settings.push({ key, value, description: '' });
    }
    
    await this.save();
  }

  async getAllSettings(): Promise<Setting[]> {
    await this.initialize();
    return [...this.data.settings];
  }

  // Admin Users
  async getAdminByUsername(username: string): Promise<AdminUser | null> {
    await this.initialize();
    return this.data.admin_users.find(u => u.username === username && u.is_active) || null;
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.initialize();
    const user = this.data.admin_users.find(u => u.id === id);
    if (user) {
      user.last_login = new Date().toISOString();
      await this.save();
    }
  }

  // Webhook Logs
  async insertWebhookLog(log: Omit<WebhookLog, 'id' | 'sent_at'>): Promise<void> {
    await this.initialize();
    
    const newLog: WebhookLog = {
      ...log,
      id: ++this.data.counters.webhook_logs,
      sent_at: new Date().toISOString()
    };

    this.data.webhook_logs.push(newLog);
    await this.save();
  }

  // Conversion Events
  async insertConversionEvent(event: Omit<ConversionEvent, 'id' | 'created_at'>): Promise<void> {
    await this.initialize();
    
    const newEvent: ConversionEvent = {
      ...event,
      id: ++this.data.counters.conversion_events,
      created_at: new Date().toISOString()
    };

    this.data.conversion_events.push(newEvent);
    await this.save();
  }

  async getConversionEvents(limit = 20, offset = 0) {
    await this.initialize();
    
    const total = this.data.conversion_events.length;
    const events = this.data.conversion_events
      .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
      .slice(offset, offset + limit)
      .map(event => {
        const lead = this.data.leads.find(l => l.id === event.lead_id);
        return {
          ...event,
          nome_completo: lead?.nome_completo,
          whatsapp: lead?.whatsapp
        };
      });

    return { events, total };
  }

  // Dashboard Stats
  async getDashboardStats() {
    await this.initialize();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const totalLeads = this.data.leads.length;
    const leadsHoje = this.data.leads.filter(lead => 
      new Date(lead.created_at!) >= today
    ).length;
    
    const lojistas = this.data.leads.filter(lead => lead.tipo_cadastro === 'lojista').length;
    const conversionRate = totalLeads > 0 ? (lojistas / totalLeads) * 100 : 0;
    
    const webhooksSent = this.data.leads.filter(lead => lead.webhook_sent).length;
    const webhookSuccessRate = totalLeads > 0 ? (webhooksSent / totalLeads) * 100 : 0;
    
    const conversionsSent = this.data.leads.filter(lead => lead.conversion_sent).length;
    const conversionsSuccessRate = totalLeads > 0 ? (conversionsSent / totalLeads) * 100 : 0;

    return {
      totalLeads,
      leadsHoje,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      webhookSuccessRate: parseFloat(webhookSuccessRate.toFixed(2)),
      conversionsSuccessRate: parseFloat(conversionsSuccessRate.toFixed(2))
    };
  }
}

export const jsonStorage = new JsonStorage();
export default jsonStorage;
