import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthLayout} from '../components/AuthLayout';
import {AuthInput} from '../components/AuthInput';
import {PrimaryButton} from '../components/PrimaryButton';
import {SocialButton} from '../components/SocialButton';
import {Checkbox} from '../components/Checkbox';
import {AppleIcon, GoogleIcon, LockIcon, MailIcon} from '../components/icons';
import {colors, spacing} from '../theme/colors';
import {SocialSignInCancelled, useAuth} from '../context/AuthContext';
import {ApiError} from '../lib/api';
import {isAppleAuthAvailable} from '../lib/oauth';
import type {AuthStackParamList} from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

type Busy = 'email' | 'google' | 'apple' | null;

export function LoginScreen({navigation}: Props) {
  const {signIn, signInWithGoogle, signInWithApple} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);

  const onSignIn = async () => {
    setError(null);
    setBusy('email');
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        // Backend returns 400 if the OTT user hasn't verified their email yet.
        // Redirect them to the OTP screen.
        if (err.message?.toLowerCase().includes('otp')) {
          navigation.navigate('VerifyOtp', {email: email.trim()});
          return;
        }
      }
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setBusy(null);
    }
  };

  const runSocial = async (
    provider: Exclude<Busy, 'email' | null>,
    fn: () => Promise<void>,
  ) => {
    setError(null);
    setBusy(provider);
    try {
      await fn();
    } catch (err) {
      if (err instanceof SocialSignInCancelled) {
        return;
      }
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
          ? err.message
          : 'Sign in failed. Please try again.';
      setError(message);
    } finally {
      setBusy(null);
    }
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

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.row}>
        <Checkbox label="Remember me" checked={remember} onChange={setRemember} />
        <Pressable
          onPress={() => navigation.navigate('ForgotPassword')}
          hitSlop={8}>
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>
      </View>

      <PrimaryButton
        label="Sign In"
        onPress={onSignIn}
        loading={busy === 'email'}
        disabled={busy !== null && busy !== 'email'}
      />

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR CONNECT WITH</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.social}>
        <SocialButton
          label="Google"
          icon={<GoogleIcon />}
          loading={busy === 'google'}
          disabled={busy !== null && busy !== 'google'}
          onPress={() => runSocial('google', signInWithGoogle)}
        />
        {isAppleAuthAvailable ? (
          <SocialButton
            label="Apple"
            icon={<AppleIcon />}
            loading={busy === 'apple'}
            disabled={busy !== null && busy !== 'apple'}
            onPress={() => runSocial('apple', signInWithApple)}
          />
        ) : null}
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
    marginBottom: spacing.md,
  },
  error: {
    color: colors.brand,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
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
