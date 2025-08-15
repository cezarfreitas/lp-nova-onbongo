import { memo } from "react";

const HistorySection = memo(function HistorySection() {
  return (
    <section className="py-20 px-4 bg-dark text-light relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-9xl font-display font-black text-accent/20 select-none">
          ONBONGO
        </div>
        <div className="absolute bottom-20 right-10 text-9xl font-display font-black text-accent/20 select-none transform rotate-180">
          ONBONGO
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-light">NOSSA</span>
            <br />
            <span className="text-accent">HISTÓRIA</span>
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-light/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Mais de três décadas moldando a cultura do streetwear brasileiro
          </p>
        </div>

        {/* Timeline */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Left side - Image/Visual */}
          <div className="order-2 md:order-1">
            <div className="relative">
              <div className="bg-accent/20 rounded-3xl p-8 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-8xl md:text-9xl font-display font-black text-accent mb-4">
                    1991
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-light mb-4">
                    O INÍCIO
                  </h3>
                  <p className="text-light/80 text-lg leading-relaxed">
                    Fundada em São Paulo, a ONBONGO nasceu da paixão pelo surf e pela cultura urbana brasileira.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="order-1 md:order-2">
            <h3 className="text-3xl md:text-4xl font-display font-bold text-light mb-6">
              NASCEU DO ASFALTO
            </h3>
            <div className="space-y-6 text-light/90 text-lg leading-relaxed">
              <p>
                No início dos anos 90, quando o streetwear ainda era um conceito 
                emergente no Brasil, a <strong className="text-accent">ONBONGO</strong> ousou 
                ser diferente. Nascida das ruas de São Paulo, trouxe uma nova 
                perspectiva para a moda urbana brasileira.
              </p>
              <p>
                Com raízes no surf e na cultura skate, rapidamente se tornou 
                referência nacional, conquistando jovens que buscavam autenticidade 
                e atitude em suas roupas.
              </p>
            </div>
          </div>
        </div>

        {/* Evolution Section */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Left side - Content */}
          <div>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-light mb-6">
              EVOLUÇÃO CONSTANTE
            </h3>
            <div className="space-y-6 text-light/90 text-lg leading-relaxed">
              <p>
                Ao longo de mais de 30 anos, a ONBONGO se reinventou constantemente, 
                sempre mantendo sua essência rebelde e autêntica. Das praias 
                paulistas às passarelas nacionais.
              </p>
              <p>
                Hoje, somos reconhecidos como uma das <strong className="text-accent">
                maiores marcas de streetwear do Brasil</strong>, com presença em 
                todo território nacional e projeção internacional.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mt-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-accent mb-2">
                  30+
                </div>
                <p className="text-light/70 text-sm uppercase tracking-wide">
                  Anos de História
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-accent mb-2">
                  1000+
                </div>
                <p className="text-light/70 text-sm uppercase tracking-wide">
                  Lojistas Parceiros
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div>
            <div className="relative">
              <div className="bg-gradient-to-br from-accent/30 to-accent/10 rounded-3xl p-8 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-6xl md:text-7xl font-display font-black text-light mb-4">
                    2024
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-light mb-4">
                    HOJE
                  </h3>
                  <p className="text-light/80 text-lg leading-relaxed">
                    Líder em streetwear nacional, expandindo horizontes e 
                    conectando culturas através da moda urbana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-display font-bold text-light mb-12">
            NOSSOS VALORES
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-light/5 rounded-2xl p-8 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-105">
                <div className="text-4xl mb-4">🔥</div>
                <h4 className="text-xl font-bold text-light mb-3">AUTENTICIDADE</h4>
                <p className="text-light/70 leading-relaxed">
                  Mantemos nossa essência desde o primeiro dia, sem compromissos com modismos passageiros.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-light/5 rounded-2xl p-8 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-105">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-bold text-light mb-3">INOVAÇÃO</h4>
                <p className="text-light/70 leading-relaxed">
                  Sempre à frente, criando tendências e redefinindo os limites do streetwear.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-light/5 rounded-2xl p-8 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-105">
                <div className="text-4xl mb-4">🌎</div>
                <h4 className="text-xl font-bold text-light mb-3">COMUNIDADE</h4>
                <p className="text-light/70 leading-relaxed">
                  Construímos uma família de lojistas e consumidores que compartilham nossa paixão.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-light mb-6">
            FAÇA PARTE DESSA JORNADA
          </h3>
          <p className="text-light/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Junte-se aos lojistas que já fazem parte da nossa história e 
            ajude a escrever o futuro do streetwear brasileiro.
          </p>
          <button
            onClick={() => {
              document.querySelector("#cadastro-section")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="bg-accent hover:bg-accent/90 text-light font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Tornar-se Lojista →
          </button>
        </div>
      </div>
    </section>
  );
});

export default HistorySection;
