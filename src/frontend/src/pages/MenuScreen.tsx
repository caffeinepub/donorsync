import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Bell,
  Building2,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  HandHeart,
  HelpCircle,
  LogOut,
  Shield,
  Stethoscope,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { AppRole, VerificationStatus, useMyProfile } from "../hooks/useQueries";

interface MenuScreenProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

const VERIFICATION_STATUS_CONFIG = {
  [VerificationStatus.Approved]: {
    icon: <CheckCircle className="w-4 h-4" />,
    label: "Verified",
    cls: "bg-green-100 text-green-700",
  },
  [VerificationStatus.Pending]: {
    icon: <Clock className="w-4 h-4" />,
    label: "Pending Approval",
    cls: "bg-amber-100 text-amber-700",
  },
  [VerificationStatus.Rejected]: {
    icon: <XCircle className="w-4 h-4" />,
    label: "Rejected",
    cls: "bg-red-100 text-red-700",
  },
};

export function MenuScreen({ onNavigate, onLogout }: MenuScreenProps) {
  const { data: profile, isLoading } = useMyProfile();
  const { identity } = useInternetIdentity();

  const role = profile?.role;
  const verStatus = profile?.verificationStatus ?? VerificationStatus.Pending;
  const statusConfig = VERIFICATION_STATUS_CONFIG[verStatus];

  const commonItems = [
    {
      icon: <User className="w-4 h-4" />,
      label: "Profile Settings",
      screen: "profile",
    },
    {
      icon: <Bell className="w-4 h-4" />,
      label: "Notifications",
      screen: "notifications",
    },
    {
      icon: <HelpCircle className="w-4 h-4" />,
      label: "Help & Support",
      screen: "help",
    },
    {
      icon: <CreditCard className="w-4 h-4" />,
      label: "My Contributions",
      screen: "contributions",
    },
  ];

  const roleItems: Record<
    AppRole,
    { icon: React.ReactNode; label: string; screen: string }[]
  > = {
    [AppRole.Admin]: [
      {
        icon: <Shield className="w-4 h-4" />,
        label: "Approvals Dashboard",
        screen: "admin",
      },
      {
        icon: <BarChart3 className="w-4 h-4" />,
        label: "System Analytics",
        screen: "admin",
      },
      {
        icon: <Users className="w-4 h-4" />,
        label: "User Management",
        screen: "admin",
      },
    ],
    [AppRole.Hospital]: [
      {
        icon: <Building2 className="w-4 h-4" />,
        label: "Manage Programs",
        screen: "hospital",
      },
      {
        icon: <Stethoscope className="w-4 h-4" />,
        label: "Verify Doctors",
        screen: "hospital",
      },
    ],
    [AppRole.Trust]: [
      {
        icon: <HandHeart className="w-4 h-4" />,
        label: "Post Donation Needs",
        screen: "trust",
      },
      {
        icon: <BarChart3 className="w-4 h-4" />,
        label: "Track Contributions",
        screen: "trust",
      },
    ],
    [AppRole.Doctor]: [
      {
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Verification Status",
        screen: "doctor",
      },
      {
        icon: <Clock className="w-4 h-4" />,
        label: "Availability",
        screen: "doctor",
      },
    ],
    [AppRole.PublicUser]: [
      {
        icon: <Shield className="w-4 h-4" />,
        label: "Aadhar Verification",
        screen: "donor",
      },
      {
        icon: <User className="w-4 h-4" />,
        label: "My Profile",
        screen: "donor",
      },
    ],
  };

  const currentRoleItems = role ? (roleItems[role] ?? []) : [];

  return (
    <div className="px-4 pt-4 pb-28">
      {/* Profile card */}
      <motion.div
        className="bg-card rounded-2xl p-5 card-shadow border border-border mb-5"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {isLoading ? (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-28 bg-muted rounded animate-pulse" />
              <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ) : profile ? (
          <div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="font-display font-bold text-2xl text-primary">
                  {profile.name?.[0]?.toUpperCase() ?? "U"}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="font-display font-bold text-lg text-foreground">
                  {profile.name}
                </h2>
                <p className="text-xs text-muted-foreground">{profile.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge className="bg-primary/10 text-primary border-0 text-[10px] rounded-full">
                    {profile.role}
                  </Badge>
                  <div
                    className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${statusConfig.cls}`}
                  >
                    {statusConfig.icon}
                    {statusConfig.label}
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">
                  {profile.phone || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="font-medium text-foreground truncate">
                  {profile.address || "—"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">
              {identity ? "Loading profile..." : "Not logged in"}
            </p>
          </div>
        )}
      </motion.div>

      {/* Role-specific section */}
      {currentRoleItems.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2 px-1">
            {role} Tools
          </p>
          <div className="bg-card rounded-2xl card-shadow border border-border overflow-hidden">
            {currentRoleItems.map((item, i) => (
              <motion.button
                key={item.label}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-accent transition-colors text-left"
                style={{
                  borderTop: i > 0 ? "1px solid var(--border)" : undefined,
                }}
                onClick={() => onNavigate(item.screen)}
                data-ocid={`menu.role.item.${i + 1}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {item.icon}
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">
                  {item.label}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Common items */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2 px-1">
          Account
        </p>
        <div className="bg-card rounded-2xl card-shadow border border-border overflow-hidden">
          {commonItems.map((item, i) => (
            <button
              type="button"
              key={item.label}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-accent transition-colors text-left"
              style={{
                borderTop: i > 0 ? "1px solid var(--border)" : undefined,
              }}
              onClick={() => onNavigate(item.screen)}
              data-ocid={`menu.common.item.${i + 1}`}
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                {item.icon}
              </div>
              <span className="flex-1 text-sm font-medium text-foreground">
                {item.label}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full rounded-full border-primary/30 text-primary hover:bg-primary/5"
        onClick={onLogout}
        data-ocid="menu.logout.button"
      >
        <LogOut className="w-4 h-4 mr-2" /> Sign Out
      </Button>
    </div>
  );
}
