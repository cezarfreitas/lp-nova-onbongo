// Usar JSON storage como alternativa mais compatível
export { statements, initDatabase } from './adapter.js';
export { default as db } from './json-storage.js';

// Criar diretório data se não existir
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const dbPath = join(dataDir, 'onbongo.sqlite');
const db = new Database(dbPath);

// Habilitar WAL mode para melhor performance
db.pragma('journal_mode = WAL');

// Criar tabelas
const createTables = () => {
  // Tabela de leads
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_completo TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      tipo_cadastro TEXT NOT NULL CHECK(tipo_cadastro IN ('lojista', 'consumidor')),
      cnpj TEXT,
      ip_address TEXT,
      user_agent TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_content TEXT,
      utm_term TEXT,
      referrer TEXT,
      browser_id TEXT,
      session_id TEXT,
      conversion_sent BOOLEAN DEFAULT FALSE,
      webhook_sent BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de configurações
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de usuários admin
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de logs de webhook
  db.exec(`
    CREATE TABLE IF NOT EXISTS webhook_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER,
      endpoint TEXT NOT NULL,
      method TEXT DEFAULT 'POST',
      payload TEXT,
      response_status INTEGER,
      response_body TEXT,
      error_message TEXT,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads (id)
    )
  `);

  // Tabela de eventos de conversão
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversion_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER,
      event_type TEXT NOT NULL,
      platform TEXT NOT NULL CHECK(platform IN ('facebook', 'google', 'tiktok')),
      event_id TEXT,
      conversion_value DECIMAL(10,2),
      currency TEXT DEFAULT 'BRL',
      sent_status TEXT DEFAULT 'pending' CHECK(sent_status IN ('pending', 'sent', 'failed')),
      response_data TEXT,
      error_message TEXT,
      sent_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads (id)
    )
  `);

  console.log('✅ Tabelas criadas com sucesso');
};

// Inserir configurações padrão
const insertDefaultSettings = () => {
  const settings = [
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
  ];

  const insertSetting = db.prepare(`
    INSERT OR IGNORE INTO settings (key, value, description) 
    VALUES (?, ?, ?)
  `);

  for (const setting of settings) {
    insertSetting.run(setting.key, setting.value, setting.description);
  }

  console.log('✅ Configurações padrão inseridas');
};

// Criar usuário admin padrão
const createDefaultAdmin = () => {
  const bcrypt = require('bcryptjs');
  const defaultPassword = 'onbongo2024!';
  const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

  const insertAdmin = db.prepare(`
    INSERT OR IGNORE INTO admin_users (username, password_hash, email) 
    VALUES (?, ?, ?)
  `);

  insertAdmin.run('admin', hashedPassword, 'admin@onbongo.com.br');
  
  console.log('✅ Usuário admin criado (admin / onbongo2024!)');
};

// Inicializar banco
const initDatabase = () => {
  createTables();
  insertDefaultSettings();
  createDefaultAdmin();
};

// Prepared statements para performance
const statements = {
  // Leads
  insertLead: db.prepare(`
    INSERT INTO leads (
      nome_completo, whatsapp, tipo_cadastro, cnpj, 
      ip_address, user_agent, utm_source, utm_medium, 
      utm_campaign, utm_content, utm_term, referrer, 
      browser_id, session_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  getLeads: db.prepare(`
    SELECT * FROM leads 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `),
  
  getLeadById: db.prepare('SELECT * FROM leads WHERE id = ?'),
  
  updateLeadWebhookStatus: db.prepare(`
    UPDATE leads 
    SET webhook_sent = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `),
  
  updateLeadConversionStatus: db.prepare(`
    UPDATE leads 
    SET conversion_sent = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `),

  // Settings
  getSetting: db.prepare('SELECT value FROM settings WHERE key = ?'),
  setSetting: db.prepare(`
    INSERT OR REPLACE INTO settings (key, value, updated_at) 
    VALUES (?, ?, CURRENT_TIMESTAMP)
  `),
  getAllSettings: db.prepare('SELECT key, value, description FROM settings ORDER BY key'),

  // Admin users
  getAdminByUsername: db.prepare('SELECT * FROM admin_users WHERE username = ? AND is_active = TRUE'),
  updateLastLogin: db.prepare(`
    UPDATE admin_users 
    SET last_login = CURRENT_TIMESTAMP 
    WHERE id = ?
  `),

  // Webhook logs
  insertWebhookLog: db.prepare(`
    INSERT INTO webhook_logs (
      lead_id, endpoint, method, payload, 
      response_status, response_body, error_message
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `),

  // Conversion events
  insertConversionEvent: db.prepare(`
    INSERT INTO conversion_events (
      lead_id, event_type, platform, event_id, 
      conversion_value, currency, sent_status, 
      response_data, error_message, sent_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getConversionEvents: db.prepare(`
    SELECT ce.*, l.nome_completo, l.whatsapp 
    FROM conversion_events ce 
    LEFT JOIN leads l ON ce.lead_id = l.id 
    ORDER BY ce.created_at DESC 
    LIMIT ? OFFSET ?
  `)
};

export { db, statements, initDatabase };
export default db;
