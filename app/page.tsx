import FAQ from "@/components/landing/FAQ";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Navbar from "@/components/landing/Navbar";
import StatementBlock from "@/components/landing/StatementBlock";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(288, 100%, 85%, .08) 0, hsla(288, 100%, 55%, .02) 50%, hsla(288, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(288, 100%, 85%, .06) 0, hsla(288, 100%, 55%, .02) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(288, 100%, 85%, .06) 0, hsla(288, 100%, 55%, .02) 80%, transparent 100%)"
      />
      <main className="space-y-24 mt-8 w-full max-w-6xl px-4 mx-auto ">
        <Navbar showLinks={true} />
        <Hero />
        <StatementBlock />
        <HowItWorks />
        <Features />
        <FAQ />
        <Footer />
      </main>
    </div>
  );
}
