import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  PanResponder,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme';
import { BetSlipData } from '../types/sports';

interface BetSlipPanelProps {
  data: BetSlipData;
  betAmount: string;
  onChangeBet: (v: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  onExpand?: () => void;
}

export function BetSlipPanel({ data, betAmount, onChangeBet, onClose, onConfirm, onExpand }: BetSlipPanelProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const translateY = useSharedValue(-400);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        gs.dy < -8 && Math.abs(gs.dy) > Math.abs(gs.dx) * 1.5,
      onPanResponderMove: (_, gs) => {
        if (gs.dy < 0) translateY.value = gs.dy;
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy < -50 || gs.vy < -0.5) {
          translateY.value = withTiming(-260, { duration: 180 });
          setTimeout(onClose, 175);
        } else {
          translateY.value = withTiming(0, { duration: 120 });
        }
      },
    }),
  ).current;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: translateY.value < -20
      ? Math.max(0, 1 - (-translateY.value - 20) / 150)
      : 1,
  }));

  const numBet = parseFloat(betAmount.replace(',', '.')) || 0;
  const gain = numBet > 0 ? (numBet * data.oddValue).toFixed(2).replace('.', ',') : '0,00';

  function addAmount(v: number) {
    const current = parseFloat(betAmount.replace(',', '.')) || 0;
    onChangeBet(String((current + v).toFixed(2)));
  }

  function handleBet() {
    setIsConfirmed(true);
    setTimeout(() => {
      translateY.value = withTiming(-300, { duration: 300 });
      setTimeout(onConfirm, 280);
    }, 1000);
  }

  return (
    <Animated.View style={[styles.betSlip, animStyle]} {...pan.panHandlers}>
      <View style={styles.betSlipDragHandle} />

      <View style={styles.betSlipOddRow}>
        <View style={styles.betSlipOddInfo}>
          <Text style={styles.betSlipLeague} numberOfLines={1}>{data.league}</Text>
          <Text style={styles.betSlipMatch} numberOfLines={1}>{data.matchLabel}</Text>
          <Text style={styles.betSlipOddLabel} numberOfLines={1}>{data.oddLabel}</Text>
        </View>
        <View style={styles.betSlipOddBadge}>
          <Text style={styles.betSlipOddBadgeLabel}>ODD</Text>
          <Text style={styles.betSlipOddValue}>{data.oddValue.toFixed(2)}</Text>
        </View>
        {onExpand && (
          <Pressable onPress={onExpand} style={styles.betSlipExpandBtn} hitSlop={12}>
            <Text style={styles.betSlipExpandText}>+</Text>
          </Pressable>
        )}
        <Pressable onPress={onClose} style={styles.betSlipClose} hitSlop={12}>
          <Text style={styles.betSlipCloseText}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.betSlipInputRow}>
        {[5, 10, 20].map((v) => (
          <Pressable key={v} style={styles.betSlipQuickBtn} onPress={() => addAmount(v)}>
            <Text style={styles.betSlipQuickText}>+{v}</Text>
          </Pressable>
        ))}
        <View style={styles.betSlipAmountBox}>
          <Text style={styles.betSlipAmountPrefix}>R$</Text>
          <TextInput
            style={styles.betSlipAmountInput}
            value={betAmount}
            onChangeText={onChangeBet}
            keyboardType="decimal-pad"
            placeholder="0,00"
            placeholderTextColor={colors.grey}
          />
        </View>
      </View>

      <View style={styles.betSlipFooter}>
        <View>
          <Text style={styles.betSlipGainLabel}>GANHO POTENCIAL</Text>
          <Text style={styles.betSlipGainValue}>R$ {gain}</Text>
        </View>
        <Pressable
          style={[
            styles.betSlipConfirm,
            isConfirmed && { backgroundColor: '#38E67D' }
          ]}
          onPress={!isConfirmed ? handleBet : undefined}
        >
          <Text style={[
            styles.betSlipConfirmText,
            isConfirmed && { color: '#1B2128' }
          ]}>
            {isConfirmed ? '✓ CONFIRMADA' : 'APOSTAR'}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  betSlip: {
    zIndex: 15,
    backgroundColor: '#042B7A',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    marginTop: -16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    gap: 10,
  },
  betSlipDragHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignSelf: 'center',
    marginBottom: 4,
  },
  betSlipOddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  betSlipOddInfo: { flex: 1 },
  betSlipLeague: { color: colors.grey, fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  betSlipMatch: { color: colors.white, fontSize: 13, fontWeight: '700' },
  betSlipOddLabel: { color: colors.secondary, fontSize: 11, fontWeight: '600' },
  betSlipOddBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 58,
  },
  betSlipOddBadgeLabel: { color: colors.grey, fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  betSlipOddValue: { color: colors.white, fontSize: 18, fontWeight: '900' },
  betSlipExpandBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  betSlipExpandText: { color: colors.white, fontSize: 22, fontWeight: '800', lineHeight: 28 },
  betSlipClose: { padding: 4 },
  betSlipCloseText: { color: colors.grey, fontSize: 18 },
  betSlipInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  betSlipQuickBtn: {
    backgroundColor: 'rgba(56,230,125,0.15)',
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  betSlipQuickText: { color: colors.secondary, fontSize: 13, fontWeight: '700' },
  betSlipAmountBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  betSlipAmountPrefix: { color: colors.grey, fontSize: 16, fontWeight: '600' },
  betSlipAmountInput: { flex: 1, color: colors.white, fontSize: 18, fontWeight: '700', padding: 0 },
  betSlipFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  betSlipGainLabel: { color: colors.grey, fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  betSlipGainValue: { color: colors.white, fontSize: 16, fontWeight: '800' },
  betSlipConfirm: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  betSlipConfirmText: { color: colors.primaryDark, fontSize: 13, fontWeight: '800' },
});
