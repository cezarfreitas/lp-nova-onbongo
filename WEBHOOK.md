# Configuração do Webhook - ONBONGO B2B

Este documento explica como configurar o webhook para receber os dados dos leads do formulário de cadastro.

## Configuração

### 1. Variável de Ambiente

Adicione a URL do seu webhook no arquivo `.env.production` ou `.env.local`:

```bash
VITE_WEBHOOK_URL=https://sua-api.com/webhook/leads
```

### 2. Formato dos Dados Enviados

O webhook receberá um POST com os seguintes dados em JSON:

```json
{
  "nome": "João Silva",
  "whatsapp": "11999999999",
  "tipoCadastro": "lojista",
  "cnpj": "12345678000199",
  "timestamp": "2024-01-20T15:30:45.123Z",
  "source": "ONBONGO_B2B_Landing",
  "url": "http://b2b.onbongo.com.br",
  "attempt": 1,
  "user_agent": "Mozilla/5.0...",
  "referrer": "https://google.com"
}
```

### 3. Campos dos Dados

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | string | Nome completo do lead |
| `whatsapp` | string | Número do WhatsApp (apenas números) |
| `tipoCadastro` | string | "lojista" ou "consumidor" |
| `cnpj` | string | CNPJ (apenas números) ou "N/A" |
| `timestamp` | string | Data/hora do envio (ISO 8601) |
| `source` | string | Sempre "ONBONGO_B2B_Landing" |
| `url` | string | URL da página onde foi enviado |
| `attempt` | number | Número da tentativa (1-3) |
| `user_agent` | string | User Agent do navegador |
| `referrer` | string | Página de origem do usuário |

## Implementação do Webhook

### Headers da Requisição

```
Content-Type: application/json
Accept: application/json
```

### Exemplo de Endpoint (Node.js/Express)

```javascript
app.post('/webhook/leads', express.json(), (req, res) => {
  const {
    nome,
    whatsapp,
    tipoCadastro,
    cnpj,
    timestamp,
    source,
    url
  } = req.body;

  console.log('Novo lead recebido:', {
    nome,
    whatsapp,
    tipoCadastro,
    timestamp
  });

  // Processar o lead aqui
  // - Salvar no banco de dados
  // - Enviar notificação
  // - Integrar com CRM
  // etc.

  res.status(200).json({
    success: true,
    message: 'Lead recebido com sucesso'
  });
});
```

### Exemplo de Endpoint (PHP)

```php
<?php
header('Content-Type: application/json');

// Verificar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

// Ler dados JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    exit(json_encode(['error' => 'Invalid JSON']));
}

// Processar lead
$nome = $data['nome'] ?? '';
$whatsapp = $data['whatsapp'] ?? '';
$tipoCadastro = $data['tipoCadastro'] ?? '';
$cnpj = $data['cnpj'] ?? '';
$timestamp = $data['timestamp'] ?? '';

// Salvar no banco, enviar email, etc.
error_log("Novo lead: $nome ($tipoCadastro)");

// Resposta de sucesso
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Lead recebido com sucesso'
]);
?>
```

## Características do Sistema

### Retry Logic
- **3 tentativas** automáticas em caso de falha
- **Delay de 1 segundo** entre tentativas
- **Timeout de 10 segundos** por tentativa

### Tratamento de Erros
- Falhas no webhook **não impedem** o funcionamento do formulário
- Logs detalhados no console do navegador
- Tracking continua funcionando mesmo se webhook falhar

### Segurança
- Apenas HTTPS e HTTP são aceitos
- Dados são validados antes do envio
- Números de telefone e CNPJ são limpos (apenas números)

## Testando o Webhook

### 1. Webhook.site (Teste Simples)
```bash
VITE_WEBHOOK_URL=https://webhook.site/seu-id-unico
```

### 2. RequestBin
```bash
VITE_WEBHOOK_URL=https://requestbin.com/seu-endpoint
```

### 3. Ngrok (Desenvolvimento Local)
```bash
# Terminal 1
ngrok http 3000

# Terminal 2 (.env.local)
VITE_WEBHOOK_URL=https://abc123.ngrok.io/webhook/leads
```

## Monitoramento

### Logs do Console
O sistema gera logs detalhados no console do navegador:

```
📤 Tentativa 1/3 - Enviando para webhook: https://api.exemplo.com/leads
✅ Dados enviados para webhook com sucesso
📊 Response: 200 OK
📄 Response body: {"success":true,"id":"lead_123"}
```

### Debugging
Para debug adicional, monitore:
- Network tab do DevTools
- Console logs do navegador
- Logs do seu servidor webhook
- Status codes HTTP retornados

## Troubleshooting

### Webhook não está sendo chamado
1. Verifique se `VITE_WEBHOOK_URL` está definida
2. Confirme que a URL é válida (https://)
3. Verifique se o formulário está sendo enviado com sucesso

### Erro 404/500 no webhook
1. Confirme que o endpoint existe
2. Verifique se o método POST é aceito
3. Teste o endpoint manualmente com curl/Postman

### Timeout do webhook
1. Verifique a performance do seu servidor
2. Considere aumentar o timeout (padrão: 10s)
3. Otimize o processamento do webhook

## Exemplo de Integração com CRM

```javascript
// Exemplo de integração com HubSpot
app.post('/webhook/leads', async (req, res) => {
  const leadData = req.body;
  
  try {
    // Enviar para HubSpot
    await fetch('https://api.hubapi.com/contacts/v1/contact', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: [
          { property: 'firstname', value: leadData.nome.split(' ')[0] },
          { property: 'lastname', value: leadData.nome.split(' ').slice(1).join(' ') },
          { property: 'phone', value: leadData.whatsapp },
          { property: 'company', value: leadData.cnpj !== 'N/A' ? leadData.cnpj : '' },
          { property: 'lead_source', value: 'ONBONGO_B2B_Landing' }
        ]
      })
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao enviar para CRM:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});
```
