import { memo } from "react";

const Hero = memo(function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-dark overflow-hidden font-sans"
      style={{
        backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F3a038822502b49b39691cbaf44da5f95%2F42ac2ec840624b249706d0cad3540fd8?format=webp&width=1920')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-dark/70"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-light px-4 max-w-6xl mx-auto">
        {/* Logo */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-super-wide text-light">
            ONBONGO
          </h1>
        </header>

        {/* Subtitle */}
        <p className="text-base md:text-lg mb-8 text-light/85 max-w-4xl mx-auto font-medium leading-relaxed tracking-wide">
          Aproveite a oportunidade. Vender uma das maiores marcas do Brasil e do
          mundo.
        </p>

        {/* Main heading - Tipografia melhorada */}
        <h2 className="font-display font-black mb-6 leading-none tracking-tight">
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-1 text-light drop-shadow-lg">
            SEJA UM
          </div>
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-1 text-light drop-shadow-lg">
            LOJISTA OFICIAL
          </div>
          <div
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-accent drop-shadow-2xl"
            style={{
              textShadow:
                "0 4px 8px rgba(255, 107, 53, 0.3), 0 8px 16px rgba(0, 0, 0, 0.5)",
            }}
          >
            ONBONGO
          </div>
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl mb-10 text-light/90 max-w-3xl mx-auto leading-relaxed font-medium tracking-wide">
          Cadastre-se agora e tenha acesso à nossa plataforma digital com
          <br className="hidden md:block" />
          preços exclusivos para lojistas.
        </p>

        {/* CTA Button - melhorado */}
        <button
          className="hero-button bg-accent hover:bg-accent/90 text-light font-bold px-10 py-5 rounded-xl text-lg md:text-xl transition-all duration-300 mb-12 tracking-wide hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent/50 shadow-2xl"
          type="button"
          aria-label="Começar cadastro como lojista ONBONGO"
          style={{
            boxShadow:
              "0 8px 24px rgba(255, 107, 53, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          Começar Agora! →
        </button>

        {/* Bottom text */}
        <footer>
          <p className="text-sm md:text-base text-light/60 tracking-super-wide font-bold uppercase">
            MARCA LÍDER EM STREETWEAR
          </p>
        </footer>
      </div>
    </section>
  );
});

export default Hero;
