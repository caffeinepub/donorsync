import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  Heart,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAllDonationEvents,
  useLivesSaved,
  useMyProfile,
  useRegisterForEvent,
  useSystemAnalytics,
  useUrgentNeeds,
} from "../hooks/useQueries";

const SAMPLE_EVENTS = [
  {
    id: "s1",
    title: "Apollo Blood Drive",
    location: "Greams Road, Chennai",
    date: Date.now() + 86400000,
    bloodGroupsNeeded: ["O+", "A-", "B+"],
    hospitalId: "h1",
    status: "active",
    currentRegistrations: BigInt(42),
    maxRegistrations: BigInt(100),
  },
  {
    id: "s2",
    title: "Fortis Emergency Drive",
    location: "Bannerghatta, Bengaluru",
    date: Date.now() + 172800000,
    bloodGroupsNeeded: ["AB+", "O-"],
    hospitalId: "h2",
    status: "active",
    currentRegistrations: BigInt(28),
    maxRegistrations: BigInt(50),
  },
  {
    id: "s3",
    title: "AIIMS Delhi Camp",
    location: "Ansari Nagar, Delhi",
    date: Date.now() + 259200000,
    bloodGroupsNeeded: ["A+", "B-"],
    hospitalId: "h3",
    status: "active",
    currentRegistrations: BigInt(65),
    maxRegistrations: BigInt(150),
  },
];

export function HomeScreen() {
  const [carouselIdx, setCarouselIdx] = useState(0);
  const { data: urgentNeeds, isLoading: needsLoading } = useUrgentNeeds();
  const { data: livesSaved } = useLivesSaved();
  const { data: events, isLoading: eventsLoading } = useAllDonationEvents();
  const { data: analytics } = useSystemAnalytics();
  const { data: profile } = useMyProfile();
  const registerMutation = useRegisterForEvent();

  const displayEvents = events && events.length > 0 ? events : SAMPLE_EVENTS;
  const maxIdx = Math.max(0, displayEvents.length - 2);

  const handleRegister = async (eventId: string) => {
    try {
      await registerMutation.mutateAsync(eventId);
      toast.success("Registered successfully!");
    } catch {
      toast.error("Failed to register. Please try again.");
    }
  };

  const stats = [
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Lives Saved",
      value: livesSaved
        ? livesSaved.toString()
        : (analytics?.livesSaved?.toString() ?? "8,247"),
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: "Total Donors",
      value: analytics?.totalDonors?.toString() ?? "52,318",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Active Programs",
      value: analytics?.activePrograms?.toString() ?? "341",
    },
  ];

  return (
    <div className="space-y-6 px-4 pt-4">
      {/* Welcome */}
      {profile && (
        <motion.div
          className="bg-accent/40 rounded-2xl p-4 border border-donor-pink-glow/40"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <p className="font-display font-bold text-xl text-foreground">
            {profile.name || "Donor"} ❤️
          </p>
          {profile.verificationStatus === "Pending" && (
            <div className="flex items-center gap-2 mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full w-fit">
              <AlertTriangle className="w-3 h-3" />
              Verification pending
            </div>
          )}
        </motion.div>
      )}

      {/* Stat cards */}
      <section>
        <h2 className="font-display font-bold text-lg text-foreground mb-3">
          Impact Today
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-card rounded-2xl p-3 card-shadow border border-border text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-1.5">
                {stat.icon}
              </div>
              <p className="font-display font-bold text-base text-foreground">
                {stat.value}
              </p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Urgent needs */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg text-foreground">
            Urgent Needs
          </h2>
          {needsLoading && <Skeleton className="w-16 h-4" />}
        </div>
        <div className="space-y-3">
          {needsLoading ? (
            Array.from({ length: 2 }, (_, i) => i).map((i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))
          ) : urgentNeeds && urgentNeeds.length > 0 ? (
            urgentNeeds.slice(0, 3).map((need, i) => (
              <motion.div
                key={need.id}
                data-ocid={`urgent_needs.item.${i + 1}`}
                className="bg-card rounded-2xl p-4 card-shadow border border-border flex items-center justify-between"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground text-[10px] rounded-full border-0">
                      {need.needType}
                    </Badge>
                    <p className="font-semibold text-sm text-foreground">
                      {need.title}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {need.description.slice(0, 60)}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs ml-3 shrink-0"
                  data-ocid={`urgent_needs.donate.button.${i + 1}`}
                >
                  Help
                </Button>
              </motion.div>
            ))
          ) : (
            <div
              className="bg-accent/30 rounded-2xl p-6 text-center"
              data-ocid="urgent_needs.empty_state"
            >
              <Droplets className="w-8 h-8 text-primary/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No urgent needs right now
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Nearby hospitals with events */}
      <section className="pb-28">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg text-foreground">
            Nearby Hospitals
          </h2>
          <div className="flex gap-1">
            <button
              type="button"
              className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-accent text-xs"
              onClick={() => setCarouselIdx((p) => Math.max(0, p - 1))}
              disabled={carouselIdx === 0}
              data-ocid="hospitals.prev.button"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-accent text-xs"
              onClick={() => setCarouselIdx((p) => Math.min(maxIdx, p + 1))}
              disabled={carouselIdx >= maxIdx}
              data-ocid="hospitals.next.button"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {eventsLoading ? (
          <div className="space-y-3" data-ocid="hospitals.loading_state">
            {Array.from({ length: 2 }, (_, i) => i).map((i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-3"
              animate={{ x: `-${carouselIdx * (300 + 12)}px` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {displayEvents.map((ev, i) => (
                <motion.div
                  key={ev.id}
                  data-ocid={`hospitals.item.${i + 1}`}
                  className="min-w-[300px] bg-card rounded-2xl p-5 card-shadow border border-border flex-shrink-0"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {ev.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                    <Clock className="w-3 h-3" />
                    {new Date(
                      typeof ev.date === "bigint"
                        ? Number(ev.date) / 1_000_000
                        : ev.date,
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {ev.bloodGroupsNeeded.map((bg) => (
                      <span
                        key={bg}
                        className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                      >
                        {bg}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {ev.currentRegistrations.toString()}/
                      {ev.maxRegistrations.toString()} registered
                    </p>
                    <Button
                      size="sm"
                      className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-7"
                      onClick={() => handleRegister(ev.id)}
                      disabled={registerMutation.isPending}
                      data-ocid={`hospitals.register.button.${i + 1}`}
                    >
                      Register
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </section>
    </div>
  );
}
