import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { SwapSession } from '@/types';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/theme';
import { KarmaBadge } from './KarmaBadge';
import { formatDuration } from '@/lib/karma';

interface SwapCardProps {
  session: SwapSession;
  currentUserId: string;
  onPress: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  onComplete?: () => void;
}

export function SwapCard({
  session,
  currentUserId,
  onPress,
  onAccept,
  onDecline,
  onComplete,
}: SwapCardProps) {
  const isTeacher = session.teacherId === currentUserId;
  const partnerName = isTeacher ? session.learnerName : session.teacherName;
  const roleText = isTeacher ? 'Teaching' : 'Learning from';
  const durationText = formatDuration(session.duration);

  // Status mapping
  const statusConfig = {
    pending: {
      text: 'Pending Request',
      color: Colors.statusPending,
      icon: 'time-outline' as const,
    },
    accepted: {
      text: 'Scheduled',
      color: Colors.statusAccepted,
      icon: 'calendar-outline' as const,
    },
    completed: {
      text: 'Completed',
      color: Colors.statusCompleted,
      icon: 'checkmark-circle-outline' as const,
    },
    declined: {
      text: 'Declined',
      color: Colors.statusDeclined,
      icon: 'close-circle-outline' as const,
    },
  }[session.status];

  // Logic to show/hide action buttons
  const isIncomingPending = session.status === 'pending' && session.teacherId === currentUserId;
  const isOutgoingPending = session.status === 'pending' && session.learnerId === currentUserId;
  const isScheduled = session.status === 'accepted';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.card}>
      {/* Status Border Accent */}
      <View style={[styles.statusAccent, { backgroundColor: statusConfig.color }]} />

      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.roleContainer}>
            <Text style={styles.rolePrefix}>{roleText} </Text>
            <Text style={styles.partnerName}>{partnerName}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '15' }]}>
            <Ionicons name={statusConfig.icon} size={12} color={statusConfig.color} style={styles.statusIcon} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.text}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>{session.title}</Text>

        {/* Details Row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="bookmark-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{session.skillName}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{durationText}</Text>
          </View>
        </View>

        {/* Action / Value Footer */}
        <View style={styles.footer}>
          <KarmaBadge amount={session.karma} showSign={false} size="sm" />

          {/* Conditional Action Buttons */}
          {isIncomingPending && onAccept && onDecline && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDecline();
                }}
                style={[styles.actionBtn, styles.declineBtn]}
                activeOpacity={0.8}
              >
                <Text style={styles.declineBtnText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onAccept();
                }}
                style={[styles.actionBtn, styles.acceptBtn]}
                activeOpacity={0.8}
              >
                <Text style={styles.acceptBtnText}>Accept</Text>
              </TouchableOpacity>
            </View>
          )}

          {isOutgoingPending && (
            <Text style={styles.waitingText}>Waiting for response</Text>
          )}

          {isScheduled && onComplete && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              style={[styles.actionBtn, styles.completeBtn]}
              activeOpacity={0.8}
            >
              <Text style={styles.completeBtnText}>Mark Complete</Text>
              <Ionicons name="checkmark-sharp" size={12} color={Colors.textInverse} style={styles.btnIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
  },
  statusAccent: {
    width: 5,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  rolePrefix: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  partnerName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  detailText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginLeft: 4,
    fontWeight: FontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  declineBtn: {
    backgroundColor: Colors.surfaceSecondary,
    marginRight: Spacing.sm,
  },
  declineBtnText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
  },
  acceptBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  completeBtn: {
    backgroundColor: Colors.success,
  },
  completeBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  btnIcon: {
    marginLeft: 4,
  },
  waitingText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
