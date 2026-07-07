import React, {useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors, radius, spacing} from '../theme/colors';
import {notifications, subscriptionPlans} from '../data/movies';
import {
  ChevronLeftIcon,
  CheckIcon,
  CrownIcon,
  SlidersIcon,
} from '../components/icons';
import {PrimaryButton} from '../components/PrimaryButton';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

type Tab = 'notifications' | 'premium';

export function NotificationsScreen({navigation}: Props) {
  const [tab, setTab] = useState<Tab>('notifications');

  const grouped = notifications.reduce<
    Record<string, typeof notifications>
  >((acc, n) => {
    const key = n.time.toLowerCase().includes('yesterday') ? 'Yesterday' : 'Today';
    (acc[key] ??= []).push(n);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
          hitSlop={8}>
          <ChevronLeftIcon />
        </Pressable>
        <Text style={styles.brand}>CINESTREAM</Text>
        <Pressable style={styles.iconBtn} hitSlop={8}>
          <SlidersIcon size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.tabs}>
        <Pressable
          onPress={() => setTab('notifications')}
          style={[styles.tab, tab === 'notifications' && styles.tabOn]}>
          <Text
            style={[styles.tabText, tab === 'notifications' && styles.tabTextOn]}>
            Notifications
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab('premium')}
          style={[styles.tab, tab === 'premium' && styles.tabOn]}>
          <CrownIcon size={14} color={tab === 'premium' ? colors.brandText : '#ffb400'} />
          <Text
            style={[styles.tabText, tab === 'premium' && styles.tabTextOn]}>
            Premium
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {tab === 'notifications' ? (
          Object.entries(grouped).map(([label, items]) => (
            <View key={label} style={styles.group}>
              <Text style={styles.groupLabel}>{label.toUpperCase()}</Text>
              {items.map(n => (
                <View key={n.id} style={styles.card}>
                  {n.thumb ? (
                    <Image source={{uri: n.thumb}} style={styles.cardImg} />
                  ) : (
                    <View style={[styles.cardImg, styles.cardImgFallback]}>
                      <Text style={styles.cardImgFallbackText}>C</Text>
                    </View>
                  )}
                  <View style={styles.cardBody}>
                    <View style={styles.cardTopRow}>
                      <View
                        style={[
                          styles.chip,
                          n.type === 'new_release' && styles.chipNew,
                          n.type === 'trending' && styles.chipTrending,
                          n.type === 'recommendation' && styles.chipRec,
                          n.type === 'reminder' && styles.chipReminder,
                        ]}>
                        <Text style={styles.chipText}>
                          {chipLabel(n.type)}
                        </Text>
                      </View>
                      {n.unread ? <View style={styles.dotUnread} /> : null}
                    </View>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {n.title}
                    </Text>
                    <Text style={styles.cardBodyText} numberOfLines={2}>
                      {n.body}
                    </Text>
                    <Text style={styles.cardTime}>{n.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.premiumWrap}>
            <View style={styles.premiumHero}>
              <CrownIcon size={22} color="#ffb400" />
              <Text style={styles.premiumTitle}>CineStream Premium</Text>
              <Text style={styles.premiumSub}>
                Unlock 4K UHD, unlimited downloads, and an ad-free cinematic
                experience across all your devices.
              </Text>
            </View>

            {subscriptionPlans.map(p => (
              <View
                key={p.id}
                style={[
                  styles.planCard,
                  p.highlighted && styles.planCardOn,
                ]}>
                <View style={styles.planTop}>
                  <Text style={styles.planName}>{p.name}</Text>
                  {p.highlighted ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>MOST POPULAR</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>{p.price}</Text>
                  <Text style={styles.perInterval}>/ {p.interval}</Text>
                </View>
                {p.perks.map(perk => (
                  <View key={perk} style={styles.perkRow}>
                    <CheckIcon size={14} color="#5ee089" />
                    <Text style={styles.perkText}>{perk}</Text>
                  </View>
                ))}
              </View>
            ))}

            <PrimaryButton label="Start 7-day free trial" />
            <Text style={styles.legal}>
              Auto-renews at plan price after trial. Cancel anytime.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function chipLabel(t: string) {
  switch (t) {
    case 'new_release':
      return 'NEW RELEASE';
    case 'trending':
      return 'TRENDING';
    case 'recommendation':
      return 'FOR YOU';
    case 'reminder':
      return 'REQUIRE WATCHING';
    default:
      return 'UPDATE';
  }
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.background},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    color: colors.brand,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassBg,
  },
  tabOn: {backgroundColor: colors.brand, borderColor: colors.brand},
  tabText: {color: colors.textMuted, fontSize: 12, fontWeight: '700'},
  tabTextOn: {color: colors.brandText},
  scroll: {paddingBottom: spacing.xxl + 40},
  group: {marginBottom: spacing.md},
  groupLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginLeft: spacing.md,
    marginBottom: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm + 2,
    borderRadius: radius.md,
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    gap: spacing.md,
  },
  cardImg: {
    width: 60,
    height: 60,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  cardImgFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
  cardImgFallbackText: {
    color: colors.brandText,
    fontSize: 22,
    fontWeight: '900',
  },
  cardBody: {flex: 1},
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  chipNew: {backgroundColor: 'rgba(229,9,20,0.2)'},
  chipTrending: {backgroundColor: 'rgba(255,180,0,0.2)'},
  chipRec: {backgroundColor: 'rgba(80,180,255,0.2)'},
  chipReminder: {backgroundColor: 'rgba(94,224,137,0.2)'},
  chipText: {
    color: colors.textPrimary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  dotUnread: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.brand,
  },
  cardTitle: {color: colors.textPrimary, fontSize: 13, fontWeight: '700'},
  cardBodyText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
  cardTime: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 6,
    opacity: 0.8,
  },
  premiumWrap: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  premiumHero: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: 8,
  },
  premiumTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  premiumSub: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },
  planCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassBg,
    padding: spacing.md,
  },
  planCardOn: {
    borderColor: colors.brand,
    borderWidth: 1.5,
  },
  planTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  planName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: colors.brand,
  },
  badgeText: {
    color: colors.brandText,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 10,
  },
  price: {color: colors.textPrimary, fontSize: 26, fontWeight: '900'},
  perInterval: {color: colors.textMuted, fontSize: 13},
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  perkText: {color: colors.textPrimary, fontSize: 13},
  legal: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.85,
  },
});
