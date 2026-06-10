import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/store/useAppStore';
import { CATEGORIES, SKILLS } from '@/data/mock';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/theme';
import { DurationPicker } from '@/components/DurationPicker';
import { calculateKarmaFromDuration } from '@/lib/karma';
import type { PostType, SkillCategory, SessionDuration } from '@/types';

export default function CreatePost() {
  const router = useRouter();
  const addPost = useAppStore((state) => state.addPost);

  // Form State
  const [type, setType] = useState<PostType>('teach');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Programming');
  const [skillName, setSkillName] = useState('');
  const [duration, setDuration] = useState<SessionDuration>(45);

  const karmaCostOrReward = calculateKarmaFromDuration(duration);

  const handlePost = () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter a title for your post.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Required Field', 'Please enter a brief description.');
      return;
    }
    if (!skillName.trim()) {
      Alert.alert('Required Field', 'Please enter the specific skill.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    addPost({
      type,
      title: title.trim(),
      description: description.trim(),
      category,
      skillName: skillName.trim(),
      duration,
    });

    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton} hitSlop={12}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Swap Request</Text>
        <View style={{ width: 24 }} /> {/* alignment balance */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Toggle Offer / Seek */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, type === 'teach' && styles.toggleBtnActiveTeach]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setType('teach');
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="school-outline"
              size={16}
              color={type === 'teach' ? Colors.textInverse : Colors.textSecondary}
              style={styles.toggleIcon}
            />
            <Text style={[styles.toggleLabel, type === 'teach' && styles.toggleLabelActive]}>
              I want to teach
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, type === 'learn' && styles.toggleBtnActiveLearn]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setType('learn');
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="book-outline"
              size={16}
              color={type === 'learn' ? Colors.textInverse : Colors.textSecondary}
              style={styles.toggleIcon}
            />
            <Text style={[styles.toggleLabel, type === 'learn' && styles.toggleLabelActive]}>
              I want to learn
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.card}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            placeholder="e.g. Master React Native layouts"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            maxLength={60}
            placeholderTextColor={Colors.textTertiary}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="What will you cover? E.g. Flexbox, safe area view, and sizing structures."
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            placeholderTextColor={Colors.textTertiary}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setCategory(cat);
                    }}
                    style={[styles.catChip, isSelected && styles.catChipActive]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <Text style={styles.label}>Specific Skill</Text>
          <TextInput
            placeholder="e.g. React, Python, UI Design"
            value={skillName}
            onChangeText={setSkillName}
            style={styles.input}
            maxLength={30}
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        {/* Duration picker */}
        <View style={styles.card}>
          <DurationPicker value={duration} onChange={setDuration} />
        </View>

        {/* Live Karma Preview Card */}
        <View style={[styles.karmaPreviewCard, type === 'teach' ? styles.previewTeach : styles.previewLearn]}>
          <View style={styles.previewIconCircle}>
            <Ionicons name="flash" size={24} color={type === 'teach' ? Colors.success : Colors.error} />
          </View>
          <View style={styles.previewTextContainer}>
            <Text style={styles.previewLabel}>Estimated Karma Flow</Text>
            <Text style={[styles.previewValue, { color: type === 'teach' ? Colors.success : Colors.error }]}>
              {type === 'teach' ? `+${karmaCostOrReward}` : `-${karmaCostOrReward}`} Karma
            </Text>
            <Text style={styles.previewExplain}>
              {type === 'teach'
                ? `You will earn ${karmaCostOrReward} Karma upon completing this session.`
                : `You will spend ${karmaCostOrReward} Karma when this session is completed.`}
            </Text>
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.postButton} onPress={handlePost} activeOpacity={0.8}>
          <Text style={styles.postButtonText}>Post Swap Request</Text>
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
  closeButton: {
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
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSecondary,
    padding: 4,
    borderRadius: Radius.md,
    marginBottom: Spacing.lg,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
  },
  toggleBtnActiveTeach: {
    backgroundColor: Colors.primary,
  },
  toggleBtnActiveLearn: {
    backgroundColor: Colors.error,
  },
  toggleIcon: {
    marginRight: 6,
  },
  toggleLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
  },
  toggleLabelActive: {
    color: Colors.textInverse,
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
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
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
    marginBottom: Spacing.sm,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryRow: {
    marginBottom: Spacing.sm,
  },
  categoryScroll: {
    paddingVertical: 4,
  },
  catChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.xs,
  },
  catChipActive: {
    backgroundColor: Colors.primaryBg,
    borderColor: Colors.primary,
  },
  catChipText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  catChipTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  karmaPreviewCard: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    ...Shadow.sm,
  },
  previewTeach: {
    backgroundColor: Colors.successBg,
    borderColor: Colors.success + '30',
  },
  previewLearn: {
    backgroundColor: Colors.errorBg,
    borderColor: Colors.error + '30',
  },
  previewIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  previewTextContainer: {
    flex: 1,
  },
  previewLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginVertical: 2,
  },
  previewExplain: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  postButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    alignItems: 'center',
    ...Shadow.md,
  },
  postButtonText: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
