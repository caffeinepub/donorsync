import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  Clock,
  Droplets,
  Loader2,
  MapPin,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  VerificationStatus,
  useAllDonationEvents,
  useCanUpdateProfile,
  useMyProfile,
  useRegisterForEvent,
} from "../hooks/useQueries";

export function PublicUserDashboard() {
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: canUpdate } = useCanUpdateProfile();
  const { data: events, isLoading: eventsLoading } = useAllDonationEvents();

  const registerMutation = useRegisterForEvent();

  const handleRegister = async (eventId: string) => {
    try {
      await registerMutation.mutateAsync(eventId);
      toast.success("Registered for blood donation drive!");
    } catch {
      toast.error("Registration failed.");
    }
  };

  const getNextUpdateDate = () => {
    if (!profile?.lastProfileUpdate) return null;
    const lastUpdate = Number(profile.lastProfileUpdate) / 1_000_000;
    const sixMonthsLater = new Date(lastUpdate);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    return sixMonthsLater;
  };

  const nextUpdate = getNextUpdateDate();
  const verStatus = profile?.verificationStatus;

  return (
    <div className="px-4 pt-4 pb-28 space-y-5">
      <div>
        <h1 className="font-display font-bold text-2xl text-foreground mb-1">
          My Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Your donation activity & verification status
        </p>
      </div>

      {/* Aadhar verification banner */}
      <motion.div
        className={`rounded-2xl p-4 border ${
          verStatus === VerificationStatus.Approved
            ? "bg-green-50 border-green-200"
            : verStatus === VerificationStatus.Rejected
              ? "bg-red-50 border-red-200"
              : "bg-amber-50 border-amber-200"
        }`}
        data-ocid="donor.verification.card"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
            <Shield
              className={`w-5 h-5 ${
                verStatus === VerificationStatus.Approved
                  ? "text-green-500"
                  : verStatus === VerificationStatus.Rejected
                    ? "text-red-500"
                    : "text-amber-500"
              }`}
            />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">
              Aadhar Verification:{" "}
              {verStatus === VerificationStatus.Approved
                ? "Verified ✅"
                : verStatus === VerificationStatus.Rejected
                  ? "Rejected ❌"
                  : "Pending ⏳"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {verStatus === VerificationStatus.Approved
                ? "Your Aadhar is verified. You have full donation access."
                : verStatus === VerificationStatus.Rejected
                  ? "Verification rejected. Contact support."
                  : "Your Aadhar verification is under review by admin."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Profile update restriction */}
      <motion.div
        className="bg-card rounded-2xl p-4 card-shadow border border-border"
        data-ocid="donor.profile_update.card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">
            Profile Update Policy
          </h3>
        </div>
        {profileLoading ? (
          <Skeleton className="h-8" />
        ) : canUpdate === false ? (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-xl">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <div>
              <p className="text-xs font-medium">Profile update restricted</p>
              {nextUpdate && (
                <p className="text-xs">
                  Next update allowed:{" "}
                  {nextUpdate.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-xl">
            <CheckCircle className="w-4 h-4" />
            <p className="text-xs font-medium">Profile update available</p>
          </div>
        )}
        <p className="text-[10px] text-muted-foreground mt-2">
          Profile updates are restricted to once every 6 months via CSC.
        </p>
      </motion.div>

      {/* Nearby blood donation drives */}
      <div>
        <h2 className="font-display font-bold text-lg text-foreground mb-3 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-primary" /> Donation Drives
        </h2>

        {eventsLoading ? (
          <div className="space-y-3" data-ocid="donor.events.loading_state">
            {Array.from({ length: 2 }, (_, i) => i).map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : !events || events.length === 0 ? (
          <div
            className="bg-accent/30 rounded-2xl p-6 text-center"
            data-ocid="donor.events.empty_state"
          >
            <Droplets className="w-8 h-8 text-primary/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No active drives near you
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.slice(0, 4).map((ev, i) => (
              <motion.div
                key={ev.id}
                data-ocid={`donor.events.item.${i + 1}`}
                className="bg-card rounded-2xl p-4 card-shadow border border-border"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {ev.title}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {ev.location}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ev.bloodGroupsNeeded.map((bg) => (
                        <span
                          key={bg}
                          className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                        >
                          {bg}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-7 shrink-0"
                    onClick={() => handleRegister(ev.id)}
                    disabled={registerMutation.isPending}
                    data-ocid={`donor.events.register.button.${i + 1}`}
                  >
                    {registerMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Register"
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
