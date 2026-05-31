import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import VaultLogo from "@/components/VaultLogo";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full max-w-4xl px-4 mx-auto relative min-h-screen">
      <Navbar showLinks={true} />
      <Hero />
    </div>
  );
}
