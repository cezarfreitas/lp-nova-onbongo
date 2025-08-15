/**
 * Configuração de Tracking para Produção
 * IDs fixos para garantir funcionamento no deploy
 */

export const TRACKING_CONFIG = {
  // Google Analytics 4
  GA4_MEASUREMENT_ID: "G-M440PQ5X13",
  
  // Meta Pixel (Facebook)
  META_PIXEL_ID: "1052506589717984",
  
  // URLs de produção
  PRODUCTION_DOMAIN: "lp-nova-onbongo.netlify.app",
  
  // Debug mode baseado no ambiente
  DEBUG_MODE: import.meta.env.DEV,
};

// Função para verificar se estamos em produção
export const isProduction = () => {
  return import.meta.env.PROD || window.location.hostname.includes("netlify");
};

// Função para log condicional
export const trackingLog = (message: string, data?: any) => {
  if (TRACKING_CONFIG.DEBUG_MODE) {
    console.log(`[Tracking] ${message}`, data);
  }
};

// Verificar se Meta Pixel está carregado
export const isMetaPixelLoaded = () => {
  return typeof window !== "undefined" && typeof window.fbq === "function";
};

// Verificar se GA4 está carregado
export const isGA4Loaded = () => {
  return typeof window !== "undefined" && typeof window.gtag === "function";
};
