import { useEffect } from "react";
import Hero from "@/components/Hero";
import HistorySection from "@/components/HistorySection";
import Gallery from "@/components/Gallery";
import CadastroSection from "@/components/CadastroSection";
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
        <HistorySection />
        <div id="cadastro-section">
          <CadastroSection />
        </div>
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
