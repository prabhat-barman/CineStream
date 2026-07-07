import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthLayout} from '../components/AuthLayout';
import {AuthInput} from '../components/AuthInput';
import {PrimaryButton} from '../components/PrimaryButton';
import {Checkbox} from '../components/Checkbox';
import {LockIcon, MailIcon, UserIcon} from '../components/icons';
import {colors, spacing} from '../theme/colors';
import type {AuthStackParamList} from '../navigation/AuthNavigator';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, 'Register'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function RegisterScreen({navigation}: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit =
    !!name && !!email && !!password && password === confirm && accept;

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.getParent()?.reset({index: 0, routes: [{name: 'Main'}]});
    }, 700);
  };

  return (
    <AuthLayout>
      <Text style={styles.heading}>Create Account</Text>
      <Text style={styles.subheading}>Join the show — it only takes a minute</Text>

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
          icon={<LockIcon />}
          placeholder="Password"
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
        loading={loading}
        disabled={!canSubmit}
      />

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
    marginBottom: spacing.md,
  },
  termsRow: {
    marginBottom: spacing.lg,
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
