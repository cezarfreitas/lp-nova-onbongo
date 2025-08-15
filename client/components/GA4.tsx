import { useEffect } from "react";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface GA4Props {
  measurementId: string;
}

export default function GA4({ measurementId }: GA4Props) {
  useEffect(() => {
    if (!measurementId || measurementId === "G-XXXXXXXXXX") {
      console.warn("[GA4] Measurement ID não configurado");
      return;
    }

    // Verifica se o GA4 já foi carregado para este ID
    if (window.gtag && document.querySelector(`script[src*="${measurementId}"]`)) {
      console.log("[GA4] Já carregado para:", measurementId);
      return;
    }

    console.log("[GA4] Inicializando GA4 com ID:", measurementId);

    // Inicializa o dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(args);
    };

    // Configuração inicial com debug
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      debug_mode: import.meta.env.DEV,
      send_page_view: true,
    });

    // Carrega o script do Google Analytics
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    
    script.onload = () => {
      console.log("[GA4] Script carregado com sucesso");
      // Envia page_view inicial
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
      });
    };
    
    script.onerror = () => {
      console.error("[GA4] Erro ao carregar script do GA4");
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      const existingScript = document.querySelector(`script[src*="${measurementId}"]`);
      if (existingScript) {
        existingScript.remove();
        console.log("[GA4] Script removido");
      }
    };
  }, [measurementId]);

  return null;
}

// Hook para tracking de eventos
export const useGA4 = (measurementId: string) => {
  const trackEvent = (
    eventName: string,
    parameters?: {
      event_category?: string;
      event_label?: string;
      value?: number;
      [key: string]: any;
    }
  ) => {
    if (!measurementId || measurementId === "G-XXXXXXXXXX") {
      console.warn("[GA4] Measurement ID não configurado para evento:", eventName);
      return;
    }

    if (window.gtag) {
      const eventData = {
        send_to: measurementId,
        ...parameters,
      };
      
      console.log(`[GA4] Enviando evento: ${eventName}`, eventData);
      window.gtag("event", eventName, eventData);
    } else {
      console.warn("[GA4] gtag não disponível para evento:", eventName);
    }
  };

  const trackPageView = (pagePath?: string, pageTitle?: string) => {
    if (!measurementId) return;

    if (window.gtag) {
      window.gtag("config", measurementId, {
        page_path: pagePath || window.location.pathname,
        page_title: pageTitle || document.title,
      });
      console.log("[GA4] Page view enviado:", pagePath || window.location.pathname);
    }
  };

  const trackConversion = (conversionId: string, value?: number, currency = "BRL") => {
    if (!measurementId) return;

    if (window.gtag) {
      const conversionData = {
        send_to: `${measurementId}/${conversionId}`,
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
