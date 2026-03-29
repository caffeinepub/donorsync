import { HandHeart, Home, MapPin, Menu } from "lucide-react";

export type BottomNavTab = "home" | "donation" | "nearme" | "menu";

interface BottomNavProps {
  active: BottomNavTab;
  onChange: (tab: BottomNavTab) => void;
  pendingCount?: number;
}

export function BottomNav({
  active,
  onChange,
  pendingCount = 0,
}: BottomNavProps) {
  const items: { id: BottomNavTab; icon: React.ReactNode; label: string }[] = [
    { id: "menu", icon: <Menu className="w-5 h-5" />, label: "Menu" },
    { id: "home", icon: <Home className="w-5 h-5" />, label: "Home" },
    {
      id: "donation",
      icon: <HandHeart className="w-5 h-5" />,
      label: "Donation",
    },
    { id: "nearme", icon: <MapPin className="w-5 h-5" />, label: "Near Me" },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-card shadow-card rounded-full px-3 py-2 border border-border">
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          onClick={() => onChange(item.id)}
          data-ocid={`bottom_nav.${item.id}.button`}
          className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-full transition-all ${
            active === item.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {item.icon}
          <span className="text-[10px] font-medium">{item.label}</span>
          {item.id === "menu" && pendingCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
