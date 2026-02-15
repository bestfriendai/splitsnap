import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/theme';
import { getGroup, Group, loadReceipts } from '../../src/services/storage';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [balances, setBalances] = useState<Record<string, number>>({});

  useEffect(() => {
    if (id) loadGroup();
  }, [id]);

  const loadGroup = async () => {
    const data = await getGroup(id!);
    setGroup(data);
    
    // Calculate balances from receipts
    const receipts = await loadReceipts();
    const groupReceipts = receipts.filter(r => r.groupId === id);
    
    const newBalances: Record<string, number> = {};
    groupReceipts.forEach(r => {
      // Simplified: add total to each member's balance
      r.items?.forEach(item => {
        item.assignedTo?.forEach(member => {
          newBalances[member] = (newBalances[member] || 0) + (item.price * item.quantity) / (item.assignedTo?.length || 1);
        });
      });
    });
    setBalances(newBalances);
  };

  const handleAddMember = () => {
    Alert.prompt(
      'Add Member',
      'Enter member name',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', onPress: (name) => {
          if (name?.trim() && group) {
            // Would save to group - simplified for demo
            loadGroup();
          }
        }},
      ],
      'plain-text'
    );
  };

  if (!group) {
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
          {group.name}
        </Text>
        <TouchableOpacity onPress={handleAddMember} style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.groupAvatar}>
            <Text style={styles.groupInitial}>
              {(group.name || 'G').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.memberCount}>
            {group.members?.length || 0} members
          </Text>
        </View>

        {/* Balances */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Balances</Text>
          
          {group.members?.length === 0 ? (
            <View style={styles.emptyBalances}>
              <Text style={styles.emptyText}>No members yet</Text>
              <TouchableOpacity style={styles.addMemberButton} onPress={handleAddMember}>
                <Text style={styles.addMemberText}>Add a member</Text>
              </TouchableOpacity>
            </View>
          ) : (
            group.members.map((member, index) => (
              <View key={index} style={styles.memberRow}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberInitial}>
                    {member.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.memberName}>{member}</Text>
                <Text style={[
                  styles.memberBalance,
                  (balances[member] || 0) >= 0 ? styles.positive : styles.negative
                ]}>
                  {(balances[member] || 0) >= 0 ? '+' : ''}${balances[member]?.toFixed(2) || '0.00'}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📷</Text>
            <Text style={styles.actionText}>Scan a receipt</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💸</Text>
            <Text style={styles.actionText}>Settle up</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>View all expenses</Text>
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
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 28,
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
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  groupAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  groupInitial: {
    fontSize: 36,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  groupName: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  memberCount: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
  emptyBalances: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  emptyText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  addMemberButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.brandLight,
    borderRadius: radius.sm,
  },
  addMemberText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.brand,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  memberInitial: {
    fontSize: 18,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  memberName: {
    flex: 1,
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  memberBalance: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  positive: {
    color: colors.success,
  },
  negative: {
    color: colors.destructive,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  actionText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
});
