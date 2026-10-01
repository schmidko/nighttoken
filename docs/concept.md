# Midnight Token Studio

## Goal

Build a simple Midnight DApp that lets non-technical users:

1. Create a custom Midnight token.
2. Send that token to one or many addresses.
3. Deposit tokens into time-limited claim vaults.
4. Let users connect a wallet and claim tokens themselves.
5. Optionally restrict claims using simple eligibility rules.

Primary UX principle:

> Create → Distribute → Reward

No coding or Compact knowledge should be required from the user.

---

# 1. Core Stack

Frontend:
- React / Next.js
- TypeScript

Blockchain:
- Midnight
- Midnight.js
- Compact contracts
- Midnight DApp Connector
- Existing compatible Midnight wallet

Important:
- Never manage user private keys.
- Signing and transaction approval happen inside the connected wallet.

---

# 2. Main Navigation

Keep UI minimal:

```text
Dashboard

[ Create Token ]

My Tokens
- FLUFF
  - Send
  - Bulk Send
  - Create Campaign

Campaigns
- FLUFF Launch
- Holder Reward
- Community Drop
```

---

# 3. Token Creation

User connects wallet and selects:

```text
Create Token
```

Fields:

```text
Name
Symbol
Total Supply
Decimals
```

Optional:

```text
Description
Logo
```

Example:

```text
Name: Fluff Token
Symbol: FLUFF
Supply: 10,000,000
Decimals: 6
```

Button:

```text
[ Create Token ]
```

After minting:

```text
FLUFF created successfully

Supply:
10,000,000 FLUFF

[ Send ]
[ Bulk Send ]
[ Create Campaign ]
```

Implementation must use the official public Midnight custom-token minting mechanism once available.

Do not implement proprietary token contracts if native/ledger tokens are sufficient.

---

# 4. Token Dashboard

For each token show:

```text
FLUFF

Total Supply
10,000,000

Wallet Balance
8,500,000

Locked in Campaigns
1,500,000

[ Send ]
[ Bulk Send ]
[ Create Campaign ]
```

---

# 5. Single Send

Simple transfer:

```text
Recipient:
[mn...]

Amount:
[5000]

[ Send ]
```

Wallet confirms transaction.

---

# 6. Bulk Send

Support CSV upload:

```csv
address,amount
mn1abc...,1000
mn1def...,2500
mn1ghi...,500
```

Before sending show:

```text
Recipients: 237
Total: 425,500 FLUFF
Available: 8,500,000 FLUFF

✓ All addresses valid

[ Start Distribution ]
```

The application should:

- validate addresses
- validate amounts
- calculate total
- automatically batch transactions
- retry failed batches
- show progress
- prevent accidental duplicate sends where possible

Example:

```text
189 / 237 completed
```

Export a result CSV after completion.

---

# 7. Claim Campaigns / Vaults

User selects:

```text
Create Campaign
```

Internally this uses a token vault contract.

Public UX should use the term:

```text
Claim Campaign
```

rather than only "Vault".

---

# 8. Basic Campaign Configuration

Fields:

```text
Token:
FLUFF

Deposit:
1,000,000 FLUFF

Reward per claim:
1,000 FLUFF

Maximum claims:
1,000
```

The creator deposits tokens into the claim contract.

---

# 9. Campaign Time Window

Required fields:

```text
Claim starts:
2026-10-01 18:00

Claim ends:
2026-10-31 23:59
```

Campaign states:

```text
UPCOMING
ACTIVE
EXPIRED
```

Rules:

```text
Before start:
Claims disabled

During active period:
Valid users can claim

After expiration:
Claims disabled
Creator can withdraw remaining tokens
```

---

# 10. Claim Page

Each campaign receives a public URL:

```text
/app/claim/{campaignId}
```

Example UI:

```text
FLUFF COMMUNITY DROP

Reward
1,000 FLUFF

Claims
623 / 1,000

Ends in
3 days 14 hours

[ Connect Wallet ]
```

After connection:

```text
Eligibility:
✓ Eligible

[ Claim 1,000 FLUFF ]
```

User confirms the transaction in their wallet.

By default the claimer pays their own Midnight transaction/DUST cost.

---

# 11. Prevent Duplicate Claims

Each campaign must prevent the same eligible wallet/claim identity from claiming more than once.

Conceptually:

```text
claimId -> claimed = true
```

Do not rely only on frontend checks.

The Compact contract must enforce this.

---

# 12. Eligibility Modes

V1 should support three modes:

## A. Open

```text
Anyone can claim once per wallet.
```

Warning in UI:

```text
Open campaigns are not Sybil-resistant.
Users can create additional wallets.
```

---

## B. Whitelist

Creator uploads:

```csv
address
mn1abc...
mn1def...
mn1ghi...
```

Only whitelisted wallets can claim.

Future extension:

```csv
address,amount
mn1abc...,1000
mn1def...,5000
```

---

## C. NIGHT Holder

Creator defines a minimum NIGHT requirement.

Example:

```text
Minimum NIGHT balance:
5,000 NIGHT
```

Eligibility:

```text
current NIGHT balance >= 5,000
```

Important:
NIGHT is unshielded/public, so its balance can be verified against the public Midnight ledger.

UI:

```text
Requirements

✓ Hold at least 5,000 NIGHT
```

---

# 13. NIGHT Holding Duration

Add an optional advanced condition:

```text
Minimum NIGHT balance:
5,000 NIGHT

Held for:
30 days
```

Meaning:

> The wallet must have continuously held at least 5,000 NIGHT throughout the configured period.

Example valid history:

```text
Day 0   8,000 NIGHT
Day 10  7,000 NIGHT
Day 20  5,500 NIGHT
Day 30  5,500 NIGHT

Eligible = true
```

Example invalid history:

```text
Day 0   8,000 NIGHT
Day 20  2,000 NIGHT
Day 29  7,000 NIGHT

Eligible = false
```

Implementation requirement:

Do not simply check when NIGHT was first received.

Reconstruct the NIGHT balance over the required period and verify that it never fell below the configured threshold.

Initial options:

```text
At claim time
7 days
30 days
90 days
```

---

# 14. Combined Eligibility Rules

Campaign creator should be able to configure:

```text
Eligibility

○ Everyone

○ Whitelist

● NIGHT Holder

Minimum NIGHT:
[ 5,000 ]

Minimum holding duration:
[ 30 days ]
```

For V1, conditions do not need complex AND/OR logic beyond:

```text
minimum NIGHT balance
+
optional holding duration
```

---

# 15. Sybil Model

Important product behavior:

A simple rule:

```text
one claim per wallet
```

does NOT prevent users from creating multiple wallets.

Minimum NIGHT creates an economic barrier.

Example:

```text
5,000 NIGHT required
```

But NIGHT can otherwise be moved sequentially:

```text
Wallet A -> claim
move NIGHT
Wallet B -> claim
```

Holding duration reduces this attack significantly.

Therefore preferred eligibility for valuable campaigns:

```text
minimum NIGHT balance
+
minimum holding duration
```

Still do not describe this as absolute proof of unique human identity.

---

# 16. Campaign Dashboard

Creator view:

```text
FLUFF Community Drop

Status:
ACTIVE

Deposited:
1,000,000 FLUFF

Claimed:
623,000 FLUFF

Remaining:
377,000 FLUFF

Claims:
623 / 1,000

Period:
01 Oct – 31 Oct

Eligibility:
≥ 5,000 NIGHT
Held ≥ 30 days

[ Copy Claim Link ]
[ Add Tokens ]
[ End Campaign ]
```

After expiration:

```text
Remaining:
377,000 FLUFF

[ Withdraw Remaining Tokens ]
```

---

# 17. Contract Requirements

Claim vault contract must support at minimum:

```text
creator
tokenId
totalDeposited
rewardPerClaim
maxClaims
claimCount
startTime
endTime
campaignStatus
eligibilityMode
minimumNightBalance
minimumHoldingDuration
claimedIdentities
```

Required actions:

```text
createCampaign()
depositTokens()
claim()
addTokens()
endCampaign()
withdrawRemaining()
```

Contract must enforce:

- start/end time
- available vault balance
- maximum claims
- duplicate-claim prevention
- creator-only admin operations

Eligibility verification may require integration with public NIGHT ledger/indexer data depending on what Compact can directly access.

Do not assume historical NIGHT balance can be read directly inside Compact until verified against current Midnight APIs.

---

# 18. Architecture

```text
React / Next.js
      │
      ▼
Midnight DApp Connector
      │
      ▼
User Wallet
      │
      ├──────────────┐
      ▼              ▼
Midnight.js      Public NIGHT
      │          history/indexer
      │              │
      └──────┬───────┘
             ▼
       Eligibility Layer
             │
             ▼
      Compact Claim Contract
             │
             ▼
        Midnight Ledger
```

If historical NIGHT-balance verification cannot be done trustlessly inside the contract, implement it as a separate verifier/oracle layer with signed eligibility attestations.

Keep this abstraction replaceable so it can later become fully trustless if Midnight exposes suitable ledger proofs.

---

# 19. MVP Scope

## V1

Implement only:

### Token
- Connect wallet
- Create token
- Show token
- Single send

### Bulk Distribution
- CSV upload
- Validation
- Batch transfers
- Progress
- Result export

### Claim Campaigns
- Deposit token
- Fixed reward per claim
- Maximum claims
- Start time
- End time
- One claim per eligible wallet
- Public claim page
- Remaining token withdrawal

### Eligibility
- Everyone
- Whitelist
- Minimum NIGHT balance
- Optional NIGHT holding duration

Do NOT build yet:

- staking conditions
- NFT conditions
- arbitrary token-holder conditions
- recurring rewards
- complex boolean rule builders
- sponsored fees
- own wallet implementation
- DAO/multisig features

---

# 20. Future Extensions

Later add:

```text
Own token X
Own NFT X
Delegated NIGHT to pool X
Minimum delegated NIGHT
Delegation duration
Recurring rewards
Claim codes
QR codes
Different allocation per wallet
Private allocation
Sponsored transaction fees
Campaign branding
Vesting
```

Potential future staking rule:

```text
Delegated to:
Pool X

Minimum:
5,000 NIGHT

Duration:
5 epochs
```

---

# 21. UX Principle

The user should never need to understand:

```text
Compact
UTXO
ZK proof
transaction balancing
DUST internals
contract state
```

Main flow:

```text
Create Token
      ↓
Send / Bulk Send
      ↓
Create Campaign
      ↓
Choose Reward
      ↓
Choose Duration
      ↓
Choose Eligibility
      ↓
Publish Claim Link
```

---

# 22. Product Positioning

Do not market primarily as:

> Midnight Token Generator

Position as:

> **Create. Distribute. Reward.**

Primary message:

> Create a Midnight token in minutes, distribute it to many wallets, or launch a self-service reward campaign without writing code.

Long-term differentiation is not token minting itself.

The main product value is:

```text
Token Creation
      ↓
Distribution
      ↓
Claim Campaigns
      ↓
Eligibility Rules
      ↓
Recurring Rewards
```

The claim/reward engine should therefore be designed as the core extensible part of the architecture.
