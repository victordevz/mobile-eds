import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBetCupom } from '../context/BetCupomContext';
import { colors } from '../theme';

const { height: SCREEN_H } = Dimensions.get('window');

type BetMode = 'simples' | 'multiplas' | 'sistema';

export default function BetCupomDrawer() {
  const {
    selections,
    removeSelection,
    clearSelections,
    totalOdd,
    betAmount,
    setBetAmount,
    potentialGain,
    isCupomOpen,
    closeCupom,
  } = useBetCupom();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<BetMode>('multiplas');
  const translateY = useRef(new Animated.Value(SCREEN_H)).current;

  useEffect(() => {
    if (isCupomOpen) {
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }).start();
    } else {
      Animated.timing(translateY, { toValue: SCREEN_H, duration: 250, useNativeDriver: true }).start();
    }
  }, [isCupomOpen]);

  if (!isCupomOpen && selections.length === 0) return null;

  const numBet = parseFloat(betAmount.replace(',', '.')) || 0;
  const gain = numBet > 0 ? (numBet * totalOdd).toFixed(2).replace('.', ',') : '0,00';

  return (
    <Modal visible={isCupomOpen} transparent animationType="none" statusBarTranslucent>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={closeCupom} />

      <Animated.View style={[styles.drawer, { transform: [{ translateY }], paddingBottom: insets.bottom + 16 }]}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header bar */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>🎟</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Cupom de Apostas</Text>
              <Text style={styles.headerSub}>{selections.length}/30</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={clearSelections} style={styles.iconBtn} hitSlop={12}>
              <Text style={styles.iconBtnText}>🗑</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} hitSlop={12}>
              <Text style={styles.iconBtnText}>💾 Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} hitSlop={12}>
              <Text style={styles.iconBtnText}>↗ Compartilhar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['simples', 'multiplas', 'sistema'] as BetMode[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, mode === t && styles.tabActive]}
              onPress={() => setMode(t)}
            >
              <Text style={[styles.tabText, mode === t && styles.tabTextActive]}>
                {t === 'simples' ? 'Simples' : t === 'multiplas' ? 'Múltiplas' : 'Sistema'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selections list */}
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {selections.map((sel, i) => (
            <View key={sel.id} style={[styles.selItem, i > 0 && { marginTop: 0 }]}>
              <View style={styles.selIconWrap}>
                <Text style={{ fontSize: 20 }}>⚽</Text>
              </View>
              <View style={styles.selInfo}>
                <View style={styles.selTopRow}>
                  <Text style={styles.selChoice}>{sel.choiceLabel}</Text>
                  <Text style={styles.selOdd}>{sel.oddValue.toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => removeSelection(sel.id)} hitSlop={12}>
                    <Text style={styles.selRemove}>🗑</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.selMarket}>{sel.oddLabel}</Text>
                <Text style={styles.selMatch}>{sel.matchLabel}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerMetaRow}>
            <Text style={styles.footerMeta}>
              Múltipla de {selections.length}-{'\n'}seleções = 1
            </Text>
            <Text style={styles.footerTotalOdd}>{totalOdd.toFixed(2)}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.amountInput}
                value={betAmount}
                onChangeText={setBetAmount}
                keyboardType="decimal-pad"
                placeholder="R$ 0,00"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
              <TouchableOpacity style={styles.maxBtn}>
                <Text style={styles.maxBtnText}>MÁX</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.apostBtn}>
            <Text style={styles.apostBtnText}>APOSTE JÁ</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

/* ── Bottom Bar (shown when cupom has items but is closed) ── */
export function BetCupomBar() {
  const { selections, totalOdd, betAmount, isCupomOpen, openCupom } = useBetCupom();
  const insets = useSafeAreaInsets();

  if (selections.length === 0 || isCupomOpen) return null;

  const numBet = parseFloat(betAmount.replace(',', '.')) || 0;
  const gain = numBet > 0 ? (numBet * totalOdd).toFixed(2).replace('.', ',') : '0,00';

  return (
    <View style={[barStyles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }]}>
      <View style={barStyles.stats}>
        <View style={barStyles.stat}>
          <Text style={barStyles.statLabel}>ODDS</Text>
          <Text style={barStyles.statValue}>{totalOdd.toFixed(2)}</Text>
        </View>
        <View style={barStyles.divider} />
        <View style={barStyles.stat}>
          <Text style={barStyles.statLabel}>APOSTA</Text>
          <Text style={barStyles.statValue}>R$ {numBet > 0 ? numBet.toFixed(2).replace('.', ',') : '20,00'}</Text>
        </View>
        <View style={barStyles.divider} />
        <View style={barStyles.stat}>
          <Text style={barStyles.statLabel}>GANHO POTENCIAL</Text>
          <Text style={barStyles.statValue}>R$ {numBet > 0 ? gain : (totalOdd * 20).toFixed(2).replace('.', ',')}</Text>
        </View>
      </View>
      <View style={barStyles.rightActions}>
        <TouchableOpacity style={barStyles.todasBtn} onPress={openCupom}>
          <Text style={barStyles.todasBtnIcon}>🎟</Text>
          <Text style={barStyles.todasBtnText}>TODAS</Text>
          <View style={barStyles.badge}>
            <Text style={barStyles.badgeText}>{selections.length}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={barStyles.plusBtn} onPress={openCupom}>
          <Text style={barStyles.plusBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_H * 0.85,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },

  /* Header */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E63946',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeText: { fontSize: 18 },
  headerTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  iconBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  /* Tabs */
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#fff',
  },
  tabText: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: '#0D1E50' },

  /* List */
  list: { maxHeight: SCREEN_H * 0.4, paddingHorizontal: 16 },
  selItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
    gap: 12,
  },
  selIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selInfo: { flex: 1 },
  selTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selChoice: { color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 },
  selOdd: { color: '#fff', fontSize: 15, fontWeight: '700', marginRight: 12 },
  selRemove: { fontSize: 14 },
  selMarket: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
  selMatch: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },

  /* Footer */
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  footerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  footerMeta: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600', flex: 1 },
  footerTotalOdd: { color: '#fff', fontSize: 18, fontWeight: '900' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amountInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#fff',
    fontSize: 14,
    minWidth: 90,
  },
  maxBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  maxBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  apostBtn: {
    backgroundColor: '#38E67D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  apostBtnText: { color: '#023397', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
});

const barStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,  // #38E67D verde
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stat: { flex: 1 },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(1,24,79,0.25)',
  },
  statLabel: {
    color: colors.primaryDark,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    opacity: 0.7,
  },
  statValue: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  todasBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 5,
  },
  todasBtnIcon: { fontSize: 13 },
  todasBtnText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  badge: {
    backgroundColor: colors.secondary,
    borderRadius: 9,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: colors.primaryDark, fontSize: 9, fontWeight: '900' },
  plusBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBtnText: { color: colors.secondary, fontSize: 22, fontWeight: '900', lineHeight: 28 },
});

