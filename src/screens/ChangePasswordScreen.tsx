import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthLayout} from '../components/AuthLayout';
import {AuthInput} from '../components/AuthInput';
import {PrimaryButton} from '../components/PrimaryButton';
import {LockIcon} from '../components/icons';
import {colors, spacing} from '../theme/colors';
import {ApiError} from '../lib/api';
import {useAuth} from '../context/AuthContext';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ChangePassword'>;

const MIN_PASSWORD = 6;

export function ChangePasswordScreen({navigation}: Props) {
  const {changePassword} = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = next.length > 0 && next === confirm;
  const differentFromCurrent = current.length > 0 && next !== current;
  const canSubmit =
    current.length > 0 &&
    next.length >= MIN_PASSWORD &&
    passwordsMatch &&
    differentFromCurrent &&
    !busy;

  const onSubmit = async () => {
    if (!canSubmit) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await changePassword({currentPassword: current, newPassword: next});
      // On success AuthContext signs the user out; root navigator will swap to
      // the Auth stack automatically. No manual navigation needed.
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
          ? err.message
          : 'Could not change password. Try again.';
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <Text style={styles.heading}>Change Password</Text>
      <Text style={styles.subheading}>
        For your security you&apos;ll be signed out on this and all other
        devices after changing your password.
      </Text>

      <View style={styles.inputs}>
        <AuthInput
          icon={<LockIcon />}
          placeholder="Current password"
          secure
          value={current}
          onChangeText={setCurrent}
        />
        <AuthInput
          icon={<LockIcon />}
          placeholder="New password (min 6 characters)"
          secure
          value={next}
          onChangeText={setNext}
        />
        <AuthInput
          icon={<LockIcon />}
          placeholder="Confirm new password"
          secure
          value={confirm}
          onChangeText={setConfirm}
        />
      </View>

      {next.length > 0 && !differentFromCurrent ? (
        <Text style={styles.error}>
          New password must be different from the current one.
        </Text>
      ) : null}
      {next.length > 0 && confirm.length > 0 && !passwordsMatch ? (
        <Text style={styles.error}>Passwords don&apos;t match.</Text>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton
        label="Update Password"
        onPress={onSubmit}
        loading={busy}
        disabled={!canSubmit}
      />

      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.backRow}
        hitSlop={8}>
        <Text style={styles.backLink}>Cancel</Text>
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
  inputs: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  error: {
    color: colors.brand,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: spacing.xs,
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
