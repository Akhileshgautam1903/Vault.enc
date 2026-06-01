import { Button } from "@/components/ui/button";
import Link from "next/link";

type NavbarProps = {
  showLinks?: boolean;
};

const Navbar = ({ showLinks = false }: NavbarProps) => {
  return (
    <nav className="flex justify-between items-center pt-6 font-serif">
      <h1 className="text-4xl font-serif">
        Vault<span className="accent-text">.enc</span>
      </h1>
      {showLinks && (
        <div className="flex items-center gap-4 text-lg">
          <a href="">Security</a>
          <a href="">How it works</a>
          <a href="">FAQs</a>
          <Button className="text-lg" asChild>
            <Link href="/setup">Start Fresh</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
