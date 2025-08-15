import { memo } from "react";

const HistorySection = memo(function HistorySection() {
  return (
    <section className="py-12 px-4 bg-dark text-light">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
          <span className="text-light">NOSSA </span>
          <span className="text-accent">HISTÓRIA</span>
        </h2>

        {/* Content */}
        <p className="text-light/90 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
          Desde <strong className="text-accent">1991</strong>, a ONBONGO moldou a cultura do streetwear brasileiro.
          Nascida das ruas de São Paulo, hoje somos uma das <strong className="text-accent">maiores marcas
          de streetwear do Brasil</strong>, conectando mais de 1000 lojistas em todo o território nacional.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-8 max-w-md mx-auto mb-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-accent mb-1">
              30+
            </div>
            <p className="text-light/70 text-sm uppercase tracking-wide">
              Anos de História
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-accent mb-1">
              1000+
            </div>
            <p className="text-light/70 text-sm uppercase tracking-wide">
              Lojistas Parceiros
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            document.querySelector("#cadastro-section")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          className="bg-accent hover:bg-accent/90 text-light font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
        >
          Fazer Parte da História →
        </button>
      </div>
    </section>
  );
});

export default HistorySection;
