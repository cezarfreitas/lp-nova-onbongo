import { useGA4 } from "./GA4";

export default function GA4Debug() {
  const { trackEvent } = useGA4();

  // Função para testar eventos
  const testarEvento = () => {
    trackEvent("test_event", {
      event_category: "debug",
      event_label: "manual_test",
      value: 1,
    });
    alert("Evento de teste enviado! Verifique o console do navegador.");
  };

  // Verificar se gtag está disponível
  const verificarGA4 = () => {
    console.log("🔍 Verificando status do GA4...");
    console.log("📊 DataLayer:", window.dataLayer);
    console.log("🏷️ gtag function:", typeof window.gtag);
    console.log("🆔 Measurement ID:", GA4_CONFIG.measurementId);
    console.log("🌍 URL atual:", window.location.href);
    console.log("📄 Título da página:", document.title);

    if (window.gtag) {
      console.log("✅ GA4 está carregado e funcionando");
      alert("✅ GA4 funcionando! Verifique o console para detalhes completos.");
    } else {
      console.error("❌ GA4 não está carregado");
      alert("❌ GA4 não está funcionando. Verifique o console.");
    }
  };

  // Só mostrar em desenvolvimento
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50 text-xs">
      <div className="mb-2 font-bold">🔧 GA4 Debug</div>
      <div className="space-y-1">
        <button
          onClick={verificarGA4}
          className="block w-full bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Verificar GA4
        </button>
        <button
          onClick={testarEvento}
          className="block w-full bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Testar Evento
        </button>
        <div className="text-[10px] opacity-75">
          ID: {GA4_CONFIG.measurementId}
        </div>
      </div>
    </div>
  );
}
