# SplitSnap

Receipt scanning and bill splitting app. Scan receipts, split bills instantly.

## Features

- 📷 **Scan Receipts** - Point camera at any receipt (manual entry for MVP)
- ÷ **Split Instantly** - Select items, split by item or custom amounts  
- 👥 **Groups** - Create groups for friends, roommates, trips
- 💸 **Track Balances** - Know who owes what, settle up easily

## Tech Stack

- Expo SDK 54
- React Native 0.79
- expo-router (file-based routing)
- expo-sqlite (local database)
- React Native Reanimated

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start
```

## Project Structure

```
app/
├── _layout.tsx          # Root layout with Stack navigator
├── (tabs)/
│   ├── _layout.tsx      # Tab navigator
│   ├── index.tsx        # Home screen
│   ├── groups.tsx       # Groups list
│   └── history.tsx      # Receipt history
├── receipt/[id].tsx    # Receipt detail
├── group/[id].tsx       # Group detail
├── create.tsx           # Create new receipt
├── onboarding.tsx       # Onboarding flow
├── paywall.tsx         # Premium upgrade
└── settings/
    └── index.tsx       # Settings screen
```

## Premium Features

- Unlimited receipt scans
- Unlimited groups
- Export history
- Priority support

## API Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Split Payment API (for bill splitting features)
SPLIT_API_KEY=your_split_api_key
SPLIT_API_URL=https://api.splitsnap.com/v1

# Payment Processing (optional)
PAYMENT_API_KEY=your_payment_api_key
```

### RevenueCat Configuration

1. Create an account at [RevenueCat.com](https://revenuecat.com)
2. Create products in App Store Connect / Google Play Console:
   - Monthly: $2.99/month - `splitsnap_monthly`
   - Annual: $14.99/year - `splitsnap_annual`
3. Configure products in RevenueCat dashboard
4. Add your API key to the purchases service

## License

MIT
