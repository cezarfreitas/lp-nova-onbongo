import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import CadastroSection from "@/components/CadastroSection";
import SEO from "@/components/SEO";
import TrackingScripts, { conversionEvents } from "@/components/TrackingScripts";
import { useEffect } from "react";

export default function Index() {
  return (
    <>
      <SEO />
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
