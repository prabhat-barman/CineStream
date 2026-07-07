import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '../theme/colors';

type Props = {
  title: string;
  action?: string;
  onActionPress?: () => void;
  compact?: boolean;
};

export function SectionHeader({title, action, onActionPress, compact}: Props) {
  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <Text style={styles.title}>{title}</Text>
      {action ? (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <Text style={styles.action}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  wrapCompact: {
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  action: {
    color: colors.textAccent,
    fontSize: 13,
    fontWeight: '600',
  },
});
