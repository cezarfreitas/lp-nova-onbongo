import { useState } from "react";

interface FormData {
  nomeCompleto: string;
  whatsapp: string;
  tipoCadastro: "lojista" | "consumidor";
  cnpj: string;
}

interface FormErrors {
  nomeCompleto?: string;
  whatsapp?: string;
  cnpj?: string;
}

export default function CadastroSection() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: "",
    whatsapp: "",
    tipoCadastro: "lojista",
    cnpj: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Máscara para WhatsApp
  const formatWhatsApp = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  // Máscara para CNPJ
  const formatCNPJ = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 14) {
      return numbers.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5",
      );
    }
    return value;
  };

  // Validações para etapa 1
  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = "Nome obrigatório";
    } else if (formData.nomeCompleto.trim().length < 3) {
      newErrors.nomeCompleto = "Nome muito curto";
    }

    const whatsappNumbers = formData.whatsapp.replace(/\D/g, "");
    if (!whatsappNumbers) {
      newErrors.whatsapp = "WhatsApp obrigatório";
    } else if (whatsappNumbers.length !== 11) {
      newErrors.whatsapp = "WhatsApp inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validações para etapa 3 (CNPJ)
  const validateStep3 = (): boolean => {
    if (formData.tipoCadastro === "consumidor") {
      return true; // Não precisa validar nada para consumidor
    }

    const newErrors: FormErrors = {};
    const cnpjNumbers = formData.cnpj.replace(/\D/g, "");

    if (!cnpjNumbers) {
      newErrors.cnpj = "CNPJ é obrigatório";
    } else if (cnpjNumbers.length !== 14) {
      newErrors.cnpj = "CNPJ deve ter 14 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "whatsapp") {
      formattedValue = formatWhatsApp(value);
    } else if (name === "cnpj") {
      formattedValue = formatCNPJ(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleTipoChange = (tipo: "lojista" | "consumidor") => {
    setFormData((prev) => ({
      ...prev,
      tipoCadastro: tipo,
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Sempre avança da etapa 2 para 3, independente do tipo
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Se for consumidor, não precisa validar CNPJ
    if (formData.tipoCadastro === "lojista" && !validateStep3()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Dados do formulário:", formData);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          nomeCompleto: "",
          whatsapp: "",
          tipoCadastro: "lojista",
          cnpj: "",
        });
        setCurrentStep(1);
      }, 3000);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const beneficios = [
    {
      icon: "🌍",
      titulo: "Marca Internacional",
      descricao: "Streetwear reconhecido mundialmente com +30 anos.",
    },
    {
      icon: "📦",
      titulo: "Pronta Entrega",
      descricao: "+100.000 itens disponíveis para envio imediato.",
    },
    {
      icon: "💻",
      titulo: "Plataforma Digital",
      descricao: "Catálogo 24/7 com preços exclusivos para lojistas.",
    },
    {
      icon: "🎯",
      titulo: "Suporte Completo",
      descricao: "Treinamento, marketing e suporte especializado.",
    },
  ];

  if (isSubmitted) {
    return (
      <section className="min-h-screen bg-dark py-12 px-4 flex items-center justify-center">
        <div className="text-center text-light max-w-sm">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-display text-2xl font-bold text-accent mb-3">
            {formData.tipoCadastro === "lojista"
              ? "Cadastro Realizado!"
              : "Cupom Gerado!"}
          </h2>
          <p className="text-light/80 mb-4 text-sm">
            {formData.tipoCadastro === "lojista"
              ? "Nossa equipe entrará em contato via WhatsApp em breve."
              : "Seu cupom de 10% foi gerado com sucesso!"}
          </p>
          <div className="bg-accent/20 p-3 rounded-lg">
            <p className="text-light/70 text-xs">
              {formData.tipoCadastro === "lojista"
                ? "⏱�� Resposta em até 2 horas úteis"
                : "🎁 Use o código: ONBONGO10"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-dark py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Lado Esquerdo - Benefícios */}
          <div className="text-light">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="text-light">SEJA UM</span>
              <br />
              <span className="text-accent">LOJISTA OFICIAL</span>
              <br />
              <span className="text-light">ONBONGO</span>
            </h2>

            <p className="text-light/80 text-base mb-8 leading-relaxed">
              Junte-se aos melhores lojistas do Brasil e tenha acesso exclusivo
              aos produtos da marca líder em streetwear.
            </p>

            <div className="space-y-6">
              {beneficios.map((beneficio, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 transform hover:translate-x-1 transition-transform duration-300"
                >
                  <div className="bg-accent rounded-lg p-2 text-xl flex-shrink-0">
                    {beneficio.icon}
                  </div>
                  <div>
                    <h3 className="text-light font-bold text-lg mb-1">
                      {beneficio.titulo}
                    </h3>
                    <p className="text-light/70 text-sm leading-relaxed">
                      {beneficio.descricao}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lado Direito - Formulário */}
          <div className="lg:pl-6">
            <div className="bg-accent rounded-2xl p-6 max-w-sm mx-auto lg:mx-0 shadow-2xl">
              {/* Header do formulário */}
              <div className="text-center mb-6">
                <h3 className="text-light font-bold text-xl mb-1">
                  Cadastre-se Agora
                </h3>
                <p className="text-light/90 text-sm">
                  Comece sua jornada como lojista oficial Onbongo
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Etapa 1: Dados Básicos */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Nome Completo */}
                    <div>
                      <label
                        htmlFor="nomeCompleto"
                        className="block text-light font-medium mb-2 text-sm"
                      >
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        id="nomeCompleto"
                        name="nomeCompleto"
                        value={formData.nomeCompleto}
                        onChange={handleInputChange}
                        placeholder="Seu nome completo"
                        className="w-full px-3 py-3 rounded-xl bg-light text-dark placeholder:text-muted border-none focus:outline-none focus:ring-2 focus:ring-dark text-sm"
                        autoFocus
                      />
                      {errors.nomeCompleto && (
                        <p className="text-red-200 text-xs mt-1">
                          {errors.nomeCompleto}
                        </p>
                      )}
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label
                        htmlFor="whatsapp"
                        className="block text-light font-medium mb-2 text-sm"
                      >
                        WhatsApp *
                      </label>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="(11) 99999-9999"
                        className="w-full px-3 py-3 rounded-xl bg-light text-dark placeholder:text-muted border-none focus:outline-none focus:ring-2 focus:ring-dark text-sm"
                      />
                      {errors.whatsapp && (
                        <p className="text-red-200 text-xs mt-1">
                          {errors.whatsapp}
                        </p>
                      )}
                    </div>

                    {/* Botão Próximo */}
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full bg-dark hover:bg-dark/90 text-light font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-light text-sm mt-6"
                    >
                      Próximo →
                    </button>
                  </div>
                )}

                {/* Etapa 2: Tipo de Cadastro */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Tipo de Cadastro */}
                    <div>
                      <label className="block text-light font-medium mb-3 text-sm">
                        Tipo de Cadastro *
                      </label>
                      <div className="space-y-2">
                        <label className="block cursor-pointer">
                          <div
                            className={`p-3 rounded-xl transition-all duration-300 ${
                              formData.tipoCadastro === "lojista"
                                ? "bg-dark/30 border border-light/20"
                                : "bg-dark/20 border border-transparent hover:bg-dark/25"
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="relative mr-3">
                                <input
                                  type="radio"
                                  name="tipoCadastro"
                                  value="lojista"
                                  checked={formData.tipoCadastro === "lojista"}
                                  onChange={() => handleTipoChange("lojista")}
                                  className="sr-only"
                                />
                                <div
                                  className={`w-4 h-4 rounded-full border-2 ${
                                    formData.tipoCadastro === "lojista"
                                      ? "border-light bg-light"
                                      : "border-light/60"
                                  }`}
                                >
                                  {formData.tipoCadastro === "lojista" && (
                                    <div className="w-full h-full rounded-full bg-accent scale-50"></div>
                                  )}
                                </div>
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

                        <label className="block cursor-pointer">
                          <div
                            className={`p-3 rounded-xl transition-all duration-300 ${
                              formData.tipoCadastro === "consumidor"
                                ? "bg-dark/30 border border-light/20"
                                : "bg-dark/20 border border-transparent hover:bg-dark/25"
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="relative mr-3">
                                <input
                                  type="radio"
                                  name="tipoCadastro"
                                  value="consumidor"
                                  checked={
                                    formData.tipoCadastro === "consumidor"
                                  }
                                  onChange={() =>
                                    handleTipoChange("consumidor")
                                  }
                                  className="sr-only"
                                />
                                <div
                                  className={`w-4 h-4 rounded-full border-2 ${
                                    formData.tipoCadastro === "consumidor"
                                      ? "border-light bg-light"
                                      : "border-light/60"
                                  }`}
                                >
                                  {formData.tipoCadastro === "consumidor" && (
                                    <div className="w-full h-full rounded-full bg-accent scale-50"></div>
                                  )}
                                </div>
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
                    </div>

                    {/* Botões de Navegação */}
                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 bg-dark/50 hover:bg-dark/70 text-light font-medium py-3 px-4 rounded-xl transition-all duration-300 text-sm"
                      >
                        ← Voltar
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex-2 bg-dark hover:bg-dark/90 text-light font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-light text-sm"
                      >
                        Avançar para Finalizar →
                      </button>
                    </div>
                  </div>
                )}

                {/* Etapa 3: CNPJ ou Cupom */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    {formData.tipoCadastro === "lojista" ? (
                      // Para Lojistas: Campo CNPJ
                      <>
                        <div>
                          <label
                            htmlFor="cnpj"
                            className="block text-light font-medium mb-2 text-sm"
                          >
                            CNPJ *
                          </label>
                          <input
                            type="text"
                            id="cnpj"
                            name="cnpj"
                            value={formData.cnpj}
                            onChange={handleInputChange}
                            placeholder="00.000.000/0001-00"
                            className="w-full px-3 py-3 rounded-xl bg-light text-dark placeholder:text-muted border-none focus:outline-none focus:ring-2 focus:ring-dark text-sm"
                            autoFocus
                          />
                          {errors.cnpj && (
                            <p className="text-red-200 text-xs mt-1">
                              {errors.cnpj}
                            </p>
                          )}
                        </div>

                        {/* Botões de Navegação */}
                        <div className="flex gap-3 mt-6">
                          <button
                            type="button"
                            onClick={handlePrevStep}
                            className="flex-1 bg-dark/50 hover:bg-dark/70 text-light font-medium py-3 px-4 rounded-xl transition-all duration-300 text-sm"
                          >
                            ← Voltar
                          </button>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-2 bg-dark hover:bg-dark/90 disabled:bg-dark/50 text-light font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-light disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm"
                          >
                            {isLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-light"></div>
                                Enviando...
                              </>
                            ) : (
                              <>✓ Finalizar Cadastro!</>
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      // Para Consumidores: Cupom
                      <>
                        <div className="text-center py-4">
                          <div className="text-4xl mb-4">🎁</div>
                          <h4 className="text-light font-bold text-lg mb-3">
                            Ops! Cadastro Lojista não disponível
                          </h4>
                          <p className="text-light/80 text-sm mb-4 leading-relaxed">
                            Como consumidor, você não pode se cadastrar como
                            lojista.
                            <br />
                            <strong>Mas temos algo especial para você!</strong>
                          </p>

                          <div className="bg-dark/30 p-4 rounded-xl mb-4">
                            <h5 className="text-accent font-bold text-base mb-2">
                              🎉 Cupom de 10% OFF
                            </h5>
                            <p className="text-light/80 text-sm mb-3">
                              Ganhe 10% de desconto no site oficial da ONBONGO
                            </p>
                            <div className="bg-light text-dark px-3 py-2 rounded-lg font-mono text-sm font-bold">
                              ONBONGO10
                            </div>
                          </div>
                        </div>

                        {/* Botões de Navegação */}
                        <div className="flex gap-3 mt-6">
                          <button
                            type="button"
                            onClick={handlePrevStep}
                            className="flex-1 bg-dark/50 hover:bg-dark/70 text-light font-medium py-3 px-4 rounded-xl transition-all duration-300 text-sm"
                          >
                            ← Voltar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              window.open(
                                "https://www.onbongo.com.br",
                                "_blank",
                              );
                              handleSubmit(new Event("submit") as any);
                            }}
                            className="flex-2 bg-dark hover:bg-dark/90 text-light font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-light text-sm"
                          >
                            🛒 Ir para Site Oficial
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </form>

              {/* Termos - sempre visível */}
              <p className="text-light/70 text-xs text-center leading-relaxed mt-4">
                Ao se cadastrar, você concorda com nossos{" "}
                <a href="/termos" className="underline hover:text-light">
                  Termos de Uso
                </a>{" "}
                e{" "}
                <a href="/privacidade" className="underline hover:text-light">
                  Política de Privacidade
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
