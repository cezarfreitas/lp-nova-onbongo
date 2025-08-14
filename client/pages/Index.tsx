import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import CadastroSection from "@/components/CadastroSection";
import SEO from "@/components/SEO";
import TrackingScripts, { conversionEvents } from "@/components/TrackingScripts";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    // Track page view
    conversionEvents.pageView('Home - Cadastro Lojista');
  }, []);

  return (
    <>
      <SEO />
      <TrackingScripts />
      <main className="min-h-screen">
        <Hero />
        <div id="cadastro-section">
          <CadastroSection />
        </div>
        <Gallery />
      </main>
    </>
  );
}
