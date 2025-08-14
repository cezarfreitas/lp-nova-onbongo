import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { statements } from '../database/index.js';
import { AdminUser, Setting, ApiResponse } from '../types/index.js';
import { z } from 'zod';
import webhookService from '../services/webhook.js';
import conversionsService from '../services/conversions.js';

const router = Router();

// Chave secreta JWT (em produção usar variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'onbongo-admin-secret-2024';

// Schema de validação para login
const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

// Schema de validação para configurações
const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string()
});

// Middleware de autenticação
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token de acesso requerido'
    } as ApiResponse);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Token inválido'
      } as ApiResponse);
    }
    req.user = user;
    next();
  });
};

// POST /api/admin/login - Autenticação
router.post('/login', async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Dados de login inválidos'
      } as ApiResponse);
    }

    const { username, password } = validation.data;
    
    // Buscar usuário no banco
    const user = await statements.getAdminByUsername.get(username) as AdminUser;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      } as ApiResponse);
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash!);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inv��lidas'
      } as ApiResponse);
    }

    // Atualizar último login
    await statements.updateLastLogin.run(user.id!);

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remover senha do retorno
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'Login realizado com sucesso'
    } as ApiResponse);

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

// GET /api/admin/me - Verificar token e dados do usuário
router.get('/me', authenticateToken, async (req: any, res) => {
  try {
    const user = await statements.getAdminByUsername.get(req.user.username) as AdminUser;
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      } as ApiResponse);
    }

    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    } as ApiResponse<Partial<AdminUser>>);

  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

// GET /api/admin/settings - Listar todas as configurações
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const settings = await statements.getAllSettings.all() as Setting[];

    res.json({
      success: true,
      data: settings
    } as ApiResponse<Setting[]>);

  } catch (error) {
    console.error('Erro ao listar configurações:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

// POST /api/admin/settings - Atualizar configuração
router.post('/settings', authenticateToken, async (req, res) => {
  try {
    const validation = settingSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Dados da configuração inválidos'
      } as ApiResponse);
    }

    const { key, value } = validation.data;

    // Atualizar configuração
    await statements.setSetting.run(key, value);

    res.json({
      success: true,
      message: 'Configuração atualizada com sucesso'
    } as ApiResponse);

  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

// POST /api/admin/settings/bulk - Atualizar múltiplas configurações
router.post('/settings/bulk', authenticateToken, (req, res) => {
  try {
    const settings = req.body.settings;
    
    if (!Array.isArray(settings)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de dados inválido'
      } as ApiResponse);
    }

    // Validar todas as configurações
    for (const setting of settings) {
      const validation = settingSchema.safeParse(setting);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: `Configuração inválida: ${setting.key}`
        } as ApiResponse);
      }
    }

    // Atualizar todas as configurações
    for (const setting of settings) {
      statements.setSetting.run(setting.key, setting.value);
    }

    res.json({
      success: true,
      message: `${settings.length} configurações atualizadas com sucesso`
    } as ApiResponse);

  } catch (error) {
    console.error('Erro ao atualizar configurações em lote:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

// GET /api/admin/dashboard - Estatísticas do dashboard
router.get('/dashboard', authenticateToken, (req, res) => {
  try {
    // Buscar estatísticas básicas
    const totalLeads = statements.db.prepare('SELECT COUNT(*) as count FROM leads').get() as any;
    const leadsHoje = statements.db.prepare(`
      SELECT COUNT(*) as count FROM leads 
      WHERE DATE(created_at) = DATE('now')
    `).get() as any;
    
    const leadsPorTipo = statements.db.prepare(`
      SELECT tipo_cadastro, COUNT(*) as count 
      FROM leads 
      GROUP BY tipo_cadastro
    `).all() as any[];

    const leadsUltimos7Dias = statements.db.prepare(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM leads 
      WHERE created_at >= DATE('now', '-7 days') 
      GROUP BY DATE(created_at) 
      ORDER BY date
    `).all() as any[];

    const conversionRate = statements.db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM leads WHERE tipo_cadastro = 'lojista') * 100.0 / 
        (SELECT COUNT(*) FROM leads) as rate
    `).get() as any;

    const webhookStats = statements.db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN webhook_sent = 1 THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN conversion_sent = 1 THEN 1 ELSE 0 END) as conversions_sent
      FROM leads
    `).get() as any;

    const dashboard = {
      stats: {
        totalLeads: totalLeads.count || 0,
        leadsHoje: leadsHoje.count || 0,
        conversionRate: parseFloat((conversionRate?.rate || 0).toFixed(2)),
        webhookSuccessRate: webhookStats.total > 0 ? 
          parseFloat(((webhookStats.sent / webhookStats.total) * 100).toFixed(2)) : 0,
        conversionsSuccessRate: webhookStats.total > 0 ? 
          parseFloat(((webhookStats.conversions_sent / webhookStats.total) * 100).toFixed(2)) : 0
      },
      charts: {
        leadsPorTipo: leadsPorTipo,
        leadsUltimos7Dias: leadsUltimos7Dias
      }
    };

    res.json({
      success: true,
      data: dashboard
    } as ApiResponse);

  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

// POST /api/admin/webhook/test - Testar configuração do webhook
router.post('/webhook/test', authenticateToken, async (req, res) => {
  try {
    const result = await webhookService.testWebhook();

    res.json({
      success: result.success,
      data: result.response,
      message: result.success ? 'Webhook testado com sucesso' : 'Falha no teste do webhook',
      error: result.error
    } as ApiResponse);

  } catch (error) {
    console.error('Erro ao testar webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

// POST /api/admin/webhook/retry/:leadId - Reenviar webhook para um lead
router.post('/webhook/retry/:leadId', authenticateToken, async (req, res) => {
  try {
    const leadId = parseInt(req.params.leadId);

    if (isNaN(leadId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do lead inválido'
      } as ApiResponse);
    }

    const result = await webhookService.retryWebhook(leadId);

    res.json({
      success: result.success,
      message: result.success ? 'Webhook reenviado com sucesso' : 'Falha ao reenviar webhook',
      error: result.error
    } as ApiResponse);

  } catch (error) {
    console.error('Erro ao reenviar webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

// POST /api/admin/conversions/retry/:leadId - Reenviar conversões para um lead
router.post('/conversions/retry/:leadId', authenticateToken, async (req, res) => {
  try {
    const leadId = parseInt(req.params.leadId);

    if (isNaN(leadId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do lead inválido'
      } as ApiResponse);
    }

    const lead = statements.getLeadById.get(leadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead não encontrado'
      } as ApiResponse);
    }

    await conversionsService.sendAllConversions(lead);

    res.json({
      success: true,
      message: 'Conversões reenviadas com sucesso'
    } as ApiResponse);

  } catch (error) {
    console.error('Erro ao reenviar conversões:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

export default router;
