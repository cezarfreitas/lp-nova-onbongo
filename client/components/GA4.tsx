// Hook para tracking de eventos GA4
// ID: G-Q8T9ML8Q5C

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const useGA4 = () => {
  const trackEvent = (
    eventName: string,
    parameters?: {
      event_category?: string;
      event_label?: string;
      value?: number;
      [key: string]: any;
    },
  ) => {
    if (window.gtag) {
      window.gtag("event", eventName, parameters);
    }
  };

  const trackConversion = (
    conversionId: string,
    value?: number,
    currency = "BRL",
  ) => {
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: `G-M440PQ5X13/${conversionId}`,
        value: value,
        currency: currency,
      });
    }
  };

  return {
    trackEvent,
    trackConversion,
  };
};
