import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors, radius, spacing} from '../theme/colors';
import {
  ChevronRightIcon,
  CrownIcon,
  EditIcon,
  HelpIcon,
  KeyIcon,
  LogOutIcon,
  MailIcon,
  ShieldIcon,
  SlidersIcon,
  WifiIcon,
} from '../components/icons';
import {useAuth} from '../context/AuthContext';
import type {MainTabParamList} from '../navigation/MainTabs';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ProfileScreen({navigation}: Props) {
  const {user, signOut} = useAuth();
  const [wifiOnly, setWifiOnly] = useState(true);

  const logout = () => {
    void signOut();
  };

  const openChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const displayName = user?.name ?? 'Julian Sterling';
  const initials = (user?.name ?? 'JS')
    .split(' ')
    .map(s => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const displayEmail = user?.email ?? 'julian@cinestream.app';
  const isAdmin = user?.role === 'admin';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brand}>CINESTREAM</Text>
        </View>

        <View style={styles.profileHead}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <Pressable style={styles.avatarEdit} hitSlop={8}>
              <EditIcon size={12} color={colors.brandText} />
            </Pressable>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <View style={styles.premiumBadge}>
            <CrownIcon size={12} color="#ffb400" />
            <Text style={styles.premiumBadgeText}>
              {isAdmin ? 'ADMIN' : 'PREMIUM MEMBER'}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat label="Watched" value="124" />
          <View style={styles.statDivider} />
          <Stat label="Watchlist" value="48" />
          <View style={styles.statDivider} />
          <Stat label="Reviews" value="12" />
        </View>

        <Section title="App Settings">
          <Row
            icon={<SlidersIcon size={18} color={colors.textPrimary} />}
            label="Video Quality"
            hint="Auto"
          />
          <SwitchRow
            icon={<WifiIcon size={18} color={colors.textPrimary} />}
            label="Download over Wi-Fi only"
            value={wifiOnly}
            onValueChange={setWifiOnly}
          />
        </Section>

        <Section title="Account">
          <Row
            icon={<MailIcon size={18} color={colors.textPrimary} />}
            label="Email"
            hint={displayEmail}
          />
          <Row
            icon={<KeyIcon size={18} color={colors.textPrimary} />}
            label="Change Password"
            onPress={openChangePassword}
          />
        </Section>

        <Section title="Support & Legal">
          <Row
            icon={<ShieldIcon size={18} color={colors.textPrimary} />}
            label="Privacy Policy"
          />
          <Row
            icon={<HelpIcon size={18} color={colors.textPrimary} />}
            label="Help Center"
          />
        </Section>

        <Pressable
          onPress={logout}
          style={({pressed}) => [styles.logout, pressed && styles.pressed]}>
          <LogOutIcon size={16} color={colors.brand} />
          <Text style={styles.logoutText}>Log Out</Text>
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

type RowProps = {
  icon?: React.ReactNode;
  label: string;
  hint?: string;
  onPress?: () => void;
};

function Row({icon, label, hint, onPress}: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [styles.row, pressed && styles.pressed]}>
      {icon ? <View style={styles.rowIcon}>{icon}</View> : <View style={styles.rowIcon} />}
      <View style={styles.rowLabelWrap}>
        <Text style={styles.rowLabel}>{label}</Text>
        {hint ? <Text style={styles.rowHint}>{hint}</Text> : null}
      </View>
      <ChevronRightIcon size={16} color={colors.textMuted} />
    </Pressable>
  );
}

function SwitchRow({
  icon,
  label,
  value,
  onValueChange,
}: {
  icon?: React.ReactNode;
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      {icon ? <View style={styles.rowIcon}>{icon}</View> : <View style={styles.rowIcon} />}
      <Text style={styles.rowLabelInline}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{true: colors.brand, false: '#333'}}
        thumbColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.background},
  scroll: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl + 40,
  },
  header: {alignItems: 'center', paddingVertical: spacing.sm},
  brand: {
    color: colors.brand,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  profileHead: {
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: colors.brand,
    marginBottom: 10,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
  },
  avatarEdit: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  userName: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,180,0,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,180,0,0.4)',
    marginTop: 6,
  },
  premiumBadgeText: {
    color: '#ffb400',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: radius.md,
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  stat: {flex: 1, alignItems: 'center'},
  statValue: {color: colors.textPrimary, fontSize: 20, fontWeight: '800'},
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 0.4,
  },
  statDivider: {width: 1, backgroundColor: colors.glassBorder},
  section: {marginBottom: spacing.md},
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 11,
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
    minHeight: 54,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.glassBorder,
  },
  pressed: {opacity: 0.75},
  rowIcon: {width: 24, alignItems: 'center'},
  rowLabelWrap: {flex: 1, marginLeft: spacing.sm + 2},
  rowLabel: {color: colors.textPrimary, fontSize: 14, fontWeight: '500'},
  rowLabelInline: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    marginLeft: spacing.sm + 2,
    fontWeight: '500',
  },
  rowHint: {color: colors.textMuted, fontSize: 12, marginTop: 2},
  logout: {
    height: 50,
    borderRadius: radius.md,
    borderColor: 'rgba(229,9,20,0.5)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
  },
  logoutText: {color: colors.brand, fontSize: 15, fontWeight: '700'},
  version: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.md,
    opacity: 0.6,
  },
});
