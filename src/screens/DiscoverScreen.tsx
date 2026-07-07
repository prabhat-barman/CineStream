import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  becauseYouWatched,
  discoverFeatured,
  forYou,
  recentSearches,
  searchCategories,
  trending,
} from '../data/movies';
import {colors, radius, spacing} from '../theme/colors';
import {
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  PlayIcon,
  SearchIcon,
  StarIcon,
} from '../components/icons';
import {SectionHeader} from '../components/SectionHeader';
import {MovieCard} from '../components/MovieCard';
import type {MainTabParamList} from '../navigation/MainTabs';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Discover'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function DiscoverScreen({navigation}: Props) {
  const [q, setQ] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchCategories[0]);

  const openMovie = (id: string) =>
    navigation.navigate('MovieDetails', {id});

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.headerRow}>
          <Text style={styles.brand}>CINESTREAM</Text>
        </View>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color={colors.textMuted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search movies, people..."
            placeholderTextColor={colors.placeholder}
            style={styles.input}
          />
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <SectionHeader title="Recent Searches" compact />
        <View style={styles.recentWrap}>
          {recentSearches.map(s => (
            <View key={s} style={styles.recentChip}>
              <ClockIcon size={14} color={colors.textMuted} />
              <Text style={styles.recentText}>{s}</Text>
              <Pressable hitSlop={6}>
                <CloseIcon size={14} color={colors.textMuted} />
              </Pressable>
            </View>
          ))}
          <Pressable style={styles.recentChipMore}>
            <Text style={styles.recentMoreText}>View All</Text>
          </Pressable>
        </View>

        <View style={styles.categoriesRow}>
          {searchCategories.map(c => {
            const on = c === activeCategory;
            return (
              <Pressable
                key={c}
                onPress={() => setActiveCategory(c)}
                style={[styles.category, on && styles.categoryOn]}>
                <Text
                  style={[styles.categoryText, on && styles.categoryTextOn]}>
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <SectionHeader title="Trending Now" action="See All" compact />
        <FlatList
          horizontal
          data={trending}
          keyExtractor={m => m.id}
          contentContainerStyle={styles.hlist}
          ItemSeparatorComponent={() => <View style={{width: spacing.sm + 2}} />}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <MovieCard
              movie={item}
              width={130}
              onPress={() => openMovie(item.id)}
            />
          )}
        />

        <SectionHeader title="For You" action="Explore" compact />
        <Pressable
          onPress={() => openMovie(discoverFeatured.id)}
          style={styles.featured}>
          <Image
            source={{uri: discoverFeatured.backdrop}}
            style={styles.featuredImg}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(10,10,10,0)', 'rgba(10,10,10,0.85)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>NEW RELEASE</Text>
          </View>
          <View style={styles.featuredBody}>
            <Text style={styles.featuredTitle}>{discoverFeatured.title}</Text>
            <View style={styles.featuredMeta}>
              <StarIcon size={12} />
              <Text style={styles.featuredMetaText}>
                {discoverFeatured.rating.toFixed(1)}
              </Text>
              <View style={styles.dot} />
              <Text style={styles.featuredMetaText}>
                {discoverFeatured.year}
              </Text>
              <View style={styles.dot} />
              <Text style={styles.featuredMetaText}>
                {discoverFeatured.genres[0]}
              </Text>
            </View>
            <Text numberOfLines={2} style={styles.featuredSynopsis}>
              {discoverFeatured.synopsis}
            </Text>
            <View style={styles.featuredActions}>
              <View style={styles.playPill}>
                <PlayIcon size={14} color={colors.background} />
                <Text style={styles.playPillText}>Play</Text>
              </View>
              <View style={styles.miniList}>
                <Text style={styles.miniListText}>+ My List</Text>
              </View>
            </View>
          </View>
        </Pressable>

        <FlatList
          horizontal
          data={forYou}
          keyExtractor={m => m.id}
          contentContainerStyle={[styles.hlist, {marginTop: spacing.md}]}
          ItemSeparatorComponent={() => <View style={{width: spacing.sm + 2}} />}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <MovieCard
              movie={item}
              width={112}
              onPress={() => openMovie(item.id)}
            />
          )}
        />

        <SectionHeader title="Because you watched Interstellar" compact />
        <View style={styles.becauseWrap}>
          {becauseYouWatched.map(m => {
            const runtime = `${Math.floor(m.runtimeMin / 60)}h ${
              m.runtimeMin % 60
            }m`;
            return (
              <Pressable
                key={m.id}
                onPress={() => openMovie(m.id)}
                style={styles.becauseRow}>
                <Image
                  source={{uri: m.backdrop}}
                  style={styles.becauseImg}
                  resizeMode="cover"
                />
                <View style={styles.becauseBody}>
                  <Text style={styles.becauseTitle}>{m.title}</Text>
                  <Text style={styles.becauseMeta}>
                    {m.year} · {m.genres[0]} · {runtime}
                  </Text>
                  <View style={styles.becauseRating}>
                    <StarIcon size={12} />
                    <Text style={styles.becauseRatingText}>
                      {m.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>
                <ChevronRightIcon size={18} color={colors.textMuted} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.background},
  headerRow: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  brand: {
    color: colors.brand,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    paddingVertical: 0,
  },
  scroll: {paddingBottom: spacing.xxl + 40},
  recentWrap: {
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  recentText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '500',
  },
  recentChipMore: {
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  recentMoreText: {
    color: colors.textAccent,
    fontSize: 12,
    fontWeight: '600',
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  category: {
    paddingHorizontal: spacing.md,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassBg,
  },
  categoryOn: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  categoryText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  categoryTextOn: {
    color: colors.brandText,
  },
  hlist: {paddingHorizontal: spacing.md},
  featured: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
    height: 260,
  },
  featuredImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.brand,
  },
  featuredBadgeText: {
    color: colors.brandText,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  featuredBody: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  featuredTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  featuredMetaText: {color: colors.textMuted, fontSize: 12},
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    opacity: 0.7,
  },
  featuredSynopsis: {
    color: colors.textPrimary,
    fontSize: 12,
    lineHeight: 17,
    opacity: 0.9,
    marginBottom: spacing.sm + 2,
  },
  featuredActions: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
  },
  playPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 999,
    backgroundColor: '#fff7f6',
  },
  playPillText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '700',
  },
  miniList: {
    justifyContent: 'center',
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 999,
    borderColor: colors.glassBorder,
    borderWidth: 1,
  },
  miniListText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  becauseWrap: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm + 2,
  },
  becauseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: radius.md,
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  becauseImg: {
    width: 96,
    height: 60,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  becauseBody: {
    flex: 1,
    marginLeft: spacing.md,
  },
  becauseTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  becauseMeta: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  becauseRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  becauseRatingText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
});
