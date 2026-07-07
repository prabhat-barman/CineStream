import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {colors} from '../theme/colors';

type Props = {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};

export function Checkbox({label, checked, onChange}: Props) {
  return (
    <Pressable style={styles.row} onPress={() => onChange(!checked)} hitSlop={8}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? (
          <Svg width={12} height={12} viewBox="0 0 12 12">
            <Path
              d="M2 6.5l2.5 2.5L10 3"
              stroke={colors.brandText}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        ) : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  box: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  boxChecked: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
