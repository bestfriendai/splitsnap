import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/theme';
import { loadReceipts, Receipt } from '../../src/services/storage';

export default function HistoryScreen() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [filter, setFilter] = useState<'all' | 'thisWeek' | 'thisMonth'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await loadReceipts();
    setReceipts(data);
  };

  const filteredReceipts = receipts.filter((receipt) => {
    const now = new Date();
    const receiptDate = new Date(receipt.createdAt);
    
    if (filter === 'thisWeek') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return receiptDate >= weekAgo;
    }
    if (filter === 'thisMonth') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return receiptDate >= monthAgo;
    }
    return true;
  });

  const totalAmount = filteredReceipts.reduce((sum, r) => sum + (r.total || 0), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {(['all', 'thisWeek', 'thisMonth'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'All' : f === 'thisWeek' ? 'This Week' : 'This Month'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Split</Text>
          <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
          <Text style={styles.summaryCount}>{filteredReceipts.length} receipts</Text>
        </View>

        {/* Receipt List */}
        {filteredReceipts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No receipts found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'all' 
                ? 'Scan a receipt to get started' 
                : `No receipts in this time period`}
            </Text>
          </View>
        ) : (
          filteredReceipts.map((receipt) => (
            <TouchableOpacity 
              key={receipt.id} 
              style={styles.receiptCard}
              onPress={() => router.push(`/receipt/${receipt.id}`)}
            >
              <View style={styles.receiptMain}>
                <View style={styles.receiptIcon}>
                  <Text style={styles.receiptEmoji}>🧾</Text>
                </View>
                <View style={styles.receiptInfo}>
                  <Text style={styles.receiptTitle} numberOfLines={1}>
                    {receipt.merchant || 'Receipt'}
                  </Text>
                  <Text style={styles.receiptDate}>
                    {new Date(receipt.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
              <View style={styles.receiptRight}>
                <Text style={styles.amountValue}>${(receipt.total || 0).toFixed(2)}</Text>
                <Text style={styles.itemCount}>{receipt.items?.length || 0} items</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
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
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  filterRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  filterText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  summaryCard: {
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  summaryLabel: {
    fontSize: fontSize.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: 40,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  summaryCount: {
    fontSize: fontSize.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
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
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  receiptMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  receiptIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  receiptEmoji: {
    fontSize: 20,
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
  receiptRight: {
    alignItems: 'flex-end',
  },
  amountValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  itemCount: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
