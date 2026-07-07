import React, {useMemo} from 'react';
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
import {getMovie, movies} from '../data/movies';
import {colors, radius, spacing} from '../theme/colors';
import {
  ChevronLeftIcon,
  DownloadIcon,
  PlayIcon,
  PlusIcon,
  ShareIcon,
  StarIcon,
} from '../components/icons';
import {MovieRow} from '../components/MovieRow';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetails'>;

export function MovieDetailsScreen({navigation, route}: Props) {
  const movie = getMovie(route.params.id);

  const moreLikeThis = useMemo(() => {
    if (!movie) return [];
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

  const runtime = `${Math.floor(movie.runtimeMin / 60)}h ${movie.runtimeMin % 60}m`;

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{uri: movie.backdrop}} style={styles.heroImg} resizeMode="cover" />
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
            <Pressable style={styles.iconBtn} hitSlop={8}>
              <ShareIcon size={22} />
            </Pressable>
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{movie.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.matchPill}>
              <Text style={styles.matchText}>{movie.match}% Match</Text>
            </View>
            <Text style={styles.metaText}>{movie.year}</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{movie.maturity}</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{runtime}</Text>
          </View>

          <View style={styles.ratingRow}>
            <StarIcon size={16} />
            <Text style={styles.ratingText}>{movie.rating.toFixed(1)}</Text>
            <Text style={styles.ratingMuted}>· IMDb</Text>
          </View>

          <Pressable style={({pressed}) => [styles.playBtn, pressed && styles.pressed]}>
            <PlayIcon size={20} color={colors.background} />
            <Text style={styles.playText}>Play</Text>
          </Pressable>

          <Pressable style={({pressed}) => [styles.downloadBtn, pressed && styles.pressed]}>
            <DownloadIcon size={20} />
            <Text style={styles.downloadText}>Download</Text>
          </Pressable>

          <Text style={styles.synopsis}>{movie.synopsis}</Text>

          <View style={styles.credits}>
            <Text style={styles.creditsLabel}>Director: <Text style={styles.creditsValue}>{movie.director}</Text></Text>
            <Text style={styles.creditsLabel}>Cast: <Text style={styles.creditsValue}>{movie.cast.join(', ')}</Text></Text>
            <Text style={styles.creditsLabel}>Genres: <Text style={styles.creditsValue}>{movie.genres.join(', ')}</Text></Text>
          </View>

          <View style={styles.actions}>
            <ActionButton icon={<PlusIcon />} label="My List" />
            <ActionButton icon={<StarIcon size={20} color={colors.textPrimary} />} label="Rate" />
            <ActionButton icon={<ShareIcon size={20} />} label="Share" />
          </View>
        </View>

        {moreLikeThis.length > 0 ? (
          <View style={styles.more}>
            <MovieRow
              title="More Like This"
              movies={moreLikeThis}
              onPressMovie={m => navigation.push('MovieDetails', {id: m.id})}
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function ActionButton({icon, label}: {icon: React.ReactNode; label: string}) {
  return (
    <Pressable style={styles.actionBtn} hitSlop={8}>
      {icon}
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.background},
  emptyRoot: {flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background},
  emptyText: {color: colors.textPrimary},
  hero: {
    height: 320,
    width: '100%',
  },
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
    marginTop: -60,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: spacing.sm + 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  matchPill: {
    backgroundColor: 'rgba(70, 200, 90, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  matchText: {
    color: '#5ee089',
    fontSize: 12,
    fontWeight: '700',
  },
  metaText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    opacity: 0.6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: spacing.md,
  },
  ratingText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  ratingMuted: {
    color: colors.textMuted,
    fontSize: 12,
  },
  playBtn: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: '#fff7f6',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.sm + 2,
  },
  playText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  downloadBtn: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: colors.glassBorder,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  downloadText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {opacity: 0.85, transform: [{scale: 0.99}]},
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
  creditsLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  creditsValue: {
    color: colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.lg,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 6,
  },
  actionLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  more: {
    marginTop: spacing.md,
  },
});
