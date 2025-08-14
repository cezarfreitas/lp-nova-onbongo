import { Router } from 'express';
import { statements } from '../database/index.js';
import { Lead, ApiResponse, PaginatedResponse, TrackingData } from '../types/index.js';
import { z } from 'zod';
import crypto from 'crypto';

const router = Router();

// Schema de validação para lead
const leadSchema = z.object({
  nome_completo: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  tipo_cadastro: z.enum(['lojista', 'consumidor']),
  cnpj: z.string().optional(),
  tracking: z.object({
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_content: z.string().optional(),
    utm_term: z.string().optional(),
    referrer: z.string().optional(),
    browser_id: z.string().optional(),
    session_id: z.string().optional(),
  }).optional()
});

// Função para gerar ID único do browser
const generateBrowserId = (): string => {
  return crypto.randomUUID();
};

// Função para extrair IP do request
const getClientIP = (req: any): string => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         req.ip || 
         'unknown';
};

// POST /api/leads - Criar novo lead
router.post('/', async (req, res) => {
  try {
    const validation = leadSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: validation.error.errors
      } as ApiResponse);
    }

    const { nome_completo, whatsapp, tipo_cadastro, cnpj, tracking } = validation.data;
    
    // Validar CNPJ obrigatório para lojistas
    if (tipo_cadastro === 'lojista' && !cnpj) {
      return res.status(400).json({
        success: false,
        error: 'CNPJ é obrigatório para lojistas'
      } as ApiResponse);
    }

    // Extrair dados de rastreamento
    const ip_address = getClientIP(req);
    const user_agent = req.headers['user-agent'] || '';
    const browser_id = tracking?.browser_id || generateBrowserId();
    const session_id = tracking?.session_id || crypto.randomUUID();

    // Inserir lead no banco
    const result = statements.insertLead.run(
      nome_completo,
      whatsapp,
      tipo_cadastro,
      cnpj || null,
      ip_address,
      user_agent,
      tracking?.utm_source || null,
      tracking?.utm_medium || null,
      tracking?.utm_campaign || null,
      tracking?.utm_content || null,
      tracking?.utm_term || null,
      tracking?.referrer || null,
      browser_id,
      session_id
    );

    const leadId = result.lastInsertRowid as number;
    const newLead = statements.getLeadById.get(leadId) as Lead;

    // Processar conversões e webhooks assíncronos
    setImmediate(() => {
      processConversions(newLead);
      processWebhook(newLead);
    });

    res.status(201).json({
      success: true,
      data: newLead,
      message: 'Lead criado com sucesso'
    } as ApiResponse<Lead>);

  } catch (error) {
    console.error('Erro ao criar lead:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

// GET /api/leads - Listar leads com paginação
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const leads = statements.getLeads.all(limit, offset) as Lead[];
    
    // Contar total de leads
    const totalQuery = statements.db?.prepare('SELECT COUNT(*) as count FROM leads');
    const total = (totalQuery?.get() as any)?.count || 0;
    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<Lead> = {
      data: leads,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };

    res.json({
      success: true,
      data: response
    } as ApiResponse<PaginatedResponse<Lead>>);

  } catch (error) {
    console.error('Erro ao listar leads:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

// GET /api/leads/:id - Buscar lead por ID
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      } as ApiResponse);
    }

    const lead = statements.getLeadById.get(id) as Lead;

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead não encontrado'
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: lead
    } as ApiResponse<Lead>);

  } catch (error) {
    console.error('Erro ao buscar lead:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

// Função para processar conversões (será implementada posteriormente)
const processConversions = async (lead: Lead) => {
  try {
    // Buscar configurações de conversão
    const autoSend = statements.getSetting.get('auto_send_conversions')?.value === 'true';
    
    if (!autoSend) return;

    console.log(`Processing conversions for lead ${lead.id}`);
    
    // Aqui implementaremos o envio para Meta, GA4, TikTok
    // Por enquanto, apenas log
    
  } catch (error) {
    console.error('Erro ao processar conversões:', error);
  }
};

// Função para processar webhook (será implementada posteriormente)
const processWebhook = async (lead: Lead) => {
  try {
    // Buscar configurações de webhook
    const autoSend = statements.getSetting.get('auto_send_webhook')?.value === 'true';
    const endpoint = statements.getSetting.get('webhook_endpoint')?.value;
    
    if (!autoSend || !endpoint) return;

    console.log(`Processing webhook for lead ${lead.id} to ${endpoint}`);
    
    // Aqui implementaremos o envio do webhook
    // Por enquanto, apenas log
    
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
  }
};

export default router;
