import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/theme';
import { getReceipt, deleteReceipt, Receipt } from '../../src/services/storage';

export default function ReceiptDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (id) loadReceipt();
  }, [id]);

  const loadReceipt = async () => {
    const data = await getReceipt(id!);
    setReceipt(data);
    // Select all items by default
    if (data?.items) {
      setSelectedItems(new Set(data.items.map(i => i.id)));
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await deleteReceipt(id!);
            router.back();
          }
        },
      ]
    );
  };

  const handleShare = async () => {
    if (!receipt) return;
    
    const itemsList = receipt.items.map(item => 
      `• ${item.name}: $${item.price.toFixed(2)}`
    ).join('\n');
    
    const text = `🧾 ${receipt.merchant || 'Receipt'}\n\n${itemsList}\n\nTotal: $${receipt.total.toFixed(2)}`;
    
    await Share.share({ message: text });
  };

  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const calculateSplit = () => {
    if (!receipt) return { perPerson: 0, selectedTotal: 0 };
    
    const selectedTotal = receipt.items
      .filter(item => selectedItems.has(item.id))
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const numPeople = 2; // Default split between 2 people
    const perPerson = selectedTotal / numPeople;
    
    return { perPerson, selectedTotal };
  };

  const { perPerson, selectedTotal } = calculateSplit();

  if (!receipt) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {receipt.merchant || 'Receipt'}
        </Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Text style={styles.shareIcon}>↗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryValue}>${receipt.total.toFixed(2)}</Text>
          <Text style={styles.summaryMeta}>
            {receipt.items?.length || 0} items • {new Date(receipt.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Split Calculator */}
        <View style={styles.splitCard}>
          <Text style={styles.splitTitle}>Split Amount</Text>
          <View style={styles.splitRow}>
            <View style={styles.splitItem}>
              <Text style={styles.splitLabel}>Selected</Text>
              <Text style={styles.splitValue}>${selectedTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.splitDivider} />
            <View style={styles.splitItem}>
              <Text style={styles.splitLabel}>Each (2 people)</Text>
              <Text style={[styles.splitValue, styles.splitHighlight]}>
                ${perPerson.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Items List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          
          {receipt.items?.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.itemCard,
                !selectedItems.has(item.id) && styles.itemCardUnselected
              ]}
              onPress={() => toggleItem(item.id)}
            >
              <View style={styles.itemCheckbox}>
                <Text style={styles.checkboxIcon}>
                  {selectedItems.has(item.id) ? '☑' : '☐'}
                </Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}

          {(!receipt.items || receipt.items.length === 0) && (
            <View style={styles.emptyItems}>
              <Text style={styles.emptyText}>No items found</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Receipt</Text>
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
    flex: 1,
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    fontSize: 24,
    color: colors.brand,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  loadingText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  summaryCard: {
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  summaryLabel: {
    fontSize: fontSize.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryValue: {
    fontSize: 42,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
    marginVertical: spacing.xs,
  },
  summaryMeta: {
    fontSize: fontSize.caption,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  splitCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  splitTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  splitItem: {
    flex: 1,
    alignItems: 'center',
  },
  splitLabel: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  splitValue: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  splitHighlight: {
    color: colors.brand,
  },
  splitDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  itemCardUnselected: {
    opacity: 0.5,
  },
  itemCheckbox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxIcon: {
    fontSize: 24,
    color: colors.brand,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  itemQty: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  emptyItems: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  actions: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  deleteButton: {
    backgroundColor: colors.destructiveBg,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.destructive,
  },
});
