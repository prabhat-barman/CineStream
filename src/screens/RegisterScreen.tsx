import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthLayout} from '../components/AuthLayout';
import {AuthInput} from '../components/AuthInput';
import {PrimaryButton} from '../components/PrimaryButton';
import {SocialButton} from '../components/SocialButton';
import {Checkbox} from '../components/Checkbox';
import {
  AppleIcon,
  GoogleIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from '../components/icons';
import {colors, spacing} from '../theme/colors';
import {SocialSignInCancelled, useAuth} from '../context/AuthContext';
import {ApiError} from '../lib/api';
import {isAppleAuthAvailable} from '../lib/oauth';
import type {AuthStackParamList} from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

type Busy = 'email' | 'google' | 'apple' | null;

export function RegisterScreen({navigation}: Props) {
  const {signUp, signInWithGoogle, signInWithApple} = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accept, setAccept] = useState(false);
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);

  const cleanedPhone = phone.replace(/\D/g, '');
  const canSubmit =
    name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    password.length >= 6 &&
    password === confirm &&
    (cleanedPhone.length === 0 || cleanedPhone.length >= 10) &&
    accept;

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
          : 'Sign up failed. Please try again.';
      setError(message);
    } finally {
      setBusy(null);
    }
  };

  const onSubmit = async () => {
    setError(null);
    setBusy('email');
    try {
      const res = await signUp({
        fullName: name.trim(),
        email: email.trim(),
        password,
        phone: cleanedPhone || undefined,
      });
      // If mail send failed AND the backend didn't expose a dev OTP fallback
      // (i.e. we're in production), don't route the user into an OTP screen
      // they can't complete. Show an actionable error and let them retry.
      if (res.emailSent === false && !res.otp) {
        setError(
          "We couldn't send the verification email right now. Please try again in a moment.",
        );
        return;
      }
      navigation.navigate('VerifyOtp', {
        email: res.email,
        devOtp: res.otp,
        expiresInMinutes: res.otpExpiresInMinutes,
        emailSent: res.emailSent,
      });
    } catch (err) {
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

  return (
    <AuthLayout>
      <Text style={styles.heading}>Create Account</Text>
      <Text style={styles.subheading}>
        Join the show — it only takes a minute
      </Text>

      <View style={styles.inputs}>
        <AuthInput
          icon={<UserIcon />}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <AuthInput
          icon={<MailIcon />}
          placeholder="Email Address"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <AuthInput
          icon={<UserIcon />}
          placeholder="Phone (optional)"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <AuthInput
          icon={<LockIcon />}
          placeholder="Password (min 6 chars)"
          secure
          value={password}
          onChangeText={setPassword}
        />
        <AuthInput
          icon={<LockIcon />}
          placeholder="Confirm Password"
          secure
          value={confirm}
          onChangeText={setConfirm}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.termsRow}>
        <Checkbox
          label="I agree to the Terms & Privacy Policy"
          checked={accept}
          onChange={setAccept}
        />
      </View>

      <PrimaryButton
        label="Create Account"
        onPress={onSubmit}
        loading={busy === 'email'}
        disabled={!canSubmit || (busy !== null && busy !== 'email')}
      />

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR SIGN UP WITH</Text>
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
        <Text style={styles.bottomText}>Already have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Login')} hitSlop={8}>
          <Text style={styles.bottomLink}>Sign in</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: colors.textPrimary,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    textAlign: 'center',
  },
  subheading: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  inputs: {
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  error: {
    color: colors.brand,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  termsRow: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
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
