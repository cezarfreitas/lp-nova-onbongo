import Hero from "@/components/Hero";
import SEO from "@/components/SEO";

export default function Index() {
  return (
    <>
      <SEO />
      <main className="min-h-screen">
        <Hero />
      </main>
    </>
  );
}
