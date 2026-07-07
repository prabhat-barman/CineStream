import React, {useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {episodes, getMovie, movies} from '../data/movies';
import {colors, radius, spacing} from '../theme/colors';
import {
  BookmarkIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  DownloadIcon,
  HeartIcon,
  PlayIcon,
  PlusIcon,
  ShareIcon,
  StarIcon,
} from '../components/icons';
import {SegmentedTabs} from '../components/SegmentedTabs';
import {MovieCard} from '../components/MovieCard';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetails'>;

type TabKey = 'episodes' | 'related' | 'cast';

export function MovieDetailsScreen({navigation, route}: Props) {
  const movie = getMovie(route.params.id);
  const initialTab: TabKey =
    typeof movie?.seasons === 'number' ? 'episodes' : 'related';
  const [tab, setTab] = useState<TabKey>(initialTab);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);

  const related = useMemo(() => {
    if (!movie) {
      return [];
    }
    const g = new Set(movie.genres);
    return movies
      .filter(m => m.id !== movie.id && m.genres.some(x => g.has(x)))
      .slice(0, 6);
  }, [movie]);

  if (!movie) {
    return (
      <View style={styles.emptyRoot}>
        <Text style={styles.emptyText}>Movie not found</Text>
      </View>
    );
  }

  const isSeries = typeof movie.seasons === 'number';
  const tabs = isSeries
    ? [
        {key: 'episodes' as const, label: 'Episodes'},
        {key: 'related' as const, label: 'Related Content'},
        {key: 'cast' as const, label: 'Cast'},
      ]
    : [
        {key: 'related' as const, label: 'Related'},
        {key: 'cast' as const, label: 'Cast'},
      ];

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            source={{uri: movie.backdrop}}
            style={styles.heroImg}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(10,10,10,0.5)', 'rgba(10,10,10,0)', colors.background]}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
          />

          <SafeAreaView edges={['top']} style={styles.heroHeader}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.iconBtn}
              hitSlop={8}>
              <ChevronLeftIcon />
            </Pressable>
            <View style={styles.heroRightRow}>
              <Pressable style={styles.iconBtn} hitSlop={8}>
                <ShareIcon size={20} />
              </Pressable>
              <Pressable
                style={styles.iconBtn}
                hitSlop={8}
                onPress={() => setLiked(v => !v)}>
                <HeartIcon size={20} color={liked ? colors.brand : colors.textPrimary} filled={liked} />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          {movie.isNew ? (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW SEASON</Text>
            </View>
          ) : null}
          <Text style={styles.title}>{movie.title}</Text>

          <View style={styles.metaRow}>
            <StarIcon />
            <Text style={styles.metaText}>{movie.rating.toFixed(1)}</Text>
            <Text style={styles.metaMatch}>{movie.match}% MATCH</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{movie.year}</Text>
            <View style={styles.dot} />
            {isSeries ? (
              <Text style={styles.metaText}>{movie.seasons} Seasons</Text>
            ) : (
              <Text style={styles.metaText}>
                {Math.floor(movie.runtimeMin / 60)}h {movie.runtimeMin % 60}m
              </Text>
            )}
            <View style={styles.dot} />
            <Text style={styles.metaText}>{movie.maturity}</Text>
          </View>

          <View style={styles.heroActions}>
            <Pressable
              onPress={() => navigation.navigate('Player', {id: movie.id})}
              style={({pressed}) => [styles.playBtn, pressed && styles.pressed]}>
              <PlayIcon size={16} color={colors.brandText} />
              <Text style={styles.playText}>Play {isSeries ? 'S2:E1' : 'Now'}</Text>
            </Pressable>
            <Pressable
              onPress={() => setSaved(v => !v)}
              style={({pressed}) => [styles.listBtn, pressed && styles.pressed]}>
              {saved ? (
                <BookmarkIcon size={16} color={colors.textPrimary} filled />
              ) : (
                <PlusIcon size={16} />
              )}
              <Text style={styles.listText}>
                {saved ? 'In Watchlist' : '+ Watchlist'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.trailerRow}>
            <Pressable style={styles.trailerBtn}>
              <PlayIcon size={12} color={colors.brandText} filled={false} />
              <Text style={styles.trailerText}>Trailer</Text>
            </Pressable>
            <Pressable style={styles.trailerBtn}>
              <DownloadIcon size={14} />
              <Text style={styles.trailerText}>Download</Text>
            </Pressable>
          </View>

          <Text style={styles.synopsis}>{movie.synopsis}</Text>

          <View style={styles.credits}>
            <Text style={styles.creditsLabel}>
              Director: <Text style={styles.creditsValue}>{movie.director}</Text>
            </Text>
            <Text style={styles.creditsLabel}>
              Cast: <Text style={styles.creditsValue}>{movie.cast.join(', ')}</Text>
            </Text>
            <Text style={styles.creditsLabel}>
              Genres: <Text style={styles.creditsValue}>{movie.genres.join(', ')}</Text>
            </Text>
          </View>

          <View style={styles.tabWrap}>
            <SegmentedTabs
              tabs={tabs}
              active={tab as any}
              onChange={key => setTab(key as TabKey)}
              variant="underline"
            />
          </View>
        </View>

        {tab === 'episodes' && isSeries ? (
          <View style={styles.section}>
            <View style={styles.seasonRow}>
              <Text style={styles.seasonLabel}>Season 2</Text>
              <Text style={styles.seasonCount}>{episodes.length} Episodes</Text>
              <ChevronDownIcon size={18} color={colors.textMuted} />
            </View>
            {episodes.map(e => (
              <Pressable
                key={e.id}
                onPress={() => navigation.navigate('Player', {id: movie.id})}
                style={styles.epRow}>
                <View style={styles.epThumbWrap}>
                  <Image source={{uri: e.thumb}} style={styles.epThumb} />
                  <View style={styles.epPlay}>
                    <PlayIcon size={14} color={colors.background} />
                  </View>
                </View>
                <View style={styles.epBody}>
                  <Text style={styles.epTitle}>
                    {e.number}. {e.title}
                  </Text>
                  <Text style={styles.epSynopsis} numberOfLines={2}>
                    {e.synopsis}
                  </Text>
                  <Text style={styles.epMeta}>{e.runtimeMin} min</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : null}

        {tab === 'related' ? (
          <View style={styles.section}>
            <View style={styles.relatedGrid}>
              {related.map(m => (
                <View key={m.id} style={styles.relatedItem}>
                  <MovieCard
                    movie={m}
                    width={100}
                    onPress={() => navigation.push('MovieDetails', {id: m.id})}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {tab === 'cast' ? (
          <View style={styles.section}>
            {movie.cast.map(c => (
              <View key={c} style={styles.castRow}>
                <View style={styles.castAvatar}>
                  <Text style={styles.castInitials}>
                    {c
                      .split(' ')
                      .map(s => s[0])
                      .slice(0, 2)
                      .join('')}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.castName}>{c}</Text>
                  <Text style={styles.castRole}>Cast Member</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.background},
  emptyRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  emptyText: {color: colors.textPrimary},
  hero: {height: 340, width: '100%'},
  heroImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  heroRightRow: {flexDirection: 'row', gap: spacing.sm + 2},
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: spacing.md,
    marginTop: -80,
  },
  newBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: colors.brand,
    marginBottom: 8,
  },
  newBadgeText: {
    color: colors.brandText,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  metaText: {color: colors.textMuted, fontSize: 12},
  metaMatch: {
    color: '#5ee089',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginLeft: 6,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    opacity: 0.6,
  },
  heroActions: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
    marginBottom: spacing.sm + 2,
  },
  playBtn: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  playText: {color: colors.brandText, fontSize: 14, fontWeight: '700'},
  listBtn: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: colors.glassBorder,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  listText: {color: colors.textPrimary, fontSize: 14, fontWeight: '600'},
  pressed: {opacity: 0.85, transform: [{scale: 0.99}]},
  trailerRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  trailerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 999,
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  trailerText: {color: colors.textPrimary, fontSize: 12, fontWeight: '600'},
  synopsis: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  credits: {
    gap: 6,
    marginBottom: spacing.lg,
  },
  creditsLabel: {color: colors.textMuted, fontSize: 12},
  creditsValue: {color: colors.textPrimary},
  tabWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.glassBorder,
    marginBottom: spacing.md,
  },
  section: {paddingHorizontal: spacing.md, paddingBottom: spacing.xxl},
  seasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  seasonLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  seasonCount: {color: colors.textMuted, fontSize: 12},
  epRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  epThumbWrap: {
    width: 130,
    height: 82,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  epThumb: {width: '100%', height: '100%'},
  epPlay: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -14,
    marginTop: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff7f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  epBody: {flex: 1},
  epTitle: {color: colors.textPrimary, fontSize: 13, fontWeight: '700'},
  epSynopsis: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  epMeta: {color: colors.textMuted, fontSize: 11, marginTop: 4, opacity: 0.8},
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm + 2,
  },
  relatedItem: {width: '31%'},
  castRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.glassBorder,
  },
  castAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  castInitials: {color: colors.textPrimary, fontWeight: '800', fontSize: 14},
  castName: {color: colors.textPrimary, fontSize: 14, fontWeight: '700'},
  castRole: {color: colors.textMuted, fontSize: 12, marginTop: 2},
});
