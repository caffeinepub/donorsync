import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Principal } from "@icp-sdk/core/principal";
import {
  Building2,
  Calendar,
  CheckCircle,
  Loader2,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AppRole,
  useAllDonationEvents,
  useApproveDoctorForHospital,
  useCreateDonationEvent,
  useHospitalMetrics,
  useListUsersByRole,
} from "../hooks/useQueries";

export function HospitalDashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    bloodGroups: "",
    date: "",
    location: "",
    maxRegistrations: "",
  });

  const { data: events, isLoading: eventsLoading } = useAllDonationEvents();
  const { data: metrics } = useHospitalMetrics();
  const { data: doctors, isLoading: doctorsLoading } = useListUsersByRole(
    AppRole.Doctor,
  );
  const createMutation = useCreateDonationEvent();
  const approveDoctorMutation = useApproveDoctorForHospital();

  const handleCreate = async () => {
    if (!form.title || !form.date || !form.location) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      await createMutation.mutateAsync({
        title: form.title,
        bloodGroupsNeeded: form.bloodGroups
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        date: BigInt(new Date(form.date).getTime()) * BigInt(1_000_000),
        location: form.location,
        maxRegistrations: BigInt(Number.parseInt(form.maxRegistrations) || 100),
      });
      toast.success("Event created!");
      setShowCreate(false);
      setForm({
        title: "",
        bloodGroups: "",
        date: "",
        location: "",
        maxRegistrations: "",
      });
    } catch {
      toast.error("Failed to create event.");
    }
  };

  const handleApproveDoctor = async (doctorId: Principal) => {
    try {
      await approveDoctorMutation.mutateAsync(doctorId);
      toast.success("Doctor approved!");
    } catch {
      toast.error("Failed to approve doctor.");
    }
  };

  return (
    <div className="px-4 pt-4 pb-28">
      <h1 className="font-display font-bold text-2xl text-foreground mb-1">
        Hospital Dashboard
      </h1>
      <p className="text-muted-foreground text-sm mb-4">
        Manage programs & verify doctors
      </p>

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            {
              icon: <Calendar className="w-4 h-4" />,
              label: "Total Events",
              value: metrics.totalEvents.toString(),
            },
            {
              icon: <Building2 className="w-4 h-4" />,
              label: "Active",
              value: metrics.activeEvents.toString(),
            },
            {
              icon: <Users className="w-4 h-4" />,
              label: "Registrations",
              value: metrics.totalRegistrations.toString(),
            },
          ].map((m, i) => (
            <div
              key={m.label}
              data-ocid={`hospital.metrics.item.${i + 1}`}
              className="bg-card rounded-2xl p-3 card-shadow border border-border text-center"
            >
              <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-1">
                {m.icon}
              </div>
              <p className="font-display font-bold text-lg text-foreground">
                {m.value}
              </p>
              <p className="text-[10px] text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      <Tabs defaultValue="programs">
        <TabsList
          className="w-full rounded-full mb-5 bg-muted"
          data-ocid="hospital.tabs"
        >
          <TabsTrigger
            value="programs"
            className="flex-1 rounded-full text-xs"
            data-ocid="hospital.programs.tab"
          >
            My Programs
          </TabsTrigger>
          <TabsTrigger
            value="doctors"
            className="flex-1 rounded-full text-xs"
            data-ocid="hospital.doctors.tab"
          >
            Verify Doctors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="programs">
          <div className="flex justify-end mb-3">
            <Button
              size="sm"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
              onClick={() => setShowCreate(true)}
              data-ocid="hospital.create_program.button"
            >
              <Plus className="w-3 h-3 mr-1" /> Create Event
            </Button>
          </div>

          {eventsLoading ? (
            <div
              className="space-y-3"
              data-ocid="hospital.programs.loading_state"
            >
              {Array.from({ length: 3 }, (_, i) => i).map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : !events || events.length === 0 ? (
            <div
              className="bg-accent/30 rounded-2xl p-8 text-center"
              data-ocid="hospital.programs.empty_state"
            >
              <TrendingUp className="w-10 h-10 text-primary/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No programs yet. Create your first event!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((ev, i) => (
                <motion.div
                  key={ev.id}
                  data-ocid={`hospital.programs.item.${i + 1}`}
                  className="bg-card rounded-2xl p-4 card-shadow border border-border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
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
                      {ev.status}
                    </Badge>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {ev.bloodGroupsNeeded.map((bg) => (
                      <span
                        key={bg}
                        className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                      >
                        {bg}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {ev.currentRegistrations.toString()} /{" "}
                    {ev.maxRegistrations.toString()} registered
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="doctors">
          {doctorsLoading ? (
            <div
              className="space-y-3"
              data-ocid="hospital.doctors.loading_state"
            >
              {Array.from({ length: 3 }, (_, i) => i).map((i) => (
                <Skeleton key={i} className="h-20 rounded-2xl" />
              ))}
            </div>
          ) : !doctors || doctors.length === 0 ? (
            <div
              className="bg-accent/30 rounded-2xl p-8 text-center"
              data-ocid="hospital.doctors.empty_state"
            >
              <p className="text-sm text-muted-foreground">
                No doctors pending verification
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {doctors.map((doctor, i) => (
                <motion.div
                  key={doctor.id.toString()}
                  data-ocid={`hospital.doctors.item.${i + 1}`}
                  className="bg-card rounded-2xl p-4 card-shadow border border-border flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">
                      {doctor.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {doctor.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doctor.specialization ?? "General"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full bg-green-500 hover:bg-green-600 text-white text-xs h-7"
                    onClick={() => handleApproveDoctor(doctor.id)}
                    disabled={approveDoctorMutation.isPending}
                    data-ocid={`hospital.doctors.approve.button.${i + 1}`}
                  >
                    {approveDoctorMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Event Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent
          className="rounded-2xl sm:max-w-sm"
          data-ocid="hospital.create_event.dialog"
        >
          <DialogHeader>
            <DialogTitle>Create Blood Donation Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Event Title *</Label>
              <Input
                placeholder="e.g. Apollo Blood Drive"
                className="rounded-xl mt-1"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                data-ocid="hospital.event.title.input"
              />
            </div>
            <div>
              <Label className="text-xs">Blood Groups (comma-separated)</Label>
              <Input
                placeholder="O+, A-, B+"
                className="rounded-xl mt-1"
                value={form.bloodGroups}
                onChange={(e) =>
                  setForm((p) => ({ ...p, bloodGroups: e.target.value }))
                }
                data-ocid="hospital.event.blood_groups.input"
              />
            </div>
            <div>
              <Label className="text-xs">Date & Time *</Label>
              <Input
                type="datetime-local"
                className="rounded-xl mt-1"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                data-ocid="hospital.event.date.input"
              />
            </div>
            <div>
              <Label className="text-xs">Location *</Label>
              <Input
                placeholder="Address"
                className="rounded-xl mt-1"
                value={form.location}
                onChange={(e) =>
                  setForm((p) => ({ ...p, location: e.target.value }))
                }
                data-ocid="hospital.event.location.input"
              />
            </div>
            <div>
              <Label className="text-xs">Max Registrations</Label>
              <Input
                type="number"
                placeholder="100"
                className="rounded-xl mt-1"
                value={form.maxRegistrations}
                onChange={(e) =>
                  setForm((p) => ({ ...p, maxRegistrations: e.target.value }))
                }
                data-ocid="hospital.event.max_registrations.input"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => setShowCreate(false)}
                data-ocid="hospital.create_event.cancel.button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleCreate}
                disabled={createMutation.isPending}
                data-ocid="hospital.create_event.submit.button"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
