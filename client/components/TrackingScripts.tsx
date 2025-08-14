import { useEffect, useState } from 'react';

interface TrackingConfig {
  ga4_measurement_id?: string;
  meta_pixel_id?: string;
  meta_test_event_code?: string;
  tiktok_pixel_id?: string;
}

// Declarar tipos para as funções globais
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
    ttq: (...args: any[]) => void;
  }
}

export default function TrackingScripts() {
  const [config, setConfig] = useState<TrackingConfig>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTrackingConfig();
  }, []);

  useEffect(() => {
    if (isLoaded && Object.keys(config).length > 0) {
      initializeTracking();
    }
  }, [config, isLoaded]);

  const loadTrackingConfig = async () => {
    try {
      // Carregar configurações do localStorage ou da API
      const savedConfig = localStorage.getItem('tracking_config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      } else {
        // Carregar da API pública (sem autenticação)
        const response = await fetch('/api/tracking/config');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setConfig(data.data);
            localStorage.setItem('tracking_config', JSON.stringify(data.data));
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de tracking:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const initializeTracking = () => {
    // Inicializar Google Analytics 4
    if (config.ga4_measurement_id) {
      initGA4(config.ga4_measurement_id);
    }

    // Inicializar Meta Pixel
    if (config.meta_pixel_id) {
      initMetaPixel(config.meta_pixel_id);
    }

    // Inicializar TikTok Pixel
    if (config.tiktok_pixel_id) {
      initTikTokPixel(config.tiktok_pixel_id);
    }
  };

  const initGA4 = (measurementId: string) => {
    // Carregar script do GA4
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    // Inicializar dataLayer e gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true
    });

    console.log('✅ Google Analytics 4 inicializado:', measurementId);
  };

  const initMetaPixel = (pixelId: string) => {
    // Carregar script do Meta Pixel
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');

      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // Adicionar noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <img height="1" width="1" style="display:none"
           src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />
    `;
    document.head.appendChild(noscript);

    console.log('✅ Meta Pixel inicializado:', pixelId);
  };

  const initTikTokPixel = (pixelId: string) => {
    // Carregar script do TikTok Pixel
    const script = document.createElement('script');
    script.innerHTML = `
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};

        ttq.load('${pixelId}');
        ttq.page();
      }(window, document, 'ttq');
    `;
    document.head.appendChild(script);

    console.log('✅ TikTok Pixel inicializado:', pixelId);
  };

  return null; // Este componente não renderiza nada
}

// Funções utilitárias para tracking
export const trackEvent = {
  // Google Analytics 4
  ga4: (eventName: string, parameters: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
      console.log('🔍 GA4 Event:', eventName, parameters);
    }
  },

  // Meta Pixel
  meta: (eventName: string, parameters: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, parameters);
      console.log('📘 Meta Event:', eventName, parameters);
    }
  },

  // TikTok Pixel
  tiktok: (eventName: string, parameters: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track(eventName, parameters);
      console.log('🎵 TikTok Event:', eventName, parameters);
    }
  },

  // Enviar para todas as plataformas
  all: (eventName: string, parameters: Record<string, any> = {}) => {
    trackEvent.ga4(eventName, parameters);
    trackEvent.meta(eventName, parameters);
    trackEvent.tiktok(eventName, parameters);
  }
};

// Eventos específicos para o funil de conversão
export const conversionEvents = {
  pageView: (page: string) => {
    trackEvent.all('page_view', { page_title: page });
  },

  formStart: () => {
    trackEvent.all('form_start', { 
      event_category: 'engagement',
      content_name: 'lead_form' 
    });
  },

  formStep: (step: number) => {
    trackEvent.all('form_step', { 
      event_category: 'engagement',
      content_name: 'lead_form',
      step_number: step
    });
  },

  leadGenerated: (leadType: 'lojista' | 'consumidor', value: number = 50) => {
    const eventData = {
      event_category: 'conversion',
      content_name: 'lead_generation',
      content_category: leadType,
      value: value,
      currency: 'BRL'
    };

    trackEvent.ga4('generate_lead', eventData);
    trackEvent.meta('Lead', eventData);
    trackEvent.tiktok('SubmitForm', eventData);
  },

  couponGenerated: () => {
    trackEvent.all('coupon_generated', { 
      event_category: 'engagement',
      content_name: 'discount_coupon',
      value: 10,
      currency: 'BRL'
    });
  }
};
