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

## License

MIT
