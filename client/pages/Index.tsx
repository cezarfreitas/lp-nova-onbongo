import { useEffect } from "react";
import Hero from "@/components/Hero";
import HistorySection from "@/components/HistorySection";
import Gallery from "@/components/Gallery";
import FormularioLojista from "@/components/FormularioLojista";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function Index() {
  // Garantir que a página sempre carregue do topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO />
      <main className="min-h-screen">
        <Hero />
        <div id="cadastro-section">
          <FormularioLojista />
        </div>
        <Gallery />
        <HistorySection />
      </main>
      <Footer />
    </>
  );
}
