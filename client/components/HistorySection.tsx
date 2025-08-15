import { memo } from "react";
import { scrollToFormulario } from "../lib/scroll";

const HistorySection = memo(function HistorySection() {
  return (
    <section className="py-8 sm:py-12 pb-16 sm:pb-20 md:pb-24 px-4 bg-accent text-dark">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
          <span className="text-dark">NOSSA </span>
          <span className="text-light">HISTÓRIA</span>
        </h2>

        {/* Content */}
        <p className="text-dark/90 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
          Desde <strong className="text-light">1991</strong>, a ONBONGO moldou a
          cultura do streetwear brasileiro. Nascida das ruas de São Paulo, hoje
          somos uma das{" "}
          <strong className="text-light">
            maiores marcas de streetwear do Brasil
          </strong>
          , conectando mais de 1000 lojistas em todo o território nacional.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-md mx-auto mb-6 sm:mb-8">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-light mb-1">
              30+
            </div>
            <p className="text-dark/70 text-xs sm:text-sm uppercase tracking-wide">
              Anos de História
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-light mb-1">
              1000+
            </div>
            <p className="text-dark/70 text-xs sm:text-sm uppercase tracking-wide">
              Lojistas Parceiros
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={scrollToFormulario}
          className="bg-dark hover:bg-dark/90 text-light font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-all duration-300 hover:scale-105"
        >
          Fazer Parte da História →
        </button>
      </div>
    </section>
  );
});

export default HistorySection;
