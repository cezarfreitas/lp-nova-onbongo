export default function Hero() {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden font-sans"
      style={{
        backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F3a038822502b49b39691cbaf44da5f95%2F42ac2ec840624b249706d0cad3540fd8?format=webp&width=1920')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        {/* Logo */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-normal tracking-super-wide text-white">
            ONBONGO
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-sm md:text-base lg:text-lg mb-12 text-white/80 max-w-3xl mx-auto font-light tracking-wide leading-relaxed">
          Aproveite a oportunidade. Vender uma das maiores marcas do Brasil e do mundo.
        </p>

        {/* Main heading */}
        <h1 className="font-display font-normal mb-8 leading-none tracking-wide">
          <div className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl mb-3 text-white">SEJA UM</div>
          <div className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl mb-3 text-white">LOJISTA OFICIAL</div>
          <div className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-orange-500 drop-shadow-lg">ONBONGO</div>
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg lg:text-xl mb-12 text-white/85 max-w-3xl mx-auto leading-relaxed font-normal tracking-wide">
          Cadastre-se agora e tenha acesso à nossa plataforma digital com<br className="hidden md:block" />
          preços exclusivos para lojistas.
        </p>

        {/* CTA Button */}
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-5 rounded-lg text-lg md:text-xl transition-all duration-300 mb-16 tracking-wide hover:scale-105 hover:shadow-xl shadow-orange-500/20">
          Começar Agora →
        </button>

        {/* Bottom text */}
        <p className="text-xs md:text-sm text-white/60 tracking-extra-wide font-medium uppercase">
          Marcas Líder em Streetwear
        </p>
      </div>
    </section>
  );
}
