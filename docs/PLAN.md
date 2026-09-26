# SUTU — PLAN.md

> **SUTU = Support Us Together**  
> **Tagline:** One place. Every community.
>
> This document is the current product and frontend source of truth for SUTU.  
> Backend architecture, database implementation, and smart-contract implementation are intentionally deferred until the frontend experience is stable.

---

# 1. Product Overview

SUTU is a consumer-focused platform that lets people discover and support multiple online communities from one place.

The core problem:

> Online communities are fragmented across different platforms, while supporting them is also fragmented across different websites and payment experiences.

SUTU aims to create one simple support layer:

```text
Find a community
      ↓
Choose how much to support
      ↓
Pay
      ↓
Done
```

The blockchain layer should work as infrastructure behind the experience rather than becoming the experience itself.

The user should feel:

> "I am supporting a community."

Not:

> "I am interacting with a blockchain."

---

# 2. Product Vision

## Core Value Proposition

> **SUTU makes community support simple by bringing discovery and support into one place.**

## Hero Differentiator

The strongest product feature for the MVP is **multi-community support**:

```text
Community A    $5
Community B    $3
Community C    $2
----------------
Total          $10

        ↓

     One payment

        ↓

Community A    $5
Community B    $3
Community C    $2
```

This makes SUTU more than a generic donation page.

---

# 3. Product Principles

## 3.1 Consumer First

SUTU is designed primarily for ordinary users, including people who do not consider themselves crypto users.

The UI should prioritize familiar concepts such as:

- Discover
- Support
- Payment
- History
- Profile

Avoid exposing technical blockchain terminology unless necessary.

Do not make these the center of the UX:

- RPC
- Chain ID
- Nonce
- Smart contract
- Gas
- Wallet address

---

## 3.2 Blockchain as Infrastructure

Blockchain is used because it can provide programmable settlement and multi-recipient payment flows.

It should not dominate the interface.

---

## 3.3 Simple Primary Journey

The main experience should be:

```text
Discover
   ↓
Community
   ↓
Support
   ↓
Confirmation
   ↓
Done
```

For multiple communities:

```text
Discover
   ↓
Add communities
   ↓
Basket
   ↓
Support All
   ↓
Confirmation
   ↓
Done
```

---

## 3.4 Progressive Complexity

Only show additional information when it helps the user.

Example:

Instead of immediately showing:

```text
0x1234...
Gas: ...
Nonce: ...
Chain ID: ...
```

show:

```text
Support sent
Community A
$10
Completed
```

Technical transaction details can be available behind a secondary "View transaction" action.

---

# 4. Product Scope

SUTU has two major areas:

```text
SUTU
│
├── Landing / Marketing
│   ├── Hero
│   ├── What is SUTU
│   ├── How It Works
│   ├── Why SUTU
│   └── Footer
│
└── Application
    ├── Discover
    ├── Community Detail
    ├── Support
    ├── Support Basket
    ├── My Supports
    └── Profile
```

---

# 5. Landing Page

The landing page is the **marketing and introduction layer**.

Its purpose is to answer:

> What is SUTU and why should I use it?

It is not the user's main application dashboard.

## 5.1 Hero

Suggested messaging:

```text
One place. Every community.

Support the communities you care about
from one place.

[Discover Communities]
```

Primary CTA:

```text
Discover Communities
```

---

## 5.2 What Is SUTU?

Explain the problem and solution briefly.

Example structure:

```text
Today:
Communities are everywhere.
Support is everywhere too.

SUTU:
Find and support the communities you care about
from one place.
```

---

## 5.3 How It Works

Three simple steps:

```text
01 — Discover
Find communities you care about.

02 — Support
Choose how much you want to give.

03 — Done
SUTU handles the settlement.
```

Keep this section understandable to non-technical users.

---

## 5.4 Why SUTU

Focus on consumer value:

- One place
- Simple support
- Multiple communities
- One support flow
- Transparent support history

---

## 5.5 Landing Navigation

Recommended:

```text
SUTU

Home
How It Works
About

[Discover Communities]
```

`About` can be a section on the landing page instead of a separate application page.

`Contact` is not required as a primary navigation item.

Possible footer links:

```text
GitHub
Discord
Contact
```

---

# 6. Application Navigation

Once the user enters the actual application, navigation should focus on actions rather than marketing.

Recommended primary navigation:

```text
SUTU

Discover
My Supports
Profile

Support Basket
```

Desktop:

```text
[SUTU]   Discover   My Supports   [Basket]   [Profile]
```

Mobile can use a bottom navigation or compact navigation:

```text
Discover | My Supports | Basket | Profile
```

The application should not repeatedly show:

```text
About
Contact
Why SUTU
```

These belong primarily to the landing/marketing layer.

---

# 7. Application Sitemap

```text
/
└── Landing

/discover
└── Discover Communities

/communities/:id
└── Community Detail

/communities/:id/support
└── Support Flow

/basket
└── Support Basket

/my-supports
└── Support History

/my-supports/:id
└── Support Detail

/profile
└── User Profile
```

---

# 8. Discover Page

Route:

```text
/discover
```

This is the **heart of the application**.

SUTU should not treat a dashboard as the center of the consumer experience.

The user comes to SUTU primarily to answer:

> "Who do I want to support?"

## 8.1 Layout

```text
Discover communities

[ Search communities... ]

Categories

[Gaming] [Education] [Open Source]
[Art] [Music] [Technology]

Featured Communities

┌──────────────────────────────┐
│ Logo                         │
│ Community Name               │
│ Description                  │
│ Category                     │
│                              │
│ [View Community]             │
└──────────────────────────────┘
```

---

## 8.2 Discover Features

### MUST HAVE

- Search
- Community list
- Community card
- Category filtering
- Open community detail

### SHOULD HAVE

- Featured communities
- Popular communities
- Recently added communities

### LATER

- Personalized recommendations
- Trending algorithm
- Advanced filtering

---

# 9. Community Detail

Route:

```text
/communities/:id
```

Purpose:

Give users enough context to decide whether they want to support a community.

## 9.1 Suggested Layout

```text
Community Logo

Community Name
Category

Description

Supporters
Total Supported

[Support]

[Add to Basket]
```

## 9.2 Information

MVP:

- Logo
- Name
- Description
- Category
- Supporter count
- Total supported

Optional:

- Website
- Social links
- Community goals
- External community links

The page should stay focused on the support action.

---

# 10. Support Flow

Route:

```text
/communities/:id/support
```

This is one of the most important flows in SUTU.

The support flow should minimize friction.

---

## 10.1 Step 1 — Choose Amount

```text
Support Community A

Choose amount

[$1] [$5] [$10] [$25]

[Custom Amount]

[Continue]
```

Rules:

- Provide common preset amounts.
- Allow a custom amount.
- Prevent invalid/negative values.
- Show the selected community clearly.

---

## 10.2 Step 2 — Payment

```text
Payment

Select payment method

[Wallet]
[Other methods — future]

[Continue]
```

For the MVP, only one reliable payment rail needs to be implemented.

The UI can be designed so additional payment methods can be added later.

---

## 10.3 Step 3 — Review

```text
Review Support

Community A
$10

Payment method
Wallet

[Confirm Support]
```

This screen should provide a final chance to verify:

- community
- amount
- payment method

---

## 10.4 Step 4 — Processing

```text
Processing support...

Please wait.
```

The UI must prevent ambiguous states.

---

## 10.5 Step 5 — Success

```text
✓ Support sent

You supported

Community A

$10

Transaction confirmed.

[View Transaction]
[Back to Discover]
```

The success state should be visually clear and easy to understand.

---

# 11. Support Basket

Route:

```text
/basket
```

The Support Basket is a **key differentiator** for SUTU.

It allows users to support multiple communities in one payment interaction.

## 11.1 Example

```text
Your Support Basket

Community A        $5
Community B        $3
Community C        $2

----------------------

Total              $10

[Support All]
```

---

## 11.2 Basket User Flow

```text
Discover
   ↓
Community A
   ↓
Add to Basket
   ↓
Community B
   ↓
Add to Basket
   ↓
Community C
   ↓
Add to Basket
   ↓
Basket
   ↓
Support All
   ↓
Payment
   ↓
Settlement
   ↓
Multiple Communities
```

---

## 11.3 Basket Rules

- A community can be added to the basket.
- The user can set an amount per community.
- Total is calculated automatically.
- Duplicate communities are not allowed.
- The user can edit the amount.
- The user can remove an item.
- Empty basket has a clear empty state.
- Basket count is visible in navigation.
- Basket state persists during the current application session.

---

# 12. My Supports

Route:

```text
/my-supports
```

Recommended naming: **My Supports**

Avoid generic names such as `Dashboard` when the user-facing purpose is support history.

## 12.1 Overview

```text
My Supports

Total Supported
$128

Communities Supported
14
```

---

## 12.2 History

```text
Recent Supports

Community A
$5
Sep 10
✓ Completed

Community B
$10
Sep 08
✓ Completed

Community C
$3
Sep 05
✓ Completed
```

---

## 12.3 Support Detail

Route:

```text
/my-supports/:id
```

Example:

```text
Support Detail

Community
Community A

Amount
$5

Status
Completed

Date
Sep 10, 2026

Transaction
0x1234...abcd

[View on Explorer]
```

Technical transaction information is secondary.

---

# 13. Profile

Route:

```text
/profile
```

The profile should remain lightweight for the MVP.

Example:

```text
Profile

User
[Name]

Connected Account
0x1234...abcd

--------------------

My Supports
Saved Communities
Settings
```

Potential later additions:

- Notification preferences
- Profile customization
- Account preferences

These are not required for the initial MVP.

---

# 14. Authentication / Account State

The frontend should support at least these states:

```text
Disconnected
Connecting
Connected
Error
```

Disconnected:

```text
[Connect]
```

Connected:

```text
0x1234...abcd
```

The implementation must never request or expose the user's private key.

The exact wallet/account abstraction can be chosen during implementation based on the selected Monad payment architecture.

---

# 15. Global UI States

Every major data-driven page should support:

```text
Loading
Success
Empty
Error
```

Example:

```text
Loading
→ Skeleton community cards

Success
→ Community cards

Empty
→ No communities found

Error
→ Failed to load communities
```

Do not design only the happy path.

---

# 16. Core Frontend Components

Suggested reusable structure:

```text
components/
│
├── layout/
│   ├── Navbar
│   ├── Footer
│   └── AppShell
│
├── community/
│   ├── CommunityCard
│   ├── CommunityHeader
│   ├── CommunityStats
│   └── CommunityCategory
│
├── support/
│   ├── AmountSelector
│   ├── PaymentSelector
│   ├── SupportSummary
│   ├── SupportStatus
│   └── SupportSuccess
│
├── basket/
│   ├── BasketItem
│   ├── BasketSummary
│   └── BasketBadge
│
├── profile/
│   ├── ProfileHeader
│   └── SupportHistory
│
└── ui/
    ├── Button
    ├── Input
    ├── Modal
    ├── Toast
    ├── Skeleton
    └── EmptyState
```

This is a suggested structure, not a strict implementation requirement.

---

# 17. Frontend Data Requirements

The frontend will eventually consume data resembling the following.

## Community

```text
id
name
description
category
logo_url
supporter_count
total_supported
status
```

## Support

```text
id
community_id
amount
token
status
tx_hash
created_at
```

## Basket Item

```text
community_id
community_name
community_logo
amount
```

Basket data can initially be maintained client-side.

---

# 18. Frontend Boundary

The frontend should own:

- UI
- routing
- user interactions
- local UI state
- basket state
- form validation
- wallet/account interaction
- displaying transaction status

The frontend should NOT own:

- database implementation
- secret/private keys
- authoritative payment verification
- hardcoded community receiving addresses
- business rules that must be trusted
- server-side secrets

Those concerns will be designed later as part of the backend/system architecture.

---

# 19. Frontend → Backend Boundary

The frontend will eventually communicate with a backend through APIs.

Conceptually:

```text
Frontend
   ↓
API
   ↓
Backend
   ↓
Database
```

For payment:

```text
Frontend
   ↓
Payment preparation
   ↓
Wallet / Account
   ↓
Blockchain transaction
   ↓
Transaction result
```

Then the transaction can later be verified by the backend.

At this stage, this is only a boundary definition, not the backend architecture.

---

# 20. Important Frontend Rules

## Rule 1 — No Hardcoded Community Wallets

Do not place receiving addresses directly inside the frontend code.

The frontend should receive the correct destination from the appropriate application/backend flow.

---

## Rule 2 — Never Store Private Keys

Private keys must never be stored in frontend source code, environment variables exposed to the browser, local storage, or other unsafe client-side storage.

---

## Rule 3 — Do Not Trust a Transaction Hash Alone

A wallet returning a transaction hash does not automatically mean the support flow is fully confirmed.

The final application status must eventually be based on verified transaction state.

---

## Rule 4 — Keep Blockchain Terminology Secondary

Prefer:

```text
Support
Payment
Processing
Completed
```

over:

```text
Execute Contract
Gas Fee
Smart Contract Call
RPC Request
```

Technical information can remain available as secondary detail when useful.

---

## Rule 5 — Mobile First

SUTU is a consumer product.

The support flow should be especially comfortable on mobile devices.

Important actions should remain easy to reach:

```text
Support
Add to Basket
Support All
Confirm
```

---

# 21. Responsive Design

Design for at least:

```text
Mobile
Tablet
Desktop
```

Priority:

1. Mobile
2. Desktop
3. Tablet refinement

Avoid designing a desktop-only experience and shrinking it later.

---

# 22. UX Direction

The visual direction should communicate:

- simple
- modern
- trustworthy
- consumer-friendly
- approachable
- community-oriented

Avoid making the application feel like:

- a trading terminal
- a crypto wallet dashboard
- a blockchain explorer
- a technical DeFi interface

The blockchain can be powerful underneath while the interface stays familiar.

---

# 23. Main User Journey

The main hackathon demo should be:

```text
Landing
   ↓
Discover
   ↓
Search for community
   ↓
Open Community
   ↓
Add to Basket
   ↓
Discover another Community
   ↓
Add to Basket
   ↓
Open Basket
   ↓
Support All
   ↓
Payment
   ↓
Blockchain settlement
   ↓
Success
   ↓
My Supports
```

A secondary simple flow should also work:

```text
Discover
   ↓
Community
   ↓
Support
   ↓
Payment
   ↓
Success
```

---

# 24. MVP Scope

## MUST HAVE

- Landing page
- Discover page
- Search community
- Category filter
- Community cards
- Community detail
- Single-community support
- Wallet/account connection
- Payment/review flow
- Transaction confirmation state
- Support history
- Support Basket
- Multi-community support
- Responsive UI
- Loading states
- Empty states
- Error states

---

## SHOULD HAVE

- Featured communities
- Popular communities
- Recently added communities
- Saved communities
- Community statistics
- Explorer transaction link
- Toast/notification system

---

## LATER

Do not allow these features to expand the MVP scope:

- GoPay
- DANA
- PayPal
- Card payments
- Recurring support
- Membership
- Community campaigns
- Advanced recommendations
- Community analytics
- Social features
- Complex profiles

These can be designed around later without blocking the core product.

---

# 25. Development Order

Frontend development should happen in vertical slices.

## Phase 1 — Foundation

- App shell
- Routing
- Navbar
- Responsive layout
- Basic design system
- Reusable UI components

Goal:

```text
The application shell is usable.
```

---

## Phase 2 — Discovery

- Discover page
- Search
- Categories
- Community cards
- Community detail

Goal:

```text
A user can find and inspect a community.
```

---

## Phase 3 — Single Support

- Amount selector
- Support page
- Payment UI
- Review
- Success state

Goal:

```text
A user can complete the intended support experience.
```

---

## Phase 4 — Basket

- Add to basket
- Remove item
- Edit amount
- Calculate total
- Basket badge
- Empty state
- Support All flow

Goal:

```text
A user can prepare support for multiple communities.
```

---

## Phase 5 — Account / Blockchain Integration

- Account connection
- Transaction preparation
- Transaction signing
- Transaction status
- Error handling

Goal:

```text
The frontend can execute and display the intended payment flow.
```

---

## Phase 6 — History

- My Supports
- Support detail
- Transaction information
- Synchronization with application data

Goal:

```text
A user can see what they previously supported.
```

---

## Phase 7 — Polish

- Loading states
- Empty states
- Error states
- Responsive fixes
- Accessibility
- Animation
- Performance
- Visual consistency
- Demo polish

Goal:

```text
The MVP feels like a finished consumer product.
```

---

# 26. Definition of Done

Frontend MVP is considered complete when all of the following are true:

```text
[ ] User can enter from Landing to Discover

[ ] User can search for a community

[ ] User can filter communities by category

[ ] User can open community detail

[ ] User can choose a support amount

[ ] User can review support

[ ] User can connect the required account/payment method

[ ] User can execute the support flow

[ ] User gets a clear success/failure result

[ ] User can add multiple communities to Basket

[ ] User can edit basket amounts

[ ] User can remove basket items

[ ] User can perform multi-community support

[ ] User can see support history

[ ] User can open support details

[ ] Mobile layout works correctly

[ ] Desktop layout works correctly

[ ] Loading states exist

[ ] Empty states exist

[ ] Error states exist

[ ] No private key is handled insecurely

[ ] No community wallet is hardcoded in the UI
```

---

# 27. Product Focus

SUTU should NOT attempt to become all of these at once:

- crypto wallet
- exchange
- trading platform
- banking application
- complicated crowdfunding platform

SUTU's core purpose remains:

> **Making community support simple.**

Core experience:

```text
Find
 ↓
Choose
 ↓
Support
 ↓
Done
```

Core differentiator:

```text
Many communities
      ↓
One basket
      ↓
One payment interaction
      ↓
Multiple settlements
```

---

# 28. Backend Is Intentionally Deferred

This document is primarily a **product + frontend plan**.

Backend implementation is intentionally not defined here.

The backend should be designed after the frontend user flows, screens, data requirements, and payment experience are sufficiently stable.

Future backend work will cover topics such as:

```text
API
Database
Authentication
Community management
Payment preparation
Transaction verification
Blockchain services
Payout destinations
```

Do not allow backend implementation details to prematurely complicate the frontend design.

---

# 29. Future System Design Direction

Once the frontend experience is stable, the next planning document/workstream should translate the product into:

```text
Frontend
    ↓
API
    ↓
Backend Services
    ↓
Database

Frontend / Payment Layer
    ↓
Blockchain
    ↓
Community Settlement
```

The exact architecture should be decided later based on the final payment and wallet approach selected for the hackathon.

---

# 30. Team + AI Development Workflow

SUTU can use AI heavily for implementation, while the team remains responsible for product and technical decisions.

Recommended workflow:

```text
Team
 ↓
Problem definition
 ↓
Product decisions
 ↓
UX
 ↓
System decisions
 ↓

AI
 ↓
Components
 ↓
Boilerplate
 ↓
API integration drafts
 ↓
Smart contract drafts
 ↓
Tests
 ↓
Refactoring
 ↓
Debugging

Team
 ↓
Review
 ↓
Understand
 ↓
Test
 ↓
Integrate
 ↓
Ship
```

Team rule:

> **No code goes to the main branch unless a team member understands what it does and why it exists.**

AI can produce a large portion of implementation code.

The team must still understand the complete system.

---

# 31. Final Product Model

At the current planning stage, SUTU can be understood as:

```text
                 SUTU
                  │
       ┌──────────┴──────────┐
       │                     │
    Landing              Application
       │                     │
  Explain SUTU           Discover
  How it works           Community
  Value proposition      Support
                         Basket
                         My Supports
                         Profile
                              │
                              ↓
                          Payment
                              │
                              ↓
                         Settlement
                              │
                              ↓
                       Multiple Communities
```

The frontend's primary job is to turn this into a simple consumer experience.

---

# 32. One-Line Product Definition

> **SUTU is a unified support platform that lets people discover and support online communities from one place, including supporting multiple communities through one payment interaction.**
