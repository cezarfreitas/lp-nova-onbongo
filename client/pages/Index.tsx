import Hero from "@/components/Hero";
import HistorySection from "@/components/HistorySection";
import Gallery from "@/components/Gallery";
import FormularioLojista from "@/components/FormularioLojista";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import TrackingScripts from "@/components/TrackingScripts";
import GA4Test from "@/components/GA4Test";

export default function Index() {
  // useEffect removido para evitar flash na página

  return (
    <>
      <SEO />
      <TrackingScripts />
      <main className="min-h-screen">
        <Hero />
        <div id="cadastro-section">
          <FormularioLojista />
        </div>
        <Gallery />
        <HistorySection />
      </main>
      <Footer />
      <GA4Test />
    </>
  );
}
