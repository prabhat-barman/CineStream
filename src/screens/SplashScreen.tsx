import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, spacing, typography} from '../theme/colors';
import {movies} from '../data/movies';

const COLUMN_POSTERS = [
  ['m2', 's1', 'm5', 'm7'],
  ['m4', 'm10', 's2', 'm6'],
  ['m11', 'm3', 'm8', 's3'],
];

export function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const posterOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(posterOffset, {
          toValue: -400,
          duration: 22000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
    ]).start();
  }, [fade, posterOffset]);

  return (
    <View style={styles.root}>
      <View style={styles.posterWall} pointerEvents="none">
        {COLUMN_POSTERS.map((col, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          return (
            <Animated.View
              key={i}
              style={[
                styles.column,
                {
                  transform: [
                    {
                      translateY: posterOffset.interpolate({
                        inputRange: [-400, 0],
                        outputRange: [dir * -180, dir * 180],
                      }),
                    },
                  ],
                },
              ]}>
              {col.concat(col).map((id, idx) => {
                const m = movies.find(mv => mv.id === id);
                if (!m) {
                  return null;
                }
                return (
                  <Image
                    key={`${id}-${idx}`}
                    source={{uri: m.poster}}
                    style={styles.poster}
                    resizeMode="cover"
                  />
                );
              })}
            </Animated.View>
          );
        })}
      </View>

      <LinearGradient
        colors={['rgba(10,10,10,0.75)', 'rgba(10,10,10,0.95)', colors.background]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.center, {opacity: fade}]}>
        <Text style={styles.logo}>CINESTREAM</Text>
        <Text style={styles.tagline}>Your front row seat awaits</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  posterWall: {
    position: 'absolute',
    top: -80,
    left: -40,
    right: -40,
    bottom: -80,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    gap: 10,
  },
  poster: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logo: {
    color: colors.brand,
    fontSize: typography.logo.fontSize,
    fontWeight: typography.logo.fontWeight,
    letterSpacing: typography.logo.letterSpacing,
    lineHeight: typography.logo.lineHeight + 8,
    textAlign: 'center',
  },
  tagline: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm,
    letterSpacing: 0.4,
  },
});
