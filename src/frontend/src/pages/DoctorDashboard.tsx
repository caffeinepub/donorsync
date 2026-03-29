import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Principal } from "@icp-sdk/core/principal";
import {
  Building2,
  CheckCircle,
  Clock,
  Loader2,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  VerificationStatus,
  useAllDonationEvents,
  useDoctorVerificationStatus,
  useSubmitDoctorVerification,
} from "../hooks/useQueries";

export function DoctorDashboard() {
  const [hospitalIdInput, setHospitalIdInput] = useState("");
  const [available, setAvailable] = useState(true);

  const { data: verStatus, isLoading: statusLoading } =
    useDoctorVerificationStatus();
  const { data: events } = useAllDonationEvents();
  const submitMutation = useSubmitDoctorVerification();

  const handleSubmitVerification = async () => {
    if (!hospitalIdInput.trim()) {
      toast.error("Please enter a Hospital ID");
      return;
    }
    try {
      const principal = Principal.fromText(hospitalIdInput.trim());
      await submitMutation.mutateAsync(principal);
      toast.success("Verification submitted!");
    } catch {
      toast.error("Invalid principal or submission failed.");
    }
  };

  const statusMap = {
    [VerificationStatus.Approved]: {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      label: "Approved",
      desc: "You are verified. You can join donation programs.",
      cls: "bg-green-50 border-green-200",
    },
    [VerificationStatus.Pending]: {
      icon: <Clock className="w-6 h-6 text-amber-500" />,
      label: "Pending",
      desc: "Verification is in progress. Please wait for hospital and admin approval.",
      cls: "bg-amber-50 border-amber-200",
    },
    [VerificationStatus.Rejected]: {
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      label: "Rejected",
      desc: "Your verification was rejected. Please contact admin or resubmit.",
      cls: "bg-red-50 border-red-200",
    },
  };

  const currentStatus = verStatus ? statusMap[verStatus] : null;

  return (
    <div className="px-4 pt-4 pb-28 space-y-5">
      <div>
        <h1 className="font-display font-bold text-2xl text-foreground mb-1">
          Doctor Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Verification status & availability management
        </p>
      </div>

      {/* Verification status */}
      <motion.div
        className={`rounded-2xl p-5 border ${currentStatus?.cls ?? "bg-card border-border"} card-shadow`}
        data-ocid="doctor.verification.card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3">
          Verification Status
        </p>
        {statusLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-3 w-40 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ) : currentStatus ? (
          <div className="flex items-start gap-3">
            {currentStatus.icon}
            <div>
              <p className="font-semibold text-foreground">
                {currentStatus.label}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {currentStatus.desc}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No verification submitted yet
          </p>
        )}

        {/* Verification steps */}
        <div className="mt-4 space-y-2">
          {[
            {
              step: 1,
              label: "Hospital / Government Validation",
              done: !!verStatus,
            },
            {
              step: 2,
              label: "Admin Approval",
              done: verStatus === VerificationStatus.Approved,
            },
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  s.done
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s.done ? <CheckCircle className="w-3 h-3" /> : s.step}
              </div>
              <span
                className={`text-xs ${s.done ? "text-foreground font-medium" : "text-muted-foreground"}`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Submit Verification */}
      {!verStatus && (
        <motion.div
          className="bg-card rounded-2xl p-5 card-shadow border border-border"
          data-ocid="doctor.submit_verification.card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-primary" /> Submit for
            Verification
          </h3>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Hospital Principal ID *</Label>
              <Input
                placeholder="Enter hospital principal ID"
                className="rounded-xl mt-1"
                value={hospitalIdInput}
                onChange={(e) => setHospitalIdInput(e.target.value)}
                data-ocid="doctor.hospital_id.input"
              />
            </div>
            <Button
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSubmitVerification}
              disabled={submitMutation.isPending}
              data-ocid="doctor.submit_verification.button"
            >
              {submitMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Submit Verification
            </Button>
          </div>
        </motion.div>
      )}

      {/* Availability toggle */}
      <motion.div
        className="bg-card rounded-2xl p-5 card-shadow border border-border"
        data-ocid="doctor.availability.card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Availability</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Toggle your donation program availability
            </p>
          </div>
          <Switch
            checked={available}
            onCheckedChange={setAvailable}
            data-ocid="doctor.availability.switch"
          />
        </div>
        <div className="mt-3">
          <Badge
            className={`text-xs rounded-full border-0 ${
              available
                ? "bg-green-100 text-green-700"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {available ? "Available for Programs" : "Not Available"}
          </Badge>
        </div>
      </motion.div>

      {/* Programs */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" /> Available Programs
        </h3>
        <div className="space-y-3">
          {events && events.length > 0 ? (
            events.slice(0, 4).map((ev, i) => (
              <motion.div
                key={ev.id}
                data-ocid={`doctor.programs.item.${i + 1}`}
                className="bg-card rounded-xl p-4 card-shadow border border-border"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {ev.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {ev.location}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0 text-[10px] rounded-full">
                    Active
                  </Badge>
                </div>
              </motion.div>
            ))
          ) : (
            <div
              className="bg-accent/30 rounded-2xl p-6 text-center"
              data-ocid="doctor.programs.empty_state"
            >
              <p className="text-sm text-muted-foreground">
                No programs available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
