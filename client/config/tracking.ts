/**
 * Configuração de Tracking para Produção
 * IDs fixos para garantir funcionamento no deploy
 */

export const TRACKING_CONFIG = {
  // Google Analytics 4
  GA4_MEASUREMENT_ID: "G-M440PQ5X13",

  // Meta Pixel (Facebook)
  META_PIXEL_ID: "1052506589717984",

  // Meta Conversions API
  META_ACCESS_TOKEN: import.meta.env.VITE_META_ACCESS_TOKEN || "EAAJpULqxTvgBPGJbYivJPcAoTwcrMwoyCJPBRYHC1rom6R34EwZAtTijZAF3aHiriR1as5ZAg4vqberKEqlFdUBBlITdR6wGQvRutHoRZAv6COVBnPaSO9LxtVsM2zEpfOs0Fmq2Ay5QqAwwCMWI1RZBFkLM8gTjl4Vqavmgh2HsqmRs4Ins6uOTtLZCiWdQZDZD",
  META_TEST_EVENT_CODE: import.meta.env.VITE_META_TEST_EVENT_CODE || "TEST8508",

  // URLs de produção
  PRODUCTION_DOMAIN: "lp-nova-onbongo.netlify.app",

  // Debug mode baseado no ambiente
  DEBUG_MODE: import.meta.env.DEV,
};

// Função para verificar se estamos em produção
export const isProduction = () => {
  return import.meta.env.PROD || window.location.hostname.includes("netlify");
};

// Função para log condicional (apenas erros em produção)
export const trackingLog = (message: string, data?: any) => {
  // Removido para produção
};

// Verificar se Meta Pixel está carregado
export const isMetaPixelLoaded = () => {
  return typeof window !== "undefined" && typeof window.fbq === "function";
};

// Verificar se GA4 está carregado
export const isGA4Loaded = () => {
  return typeof window !== "undefined" && typeof window.gtag === "function";
};
