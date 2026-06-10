import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { Colors, FontWeight } from '@/theme';

interface UserAvatarProps {
  name: string;
  size?: number;
  style?: ViewStyle;
}

// Simple deterministic palette for avatars
const AVATAR_PALETTES = [
  { bg: '#EEF2FF', text: '#4F46E5' }, // Indigo
  { bg: '#ECFDF5', text: '#059669' }, // Emerald
  { bg: '#FFF1F2', text: '#E11D48' }, // Rose
  { bg: '#FFFBEB', text: '#D97706' }, // Amber
  { bg: '#F0F9FF', text: '#0284C7' }, // Sky
  { bg: '#FDF2F8', text: '#DB2777' }, // Pink
  { bg: '#FAF5FF', text: '#9333EA' }, // Purple
];

export function UserAvatar({ name, size = 48, style }: UserAvatarProps) {
  // Derive initials
  const initials = name
    ? name
        .split(' ')
        .map((n) => n.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  // Deterministic palette pick
  let palette = AVATAR_PALETTES[0];
  if (name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_PALETTES.length;
    palette = AVATAR_PALETTES[index];
  }

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: palette.bg,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const textStyle: TextStyle = {
    color: palette.text,
    fontSize: size * 0.4,
    fontWeight: FontWeight.bold,
  };

  return (
    <View style={[containerStyle, style]}>
      <Text style={textStyle}>{initials}</Text>
    </View>
  );
}
