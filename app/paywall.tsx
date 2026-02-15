import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../src/theme';
import { getPremiumStatus, setPremiumStatus } from '../src/services/storage';

// RevenueCat stub - replace with actual SDK integration
const MONTHLY_PRICE = '$4.99/mo';
const ANNUAL_PRICE = '$39.99/yr';
const ANNUAL_SAVINGS = 'Save 33%';

const features = [
  { icon: '📷', title: 'Unlimited Scans', desc: 'No limits on receipt scanning' },
  { icon: '👥', title: 'Unlimited Groups', desc: 'Create unlimited split groups' },
  { icon: '📊', title: 'Export History', desc: 'Download your split history' },
  { icon: '🎯', title: 'Priority Support', desc: 'Get help faster' },
];

export default function PaywallScreen() {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    const status = await getPremiumStatus();
    setIsPremium(status);
  };

  const handleSubscribe = async () => {
    setLoading(true);
    
    // RevenueCat integration stub
    // In production: await Purchases.purchasePackage(package)
    // For demo: simulate purchase
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await setPremiumStatus(true);
    setIsPremium(true);
    setLoading(false);
    
    router.back();
  };

  const handleRestore = async () => {
    // RevenueCat: await Purchases.restorePurchases()
    // For demo: show alert
    alert('No previous purchases found');
  };

  const handleClose = () => {
    router.back();
  };

  if (isPremium) {
    return (
      <View style={styles.container}>
        <View style={styles.premiumActive}>
          <Text style={styles.premiumIcon}>✓</Text>
          <Text style={styles.premiumTitle}>You're Premium!</Text>
          <Text style={styles.premiumText}>
            Thank you for supporting SplitSnap
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeIcon}>
          <Text style={styles.closeIconText}>×</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upgrade</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>💎</Text>
          <Text style={styles.heroTitle}>SplitSnap Pro</Text>
          <Text style={styles.heroSubtitle}>
            Unlock unlimited splits with friends
          </Text>
        </View>

        {/* Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleOption, !isAnnual && styles.toggleActive]}
            onPress={() => setIsAnnual(false)}
          >
            <Text style={[styles.toggleText, !isAnnual && styles.toggleTextActive]}>
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleOption, isAnnual && styles.toggleActive]}
            onPress={() => setIsAnnual(true)}
          >
            <Text style={[styles.toggleText, isAnnual && styles.toggleTextActive]}>
              Annual
            </Text>
            {isAnnual && (
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>{ANNUAL_SAVINGS}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Pricing */}
        <View style={styles.pricingCard}>
          <Text style={styles.priceAmount}>
            {isAnnual ? ANNUAL_PRICE : MONTHLY_PRICE}
          </Text>
          <Text style={styles.priceBilled}>
            {isAnnual ? 'Billed annually' : 'Billed monthly'}
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresCard}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity 
          style={[styles.subscribeButton, loading && styles.subscribeButtonDisabled]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          <Text style={styles.subscribeButtonText}>
            {loading ? 'Processing...' : 'Subscribe Now'}
          </Text>
        </TouchableOpacity>

        {/* Restore */}
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>

        {/* Terms */}
        <View style={styles.terms}>
          <TouchableOpacity onPress={() => Linking.openURL('https://example.com/terms')}>
            <Text style={styles.termsText}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.termsDivider}>•</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://example.com/privacy')}>
            <Text style={styles.termsText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  closeIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIconText: {
    fontSize: 28,
    color: colors.textSecondary,
  },
  headerTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  heroIcon: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.sm,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  toggleText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.text,
  },
  savingsBadge: {
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginLeft: spacing.xs,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  pricingCard: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  priceAmount: {
    fontSize: 36,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  priceBilled: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  featuresCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  featureDesc: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  subscribeButton: {
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: '#FFFFFF',
  },
  restoreButton: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  restoreText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  terms: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  termsText: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  termsDivider: {
    marginHorizontal: spacing.sm,
    color: colors.textSecondary,
  },
  // Premium Active State
  premiumActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  premiumIcon: {
    fontSize: 64,
    color: colors.brand,
    marginBottom: spacing.lg,
  },
  premiumTitle: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  premiumText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  closeButton: {
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  closeButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: '#FFFFFF',
  },
});
