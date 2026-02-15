import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/theme';
import { loadGroups, Group } from '../../src/services/storage';

export default function GroupsScreen() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await loadGroups();
    setGroups(data);
  };

  const handleCreateGroup = () => {
    Alert.prompt(
      'New Group',
      'Enter group name',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Create', 
          onPress: async (name) => {
            if (name?.trim()) {
              // Group creation handled in storage
              loadData();
            }
          }
        },
      ],
      'plain-text'
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
        <TouchableOpacity onPress={handleCreateGroup}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {groups.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No groups yet</Text>
            <Text style={styles.emptySubtitle}>
              Create a group to split bills with friends, roommates, or travel companions
            </Text>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
              <Text style={styles.createButtonText}>Create Group</Text>
            </TouchableOpacity>
          </View>
        ) : (
          groups.map((group) => (
            <TouchableOpacity 
              key={group.id} 
              style={styles.groupCard}
              onPress={() => router.push(`/group/${group.id}`)}
            >
              <View style={styles.groupAvatar}>
                <Text style={styles.groupInitial}>
                  {(group.name || 'G').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupMembers}>
                  {group.members?.length || 0} members
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))
        )}

        {/* Quick Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested</Text>
          
          <TouchableOpacity style={styles.suggestedCard}>
            <View style={styles.suggestedIcon}>
              <Text style={styles.suggestedEmoji}>✈️</Text>
            </View>
            <View style={styles.suggestedInfo}>
              <Text style={styles.suggestedTitle}>Trip to NYC</Text>
              <Text style={styles.suggestedSubtitle}>4 people • $847 total</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.suggestedCard}>
            <View style={styles.suggestedIcon}>
              <Text style={styles.suggestedEmoji}>🏠</Text>
            </View>
            <View style={styles.suggestedInfo}>
              <Text style={styles.suggestedTitle}>Apartment</Text>
              <Text style={styles.suggestedSubtitle}>3 people • $1,240/mo</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.suggestedCard}>
            <View style={styles.suggestedIcon}>
              <Text style={styles.suggestedEmoji}>🍕</Text>
            </View>
            <View style={styles.suggestedInfo}>
              <Text style={styles.suggestedTitle}>Friday Dinners</Text>
              <Text style={styles.suggestedSubtitle}>6 people • $85 avg</Text>
            </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    fontSize: 28,
    color: colors.brand,
    fontWeight: fontWeight.medium,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  createButton: {
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  groupAvatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  groupInitial: {
    fontSize: 20,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  groupMembers: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: colors.textTertiary,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  suggestedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  suggestedIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  suggestedEmoji: {
    fontSize: 24,
  },
  suggestedInfo: {
    flex: 1,
  },
  suggestedTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  suggestedSubtitle: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
