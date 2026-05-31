import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="my-12 text-center">
      <h1 className="text-5xl font-serif mb-6">
        Your passowrds never leave your{" "}
        <span className="accent-text">machine.</span>
      </h1>
      <p className="mb-6">
        Every other password manager stores your data on their servers. <br />
        We don't even have servers. <br />
        Just you and an encrypted file on your machine.
      </p>
      <div className="w-full flex justify-center gap-4 font-serif">
        <Button className="text-lg" asChild>
          <Link href="/setup">Start Fresh</Link>
        </Button>
        <Button className="text-lg" variant="secondary" asChild>
          <Link href="/unlock">Unlock your vault</Link>
        </Button>
      </div>
    </section>
  );
};

export default Hero;
