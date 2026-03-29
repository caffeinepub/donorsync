import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, Heart, Loader2, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { AppRole } from "../hooks/useQueries";

interface AuthPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

const ROLES = [
  {
    value: AppRole.PublicUser,
    label: "Public Donor",
    desc: "Donate blood, money & essentials",
    icon: "👤",
  },
  {
    value: AppRole.Doctor,
    label: "Doctor",
    desc: "Join programs & manage availability",
    icon: "🩺",
  },
  {
    value: AppRole.Hospital,
    label: "Hospital",
    desc: "Create drives & verify doctors",
    icon: "🏥",
  },
  {
    value: AppRole.Trust,
    label: "Trust/Charity",
    desc: "Post & track donation needs",
    icon: "🤝",
  },
];

export function AuthPage({ onBack, onSuccess }: AuthPageProps) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { actor } = useActor();

  const [signupStep, setSignupStep] = useState<"role" | "info" | "pending">(
    "role",
  );
  const [selectedRole, setSelectedRole] = useState<AppRole>(AppRole.PublicUser);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    aadharNumber: "",
    registrationNumber: "",
    specialization: "",
    bio: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async () => {
    try {
      await login();
      toast.success("Logged in successfully!");
      onSuccess();
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleSignupSubmit = async () => {
    if (!actor || !identity) {
      toast.error("Please login with Internet Identity first");
      return;
    }
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const profile = {
        id: identity.getPrincipal(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        bio: form.bio,
        role: selectedRole,
        aadharNumber: form.aadharNumber || undefined,
        registrationNumber: form.registrationNumber || undefined,
        specialization: form.specialization || undefined,
        hospitalId: undefined,
        verificationStatus: "Pending" as const,
        createdAt: BigInt(Date.now()) * BigInt(1_000_000),
        lastProfileUpdate: BigInt(Date.now()) * BigInt(1_000_000),
      };
      await actor.saveCallerUserProfile(profile as any);
      await actor.requestApproval();
      setSignupStep("pending");
    } catch {
      toast.error("Failed to submit profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
            data-ocid="auth.back.button"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary fill-primary/30" />
            </div>
            <span className="font-display font-bold text-lg">DonorSync</span>
          </div>
        </div>

        <Tabs defaultValue="login">
          <TabsList
            className="w-full rounded-full mb-6 bg-muted"
            data-ocid="auth.tabs"
          >
            <TabsTrigger
              value="login"
              className="flex-1 rounded-full"
              data-ocid="auth.login.tab"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="flex-1 rounded-full"
              data-ocid="auth.signup.tab"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login">
            <motion.div
              className="bg-card rounded-2xl p-6 card-shadow border border-border space-y-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h2 className="font-display font-bold text-2xl text-foreground">
                  Welcome back
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Sign in to your DonorSync account
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-medium">Email</Label>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    className="rounded-xl mt-1"
                    data-ocid="auth.email.input"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium">Password</Label>
                  <Input
                    placeholder="Your password"
                    type="password"
                    className="rounded-xl mt-1"
                    data-ocid="auth.password.input"
                  />
                </div>
              </div>

              <Button
                className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleLogin}
                disabled={isLoggingIn}
                data-ocid="auth.login.submit_button"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Sign In
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-3 text-xs text-muted-foreground">
                    or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full rounded-full border-border hover:bg-accent"
                onClick={handleLogin}
                disabled={isLoggingIn}
                data-ocid="auth.internet_identity.button"
              >
                <Shield className="w-4 h-4 mr-2 text-primary" />
                Internet Identity
              </Button>
            </motion.div>
          </TabsContent>

          {/* SIGNUP */}
          <TabsContent value="signup">
            <AnimatePresence mode="wait">
              {signupStep === "role" && (
                <motion.div
                  key="role"
                  className="bg-card rounded-2xl p-6 card-shadow border border-border"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                >
                  <h2 className="font-display font-bold text-2xl text-foreground mb-1">
                    Join DonorSync
                  </h2>
                  <p className="text-muted-foreground text-sm mb-5">
                    Select your role to get started
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {ROLES.map((role) => (
                      <button
                        type="button"
                        key={role.value}
                        onClick={() => setSelectedRole(role.value)}
                        data-ocid={`signup.role.${role.value.toLowerCase()}.button`}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedRole === role.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="text-2xl mb-1">{role.icon}</div>
                        <p className="font-semibold text-sm text-foreground">
                          {role.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {role.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                  <Button
                    className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setSignupStep("info")}
                    data-ocid="signup.next.button"
                  >
                    Continue
                  </Button>
                </motion.div>
              )}

              {signupStep === "info" && (
                <motion.div
                  key="info"
                  className="bg-card rounded-2xl p-6 card-shadow border border-border space-y-4"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSignupStep("role")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="font-display font-bold text-xl text-foreground">
                        Your Information
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Role:{" "}
                        {ROLES.find((r) => r.value === selectedRole)?.label}
                      </p>
                    </div>
                  </div>

                  {!identity ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        Connect Internet Identity to continue
                      </p>
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={handleLogin}
                        disabled={isLoggingIn}
                        data-ocid="signup.connect_identity.button"
                      >
                        <Shield className="w-4 h-4 mr-2 text-primary" />
                        {isLoggingIn ? "Connecting..." : "Connect Identity"}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Identity connected:{" "}
                      {identity.getPrincipal().toString().slice(0, 20)}...
                    </p>
                  )}

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium">Full Name *</Label>
                      <Input
                        placeholder="Your full name"
                        className="rounded-xl mt-1"
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        data-ocid="signup.name.input"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Email *</Label>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        className="rounded-xl mt-1"
                        value={form.email}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, email: e.target.value }))
                        }
                        data-ocid="signup.email.input"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Phone *</Label>
                      <Input
                        placeholder="+91 9876543210"
                        className="rounded-xl mt-1"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        data-ocid="signup.phone.input"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Address</Label>
                      <Input
                        placeholder="Your city, state"
                        className="rounded-xl mt-1"
                        value={form.address}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, address: e.target.value }))
                        }
                        data-ocid="signup.address.input"
                      />
                    </div>

                    {selectedRole === AppRole.PublicUser && (
                      <div>
                        <Label className="text-xs font-medium">
                          Aadhar Number
                        </Label>
                        <Input
                          placeholder="XXXX XXXX XXXX"
                          className="rounded-xl mt-1"
                          value={form.aadharNumber}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              aadharNumber: e.target.value,
                            }))
                          }
                          data-ocid="signup.aadhar.input"
                        />
                      </div>
                    )}

                    {(selectedRole === AppRole.Hospital ||
                      selectedRole === AppRole.Trust) && (
                      <div>
                        <Label className="text-xs font-medium">
                          Registration Number
                        </Label>
                        <Input
                          placeholder="Official reg. number"
                          className="rounded-xl mt-1"
                          value={form.registrationNumber}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              registrationNumber: e.target.value,
                            }))
                          }
                          data-ocid="signup.registration_number.input"
                        />
                      </div>
                    )}

                    {selectedRole === AppRole.Doctor && (
                      <div>
                        <Label className="text-xs font-medium">
                          Specialization
                        </Label>
                        <Input
                          placeholder="e.g. Cardiology, General Medicine"
                          className="rounded-xl mt-1"
                          value={form.specialization}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              specialization: e.target.value,
                            }))
                          }
                          data-ocid="signup.specialization.input"
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleSignupSubmit}
                    disabled={submitting || !identity}
                    data-ocid="signup.submit.button"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Submit for Verification
                  </Button>
                </motion.div>
              )}

              {signupStep === "pending" && (
                <motion.div
                  key="pending"
                  className="bg-card rounded-2xl p-8 card-shadow border border-border text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                    Verification Pending
                  </h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    Your profile has been submitted. Our admin team will review
                    and approve your account within 24–48 hours.
                  </p>
                  <Button
                    className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={onSuccess}
                    data-ocid="signup.continue.button"
                  >
                    Continue to App
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
