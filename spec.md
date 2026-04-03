# DonorSync

## Current State
DonorSync is a full-stack donation platform with role-based dashboards (Admin, Hospital, Trust, Doctor, PublicUser). The UI already uses a red-white color palette via OKLCH tokens in index.css. However, it lacks the luminant/glow aesthetic the user wants — backgrounds are plain white, accents are muted, and there are no glowing effects or dramatic visual character.

## Requested Changes (Diff)

### Add
- Luminant red glow effects on primary buttons and key accent elements
- Glass-morphism cards with subtle red-tinted borders
- Animated gradient hero areas in LandingPage and HomeScreen
- Glowing pulse on CTAs (Register, Donate, Contribute buttons)
- Vibrant red gradient header bar with glow
- Red spotlight/radial glow in LandingPage hero
- Neon-glow active state on BottomNav
- Dark/deep background option for landing page hero for dramatic contrast
- Glowing stat cards in AdminDashboard

### Modify
- index.css: deepen red tokens, add glow utility classes (glow-red, glow-card, pulse-glow)
- LandingPage: full-screen hero with red radial glow, animated gradient background
- HomeScreen: luminant section headers, glowing featured cards
- BottomNav: active tab gets glowing red indicator
- App header: red gradient with glow
- Buttons (primary): add box-shadow glow on hover/active
- Cards: subtle glowing border on hover
- AuthPage: glowing form card with red accent

### Remove
- Plain flat white card backgrounds (replace with glass/luminant style)
- Dull muted borders (replace with red-tinted borders)

## Implementation Plan
1. Update index.css with richer OKLCH tokens, glow utility classes, animation keyframes
2. Update LandingPage with dramatic hero, radial glow, animated elements
3. Update HomeScreen with luminant cards and section styling
4. Update BottomNav with glowing active state
5. Update App.tsx header with red gradient
6. Update AuthPage with glowing card
7. Polish button styles across all pages for glow effect
