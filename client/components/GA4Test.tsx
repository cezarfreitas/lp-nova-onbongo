export default function GA4Test() {
  const testarGA4 = () => {
    console.log('🧪 Testando GA4...');

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'test_click', {
        event_category: 'test',
        event_label: 'manual_test'
      });

      console.log('✅ Evento GA4 enviado!');
      alert('✅ Evento enviado para G-Q8T9ML8Q5C');
    } else {
      console.error('❌ GA4 não disponível');
      alert('❌ GA4 não carregado');
    }
  };

  const verificarRede = () => {
    fetch('https://www.googletagmanager.com/gtag/js?id=G-Q8T9ML8Q5C')
      .then(response => {
        console.log('🌐 [REDE] Status da requisição GA4:', response.status);
        if (response.ok) {
          console.log('✅ [REDE] Script GA4 acessível');
          alert('✅ Script GA4 acessível pela rede');
        } else {
          console.error('❌ [REDE] Erro ao acessar script GA4');
          alert('❌ Erro de rede no script GA4');
        }
      })
      .catch(error => {
        console.error('❌ [REDE] Erro de conexão:', error);
        alert('❌ Erro de conexão com Google Analytics');
      });
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
        <div className="text-[10px] opacity-75">
          G-Q8T9ML8Q5C
        </div>
      </div>
    </div>
  );
}
