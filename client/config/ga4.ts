/**
 * Configuração do Google Analytics 4
 *
 * Para configurar o GA4:
 * 1. Acesse https://analytics.google.com/
 * 2. Crie uma propriedade GA4 ou use uma existente
 * 3. Copie o Measurement ID (formato: G-XXXXXXXXXX)
 * 4. Substitua o valor abaixo pelo seu Measurement ID
 */

export const GA4_CONFIG = {
  // Measurement ID do GA4 via variável de ambiente
  measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID || "G-Q8T9ML8Q5C",

  // Configurações opcionais
  config: {
    // Anonymize IP para conformidade com LGPD/GDPR
    anonymize_ip: true,

    // Configurações de cookies
    cookie_flags: "secure;samesite=none",

    // Configurações de consentimento
    ads_data_redaction: true,

    // Configurações regionais
    country: "BR",
    currency: "BRL",
    language: "pt",
  },

  // IDs de conversão personalizadas (opcional)
  conversions: {
    lojista_signup: "lojista_signup",
    consumer_lead: "consumer_lead",
    form_completion: "form_completion",
  },
};

// Função para verificar se o GA4 está configurado
export const isGA4Configured = () => {
  return GA4_CONFIG.measurementId && GA4_CONFIG.measurementId !== "G-XXXXXXXXXX";
};

// Função para logging em desenvolvimento
export const logGA4Event = (eventName: string, parameters?: any) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[GA4] Event: ${eventName}`, parameters);
  }
};
