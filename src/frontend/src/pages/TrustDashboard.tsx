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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3, HandHeart, Loader2, Package, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Variant_Clothes_Money_Essentials,
  useAllDonationNeeds,
  useCreateDonationNeed,
  useTrustAnalytics,
  useTrustContributions,
} from "../hooks/useQueries";

export function TrustDashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    needType: Variant_Clothes_Money_Essentials.Money,
    targetAmount: "",
  });

  const { data: needs, isLoading: needsLoading } = useAllDonationNeeds();
  const { data: contributions, isLoading: contribLoading } =
    useTrustContributions();
  const { data: analytics } = useTrustAnalytics();
  const createMutation = useCreateDonationNeed();

  const handleCreate = async () => {
    if (!form.title || !form.description) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      await createMutation.mutateAsync({
        needType: form.needType,
        title: form.title,
        description: form.description,
        targetAmount: BigInt(Number.parseInt(form.targetAmount) || 0),
      });
      toast.success("Donation need posted!");
      setShowCreate(false);
      setForm({
        title: "",
        description: "",
        needType: Variant_Clothes_Money_Essentials.Money,
        targetAmount: "",
      });
    } catch {
      toast.error("Failed to post need.");
    }
  };

  return (
    <div className="px-4 pt-4 pb-28">
      <h1 className="font-display font-bold text-2xl text-foreground mb-1">
        Trust Dashboard
      </h1>
      <p className="text-muted-foreground text-sm mb-4">
        Manage needs & track contributions
      </p>

      {analytics && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Total Needs", value: analytics.totalNeeds.toString() },
            {
              label: "Contributions",
              value: analytics.totalContributions.toString(),
            },
            {
              label: "Amount Received",
              value: `₹${analytics.totalAmountReceived.toString()}`,
            },
          ].map((m, i) => (
            <div
              key={m.label}
              data-ocid={`trust.analytics.item.${i + 1}`}
              className="bg-card rounded-2xl p-3 card-shadow border border-border text-center"
            >
              <p className="font-display font-bold text-lg text-foreground">
                {m.value}
              </p>
              <p className="text-[10px] text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      <Tabs defaultValue="needs">
        <TabsList
          className="w-full rounded-full mb-5 bg-muted"
          data-ocid="trust.tabs"
        >
          <TabsTrigger
            value="needs"
            className="flex-1 rounded-full text-xs"
            data-ocid="trust.needs.tab"
          >
            My Needs
          </TabsTrigger>
          <TabsTrigger
            value="contributions"
            className="flex-1 rounded-full text-xs"
            data-ocid="trust.contributions.tab"
          >
            Contributions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="needs">
          <div className="flex justify-end mb-3">
            <Button
              size="sm"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
              onClick={() => setShowCreate(true)}
              data-ocid="trust.post_need.button"
            >
              <Plus className="w-3 h-3 mr-1" /> Post Need
            </Button>
          </div>

          {needsLoading ? (
            <div className="space-y-3" data-ocid="trust.needs.loading_state">
              {Array.from({ length: 3 }, (_, i) => i).map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : !needs || needs.length === 0 ? (
            <div
              className="bg-accent/30 rounded-2xl p-8 text-center"
              data-ocid="trust.needs.empty_state"
            >
              <HandHeart className="w-10 h-10 text-primary/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No donation needs posted yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {needs.map((need, i) => (
                <motion.div
                  key={need.id}
                  data-ocid={`trust.needs.item.${i + 1}`}
                  className="bg-card rounded-2xl p-4 card-shadow border border-border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {need.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {need.description}
                      </p>
                    </div>
                    <Badge className="bg-accent text-accent-foreground border-0 text-[10px] rounded-full shrink-0 ml-2">
                      {need.needType}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span>
                        {need.receivedAmount.toString()} /{" "}
                        {need.targetAmount.toString()}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${Math.min(100, (Number(need.receivedAmount) / Number(need.targetAmount)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="contributions">
          {contribLoading ? (
            <div
              className="space-y-2"
              data-ocid="trust.contributions.loading_state"
            >
              {Array.from({ length: 4 }, (_, i) => i).map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : !contributions || contributions.length === 0 ? (
            <div
              className="bg-accent/30 rounded-2xl p-8 text-center"
              data-ocid="trust.contributions.empty_state"
            >
              <BarChart3 className="w-10 h-10 text-primary/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No contributions received yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {contributions.map((c, i) => (
                <motion.div
                  key={c.id}
                  data-ocid={`trust.contributions.item.${i + 1}`}
                  className="bg-card rounded-xl p-3 card-shadow border border-border flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                    <Package className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {c.contributionType} — {c.amount.toString()} units
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        Number(c.contributedAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Need Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent
          className="rounded-2xl sm:max-w-sm"
          data-ocid="trust.post_need.dialog"
        >
          <DialogHeader>
            <DialogTitle>Post Donation Need</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Title *</Label>
              <Input
                placeholder="e.g. Winter Clothes Drive"
                className="rounded-xl mt-1"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                data-ocid="trust.need.title.input"
              />
            </div>
            <div>
              <Label className="text-xs">Type</Label>
              <Select
                value={form.needType}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    needType: v as Variant_Clothes_Money_Essentials,
                  }))
                }
              >
                <SelectTrigger
                  className="rounded-xl mt-1"
                  data-ocid="trust.need.type.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Variant_Clothes_Money_Essentials).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Description *</Label>
              <Textarea
                placeholder="Describe the need..."
                className="rounded-xl mt-1"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                data-ocid="trust.need.description.textarea"
              />
            </div>
            <div>
              <Label className="text-xs">Target Amount / Quantity</Label>
              <Input
                type="number"
                placeholder="e.g. 5000"
                className="rounded-xl mt-1"
                value={form.targetAmount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, targetAmount: e.target.value }))
                }
                data-ocid="trust.need.target.input"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => setShowCreate(false)}
                data-ocid="trust.post_need.cancel.button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleCreate}
                disabled={createMutation.isPending}
                data-ocid="trust.post_need.submit.button"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
