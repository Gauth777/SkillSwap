import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/store/useAppStore';
import { SKILLS, DEMO_USERS } from '@/data/mock';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/theme';
import { UserAvatar } from '@/components/UserAvatar';
import { SkillTag } from '@/components/SkillTag';
import { UserSkillGraph } from '@/components/UserSkillGraph';
import { fetchUser } from '@/services/userService';
import { getUserGraph } from '@/services/graphService';
import type { User, UserGraphResponse } from '@/types';

export default function OtherUserProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const sessions = useAppStore((state) => state.sessions);
  const posts = useAppStore((state) => state.posts);

  // States
  const [user, setUser] = useState<User | null>(null);
  const [graphData, setGraphData] = useState<UserGraphResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [graphLoading, setGraphLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [graphError, setGraphError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    
    async function loadData() {
      setLoading(true);
      setGraphLoading(true);
      setError(null);
      setGraphError(null);

      try {
        // 1. Fetch user profile from backend
        const fetched = await fetchUser(id);
        if (isMounted) {
          if (fetched) {
            setUser(fetched);
          } else {
            // Fallback: check DEMO_USERS locally
            const localFound = DEMO_USERS.find((u) => u.id === id);
            if (localFound) {
              setUser(localFound);
            } else {
              setError('User not found');
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          // Fallback to local
          const localFound = DEMO_USERS.find((u) => u.id === id);
          if (localFound) {
            setUser(localFound);
          } else {
            setError('Failed to load user profile');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }

      try {
        // 2. Fetch user-specific graph
        const fetchedGraph = await getUserGraph(id, user, posts);
        if (isMounted) {
          setGraphData(fetchedGraph);
        }
      } catch (err) {
        if (isMounted) {
          setGraphError('Failed to load user graph');
        }
      } finally {
        if (isMounted) {
          setGraphLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{error || 'User not found'}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate user stats from local state for this profile
  const completedSessions = sessions.filter(
    (s) => s.status === 'completed' && (s.teacherId === user.id || s.learnerId === user.id)
  );

  // Map skill IDs to display names
  const teachSkills = SKILLS.filter((s) => user.skillsToTeach.includes(s.id));
  const learnSkills = SKILLS.filter((s) => user.skillsToLearn.includes(s.id));

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>@{user.handle}'s Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileHeaderCard}>
          <UserAvatar name={user.name} size={72} style={styles.avatar} />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userHandle}>@{user.handle}</Text>
          <Text style={styles.userBio}>{user.bio}</Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{completedSessions.length}</Text>
            <Text style={styles.statLabel}>Completed Swaps</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <Text style={[styles.statNumber, { color: Colors.primary }]}>{user.karmaBalance}</Text>
            <Text style={styles.statLabel}>Karma Balance</Text>
          </View>
        </View>

        {/* Skills Sections */}
        <View style={styles.skillsSection}>
          <Text style={styles.sectionTitle}>Skills I Teach</Text>
          <View style={styles.tagsContainer}>
            {teachSkills.length > 0 ? (
              teachSkills.map((skill) => <SkillTag key={`teach_${skill.id}`} name={skill.name} />)
            ) : (
              <Text style={styles.emptyText}>No skills listed</Text>
            )}
          </View>

          <Text style={styles.sectionTitle}>Skills I Want to Learn</Text>
          <View style={styles.tagsContainer}>
            {learnSkills.length > 0 ? (
              learnSkills.map((skill) => <SkillTag key={`learn_${skill.id}`} name={skill.name} />)
            ) : (
              <Text style={styles.emptyText}>No skills listed</Text>
            )}
          </View>
        </View>

        {/* Personalized Graph Component */}
        <UserSkillGraph graph={graphData} loading={graphLoading} error={graphError} />
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
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
});
