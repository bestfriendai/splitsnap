import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../src/theme';
import { getPremiumStatus } from '../src/services/storage';

interface SettingRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}

function SettingRow({ icon, title, subtitle, onPress, rightElement, destructive }: SettingRowProps) {
  return (
    <TouchableOpacity 
      style={styles.settingRow} 
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View style={styles.settingIcon}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, destructive && styles.destructiveText]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || (onPress && <Text style={styles.chevron}>›</Text>)}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  // Check premium status on mount
  useState(() => {
    getPremiumStatus().then(setIsPremium);
  });

  const handleUpgrade = () => {
    router.push('/paywall');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all receipts and groups. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // Would clear SQLite database
            Alert.alert('Data cleared');
          }
        },
      ]
    );
  };

  const handleExport = () => {
    Alert.alert('Export', 'Export functionality coming soon');
  };

  const handleRateApp = () => {
    Alert.alert('Rate App', 'Thank you! Rating functionality would open App Store.');
  };

  const handleContact = () => {
    Alert.alert('Contact', 'support@splitsnap.app');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Premium Banner */}
        {!isPremium && (
          <TouchableOpacity style={styles.premiumBanner} onPress={handleUpgrade}>
            <View style={styles.premiumContent}>
              <Text style={styles.premiumIcon}>💎</Text>
              <View style={styles.premiumText}>
                <Text style={styles.premiumTitle}>Upgrade to Pro</Text>
                <Text style={styles.premiumSubtitle}>Unlock unlimited splits</Text>
              </View>
            </View>
            <Text style={styles.premiumArrow}>›</Text>
          </TouchableOpacity>
        )}

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>PREFERENCES</Text>
          <View style={styles.card}>
            <SettingRow
              icon="🔔"
              title="Notifications"
              subtitle="Get reminded to settle up"
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: colors.border, true: colors.brand }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>
        </View>

        {/* Data */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>DATA</Text>
          <View style={styles.card}>
            <SettingRow
              icon="📤"
              title="Export Data"
              subtitle="Download your receipts and history"
              onPress={handleExport}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="🗑️"
              title="Clear All Data"
              subtitle="Delete all receipts and groups"
              onPress={handleClearData}
              destructive
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ABOUT</Text>
          <View style={styles.card}>
            <SettingRow
              icon="⭐"
              title="Rate SplitSnap"
              subtitle="Help us improve"
              onPress={handleRateApp}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="✉️"
              title="Contact Support"
              subtitle="Get help with any issues"
              onPress={handleContact}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="📄"
              title="Privacy Policy"
              onPress={() => Alert.alert('Privacy Policy')}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="📋"
              title="Terms of Service"
              onPress={() => Alert.alert('Terms of Service')}
            />
          </View>
        </View>

        {/* Version */}
        <View style={styles.version}>
          <Text style={styles.versionText}>SplitSnap v1.0.0 (1)</Text>
          <Text style={styles.copyrightText}>© 2026 SplitSnap</Text>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 24,
    color: colors.brand,
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
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    ...shadows.sm,
  },
  premiumContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: '#FFFFFF',
  },
  premiumSubtitle: {
    fontSize: fontSize.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  premiumArrow: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: radius.lg,
    ...shadows.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    fontSize: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  destructiveText: {
    color: colors.destructive,
  },
  chevron: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 32 + spacing.md,
  },
  version: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  versionText: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  copyrightText: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
