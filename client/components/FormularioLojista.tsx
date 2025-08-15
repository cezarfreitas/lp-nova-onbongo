import { useState } from "react";

export default function FormularioLojista() {
  const [etapa, setEtapa] = useState(1);
  const [dados, setDados] = useState({
    nome: "",
    telefone: "",
    tipo: "",
    documento: "",
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const mascaraTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const mascaraCNPJ = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  const validarEtapa1 = () => {
    const novosErros: Record<string, string> = {};
    
    if (!dados.nome.trim()) {
      novosErros.nome = "Nome obrigatório";
    }
    
    const tel = dados.telefone.replace(/\D/g, "");
    if (!tel || tel.length !== 11) {
      novosErros.telefone = "Telefone inválido";
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const validarEtapa3 = () => {
    if (dados.tipo === "consumidor") return true;
    
    const novosErros: Record<string, string> = {};
    const doc = dados.documento.replace(/\D/g, "");
    
    if (!doc || doc.length !== 14) {
      novosErros.documento = "CNPJ inválido";
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const alterarCampo = (campo: string, valor: string) => {
    let valorFormatado = valor;
    
    if (campo === "telefone") {
      valorFormatado = mascaraTelefone(valor);
    } else if (campo === "documento") {
      valorFormatado = mascaraCNPJ(valor);
    }
    
    setDados(prev => ({ ...prev, [campo]: valorFormatado }));
    
    if (erros[campo]) {
      setErros(prev => ({ ...prev, [campo]: "" }));
    }
  };

  const proximaEtapa = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (etapa === 1 && validarEtapa1()) {
      setEtapa(2);
    }
  };

  const etapaAnterior = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (etapa > 1) {
      setEtapa(etapa - 1);
    }
  };

  const selecionarTipo = (tipoSelecionado: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDados(prev => ({ ...prev, tipo: tipoSelecionado }));
    setTimeout(() => setEtapa(3), 200);
  };

  const enviarFormulario = async () => {
    if (dados.tipo === "lojista" && !validarEtapa3()) {
      return;
    }
    
    setEnviando(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Dados enviados:", dados);
      setSucesso(true);
      
      setTimeout(() => {
        setSucesso(false);
        setDados({ nome: "", telefone: "", tipo: "", documento: "" });
        setEtapa(1);
      }, 4000);
    } catch (error) {
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  const abrirSite = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.open("https://www.onbongo.com.br", "_blank");
    setSucesso(true);
    setTimeout(() => {
      setSucesso(false);
      setDados({ nome: "", telefone: "", tipo: "", documento: "" });
      setEtapa(1);
    }, 4000);
  };

  if (sucesso) {
    return (
      <section className="bg-accent py-16 px-4 flex items-center justify-center">
        <div className="text-center text-dark max-w-sm">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-display text-2xl font-bold text-dark mb-3">
            {dados.tipo === "lojista" ? "Cadastro Realizado!" : "Cupom Gerado!"}
          </h2>
          <p className="text-dark/80 mb-4 text-sm">
            {dados.tipo === "lojista"
              ? "Nossa equipe entrará em contato via WhatsApp em breve."
              : "Seu cupom de desconto foi gerado com sucesso!"}
          </p>
          <div className="bg-dark/10 p-4 rounded-xl border border-dark/20">
            <p className="text-dark/70 text-xs font-medium">
              {dados.tipo === "lojista"
                ? "⏱️ Resposta em até 2 horas úteis"
                : "🎁 Use o código: ONBONGO10"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="bg-accent py-8 sm:py-12 px-4"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Título */}
          <div className="text-dark text-center lg:text-left mb-6 lg:mb-0">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
              <span className="text-dark">SEJA UM</span>
              <br />
              <span className="text-light">LOJISTA OFICIAL</span>
              <br />
              <span className="text-dark">ONBONGO</span>
            </h2>
            <p className="text-dark/80 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
              Junte-se aos melhores lojistas do Brasil e tenha acesso exclusivo
              aos produtos da marca líder em streetwear.
            </p>
          </div>

          {/* Formulário */}
          <div className="lg:pl-6">
            <div
              id="formulario-container"
              className="bg-dark rounded-2xl p-4 sm:p-6 max-w-sm mx-auto lg:mx-0 shadow-2xl"
              style={{
                contain: 'layout style paint',
                isolation: 'isolate',
                overscrollBehavior: 'contain'
              }}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-light font-bold text-lg sm:text-xl mb-1">
                  {etapa === 1 ? "Cadastre-se Agora" : 
                   etapa === 2 ? "Tipo de Cadastro" : 
                   dados.tipo === "lojista" ? "Finalizar Cadastro" : "Cadastro Exclusivo"}
                </h3>
                <p className="text-light/90 text-xs sm:text-sm">
                  {etapa === 1 ? "Comece sua jornada como lojista oficial" :
                   etapa === 2 ? "Escolha o tipo de cadastro desejado" :
                   dados.tipo === "lojista" ? "Dados da sua empresa" : "Para lojistas com CNPJ"}
                </p>
                <div className="flex justify-center gap-2 mt-2 sm:mt-3">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        num <= etapa ? "bg-accent" : "bg-accent/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Etapa 1: Dados básicos */}
              {etapa === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-light font-medium mb-2 text-sm">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={dados.nome}
                      onChange={(e) => alterarCampo("nome", e.target.value)}
                      placeholder="Seu nome completo"
                      className="w-full px-4 py-3 rounded-xl bg-light text-dark placeholder:text-muted border-none focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    />
                    {erros.nome && (
                      <p className="text-red-300 text-xs mt-1">{erros.nome}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-light font-medium mb-2 text-sm">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={dados.telefone}
                      onChange={(e) => alterarCampo("telefone", e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-3 rounded-xl bg-light text-dark placeholder:text-muted border-none focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    />
                    {erros.telefone && (
                      <p className="text-red-300 text-xs mt-1">{erros.telefone}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => proximaEtapa(e)}
                    disabled={!dados.nome.trim() || !dados.telefone.trim()}
                    className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 disabled:cursor-not-allowed text-light font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm mt-6"
                  >
                    Próximo →
                  </button>
                </div>
              )}

              {/* Etapa 2: Tipo de cadastro */}
              {etapa === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-light font-medium mb-3 text-sm">
                      Tipo de Cadastro *
                    </label>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={(e) => selecionarTipo("lojista", e)}
                        className="w-full p-3 rounded-xl bg-accent/20 hover:bg-accent/25 transition-all duration-300"
                      >
                        <div className="flex items-center text-left">
                          <div className="w-4 h-4 rounded-full border-2 border-light/60 mr-3" />
                          <div>
                            <div className="text-light font-medium text-sm">Sou Lojista</div>
                            <div className="text-light/70 text-xs">Tenho CNPJ e quero revender</div>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => selecionarTipo("consumidor", e)}
                        className="w-full p-3 rounded-xl bg-accent/20 hover:bg-accent/25 transition-all duration-300"
                      >
                        <div className="flex items-center text-left">
                          <div className="w-4 h-4 rounded-full border-2 border-light/60 mr-3" />
                          <div>
                            <div className="text-light font-medium text-sm">Sou Consumidor</div>
                            <div className="text-light/70 text-xs">Quero comprar para uso próprio</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      onClick={(e) => etapaAnterior(e)}
                      className="bg-accent hover:bg-accent/90 text-light font-medium py-3 px-6 rounded-xl transition-all duration-300 text-sm"
                    >
                      ← Voltar
                    </button>
                  </div>
                </div>
              )}

              {/* Etapa 3: CNPJ ou Cupom */}
              {etapa === 3 && (
                <div className="space-y-4">
                  {dados.tipo === "lojista" ? (
                    <>
                      <div>
                        <label className="block text-light font-medium mb-2 text-sm">
                          CNPJ *
                        </label>
                        <input
                          type="text"
                          value={dados.documento}
                          onChange={(e) => alterarCampo("documento", e.target.value)}
                          placeholder="00.000.000/0001-00"
                          className="w-full px-4 py-3 rounded-xl bg-light text-dark placeholder:text-muted border-none focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                        />
                        {erros.documento && (
                          <p className="text-red-300 text-xs mt-1">{erros.documento}</p>
                        )}
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          type="button"
                          onClick={(e) => etapaAnterior(e)}
                          className="flex-1 bg-accent hover:bg-accent/90 text-light font-medium py-3 px-4 rounded-xl transition-all duration-300 text-sm"
                        >
                          ← Voltar
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            enviarFormulario();
                          }}
                          disabled={enviando}
                          className="flex-2 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-light font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm"
                        >
                          {enviando ? "Enviando..." : "✓ Finalizar Cadastro!"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center py-4">
                        <h4 className="text-light font-bold text-lg mb-3">
                          Cadastro exclusivo para lojistas
                        </h4>
                        <p className="text-light/90 text-sm mb-4">
                          Como você é consumidor da marca, preparamos um
                          <strong className="text-accent"> desconto especial de 10%</strong> 
                          para suas compras!
                        </p>

                        <div className="bg-gradient-to-r from-accent/20 to-accent/30 p-4 rounded-xl mb-4 border border-accent/20">
                          <p className="text-light/80 text-xs mb-2 font-medium">
                            SEU CÓDIGO DE DESCONTO:
                          </p>
                          <div className="bg-light text-dark px-4 py-3 rounded-lg font-mono text-lg font-bold tracking-widest shadow-inner">
                            ONBONGO10
                          </div>
                          <p className="text-light/70 text-xs mt-2">
                            💾 Salve este código para usar no checkout
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          type="button"
                          onClick={(e) => etapaAnterior(e)}
                          className="flex-1 bg-accent hover:bg-accent/90 text-light font-medium py-3 px-4 rounded-xl transition-all duration-300 text-sm"
                        >
                          ← Voltar
                        </button>
                        <button
                          type="button"
                          onClick={(e) => abrirSite(e)}
                          className="flex-2 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-light font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm shadow-lg"
                        >
                          🛒 Usar Desconto Agora
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
