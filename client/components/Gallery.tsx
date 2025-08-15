import { memo } from "react";
import { scrollToFormulario } from "../lib/scroll";

const Gallery = memo(function Gallery() {
  const images = [
    {
      src: "https://cdn.builder.io/api/v1/image/assets%2F3a038822502b49b39691cbaf44da5f95%2F18b03e30946f4e8db2dd2c12fbda16fe?format=webp&width=800",
      alt: "Modelos ONBONGO em ambiente urbano",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets%2F3a038822502b49b39691cbaf44da5f95%2F3213a82af55245348a235e54da012a3a?format=webp&width=800",
      alt: "Trio de modelos usando streetwear ONBONGO",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets%2F3a038822502b49b39691cbaf44da5f95%2F7eca28c60e424a2180bd034ff07f329f?format=webp&width=800",
      alt: "Grupo de amigos com roupas ONBONGO",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets%2F3a038822502b49b39691cbaf44da5f95%2F5395ce2dddb14d82842c04a045791e6b?format=webp&width=800",
      alt: "Modelo feminino com camiseta amarela ONBONGO",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets%2F3a038822502b49b39691cbaf44da5f95%2F65de2c57bf534e20ac8c61e46377e248?format=webp&width=800",
      alt: "Trio de modelos com camisetas coloridas ONBONGO",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets%2F3a038822502b49b39691cbaf44da5f95%2F4e924379695743f68452714a2324db37?format=webp&width=800",
      alt: "Modelo masculino com jaqueta ONBONGO",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets%2F3a038822502b49b39691cbaf44da5f95%2Fbfbc372fdd674fdaa0f6af3f7293fc97?format=webp&width=800",
      alt: "Modelo masculino com moletom azul ONBONGO",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets%2F3a038822502b49b39691cbaf44da5f95%2Fa7c5ff33df164ac5996129eae3c706c8?format=webp&width=800",
      alt: "Modelo feminino com camiseta vermelha ONBONGO",
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 bg-light">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-3 sm:mb-4">
            <span className="text-dark">NOSSA</span>{" "}
            <span className="text-accent">GALERIA</span>
          </h2>
          <p className="text-muted text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Conheça o estilo único da ONBONGO através das nossas peças mais
            icônicas
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg sm:rounded-2xl group cursor-pointer transition-all duration-500 hover:scale-105 ${
                index === 0 || index === 3 ? "col-span-2 md:row-span-2" : ""
              }`}
            >
              <div className="aspect-square md:aspect-auto md:h-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover Effect */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <div className="bg-accent text-light px-4 py-2 rounded-lg font-bold text-sm">
                    ONBONGO
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-8 sm:mt-12 md:mt-16">
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-dark mb-3 sm:mb-4">
            FAÇA PARTE DESSA HISTÓRIA
          </h3>
          <p className="text-muted text-sm sm:text-base mb-4 sm:mb-6 max-w-xl mx-auto px-2">
            Torne-se um lojista oficial e leve o streetwear autêntico da ONBONGO
            para seus clientes
          </p>
          <button
            className="bg-accent hover:bg-accent/90 text-light font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            onClick={scrollToFormulario}
          >
            Começar Cadastro →
          </button>
        </div>
      </div>
    </section>
  );
});

export default Gallery;
