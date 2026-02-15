import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/theme';
import { loadReceipts, Receipt } from '../../src/services/storage';

export default function HomeScreen() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [totalSaved, setTotalSaved] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await loadReceipts();
    setReceipts(data.slice(0, 3)); // Recent 3
    const total = data.reduce((sum, r) => sum + (r.total || 0), 0);
    setTotalSaved(total);
  };

  const handleNewReceipt = () => {
    router.push('/create');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>SplitSnap</Text>
        <Text style={styles.subtitle}>Split bills instantly</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${totalSaved.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Split</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{receipts.length}</Text>
            <Text style={styles.statLabel}>Receipts</Text>
          </View>
        </View>

        {/* Quick Action */}
        <TouchableOpacity style={styles.scanButton} onPress={handleNewReceipt} activeOpacity={0.8}>
          <View style={styles.scanButtonContent}>
            <Text style={styles.scanIcon}>📷</Text>
            <View style={styles.scanTextContainer}>
              <Text style={styles.scanTitle}>Scan Receipt</Text>
              <Text style={styles.scanSubtitle}>AI extracts items automatically</Text>
            </View>
            <Text style={styles.scanArrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent</Text>
            <TouchableOpacity onPress={() => router.push('/history')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {receipts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🧾</Text>
              <Text style={styles.emptyTitle}>No receipts yet</Text>
              <Text style={styles.emptySubtitle}>Scan your first receipt to start splitting</Text>
            </View>
          ) : (
            receipts.map((receipt) => (
              <TouchableOpacity 
                key={receipt.id} 
                style={styles.receiptCard}
                onPress={() => router.push(`/receipt/${receipt.id}`)}
              >
                <View style={styles.receiptIcon}>
                  <Text style={styles.receiptEmoji}>🧾</Text>
                </View>
                <View style={styles.receiptInfo}>
                  <Text style={styles.receiptTitle} numberOfLines={1}>
                    {receipt.merchant || 'Receipt'}
                  </Text>
                  <Text style={styles.receiptDate}>
                    {new Date(receipt.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.receiptAmount}>
                  <Text style={styles.amountValue}>${(receipt.total || 0).toFixed(2)}</Text>
                  <Text style={styles.amountSplit}>
                    {receipt.items?.length || 0} items
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Pro Tip</Text>
          <Text style={styles.tipsText}>
            Point your camera at any receipt. SplitSnap automatically detects items and amounts.
          </Text>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.bodyLarge,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.bold,
    color: colors.brand,
  },
  statLabel: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  scanButton: {
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  scanButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  scanIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  scanTextContainer: {
    flex: 1,
  },
  scanTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: '#FFFFFF',
  },
  scanSubtitle: {
    fontSize: fontSize.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  scanArrow: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  seeAll: {
    fontSize: fontSize.body,
    color: colors.brand,
    fontWeight: fontWeight.medium,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  receiptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  receiptIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  receiptEmoji: {
    fontSize: 24,
  },
  receiptInfo: {
    flex: 1,
  },
  receiptTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  receiptDate: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  receiptAmount: {
    alignItems: 'flex-end',
  },
  amountValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  amountSplit: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tipsCard: {
    backgroundColor: colors.brandLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  tipsTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.brandDark,
    marginBottom: spacing.xs,
  },
  tipsText: {
    fontSize: fontSize.body,
    color: colors.brandDark,
    lineHeight: 22,
  },
});
