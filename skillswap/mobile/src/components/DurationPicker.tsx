import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/theme';
import { calculateKarmaFromDuration } from '@/lib/karma';
import type { SessionDuration } from '@/types';

interface DurationPickerProps {
  value: SessionDuration;
  onChange: (value: SessionDuration) => void;
  style?: ViewStyle;
}

export function DurationPicker({ value, onChange, style }: DurationPickerProps) {
  const options: SessionDuration[] = [30, 45, 60];

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Select Duration</Text>
      <View style={styles.optionsRow}>
        {options.map((opt) => {
          const isSelected = value === opt;
          const karmaValue = calculateKarmaFromDuration(opt);

          const optionStyle = [
            styles.option,
            isSelected && styles.optionSelected,
          ];

          const timeTextStyle = [
            styles.timeText,
            isSelected && styles.timeTextSelected,
          ];

          const karmaTextStyle = [
            styles.karmaText,
            isSelected && styles.karmaTextSelected,
          ];

          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onChange(opt)}
              style={optionStyle}
              activeOpacity={0.8}
            >
              {isSelected && (
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                </View>
              )}
              <Text style={timeTextStyle}>{opt} min</Text>
              <View style={[styles.karmaBadge, isSelected && styles.karmaBadgeSelected]}>
                <Text style={karmaTextStyle}>{karmaValue} Karma</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginHorizontal: 4,
    position: 'relative',
    ...Shadow.sm,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  checkIcon: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
  },
  timeText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  timeTextSelected: {
    color: Colors.primary,
  },
  karmaBadge: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    marginTop: Spacing.xs,
  },
  karmaBadgeSelected: {
    backgroundColor: Colors.primary + '15',
  },
  karmaText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  karmaTextSelected: {
    color: Colors.primary,
  },
});
