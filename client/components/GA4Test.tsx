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
      <div className="mb-2 font-bold">🧪 GA4 Test</div>
      <div className="space-y-1">
        <button
          onClick={testarGA4}
          className="block w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Testar GA4
        </button>
        <button
          onClick={verificarRede}
          className="block w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Teste Rede
        </button>
        <div className="text-[10px] opacity-75">G-M440PQ5X13</div>
      </div>
    </div>
  );
}
