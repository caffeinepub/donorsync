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
import {
  Building2,
  Clock,
  DollarSign,
  Droplets,
  Loader2,
  MapPin,
  Package,
  ShirtIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Variant_Clothes_Money_Essentials,
  useAllDonationEvents,
  useAllDonationNeeds,
  useContributeToNeed,
  useRegisterForEvent,
} from "../hooks/useQueries";

const NEED_TYPE_ICONS: Record<
  Variant_Clothes_Money_Essentials,
  React.ReactNode
> = {
  [Variant_Clothes_Money_Essentials.Clothes]: <ShirtIcon className="w-4 h-4" />,
  [Variant_Clothes_Money_Essentials.Money]: <DollarSign className="w-4 h-4" />,
  [Variant_Clothes_Money_Essentials.Essentials]: (
    <Package className="w-4 h-4" />
  ),
};

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const SAMPLE_NEEDS = [
  {
    id: "n1",
    needType: Variant_Clothes_Money_Essentials.Money,
    title: "Medical Aid Fund",
    description: "Supporting patients who cannot afford critical surgery",
    targetAmount: BigInt(500000),
    receivedAmount: BigInt(235000),
    status: "active",
    trustId: "t1",
  },
  {
    id: "n2",
    needType: Variant_Clothes_Money_Essentials.Clothes,
    title: "Winter Clothes Drive",
    description: "Collecting warm clothes for flood victims in Assam",
    targetAmount: BigInt(3000),
    receivedAmount: BigInt(1800),
    status: "active",
    trustId: "t2",
  },
  {
    id: "n3",
    needType: Variant_Clothes_Money_Essentials.Essentials,
    title: "Essentials Kit Distribution",
    description: "Hygiene kits and food packets for daily wage workers",
    targetAmount: BigInt(1000),
    receivedAmount: BigInt(420),
    status: "active",
    trustId: "t3",
  },
];

const SAMPLE_EVENTS = [
  {
    id: "e1",
    title: "Apollo Emergency Blood Drive",
    location: "Greams Road, Chennai",
    date: BigInt(Date.now() + 86400000) * BigInt(1_000_000),
    bloodGroupsNeeded: ["O+", "A-", "B+"],
    hospitalId: "h1",
    status: "active",
    currentRegistrations: BigInt(42),
    maxRegistrations: BigInt(100),
  },
  {
    id: "e2",
    title: "Fortis Blood Camp",
    location: "Bannerghatta, Bengaluru",
    date: BigInt(Date.now() + 172800000) * BigInt(1_000_000),
    bloodGroupsNeeded: ["AB+", "O-"],
    hospitalId: "h2",
    status: "active",
    currentRegistrations: BigInt(28),
    maxRegistrations: BigInt(50),
  },
  {
    id: "e3",
    title: "AIIMS Delhi Donation Camp",
    location: "Ansari Nagar, Delhi",
    date: BigInt(Date.now() + 259200000) * BigInt(1_000_000),
    bloodGroupsNeeded: ["A+", "B-"],
    hospitalId: "h3",
    status: "active",
    currentRegistrations: BigInt(65),
    maxRegistrations: BigInt(150),
  },
];

export function DonationScreen() {
  const [bloodFilter, setBloodFilter] = useState("All");
  const [contributeNeed, setContributeNeed] = useState<
    (typeof SAMPLE_NEEDS)[0] | null
  >(null);
  const [contributeAmount, setContributeAmount] = useState("");

  const { data: events, isLoading: eventsLoading } = useAllDonationEvents();
  const { data: needs, isLoading: needsLoading } = useAllDonationNeeds();
  const registerMutation = useRegisterForEvent();
  const contributeMutation = useContributeToNeed();

  const displayEvents = events && events.length > 0 ? events : SAMPLE_EVENTS;
  const displayNeeds = needs && needs.length > 0 ? needs : SAMPLE_NEEDS;

  const filteredEvents =
    bloodFilter === "All"
      ? displayEvents
      : displayEvents.filter((e) => e.bloodGroupsNeeded.includes(bloodFilter));

  const handleRegister = async (eventId: string) => {
    try {
      await registerMutation.mutateAsync(eventId);
      toast.success("Registered for blood donation drive!");
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleContribute = async () => {
    if (!contributeNeed || !contributeAmount) return;
    try {
      await contributeMutation.mutateAsync({
        needId: contributeNeed.id,
        amount: BigInt(Number.parseInt(contributeAmount) || 0),
        contributionType: contributeNeed.needType,
      });
      toast.success("Contribution recorded! Thank you.");
      setContributeNeed(null);
      setContributeAmount("");
    } catch {
      toast.error("Contribution failed. Please try again.");
    }
  };

  return (
    <div className="px-4 pt-4 pb-28">
      <h1 className="font-display font-bold text-2xl text-foreground mb-1">
        Donations
      </h1>
      <p className="text-muted-foreground text-sm mb-5">
        Every contribution saves a life
      </p>

      <Tabs defaultValue="blood">
        <TabsList
          className="w-full rounded-full mb-5 bg-muted"
          data-ocid="donation.tabs"
        >
          <TabsTrigger
            value="blood"
            className="flex-1 rounded-full gap-1.5"
            data-ocid="donation.blood.tab"
          >
            <Droplets className="w-3.5 h-3.5" /> Blood Donation
          </TabsTrigger>
          <TabsTrigger
            value="other"
            className="flex-1 rounded-full gap-1.5"
            data-ocid="donation.other.tab"
          >
            <Package className="w-3.5 h-3.5" /> Other Donations
          </TabsTrigger>
        </TabsList>

        {/* Blood Donation Tab */}
        <TabsContent value="blood" className="space-y-4">
          {/* Blood group filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {BLOOD_GROUPS.map((bg) => (
              <button
                type="button"
                key={bg}
                onClick={() => setBloodFilter(bg)}
                data-ocid={`donation.blood_filter.${bg.replace("+", "pos").replace("-", "neg").toLowerCase()}.button`}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  bloodFilter === bg
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                {bg}
              </button>
            ))}
          </div>

          {eventsLoading ? (
            <div className="space-y-3" data-ocid="donation.blood.loading_state">
              {Array.from({ length: 3 }, (_, i) => i).map((i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div
              className="bg-accent/30 rounded-2xl p-8 text-center"
              data-ocid="donation.blood.empty_state"
            >
              <Droplets className="w-10 h-10 text-primary/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No drives for {bloodFilter} blood group
              </p>
            </div>
          ) : (
            filteredEvents.map((ev, i) => (
              <motion.div
                key={ev.id}
                data-ocid={`donation.blood.item.${i + 1}`}
                className="bg-card rounded-2xl p-5 card-shadow border border-border"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-primary" />
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
                  <Badge className="bg-green-100 text-green-700 border-0 text-[10px] rounded-full shrink-0">
                    Active
                  </Badge>
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
                    year: "numeric",
                  })}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {ev.bloodGroupsNeeded.map((bg) => (
                      <span
                        key={bg}
                        className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                      >
                        {bg}
                      </span>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-7 ml-3 shrink-0"
                    onClick={() => handleRegister(ev.id)}
                    disabled={registerMutation.isPending}
                    data-ocid={`donation.blood.register.button.${i + 1}`}
                  >
                    {registerMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Register"
                    )}
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </TabsContent>

        {/* Other Donations Tab */}
        <TabsContent value="other" className="space-y-4">
          {needsLoading ? (
            <div className="space-y-3" data-ocid="donation.other.loading_state">
              {Array.from({ length: 3 }, (_, i) => i).map((i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : displayNeeds.length === 0 ? (
            <div
              className="bg-accent/30 rounded-2xl p-8 text-center"
              data-ocid="donation.other.empty_state"
            >
              <Package className="w-10 h-10 text-primary/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No active donation needs
              </p>
            </div>
          ) : (
            displayNeeds.map((need, i) => (
              <motion.div
                key={need.id}
                data-ocid={`donation.other.item.${i + 1}`}
                className="bg-card rounded-2xl p-5 card-shadow border border-border"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {NEED_TYPE_ICONS[need.needType]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-foreground">
                          {need.title}
                        </h3>
                        <Badge className="bg-accent text-accent-foreground border-0 text-[10px] rounded-full">
                          {need.needType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {need.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">
                      {need.receivedAmount.toString()} /{" "}
                      {need.targetAmount.toString()}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (Number(need.receivedAmount) / Number(need.targetAmount)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <Button
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8"
                  onClick={() => setContributeNeed(need as any)}
                  data-ocid={`donation.other.contribute.button.${i + 1}`}
                >
                  Contribute
                </Button>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Contribute Dialog */}
      <Dialog
        open={!!contributeNeed}
        onOpenChange={(o) => !o && setContributeNeed(null)}
      >
        <DialogContent
          className="rounded-2xl sm:max-w-sm"
          data-ocid="donation.contribute.dialog"
        >
          <DialogHeader>
            <DialogTitle>Contribute to {contributeNeed?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium">Amount / Quantity</Label>
              <Input
                placeholder="Enter amount or units"
                type="number"
                className="rounded-xl mt-1"
                value={contributeAmount}
                onChange={(e) => setContributeAmount(e.target.value)}
                data-ocid="donation.contribute.amount.input"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => setContributeNeed(null)}
                data-ocid="donation.contribute.cancel.button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleContribute}
                disabled={contributeMutation.isPending || !contributeAmount}
                data-ocid="donation.contribute.confirm.button"
              >
                {contributeMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Contribute"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
