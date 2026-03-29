import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AppRole,
  ApprovalStatus,
  type Contribution,
  type DonationEvent,
  type DonationNeed,
  type DonationRegistration,
  type UserProfile,
  Variant_Clothes_Money_Essentials,
  VerificationStatus,
} from "../backend";
import { useActor } from "./useActor";

export type {
  UserProfile,
  DonationEvent,
  DonationNeed,
  Contribution,
  DonationRegistration,
};
export {
  AppRole,
  ApprovalStatus,
  VerificationStatus,
  Variant_Clothes_Money_Essentials,
};

export function useMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsApproved() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isApproved"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSystemAnalytics() {
  const { actor, isFetching } = useActor();
  return useQuery<{
    urgentNeeds: bigint;
    livesSaved: bigint;
    activePrograms: bigint;
    totalDonors: bigint;
  } | null>({
    queryKey: ["systemAnalytics"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSystemAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePendingVerifications() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["pendingVerifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPendingVerifications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllDonationEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<DonationEvent[]>({
    queryKey: ["allDonationEvents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDonationEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllDonationNeeds() {
  const { actor, isFetching } = useActor();
  return useQuery<DonationNeed[]>({
    queryKey: ["allDonationNeeds"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDonationNeeds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUrgentNeeds() {
  const { actor, isFetching } = useActor();
  return useQuery<DonationNeed[]>({
    queryKey: ["urgentNeeds"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUrgentNeeds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLivesSaved() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["livesSaved"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getLivesSavedCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useNearbyEvents(location: string) {
  const { actor, isFetching } = useActor();
  return useQuery<DonationEvent[]>({
    queryKey: ["nearbyEvents", location],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNearbyEvents(location);
    },
    enabled: !!actor && !isFetching && !!location,
  });
}

export function useHospitalMetrics() {
  const { actor, isFetching } = useActor();
  return useQuery<{
    totalEvents: bigint;
    activeEvents: bigint;
    totalRegistrations: bigint;
  } | null>({
    queryKey: ["hospitalMetrics"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHospitalMetrics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTrustAnalytics() {
  const { actor, isFetching } = useActor();
  return useQuery<{
    totalContributions: bigint;
    totalAmountReceived: bigint;
    totalNeeds: bigint;
  } | null>({
    queryKey: ["trustAnalytics"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTrustAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTrustContributions() {
  const { actor, isFetching } = useActor();
  return useQuery<Contribution[]>({
    queryKey: ["trustContributions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrustContributions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDoctorVerificationStatus() {
  const { actor, isFetching } = useActor();
  return useQuery<VerificationStatus | null>({
    queryKey: ["doctorVerificationStatus"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDoctorVerificationStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCanUpdateProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["canUpdateProfile"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.checkCanUpdateProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListUsersByRole(role: AppRole) {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["usersByRole", role],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUsersByRole(role);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useHospitalRegistrations() {
  const { actor, isFetching } = useActor();
  return useQuery<DonationRegistration[]>({
    queryKey: ["hospitalRegistrations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHospitalRegistrations();
    },
    enabled: !!actor && !isFetching,
  });
}

// --- Mutations ---

export function useApproveUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      approved,
    }: { userId: Principal; approved: boolean }) =>
      actor!.approveUser(userId, approved),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pendingVerifications"] });
      qc.invalidateQueries({ queryKey: ["usersByRole"] });
    },
  });
}

export function useCreateDonationEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      bloodGroupsNeeded: string[];
      date: bigint;
      location: string;
      maxRegistrations: bigint;
    }) =>
      actor!.createDonationEvent(
        data.title,
        data.bloodGroupsNeeded,
        data.date,
        data.location,
        data.maxRegistrations,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allDonationEvents"] }),
  });
}

export function useCreateDonationNeed() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      needType: Variant_Clothes_Money_Essentials;
      title: string;
      description: string;
      targetAmount: bigint;
    }) =>
      actor!.createDonationNeed(
        data.needType,
        data.title,
        data.description,
        data.targetAmount,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allDonationNeeds"] }),
  });
}

export function useRegisterForEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => actor!.registerForDonationEvent(eventId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allDonationEvents"] }),
  });
}

export function useContributeToNeed() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      needId: string;
      amount: bigint;
      contributionType: Variant_Clothes_Money_Essentials;
    }) =>
      actor!.contributeToNeed(data.needId, data.amount, data.contributionType),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allDonationNeeds"] }),
  });
}

export function useSubmitDoctorVerification() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (hospitalId: Principal) =>
      actor!.submitDoctorVerification(hospitalId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["doctorVerificationStatus"] }),
  });
}

export function useApproveDoctorForHospital() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (doctorId: Principal) =>
      actor!.approveDoctorForHospital(doctorId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["usersByRole"] }),
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profile: UserProfile) => actor!.saveCallerUserProfile(profile),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
      qc.invalidateQueries({ queryKey: ["canUpdateProfile"] });
    },
  });
}

export function useRequestApproval() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => actor!.requestApproval(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myProfile"] }),
  });
}
