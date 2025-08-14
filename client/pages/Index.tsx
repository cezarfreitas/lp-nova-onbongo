import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import CadastroSection from "@/components/CadastroSection";
import SEO from "@/components/SEO";

export default function Index() {
  return (
    <>
      <SEO />
      <main className="min-h-screen">
        <Hero />
        <Gallery />
        <div id="cadastro-section">
          <CadastroSection />
        </div>
      </main>
    </>
  );
}
