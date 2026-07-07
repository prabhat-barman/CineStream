import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors, radius, spacing} from '../theme/colors';
import {
  BellIcon,
  ChevronRightIcon,
  DownloadIcon,
  ProfileIcon,
  StarIcon,
} from '../components/icons';
import type {MainTabParamList} from '../navigation/MainTabs';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ProfileScreen({navigation}: Props) {
  const logout = () =>
    navigation.getParent()?.reset({index: 0, routes: [{name: 'Auth'}]});

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>PB</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Prabhat B.</Text>
            <Text style={styles.userEmail}>prabhat@cinestream.app</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Premium</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat label="Watched" value="47" />
          <View style={styles.statDivider} />
          <Stat label="My List" value="12" />
          <View style={styles.statDivider} />
          <Stat label="Downloads" value="3" />
        </View>

        <Section title="Account">
          <Row icon={<ProfileIcon size={20} />} label="Manage profiles" />
          <Row icon={<StarIcon size={20} color={colors.textPrimary} />} label="Ratings & reviews" />
          <Row icon={<BellIcon size={20} />} label="Notifications" />
        </Section>

        <Section title="App">
          <Row icon={<DownloadIcon size={20} />} label="Downloads settings" hint="Wi-Fi only" />
          <Row label="Playback quality" hint="Auto" />
          <Row label="Language" hint="English" />
          <Row label="About CineStream" />
        </Section>

        <Pressable
          onPress={logout}
          style={({pressed}) => [styles.logout, pressed && styles.pressed]}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.version}>CineStream v0.1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Section({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function Row({
  icon,
  label,
  hint,
}: {
  icon?: React.ReactNode;
  label: string;
  hint?: string;
}) {
  return (
    <Pressable style={({pressed}) => [styles.row, pressed && styles.pressed]}>
      {icon ? <View style={styles.rowIcon}>{icon}</View> : <View style={styles.rowIcon} />}
      <Text style={styles.rowLabel}>{label}</Text>
      {hint ? <Text style={styles.rowHint}>{hint}</Text> : null}
      <ChevronRightIcon size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.background},
  scroll: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: colors.brandText,
    fontSize: 18,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  userEmail: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(229,9,20,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(229,9,20,0.4)',
  },
  pillText: {
    color: colors.textAccent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: radius.md,
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  stat: {flex: 1, alignItems: 'center'},
  statValue: {color: colors.textPrimary, fontSize: 20, fontWeight: '800'},
  statLabel: {color: colors.textMuted, fontSize: 11, marginTop: 4, letterSpacing: 0.4},
  statDivider: {width: 1, backgroundColor: colors.glassBorder},
  section: {marginBottom: spacing.md},
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: radius.md,
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.glassBorder,
  },
  pressed: {opacity: 0.75},
  rowIcon: {width: 24, alignItems: 'center'},
  rowLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    marginLeft: spacing.sm + 2,
  },
  rowHint: {
    color: colors.textMuted,
    fontSize: 12,
    marginRight: spacing.sm,
  },
  logout: {
    height: 50,
    borderRadius: radius.md,
    borderColor: 'rgba(229,9,20,0.4)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  logoutText: {
    color: colors.textAccent,
    fontSize: 15,
    fontWeight: '700',
  },
  version: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.md,
    opacity: 0.6,
  },
});
