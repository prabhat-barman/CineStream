import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle} from 'react-native';
import {colors, radius} from '../theme/colors';

type Props = {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function PrimaryButton({label, onPress, loading, disabled, style}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{color: '#00000030'}}
      style={({pressed}) => [
        styles.btn,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.brandText} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: {width: 0, height: 10},
    elevation: 6,
  },
  pressed: {
    opacity: 0.9,
    transform: [{scale: 0.99}],
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    color: colors.brandText,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
});
