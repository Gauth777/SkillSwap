import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/theme';
import { SwapCard } from '@/components/SwapCard';
import { EmptyState } from '@/components/EmptyState';

type TabType = 'pending' | 'active' | 'past';

export default function MySwaps() {
  const router = useRouter();
  const sessions = useAppStore((state) => state.sessions);
  const currentUser = useAppStore((state) => state.currentUser);
  
  const acceptSwap = useAppStore((state) => state.acceptSwap);
  const declineSwap = useAppStore((state) => state.declineSwap);
  const completeSwap = useAppStore((state) => state.completeSwap);

  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [refreshing, setRefreshing] = useState(false);

  const currentUserId = currentUser?.id || 'u_self';

  // Filter sessions based on tab selection
  const filteredSessions = sessions.filter((s) => {
    const isParticipant = s.teacherId === currentUserId || s.learnerId === currentUserId;
    if (!isParticipant) return false;

    if (activeTab === 'pending') {
      return s.status === 'pending';
    }
    if (activeTab === 'active') {
      return s.status === 'accepted';
    }
    if (activeTab === 'past') {
      return s.status === 'completed' || s.status === 'declined';
    }
    return false;
  });

  const handleRefresh = () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleAccept = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    acceptSwap(id);
  };

  const handleDecline = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    declineSwap(id);
  };

  const handleComplete = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeSwap(id);
  };

  const getEmptyConfig = () => {
    switch (activeTab) {
      case 'pending':
        return {
          title: 'No pending requests',
          description: 'Incoming and outgoing swap requests will show up here.',
          icon: 'time-outline' as const,
        };
      case 'active':
        return {
          title: 'No active swaps',
          description: 'Browse the feed to find a skill to learn, or offer one of your skills.',
          icon: 'calendar-outline' as const,
        };
      case 'past':
        return {
          title: 'No past sessions',
          description: 'Completed swaps will show up here along with your ledger logs.',
          icon: 'checkmark-circle-outline' as const,
        };
    }
  };

  const emptyConfig = getEmptyConfig();

  return (
    <View style={styles.container}>
      {/* Segmented Tab Bar */}
      <View style={styles.tabBar}>
        {(['pending', 'active', 'past'] as const).map((tab) => {
          const isSelected = activeTab === tab;
          const label = tab.charAt(0).toUpperCase() + tab.slice(1);
          
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, isSelected && styles.tabItemActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab(tab);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabLabel, isSelected && styles.tabLabelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Sessions list */}
      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwapCard
            session={item}
            currentUserId={currentUserId}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/swap/${item.postId}`);
            }}
            onAccept={() => handleAccept(item.id)}
            onDecline={() => handleDecline(item.id)}
            onComplete={() => handleComplete(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <EmptyState
            title={emptyConfig.title}
            description={emptyConfig.description}
            icon={emptyConfig.icon}
            actionText={activeTab === 'active' ? 'Browse Feed' : undefined}
            onAction={activeTab === 'active' ? () => router.push('/(tabs)') : undefined}
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
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tabItem: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSecondary,
    marginHorizontal: 3,
  },
  tabItemActive: {
    backgroundColor: Colors.primaryBg,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
  listContent: {
    padding: Spacing.lg,
    flexGrow: 1,
  },
});
