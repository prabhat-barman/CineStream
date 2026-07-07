import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {continueWatching} from '../data/movies';
import {colors, radius, spacing} from '../theme/colors';
import {DownloadIcon, PlayIcon} from '../components/icons';
import type {MainTabParamList} from '../navigation/MainTabs';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Downloads'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function DownloadsScreen({navigation}: Props) {
  const downloads = continueWatching.slice(0, 3);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Downloads</Text>
        <Text style={styles.subtitle}>Watch offline. Freely.</Text>
      </View>

      {downloads.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <DownloadIcon size={40} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No downloads yet</Text>
          <Text style={styles.emptyBody}>
            Tap the download icon on any title to watch offline.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {downloads.map(m => {
            const runtime = `${Math.floor(m.runtimeMin / 60)}h ${m.runtimeMin % 60}m`;
            return (
              <Pressable
                key={m.id}
                onPress={() => navigation.navigate('MovieDetails', {id: m.id})}
                style={({pressed}) => [styles.row, pressed && styles.pressed]}>
                <Image source={{uri: m.poster}} style={styles.thumb} resizeMode="cover" />
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {m.title}
                  </Text>
                  <Text style={styles.rowMeta}>
                    {m.year} · {runtime}
                  </Text>
                  <Text style={styles.rowSize}>
                    1.2 GB · Downloaded
                  </Text>
                </View>
                <Pressable style={styles.playBtn} hitSlop={8}>
                  <PlayIcon size={16} color={colors.background} />
                </Pressable>
              </Pressable>
            );
          })}

          <View style={styles.hint}>
            <Text style={styles.hintText}>Downloads expire in 30 days.</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.background},
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyBody: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  list: {
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: radius.md,
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: spacing.sm + 2,
  },
  pressed: {
    opacity: 0.85,
  },
  thumb: {
    width: 70,
    height: 100,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  rowBody: {
    flex: 1,
    marginLeft: spacing.md,
  },
  rowTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  rowMeta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  rowSize: {
    color: '#5ee089',
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff7f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  hintText: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
