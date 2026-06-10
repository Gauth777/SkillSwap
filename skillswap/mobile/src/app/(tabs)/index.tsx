import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/theme';
import { PostCard } from '@/components/PostCard';
import { EmptyState } from '@/components/EmptyState';

export default function HomeFeed() {
  const router = useRouter();
  const posts = useAppStore((state) => state.posts);
  const currentUser = useAppStore((state) => state.currentUser);
  
  // Filter state
  const [filter, setFilter] = useState<'all' | 'teach' | 'learn'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Filter posts
  const openPosts = posts.filter((post) => post.status === 'open');
  const filteredPosts = openPosts.filter((post) => {
    if (filter === 'all') return true;
    return post.type === filter;
  });

  const handleRefresh = () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const navigateToCreatePost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/create-post');
  };

  return (
    <View style={styles.container}>
      {/* Filter Header */}
      <View style={styles.filterBar}>
        {(['all', 'teach', 'learn'] as const).map((type) => {
          const isSelected = filter === type;
          const label = type === 'all' ? 'All Swaps' : type === 'teach' ? 'Offering' : 'Seeking';
          
          return (
            <TouchableOpacity
              key={type}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFilter(type);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Posts List */}
      <FlatList
        data={filteredPosts}
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
            title="No swap requests found"
            description="Be the first to share a skill or request help in the community."
            icon="search-outline"
            actionText="Create a Post"
            onAction={navigateToCreatePost}
          />
        }
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={navigateToCreatePost}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={Colors.textInverse} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSecondary,
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.textInverse,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 80, // space for FAB
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
});
