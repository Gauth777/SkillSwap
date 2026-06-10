import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/theme';

interface SkillTagProps {
  name: string;
  selected?: boolean;
  onPress?: () => void;
  onDelete?: () => void;
  style?: ViewStyle;
}

export function SkillTag({ name, selected = false, onPress, onDelete, style }: SkillTagProps) {
  const isClickable = !!onPress;

  const tagStyle = [
    styles.tag,
    selected && styles.tagSelected,
    onDelete && styles.tagWithDelete,
    style,
  ];

  const textStyle = [
    styles.text,
    selected && styles.textSelected,
  ];

  const content = (
    <View style={styles.content}>
      <Text style={textStyle}>{name}</Text>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton} hitSlop={8}>
          <Ionicons name="close-circle" size={16} color={selected ? Colors.textInverse : Colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (isClickable) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={tagStyle}>
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={tagStyle}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tagSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tagWithDelete: {
    paddingRight: Spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  textSelected: {
    color: Colors.textInverse,
    fontWeight: FontWeight.bold,
  },
  deleteButton: {
    marginLeft: 6,
  },
});
