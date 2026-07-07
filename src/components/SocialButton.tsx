import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, radius} from '../theme/colors';

type Props = {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
};

export function SocialButton({label, icon, onPress}: Props) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{color: '#ffffff10'}}
      style={({pressed}) => [styles.btn, pressed && styles.pressed]}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    gap: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    marginRight: 4,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
});
