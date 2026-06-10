import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { SKILLS } from '@/data/mock';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/theme';
import { SkillTag } from '@/components/SkillTag';

export default function Onboarding() {
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const router = useRouter();

  // Profile Form State
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');

  // Skills Selection State
  const [teachSkills, setTeachSkills] = useState<string[]>([]);
  const [learnSkills, setLearnSkills] = useState<string[]>([]);

  const toggleTeachSkill = (skillId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (teachSkills.includes(skillId)) {
      setTeachSkills(teachSkills.filter((id) => id !== skillId));
    } else {
      setTeachSkills([...teachSkills, skillId]);
    }
  };

  const toggleLearnSkill = (skillId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (learnSkills.includes(skillId)) {
      setLearnSkills(learnSkills.filter((id) => id !== skillId));
    } else {
      setLearnSkills([...learnSkills, skillId]);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Required Fields', 'Please enter your name to continue.');
      return;
    }

    if (!handle.trim()) {
      Alert.alert('Required Fields', 'Please enter a username.');
      return;
    }

    if (teachSkills.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one skill you can teach.');
      return;
    }

    if (learnSkills.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one skill you want to learn.');
      return;
    }

    // Success Haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    completeOnboarding({
      id: 'u_self',
      name: name.trim(),
      handle: handle.trim().toLowerCase().replace(/\s+/g, ''),
      bio: bio.trim() || 'Excited to swap skills!',
      skillsToTeach: teachSkills,
      skillsToLearn: learnSkills,
      karmaBalance: 8, // Set in completeOnboarding to include welcome bonus
      joinedAt: new Date().toISOString(),
    });

    // RootLayout router guard will automatically redirect to /(tabs)
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>SkillSwap</Text>
          <Text style={styles.welcomeTitle}>Setup Your Profile</Text>
          <Text style={styles.welcomeSubtitle}>
            Share what you can teach, find what you want to learn, and earn Karma!
          </Text>
        </View>

        {/* Profile Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic Info</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="e.g. Neil Patel"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor={Colors.textTertiary}
          />

          <Text style={styles.label}>Username</Text>
          <View style={styles.handleContainer}>
            <Text style={styles.handlePrefix}>@</Text>
            <TextInput
              placeholder="neilp"
              value={handle}
              onChangeText={setHandle}
              style={styles.handleInput}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          <Text style={styles.label}>Bio</Text>
          <TextInput
            placeholder="Tell us about your background or what you like teaching..."
            value={bio}
            onChangeText={setBio}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        {/* Skills to Teach Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Skills I Can Teach</Text>
          <Text style={styles.cardSubtitle}>Select skills you are comfortable mentoring others in.</Text>
          <View style={styles.tagsGrid}>
            {SKILLS.map((skill) => {
              const isSelected = teachSkills.includes(skill.id);
              return (
                <SkillTag
                  key={`teach_${skill.id}`}
                  name={skill.name}
                  selected={isSelected}
                  onPress={() => toggleTeachSkill(skill.id)}
                />
              );
            })}
          </View>
        </View>

        {/* Skills to Learn Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Skills I Want to Learn</Text>
          <Text style={styles.cardSubtitle}>Select skills you want to explore or improve in.</Text>
          <View style={styles.tagsGrid}>
            {SKILLS.map((skill) => {
              const isSelected = learnSkills.includes(skill.id);
              return (
                <SkillTag
                  key={`learn_${skill.id}`}
                  name={skill.name}
                  selected={isSelected}
                  onPress={() => toggleLearnSkill(skill.id)}
                />
              );
            })}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>Join SkillSwap</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing['4xl'],
    paddingBottom: Spacing['5xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
    textAlign: 'center',
  },
  appName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  welcomeTitle: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.lg,
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
  cardSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  handleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingLeft: Spacing.md,
  },
  handlePrefix: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    fontWeight: FontWeight.bold,
  },
  handleInput: {
    flex: 1,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
    ...Shadow.md,
  },
  submitButtonText: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
