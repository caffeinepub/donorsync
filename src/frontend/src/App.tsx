import { Toaster } from "@/components/ui/sonner";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { BottomNav, type BottomNavTab } from "./components/BottomNav";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  AppRole,
  useIsAdmin,
  useMyProfile,
  usePendingVerifications,
} from "./hooks/useQueries";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AuthPage } from "./pages/AuthPage";
import { DoctorDashboard } from "./pages/DoctorDashboard";
import { DonationScreen } from "./pages/DonationScreen";
import { HomeScreen } from "./pages/HomeScreen";
import { HospitalDashboard } from "./pages/HospitalDashboard";
import { LandingPage } from "./pages/LandingPage";
import { MenuScreen } from "./pages/MenuScreen";
import { NearMeScreen } from "./pages/NearMeScreen";
import { PublicUserDashboard } from "./pages/PublicUserDashboard";
import { TrustDashboard } from "./pages/TrustDashboard";

type AppScreen = "landing" | "auth" | "app";
type DashboardScreen =
  | "home"
  | "donation"
  | "nearme"
  | "menu"
  | "admin"
  | "hospital"
  | "trust"
  | "doctor"
  | "donor";

function AppShell() {
  const { identity, clear } = useInternetIdentity();
  const [screen, setScreen] = useState<AppScreen>("landing");
  const [activeTab, setActiveTab] = useState<BottomNavTab>("home");
  const [dashScreen, setDashScreen] = useState<DashboardScreen>("home");

  const { data: profile } = useMyProfile();
  const { data: isAdmin } = useIsAdmin();
  const { data: pending } = usePendingVerifications();

  useEffect(() => {
    if (identity && screen === "landing") {
      setScreen("app");
    }
  }, [identity, screen]);

  const handleLogout = () => {
    clear();
    setScreen("landing");
    setActiveTab("home");
    setDashScreen("home");
  };

  const handleMenuNavigate = (target: string) => {
    if (
      target === "admin" ||
      target === "hospital" ||
      target === "trust" ||
      target === "doctor" ||
      target === "donor"
    ) {
      setDashScreen(target as DashboardScreen);
    } else {
      setActiveTab("menu");
    }
  };

  const handleTabChange = (tab: BottomNavTab) => {
    setActiveTab(tab);
    if (tab !== "menu") {
      setDashScreen(tab as DashboardScreen);
    } else {
      setDashScreen("menu");
    }
  };

  const getDefaultDashboard = (): DashboardScreen => {
    if (isAdmin) return "admin";
    if (!profile) return "home";
    switch (profile.role) {
      case AppRole.Admin:
        return "admin";
      case AppRole.Hospital:
        return "hospital";
      case AppRole.Trust:
        return "trust";
      case AppRole.Doctor:
        return "doctor";
      case AppRole.PublicUser:
        return "home";
      default:
        return "home";
    }
  };

  if (screen === "landing") {
    return (
      <LandingPage
        onSignIn={() => setScreen("auth")}
        onGetStarted={() => setScreen("auth")}
      />
    );
  }

  if (screen === "auth") {
    return (
      <AuthPage
        onBack={() => setScreen("landing")}
        onSuccess={() => {
          const defaultDash = getDefaultDashboard();
          setDashScreen(defaultDash);
          setScreen("app");
        }}
      />
    );
  }

  const currentDash = dashScreen;

  return (
    <div className="min-h-screen bg-background">
      {/* App Header — vivid red gradient */}
      <header
        className="sticky top-0 z-40 red-beam px-4 py-3 flex items-center justify-between"
        style={{ boxShadow: "0 4px 24px oklch(0.52 0.22 27 / 0.45)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-white/60" />
          </div>
          <span className="font-display font-bold text-base text-white tracking-wide">
            DonorSync
          </span>
        </div>
        {profile && (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center"
              style={{ boxShadow: "0 0 8px oklch(1 0 0 / 0.3)" }}
            >
              <span className="font-bold text-xs text-white">
                {profile.name?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
            <span className="text-xs text-white/80 hidden sm:block">
              {profile.name}
            </span>
          </div>
        )}
      </header>

      {/* Main content */}
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDash}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {currentDash === "home" && <HomeScreen />}
            {currentDash === "donation" && <DonationScreen />}
            {currentDash === "nearme" && <NearMeScreen />}
            {currentDash === "menu" && (
              <MenuScreen
                onNavigate={handleMenuNavigate}
                onLogout={handleLogout}
              />
            )}
            {currentDash === "admin" && <AdminDashboard />}
            {currentDash === "hospital" && <HospitalDashboard />}
            {currentDash === "trust" && <TrustDashboard />}
            {currentDash === "doctor" && <DoctorDashboard />}
            {currentDash === "donor" && <PublicUserDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <BottomNav
        active={activeTab}
        onChange={handleTabChange}
        pendingCount={pending?.length ?? 0}
      />
    </div>
  );
}

export default function App() {
  return (
    <>
      <AppShell />
      <Toaster position="top-center" richColors />
    </>
  );
}
