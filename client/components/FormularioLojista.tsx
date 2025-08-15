import { useState } from "react";
import { useGA4 } from "./GA4";

export default function FormularioLojista() {
  const { trackEvent, trackConversion } = useGA4();
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
    return numeros.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  };

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};

    if (!dados.nome.trim()) {
      novosErros.nome = "Nome obrigatório";
    }

    const tel = dados.telefone.replace(/\D/g, "");
    if (!tel || tel.length !== 11) {
      novosErros.telefone = "Telefone inválido";
    }

    if (!dados.tipo) {
      novosErros.tipo = "Selecione o tipo de cadastro";
    }

    if (dados.tipo === "lojista") {
      const doc = dados.documento.replace(/\D/g, "");
      if (!doc || doc.length !== 14) {
        novosErros.documento = "CNPJ inválido";
      }
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


    setDados((prev) => ({ ...prev, [campo]: valorFormatado }));

    // Tracking GA4 para seleção do tipo
    if (campo === "tipo") {
      trackEvent("select_registration_type", {
        event_category: "engagement",
        event_label: valor,
        registration_type: valor,
      });
    }

    if (erros[campo]) {
      setErros((prev) => ({ ...prev, [campo]: "" }));
    }
  };

  const enviarFormulario = async () => {
    if (!validarFormulario()) {
      trackEvent("form_validation_error", {
        event_category: "form",
        event_label: "lojista_registration",
      });
      return;
    }

    trackEvent("begin_checkout", {
      event_category: "ecommerce",
      event_label: "lojista_registration_start",
      currency: "BRL",
      value: 1,
    });

    setEnviando(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Dados enviados:", dados);

      trackEvent("purchase", {
        event_category: "ecommerce",
        event_label: "lojista_registration_complete",
        currency: "BRL",
        value: 1,
        registration_type: dados.tipo,
      });

      trackConversion("lojista_signup", 1);

      setSucesso(true);

      setTimeout(() => {
        setSucesso(false);
        setDados({ nome: "", telefone: "", tipo: "", documento: "" });
      }, 4000);
    } catch (error) {
      // Tracking de erro
      trackEvent("form_submission_error", {
        event_category: "form",
        event_label: "lojista_registration_error",
        error_message: String(error),
      });
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  const abrirSite = () => {
    // Tracking do clique no botão do consumidor
    trackEvent("click", {
      event_category: "engagement",
      event_label: "consumer_discount_button",
      outbound: true,
      link_url: "https://www.onbongo.com.br",
    });

    // Tracking de conversão do consumidor
    trackEvent("generate_lead", {
      event_category: "ecommerce",
      event_label: "consumer_discount_generated",
      currency: "BRL",
      value: 0.5,
      registration_type: "consumidor",
    });

    window.open("https://www.onbongo.com.br", "_blank");
    setSucesso(true);
    setTimeout(() => {
      setSucesso(false);
      setDados({ nome: "", telefone: "", tipo: "", documento: "" });
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
    <section className="bg-accent py-8 sm:py-12 px-4">
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
            <div className="bg-dark rounded-2xl p-4 sm:p-6 max-w-sm mx-auto lg:mx-0 shadow-2xl">
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-light font-bold text-lg sm:text-xl mb-1">
                  Cadastre-se Agora
                </h3>
                <p className="text-light/90 text-xs sm:text-sm">
                  Comece sua jornada como lojista oficial
                </p>
              </div>

              <div className="space-y-4">
                {/* Nome Completo */}
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

                {/* WhatsApp */}
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
                    <p className="text-red-300 text-xs mt-1">
                      {erros.telefone}
                    </p>
                  )}
                </div>

                {/* Tipo de Cadastro */}
                <div>
                  <label className="block text-light font-medium mb-3 text-sm">
                    Tipo de Cadastro *
                  </label>
                  <div className="space-y-2">
                    <label
                      className="block cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        alterarCampo("tipo", "lojista");
                      }}
                    >
                      <div
                        className={`p-3 rounded-xl transition-all duration-300 ${
                          dados.tipo === "lojista"
                            ? "bg-accent/30 border border-light/20"
                            : "bg-accent/20 border border-transparent hover:bg-accent/25"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`mr-3 w-4 h-4 rounded-full border-2 border-light/50 flex items-center justify-center ${
                              dados.tipo === "lojista"
                                ? "bg-accent border-accent"
                                : ""
                            }`}
                          >
                            {dados.tipo === "lojista" && (
                              <div className="w-2 h-2 bg-light rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <div className="text-light font-medium text-sm">
                              Sou Lojista
                            </div>
                            <div className="text-light/70 text-xs">
                              Tenho CNPJ e quero revender
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label
                      className="block cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        alterarCampo("tipo", "consumidor");
                      }}
                    >
                      <div
                        className={`p-3 rounded-xl transition-all duration-300 ${
                          dados.tipo === "consumidor"
                            ? "bg-accent/30 border border-light/20"
                            : "bg-accent/20 border border-transparent hover:bg-accent/25"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`mr-3 w-4 h-4 rounded-full border-2 border-light/50 flex items-center justify-center ${
                              dados.tipo === "consumidor"
                                ? "bg-accent border-accent"
                                : ""
                            }`}
                          >
                            {dados.tipo === "consumidor" && (
                              <div className="w-2 h-2 bg-light rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <div className="text-light font-medium text-sm">
                              Sou Consumidor
                            </div>
                            <div className="text-light/70 text-xs">
                              Quero comprar para uso próprio
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                  {erros.tipo && (
                    <p className="text-red-300 text-xs mt-1">{erros.tipo}</p>
                  )}
                </div>

                {/* CNPJ - Somente se for lojista */}
                {dados.tipo === "lojista" && (
                  <div>
                    <label className="block text-light font-medium mb-2 text-sm">
                      CNPJ *
                    </label>
                    <input
                      type="text"
                      value={dados.documento}
                      onChange={(e) =>
                        alterarCampo("documento", e.target.value)
                      }
                      placeholder="00.000.000/0001-00"
                      className="w-full px-4 py-3 rounded-xl bg-light text-dark placeholder:text-muted border-none focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    />
                    {erros.documento && (
                      <p className="text-red-300 text-xs mt-1">
                        {erros.documento}
                      </p>
                    )}
                  </div>
                )}

                {/* Cupom para consumidor */}
                {dados.tipo === "consumidor" && (
                  <div className="bg-gradient-to-r from-accent/20 to-accent/30 p-4 rounded-xl border border-accent/20">
                    <p className="text-light/80 text-xs mb-2 font-medium text-center">
                      SEU CÓDIGO DE DESCONTO:
                    </p>
                    <div className="bg-light text-dark px-4 py-3 rounded-lg font-mono text-lg font-bold tracking-widest shadow-inner text-center">
                      ONBONGO10
                    </div>
                    <p className="text-light/70 text-xs mt-2 text-center">
                      💾 Salve este código para usar no checkout
                    </p>
                  </div>
                )}

                {/* Botões */}
                <div className="pt-4">
                  {dados.tipo === "lojista" ? (
                    <button
                      type="button"
                      disabled={enviando}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        enviarFormulario();
                      }}
                      className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-light font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm"
                    >
                      {enviando ? "Enviando..." : "✓ Finalizar Cadastro!"}
                    </button>
                  ) : dados.tipo === "consumidor" ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        abrirSite();
                      }}
                      className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-light font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm shadow-lg"
                    >
                      🛒 Usar Desconto Agora
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={true}
                      className="w-full bg-accent/50 text-light font-bold py-3 px-4 rounded-xl text-sm cursor-not-allowed"
                    >
                      Selecione o tipo de cadastro
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
