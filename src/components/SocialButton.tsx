import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, radius} from '../theme/colors';

type Props = {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function SocialButton({label, icon, onPress, loading, disabled}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      android_ripple={isDisabled ? undefined : {color: '#ffffff10'}}
      style={({pressed}) => [
        styles.btn,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} />
      ) : (
        <>
          <View style={styles.icon}>{icon}</View>
          <Text style={styles.label}>{label}</Text>
        </>
      )}
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
  disabled: {
    opacity: 0.5,
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
