/**
 * Configuração do Google Analytics 4
 * ID: G-GSDX6XV3V6 (carregado diretamente no HTML)
 */

// Função para logging em desenvolvimento
export const logGA4Event = (eventName: string, parameters?: any) => {
  if (import.meta.env.DEV) {
    console.log(`[GA4] Event: ${eventName}`, parameters);
  }
};

// Verificar se gtag está disponível
export const isGA4Available = () => {
  return typeof window !== "undefined" && typeof window.gtag === "function";
};
