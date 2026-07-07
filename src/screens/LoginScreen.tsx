import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthLayout} from '../components/AuthLayout';
import {AuthInput} from '../components/AuthInput';
import {PrimaryButton} from '../components/PrimaryButton';
import {SocialButton} from '../components/SocialButton';
import {Checkbox} from '../components/Checkbox';
import {AppleIcon, GoogleIcon, LockIcon, MailIcon} from '../components/icons';
import {colors, spacing} from '../theme/colors';
import type {AuthStackParamList} from '../navigation/AuthNavigator';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, 'Login'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function LoginScreen({navigation}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.getParent()?.reset({index: 0, routes: [{name: 'Main'}]});
    }, 700);
  };

  return (
    <AuthLayout>
      <Text style={styles.heading}>Welcome Back</Text>

      <View style={styles.inputs}>
        <AuthInput
          icon={<MailIcon />}
          placeholder="Email Address"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <AuthInput
          icon={<LockIcon />}
          placeholder="Password"
          secure
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.row}>
        <Checkbox label="Remember me" checked={remember} onChange={setRemember} />
        <Pressable onPress={() => navigation.navigate('ForgotPassword')} hitSlop={8}>
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>
      </View>

      <PrimaryButton label="Sign In" onPress={onSignIn} loading={loading} />

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR CONNECT WITH</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.social}>
        <SocialButton label="Google" icon={<GoogleIcon />} />
        <SocialButton label="Apple" icon={<AppleIcon />} />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>New here? </Text>
        <Pressable onPress={() => navigation.navigate('Register')} hitSlop={8}>
          <Text style={styles.bottomLink}>Create account</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  inputs: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  link: {
    color: colors.textAccent,
    fontSize: 14,
    lineHeight: 20,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.2,
    paddingHorizontal: spacing.md,
  },
  social: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  bottomText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  bottomLink: {
    color: colors.textAccent,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
});
