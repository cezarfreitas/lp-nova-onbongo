import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({
  title = "ONBONGO - Seja um Lojista Oficial | Maior Marca de Streetwear do Brasil",
  description = "Torne-se um lojista oficial ONBONGO e venda uma das maiores marcas de streetwear do Brasil. Acesso exclusivo à plataforma digital com preços especiais para lojistas.",
  keywords = "ONBONGO, lojista oficial, streetwear, marca brasileira, revenda, roupas urbanas, moda masculina, surf wear",
  image = "https://lojista.onbongo.com.br/og-image.jpg",
  url = "https://lojista.onbongo.com.br",
  type = "website",
}: SEOProps) {
  useEffect(() => {
    // Atualizar title
    document.title = title;

    // Atualizar meta tags dinâmicamente
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement("meta");
        if (property) {
          meta.setAttribute("property", name);
        } else {
          meta.setAttribute("name", name);
        }
        document.head.appendChild(meta);
      }

      meta.content = content;
    };

    // SEO básico
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Open Graph
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", image, true);
    updateMetaTag("og:url", url, true);
    updateMetaTag("og:type", type, true);

    // Twitter Card
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);
    updateMetaTag("twitter:url", url);

    // Canonical URL
    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, keywords, image, url, type]);

  return null;
}
