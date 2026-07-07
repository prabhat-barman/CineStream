import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import {colors, radius} from '../theme/colors';
import {EyeIcon} from './icons';

type Props = TextInputProps & {
  icon?: React.ReactNode;
  secure?: boolean;
};

export function AuthInput({icon, secure, style, ...rest}: Props) {
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={styles.wrap}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <TextInput
        placeholderTextColor={colors.placeholder}
        style={[styles.input, icon ? styles.inputWithIcon : null, style]}
        secureTextEntry={hidden}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />
      {secure ? (
        <Pressable style={styles.trailing} onPress={() => setHidden(v => !v)} hitSlop={8}>
          <EyeIcon size={18} color={hidden ? colors.placeholder : colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    height: 52,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  input: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 24,
    paddingVertical: 17,
    width: '100%',
  },
  inputWithIcon: {
    paddingLeft: 48,
    paddingRight: 44,
  },
  trailing: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
