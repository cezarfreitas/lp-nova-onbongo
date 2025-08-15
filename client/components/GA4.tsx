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
    // Verifica se o GA4 já foi carregado
    if (window.gtag) {
      return;
    }

    // Inicializa o dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: any[]) {
      window.dataLayer.push(args);
    };

    // Configuração inicial
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Carrega o script do Google Analytics
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Cleanup
    return () => {
      // Remove o script quando o componente for desmontado
      const existingScript = document.querySelector(`script[src*="${measurementId}"]`);
      if (existingScript) {
        existingScript.remove();
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
    if (window.gtag) {
      window.gtag("event", eventName, {
        send_to: measurementId,
        ...parameters,
      });
    }
  };

  const trackPageView = (pagePath?: string, pageTitle?: string) => {
    if (window.gtag) {
      window.gtag("config", measurementId, {
        page_path: pagePath || window.location.pathname,
        page_title: pageTitle || document.title,
      });
    }
  };

  const trackConversion = (conversionId: string, value?: number, currency = "BRL") => {
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: `${measurementId}/${conversionId}`,
        value: value,
        currency: currency,
      });
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackConversion,
  };
};
