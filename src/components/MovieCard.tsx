import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import type {Movie} from '../types/movie';
import {colors, radius} from '../theme/colors';

type Props = {
  movie: Movie;
  onPress?: () => void;
  width?: number;
  showTitle?: boolean;
};

export function MovieCard({movie, onPress, width = 120, showTitle}: Props) {
  const height = Math.round((width * 3) / 2);
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [{width}, pressed && styles.pressed]}>
      <Image
        source={{uri: movie.poster}}
        style={[styles.poster, {width, height}]}
        resizeMode="cover"
      />
      {showTitle ? (
        <View style={styles.meta}>
          <Text numberOfLines={1} style={styles.title}>
            {movie.title}
          </Text>
          <Text style={styles.sub}>
            {movie.year} · {movie.genres[0]}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  poster: {
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.85,
    transform: [{scale: 0.98}],
  },
  meta: {
    marginTop: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  sub: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    opacity: 0.8,
  },
});
