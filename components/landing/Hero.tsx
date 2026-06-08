import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const first_hero = (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <h1 className="text-5xl lg:text-7xl font-serif mb-6">
          Your passwords never leave your{" "}
          <span className="accent-text">system.</span>
        </h1>
        <p className="mb-4 text-base">
          Every other password manager stores your data on their servers. We
          don't even have servers. Just you and an encrypted file on your
          machine.
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
      <div className="relative w-full aspect-video rounded-xl border border-zinc-800 overflow-hidden">
        <Image
          src="/product_ss.png"
          alt="Screenshot of the product"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );

  const second_hero = (
    <section className="text-center pt-12 lg:pt-24 lg:pb-8">
      <h1 className="text-5xl lg:text-8xl font-serif mb-6 max-w-3xl mx-auto">
        Your passwords never leave your{" "}
        <span className="accent-text">system.</span>
      </h1>
      <p className="mb-4 text-sm lg:text-base max-w-xl mx-auto">
        Every other password manager stores your data on their servers. We don't
        even have servers. Just you and an encrypted file on your machine.
      </p>
      <div className="w-full flex gap-4 font-serif mb-8 lg:mb-30 justify-center">
        <Button className="text-lg" asChild>
          <Link href="/setup">Start Fresh</Link>
        </Button>
        <Button className="text-lg" variant="outline" asChild>
          <Link href="/unlock">Unlock your vault</Link>
        </Button>
      </div>
      <div className="relative w-full aspect-video rounded-xl border border-zinc-800 overflow-hidden">
        <Image
          src="/product_ss.png"
          alt="Screenshot of the product"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );

  return second_hero;
};

export default Hero;
