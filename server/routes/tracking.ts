import { Router } from 'express';
import { statements } from '../database/index.js';
import { ApiResponse } from '../types/index.js';

const router = Router();

// GET /api/tracking/config - Configurações públicas de tracking
router.get('/config', (req, res) => {
  try {
    // Buscar apenas configurações de tracking (não sensíveis)
    const trackingKeys = [
      'ga4_measurement_id',
      'meta_pixel_id',
      'tiktok_pixel_id'
    ];

    const config: Record<string, string> = {};

    for (const key of trackingKeys) {
      const setting = statements.getSetting.get(key);
      if (setting && setting.value) {
        config[key] = setting.value;
      }
    }

    res.json({
      success: true,
      data: config
    } as ApiResponse);

  } catch (error) {
    console.error('Erro ao buscar configurações de tracking:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

// POST /api/tracking/event - Receber eventos de conversão do client-side
router.post('/event', async (req, res) => {
  try {
    const { event_name, event_data, lead_id } = req.body;

    if (!event_name) {
      return res.status(400).json({
        success: false,
        error: 'Nome do evento é obrigatório'
      } as ApiResponse);
    }

    // Log do evento para debug
    console.log('📊 Tracking Event:', {
      event_name,
      event_data,
      lead_id,
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      user_agent: req.headers['user-agent']
    });

    // Aqui poderia salvar o evento em uma tabela de analytics
    // Por enquanto apenas retornar sucesso

    res.json({
      success: true,
      message: 'Evento registrado com sucesso'
    } as ApiResponse);

  } catch (error) {
    console.error('Erro ao registrar evento de tracking:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    } as ApiResponse);
  }
});

export default router;
