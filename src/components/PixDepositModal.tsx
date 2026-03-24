import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Clipboard,
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
import { walletApi, DepositResponse } from '../services/api';
import { colors } from '../theme';

type Step = 'form' | 'pix' | 'success';

export default function PixDepositModal() {
  const { depositModalVisible, closeDepositModal, token, isAuthenticated, openAuthModal, refreshBalance } = useAuth();

  const [step, setStep] = useState<Step>('form');
  const [amountText, setAmountText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deposit, setDeposit] = useState<DepositResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!depositModalVisible) {
      setStep('form');
      setAmountText('');
      setLoading(false);
      setError(null);
      setDeposit(null);
      setCopied(false);
      stopPolling();
    }
  }, [depositModalVisible]);

  useEffect(() => {
    return () => stopPolling();
  }, []);

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  function startPolling(depositId: string) {
    pollRef.current = setInterval(async () => {
      if (!token) return;
      try {
        const updated = await walletApi.getDeposit(depositId, token);
        setDeposit(updated);
        if (updated.status === 'COMPLETED' || updated.status === 'FAILED') {
          stopPolling();
          if (updated.status === 'COMPLETED') {
            refreshBalance();
            setStep('success');
          } else {
            setError('Pagamento falhou. Tente novamente.');
            setStep('form');
          }
        }
      } catch {
      }
    }, 3000);
  }

  async function handleCreateDeposit() {
    if (!isAuthenticated) {
      closeDepositModal();
      openAuthModal('login');
      return;
    }

    const amount = parseFloat(amountText.replace(',', '.'));
    if (isNaN(amount) || amount < 0.01 || amount > 10000) {
      setError('Informe um valor entre R$ 0,01 e R$ 10.000,00');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const result = await walletApi.createDeposit(amount, token!);
      setDeposit(result);
      setStep('pix');
      startPolling(result.id);
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao criar depósito.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopyCode() {
    if (!deposit?.pixCode) return;
    Clipboard.setString(deposit.pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <Modal
      visible={depositModalVisible}
      transparent
      animationType="slide"
      onRequestClose={closeDepositModal}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeDepositModal} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>
              {step === 'success' ? 'Depósito confirmado' : 'Depositar via PIX'}
            </Text>
            <Pressable onPress={closeDepositModal} hitSlop={12}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {step === 'form' && (
            <>
              <Text style={styles.label}>Valor do depósito</Text>
              <View style={styles.presetRow}>
                {[10, 50, 100].map((preset) => (
                  <Pressable
                    key={preset}
                    style={styles.presetBtn}
                    onPress={() => {
                      const current = parseFloat(amountText.replace(',', '.')) || 0;
                      setAmountText(String(current + preset));
                    }}
                  >
                    <Text style={styles.presetBtnText}>+ R$ {preset}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.currency}>R$</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0,00"
                  placeholderTextColor={colors.grey}
                  keyboardType="decimal-pad"
                  value={amountText}
                  onChangeText={setAmountText}
                />
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <Pressable
                style={[styles.confirmBtn, loading && styles.confirmBtnDisabled]}
                onPress={handleCreateDeposit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.primaryDark} />
                ) : (
                  <Text style={styles.confirmBtnText}>Gerar QR Code PIX</Text>
                )}
              </Pressable>
            </>
          )}

          {step === 'pix' && deposit && (
            <>
              <View style={styles.pixInfoBox}>
                <Text style={styles.pixInfoLabel}>Valor</Text>
                <Text style={styles.pixInfoValue}>
                  R$ {deposit.amount.toFixed(2).replace('.', ',')}
                </Text>
              </View>

              <Text style={styles.label}>Código PIX Copia e Cola</Text>
              <View style={styles.pixCodeBox}>
                <Text style={styles.pixCodeText} numberOfLines={3} selectable>
                  {deposit.pixCode}
                </Text>
              </View>

              <Pressable style={styles.copyBtn} onPress={handleCopyCode}>
                <Text style={styles.copyBtnText}>
                  {copied ? 'Copiado!' : 'Copiar código'}
                </Text>
              </Pressable>

              <View style={styles.pendingRow}>
                <ActivityIndicator color={colors.secondary} size="small" />
                <Text style={styles.pendingText}>Aguardando pagamento...</Text>
              </View>
            </>
          )}

          {step === 'success' && deposit && (
            <View style={styles.successContainer}>
              <View style={styles.successIconCircle}>
                <Text style={styles.successIcon}>✓</Text>
              </View>
              <Text style={styles.successTitle}>Depósito confirmado!</Text>
              <Text style={styles.successSubtitle}>Seu saldo foi atualizado</Text>
              <View style={styles.successAmountBox}>
                <Text style={styles.successAmountLabel}>Valor creditado</Text>
                <Text style={styles.successAmountValue}>
                  R$ {deposit.amount.toFixed(2).replace('.', ',')}
                </Text>
              </View>
              <Pressable style={styles.successBtn} onPress={closeDepositModal}>
                <Text style={styles.confirmBtnText}>Fechar</Text>
              </Pressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    backgroundColor: colors.primaryDark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.grey,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  closeText: {
    color: colors.grey,
    fontSize: 18,
  },
  label: {
    color: colors.grey,
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  presetBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(56,230,125,0.08)',
  },
  presetBtnText: {
    color: colors.secondary,
    fontWeight: '600',
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  currency: {
    color: colors.grey,
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: 28,
    fontWeight: '700',
    paddingVertical: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    marginBottom: 12,
  },
  confirmBtn: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmBtnDisabled: {
    opacity: 0.6,
  },
  confirmBtnText: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 15,
  },
  pixInfoBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  pixInfoLabel: {
    color: colors.grey,
    fontSize: 12,
    marginBottom: 4,
  },
  pixInfoValue: {
    color: colors.secondary,
    fontSize: 28,
    fontWeight: '700',
  },
  pixCodeBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  pixCodeText: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 18,
  },
  copyBtn: {
    borderWidth: 1.5,
    borderColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  copyBtnText: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: 15,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pendingText: {
    color: colors.grey,
    fontSize: 13,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(56,230,125,0.15)',
    borderWidth: 2,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 36,
    color: colors.secondary,
    lineHeight: 44,
  },
  successTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  successSubtitle: {
    color: colors.grey,
    fontSize: 13,
    marginBottom: 24,
  },
  successAmountBox: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 28,
    width: '100%',
  },
  successAmountLabel: {
    color: colors.grey,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  successAmountValue: {
    color: colors.secondary,
    fontSize: 32,
    fontWeight: '700',
  },
  successBtn: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
});
