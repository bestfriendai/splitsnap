# SplitSnap - Setup Guide

## Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo`
- **EAS CLI** (for building): `npm install -g eas-cli`
- **Apple Developer Account** (for iOS)
- **Google Play Console** (for Android, optional)

## Installation

```bash
# Navigate to project directory
cd splitsnap

# Install dependencies
npm install

# Start development server
npx expo start
```

## Running the App

### Development (Expo Go)

```bash
npx expo start
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
```

### Production Build

```bash
# Generate native projects
npx expo prebuild

# Build for iOS
eas build -p ios --profile development

# Build for Android
eas build -p android --profile development
```

## RevenueCat Setup

### 1. Create RevenueCat Account
- Go to [revenuecat.com](https://revenuecat.com)
- Create a new project

### 2. Configure Products
Create these products in RevenueCat:

| Product | Platform | Product ID | Price |
|---------|----------|------------|-------|
| Monthly | iOS | `splitsnap_monthly` | $4.99 |
| Annual | iOS | `splitsnap_annual` | $39.99 |
| Monthly | Android | `splitsnap_monthly` | $4.99 |
| Annual | Android | `splitsnap_annual` | $39.99 |

### 3. Add API Keys
Add to `app.json` under `extra`:
```json
{
  "eas": {
    "projectId": "your-project-id"
  }
}
```

### 4. Configure Entitlements

**iOS (App Store Connect):**
1. Go to your app in App Store Connect
2. Enable "In-App Purchases"
3. Upload the sandbox testers certificate

**Android (Google Play):**
1. Upload APK/AAB to Internal Testing
2. Add RevenueCat SDK license key to Play Console

## App Store Connect Setup

### 1. Create App
- Go to [App Store Connect](https://appstoreconnect.apple.com)
- Create new iOS App
- Bundle ID: `com.splitsnap.app`

### 2. App Information
- **App Name**: SplitSnap (30 chars max)
- **Subtitle**: Split bills instantly (30 chars max)
- **Category**: Finance

### 3. Screenshots Required
Generate screenshots using:
```bash
npx expo export --platform ios
# Then use iPhone simulator to capture
```

Required sizes:
- 6.7" (1290 x 2796)
- 6.5" (1242 x 2688)
- 5.5" (1242 x 2208)

### 4. Submit for Review
- Complete all required fields
- Add privacy policy URL
- Submit for review

## EAS Build Commands

### Development Build
```bash
# iOS Development
eas build -p ios --profile development --local

# Android Development  
eas build -p android --profile development --local
```

### Production Build
```bash
# iOS Production
eas build -p ios --profile production

# Android Production
eas build -p android --profile production
```

## Submission Checklist

- [ ] RevenueCat products created and configured
- [ ] App Store Connect app created with correct bundle ID
- [ ] Privacy policy URL added
- [ ] Screenshots captured for all required sizes
- [ ] App icon (1024x1024) uploaded
- [ ] All test accounts verified
- [ ] Build passes App Store validation

## Troubleshooting

### Common Issues

**Build fails with "Missing credentials"**
- Ensure EAS CLI is logged in: `eas login`

**RevenueCat purchases not working**
- Check that products are "Active" in RevenueCat
- Verify bundle ID matches in both RevenueCat and App Store Connect

**App crashes on launch**
- Check `expo-sqlite` permissions
- Verify all dependencies are installed

### Debug Mode
```bash
# Enable verbose logging
npx expo start --clear
```

## Support

- Email: support@splitsnap.app
- Documentation: docs.splitsnap.app
