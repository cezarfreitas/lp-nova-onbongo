import { useState } from "react";

interface FormData {
  nomeCompleto: string;
  whatsapp: string;
  tipoCadastro: "lojista" | "consumidor";
}

interface FormErrors {
  nomeCompleto?: string;
  whatsapp?: string;
}

export default function CadastroSection() {
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: "",
    whatsapp: "",
    tipoCadastro: "lojista",
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

  // Validações
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Nome completo
    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = "Nome completo é obrigatório";
    } else if (formData.nomeCompleto.trim().length < 3) {
      newErrors.nomeCompleto = "Nome deve ter pelo menos 3 caracteres";
    }

    // WhatsApp
    const whatsappNumbers = formData.whatsapp.replace(/\D/g, "");
    if (!whatsappNumbers) {
      newErrors.whatsapp = "WhatsApp é obrigatório";
    } else if (whatsappNumbers.length !== 11) {
      newErrors.whatsapp = "WhatsApp deve ter 11 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar máscara para WhatsApp
    if (name === "whatsapp") {
      formattedValue = formatWhatsApp(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Limpar erro do campo quando usuário começar a digitar
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular envio para API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Dados do formulário:", formData);
      setIsSubmitted(true);

      // Reset form após sucesso
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          nomeCompleto: "",
          whatsapp: "",
          tipoCadastro: "lojista",
        });
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
      descricao:
        "Reconhecida marca de streetwear mundialmente com mais de 30 anos de história.",
    },
    {
      icon: "📦",
      titulo: "Pronta Entrega",
      descricao:
        "Mais de 100.000 itens disponíveis para envio imediato em todo o Brasil.",
    },
    {
      icon: "💻",
      titulo: "Plataforma Digital",
      descricao:
        "Acesse nosso catálogo digital 24/7 com preços exclusivos para lojistas.",
    },
    {
      icon: "🎯",
      titulo: "Suporte Completo",
      descricao:
        "Treinamento, materiais de marketing e suporte comercial especializado.",
    },
  ];

  if (isSubmitted) {
    return (
      <section className="min-h-screen bg-dark py-16 px-4 flex items-center justify-center">
        <div className="text-center text-light max-w-md">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="font-display text-3xl font-bold text-accent mb-4">
            Cadastro Realizado!
          </h2>
          <p className="text-light/80 mb-6">
            Recebemos seus dados e em breve nossa equipe entrará em contato via
            WhatsApp para finalizar seu cadastro.
          </p>
          <div className="bg-accent/20 p-4 rounded-lg">
            <p className="text-light/70 text-sm">
              ⏱️ Tempo médio de resposta: 2 horas úteis
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-dark py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Lado Esquerdo - Benefícios */}
          <div className="text-light">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-light">SEJA UM</span>
              <br />
              <span className="text-accent">LOJISTA OFICIAL</span>
              <br />
              <span className="text-light">ONBONGO</span>
            </h2>

            <p className="text-light/80 text-lg mb-12 leading-relaxed">
              Junte-se aos melhores lojistas do Brasil e tenha acesso exclusivo
              aos produtos da marca líder em streetwear.
            </p>

            <div className="space-y-8">
              {beneficios.map((beneficio, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 transform hover:translate-x-2 transition-transform duration-300"
                >
                  <div className="bg-accent rounded-lg p-3 text-2xl flex-shrink-0">
                    {beneficio.icon}
                  </div>
                  <div>
                    <h3 className="text-light font-bold text-xl mb-2">
                      {beneficio.titulo}
                    </h3>
                    <p className="text-light/70 leading-relaxed">
                      {beneficio.descricao}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lado Direito - Formulário */}
          <div className="lg:pl-8">
            <div className="bg-accent rounded-3xl p-8 max-w-md mx-auto lg:mx-0 shadow-2xl">
              <h3 className="text-light font-bold text-2xl mb-2 text-center">
                Cadastre-se Agora
              </h3>
              <p className="text-light/90 text-center mb-8">
                Comece sua jornada como lojista oficial Onbongo
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome Completo */}
                <div>
                  <label
                    htmlFor="nomeCompleto"
                    className="block text-light font-medium mb-3"
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
                    className="w-full px-4 py-4 rounded-2xl bg-light text-dark placeholder:text-muted border-none focus:outline-none focus:ring-2 focus:ring-dark text-base"
                    disabled={isLoading}
                  />
                  {errors.nomeCompleto && (
                    <p className="text-red-200 text-sm mt-2">
                      {errors.nomeCompleto}
                    </p>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <label
                    htmlFor="whatsapp"
                    className="block text-light font-medium mb-3"
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
                    className="w-full px-4 py-4 rounded-2xl bg-light text-dark placeholder:text-muted border-none focus:outline-none focus:ring-2 focus:ring-dark text-base"
                    disabled={isLoading}
                  />
                  {errors.whatsapp && (
                    <p className="text-red-200 text-sm mt-2">
                      {errors.whatsapp}
                    </p>
                  )}
                </div>

                {/* Tipo de Cadastro */}
                <div>
                  <label className="block text-light font-medium mb-4">
                    Tipo de Cadastro *
                  </label>
                  <div className="space-y-3">
                    <label className="block cursor-pointer">
                      <div
                        className={`p-4 rounded-2xl transition-all duration-300 ${
                          formData.tipoCadastro === "lojista"
                            ? "bg-dark/30 border-2 border-light/20"
                            : "bg-dark/20 border-2 border-transparent hover:bg-dark/25"
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
                              disabled={isLoading}
                            />
                            <div
                              className={`w-5 h-5 rounded-full border-2 ${
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
                            <div className="text-light font-medium">
                              Sou Lojista
                            </div>
                            <div className="text-light/70 text-sm">
                              Tenho CNPJ e quero revender
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="block cursor-pointer">
                      <div
                        className={`p-4 rounded-2xl transition-all duration-300 ${
                          formData.tipoCadastro === "consumidor"
                            ? "bg-dark/30 border-2 border-light/20"
                            : "bg-dark/20 border-2 border-transparent hover:bg-dark/25"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="relative mr-3">
                            <input
                              type="radio"
                              name="tipoCadastro"
                              value="consumidor"
                              checked={formData.tipoCadastro === "consumidor"}
                              onChange={() => handleTipoChange("consumidor")}
                              className="sr-only"
                              disabled={isLoading}
                            />
                            <div
                              className={`w-5 h-5 rounded-full border-2 ${
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
                            <div className="text-light font-medium">
                              Sou Consumidor
                            </div>
                            <div className="text-light/70 text-sm">
                              Quero comprar para uso próprio
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Botão Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-dark hover:bg-dark/90 disabled:bg-dark/50 text-light font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-light disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-light"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      ✓ Começar Agora! →
                    </>
                  )}
                </button>

                {/* Termos */}
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
