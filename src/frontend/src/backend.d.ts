import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export type Time = bigint;
export interface DonationRegistration {
    id: string;
    status: string;
    eventId: string;
    userId: Principal;
    registeredAt: Time;
}
export interface DonationNeed {
    id: string;
    status: string;
    title: string;
    trustId: Principal;
    needType: Variant_Clothes_Money_Essentials;
    description: string;
    receivedAmount: bigint;
    targetAmount: bigint;
}
export interface DonationEvent {
    id: string;
    status: string;
    title: string;
    bloodGroupsNeeded: Array<string>;
    date: Time;
    currentRegistrations: bigint;
    hospitalId: Principal;
    maxRegistrations: bigint;
    location: string;
}
export interface Contribution {
    id: string;
    contributedAt: Time;
    userId: Principal;
    needId: string;
    amount: bigint;
    contributionType: Variant_Clothes_Money_Essentials;
}
export interface UserProfile {
    id: Principal;
    bio: string;
    lastProfileUpdate: Time;
    name: string;
    createdAt: Time;
    role: AppRole;
    registrationNumber?: string;
    email: string;
    hospitalId?: Principal;
    aadharNumber?: string;
    address: string;
    specialization?: string;
    phone: string;
    verificationStatus: VerificationStatus;
}
export enum AppRole {
    PublicUser = "PublicUser",
    Doctor = "Doctor",
    Trust = "Trust",
    Admin = "Admin",
    Hospital = "Hospital"
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_Clothes_Money_Essentials {
    Clothes = "Clothes",
    Money = "Money",
    Essentials = "Essentials"
}
export enum VerificationStatus {
    Approved = "Approved",
    Rejected = "Rejected",
    Pending = "Pending"
}
export interface backendInterface {
    approveDoctorForHospital(doctorId: Principal): Promise<void>;
    approveUser(userId: Principal, approved: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkCanUpdateProfile(): Promise<boolean>;
    contributeToNeed(needId: string, amount: bigint, contributionType: Variant_Clothes_Money_Essentials): Promise<string>;
    createDonationEvent(title: string, bloodGroupsNeeded: Array<string>, date: Time, location: string, maxRegistrations: bigint): Promise<string>;
    createDonationNeed(needType: Variant_Clothes_Money_Essentials, title: string, description: string, targetAmount: bigint): Promise<string>;
    deleteDonationEvent(eventId: string): Promise<void>;
    getAllDonationEvents(): Promise<Array<DonationEvent>>;
    getAllDonationNeeds(): Promise<Array<DonationNeed>>;
    getAllPendingVerifications(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDoctorVerificationStatus(): Promise<VerificationStatus>;
    getHospitalMetrics(): Promise<{
        totalEvents: bigint;
        activeEvents: bigint;
        totalRegistrations: bigint;
    }>;
    getHospitalRegistrations(): Promise<Array<DonationRegistration>>;
    getLivesSavedCount(): Promise<bigint>;
    getNearbyEvents(location: string): Promise<Array<DonationEvent>>;
    getSystemAnalytics(): Promise<{
        urgentNeeds: bigint;
        livesSaved: bigint;
        activePrograms: bigint;
        totalDonors: bigint;
    }>;
    getTrustAnalytics(): Promise<{
        totalContributions: bigint;
        totalAmountReceived: bigint;
        totalNeeds: bigint;
    }>;
    getTrustContributions(): Promise<Array<Contribution>>;
    getUrgentNeeds(): Promise<Array<DonationNeed>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    listUsersByRole(role: AppRole): Promise<Array<UserProfile>>;
    registerForDonationEvent(eventId: string): Promise<string>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    submitDoctorVerification(hospitalId: Principal): Promise<void>;
    updateDonationEvent(eventId: string, event: DonationEvent): Promise<void>;
    updateDonationNeed(needId: string, need: DonationNeed): Promise<void>;
}
