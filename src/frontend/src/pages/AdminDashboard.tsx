import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Principal } from "@icp-sdk/core/principal";
import {
  AlertTriangle,
  CheckCircle,
  Heart,
  Loader2,
  Search,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AppRole,
  useApproveUser,
  useListUsersByRole,
  usePendingVerifications,
  useSystemAnalytics,
} from "../hooks/useQueries";

export function AdminDashboard() {
  const [userRoleFilter, setUserRoleFilter] = useState<AppRole>(
    AppRole.PublicUser,
  );
  const [search, setSearch] = useState("");

  const { data: pending, isLoading: pendingLoading } =
    usePendingVerifications();
  const { data: analytics, isLoading: analyticsLoading } = useSystemAnalytics();
  const { data: users, isLoading: usersLoading } =
    useListUsersByRole(userRoleFilter);
  const approveMutation = useApproveUser();

  const handleApprove = async (userId: Principal, approved: boolean) => {
    try {
      await approveMutation.mutateAsync({ userId, approved });
      toast.success(approved ? "User approved!" : "User rejected.");
    } catch {
      toast.error("Action failed. Try again.");
    }
  };

  const filteredUsers = (users ?? []).filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="px-4 pt-4 pb-28">
      <h1 className="font-display font-bold text-2xl text-foreground mb-1">
        Admin Dashboard
      </h1>
      <p className="text-muted-foreground text-sm mb-5">
        System control & verification management
      </p>

      <Tabs defaultValue="approvals">
        <TabsList
          className="w-full rounded-full mb-5 bg-muted"
          data-ocid="admin.tabs"
        >
          <TabsTrigger
            value="approvals"
            className="flex-1 rounded-full text-xs"
            data-ocid="admin.approvals.tab"
          >
            Approvals{" "}
            {pending && pending.length > 0 && (
              <Badge className="ml-1 bg-primary text-primary-foreground text-[9px] rounded-full border-0 px-1.5">
                {pending.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex-1 rounded-full text-xs"
            data-ocid="admin.analytics.tab"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="flex-1 rounded-full text-xs"
            data-ocid="admin.users.tab"
          >
            Users
          </TabsTrigger>
        </TabsList>

        {/* Pending Approvals */}
        <TabsContent value="approvals">
          {pendingLoading ? (
            <div
              className="space-y-3"
              data-ocid="admin.approvals.loading_state"
            >
              {Array.from({ length: 3 }, (_, i) => i).map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : !pending || pending.length === 0 ? (
            <div
              className="bg-accent/30 rounded-2xl p-8 text-center"
              data-ocid="admin.approvals.empty_state"
            >
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No pending verifications
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((user, i) => (
                <motion.div
                  key={user.id.toString()}
                  data-ocid={`admin.approvals.item.${i + 1}`}
                  className="bg-card rounded-2xl p-4 card-shadow border border-border"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">
                          {user.name?.[0]?.toUpperCase() ?? "U"}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-0 text-[10px] rounded-full">
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="flex-1 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs h-8"
                      onClick={() => handleApprove(user.id, true)}
                      disabled={approveMutation.isPending}
                      data-ocid={`admin.approvals.approve.button.${i + 1}`}
                    >
                      {approveMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 rounded-full border-red-200 text-primary hover:bg-red-50 text-xs h-8"
                      onClick={() => handleApprove(user.id, false)}
                      disabled={approveMutation.isPending}
                      data-ocid={`admin.approvals.reject.button.${i + 1}`}
                    >
                      <XCircle className="w-3 h-3 mr-1" /> Reject
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          {analyticsLoading ? (
            <div
              className="grid grid-cols-2 gap-3"
              data-ocid="admin.analytics.loading_state"
            >
              {Array.from({ length: 4 }, (_, i) => i).map((i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: <Users className="w-5 h-5" />,
                  label: "Total Donors",
                  value: analytics?.totalDonors?.toString() ?? "0",
                },
                {
                  icon: <Heart className="w-5 h-5" />,
                  label: "Lives Saved",
                  value: analytics?.livesSaved?.toString() ?? "0",
                },
                {
                  icon: <TrendingUp className="w-5 h-5" />,
                  label: "Active Programs",
                  value: analytics?.activePrograms?.toString() ?? "0",
                },
                {
                  icon: <AlertTriangle className="w-5 h-5" />,
                  label: "Urgent Needs",
                  value: analytics?.urgentNeeds?.toString() ?? "0",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  data-ocid={`admin.analytics.item.${i + 1}`}
                  className="bg-card rounded-2xl p-5 card-shadow border border-border"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                    {stat.icon}
                  </div>
                  <p className="font-display font-bold text-2xl text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="rounded-xl pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-ocid="admin.users.search.input"
                />
              </div>
              <Select
                value={userRoleFilter}
                onValueChange={(v) => setUserRoleFilter(v as AppRole)}
              >
                <SelectTrigger
                  className="w-36 rounded-xl"
                  data-ocid="admin.users.role_filter.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AppRole).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {usersLoading ? (
              <div className="space-y-2" data-ocid="admin.users.loading_state">
                {Array.from({ length: 4 }, (_, i) => i).map((i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div
                className="bg-accent/30 rounded-2xl p-6 text-center"
                data-ocid="admin.users.empty_state"
              >
                <p className="text-sm text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user, i) => (
                  <motion.div
                    key={user.id.toString()}
                    data-ocid={`admin.users.item.${i + 1}`}
                    className="bg-card rounded-xl p-3 card-shadow border border-border flex items-center gap-3"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-bold text-sm text-primary">
                        {user.name?.[0]?.toUpperCase() ?? "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <Badge
                      className={`text-[10px] rounded-full border-0 shrink-0 ${
                        user.verificationStatus === "Approved"
                          ? "bg-green-100 text-green-700"
                          : user.verificationStatus === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {user.verificationStatus}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
