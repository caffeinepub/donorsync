import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  HandHeart,
  Heart,
  MapPin,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Navbar } from "../components/Navbar";

const CAUSE_CARDS = [
  {
    id: 1,
    image: "/assets/generated/donation-blood-bank.dim_400x300.jpg",
    title: "Emergency Blood Drive",
    hospital: "Apollo Hospitals, Mumbai",
    raised: 143,
    target: 200,
    urgency: "Critical",
  },
  {
    id: 2,
    image: "/assets/generated/donation-clothes.dim_400x300.jpg",
    title: "Winter Clothes Drive",
    hospital: "Helping Hands Trust",
    raised: 2800,
    target: 5000,
    urgency: "Active",
  },
  {
    id: 3,
    image: "/assets/generated/donation-essentials.dim_400x300.jpg",
    title: "Essential Supplies",
    hospital: "Seva Samiti Charity",
    raised: 45000,
    target: 100000,
    urgency: "Active",
  },
  {
    id: 4,
    image: "/assets/generated/donation-blood-bank.dim_400x300.jpg",
    title: "O- Blood Urgently Needed",
    hospital: "Fortis Healthcare",
    raised: 68,
    target: 100,
    urgency: "Critical",
  },
];

const HOSPITALS = [
  {
    id: 1,
    name: "Apollo Hospitals",
    distance: "1.2 km",
    datetime: "Tomorrow, 9:00 AM",
    bloodGroups: ["O+", "A-", "B+"],
    address: "Greams Road, Chennai",
  },
  {
    id: 2,
    name: "Fortis Healthcare",
    distance: "2.8 km",
    datetime: "Dec 28, 10:00 AM",
    bloodGroups: ["AB+", "O-"],
    address: "Bannerghatta Road, Bengaluru",
  },
  {
    id: 3,
    name: "AIIMS Delhi",
    distance: "4.5 km",
    datetime: "Dec 30, 8:00 AM",
    bloodGroups: ["A+", "B-", "O+"],
    address: "Ansari Nagar, New Delhi",
  },
];

interface LandingPageProps {
  onSignIn: () => void;
  onGetStarted: () => void;
}

export function LandingPage({ onSignIn, onGetStarted }: LandingPageProps) {
  const [carouselIdx, setCarouselIdx] = useState(0);
  const visibleCards = 3;
  const maxIdx = Math.max(0, CAUSE_CARDS.length - visibleCards);

  return (
    <div className="min-h-screen bg-background pb-10">
      <Navbar onSignIn={onSignIn} onDonate={onGetStarted} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Floating glow orbs */}
        <div
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.52 0.22 27 / 0.6) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 -right-24 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.52 0.22 27 / 0.5) 0%, transparent 70%)",
            animationDelay: "1s",
          }}
        />

        <div
          className="mx-4 mt-4 rounded-3xl overflow-hidden relative border"
          style={{
            borderColor: "oklch(0.52 0.22 27 / 0.2)",
            background:
              "linear-gradient(145deg, oklch(0.98 0.015 20) 0%, oklch(0.96 0.03 18) 100%)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8 px-8 py-12 md:py-16">
            {/* Left */}
            <motion.div
              className="flex-1 space-y-5"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                className="border-0 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  background: "oklch(0.50 0.22 27 / 0.12)",
                  color: "oklch(0.40 0.20 22)",
                }}
              >
                <Droplets className="w-3 h-3 mr-1" /> Trusted Donation Platform
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
                Together we{" "}
                <span
                  className="relative inline-block"
                  style={{
                    color: "oklch(0.50 0.22 27)",
                    textShadow: "0 0 32px oklch(0.52 0.22 27 / 0.4)",
                  }}
                >
                  save lives
                </span>{" "}
                every day
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-md">
                Connect with verified hospitals, doctors, and charities. Donate
                blood, money, clothes, or essentials — every drop, every rupee
                counts.
              </p>
              <div className="flex gap-3">
                <Button
                  className="pulse-glow rounded-full text-white px-7 py-5 text-base font-semibold transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.50 0.22 27), oklch(0.42 0.20 22))",
                  }}
                  onClick={onGetStarted}
                  data-ocid="hero.get_started.button"
                >
                  Get Started <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-7 py-5 text-base font-medium transition-all duration-200 hover:bg-primary/5"
                  style={{
                    borderColor: "oklch(0.52 0.22 27 / 0.35)",
                    color: "oklch(0.50 0.22 27)",
                  }}
                  onClick={onSignIn}
                  data-ocid="hero.signin.button"
                >
                  Sign In
                </Button>
              </div>
              {/* Stats row */}
              <div className="flex gap-7 pt-2">
                {[
                  { n: "50K+", l: "Donors" },
                  { n: "120+", l: "Hospitals" },
                  { n: "8.2K", l: "Lives Saved" },
                ].map((s) => (
                  <div key={s.l}>
                    <p
                      className="font-display font-extrabold text-2xl"
                      style={{
                        color: "oklch(0.50 0.22 27)",
                        textShadow: "0 0 14px oklch(0.52 0.22 27 / 0.3)",
                      }}
                    >
                      {s.n}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right image */}
            <motion.div
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div
                className="w-72 h-72 md:w-96 md:h-96 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] overflow-hidden"
                style={{
                  boxShadow:
                    "0 0 60px 0 oklch(0.52 0.22 27 / 0.35), 0 0 120px 0 oklch(0.52 0.22 27 / 0.15)",
                }}
              >
                <img
                  src="/assets/generated/hero-blood-donation.dim_600x500.jpg"
                  alt="Blood donation"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Urgent Needs Nearby */}
      <section className="mx-4 mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="font-display font-bold text-2xl"
              style={{
                borderLeft: "4px solid oklch(0.50 0.22 27)",
                paddingLeft: "12px",
              }}
            >
              Urgent Needs Nearby
            </h2>
            <p className="text-muted-foreground text-sm mt-1 pl-4">
              Active drives needing your help today
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-accent transition-colors"
              style={{ borderColor: "oklch(0.52 0.22 27 / 0.3)" }}
              onClick={() => setCarouselIdx((p) => Math.max(0, p - 1))}
              disabled={carouselIdx === 0}
              data-ocid="urgent_needs.prev.button"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.50 0.22 27), oklch(0.42 0.20 22))",
                boxShadow: "0 0 10px oklch(0.52 0.22 27 / 0.4)",
              }}
              onClick={() => setCarouselIdx((p) => Math.min(maxIdx, p + 1))}
              disabled={carouselIdx >= maxIdx}
              data-ocid="urgent_needs.next.button"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: `-${carouselIdx * (280 + 16)}px` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {CAUSE_CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                data-ocid={`urgent_needs.item.${i + 1}`}
                className="min-w-[280px] bg-white rounded-2xl overflow-hidden flex-shrink-0 glass-card glow-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    className={`absolute top-2 right-2 text-xs rounded-full font-semibold border-0 ${
                      card.urgency === "Critical"
                        ? "bg-primary text-primary-foreground"
                        : "bg-green-500 text-white"
                    }`}
                    style={
                      card.urgency === "Critical"
                        ? { boxShadow: "0 0 8px oklch(0.52 0.22 27 / 0.5)" }
                        : {}
                    }
                  >
                    {card.urgency}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground text-sm mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {card.hospital}
                  </p>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span
                        className="font-semibold"
                        style={{ color: "oklch(0.50 0.22 27)" }}
                      >
                        {card.raised}/{card.target}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(card.raised / card.target) * 100}%`,
                          background:
                            "linear-gradient(90deg, oklch(0.50 0.22 27), oklch(0.60 0.20 15))",
                          boxShadow: "0 0 6px oklch(0.52 0.22 27 / 0.4)",
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full rounded-full text-white text-xs h-8 font-semibold transition-all duration-200"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.50 0.22 27), oklch(0.42 0.20 22))",
                    }}
                    onClick={onGetStarted}
                    data-ocid={`urgent_needs.donate.button.${i + 1}`}
                  >
                    Donate Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lives Saved Stats */}
      <section className="mx-4 mt-10">
        <h2
          className="font-display font-bold text-2xl mb-2"
          style={{
            borderLeft: "4px solid oklch(0.50 0.22 27)",
            paddingLeft: "12px",
          }}
        >
          Impact So Far
        </h2>
        <p className="text-muted-foreground text-sm mb-6 pl-4">
          Real numbers. Real change.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <Heart className="w-6 h-6" />,
              label: "Lives Saved",
              value: "8,247",
              trend: "+12%",
            },
            {
              icon: <Users className="w-6 h-6" />,
              label: "Total Donors",
              value: "52,318",
              trend: "+8%",
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              label: "Active Programs",
              value: "341",
              trend: "+24%",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              data-ocid={`stats.item.${i + 1}`}
              className="bg-white rounded-2xl p-6 glass-card glow-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: "oklch(0.50 0.22 27 / 0.10)",
                    color: "oklch(0.50 0.22 27)",
                    boxShadow: "0 0 12px oklch(0.52 0.22 27 / 0.2)",
                  }}
                >
                  {stat.icon}
                </div>
                <Badge className="bg-green-100 text-green-700 border-0 text-xs rounded-full font-semibold">
                  {stat.trend}
                </Badge>
              </div>
              <p
                className="font-display font-extrabold text-3xl mt-3"
                style={{
                  color: "oklch(0.50 0.22 27)",
                  textShadow: "0 0 20px oklch(0.52 0.22 27 / 0.3)",
                }}
              >
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Nearby Hospitals */}
      <section className="mx-4 mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="font-display font-bold text-2xl"
              style={{
                borderLeft: "4px solid oklch(0.50 0.22 27)",
                paddingLeft: "12px",
              }}
            >
              Nearby Hospitals
            </h2>
            <p className="text-muted-foreground text-sm mt-1 pl-4">
              Active blood donation programs near you
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-sm rounded-full hover:bg-primary/5"
            style={{ color: "oklch(0.50 0.22 27)" }}
            onClick={onSignIn}
          >
            View all <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Map placeholder */}
        <div
          className="rounded-2xl overflow-hidden h-48 flex items-center justify-center mb-4 relative"
          style={{
            background: "oklch(0.96 0.025 18)",
            border: "1px solid oklch(0.52 0.22 27 / 0.15)",
          }}
        >
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-5 opacity-10">
            {Array.from({ length: 40 }, (_, i) => i).map((i) => (
              <div key={i} className="border border-muted-foreground/30" />
            ))}
          </div>
          {HOSPITALS.map((h, i) => (
            <div
              key={h.id}
              className="absolute flex flex-col items-center"
              style={{ left: `${20 + i * 28}%`, top: `${30 + (i % 2) * 25}%` }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.50 0.22 27), oklch(0.42 0.20 22))",
                  boxShadow: "0 0 10px oklch(0.52 0.22 27 / 0.5)",
                }}
              >
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] bg-white px-1.5 py-0.5 rounded mt-1 shadow-sm font-semibold whitespace-nowrap">
                {h.name}
              </span>
            </div>
          ))}
          <div
            className="z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl"
            style={{ border: "1px solid oklch(0.52 0.22 27 / 0.2)" }}
          >
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin
                className="w-3 h-3"
                style={{ color: "oklch(0.50 0.22 27)" }}
              />
              Sign in to enable live map
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HOSPITALS.map((h, i) => (
            <motion.div
              key={h.id}
              data-ocid={`hospitals.item.${i + 1}`}
              className="bg-white rounded-2xl p-5 glass-card glow-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "oklch(0.50 0.22 27 / 0.10)",
                    color: "oklch(0.50 0.22 27)",
                  }}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <Badge
                  className="border-0 text-xs rounded-full font-semibold"
                  style={{
                    background: "oklch(0.50 0.22 27 / 0.10)",
                    color: "oklch(0.40 0.20 22)",
                  }}
                >
                  {h.distance}
                </Badge>
              </div>
              <h3 className="font-semibold text-foreground">{h.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {h.address}
              </p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {h.datetime}
              </p>
              <div className="flex flex-wrap gap-1 mt-3 mb-4">
                {h.bloodGroups.map((bg) => (
                  <span
                    key={bg}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: "oklch(0.50 0.22 27 / 0.10)",
                      color: "oklch(0.40 0.20 22)",
                    }}
                  >
                    {bg}
                  </span>
                ))}
              </div>
              <Button
                className="w-full rounded-full text-white text-xs h-8 font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.50 0.22 27), oklch(0.42 0.20 22))",
                }}
                onClick={onGetStarted}
                data-ocid={`hospitals.register.button.${i + 1}`}
              >
                Book an Appointment
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Role cards */}
      <section className="mx-4 mt-10">
        <h2
          className="font-display font-bold text-2xl mb-2"
          style={{
            borderLeft: "4px solid oklch(0.50 0.22 27)",
            paddingLeft: "12px",
          }}
        >
          Who Can Join?
        </h2>
        <p className="text-muted-foreground text-sm mb-6 pl-4">
          A multi-role platform with verified access for all healthcare
          stakeholders
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: <Users className="w-6 h-6" />,
              title: "Public Donors",
              desc: "Donate blood, money & more",
            },
            {
              icon: <Stethoscope className="w-6 h-6" />,
              title: "Doctors",
              desc: "Join programs & manage availability",
            },
            {
              icon: <Building2 className="w-6 h-6" />,
              title: "Hospitals",
              desc: "Create drives & verify doctors",
            },
            {
              icon: <HandHeart className="w-6 h-6" />,
              title: "Trusts/Charities",
              desc: "Post & track donation needs",
            },
          ].map((role, i) => (
            <motion.div
              key={role.title}
              className="bg-white rounded-2xl p-5 glass-card glow-card text-center cursor-pointer transition-all duration-200"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                y: -4,
                boxShadow: "0 0 24px oklch(0.52 0.22 27 / 0.2)",
                transition: { duration: 0.2 },
              }}
              onClick={onGetStarted}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{
                  background: "oklch(0.50 0.22 27 / 0.10)",
                  color: "oklch(0.50 0.22 27)",
                }}
              >
                {role.icon}
              </div>
              <h3 className="font-semibold text-sm text-foreground">
                {role.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{role.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-4 mt-12 rounded-3xl footer-gradient text-white overflow-hidden">
        <div className="px-8 py-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 fill-white/50" />
                <span className="font-display font-bold text-xl">
                  DonorSync
                </span>
              </div>
              <p className="text-white/70 text-sm max-w-xs">
                A secure, role-based donation platform connecting donors,
                hospitals, doctors and trusts through verified channels.
              </p>
            </div>
            {[
              {
                title: "Platform",
                links: [
                  "How It Works",
                  "Blood Donation",
                  "Other Donations",
                  "Near Me",
                ],
              },
              {
                title: "Roles",
                links: [
                  "Public Donors",
                  "Hospitals",
                  "Doctors",
                  "Trusts/Charities",
                ],
              },
              {
                title: "Company",
                links: [
                  "About Us",
                  "Privacy Policy",
                  "Terms of Service",
                  "Contact",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="https://donorsync.app"
                        className="text-white/70 text-sm hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white/60 text-xs">
              &copy; {new Date().getFullYear()}. Built with{" "}
              <Heart className="w-3 h-3 inline fill-white/60 mx-0.5" /> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                className="underline underline-offset-2 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex gap-3">
              {["Twitter", "LinkedIn", "Instagram"].map((s) => (
                <a
                  key={s}
                  href="https://donorsync.app"
                  className="text-white/60 text-xs hover:text-white transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
