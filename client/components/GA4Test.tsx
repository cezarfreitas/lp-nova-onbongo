declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export default function GA4Test() {
  const testarGA4 = () => {
    console.log("🧪 Testando GA4...");
    console.log("📊 DataLayer:", window.dataLayer);
    console.log("🏷️ gtag disponível:", typeof window.gtag);

    if (typeof window !== "undefined" && window.gtag) {
      // Enviar múltiplos eventos para garantir detecção
      window.gtag("event", "test_manual_click", {
        event_category: "test",
        event_label: "manual_test_button",
        value: 1,
      });

      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
      });

      console.log("✅ Eventos GA4 enviados!");
      alert(
        "✅ Eventos enviados para G-M440PQ5X13\nVerifique Google Tag Assistant",
      );
    } else {
      console.error("❌ GA4 não disponível");
      console.error("📊 DataLayer:", window.dataLayer);
      alert("❌ GA4 não carregado - verifique o console");
    }
  };

  const testarMetaPixel = () => {
    console.log("📘 Testando Meta Pixel...");
    console.log("🔷 fbq disponível:", typeof window.fbq);

    if (typeof window !== "undefined" && window.fbq) {
      // Enviar evento de teste do Meta Pixel
      window.fbq("track", "Lead", {
        content_name: "Test Lead Button",
        content_category: "test",
        value: 1,
        currency: "BRL",
      });

      console.log("✅ Evento Meta Pixel enviado!");
      alert(
        "✅ Evento enviado para Meta Pixel: 1052506589717984\nVerifique Facebook Pixel Helper",
      );
    } else {
      console.error("❌ Meta Pixel não disponível");
      alert("❌ Meta Pixel não carregado - verifique o console");
    }
  };

  const testarLeadPersonalizado = () => {
    console.log("🎯 Testando Lead_Onbongo_LP...");

    // Teste GA4
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "Lead_Onbongo_LP", {
        event_category: "lead",
        event_label: "test_lojista_lead",
        currency: "BRL",
        value: 100,
        lead_type: "test",
      });
      console.log("✅ GA4 Lead_Onbongo_LP enviado");
    }

    // Teste Meta Pixel
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("trackCustom", "Lead_Onbongo_LP", {
        content_name: "Test Lojista Lead",
        content_category: "B2B_Lead",
        value: 100,
        currency: "BRL",
        lead_type: "test",
      });
      console.log("📘 Meta Pixel Lead_Onbongo_LP enviado");
    }

    alert(
      "🎯 Evento Lead_Onbongo_LP enviado!\nGA4: G-M440PQ5X13\nMeta: 1052506589717984",
    );
  };

  const testarConversionsAPI = () => {
    console.log("🔄 Testando Conversions API...");

    if (typeof (window as any).trackLead === "function") {
      (window as any).trackLead({
        tipoCadastro: "lojista",
        nome: "Teste API",
        whatsapp: "11999999999",
        cnpj: "12345678000199",
        email: "teste@onbongo.com",
      });
      console.log("✅ Conversions API Lead enviado");
      alert("🔄 Conversions API testada!\nVerifique o Events Manager do Facebook\nTest Code: TEST8508");
    } else {
      console.error("❌ trackLead não disponível");
      alert("❌ trackLead não disponível - verifique TrackingScripts");
    }
  };

  const verificarRede = () => {
    console.log("🌐 Verificando rede...");
    alert("🔍 Abra as DevTools > Network para ver requisições GA4");
  };

  // Só mostrar em desenvolvimento
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg z-50 text-xs">
      <div className="mb-2 font-bold">🧪 Tracking Test</div>
      <div className="space-y-1">
        <button
          onClick={testarGA4}
          className="block w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Testar GA4
        </button>
        <button
          onClick={testarMetaPixel}
          className="block w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Testar Meta Pixel
        </button>
        <button
          onClick={testarLeadPersonalizado}
          className="block w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
        >
          🎯 Lead_Onbongo_LP
        </button>
        <button
          onClick={verificarRede}
          className="block w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Teste Rede
        </button>
        <div className="text-[10px] opacity-75">
          GA4: G-M440PQ5X13
          <br />
          Meta: 1052506589717984
        </div>
      </div>
    </div>
  );
}
