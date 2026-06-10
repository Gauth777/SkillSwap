import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { SwapPost } from '@/types';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/theme';
import { KarmaBadge } from './KarmaBadge';
import { SkillTag } from './SkillTag';
import { formatDuration, getRelativeTime } from '@/lib/karma';

interface PostCardProps {
  post: SwapPost;
  onPress: () => void;
  onRespond?: () => void;
  showRespondButton?: boolean;
}

export function PostCard({ post, onPress, onRespond, showRespondButton = false }: PostCardProps) {
  const isTeach = post.type === 'teach';
  const durationText = formatDuration(post.duration);
  const timeAgo = getRelativeTime(post.createdAt);

  const typeBadgeStyle = [
    styles.typeBadge,
    isTeach ? styles.teachBadge : styles.learnBadge,
  ];

  const typeTextStyle = [
    styles.typeText,
    isTeach ? styles.teachText : styles.learnText,
  ];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.authorRow}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{post.authorName.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.authorName}>{post.authorName}</Text>
            <Text style={styles.timeText}>{timeAgo}</Text>
          </View>
        </View>

        <View style={typeBadgeStyle}>
          <Text style={typeTextStyle}>
            {isTeach ? 'Offering' : 'Seeking'}
          </Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
      <Text style={styles.description} numberOfLines={3}>{post.description}</Text>

      <View style={styles.tagsContainer}>
        <SkillTag name={post.skillName} />
        <View style={styles.durationRow}>
          <Ionicons name="time-outline" size={14} color={Colors.textSecondary} style={styles.durationIcon} />
          <Text style={styles.durationText}>{durationText}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        {/* We use Math.abs because KarmaBadge shows its own sign indicator. For posts, we show the raw transaction magnitude. */}
        <KarmaBadge amount={Math.abs(post.karma)} showSign={false} size="sm" />
        
        {showRespondButton && onRespond && (
          <TouchableOpacity onPress={onRespond} style={styles.respondButton} activeOpacity={0.8}>
            <Text style={styles.respondButtonText}>Swap</Text>
            <Ionicons name="arrow-forward-outline" size={14} color={Colors.textInverse} style={styles.respondIcon} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
  authorName: {
    color: Colors.text,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.sm,
  },
  timeText: {
    color: Colors.textTertiary,
    fontSize: FontSize.xs,
    marginTop: 1,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  teachBadge: {
    backgroundColor: Colors.teachBg,
  },
  teachText: {
    color: Colors.teachText,
  },
  learnBadge: {
    backgroundColor: Colors.learnBg,
  },
  learnText: {
    color: Colors.learnText,
  },
  typeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: FontSize.lg,
    color: Colors.text,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  durationIcon: {
    marginRight: 4,
  },
  durationText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md,
    marginTop: Spacing.xs,
  },
  respondButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    ...Shadow.sm,
  },
  respondButtonText: {
    color: Colors.textInverse,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
  respondIcon: {
    marginLeft: 4,
  },
});
