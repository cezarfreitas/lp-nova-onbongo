import { useEffect } from "react";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

export default function TrackingScripts() {
  const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;
  const META_ACCESS_TOKEN = import.meta.env.VITE_META_ACCESS_TOKEN;
  const META_TEST_EVENT_CODE = import.meta.env.VITE_META_TEST_EVENT_CODE;

  useEffect(() => {

    // Meta Pixel
    if (META_PIXEL_ID) {
      // Facebook Pixel Code
      !(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js",
      );

      window.fbq("init", META_PIXEL_ID);

      // Add test event code if provided
      if (META_TEST_EVENT_CODE) {
        window.fbq(
          "init",
          META_PIXEL_ID,
          {},
          {
            testEventCode: META_TEST_EVENT_CODE,
          },
        );
      }

      window.fbq("track", "PageView");
    }
  }, [GA4_ID, META_PIXEL_ID, META_ACCESS_TOKEN, META_TEST_EVENT_CODE]);

  // Tracking functions for conversion events
  useEffect(() => {
    // Make tracking functions available globally
    (window as any).trackLead = (leadData: any) => {
      // GA4 Event - usa o GA4 já carregado
      if (window.gtag) {
        window.gtag("event", "generate_lead", {
          event_category: "Lead",
          event_label: leadData.tipoCadastro || "unknown",
          value: leadData.tipoCadastro === "lojista" ? 100 : 10,
          currency: "BRL",
          custom_parameters: {
            lead_type: leadData.tipoCadastro,
            has_cnpj: leadData.cnpj ? "yes" : "no",
          },
        });
      }

      // Meta Pixel Event
      if (META_PIXEL_ID && window.fbq) {
        window.fbq("track", "Lead", {
          content_name: "ONBONGO B2B Registration",
          content_category: leadData.tipoCadastro || "unknown",
          value: leadData.tipoCadastro === "lojista" ? 100 : 10,
          currency: "BRL",
        });

        // Send to Conversions API
        if (META_ACCESS_TOKEN) {
          sendToConversionsAPI(leadData);
        }
      }
    };

    // Lead_Onbongo_LP tracking (Pixel + Conversions API)
    (window as any).trackLeadOnbongoLP = async (leadData: any) => {
      // Meta Pixel Custom Event
      if (META_PIXEL_ID && window.fbq) {
        window.fbq("trackCustom", "Lead_Onbongo_LP", {
          content_name: "Lojista Lead Generation",
          content_category: "B2B_Lead",
          value: 100,
          currency: "BRL",
          lead_type: leadData.tipoCadastro || "lojista",
          form_source: "onbongo_lp",
        });
        console.log("📘 Meta Pixel Lead_Onbongo_LP enviado");
      }

      // Conversions API Custom Event
      if (META_ACCESS_TOKEN && META_PIXEL_ID) {
        try {
          const eventData = {
            data: [
              {
                event_name: "Lead_Onbongo_LP",
                event_time: Math.floor(Date.now() / 1000),
                action_source: "website",
                event_source_url: window.location.href,
                user_data: {
                  em: leadData.email ? await hashString(leadData.email) : undefined,
                  ph: leadData.whatsapp ? await hashString(leadData.whatsapp) : undefined,
                  client_ip_address: await getClientIP(),
                  client_user_agent: navigator.userAgent,
                  fbc: getCookie("_fbc"),
                  fbp: getCookie("_fbp"),
                },
                custom_data: {
                  content_name: "Lojista Lead Generation",
                  content_category: "B2B_Lead",
                  value: 100,
                  currency: "BRL",
                  lead_type: leadData.tipoCadastro || "lojista",
                  form_source: "onbongo_lp",
                },
              },
            ],
            test_event_code: META_TEST_EVENT_CODE,
          };

          const response = await fetch(
            `https://graph.facebook.com/v18.0/${META_PIXEL_ID}/events`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${META_ACCESS_TOKEN}`,
              },
              body: JSON.stringify(eventData),
            },
          );

          if (response.ok) {
            console.log("✅ Conversions API Lead_Onbongo_LP enviado");
          } else {
            console.error("❌ Conversions API Lead_Onbongo_LP erro:", await response.text());
          }
        } catch (error) {
          console.error("❌ Conversions API Lead_Onbongo_LP erro:", error);
        }
      }
    };

    // Form step tracking
    (window as any).trackFormStep = (step: number, stepName: string) => {
      // GA4 Event - usa o GA4 já carregado
      if (window.gtag) {
        window.gtag("event", "form_step_completed", {
          event_category: "Form",
          event_label: stepName,
          step_number: step,
          form_name: "ONBONGO_B2B_Registration",
        });
        console.log("📊 GA4 Form step event sent:", stepName);
      }

      // Meta Pixel Event
      if (META_PIXEL_ID && window.fbq) {
        window.fbq("track", "CompleteRegistration", {
          content_name: `Registration Step ${step}`,
          status: stepName,
        });
      }
    };
  }, [GA4_ID, META_PIXEL_ID, META_ACCESS_TOKEN]);

  // Conversions API function
  const sendToConversionsAPI = async (leadData: any) => {
    try {
      const eventData = {
        data: [
          {
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: window.location.href,
            user_data: {
              em: leadData.email ? hashString(leadData.email) : undefined,
              ph: leadData.whatsapp ? hashString(leadData.whatsapp) : undefined,
              client_ip_address: await getClientIP(),
              client_user_agent: navigator.userAgent,
              fbc: getCookie("_fbc"),
              fbp: getCookie("_fbp"),
            },
            custom_data: {
              content_name: "ONBONGO B2B Registration",
              content_category: leadData.tipoCadastro,
              value: leadData.tipoCadastro === "lojista" ? 100 : 10,
              currency: "BRL",
            },
          },
        ],
        test_event_code: META_TEST_EVENT_CODE,
      };

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${META_PIXEL_ID}/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${META_ACCESS_TOKEN}`,
          },
          body: JSON.stringify(eventData),
        },
      );

      if (response.ok) {
        console.log("✅ Conversions API event sent successfully");
      } else {
        console.error("❌ Conversions API error:", await response.text());
      }
    } catch (error) {
      console.error("❌ Conversions API error:", error);
    }
  };

  // Helper functions
  const hashString = async (str: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return undefined;
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch {
      return "";
    }
  };

  return (
    <>
      {/* Noscript fallback for Meta Pixel */}
      {META_PIXEL_ID && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
    </>
  );
}
