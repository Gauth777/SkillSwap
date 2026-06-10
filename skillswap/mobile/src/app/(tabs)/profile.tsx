import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/store/useAppStore';
import { SKILLS } from '@/data/mock';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/theme';
import { UserAvatar } from '@/components/UserAvatar';
import { SkillTag } from '@/components/SkillTag';

export default function Profile() {
  const router = useRouter();
  const currentUser = useAppStore((state) => state.currentUser);
  const sessions = useAppStore((state) => state.sessions);
  const karmaLedger = useAppStore((state) => state.karmaLedger);
  const resetDemo = useAppStore((state) => state.resetDemo);

  const currentUserId = currentUser?.id || 'u_self';

  // Calculate stats
  const completedSessions = sessions.filter(
    (s) => s.status === 'completed' && (s.teacherId === currentUserId || s.learnerId === currentUserId)
  );
  
  const userLedger = karmaLedger.filter((tx) => tx.userId === currentUserId);
  
  const karmaEarned = userLedger
    .filter((tx) => tx.delta > 0 && tx.type === 'session_completed_earned')
    .reduce((sum, tx) => sum + tx.delta, 0);

  const karmaSpent = userLedger
    .filter((tx) => tx.delta < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.delta), 0);

  // Map skill IDs to names
  const teachSkills = SKILLS.filter((s) => currentUser?.skillsToTeach.includes(s.id));
  const learnSkills = SKILLS.filter((s) => currentUser?.skillsToLearn.includes(s.id));

  const handleResetDemo = () => {
    Alert.alert(
      'Reset Demo',
      'This will clear all custom posts, sessions, karma transactions, and onboard state. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            resetDemo();
            // RootLayout guard will automatically redirect back to onboarding
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Shortcut to re-trigger onboarding flow as an edit profile helper
    useAppStore.setState({ isOnboarded: false });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeaderCard}>
        <UserAvatar name={currentUser?.name || ''} size={72} style={styles.avatar} />
        <Text style={styles.userName}>{currentUser?.name}</Text>
        <Text style={styles.userHandle}>@{currentUser?.handle}</Text>
        <Text style={styles.userBio}>{currentUser?.bio}</Text>
        
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile} activeOpacity={0.8}>
          <Ionicons name="create-outline" size={14} color={Colors.primary} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{completedSessions.length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={[styles.statBox, styles.statBorder]}>
          <Text style={[styles.statNumber, { color: Colors.success }]}>+{karmaEarned}</Text>
          <Text style={styles.statLabel}>Earned</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: Colors.error }]}>-{karmaSpent}</Text>
          <Text style={styles.statLabel}>Spent</Text>
        </View>
      </View>

      {/* Skills Sections */}
      <View style={styles.skillsSection}>
        <Text style={styles.sectionTitle}>Skills I Teach</Text>
        <View style={styles.tagsContainer}>
          {teachSkills.length > 0 ? (
            teachSkills.map((skill) => <SkillTag key={`teach_${skill.id}`} name={skill.name} />)
          ) : (
            <Text style={styles.emptyText}>No skills added yet</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Skills I Want to Learn</Text>
        <View style={styles.tagsContainer}>
          {learnSkills.length > 0 ? (
            learnSkills.map((skill) => <SkillTag key={`learn_${skill.id}`} name={skill.name} />)
          ) : (
            <Text style={styles.emptyText}>No skills added yet</Text>
          )}
        </View>
      </View>

      {/* Glowing AI Helper Card */}
      <TouchableOpacity
        style={styles.aiCard}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/ai-assistant');
        }}
        activeOpacity={0.9}
      >
        <View style={styles.aiCardLeft}>
          <View style={styles.aiIconContainer}>
            <Ionicons name="sparkles" size={20} color={Colors.textInverse} />
          </View>
          <View style={styles.aiCardText}>
            <Text style={styles.aiCardTitle}>SkillSwap AI Assistant</Text>
            <Text style={styles.aiCardDesc}>Get matches and chat with AI advisor</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
      </TouchableOpacity>

      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={handleResetDemo} activeOpacity={0.8}>
        <Ionicons name="refresh" size={16} color={Colors.error} style={styles.resetIcon} />
        <Text style={styles.resetButtonText}>Reset Hackathon Demo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['5xl'],
  },
  profileHeaderCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
  },
  avatar: {
    marginBottom: Spacing.md,
  },
  userName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  userHandle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  userBio: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  editButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginLeft: 4,
  },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.borderLight,
  },
  statNumber: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  skillsSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  aiCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.primaryLight + '30',
    ...Shadow.sm,
  },
  aiCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconContainer: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  aiCardText: {
    justifyContent: 'center',
  },
  aiCardTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  aiCardDesc: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.error + '40',
    borderRadius: Radius.md,
    backgroundColor: Colors.errorBg,
  },
  resetIcon: {
    marginRight: 6,
  },
  resetButtonText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
