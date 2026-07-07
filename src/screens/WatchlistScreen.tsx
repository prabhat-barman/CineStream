import React, {useMemo, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {downloadedMovies, savedTitles} from '../data/movies';
import {colors, radius, spacing} from '../theme/colors';
import {
  DownloadIcon,
  EditIcon,
  PlayIcon,
} from '../components/icons';
import type {MainTabParamList} from '../navigation/MainTabs';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Watchlist'>,
  NativeStackScreenProps<RootStackParamList>
>;

type TabKey = 'watchlist' | 'downloads';

export function WatchlistScreen({navigation}: Props) {
  const [tab, setTab] = useState<TabKey>('watchlist');

  const data = useMemo(
    () => (tab === 'watchlist' ? savedTitles : downloadedMovies),
    [tab],
  );

  const openMovie = (id: string) =>
    navigation.navigate('MovieDetails', {id});
  const playMovie = (id: string) => navigation.navigate('Player', {id});

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.brand}>CINESTREAM</Text>
        <Pressable hitSlop={8} style={styles.editBtn}>
          <EditIcon size={16} color={colors.textMuted} />
          <Text style={styles.editText}>EDIT</Text>
        </Pressable>
      </View>

      <View style={styles.tabs}>
        <Pressable
          onPress={() => setTab('watchlist')}
          style={[styles.tab, tab === 'watchlist' && styles.tabActive]}>
          <Text
            style={[
              styles.tabText,
              tab === 'watchlist' && styles.tabTextActive,
            ]}>
            WATCHLIST
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab('downloads')}
          style={[styles.tab, tab === 'downloads' && styles.tabActive]}>
          <Text
            style={[
              styles.tabText,
              tab === 'downloads' && styles.tabTextActive,
            ]}>
            DOWNLOADS
          </Text>
        </Pressable>
      </View>

      {tab === 'watchlist' ? (
        <>
          <Text style={styles.sectionLabel}>Saved Titles</Text>
          <FlatList
            data={data}
            keyExtractor={m => m.id}
            renderItem={({item}) => (
              <Pressable
                onPress={() => openMovie(item.id)}
                style={styles.gridItem}>
                <Image
                  source={{uri: item.poster}}
                  style={styles.gridPoster}
                  resizeMode="cover"
                />
                {item.isNew ? (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                ) : null}
              </Pressable>
            )}
            numColumns={3}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <>
          <Text style={styles.sectionLabel}>Downloaded</Text>
          <View style={styles.downloadList}>
            {data.map(m => {
              const runtime = `${Math.floor(m.runtimeMin / 60)}h ${
                m.runtimeMin % 60
              }m`;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => openMovie(m.id)}
                  style={styles.dlRow}>
                  <Image
                    source={{uri: m.poster}}
                    style={styles.dlThumb}
                    resizeMode="cover"
                  />
                  <View style={styles.dlBody}>
                    <Text style={styles.dlTitle} numberOfLines={1}>
                      {m.title}
                    </Text>
                    <Text style={styles.dlMeta}>
                      {m.year} · {runtime}
                    </Text>
                    <View style={styles.dlSizeRow}>
                      <DownloadIcon size={12} color="#5ee089" />
                      <Text style={styles.dlSize}>1.2 GB · Downloaded</Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => playMovie(m.id)}
                    style={styles.dlPlay}
                    hitSlop={8}>
                    <PlayIcon size={16} color={colors.background} />
                  </Pressable>
                </Pressable>
              );
            })}
            <Text style={styles.expireHint}>Downloads expire in 30 days.</Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.background},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  brand: {
    color: colors.brand,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  editText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  tab: {
    paddingHorizontal: spacing.md,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  tabActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  tabTextActive: {color: colors.brandText},
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginLeft: spacing.md,
    marginBottom: spacing.sm + 2,
    textTransform: 'uppercase',
  },
  grid: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl + 40,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.sm + 2,
  },
  gridItem: {
    width: '32%',
    aspectRatio: 2 / 3,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  gridPoster: {
    width: '100%',
    height: '100%',
  },
  newBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: colors.brand,
  },
  newBadgeText: {
    color: colors.brandText,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  downloadList: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl + 40,
    gap: spacing.sm + 2,
  },
  dlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: radius.md,
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  dlThumb: {
    width: 60,
    height: 88,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  dlBody: {flex: 1, marginLeft: spacing.md},
  dlTitle: {color: colors.textPrimary, fontSize: 15, fontWeight: '700'},
  dlMeta: {color: colors.textMuted, fontSize: 12, marginTop: 4},
  dlSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  dlSize: {color: '#5ee089', fontSize: 11, fontWeight: '600'},
  dlPlay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff7f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expireHint: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
