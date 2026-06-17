import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/store/useAppStore';
import { SKILLS } from '@/data/mock';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/theme';
import { UserAvatar } from '@/components/UserAvatar';
import { SkillTag } from '@/components/SkillTag';
import { UserSkillGraph } from '@/components/UserSkillGraph';
import { getUserGraph } from '@/services/graphService';
import { updateUserSkills } from '@/services/userService';
import type { UserGraphResponse } from '@/types';

export default function Profile() {
  const router = useRouter();
  const currentUser = useAppStore((state) => state.currentUser);
  const sessions = useAppStore((state) => state.sessions);
  const posts = useAppStore((state) => state.posts);
  const karmaLedger = useAppStore((state) => state.karmaLedger);
  const resetDemo = useAppStore((state) => state.resetDemo);

  const currentUserId = currentUser?.id || 'u_self';

  // Graph state
  const [graphData, setGraphData] = useState<UserGraphResponse | null>(null);
  const [graphLoading, setGraphLoading] = useState(true);
  const [graphError, setGraphError] = useState<string | null>(null);

  // Edit Skills Modal States
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [tempTeachSkills, setTempTeachSkills] = useState<string[]>([]);
  const [tempLearnSkills, setTempLearnSkills] = useState<string[]>([]);
  const [isSavingSkills, setIsSavingSkills] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch graph function
  const loadGraph = useCallback(async () => {
    setGraphLoading(true);
    setGraphError(null);
    try {
      const data = await getUserGraph(currentUserId, currentUser, posts);
      setGraphData(data);
    } catch (err) {
      setGraphError('Failed to load profile graph');
    } finally {
      setGraphLoading(false);
    }
  }, [currentUserId, currentUser, posts]);

  // Refetch graph when profile tab gains focus
  useFocusEffect(
    useCallback(() => {
      loadGraph();
    }, [loadGraph])
  );

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
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    useAppStore.setState({ isOnboarded: false });
  };

  const handleEditSkillsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTempTeachSkills(currentUser?.skillsToTeach || []);
    setTempLearnSkills(currentUser?.skillsToLearn || []);
    setSaveError(null);
    setIsEditingSkills(true);
  };

  const handleSaveSkills = async () => {
    if (tempTeachSkills.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one skill to teach.');
      return;
    }
    if (tempLearnSkills.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one skill to learn.');
      return;
    }

    setIsSavingSkills(true);
    setSaveError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const updatedUser = await updateUserSkills(currentUserId, tempTeachSkills, tempLearnSkills);
      if (updatedUser) {
        useAppStore.setState({ currentUser: updatedUser });
      } else {
        // Fallback store update if offline
        if (currentUser) {
          useAppStore.setState({
            currentUser: {
              ...currentUser,
              skillsToTeach: tempTeachSkills,
              skillsToLearn: tempLearnSkills,
            }
          });
        }
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsEditingSkills(false);
      // Force graph refresh
      await loadGraph();
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update skills. Please try again.');
    } finally {
      setIsSavingSkills(false);
    }
  };

  const toggleTempTeachSkill = (skillId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (tempTeachSkills.includes(skillId)) {
      setTempTeachSkills(tempTeachSkills.filter((id) => id !== skillId));
    } else {
      setTempTeachSkills([...tempTeachSkills, skillId]);
    }
  };

  const toggleTempLearnSkill = (skillId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (tempLearnSkills.includes(skillId)) {
      setTempLearnSkills(tempLearnSkills.filter((id) => id !== skillId));
    } else {
      setTempLearnSkills([...tempLearnSkills, skillId]);
    }
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
        <View style={styles.skillsHeaderRow}>
          <Text style={styles.sectionTitle}>Skills I Teach</Text>
          <TouchableOpacity onPress={handleEditSkillsPress} style={styles.editSkillsBtn} activeOpacity={0.7}>
            <Ionicons name="pencil-sharp" size={12} color={Colors.primary} />
            <Text style={styles.editSkillsBtnText}>Edit Skills</Text>
          </TouchableOpacity>
        </View>
        
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

      {/* Reusable Knowledge Graph */}
      <View style={{ marginBottom: Spacing.lg }}>
        <UserSkillGraph graph={graphData} loading={graphLoading} error={graphError} />
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

      {/* Edit Skills Inline Dialog Modal */}
      <Modal visible={isEditingSkills} animationType="fade" transparent={true} onRequestClose={() => setIsEditingSkills(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit My Skills</Text>
              <TouchableOpacity onPress={() => setIsEditingSkills(false)} disabled={isSavingSkills}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {saveError && <Text style={styles.errorBanner}>{saveError}</Text>}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              <Text style={styles.modalSectionTitle}>Skills I Can Teach</Text>
              <View style={styles.modalTagsGrid}>
                {SKILLS.map((skill) => {
                  const isSelected = tempTeachSkills.includes(skill.id);
                  return (
                    <SkillTag
                      key={`edit_teach_${skill.id}`}
                      name={skill.name}
                      selected={isSelected}
                      onPress={() => toggleTempTeachSkill(skill.id)}
                    />
                  );
                })}
              </View>

              <Text style={[styles.modalSectionTitle, { marginTop: Spacing.lg }]}>Skills I Want to Learn</Text>
              <View style={styles.modalTagsGrid}>
                {SKILLS.map((skill) => {
                  const isSelected = tempLearnSkills.includes(skill.id);
                  return (
                    <SkillTag
                      key={`edit_learn_${skill.id}`}
                      name={skill.name}
                      selected={isSelected}
                      onPress={() => toggleTempLearnSkill(skill.id)}
                    />
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setIsEditingSkills(false)}
                disabled={isSavingSkills}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleSaveSkills}
                disabled={isSavingSkills}
                activeOpacity={0.8}
              >
                {isSavingSkills ? (
                  <ActivityIndicator size="small" color={Colors.textInverse} />
                ) : (
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  skillsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  editSkillsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  editSkillsBtnText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginLeft: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    width: '100%',
    maxHeight: '80%',
    padding: Spacing.lg,
    ...Shadow.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: Spacing.sm,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  errorBanner: {
    backgroundColor: Colors.errorBg,
    color: Colors.error,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    marginBottom: Spacing.md,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  modalScroll: {
    paddingBottom: Spacing.lg,
  },
  modalSectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalTagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
  },
  modalBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    marginLeft: Spacing.sm,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
  },
  saveBtnText: {
    color: Colors.textInverse,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
});
