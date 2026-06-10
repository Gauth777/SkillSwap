import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/store/useAppStore';
import { SKILLS } from '@/data/mock';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/theme';
import { PostCard } from '@/components/PostCard';
import { EmptyState } from '@/components/EmptyState';

export default function Matches() {
  const router = useRouter();
  const posts = useAppStore((state) => state.posts);
  const currentUser = useAppStore((state) => state.currentUser);
  const [refreshing, setRefreshing] = useState(false);

  // Extract matching logic
  const teachSkillNames = SKILLS.filter((s) => currentUser?.skillsToTeach.includes(s.id)).map((s) => s.name);
  const learnSkillNames = SKILLS.filter((s) => currentUser?.skillsToLearn.includes(s.id)).map((s) => s.name);

  const matchedPosts = posts.filter((post) => {
    if (post.status !== 'open') return false;
    if (post.authorId === currentUser?.id) return false; // Don't match own posts

    if (post.type === 'teach') {
      // Someone is teaching a skill the current user wants to learn
      return learnSkillNames.includes(post.skillName);
    } else {
      // Someone wants to learn a skill the current user can teach
      return teachSkillNames.includes(post.skillName);
    }
  });

  const handleRefresh = () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Intro Header */}
      <View style={styles.header}>
        <View style={styles.sparkleIcon}>
          <Text style={styles.sparkleText}>✨</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Smart Matches</Text>
          <Text style={styles.headerSubtitle}>
            Posts matched with your teaching ({teachSkillNames.length}) or learning ({learnSkillNames.length}) interests.
          </Text>
        </View>
      </View>

      {/* Matches List */}
      <FlatList
        data={matchedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/swap/${item.id}`);
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <EmptyState
            title="No matches right now"
            description="Try editing your skills in your profile to find different match opportunities."
            icon="sparkles-outline"
            actionText="Go to Profile"
            onAction={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(tabs)/profile');
            }}
          />
        }
      />
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
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  sparkleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  sparkleText: {
    fontSize: FontSize.lg,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  listContent: {
    padding: Spacing.lg,
    flexGrow: 1,
  },
});
