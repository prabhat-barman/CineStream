import React, {useState} from 'react';
import {
  FlatList,
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
import {
  audioStories,
  continueWatching,
  featuredMovie,
  podcasts,
  rows,
} from '../data/movies';
import {colors, radius, spacing} from '../theme/colors';
import {
  BellIcon,
  CastIcon,
  HeadphonesIcon,
  MicIcon,
  PlayIcon,
  PlusIcon,
  StarIcon,
} from '../components/icons';
import {MovieRow} from '../components/MovieRow';
import {SectionHeader} from '../components/SectionHeader';
import type {MainTabParamList} from '../navigation/MainTabs';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const HERO_TABS = ['Movies', 'TV Shows', 'Categories'] as const;
type HeroTab = (typeof HERO_TABS)[number];

export function HomeScreen({navigation}: Props) {
  const [activeTab, setActiveTab] = useState<HeroTab>('Movies');
  const openMovie = (id: string) =>
    navigation.navigate('MovieDetails', {id});
  const playMovie = (id: string) => navigation.navigate('Player', {id});

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
            colors={['rgba(10,10,10,0.75)', 'rgba(10,10,10,0)', colors.background]}
            locations={[0, 0.35, 1]}
            style={StyleSheet.absoluteFill}
          />

          <SafeAreaView edges={['top']} style={styles.heroTopBar}>
            <View style={styles.heroHeader}>
              <Text style={styles.brand}>CINESTREAM</Text>
              <View style={styles.headerActions}>
                <Pressable hitSlop={8}>
                  <CastIcon />
                </Pressable>
                <Pressable
                  hitSlop={8}
                  onPress={() => navigation.navigate('Notifications')}>
                  <BellIcon />
                  <View style={styles.bellDot} />
                </Pressable>
              </View>
            </View>

            <View style={styles.chipsRow}>
              {HERO_TABS.map(c => {
                const active = c === activeTab;
                return (
                  <Pressable
                    key={c}
                    style={styles.chip}
                    hitSlop={4}
                    onPress={() => setActiveTab(c)}>
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}>
                      {c}
                    </Text>
                    {active ? <View style={styles.chipUnderline} /> : null}
                  </Pressable>
                );
              })}
            </View>
          </SafeAreaView>

          <View style={styles.heroBody}>
            {featuredMovie.isNew ? (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW RELEASE</Text>
              </View>
            ) : null}
            <Text style={styles.heroTitle}>{featuredMovie.title}</Text>
            <View style={styles.metaRow}>
              <StarIcon />
              <Text style={styles.metaText}>
                {featuredMovie.rating.toFixed(1)}
              </Text>
              <View style={styles.dot} />
              <Text style={styles.metaText}>{featuredMovie.year}</Text>
              <View style={styles.dot} />
              <Text style={styles.metaText}>Sci-Fi</Text>
              <View style={styles.dot} />
              <Text style={styles.metaText}>2h 34m</Text>
            </View>
            <Text style={styles.heroTagline} numberOfLines={2}>
              In a galaxy consumed by shadow, one pilot must find the light that
              has never meant to be.
            </Text>

            <View style={styles.heroActions}>
              <Pressable
                onPress={() => playMovie(featuredMovie.id)}
                style={({pressed}) => [
                  styles.playBtn,
                  pressed && styles.pressed,
                ]}>
                <PlayIcon size={16} color={colors.brandText} />
                <Text style={styles.playText}>Play</Text>
              </Pressable>
              <Pressable
                onPress={() => openMovie(featuredMovie.id)}
                style={({pressed}) => [
                  styles.listBtn,
                  pressed && styles.pressed,
                ]}>
                <PlusIcon size={16} />
                <Text style={styles.listText}>My List</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.continueWrap}>
          <SectionHeader title="Continue Watching" action="See All" />
          <FlatList
            horizontal
            data={continueWatching}
            keyExtractor={c => c.id}
            contentContainerStyle={styles.hlist}
            ItemSeparatorComponent={() => (
              <View style={{width: spacing.sm + 2}} />
            )}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <Pressable
                onPress={() => playMovie(item.movie.id)}
                style={styles.continueCard}>
                <Image
                  source={{uri: item.movie.backdrop}}
                  style={styles.continueImg}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.85)']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.continuePlay}>
                  <PlayIcon size={16} color={colors.background} />
                </View>
                <View style={styles.continueBody}>
                  <Text style={styles.continueTitle} numberOfLines={1}>
                    {item.movie.title}
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {width: `${item.progress * 100}%`},
                      ]}
                    />
                  </View>
                </View>
              </Pressable>
            )}
          />
        </View>

        {rows.map(row => (
          <MovieRow
            key={row.id}
            title={row.title}
            movies={row.movies}
            onPressMovie={m => openMovie(m.id)}
          />
        ))}

        <SectionHeader title="Featured Podcasts" action="See All" />
        <FlatList
          horizontal
          data={podcasts}
          keyExtractor={p => p.id}
          contentContainerStyle={styles.hlist}
          ItemSeparatorComponent={() => <View style={{width: spacing.sm + 2}} />}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <Pressable style={styles.podcastCard}>
              <Image
                source={{uri: item.cover}}
                style={styles.podcastImg}
                resizeMode="cover"
              />
              <View style={styles.podcastBody}>
                <View style={styles.podcastRow}>
                  <MicIcon size={12} color={colors.textAccent} />
                  <Text style={styles.podcastCat}>{item.category}</Text>
                </View>
                <Text style={styles.podcastTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.podcastAuthor} numberOfLines={1}>
                  {item.author}
                </Text>
              </View>
            </Pressable>
          )}
        />

        <View style={styles.audioSection}>
          <SectionHeader title="Audio Stories" action="Explore" />
          {audioStories.map(a => (
            <Pressable key={a.id} style={styles.audioCard}>
              <Image source={{uri: a.cover}} style={styles.audioImg} />
              <View style={styles.audioBody}>
                <View style={styles.audioTop}>
                  <HeadphonesIcon size={14} color={colors.textAccent} />
                  <Text style={styles.audioBadge}>
                    {a.durationMin} MIN
                  </Text>
                </View>
                <Text style={styles.audioTitle}>{a.title}</Text>
                <Text style={styles.audioDesc} numberOfLines={2}>
                  {a.description}
                </Text>
              </View>
              <Pressable style={styles.audioPlay} hitSlop={8}>
                <PlayIcon size={16} color={colors.background} />
              </Pressable>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.background},
  scroll: {paddingBottom: spacing.xxl + 40},
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
  heroTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  heroHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
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
    alignItems: 'center',
    gap: spacing.md,
  },
  bellDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand,
    borderWidth: 1,
    borderColor: colors.background,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    alignItems: 'center',
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  chipUnderline: {
    marginTop: 4,
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.brand,
  },
  heroBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  newBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: colors.brand,
    marginBottom: spacing.sm,
  },
  newBadgeText: {
    color: colors.brandText,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: spacing.sm - 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
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
  heroTagline: {
    color: colors.textPrimary,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
    marginBottom: spacing.md,
    maxWidth: 340,
  },
  heroActions: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
  },
  playBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  playText: {
    color: colors.brandText,
    fontSize: 14,
    fontWeight: '700',
  },
  listBtn: {
    flex: 1,
    height: 44,
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
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {opacity: 0.85, transform: [{scale: 0.98}]},
  continueWrap: {marginTop: spacing.md, marginBottom: spacing.md},
  hlist: {paddingHorizontal: spacing.md},
  continueCard: {
    width: 180,
    height: 108,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  continueImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  continuePlay: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff7f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBody: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
  },
  continueTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    backgroundColor: colors.brand,
    borderRadius: 2,
  },
  podcastCard: {
    width: 160,
    borderRadius: radius.md,
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  podcastImg: {
    width: '100%',
    height: 110,
    backgroundColor: colors.surface,
  },
  podcastBody: {padding: 10},
  podcastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  podcastCat: {
    color: colors.textAccent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  podcastTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  podcastAuthor: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  audioSection: {marginTop: spacing.lg},
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm + 2,
    padding: 10,
    borderRadius: radius.md,
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  audioImg: {
    width: 60,
    height: 60,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  audioBody: {flex: 1, marginLeft: spacing.md},
  audioTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  audioBadge: {
    color: colors.textAccent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  audioTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  audioDesc: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  audioPlay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff7f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
