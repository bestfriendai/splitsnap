import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/theme';
import { saveReceipt, generateId, ReceiptItem } from '../../src/services/storage';

export default function CreateReceiptScreen() {
  const router = useRouter();
  const [merchant, setMerchant] = useState('');
  const [items, setItems] = useState<ReceiptItem[]>([
    { id: generateId(), name: '', price: 0, quantity: 1 }
  ]);
  const [tax, setTax] = useState('');

  const addItem = () => {
    setItems([...items, { id: generateId(), name: '', price: 0, quantity: 1 }]);
  };

  const updateItem = (index: number, field: keyof ReceiptItem, value: string | number) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = parseFloat(tax) || 0;
    return subtotal + taxAmount;
  };

  const handleSave = async () => {
    // Validate
    const validItems = items.filter(item => item.name.trim() && item.price > 0);
    
    if (validItems.length === 0) {
      Alert.alert('Error', 'Please add at least one item with a name and price');
      return;
    }

    const receipt = {
      id: generateId(),
      merchant: merchant.trim() || 'Receipt',
      total: calculateTotal(),
      tax: parseFloat(tax) || 0,
      items: validItems,
      createdAt: new Date().toISOString(),
    };

    await saveReceipt(receipt);
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Receipt</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Merchant Name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Store / Restaurant</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Whole Foods, Chipotle"
              placeholderTextColor={colors.textTertiary}
              value={merchant}
              onChangeText={setMerchant}
              autoCapitalize="words"
            />
          </View>

          {/* Items */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Items</Text>
              <TouchableOpacity onPress={addItem}>
                <Text style={styles.addText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            {items.map((item, index) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemRow}>
                  <TextInput
                    style={[styles.input, styles.itemNameInput]}
                    placeholder="Item name"
                    placeholderTextColor={colors.textTertiary}
                    value={item.name}
                    onChangeText={(value) => updateItem(index, 'name', value)}
                  />
                  {items.length > 1 && (
                    <TouchableOpacity onPress={() => removeItem(index)} style={styles.removeButton}>
                      <Text style={styles.removeText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                <View style={styles.itemDetails}>
                  <View style={styles.qtyContainer}>
                    <Text style={styles.detailLabel}>Qty</Text>
                    <View style={styles.qtyRow}>
                      <TouchableOpacity 
                        style={styles.qtyButton}
                        onPress={() => updateItem(index, 'quantity', Math.max(1, item.quantity - 1))}
                      >
                        <Text style={styles.qtyButtonText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyValue}>{item.quantity}</Text>
                      <TouchableOpacity 
                        style={styles.qtyButton}
                        onPress={() => updateItem(index, 'quantity', item.quantity + 1)}
                      >
                        <Text style={styles.qtyButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.priceContainer}>
                    <Text style={styles.detailLabel}>Price</Text>
                    <TextInput
                      style={[styles.input, styles.priceInput]}
                      placeholder="0.00"
                      placeholderTextColor={colors.textTertiary}
                      value={item.price > 0 ? item.price.toString() : ''}
                      onChangeText={(value) => updateItem(index, 'price', parseFloat(value) || 0)}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Tax */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tax</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              value={tax}
              onChangeText={setTax}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Total */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButtonLarge} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Receipt</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  cancelButton: {
    padding: spacing.xs,
  },
  cancelText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  headerTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  saveButton: {
    padding: spacing.xs,
  },
  saveText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.brand,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.md,
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
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  addText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.brand,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemNameInput: {
    flex: 1,
    marginRight: spacing.sm,
  },
  removeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.destructiveBg,
    borderRadius: radius.sm,
  },
  removeText: {
    fontSize: 20,
    color: colors.destructive,
    fontWeight: fontWeight.bold,
  },
  itemDetails: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  qtyContainer: {
    flex: 1,
  },
  priceContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.sm,
  },
  qtyButtonText: {
    fontSize: 18,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  qtyValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    minWidth: 40,
    textAlign: 'center',
  },
  priceInput: {
    textAlign: 'right',
  },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  totalLabel: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  saveButtonLarge: {
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  saveButtonText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: '#FFFFFF',
  },
});
