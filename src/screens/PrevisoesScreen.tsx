import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';
import { GradientBackground } from '../components/GradientBackground';
import { useAuth } from '../context/AuthContext';
import { BetSlipPanel } from '../components/BetSlipPanel';
import { BetSlipData } from '../types/sports';
import Svg, { Circle, Path, Line, Rect } from 'react-native-svg';

const { width: SCREEN_W } = Dimensions.get('window');

// --- Icons Auxiliares ---

function ChevronIcon({ size = 10, color = colors.secondary, isOpen = false }: { size?: number; color?: string; isOpen?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }], marginLeft: 2 }}>
      <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SearchIcon({ size = 20, color = '#FFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
      <Line x1="16.5" y1="16.5" x2="22" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

// Icones Genéricos para Categorias
function GridIcon({ size = 16, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="3" width="7" height="7" rx="1" />
      <Rect x="14" y="3" width="7" height="7" rx="1" />
      <Rect x="14" y="14" width="7" height="7" rx="1" />
      <Rect x="3" y="14" width="7" height="7" rx="1" />
    </Svg>
  );
}

function BitcoinIcon({ size = 16, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M9 8h6a3 3 0 0 1 0 6H9" />
      <Path d="M9 14h6a3 3 0 0 1 0 6H9M12 6v2M12 20v-2M15 14H9" />
    </Svg>
  );
}

function BankIcon({ size = 16, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
    </Svg>
  );
}

function MonitorIcon({ size = 16, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <Line x1="8" y1="21" x2="16" y2="21" />
      <Line x1="12" y1="17" x2="12" y2="21" />
    </Svg>
  );
}

function DollarHandIcon({ size = 16, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Svg>
  );
}

function GlobeIcon({ size = 16, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Line x1="2" y1="12" x2="22" y2="12" />
      <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  );
}

const CATEGORIES = [
  { id: 'todos', label: 'Todos', Icon: GridIcon },
  { id: 'cripto', label: 'Cripto', Icon: BitcoinIcon },
  { id: 'politica', label: 'Política', Icon: BankIcon },
  { id: 'tech', label: 'Tech', Icon: MonitorIcon },
  { id: 'economia', label: 'Economia', Icon: DollarHandIcon },
  { id: 'mundo', label: 'Mundo', Icon: GlobeIcon },
];

export default function PrevisoesScreen() {
  const insets = useSafeAreaInsets();
  const { openMenu, openDepositModal, balance, isAuthenticated } = useAuth();
  const [activeCat, setActiveCat] = useState('todos');

  const balanceLabel = isAuthenticated && balance != null
    ? `R$ ${Number(balance).toFixed(2).replace('.', ',')}`
    : 'R$ 0,00';

  const [betSlip, setBetSlip] = useState<BetSlipData | null>(null);
  const [betAmount, setBetAmount] = useState('');

  const openBetSlip = (data: BetSlipData) => {
    if (!isAuthenticated) return;
    setBetSlip(data);
    setBetAmount('');
  };

  const closeBetSlip = () => {
    setBetSlip(null);
    setBetAmount('');
  };

  const handleConfirmBet = () => {
    closeBetSlip();
    // Previsões não navegam para match details por enquanto
  };

  const isSelected = (matchLabel: string, oddLabel: string) => {
    return betSlip?.matchLabel === matchLabel && betSlip?.oddLabel === oddLabel;
  };

  return (
    <GradientBackground style={styles.container}>
      {/* Fixed header Wrapper */}
      <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, backgroundColor: colors.primary }} />
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Image source={require('../../assets/logo.png')} style={{ width: 72, height: 24, resizeMode: 'contain', marginLeft: -8 }} />
            <View style={{ flex: 1 }} />
            <View style={styles.headerActions}>
              <View style={{ zIndex: 1, marginRight: 2 }}>
                <Pressable style={styles.searchIconBtn}>
                  <SearchIcon size={24} />
                </Pressable>
              </View>
              <Pressable style={styles.balancePill} onPress={openDepositModal}>
                <View style={styles.depositCircle}>
                  <View style={styles.plusHorizontal} />
                  <View style={styles.plusVertical} />
                </View>
                <Text style={styles.balanceValue}>{balanceLabel}</Text>
              </Pressable>
              <Pressable style={styles.menuBtn} onPress={openMenu}>
                <View style={styles.menuBar} />
                <View style={[styles.menuBar, { width: 16 }]} />
                <View style={styles.menuBar} />
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* BetSlip */}
      {betSlip && (
        <View style={{ position: 'absolute', top: insets.top + 72, left: 16, right: 16, zIndex: 100 }}>
          <BetSlipPanel
            data={betSlip}
            betAmount={betAmount}
            onChangeBet={setBetAmount}
            onClose={closeBetSlip}
            onConfirm={handleConfirmBet}
          />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Como Funciona Card */}
        <LinearGradient
          colors={['rgba(56, 230, 125, 0.25)', 'rgba(2, 51, 151, 0.4)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.infoCard}
        >
          <Text style={styles.infoCardTitle}>Como funciona</Text>
          <Text style={styles.infoCardText}>
            Compre SIM ou NÃO sobre eventos do mundo real. O preço é a probabilidade - acertou, multiplicou.
          </Text>
        </LinearGradient>

        {/* Categories Horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catContainer}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCat === cat.id;
            return (
              <Pressable
                key={cat.id}
                style={[styles.catPill, isActive ? styles.catPillActive : null]}
                onPress={() => setActiveCat(cat.id)}
              >
                <cat.Icon size={20} color={isActive ? colors.secondary : colors.white} />
                <Text style={[styles.catText, isActive ? styles.catTextActive : null]}>{cat.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Em alta */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Em alta</Text>
          <LineChartIcon />
        </View>
        
        <View style={styles.emAltaRow}>
          {/* Card 1 */}
          <View style={styles.predictCard}>
            <Text style={styles.predictTitle}>Bitcoin vai ultrapassar R$ 500k até dez/25?</Text>
            <ProgressBarRow
              label="SIM"
              value={67}
              color={colors.secondary}
              isActive={isSelected('Bitcoin vai ultrapassar R$ 500k até dez/25?', 'SIM')}
              onPress={() => openBetSlip({
                matchLabel: 'Bitcoin vai ultrapassar R$ 500k até dez/25?',
                oddLabel: 'SIM',
                oddValue: 1.50,
                league: 'Cripto'
              })}
            />
            <ProgressBarRow
              label="NÃO"
              value={33}
              color="#007BFF"
              isActive={isSelected('Bitcoin vai ultrapassar R$ 500k até dez/25?', 'NÃO')}
              onPress={() => openBetSlip({
                matchLabel: 'Bitcoin vai ultrapassar R$ 500k até dez/25?',
                oddLabel: 'NÃO',
                oddValue: 2.50,
                league: 'Cripto'
              })}
            />
          </View>
          {/* Card 2 */}
          <View style={styles.predictCard}>
            <Text style={styles.predictTitle}>EUA entrarão em recessão em 2025?</Text>
            <ProgressBarRow
              label="SIM"
              value={67}
              color={colors.secondary}
              isActive={isSelected('EUA entrarão em recessão em 2025?', 'SIM')}
              onPress={() => openBetSlip({
                matchLabel: 'EUA entrarão em recessão em 2025?',
                oddLabel: 'SIM',
                oddValue: 1.80,
                league: 'Economia'
              })}
            />
            <ProgressBarRow
              label="NÃO"
              value={33}
              color="#007BFF"
              isActive={isSelected('EUA entrarão em recessão em 2025?', 'NÃO')}
              onPress={() => openBetSlip({
                matchLabel: 'EUA entrarão em recessão em 2025?',
                oddLabel: 'NÃO',
                oddValue: 2.20,
                league: 'Economia'
              })}
            />
          </View>
        </View>

        {/* Destaques */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Destaques</Text>
        </View>

        {/* Destaque 1 */}
        <View style={[styles.predictCard, styles.predictCardFull]}>
          <Text style={styles.predictTitle}>A China invadirá Taiwan até o final de 2026?</Text>
          <View style={styles.buttonsRow}>
            <Pressable
              style={[
                styles.voteButton, 
                styles.voteButtonGreen,
                isSelected('A China invadirá Taiwan até o final de 2026?', 'SIM') && styles.voteButtonActive
              ]}
              onPress={() => openBetSlip({
                matchLabel: 'A China invadirá Taiwan até o final de 2026?',
                oddLabel: 'SIM',
                oddValue: 4.50,
                league: 'Mundo'
              })}
            >
              <Text style={[
                styles.voteButtonText,
                isSelected('A China invadirá Taiwan até o final de 2026?', 'SIM') && styles.voteButtonTextActive
              ]}>SIM</Text>
            </Pressable>
            <Pressable
              style={[
                styles.voteButton, 
                styles.voteButtonBlue,
                isSelected('A China invadirá Taiwan até o final de 2026?', 'NÃO') && styles.voteButtonActive
              ]}
              onPress={() => openBetSlip({
                matchLabel: 'A China invadirá Taiwan até o final de 2026?',
                oddLabel: 'NÃO',
                oddValue: 1.20,
                league: 'Mundo'
              })}
            >
              <Text style={[
                styles.voteButtonText,
                isSelected('A China invadirá Taiwan até o final de 2026?', 'NÃO') && styles.voteButtonTextActive
              ]}>NÃO</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.emAltaRow}>
          {/* Destaque 2 */}
          <View style={styles.predictCard}>
            <Text style={styles.predictTitle}>Kanye vai liberar o VALENTÃO até?...</Text>
            <View style={styles.buttonsRow}>
              <Pressable
                style={[
                  styles.voteButton, 
                  styles.voteButtonGreen, 
                  { paddingVertical: 8 },
                  isSelected('Kanye vai liberar o VALENTÃO até?...', 'SIM') && styles.voteButtonActive
                ]}
                onPress={() => openBetSlip({
                  matchLabel: 'Kanye vai liberar o VALENTÃO até?...',
                  oddLabel: 'SIM',
                  oddValue: 2.10,
                  league: 'Mundo'
                })}
              >
                <Text style={[
                  styles.voteButtonText,
                  isSelected('Kanye vai liberar o VALENTÃO até?...', 'SIM') && styles.voteButtonTextActive
                ]}>SIM</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.voteButton, 
                  styles.voteButtonBlue, 
                  { paddingVertical: 8 },
                  isSelected('Kanye vai liberar o VALENTÃO até?...', 'NÃO') && styles.voteButtonActive
                ]}
                onPress={() => openBetSlip({
                  matchLabel: 'Kanye vai liberar o VALENTÃO até?...',
                  oddLabel: 'NÃO',
                  oddValue: 1.80,
                  league: 'Mundo'
                })}
              >
                <Text style={[
                  styles.voteButtonText,
                  isSelected('Kanye vai liberar o VALENTÃO até?...', 'NÃO') && styles.voteButtonTextActive
                ]}>NÃO</Text>
              </Pressable>
            </View>
            <Text style={styles.subText}>Data te de 2026</Text>
          </View>
          {/* Destaque 3 */}
          <View style={styles.predictCard}>
            <Text style={styles.predictTitle}>O petróleo bruto atingirá até o final de março?</Text>
            <ProgressBarRow
              label="SIM"
              value={67}
              color={colors.secondary}
              isActive={isSelected('O petróleo bruto atingirá até o final de março?', 'SIM')}
              onPress={() => openBetSlip({
                matchLabel: 'O petróleo bruto atingirá até o final de março?',
                oddLabel: 'SIM',
                oddValue: 1.65,
                league: 'Economia'
              })}
            />
            <ProgressBarRow
              label="NÃO"
              value={33}
              color="#007BFF"
              isActive={isSelected('O petróleo bruto atingirá até o final de março?', 'NÃO')}
              onPress={() => openBetSlip({
                matchLabel: 'O petróleo bruto atingirá até o final de março?',
                oddLabel: 'NÃO',
                oddValue: 2.35,
                league: 'Economia'
              })}
            />
          </View>
        </View>

        {/* Destaque Live */}
        <View style={[styles.predictCard, styles.predictCardFull]}>
          <View style={styles.liveHeader}>
            <Text style={styles.predictTitle}>BTC 5 Minute Up or Down</Text>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.livePrice}>Live price <Text style={{ color: colors.secondary }}>$71,00</Text></Text>
            </View>
          </View>
          <View style={styles.buttonsRow}>
            <Pressable
              style={[
                styles.voteButton, 
                styles.voteButtonGreen,
                isSelected('BTC 5 Minute Up or Down', 'Pra cima') && styles.voteButtonActive
              ]}
              onPress={() => openBetSlip({
                matchLabel: 'BTC 5 Minute Up or Down',
                oddLabel: 'Pra cima',
                oddValue: 1.95,
                league: 'Cripto'
              })}
            >
              <Text style={[
                styles.voteButtonText,
                isSelected('BTC 5 Minute Up or Down', 'Pra cima') && styles.voteButtonTextActive
              ]}>Pra cima</Text>
            </Pressable>
            <Pressable
              style={[
                styles.voteButton, 
                styles.voteButtonBlue,
                isSelected('BTC 5 Minute Up or Down', 'Pra baixo') && styles.voteButtonActive
              ]}
              onPress={() => openBetSlip({
                matchLabel: 'BTC 5 Minute Up or Down',
                oddLabel: 'Pra baixo',
                oddValue: 1.95,
                league: 'Cripto'
              })}
            >
              <Text style={[
                styles.voteButtonText,
                isSelected('BTC 5 Minute Up or Down', 'Pra baixo') && styles.voteButtonTextActive
              ]}>Pra baixo</Text>
            </Pressable>
          </View>
        </View>
        
        {/* Tabbar Padding */}
        <View style={{ height: 120 }} />

      </ScrollView>
    </GradientBackground>
  );
}

// --- Components Internos Auxiliares ---

function ProgressBarRow({ label, value, color, onPress, isActive }: { label: string, value: number, color: string, onPress?: () => void, isActive?: boolean }) {
  return (
    <Pressable 
      style={[
        styles.progressRow,
        isActive && { padding: 2, borderRadius: 6, backgroundColor: 'rgba(56, 230, 125, 0.1)' }
      ]} 
      onPress={onPress}
    >
      <View style={[
        styles.progressBg, 
        { backgroundColor: color + '33' },
        isActive && { borderColor: color, borderWidth: 1 }
      ]}>
        <View style={[styles.progressFill, { width: `${value}%`, backgroundColor: color }]}>
          <Text style={[
            styles.progressLabelInside,
            isActive && { color: '#000' }
          ]}>{label}</Text>
        </View>
      </View>
      <Text style={[
        styles.progressPercentage,
        isActive && { color: colors.secondary }
      ]}>{value}%</Text>
    </Pressable>
  );
}

function LineChartIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 3v18h18" />
      <Path d="M18 9l-5 5-4-4-5 5" />
      <Path d="M18 9h-4M18 9v4" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020B24',
  },
  headerWrapper: {
    zIndex: 20,
  },
  headerContainer: {
    backgroundColor: colors.primary,
    paddingBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchIconBtn: {
    padding: 6,
  },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 50,
    paddingVertical: 5,
    paddingRight: 12,
    paddingLeft: 5,
    gap: 6,
  },
  depositCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusHorizontal: {
    position: 'absolute',
    width: 16,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: colors.primaryDark,
  },
  plusVertical: {
    position: 'absolute',
    width: 2.5,
    height: 16,
    borderRadius: 2,
    backgroundColor: colors.primaryDark,
  },
  balanceValue: {
    color: colors.secondary,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  menuBtn: {
    gap: 4,
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 2,
  },
  menuBar: {
    width: 22,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 230, 125, 0.3)',
    marginBottom: 16,
  },
  infoCardTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  infoCardText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    lineHeight: 18,
  },
  catContainer: {
    flexDirection: 'row',
    paddingBottom: 20,
    gap: 12,
  },
  catPill: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: 'rgba(2, 51, 151, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(56, 230, 125, 0.4)',
  },
  catPillActive: {
    backgroundColor: 'rgba(2, 51, 151, 0.6)',
    borderColor: colors.secondary,
  },
  catText: {
    color: colors.white,
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
  catTextActive: {
    color: colors.secondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emAltaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  predictCard: {
    flex: 1,
    backgroundColor: 'rgba(2, 51, 151, 0.2)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 230, 125, 0.3)',
  },
  predictCardFull: {
    flex: undefined,
    marginBottom: 16,
  },
  predictTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 18,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBg: {
    flex: 1,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  progressLabelInside: {
    color: '#000',
    fontSize: 11,
    fontWeight: 'bold',
  },
  progressPercentage: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    width: 32,
    textAlign: 'right',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  voteButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  voteButtonGreen: {
    backgroundColor: 'rgba(56, 230, 125, 0.15)',
    borderColor: 'rgba(56, 230, 125, 0.6)',
  },
  voteButtonBlue: {
    backgroundColor: 'rgba(0, 123, 255, 0.15)',
    borderColor: 'rgba(0, 123, 255, 0.6)',
  },
  voteButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  subText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    marginTop: 8,
  },
  liveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  livePrice: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
  },
  voteButtonActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  voteButtonTextActive: {
    color: colors.primaryDark,
  },
});
