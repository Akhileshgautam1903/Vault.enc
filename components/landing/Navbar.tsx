"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type NavbarProps = {
  showLinks?: boolean;
};

const Navbar = ({ showLinks = false }: NavbarProps) => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className="font-serif">
      {/* Top row - always visible */}
      <nav className="flex justify-between items-center pt-6">
        <h1 className="text-4xl font-serif">
          Vault<span className="accent-text">.enc</span>
        </h1>
        {showLinks && (
          <>
            {/* Mobile hamburger */}
            <div className="lg:hidden">
              <Menu
                className="cursor-pointer"
                onClick={() => setToggleMenu((prev) => !prev)}
              />
            </div>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-4 text-lg">
              <a
                href="#how-it-works"
                className="hover:text-accent transition-all duration-150 ease-in-out hover:border-b border-b-accent"
              >
                How It Works
              </a>
              <a
                href="#features"
                className="hover:text-accent transition-all duration-150 ease-in-out hover:border-b border-b-accent"
              >
                Features
              </a>
              <a
                href="#faq"
                className="hover:text-accent transition-all duration-150 ease-in-out hover:border-b border-b-accent"
              >
                FAQs
              </a>
              <Button className="text-lg" asChild>
                <Link href="/setup">Start Fresh</Link>
              </Button>
            </div>
          </>
        )}
      </nav>

      {/* Mobile dropdown - sits BELOW the nav row */}
      {showLinks && toggleMenu && (
        <div className="flex flex-col lg:hidden gap-4 pt-4 text-lg border-b border-b-accent pb-4">
          <a href="">Security</a>
          <a href="">How it works</a>
          <a href="">FAQs</a>
          <Button asChild>
            <Link href="/setup">Start Fresh</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
