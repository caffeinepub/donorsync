import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import UserApproval "user-approval/approval";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize access control and approval state
  let accessControlState = AccessControl.initState();
  let approvalState = UserApproval.initState(accessControlState);
  include MixinAuthorization(accessControlState);

  // Application-specific role types
  public type AppRole = {
    #Admin;
    #Hospital;
    #Trust;
    #Doctor;
    #PublicUser;
  };

  public type VerificationStatus = {
    #Pending;
    #Approved;
    #Rejected;
  };

  // User Profile (maps to AccessControl.UserRole and custom AppRole)
  public type UserProfile = {
    id : Principal;
    name : Text;
    email : Text;
    phone : Text;
    role : AppRole;
    verificationStatus : VerificationStatus;
    createdAt : Time.Time;
    lastProfileUpdate : Time.Time;
    aadharNumber : ?Text; // for PublicUser
    specialization : ?Text; // for Doctor
    hospitalId : ?Principal; // for Doctor
    registrationNumber : ?Text; // for Hospital/Trust
    address : Text;
    bio : Text;
  };

  public type DonationEvent = {
    id : Text;
    hospitalId : Principal;
    title : Text;
    bloodGroupsNeeded : [Text];
    date : Time.Time;
    location : Text;
    maxRegistrations : Nat;
    currentRegistrations : Nat;
    status : Text;
  };

  public type DonationNeed = {
    id : Text;
    trustId : Principal;
    needType : { #Money; #Clothes; #Essentials };
    title : Text;
    description : Text;
    targetAmount : Nat;
    receivedAmount : Nat;
    status : Text;
  };

  public type DonationRegistration = {
    id : Text;
    userId : Principal;
    eventId : Text;
    registeredAt : Time.Time;
    status : Text;
  };

  public type Contribution = {
    id : Text;
    userId : Principal;
    needId : Text;
    amount : Nat;
    contributionType : { #Money; #Clothes; #Essentials };
    contributedAt : Time.Time;
  };

  // Data stores
  let userProfiles = Map.empty<Principal, UserProfile>();
  let donationEvents = Map.empty<Text, DonationEvent>();
  let donationNeeds = Map.empty<Text, DonationNeed>();
  let donationRegistrations = Map.empty<Text, DonationRegistration>();
  let contributions = Map.empty<Text, Contribution>();

  // Counter for generating IDs
  var eventCounter : Nat = 0;
  var needCounter : Nat = 0;
  var registrationCounter : Nat = 0;
  var contributionCounter : Nat = 0;

  // Helper: Check if user is admin
  func isAdminUser(caller : Principal) : Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // Helper: Get user profile or trap
  func getUserProfileOrTrap(user : Principal) : UserProfile {
    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile };
    };
  };

  // Helper: Check if user has specific app role
  func hasAppRole(caller : Principal, requiredRole : AppRole) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.role, requiredRole) {
          case (#Admin, #Admin) { true };
          case (#Hospital, #Hospital) { true };
          case (#Trust, #Trust) { true };
          case (#Doctor, #Doctor) { true };
          case (#PublicUser, #PublicUser) { true };
          case _ { false };
        };
      };
    };
  };

  // Helper: Check if profile can be updated (6-month restriction for PublicUser)
  func canUpdateProfile(profile : UserProfile) : Bool {
    let sixMonthsInNanos : Time.Time = 6 * 30 * 24 * 60 * 60 * 1_000_000_000;
    let now = Time.now();
    (now - profile.lastProfileUpdate) >= sixMonthsInNanos;
  };

  // ===== CORE COMPONENTS =====

  public query ({ caller }) func isCallerApproved() : async Bool {
    UserApproval.isApproved(approvalState, caller) or isAdminUser(caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (isAdminUser(caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not isAdminUser(caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not isAdminUser(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or be admin");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    
    // Verify caller matches profile ID
    if (caller != profile.id) {
      Runtime.trap("Unauthorized: Profile ID must match caller");
    };

    // Check 6-month restriction for PublicUser updates
    switch (userProfiles.get(caller)) {
      case (?existingProfile) {
        switch (existingProfile.role) {
          case (#PublicUser) {
            if (not canUpdateProfile(existingProfile)) {
              Runtime.trap("Profile update restricted: Must wait 6 months since last update");
            };
          };
          case _ {};
        };
      };
      case null {};
    };

    userProfiles.add(caller, profile);
  };

  // ===== ADMIN FUNCTIONS =====

  public shared ({ caller }) func approveUser(userId : Principal, approved : Bool) : async () {
    if (not isAdminUser(caller)) {
      Runtime.trap("Unauthorized: Only admins can approve users");
    };

    let profile = getUserProfileOrTrap(userId);
    let newStatus : VerificationStatus = if (approved) { #Approved } else { #Rejected };
    let updatedProfile = {
      profile with verificationStatus = newStatus;
    };
    userProfiles.add(userId, updatedProfile);
  };

  public query ({ caller }) func getAllPendingVerifications() : async [UserProfile] {
    if (not isAdminUser(caller)) {
      Runtime.trap("Unauthorized: Only admins can view pending verifications");
    };

    let pending = userProfiles.values().toArray().filter(
      func(p : UserProfile) : Bool {
        switch (p.verificationStatus) {
          case (#Pending) { true };
          case _ { false };
        };
      }
    );
    pending;
  };

  public query ({ caller }) func getSystemAnalytics() : async {
    totalDonors : Nat;
    livesSaved : Nat;
    activePrograms : Nat;
    urgentNeeds : Nat;
  } {
    if (not isAdminUser(caller)) {
      Runtime.trap("Unauthorized: Only admins can view system analytics");
    };

    let totalDonors = userProfiles.values().toArray().filter(
      func(p : UserProfile) : Bool {
        switch (p.role) {
          case (#PublicUser) { true };
          case _ { false };
        };
      }
    ).size();

    let activePrograms = donationEvents.values().toArray().size();
    let urgentNeeds = donationNeeds.values().toArray().size();

    {
      totalDonors = totalDonors;
      livesSaved = donationRegistrations.values().toArray().size();
      activePrograms = activePrograms;
      urgentNeeds = urgentNeeds;
    };
  };

  public query ({ caller }) func listUsersByRole(role : AppRole) : async [UserProfile] {
    if (not isAdminUser(caller)) {
      Runtime.trap("Unauthorized: Only admins can list users by role");
    };

    userProfiles.values().toArray().filter<UserProfile>(
      func(p : UserProfile) : Bool {
        switch (p.role, role) {
          case (#Admin, #Admin) { true };
          case (#Hospital, #Hospital) { true };
          case (#Trust, #Trust) { true };
          case (#Doctor, #Doctor) { true };
          case (#PublicUser, #PublicUser) { true };
          case _ { false };
        };
      }
    );
  };

  // ===== HOSPITAL FUNCTIONS =====

  public shared ({ caller }) func createDonationEvent(
    title : Text,
    bloodGroupsNeeded : [Text],
    date : Time.Time,
    location : Text,
    maxRegistrations : Nat
  ) : async Text {
    if (not hasAppRole(caller, #Hospital)) {
      Runtime.trap("Unauthorized: Only hospitals can create donation events");
    };

    let profile = getUserProfileOrTrap(caller);
    switch (profile.verificationStatus) {
      case (#Approved) {};
      case _ { Runtime.trap("Hospital must be verified to create events") };
    };

    eventCounter += 1;
    let eventId = "event_" # eventCounter.toText();
    
    let event : DonationEvent = {
      id = eventId;
      hospitalId = caller;
      title = title;
      bloodGroupsNeeded = bloodGroupsNeeded;
      date = date;
      location = location;
      maxRegistrations = maxRegistrations;
      currentRegistrations = 0;
      status = "Active";
    };

    donationEvents.add(eventId, event);
    eventId;
  };

  public shared ({ caller }) func updateDonationEvent(eventId : Text, event : DonationEvent) : async () {
    if (not hasAppRole(caller, #Hospital)) {
      Runtime.trap("Unauthorized: Only hospitals can update donation events");
    };

    let existingEvent = switch (donationEvents.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?e) { e };
    };

    if (existingEvent.hospitalId != caller) {
      Runtime.trap("Unauthorized: Can only update your own events");
    };

    donationEvents.add(eventId, event);
  };

  public shared ({ caller }) func deleteDonationEvent(eventId : Text) : async () {
    if (not hasAppRole(caller, #Hospital)) {
      Runtime.trap("Unauthorized: Only hospitals can delete donation events");
    };

    let existingEvent = switch (donationEvents.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?e) { e };
    };

    if (existingEvent.hospitalId != caller) {
      Runtime.trap("Unauthorized: Can only delete your own events");
    };

    donationEvents.remove(eventId);
  };

  public shared ({ caller }) func approveDoctorForHospital(doctorId : Principal) : async () {
    if (not hasAppRole(caller, #Hospital)) {
      Runtime.trap("Unauthorized: Only hospitals can approve doctors");
    };

    let doctorProfile = getUserProfileOrTrap(doctorId);
    
    switch (doctorProfile.role) {
      case (#Doctor) {
        switch (doctorProfile.hospitalId) {
          case (?hId) {
            if (hId != caller) {
              Runtime.trap("Doctor is not linked to your hospital");
            };
          };
          case null { Runtime.trap("Doctor has no hospital association") };
        };
      };
      case _ { Runtime.trap("User is not a doctor") };
    };

    // Update verification status
    let updatedProfile = {
      doctorProfile with verificationStatus = #Approved;
    };
    userProfiles.add(doctorId, updatedProfile);
  };

  public query ({ caller }) func getHospitalRegistrations() : async [DonationRegistration] {
    if (not hasAppRole(caller, #Hospital)) {
      Runtime.trap("Unauthorized: Only hospitals can view registrations");
    };

    let hospitalEvents = donationEvents.values().toArray().filter(
      func(e : DonationEvent) : Bool { e.hospitalId == caller }
    );

    let eventIds = hospitalEvents.map(func(e) { e.id });

    donationRegistrations.values().toArray().filter<DonationRegistration>(
      func(r : DonationRegistration) : Bool {
        eventIds.find<Text>(func(id) { id == r.eventId }) != null
      }
    );
  };

  public query ({ caller }) func getHospitalMetrics() : async {
    totalEvents : Nat;
    totalRegistrations : Nat;
    activeEvents : Nat;
  } {
    if (not hasAppRole(caller, #Hospital)) {
      Runtime.trap("Unauthorized: Only hospitals can view metrics");
    };

    let hospitalEvents = donationEvents.values().toArray().filter(
      func(e : DonationEvent) : Bool { e.hospitalId == caller }
    );

    let activeEvents = hospitalEvents.filter(
      func(e : DonationEvent) : Bool { e.status == "Active" }
    );

    let registrations = donationRegistrations.values().toArray();
    let eventIds = hospitalEvents.map(func(e) { e.id });
    let hospitalRegs = registrations.filter(
      func(r : DonationRegistration) : Bool {
        eventIds.find<Text>(func(id) { id == r.eventId }) != null
      }
    );

    {
      totalEvents = hospitalEvents.size();
      totalRegistrations = hospitalRegs.size();
      activeEvents = activeEvents.size();
    };
  };

  // ===== TRUST FUNCTIONS =====

  public shared ({ caller }) func createDonationNeed(
    needType : { #Money; #Clothes; #Essentials },
    title : Text,
    description : Text,
    targetAmount : Nat
  ) : async Text {
    if (not hasAppRole(caller, #Trust)) {
      Runtime.trap("Unauthorized: Only trusts can create donation needs");
    };

    let profile = getUserProfileOrTrap(caller);
    switch (profile.verificationStatus) {
      case (#Approved) {};
      case _ { Runtime.trap("Trust must be verified to create needs") };
    };

    needCounter += 1;
    let needId = "need_" # needCounter.toText();
    
    let need : DonationNeed = {
      id = needId;
      trustId = caller;
      needType = needType;
      title = title;
      description = description;
      targetAmount = targetAmount;
      receivedAmount = 0;
      status = "Active";
    };

    donationNeeds.add(needId, need);
    needId;
  };

  public shared ({ caller }) func updateDonationNeed(needId : Text, need : DonationNeed) : async () {
    if (not hasAppRole(caller, #Trust)) {
      Runtime.trap("Unauthorized: Only trusts can update donation needs");
    };

    let existingNeed = switch (donationNeeds.get(needId)) {
      case (null) { Runtime.trap("Need not found") };
      case (?n) { n };
    };

    if (existingNeed.trustId != caller) {
      Runtime.trap("Unauthorized: Can only update your own needs");
    };

    donationNeeds.add(needId, need);
  };

  public query ({ caller }) func getTrustContributions() : async [Contribution] {
    if (not hasAppRole(caller, #Trust)) {
      Runtime.trap("Unauthorized: Only trusts can view contributions");
    };

    let trustNeeds = donationNeeds.values().toArray().filter(
      func(n : DonationNeed) : Bool { n.trustId == caller }
    );

    let needIds = trustNeeds.map(func(n) { n.id });

    contributions.values().toArray().filter<Contribution>(
      func(c : Contribution) : Bool {
        needIds.find<Text>(func(id) { id == c.needId }) != null
      }
    );
  };

  public query ({ caller }) func getTrustAnalytics() : async {
    totalNeeds : Nat;
    totalContributions : Nat;
    totalAmountReceived : Nat;
  } {
    if (not hasAppRole(caller, #Trust)) {
      Runtime.trap("Unauthorized: Only trusts can view analytics");
    };

    let trustNeeds = donationNeeds.values().toArray().filter(
      func(n : DonationNeed) : Bool { n.trustId == caller }
    );

    let needIds = trustNeeds.map(func(n) { n.id });
    let trustContributions = contributions.values().toArray().filter(
      func(c : Contribution) : Bool {
        needIds.find<Text>(func(id) { id == c.needId }) != null
      }
    );

    let totalAmount = trustContributions.foldLeft(
      0,
      func(acc, c) { acc + c.amount }
    );

    {
      totalNeeds = trustNeeds.size();
      totalContributions = trustContributions.size();
      totalAmountReceived = totalAmount;
    };
  };

  // ===== DOCTOR FUNCTIONS =====

  public shared ({ caller }) func submitDoctorVerification(hospitalId : Principal) : async () {
    if (not hasAppRole(caller, #Doctor)) {
      Runtime.trap("Unauthorized: Only doctors can submit verification");
    };

    let profile = getUserProfileOrTrap(caller);
    let updatedProfile = {
      profile with 
      hospitalId = ?hospitalId;
      verificationStatus = #Pending;
    };
    userProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getDoctorVerificationStatus() : async VerificationStatus {
    if (not hasAppRole(caller, #Doctor)) {
      Runtime.trap("Unauthorized: Only doctors can check verification status");
    };

    let profile = getUserProfileOrTrap(caller);
    profile.verificationStatus;
  };

  // ===== PUBLIC USER FUNCTIONS =====

  public shared ({ caller }) func registerForDonationEvent(eventId : Text) : async Text {
    if (not hasAppRole(caller, #PublicUser)) {
      Runtime.trap("Unauthorized: Only public users can register for events");
    };

    let profile = getUserProfileOrTrap(caller);
    switch (profile.verificationStatus) {
      case (#Approved) {};
      case _ { Runtime.trap("User must be verified to register") };
    };

    let event = switch (donationEvents.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?e) { e };
    };

    if (event.currentRegistrations >= event.maxRegistrations) {
      Runtime.trap("Event is full");
    };

    registrationCounter += 1;
    let regId = "reg_" # registrationCounter.toText();
    
    let registration : DonationRegistration = {
      id = regId;
      userId = caller;
      eventId = eventId;
      registeredAt = Time.now();
      status = "Confirmed";
    };

    donationRegistrations.add(regId, registration);

    // Update event registration count
    let updatedEvent = {
      event with currentRegistrations = event.currentRegistrations + 1;
    };
    donationEvents.add(eventId, updatedEvent);

    regId;
  };

  public shared ({ caller }) func contributeToNeed(
    needId : Text,
    amount : Nat,
    contributionType : { #Money; #Clothes; #Essentials }
  ) : async Text {
    if (not hasAppRole(caller, #PublicUser)) {
      Runtime.trap("Unauthorized: Only public users can contribute");
    };

    let profile = getUserProfileOrTrap(caller);
    switch (profile.verificationStatus) {
      case (#Approved) {};
      case _ { Runtime.trap("User must be verified to contribute") };
    };

    let need = switch (donationNeeds.get(needId)) {
      case (null) { Runtime.trap("Need not found") };
      case (?n) { n };
    };

    contributionCounter += 1;
    let contribId = "contrib_" # contributionCounter.toText();
    
    let contribution : Contribution = {
      id = contribId;
      userId = caller;
      needId = needId;
      amount = amount;
      contributionType = contributionType;
      contributedAt = Time.now();
    };

    contributions.add(contribId, contribution);

    // Update need received amount
    let updatedNeed = {
      need with receivedAmount = need.receivedAmount + amount;
    };
    donationNeeds.add(needId, updatedNeed);

    contribId;
  };

  public query ({ caller }) func checkCanUpdateProfile() : async Bool {
    if (not hasAppRole(caller, #PublicUser)) {
      Runtime.trap("Unauthorized: Only public users need profile update checks");
    };

    let profile = getUserProfileOrTrap(caller);
    canUpdateProfile(profile);
  };

  // ===== GENERAL PUBLIC FUNCTIONS =====

  public query func getNearbyEvents(location : Text) : async [DonationEvent] {
    // In production, implement geolocation filtering
    donationEvents.values().toArray().filter<DonationEvent>(
      func(e : DonationEvent) : Bool {
        e.status == "Active" and e.location.contains(#text location)
      }
    );
  };

  public query func getUrgentNeeds() : async [DonationNeed] {
    donationNeeds.values().toArray().filter<DonationNeed>(
      func(n : DonationNeed) : Bool {
        n.status == "Active" and n.receivedAmount < n.targetAmount
      }
    );
  };

  public query func getLivesSavedCount() : async Nat {
    donationRegistrations.values().toArray().size();
  };

  public query func getAllDonationEvents() : async [DonationEvent] {
    donationEvents.values().toArray();
  };

  public query func getAllDonationNeeds() : async [DonationNeed] {
    donationNeeds.values().toArray();
  };
};
