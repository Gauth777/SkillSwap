import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/theme';
import { KarmaBadge } from '@/components/KarmaBadge';
import { SkillTag } from '@/components/SkillTag';
import { formatDuration, getRelativeTime } from '@/lib/karma';

export default function SwapDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Store data & actions
  const posts = useAppStore((state) => state.posts);
  const sessions = useAppStore((state) => state.sessions);
  const currentUser = useAppStore((state) => state.currentUser);
  
  const requestSwap = useAppStore((state) => state.requestSwap);
  const acceptSwap = useAppStore((state) => state.acceptSwap);
  const declineSwap = useAppStore((state) => state.declineSwap);
  const completeSwap = useAppStore((state) => state.completeSwap);

  const currentUserId = currentUser?.id || 'u_self';

  // Find post and related session
  const post = posts.find((p) => p.id === id);
  const session = sessions.find((s) => s.postId === id);

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>Post not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isAuthorSelf = post.authorId === currentUserId;
  const isTeach = post.type === 'teach';
  const karmaValue = Math.abs(post.karma);

  // Status mapping colors & labels
  const getStatusBadge = () => {
    if (!session) {
      return { label: 'Open Post', color: Colors.primary, icon: 'bookmark-outline' as const };
    }
    return {
      pending: { label: 'Pending Request', color: Colors.statusPending, icon: 'time-outline' as const },
      accepted: { label: 'Scheduled Swap', color: Colors.statusAccepted, icon: 'calendar-outline' as const },
      completed: { label: 'Completed Swap', color: Colors.statusCompleted, icon: 'checkmark-circle-outline' as const },
      declined: { label: 'Declined Swap', color: Colors.statusDeclined, icon: 'close-circle-outline' as const },
    }[session.status];
  };

  const statusBadge = getStatusBadge();

  // Request swap action
  const handleRequestSwap = () => {
    // Karma enforcement:
    // If it's a "teach" post, the author is offering to teach.
    // The responder (current user) is the learner, and will SPEND karma.
    // Ensure current user has enough karma!
    if (isTeach && currentUser && currentUser.karmaBalance < karmaValue) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Insufficient Karma',
        `This session requires ${karmaValue} Karma. You only have ${currentUser.karmaBalance} Karma. Try offering your skills to earn more!`,
        [{ text: 'OK' }]
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    requestSwap(post.id);
    Alert.alert('Success', 'Swap request sent! You will be notified when they respond.');
  };

  const handleAccept = () => {
    if (!session) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    acceptSwap(session.id);
  };

  const handleDecline = () => {
    if (!session) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    declineSwap(session.id);
  };

  const handleComplete = () => {
    if (!session) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeSwap(session.id);
    Alert.alert('Session Completed', `Awesome! ${karmaValue} Karma has been transferred.`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Swap Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Indicator Bar */}
        <View style={[styles.statusBanner, { backgroundColor: statusBadge.color + '10' }]}>
          <Ionicons name={statusBadge.icon} size={18} color={statusBadge.color} />
          <Text style={[styles.statusLabel, { color: statusBadge.color }]}>
            {statusBadge.label}
          </Text>
        </View>

        {/* Swap Header Card */}
        <View style={styles.card}>
          <View style={styles.postTypeRow}>
            <View style={[styles.typeBadge, isTeach ? styles.teachBadge : styles.learnBadge]}>
              <Text style={[styles.typeText, isTeach ? styles.teachText : styles.learnText]}>
                {isTeach ? 'Offering to teach' : 'Seeking to learn'}
              </Text>
            </View>
            <KarmaBadge amount={karmaValue} showSign={false} size="sm" />
          </View>

          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.description}>{post.description}</Text>

          <View style={styles.divider} />

          {/* Details list */}
          <View style={styles.detailsList}>
            <View style={styles.detailItem}>
              <Ionicons name="bookmark-outline" size={16} color={Colors.textSecondary} style={styles.detailIcon} />
              <View>
                <Text style={styles.detailLabel}>Subject Area</Text>
                <Text style={styles.detailValue}>{post.skillName} ({post.category})</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color={Colors.textSecondary} style={styles.detailIcon} />
              <View>
                <Text style={styles.detailLabel}>Session Duration</Text>
                <Text style={styles.detailValue}>{formatDuration(post.duration)}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} style={styles.detailIcon} />
              <View>
                <Text style={styles.detailLabel}>Date Created</Text>
                <Text style={styles.detailValue}>{new Date(post.createdAt).toLocaleDateString()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Participant Profile Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{isAuthorSelf ? 'Your Post Details' : 'About the Mentor/Learner'}</Text>
          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{post.authorName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{post.authorName}</Text>
              <Text style={styles.profileSubtitle}>SkillSwap Member</Text>
            </View>
          </View>
          {!isAuthorSelf && (
            <Text style={styles.aboutText}>
              You can connect with {post.authorName} to exchange this skill. Acceptances and completions are recorded instantly.
            </Text>
          )}
        </View>

        {/* Dynamic Context Actions */}
        <View style={styles.actionsWrapper}>
          {/* Case A: Open Post & Not Self */}
          {!session && !isAuthorSelf && (
            <TouchableOpacity style={styles.primaryActionBtn} onPress={handleRequestSwap} activeOpacity={0.85}>
              <Text style={styles.primaryActionBtnText}>Request Skill Swap</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.textInverse} style={styles.actionIcon} />
            </TouchableOpacity>
          )}

          {/* Case B: Pending & Incoming (User is teacher) */}
          {session && session.status === 'pending' && session.teacherId === currentUserId && (
            <View style={styles.dualActions}>
              <TouchableOpacity style={[styles.actionBtn, styles.declineBtn]} onPress={handleDecline} activeOpacity={0.8}>
                <Text style={styles.declineText}>Decline Request</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.acceptBtn]} onPress={handleAccept} activeOpacity={0.8}>
                <Text style={styles.acceptText}>Accept & Schedule</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Case C: Pending & Outgoing (User is learner) */}
          {session && session.status === 'pending' && session.learnerId === currentUserId && (
            <View style={styles.waitingContainer}>
              <Ionicons name="hourglass-outline" size={20} color={Colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={styles.waitingLabel}>Waiting for {session.teacherName} to accept...</Text>
            </View>
          )}

          {/* Case D: Scheduled / Accepted (Awaiting completion) */}
          {session && session.status === 'accepted' && (
            <TouchableOpacity style={[styles.primaryActionBtn, styles.completeBtn]} onPress={handleComplete} activeOpacity={0.85}>
              <Text style={styles.primaryActionBtnText}>Mark Swap Completed</Text>
              <Ionicons name="checkmark-circle" size={18} color={Colors.textInverse} style={styles.actionIcon} />
            </TouchableOpacity>
          )}

          {/* Case E: Completed */}
          {session && session.status === 'completed' && (
            <View style={styles.successMessageCard}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} style={{ marginBottom: Spacing.xs }} />
              <Text style={styles.successMessageTitle}>Swap Session Completed</Text>
              <Text style={styles.successMessageDesc}>
                {session.teacherName} earned {session.karma} Karma. {session.learnerName} spent {session.karma} Karma.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBackBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['5xl'],
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.lg,
  },
  statusLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    marginLeft: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
  },
  postTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  typeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  teachBadge: {
    backgroundColor: Colors.teachBg,
  },
  teachText: {
    color: Colors.teachText,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
  },
  learnBadge: {
    backgroundColor: Colors.learnBg,
  },
  learnText: {
    color: Colors.learnText,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  detailsList: {
    gap: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: Spacing.md,
  },
  detailLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: FontWeight.medium,
  },
  detailValue: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.semibold,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  profileText: {
    justifyContent: 'center',
  },
  profileName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  profileSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  aboutText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  actionsWrapper: {
    marginTop: Spacing.sm,
  },
  primaryActionBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    ...Shadow.md,
  },
  primaryActionBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  actionIcon: {
    marginLeft: 6,
  },
  dualActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtn: {
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  declineText: {
    color: Colors.textSecondary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
  },
  acceptText: {
    color: Colors.textInverse,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.md,
  },
  waitingLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  completeBtn: {
    backgroundColor: Colors.success,
  },
  successMessageCard: {
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: Colors.success + '40',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  successMessageTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.success,
    marginBottom: 2,
  },
  successMessageDesc: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginVertical: Spacing.md,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  backBtnText: {
    color: Colors.textInverse,
    fontWeight: FontWeight.bold,
  },
  typeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
  },
});
