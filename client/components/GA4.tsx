// GA4 agora é carregado diretamente no HTML
// Este arquivo mantém apenas o hook para tracking de eventos

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Hook para tracking de eventos GA4
export const useGA4 = () => {
  const trackEvent = (
    eventName: string,
    parameters?: {
      event_category?: string;
      event_label?: string;
      value?: number;
      [key: string]: any;
    }
  ) => {
    if (window.gtag) {
      const eventData = {
        ...parameters,
      };
      
      console.log(`[GA4] Enviando evento: ${eventName}`, eventData);
      window.gtag("event", eventName, eventData);
    } else {
      console.warn("[GA4] gtag não disponível para evento:", eventName);
    }
  };

  const trackPageView = (pagePath?: string, pageTitle?: string) => {
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: pagePath || window.location.pathname,
        page_title: pageTitle || document.title,
      });
      console.log("[GA4] Page view enviado:", pagePath || window.location.pathname);
    }
  };

  const trackConversion = (conversionId: string, value?: number, currency = "BRL") => {
    if (window.gtag) {
      const conversionData = {
        send_to: conversionId,
        value: value,
        currency: currency,
      };
      
      console.log("[GA4] Conversão enviada:", conversionData);
      window.gtag("event", "conversion", conversionData);
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackConversion,
  };
};
