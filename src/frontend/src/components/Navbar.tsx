import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface NavbarProps {
  onSignIn: () => void;
  onDonate: () => void;
}

export function Navbar({ onSignIn, onDonate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 mx-4 mt-3 bg-card rounded-2xl shadow-card">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
          <Heart className="w-5 h-5 text-primary fill-primary/30" />
        </div>
        <span className="font-display font-bold text-lg text-foreground">
          DonorSync
        </span>
      </div>

      {/* Center nav (desktop) */}
      <nav className="hidden md:flex items-center gap-6">
        {[
          "Admin Dashboard",
          "Hospitals",
          "Doctors",
          "Trusts/Charities",
          "Public Donors",
        ].map((item) => (
          <button
            type="button"
            key={item}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="rounded-full border-primary/30 text-primary hover:bg-primary/5 text-sm px-4"
          onClick={onSignIn}
          data-ocid="nav.signin.button"
        >
          Sign In
        </Button>
        <Button
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm px-4"
          onClick={onDonate}
          data-ocid="nav.donate.button"
        >
          Donate Now
        </Button>
      </div>
    </header>
  );
}
