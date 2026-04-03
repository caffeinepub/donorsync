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
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "oklch(0.98 0.003 20)" }}
    >
      {/* Background glow orbs */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none animate-pulse"
        style={{
          background:
            "radial-gradient(circle, oklch(0.52 0.22 27 / 0.7) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.52 0.22 27 / 0.5) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-accent transition-colors"
            style={{ borderColor: "oklch(0.52 0.22 27 / 0.3)" }}
            data-ocid="auth.back.button"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.50 0.22 27), oklch(0.42 0.20 22))",
              boxShadow: "0 0 16px oklch(0.52 0.22 27 / 0.4)",
            }}
          >
            <Heart className="w-4 h-4 text-white fill-white/60" />
            <span className="font-display font-bold text-base text-white">
              DonorSync
            </span>
          </div>
        </div>

        <Tabs defaultValue="login">
          <TabsList
            className="w-full rounded-full mb-6"
            style={{ background: "oklch(0.96 0.025 18)" }}
            data-ocid="auth.tabs"
          >
            <TabsTrigger
              value="login"
              className="flex-1 rounded-full data-[state=active]:text-white"
              style={{ "--tw-bg-opacity": "1" } as React.CSSProperties}
              data-ocid="auth.login.tab"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="flex-1 rounded-full data-[state=active]:text-white"
              data-ocid="auth.signup.tab"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login">
            <motion.div
              className="rounded-3xl overflow-hidden"
              style={{
                boxShadow:
                  "0 8px 40px oklch(0.52 0.22 27 / 0.15), 0 2px 8px oklch(0 0 0 / 0.06)",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Red banner */}
              <div
                className="px-6 py-5 flex items-center gap-3"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.50 0.22 27), oklch(0.40 0.20 22))",
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white fill-white/60" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-white">
                    Welcome back
                  </h2>
                  <p className="text-white/70 text-xs mt-0.5">
                    Sign in to your DonorSync account
                  </p>
                </div>
              </div>

              {/* Form body */}
              <div className="bg-white p-6 space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-semibold">Email</Label>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      className="rounded-xl mt-1"
                      data-ocid="auth.email.input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Password</Label>
                    <Input
                      placeholder="Your password"
                      type="password"
                      className="rounded-xl mt-1"
                      data-ocid="auth.password.input"
                    />
                  </div>
                </div>

                <Button
                  className="w-full rounded-full text-white font-semibold pulse-glow"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.50 0.22 27), oklch(0.42 0.20 22))",
                  }}
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
                    <span className="bg-white px-3 text-xs text-muted-foreground">
                      or continue with
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full rounded-full hover:bg-accent"
                  style={{ borderColor: "oklch(0.52 0.22 27 / 0.3)" }}
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  data-ocid="auth.internet_identity.button"
                >
                  <Shield
                    className="w-4 h-4 mr-2"
                    style={{ color: "oklch(0.50 0.22 27)" }}
                  />
                  Internet Identity
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* SIGNUP */}
          <TabsContent value="signup">
            <AnimatePresence mode="wait">
              {signupStep === "role" && (
                <motion.div
                  key="role"
                  className="rounded-3xl overflow-hidden"
                  style={{ boxShadow: "0 8px 40px oklch(0.52 0.22 27 / 0.15)" }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                >
                  {/* Red banner */}
                  <div
                    className="px-6 py-5"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.50 0.22 27), oklch(0.40 0.20 22))",
                    }}
                  >
                    <h2 className="font-display font-bold text-xl text-white">
                      Join DonorSync
                    </h2>
                    <p className="text-white/70 text-xs mt-1">
                      Select your role to get started
                    </p>
                  </div>

                  <div className="bg-white p-6">
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {ROLES.map((role) => (
                        <button
                          type="button"
                          key={role.value}
                          onClick={() => setSelectedRole(role.value)}
                          data-ocid={`signup.role.${role.value.toLowerCase()}.button`}
                          className="p-4 rounded-xl border-2 text-left transition-all duration-200"
                          style={{
                            borderColor:
                              selectedRole === role.value
                                ? "oklch(0.50 0.22 27)"
                                : "oklch(0.92 0.006 20)",
                            background:
                              selectedRole === role.value
                                ? "oklch(0.50 0.22 27 / 0.06)"
                                : "white",
                            boxShadow:
                              selectedRole === role.value
                                ? "0 0 14px oklch(0.52 0.22 27 / 0.2)"
                                : "none",
                          }}
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
                      className="w-full rounded-full text-white font-semibold"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.50 0.22 27), oklch(0.42 0.20 22))",
                        boxShadow: "0 0 16px oklch(0.52 0.22 27 / 0.35)",
                      }}
                      onClick={() => setSignupStep("info")}
                      data-ocid="signup.next.button"
                    >
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {signupStep === "info" && (
                <motion.div
                  key="info"
                  className="rounded-3xl overflow-hidden"
                  style={{ boxShadow: "0 8px 40px oklch(0.52 0.22 27 / 0.15)" }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                >
                  {/* Red banner */}
                  <div
                    className="px-6 py-4 flex items-center gap-3"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.50 0.22 27), oklch(0.40 0.20 22))",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setSignupStep("role")}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="font-display font-bold text-lg text-white">
                        Your Information
                      </h2>
                      <p className="text-white/70 text-xs">
                        Role:{" "}
                        {ROLES.find((r) => r.value === selectedRole)?.label}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 space-y-4">
                    {!identity ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground mb-3">
                          Connect Internet Identity to continue
                        </p>
                        <Button
                          variant="outline"
                          className="rounded-full"
                          style={{
                            borderColor: "oklch(0.52 0.22 27 / 0.3)",
                            color: "oklch(0.50 0.22 27)",
                          }}
                          onClick={handleLogin}
                          disabled={isLoggingIn}
                          data-ocid="signup.connect_identity.button"
                        >
                          <Shield className="w-4 h-4 mr-2" />
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
                        <Label className="text-xs font-semibold">
                          Full Name *
                        </Label>
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
                        <Label className="text-xs font-semibold">Email *</Label>
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
                        <Label className="text-xs font-semibold">Phone *</Label>
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
                        <Label className="text-xs font-semibold">Address</Label>
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
                          <Label className="text-xs font-semibold">
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
                          <Label className="text-xs font-semibold">
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
                          <Label className="text-xs font-semibold">
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
                      className="w-full rounded-full text-white font-semibold"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.50 0.22 27), oklch(0.42 0.20 22))",
                        boxShadow: "0 0 16px oklch(0.52 0.22 27 / 0.35)",
                      }}
                      onClick={handleSignupSubmit}
                      disabled={submitting || !identity}
                      data-ocid="signup.submit.button"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Submit for Verification
                    </Button>
                  </div>
                </motion.div>
              )}

              {signupStep === "pending" && (
                <motion.div
                  key="pending"
                  className="bg-white rounded-3xl p-8 text-center"
                  style={{ boxShadow: "0 8px 40px oklch(0.52 0.22 27 / 0.15)" }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: "oklch(0.50 0.22 27 / 0.10)",
                      boxShadow: "0 0 24px oklch(0.52 0.22 27 / 0.3)",
                    }}
                  >
                    <CheckCircle
                      className="w-8 h-8"
                      style={{ color: "oklch(0.50 0.22 27)" }}
                    />
                  </div>
                  <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                    Verification Pending
                  </h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    Your profile has been submitted. Our admin team will review
                    and approve your account within 24–48 hours.
                  </p>
                  <Button
                    className="w-full rounded-full text-white font-semibold pulse-glow"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.50 0.22 27), oklch(0.42 0.20 22))",
                    }}
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
