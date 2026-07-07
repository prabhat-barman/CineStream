import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '../theme/colors';

type Tab<T extends string> = {
  key: T;
  label: string;
};

type Props<T extends string> = {
  tabs: Tab<T>[];
  active: T;
  onChange: (key: T) => void;
  variant?: 'pill' | 'underline';
};

export function SegmentedTabs<T extends string>({
  tabs,
  active,
  onChange,
  variant = 'pill',
}: Props<T>) {
  if (variant === 'underline') {
    return (
      <View style={styles.underlineWrap}>
        {tabs.map(t => {
          const on = t.key === active;
          return (
            <Pressable
              key={t.key}
              onPress={() => onChange(t.key)}
              style={styles.underlineTab}
              hitSlop={4}>
              <Text style={[styles.underlineText, on && styles.underlineTextActive]}>
                {t.label}
              </Text>
              {on ? <View style={styles.underlineBar} /> : null}
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.pillWrap}>
      {tabs.map(t => {
        const on = t.key === active;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            style={[styles.pillTab, on && styles.pillTabActive]}
            hitSlop={4}>
            <Text style={[styles.pillText, on && styles.pillTextActive]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pillWrap: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pillTab: {
    paddingHorizontal: spacing.md,
    height: 34,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassBg,
  },
  pillTabActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  pillText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: colors.brandText,
  },
  underlineWrap: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  underlineTab: {
    paddingBottom: 10,
    alignItems: 'center',
    minWidth: 60,
  },
  underlineText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  underlineTextActive: {
    color: colors.textPrimary,
  },
  underlineBar: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    left: 0,
    right: 0,
    backgroundColor: colors.brand,
    borderRadius: 1,
  },
});

export {SegmentedTabs as Tabs};
