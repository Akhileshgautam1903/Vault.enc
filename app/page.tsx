import FAQ from "@/components/landing/FAQ";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Navbar from "@/components/landing/Navbar";

export default function Home() {
  return (
    <div className="w-full max-w-6xl px-4 mx-auto relative min-h-screen">
      <Navbar showLinks={true} />
      <main className="space-y-24 mt-8">
        <Hero />
        <HowItWorks />
        <Features />
        <FAQ />
        <Footer />
      </main>
    </div>
  );
}
