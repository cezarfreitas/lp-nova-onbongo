export default function Hero() {
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
      <div className="absolute inset-0 bg-dark/60"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-light px-4 max-w-5xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-wide text-light">
            ONBONGO
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-sm md:text-base mb-10 text-light/90 max-w-3xl mx-auto font-normal leading-relaxed">
          Aproveite a oportunidade de vender uma das maiores marcas do Brasil e
          do mundo.
        </p>

        {/* Main heading */}
        <h1 className="font-display font-bold mb-8 leading-tight">
          <div className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl mb-2 text-light">
            SEJA UM
          </div>
          <div className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl mb-2 text-light">
            LOJISTA OFICIAL
          </div>
          <div className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-accent">
            ONBONGO
          </div>
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg mb-10 text-light/90 max-w-2xl mx-auto leading-relaxed font-normal">
          Cadastre-se agora e tenha acesso à nossa plataforma digital com
          <br className="hidden md:block" />
          preços exclusivos para lojistas.
        </p>

        {/* CTA Button */}
        <button className="bg-accent hover:bg-accent/90 text-light font-bold px-8 py-4 rounded-lg text-base md:text-lg transition-all duration-300 mb-12 tracking-wide hover:scale-105">
          Começar Agora! →
        </button>

        {/* Bottom text */}
        <p className="text-xs md:text-sm text-muted tracking-extra-wide font-medium uppercase">
          Marca Líder em Streetwear
        </p>
      </div>
    </section>
  );
}
