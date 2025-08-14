import { useState } from "react";

export default function CadastroSection() {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    whatsapp: "",
    tipoCadastro: "lojista",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData);
    // Aqui você pode adicionar a lógica de envio
  };

  const beneficios = [
    {
      icon: "🌍",
      titulo: "Marca Internacional",
      descricao:
        "Reconhecida uma marca de streetwear reconhecida mundialmente com mais de 30 anos de história.",
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
                <div key={index} className="flex items-start gap-4">
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
            <div className="bg-accent rounded-2xl p-8 max-w-md mx-auto lg:mx-0">
              <h3 className="text-light font-bold text-2xl mb-2">
                Cadastre-se Agora
              </h3>
              <p className="text-light/90 text-sm mb-8">
                Comece sua jornada como lojista oficial ONBONGO
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome Completo */}
                <div>
                  <label
                    htmlFor="nomeCompleto"
                    className="block text-light font-medium mb-2"
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
                    className="w-full px-4 py-3 rounded-lg bg-light text-dark placeholder:text-muted border-none focus:outline-none focus:ring-2 focus:ring-dark"
                    required
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label
                    htmlFor="whatsapp"
                    className="block text-light font-medium mb-2"
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
                    className="w-full px-4 py-3 rounded-lg bg-light text-dark placeholder:text-muted border-none focus:outline-none focus:ring-2 focus:ring-dark"
                    required
                  />
                </div>

                {/* Tipo de Cadastro */}
                <div>
                  <label className="block text-light font-medium mb-4">
                    Tipo de Cadastro *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="tipoCadastro"
                        value="lojista"
                        checked={formData.tipoCadastro === "lojista"}
                        onChange={handleInputChange}
                        className="mr-3 w-4 h-4 text-dark"
                      />
                      <div>
                        <div className="text-light font-medium">
                          Sou Lojista
                        </div>
                        <div className="text-light/70 text-sm">
                          Tenho CNPJ e quero revender
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="tipoCadastro"
                        value="consumidor"
                        checked={formData.tipoCadastro === "consumidor"}
                        onChange={handleInputChange}
                        className="mr-3 w-4 h-4 text-dark"
                      />
                      <div>
                        <div className="text-light font-medium">
                          Sou Consumidor
                        </div>
                        <div className="text-light/70 text-sm">
                          Quero comprar para uso próprio
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Botão Submit */}
                <button
                  type="submit"
                  className="w-full bg-dark hover:bg-dark/90 text-light font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-light"
                >
                  ⭐ Começar Agora! →
                </button>

                {/* Termos */}
                <p className="text-light/60 text-xs text-center leading-relaxed">
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
