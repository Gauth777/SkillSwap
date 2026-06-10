import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/theme';

interface KarmaBadgeProps {
  amount: number;
  showSign?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function KarmaBadge({ amount, showSign = false, size = 'md', style }: KarmaBadgeProps) {
  const isPositive = amount > 0;
  const isNegative = amount < 0;

  // Set colors based on state
  let bgColor: string = Colors.karmaZero + '15'; // 15% opacity fallback
  let textColor: string = Colors.karmaZero;
  let iconName: keyof typeof Ionicons.glyphMap = 'flash-outline';

  if (isPositive) {
    bgColor = Colors.successBg;
    textColor = Colors.success;
    iconName = 'flash';
  } else if (isNegative) {
    bgColor = Colors.errorBg;
    textColor = Colors.error;
    iconName = 'flash-outline';
  }

  // Formatting amount
  let displayText = amount.toString();
  if (showSign && isPositive) {
    displayText = `+${amount}`;
  }

  // Size styling
  const sizeStyles = {
    sm: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: Radius.sm,
      fontSize: FontSize.xs,
      iconSize: 12,
    },
    md: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.md,
      fontSize: FontSize.sm,
      iconSize: 15,
    },
    lg: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderRadius: Radius.lg,
      fontSize: FontSize.lg,
      iconSize: 20,
    },
  }[size];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }, sizeStyles, style]}>
      <Ionicons name={iconName} size={sizeStyles.iconSize} color={textColor} style={styles.icon} />
      <Text style={[styles.text, { color: textColor, fontSize: sizeStyles.fontSize }]}>
        {displayText} Karma
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: FontWeight.bold,
  },
});
