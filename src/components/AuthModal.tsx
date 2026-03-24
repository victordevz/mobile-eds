import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function AuthModal() {
  const { authModalVisible, authModalTab, closeAuthModal, login, register } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(authModalTab);
  }, [authModalTab]);

  useEffect(() => {
    if (!authModalVisible) {
      setEmail('');
      setPassword('');
      setError(null);
      setLoading(false);
    }
  }, [authModalVisible]);

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setError('Preencha email e senha.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (activeTab === 'login') {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password);
      }
      closeAuthModal();
    } catch (err: any) {
      const msg: string = err?.message ?? 'Ocorreu um erro. Tente novamente.';
      if (err?.statusCode === 401) {
        setError('Email ou senha incorretos.');
      } else if (err?.statusCode === 409) {
        setError('Este email já está em uso.');
      } else if (err?.statusCode === 400) {
        setError('Dados inválidos. Verifique email e senha (mínimo 8 caracteres).');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      visible={authModalVisible}
      transparent
      animationType="fade"
      onRequestClose={closeAuthModal}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeAuthModal} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.tabs}>
            <Pressable
              style={[styles.tab, activeTab === 'login' && styles.tabActive]}
              onPress={() => { setActiveTab('login'); setError(null); }}
            >
              <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>
                Entrar
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'register' && styles.tabActive]}
              onPress={() => { setActiveTab('register'); setError(null); }}
            >
              <Text style={[styles.tabText, activeTab === 'register' && styles.tabTextActive]}>
                Cadastrar
              </Text>
            </Pressable>
          </View>

          <Text style={styles.title}>
            {activeTab === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
          </Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.grey}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder={activeTab === 'register' ? 'Senha (mín. 8 caracteres)' : 'Senha'}
            placeholderTextColor={colors.grey}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            onSubmitEditing={handleSubmit}
          />

          <Pressable
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryDark} />
            ) : (
              <Text style={styles.submitText}>
                {activeTab === 'login' ? 'Entrar' : 'Criar conta'}
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.primaryDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surface,
    alignSelf: 'center',
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.secondary,
  },
  tabText: {
    color: colors.grey,
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: colors.primaryDark,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: 'rgba(255,59,59,0.15)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,59,59,0.4)',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.white,
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  submitBtn: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 16,
  },
});
