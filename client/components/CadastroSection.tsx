import { useState, useRef, useEffect } from "react";

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
    tipoCadastro: "" as any,
    cnpj: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-focus removido para evitar problemas de recarregamento

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

    // Limpar erro em tempo real
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Manipular tecla Enter para avançar etapas
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentStep === 1 && validateStep1()) {
        setCurrentStep(2);
      }
    }
  };

  const handleTipoChange = (tipo: "lojista" | "consumidor") => {
    // Atualizar estado e avançar etapa em uma única operação
    setFormData((prev) => ({
      ...prev,
      tipoCadastro: tipo,
    }));

    // Usar requestAnimationFrame para garantir que a atualização visual aconteça primeiro
    requestAnimationFrame(() => {
      setTimeout(() => {
        setCurrentStep(3);
      }, 200);
    });
  };

  const handleNextStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar se o tipo de cadastro foi selecionado
    if (
      !formData.tipoCadastro ||
      (formData.tipoCadastro !== "lojista" &&
        formData.tipoCadastro !== "consumidor")
    ) {
      alert("Por favor, selecione o tipo de cadastro");
      return;
    }

    // Se for lojista, validar CNPJ
    if (formData.tipoCadastro === "lojista" && !validateStep3()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular envio (sem API real)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("✅ Dados do formulário:", {
        nome: formData.nomeCompleto,
        whatsapp: formData.whatsapp,
        tipo: formData.tipoCadastro,
        cnpj: formData.cnpj || "N/A",
      });

      setIsSubmitted(true);

      // Reset form após sucesso
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          nomeCompleto: "",
          whatsapp: "",
          tipoCadastro: "" as any,
          cnpj: "",
        });
        setCurrentStep(1);
      }, 4000);
    } catch (error: any) {
      console.error("❌ Erro ao enviar formulário:", error);
      alert("Erro ao enviar formulário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="bg-accent py-16 px-4 flex items-center justify-center">
        <div className="text-center text-dark max-w-sm animate-fade-in">
          <div className="text-5xl mb-4 animate-bounce">🎉</div>
          <h2 className="font-display text-2xl font-bold text-dark mb-3">
            {formData.tipoCadastro === "lojista"
              ? "Cadastro Realizado!"
              : "Cupom Gerado!"}
          </h2>
          <p className="text-dark/80 mb-4 text-sm leading-relaxed">
            {formData.tipoCadastro === "lojista"
              ? "Nossa equipe entrará em contato via WhatsApp em breve para finalizar sua parceria."
              : "Seu cupom de desconto foi gerado com sucesso!"}
          </p>
          <div className="bg-dark/10 p-4 rounded-xl border border-dark/20">
            <p className="text-dark/70 text-xs font-medium">
              {formData.tipoCadastro === "lojista"
                ? "⏱️ Resposta em até 2 horas úteis"
                : "🎁 Use o código: ONBONGO10"}
            </p>
            {formData.tipoCadastro === "consumidor" && (
              <p className="text-dark/60 text-xs mt-1">
                Válido por 30 dias no site oficial
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-accent py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Lado Esquerdo - Título */}
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

          {/* Lado Direito - Formulário */}
          <div className="lg:pl-6">
            <div className="bg-dark rounded-2xl p-4 sm:p-6 max-w-sm mx-auto lg:mx-0 shadow-2xl relative overflow-hidden">
              {/* Indicador de progresso */}
              <div className="absolute top-0 left-0 w-full h-1 bg-accent/20">
              </div>

              {/* Header do formulário */}
              <div className="text-center mb-4 sm:mb-6 pt-2">
                <h3 className="text-light font-bold text-lg sm:text-xl mb-1">
                  {currentStep === 1
                    ? "Cadastre-se Agora"
                    : currentStep === 2
                      ? "Tipo de Cadastro"
                      : formData.tipoCadastro === "lojista"
                        ? "Finalizar Cadastro"
                        : "Cadastro Exclusivo"}
                </h3>
                <p className="text-light/90 text-xs sm:text-sm leading-relaxed">
                  {currentStep === 1
                    ? "Comece sua jornada como lojista oficial"
                    : currentStep === 2
                      ? "Escolha o tipo de cadastro desejado"
                      : formData.tipoCadastro === "lojista"
                        ? "Dados da sua empresa"
                        : "Para lojistas com CNPJ"}
                </p>
                <div className="flex justify-center gap-2 mt-2 sm:mt-3">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        step <= currentStep ? "bg-accent" : "bg-accent/30"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              <div
                ref={formRef}
              >
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
                        onKeyDown={handleKeyPress}
                        placeholder="Seu nome completo"
                        className="w-full px-4 py-3 rounded-xl bg-light text-dark placeholder:text-muted border-none focus:outline-none focus:ring-2 focus:ring-accent text-sm transition-all duration-200 hover:shadow-md"
                        autoComplete="name"
                      />
                      {errors.nomeCompleto && (
                        <p className="text-red-300 text-xs mt-1">
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
                        onKeyDown={handleKeyPress}
                        placeholder="(11) 99999-9999"
                        className="w-full px-4 py-3 rounded-xl bg-light text-dark placeholder:text-muted border-none focus:outline-none focus:ring-2 focus:ring-accent text-sm transition-all duration-200 hover:shadow-md"
                        autoComplete="tel"
                      />
                      {errors.whatsapp && (
                        <p className="text-red-300 text-xs mt-1">
                          {errors.whatsapp}
                        </p>
                      )}
                    </div>

                    {/* Botão Próximo */}
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={
                        !formData.nomeCompleto.trim() ||
                        !formData.whatsapp.trim()
                      }
                      className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 disabled:cursor-not-allowed text-light font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-light text-sm mt-6 flex items-center justify-center gap-2"
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
                                ? "bg-accent/30 border border-light/20"
                                : "bg-accent/20 border border-transparent hover:bg-accent/25"
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
                                    <div className="w-full h-full rounded-full bg-dark scale-50"></div>
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
                                ? "bg-accent/30 border border-light/20"
                                : "bg-accent/20 border border-transparent hover:bg-accent/25"
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
                                    <div className="w-full h-full rounded-full bg-dark scale-50"></div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-light font-medium text-sm">
                                  Sou Consumidor
                                </div>
                                <div className="text-light/70 text-xs">
                                  Quero comprar para uso pr��prio
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Botão Voltar apenas */}
                    <div className="flex justify-center mt-6">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="bg-accent hover:bg-accent/90 text-light font-medium py-3 px-6 rounded-xl transition-all duration-300 text-sm"
                      >
                        ← Voltar
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
                            className="w-full px-4 py-3 rounded-xl bg-light text-dark placeholder:text-muted border-none focus:outline-none focus:ring-2 focus:ring-accent text-sm transition-all duration-200 hover:shadow-md"
                            autoComplete="organization"
                          />
                          {errors.cnpj && (
                            <p className="text-red-300 text-xs mt-1">
                              {errors.cnpj}
                            </p>
                          )}
                        </div>

                        {/* Botões de Navegação */}
                        <div className="flex gap-3 mt-6">
                          <button
                            type="button"
                            onClick={handlePrevStep}
                            className="flex-1 bg-accent hover:bg-accent/90 text-light font-medium py-3 px-4 rounded-xl transition-all duration-300 text-sm"
                          >
                            ← Voltar
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSubmit(e as any);
                            }}
                            disabled={isLoading}
                            className="flex-2 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-light font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-light disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm"
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
                          <h4 className="text-light font-bold text-lg mb-3">
                            Cadastro exclusivo para lojistas
                          </h4>
                          <p className="text-light/90 text-sm mb-4 leading-relaxed">
                            Como você é consumidor da marca, preparamos um
                            <strong className="text-accent">
                              {" "}
                              desconto especial de 10%
                            </strong>{" "}
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

                        {/* Botões de Navegação */}
                        <div className="flex gap-3 mt-6">
                          <button
                            type="button"
                            onClick={handlePrevStep}
                            className="flex-1 bg-accent hover:bg-accent/90 text-light font-medium py-3 px-4 rounded-xl transition-all duration-300 text-sm"
                          >
                            ← Voltar
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(
                                "https://www.onbongo.com.br",
                                "_blank",
                              );
                              // Simular submissão sem event real para evitar refresh
                              setIsSubmitted(true);
                              setTimeout(() => {
                                setIsSubmitted(false);
                                setFormData({
                                  nomeCompleto: "",
                                  whatsapp: "",
                                  tipoCadastro: "" as any,
                                  cnpj: "",
                                });
                                setCurrentStep(1);
                              }, 4000);
                            }}
                            className="flex-2 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-light font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-light text-sm shadow-lg"
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
      </div>
    </section>
  );
}
