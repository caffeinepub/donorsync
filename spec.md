# DonorSync

## Current State
New project. Empty Motoko backend and no frontend screens.

## Requested Changes (Diff)

### Add
- Full DonorSync donation platform web application
- Role-based authentication: Public User, Doctor, Hospital, Trust/Charity, Admin
- Multi-level verification system: hospital→admin, trust→admin, doctor→hospital→admin, user→Aadhar→admin
- Admin dashboard: approve users, analytics (total donors, lives saved, urgent needs), user management
- Hospital dashboard: manage blood donation programs, verify doctors, view nearby donors, metrics
- Trust/Charity dashboard: post donation needs (money, clothes, essentials), track donations
- Doctor dashboard: two-step verification status, availability management, program participation
- Public user dashboard: Aadhar verification status, donate blood/money/clothes, register for programs, 6-month profile update restriction
- Home screen: urgent needs cards, lives saved stats, nearby hospitals with active programs
- Donation screen: blood donation drives + other donations (money, clothes, essentials) to trusts
- Near Me feature: location-based hospitals, blood banks, trusts with distance info
- Menu screen: role-adaptive navigation
- Bottom nav bar: Menu, Home, Donation tabs

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Select authorization and user-approval components
2. Generate Motoko backend with all data models and role-based logic
3. Build frontend: auth flow (login/signup with role selection), role dashboards, home, donation, near me, menu screens
4. Implement 6-month profile update restriction tracking
5. Wire backend APIs to frontend state management
