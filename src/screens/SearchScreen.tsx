import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors, radius, spacing} from '../theme/colors';
import {SearchIcon} from '../components/icons';
import {MovieCard} from '../components/MovieCard';
import {api} from '../lib/api';
import {webseriesToContent} from '../lib/adapters';
import {useApi} from '../lib/useApi';
import {useAuth} from '../context/AuthContext';
import type {MainTabParamList} from '../navigation/MainTabs';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

const QUICK = ['Sci-Fi', 'Action', 'Thriller', 'Drama', 'Animation', 'Crime'];

const SEARCH_DEBOUNCE_MS = 350;

export function SearchScreen({navigation}: Props) {
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const {token} = useAuth();

  // Debounce user typing so we don't hammer the backend on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [q]);

  const search = useCallback(
    (signal: AbortSignal) => {
      if (!token) {
        return null;
      }
      return api.webseries
        .list({
          token,
          status: 'PUBLISHED',
          search: debouncedQ || undefined,
          genre: genre ? genre.toLowerCase() : undefined,
          limit: 30,
          signal,
        })
        .then(res => res.data.map(webseriesToContent));
    },
    [token, debouncedQ, genre],
  );

  const {data, loading, error, reload} = useApi(search, [
    token,
    debouncedQ,
    genre,
  ]);

  const results = data ?? [];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.searchBar}>
        <SearchIcon size={20} color={colors.textMuted} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search movies, shows, cast..."
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          returnKeyType="search"
          autoCorrect={false}
        />
        {q ? (
          <Pressable onPress={() => setQ('')} hitSlop={8}>
            <Text style={styles.clear}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        horizontal
        data={QUICK}
        keyExtractor={g => g}
        contentContainerStyle={styles.chipsRow}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{width: 8}} />}
        renderItem={({item}) => {
          const selected = genre === item;
          return (
            <Pressable
              onPress={() => setGenre(selected ? null : item)}
              style={[styles.chip, selected && styles.chipSelected]}>
              <Text
                style={[
                  styles.chipText,
                  selected && styles.chipTextSelected,
                ]}>
                {item}
              </Text>
            </Pressable>
          );
        }}
      />

      <FlatList
        data={results}
        keyExtractor={m => m.id}
        renderItem={({item}) => (
          <View style={styles.gridItem}>
            <MovieCard
              movie={item}
              width={160}
              showTitle
              onPress={() => navigation.navigate('MovieDetails', {id: item.id})}
            />
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <View style={styles.state}>
              <ActivityIndicator color={colors.brand} />
            </View>
          ) : error ? (
            <View style={styles.state}>
              <Text style={styles.emptyTitle}>Couldn't load results</Text>
              <Text style={styles.emptyBody}>{error}</Text>
              <Pressable onPress={reload} style={styles.retryBtn}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.state}>
              <Text style={styles.emptyTitle}>No results</Text>
              <Text style={styles.emptyBody}>
                Try a different search or filter.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.background},
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    paddingVertical: 0,
  },
  clear: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
  chipsRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassBg,
  },
  chipSelected: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.brandText,
    fontWeight: '700',
  },
  grid: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  row: {
    gap: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  gridItem: {},
  state: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyBody: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  retryBtn: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
  },
});
