interface WebhookData {
  nome: string;
  whatsapp: string;
  tipoCadastro: "lojista" | "consumidor";
  cnpj: string;
  timestamp: string;
  source: string;
  url: string;
}

interface WebhookOptions {
  retries?: number;
  timeout?: number;
  retryDelay?: number;
}

export async function sendToWebhook(
  data: WebhookData,
  options: WebhookOptions = {}
): Promise<boolean> {
  const {
    retries = 3,
    timeout = 10000,
    retryDelay = 1000
  } = options;

  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.log("⚠️ Webhook não configurado (VITE_WEBHOOK_URL)");
    return false;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📤 Tentativa ${attempt}/${retries} - Enviando para webhook:`, webhookUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          ...data,
          attempt,
          user_agent: navigator.userAgent,
          referrer: document.referrer || "direct"
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log("✅ Dados enviados para webhook com sucesso");
        console.log("📊 Response:", response.status, response.statusText);
        
        // Try to log response body if available
        try {
          const responseText = await response.text();
          if (responseText) {
            console.log("📄 Response body:", responseText);
          }
        } catch (e) {
          // Ignore response body parsing errors
        }
        
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error(`❌ Tentativa ${attempt}/${retries} falhou:`, error.message);
      
      if (attempt === retries) {
        console.error("❌ Todas as tentativas de webhook falharam");
        return false;
      }
      
      // Wait before retry
      if (attempt < retries) {
        console.log(`⏳ Aguardando ${retryDelay}ms antes da próxima tentativa...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  return false;
}

export function validateWebhookUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
  } catch {
    return false;
  }
}

export function formatLeadDataForWebhook(formData: {
  nomeCompleto: string;
  whatsapp: string;
  tipoCadastro: "lojista" | "consumidor";
  cnpj: string;
}): WebhookData {
  return {
    nome: formData.nomeCompleto.trim(),
    whatsapp: formData.whatsapp.replace(/\D/g, ""), // Remove formatting
    tipoCadastro: formData.tipoCadastro,
    cnpj: formData.cnpj.replace(/\D/g, "") || "N/A", // Remove formatting
    timestamp: new Date().toISOString(),
    source: "ONBONGO_B2B_Landing",
    url: window.location.href
  };
}
