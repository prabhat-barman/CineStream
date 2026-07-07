import React from 'react';
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
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {featuredMovie, rows} from '../data/movies';
import {colors, radius, spacing} from '../theme/colors';
import {BellIcon, CastIcon, PlayIcon, PlusIcon, StarIcon} from '../components/icons';
import {MovieRow} from '../components/MovieRow';
import type {MainTabParamList} from '../navigation/MainTabs';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function HomeScreen({navigation}: Props) {
  const openMovie = (id: string) => navigation.navigate('MovieDetails', {id});

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Image
            source={{uri: featuredMovie.backdrop}}
            style={styles.heroImg}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(10,10,10,0.65)', 'rgba(10,10,10,0)', colors.background]}
            locations={[0, 0.35, 1]}
            style={StyleSheet.absoluteFill}
          />

          <SafeAreaView edges={['top']} style={styles.heroHeader}>
            <Text style={styles.brand}>CINESTREAM</Text>
            <View style={styles.headerActions}>
              <Pressable hitSlop={8}>
                <CastIcon />
              </Pressable>
              <Pressable hitSlop={8}>
                <BellIcon />
              </Pressable>
            </View>
          </SafeAreaView>

          <View style={styles.chipsRow}>
            {['Movies', 'TV Shows', 'Categories'].map(c => (
              <Pressable key={c} style={styles.chip} hitSlop={4}>
                <Text style={styles.chipText}>{c}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.heroBody}>
            <Text style={styles.heroTitle}>{featuredMovie.title}</Text>
            <View style={styles.metaRow}>
              <StarIcon />
              <Text style={styles.metaText}>{featuredMovie.rating.toFixed(1)}</Text>
              <View style={styles.dot} />
              <Text style={styles.metaText}>{featuredMovie.year}</Text>
              <View style={styles.dot} />
              <Text style={styles.metaText}>{featuredMovie.maturity}</Text>
              <View style={styles.dot} />
              <Text style={styles.metaText}>{featuredMovie.genres.slice(0, 2).join(' · ')}</Text>
            </View>

            <View style={styles.heroActions}>
              <Pressable
                onPress={() => openMovie(featuredMovie.id)}
                style={({pressed}) => [styles.playBtn, pressed && styles.pressed]}>
                <PlayIcon size={18} color={colors.background} />
                <Text style={styles.playText}>Play</Text>
              </Pressable>
              <Pressable
                onPress={() => openMovie(featuredMovie.id)}
                style={({pressed}) => [styles.listBtn, pressed && styles.pressed]}>
                <PlusIcon size={18} />
                <Text style={styles.listText}>My List</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.rowsWrap}>
          {rows.map(row => (
            <MovieRow
              key={row.id}
              title={row.title}
              movies={row.movies}
              onPressMovie={m => openMovie(m.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.background},
  scroll: {paddingBottom: spacing.xl},
  hero: {
    height: 560,
    width: '100%',
    justifyContent: 'flex-end',
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    color: colors.brand,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  chipsRow: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  chipText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  heroBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: 12,
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
  },
  playBtn: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: '#fff7f6',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  playText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
  listBtn: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: colors.glassBorder,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  listText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
    transform: [{scale: 0.98}],
  },
  rowsWrap: {
    marginTop: spacing.lg,
  },
});
