export default function Hero() {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden"
      style={{
        backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F3a038822502b49b39691cbaf44da5f95%2F1f3eb1c3a8294b5c80dc9e6a9c631a47?format=webp&width=1920')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <svg 
            viewBox="0 0 200 40" 
            className="h-8 mx-auto fill-white"
            aria-label="ONBONGO"
          >
            <text 
              x="100" 
              y="25" 
              textAnchor="middle" 
              className="text-lg font-bold tracking-wider"
              fill="white"
            >
              ONBONGO
            </text>
          </svg>
        </div>

        {/* Subtitle */}
        <p className="text-sm md:text-base mb-8 opacity-90 max-w-2xl mx-auto">
          Aproveite a oportunidade. Vender uma das maiores marcas do Brasil e do mundo.
        </p>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <div className="mb-2">SEJA UM</div>
          <div className="mb-2">LOJISTA OFICIAL</div>
          <div className="text-orange-500">ONBONGO</div>
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
          Cadastre-se agora e tenha acesso à nossa plataforma digital com preços exclusivos para lojistas.
        </p>

        {/* CTA Button */}
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-md text-lg transition-colors duration-200 mb-12">
          Começar Agora →
        </button>

        {/* Bottom text */}
        <p className="text-xs md:text-sm opacity-70 tracking-widest">
          MARCAS LÍDER EM STREETWEAR
        </p>
      </div>
    </section>
  );
}
