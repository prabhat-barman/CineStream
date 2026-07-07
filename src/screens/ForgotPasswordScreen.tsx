import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthLayout} from '../components/AuthLayout';
import {AuthInput} from '../components/AuthInput';
import {PrimaryButton} from '../components/PrimaryButton';
import {MailIcon} from '../components/icons';
import {colors, spacing} from '../theme/colors';
import type {AuthStackParamList} from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({navigation}: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };

  return (
    <AuthLayout>
      <Text style={styles.heading}>Forgot Password?</Text>
      <Text style={styles.subheading}>
        Enter your email and we&apos;ll send you a link to reset your password.
      </Text>

      <View style={styles.inputs}>
        <AuthInput
          icon={<MailIcon />}
          placeholder="Email Address"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!sent}
        />
      </View>

      {sent ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>
            Reset link sent. Check your inbox at{'\n'}
            <Text style={styles.successEmail}>{email}</Text>
          </Text>
        </View>
      ) : null}

      <PrimaryButton
        label={sent ? 'Resend Link' : 'Send Reset Link'}
        onPress={onSubmit}
        loading={loading}
        disabled={!email}
      />

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Remember your password? </Text>
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
    marginBottom: spacing.lg,
  },
  successBox: {
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: 'rgba(229, 9, 20, 0.08)',
    borderColor: 'rgba(229, 9, 20, 0.25)',
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  successText: {
    color: colors.textPrimary,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  successEmail: {
    color: colors.textAccent,
    fontWeight: '600',
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
