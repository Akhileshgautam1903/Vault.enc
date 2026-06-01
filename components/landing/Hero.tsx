import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <h1 className="text-4xl lg:text-7xl font-serif mb-6">
          Your passwords never leave your{" "}
          <span className="accent-text">system.</span>
        </h1>
        <p className="mb-4 text-base">
          Every other password manager stores your data on their servers. 
          We don't even have servers. 
          Just you and an encrypted file on your machine.
        </p>
        <div className="w-full flex gap-4 font-serif">
          <Button className="text-lg" asChild>
            <Link href="/setup">Start Fresh</Link>
          </Button>
          <Button className="text-lg" variant="outline" asChild>
            <Link href="/unlock">Unlock your vault</Link>
          </Button>
        </div>
      </div>
      <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900 aspect-video flex items-center justify-center text-zinc-600">
        Preview coming soon
      </div>
    </section>
  );
};

export default Hero;
