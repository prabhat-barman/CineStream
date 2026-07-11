import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthLayout} from '../components/AuthLayout';
import {PrimaryButton} from '../components/PrimaryButton';
import {colors, radius, spacing} from '../theme/colors';
import {useAuth} from '../context/AuthContext';
import {ApiError, api} from '../lib/api';
import type {AuthStackParamList} from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyOtp'>;

const OTP_LEN = 6;

export function VerifyOtpScreen({route, navigation}: Props) {
  const {email, devOtp, expiresInMinutes = 10, emailSent} = route.params;
  const {verifyOtp} = useAuth();

  const [digits, setDigits] = useState<string[]>(() => {
    const seed = (devOtp ?? '').replace(/\D/g, '').slice(0, OTP_LEN);
    return Array.from({length: OTP_LEN}, (_, i) => seed[i] ?? '');
  });
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  // Hard-fail case: mail send failed on the backend AND no dev OTP fallback
  // is available. The user can't proceed from this screen — surface it as
  // an error so it's visually prominent, not an info hint.
  const [error, setError] = useState<string | null>(() => {
    if (emailSent === false && !devOtp) {
      return "We couldn’t send the verification email right now. Please go back and try signing up again in a moment.";
    }
    return null;
  });
  const [info, setInfo] = useState<string | null>(() => {
    if (!devOtp) {
      return null;
    }
    if (emailSent === false) {
      return `We couldn’t send the email right now. Use this code to continue: ${devOtp}`;
    }
    return `Dev OTP prefilled: ${devOtp}`;
  });
  const [secondsLeft, setSecondsLeft] = useState(expiresInMinutes * 60);

  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const t = setInterval(
      () => setSecondsLeft(s => (s > 0 ? s - 1 : 0)),
      1000,
    );
    return () => clearInterval(t);
  }, []);

  const code = useMemo(() => digits.join(''), [digits]);
  const canSubmit = code.length === OTP_LEN && !busy;

  const onChangeDigit = (idx: number, val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) {
      setDigits(prev => {
        const next = [...prev];
        next[idx] = '';
        return next;
      });
      return;
    }
    if (cleaned.length > 1) {
      // paste path
      const chars = cleaned.slice(0, OTP_LEN - idx).split('');
      setDigits(prev => {
        const next = [...prev];
        chars.forEach((c, i) => (next[idx + i] = c));
        return next;
      });
      const nextFocus = Math.min(idx + chars.length, OTP_LEN - 1);
      inputs.current[nextFocus]?.focus();
      return;
    }
    setDigits(prev => {
      const next = [...prev];
      next[idx] = cleaned;
      return next;
    });
    if (idx < OTP_LEN - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const onKeyPress = (
    idx: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
      setDigits(prev => {
        const next = [...prev];
        next[idx - 1] = '';
        return next;
      });
    }
  };

  const onSubmit = async () => {
    if (!canSubmit) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await verifyOtp(email, code);
      // On success the auth context flips status to 'authenticated' and the
      // root navigator switches stacks automatically.
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
          ? err.message
          : 'Failed to verify. Try again.';
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  const onResend = async () => {
    setResending(true);
    setError(null);
    setInfo(null);
    try {
      // Backend doesn't yet expose a dedicated "resend OTP" route. Re-signup
      // would fail on an existing account, so we simply prompt the user.
      setInfo('If you didn’t receive the code, check spam or try again in a moment.');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
          ? err.message
          : 'Could not resend. Try again.';
      setError(message);
    } finally {
      setResending(false);
    }
  };
  void api;

  const mm = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0');
  const ss = (secondsLeft % 60).toString().padStart(2, '0');

  return (
    <AuthLayout>
      <Text style={styles.heading}>Verify your email</Text>
      <Text style={styles.subheading}>
        We sent a 6-digit code to{'\n'}
        <Text style={styles.email}>{email}</Text>
      </Text>

      <View style={styles.otpRow}>
        {digits.map((d, i) => (
          <TextInput
            key={i}
            ref={ref => {
              inputs.current[i] = ref;
            }}
            value={d}
            onChangeText={v => onChangeDigit(i, v)}
            onKeyPress={e => onKeyPress(i, e)}
            keyboardType="number-pad"
            maxLength={OTP_LEN}
            selectTextOnFocus
            style={[styles.otpBox, d ? styles.otpBoxFilled : null]}
            placeholderTextColor={colors.placeholder}
            textContentType="oneTimeCode"
            autoComplete={i === 0 ? 'sms-otp' : undefined}
            returnKeyType={i === OTP_LEN - 1 ? 'done' : 'next'}
          />
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {info ? <Text style={styles.info}>{info}</Text> : null}

      <Text style={styles.timer}>
        {secondsLeft > 0 ? `Code expires in ${mm}:${ss}` : 'Code has expired'}
      </Text>

      <PrimaryButton
        label="Verify & Continue"
        onPress={onSubmit}
        loading={busy}
        disabled={!canSubmit}
      />

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Didn’t get the code? </Text>
        <Pressable onPress={onResend} hitSlop={8} disabled={resending}>
          <Text style={styles.bottomLink}>Resend</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => navigation.navigate('Login')}
        style={styles.backRow}
        hitSlop={8}>
        <Text style={styles.backLink}>Use a different account</Text>
      </Pressable>
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
  email: {color: colors.textAccent, fontWeight: '600'},
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  otpBoxFilled: {
    borderColor: colors.brand,
  },
  error: {
    color: colors.brand,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  info: {
    color: colors.textAccent,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  timer: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: spacing.md,
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
  backRow: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  backLink: {
    color: colors.textMuted,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
