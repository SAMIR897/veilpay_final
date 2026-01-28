# VeilPay - Private Payments on Solana

VeilPay is a privacy-first payment protocol on Solana that enables fully private SPL token transfers while preserving wallet-like UX, notifications, and auditability.

## Architecture

### Core Components

1. **Confidential State (Arcium Integration)**
   - Balances stored encrypted using MPC
   - Transfer amounts never revealed on-chain
   - Only cryptographic commitments published
   - Confidential logic enforces correctness

2. **Privacy-Safe Indexing (Helius)**
   - Indexes only transaction existence
   - Tracks slot, timestamp, and event type
   - Never sees amounts, sender, or receiver
   - Powers activity feeds and notifications

3. **Local Decryption (Wallet)**
   - Wallet listens to indexed events
   - Attempts to decrypt them locally
   - Shows transaction only if decryption succeeds
   - All sensitive interpretation happens client-side

## What Stays Private vs Public

**Private:**
- Wallet balance
- Transfer amount
- Sender identity
- Receiver identity

**Public:**
- Transaction existence
- Timestamp and slot
- Validity proof
- Optional user-controlled audit proof

## Project Structure

```
veilpay/
├── programs/veilpay/    # Solana program (Anchor)
│   ├── src/
│   │   ├── instructions/  # Program instructions
│   │   ├── state/         # Account structures
│   │   ├── utils/         # Crypto utilities (Arcium integration)
│   │   └── events.rs      # Events for Helius indexing
├── app/                   # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # React hooks for Solana
│   │   ├── utils/         # Crypto and Helius utilities
│   │   └── App.tsx        # Main application
└── tests/                 # Integration tests
```

## Development Setup

### Prerequisites

- Rust 1.75+
- Solana CLI 1.18+
- Anchor 0.30+
- Node.js 18+
- Yarn or npm

### Installation

1. Install Solana CLI:
```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

2. Install Anchor:
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

3. Install dependencies:
```bash
yarn install
```

### Build

```bash
# Build the Solana program
anchor build

# Build the frontend
cd app
npm run build
```

### Test

```bash
# Run program tests
anchor test

# Run frontend locally
cd app
npm run dev
```

## Arcium Integration

VeilPay uses Arcium's MPC network for confidential operations:

- **Encrypted Arithmetic**: Add/subtract encrypted values without decryption
- **Range Proofs**: Verify balance sufficiency without revealing amounts
- **Homomorphic Encryption**: Perform computations on encrypted data

### Current Status

The program includes placeholder functions for Arcium integration. For production:

1. Install Arcium SDK: `curl --proto '=https' --tlsv1.2 -sSfL https://install.arcium.com/ | bash`
2. Replace crypto.rs functions with Arcium MPC calls
3. Configure MXE (Multi-party computation eXecution Environment)

## Helius Integration

VeilPay uses Helius webhooks for privacy-safe indexing:

1. **Webhook Setup**: Monitor `PrivateTransferEvent` emissions
2. **Metadata Storage**: Store only non-sensitive data (timestamp, slot, event type)
3. **Activity Feed**: Build real-time notifications without compromising privacy

### Webhook Configuration

```typescript
// Example Helius webhook config
{
  "webhookURL": "https://your-backend.com/webhook",
  "transactionTypes": ["ANY"],
  "accountAddresses": ["YOUR_PROGRAM_ID"],
  "webhookType": "enhanced"
}
```

## Demo Flow

1. **Create Wallets**: Initialize two VeilPay confidential balance accounts
2. **Show Encrypted Balances**: Display encrypted balance in UI
3. **Send Private Payment**: Transfer tokens between accounts
4. **Verify Privacy**: Check Solana explorer - amounts and participants hidden
5. **Activity Feed**: Show "Received a private payment" notification
6. **Optional Proof**: Generate selective disclosure proof

## Security Considerations

- **Replay Protection**: Nonce-based to prevent transaction replay
- **Owner Verification**: Commitment-based ownership validation
- **Event Privacy**: Only non-sensitive metadata in events
- **Client-Side Decryption**: All sensitive operations in user's wallet

## Roadmap

- [x] Core confidential transfer logic
- [x] Event emission for indexing
- [ ] Full Arcium MPC integration
- [ ] Helius webhook backend
- [ ] Stealth address implementation
- [ ] Selective disclosure proofs
- [ ] Mobile wallet support

## License

MIT

## Hackathon Sponsors

- **Arcium**: Confidential SPL and encrypted state
- **Helius**: Privacy-safe indexing and wallet-grade UX
