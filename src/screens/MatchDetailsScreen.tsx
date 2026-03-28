import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';
import { useBetCupom } from '../context/BetCupomContext';
import { BetSelection } from '../types/sports';
import { GradientBackground } from '../components/GradientBackground';

const { width: SCREEN_W } = Dimensions.get('window');

function ArrowLeftIcon({ size = 24, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PulseDot() {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        width: 7, height: 7, borderRadius: 4,
        backgroundColor: '#FF3B3B', marginRight: 5, opacity: pulse,
      }}
    />
  );
}

// ─── DATA ───
const STATS = [
  { label: 'Escanteios', value: '7' },
  { label: 'Amarelos', value: '3' },
  { label: 'Posse INT', value: '62%' },
  { label: 'Chutes', value: '8' },
];

const TABS = ['Resultado', 'Gols', 'Cartões', 'Escanteios', '1º Tempo'];

// ─── Clickable Odd ───
function OddBox({ id, label, odd, market, matchLabel, league }: {
  id: string; label: string; odd: string; market: string; matchLabel: string; league: string;
}) {
  const { addSelection, hasSelection } = useBetCupom();
  const selected = hasSelection(id);

  function handlePress() {
    addSelection({ id, matchLabel, oddLabel: market, choiceLabel: label, oddValue: parseFloat(odd), league });
  }

  return (
    <TouchableOpacity style={[s.oddBox, selected && s.oddBoxSel]} onPress={handlePress} activeOpacity={0.7}>
      <Text style={s.oddLabel}>{label}</Text>
      <Text style={[s.oddVal, selected && s.oddValSel]}>{odd}</Text>
    </TouchableOpacity>
  );
}

function OddsRow({ options, market, matchLabel, league }: {
  options: { id: string; label: string; odd: string }[]; market: string; matchLabel: string; league: string;
}) {
  return (
    <View style={s.oddsRow}>
      {options.map(o => <OddBox key={o.id} {...o} market={market} matchLabel={matchLabel} league={league} />)}
    </View>
  );
}

function OverUnderRow({ label, over, under, market, matchLabel, league }: {
  label: string; over: { id: string; val: string }; under: { id: string; val: string };
  market: string; matchLabel: string; league: string;
}) {
  return (
    <View style={s.ouRow}>
      <View style={s.ouLabelBox}><Text style={s.ouLabel}>{label}</Text></View>
      <OddBox id={over.id} label="↑ Mais" odd={over.val} market={market} matchLabel={matchLabel} league={league} />
      <OddBox id={under.id} label="↓ Menos" odd={under.val} market={market} matchLabel={matchLabel} league={league} />
    </View>
  );
}

function MarketSection({ title, cashout, children }: { title: string; cashout?: boolean; children: React.ReactNode }) {
  return (
    <View style={s.marketBox}>
      <View style={s.marketHeader}>
        <Text style={s.marketTitle}>{title}</Text>
        {cashout && (
          <View style={s.cashoutBadge}>
            <View style={s.cashoutDot} />
            <Text style={s.cashoutText}>Cashout</Text>
          </View>
        )}
      </View>
      <View style={s.marketContent}>{children}</View>
    </View>
  );
}

// ─── TAB CONTENTS ───
function ResultadoTab({ matchLabel, league, homeTeam, awayTeam }: { matchLabel: string; league: string; homeTeam: string; awayTeam: string }) {
  return (
    <View style={s.tabContent}>
      <MarketSection title="Resultado final" cashout>
        <OddsRow market="Resultado Final" matchLabel={matchLabel} league={league} options={[
          { id: 'rf-home', label: homeTeam, odd: '1.73' },
          { id: 'rf-draw', label: 'Empate', odd: '3.40' },
          { id: 'rf-away', label: awayTeam, odd: '4.50' },
        ]} />
      </MarketSection>
      <MarketSection title="Dupla chance">
        <OddsRow market="Dupla Chance" matchLabel={matchLabel} league={league} options={[
          { id: 'dc-1', label: 'Casa ou emp.', odd: '1.73' },
          { id: 'dc-2', label: 'Casa ou fora', odd: '3.40' },
          { id: 'dc-3', label: 'Emp. ou fora', odd: '4.50' },
        ]} />
      </MarketSection>
    </View>
  );
}

function GolsTab({ matchLabel, league }: { matchLabel: string; league: string }) {
  return (
    <View style={s.tabContent}>
      <MarketSection title="Ambas marcam" cashout>
        <OddsRow market="Ambas Marcam" matchLabel={matchLabel} league={league} options={[
          { id: 'am-sim', label: 'SIM', odd: '1.73' },
          { id: 'am-nao', label: 'NÃO', odd: '1.73' },
        ]} />
      </MarketSection>
      <MarketSection title="Total de gols" cashout>
        <OverUnderRow label="+0.5" over={{ id: 'g1o', val: '1.15' }} under={{ id: 'g1u', val: '5.20' }} market="Total de Gols" matchLabel={matchLabel} league={league} />
        <OverUnderRow label="+1.5" over={{ id: 'g2o', val: '1.83' }} under={{ id: 'g2u', val: '2.15' }} market="Total de Gols" matchLabel={matchLabel} league={league} />
        <OverUnderRow label="+2.5" over={{ id: 'g3o', val: '2.80' }} under={{ id: 'g3u', val: '1.32' }} market="Total de Gols" matchLabel={matchLabel} league={league} />
      </MarketSection>
    </View>
  );
}

function CartoesTab({ matchLabel, league }: { matchLabel: string; league: string }) {
  return (
    <View style={s.tabContent}>
      <MarketSection title="🟥 Cartão vermelho" cashout>
        <Text style={s.marketDesc}>Algum jogador vai ser expulso nessa partida?</Text>
        <OddsRow market="Cartão Vermelho" matchLabel={matchLabel} league={league} options={[
          { id: 'cv-sim', label: 'SIM', odd: '1.73' },
          { id: 'cv-nao', label: 'NÃO', odd: '1.73' },
        ]} />
      </MarketSection>
      <MarketSection title="🟥 Cartão vermelho">
        <Text style={s.marketDesc}>Algum jogador vai ser expulso nessa partida?</Text>
        <OddsRow market="Cartão Vermelho 2" matchLabel={matchLabel} league={league} options={[
          { id: 'cv2-sim', label: 'SIM', odd: '1.73' },
          { id: 'cv2-nao', label: 'NÃO', odd: '1.73' },
        ]} />
      </MarketSection>
      <MarketSection title="🟨 Amarelos — Mais | Menos" cashout>
        <OverUnderRow label="+1.5" over={{ id: 'am1o', val: '1.15' }} under={{ id: 'am1u', val: '5.20' }} market="Amarelos" matchLabel={matchLabel} league={league} />
        <OverUnderRow label="+2.5" over={{ id: 'am2o', val: '1.83' }} under={{ id: 'am2u', val: '2.15' }} market="Amarelos" matchLabel={matchLabel} league={league} />
        <OverUnderRow label="+3.5" over={{ id: 'am3o', val: '2.80' }} under={{ id: 'am3u', val: '1.32' }} market="Amarelos" matchLabel={matchLabel} league={league} />
      </MarketSection>
    </View>
  );
}

function EscanteiosTab({ matchLabel, league }: { matchLabel: string; league: string }) {
  return (
    <View style={s.tabContent}>
      <MarketSection title="Total de escanteios" cashout>
        <OverUnderRow label="+7.5" over={{ id: 'e1o', val: '1.55' }} under={{ id: 'e1u', val: '2.30' }} market="Escanteios" matchLabel={matchLabel} league={league} />
        <OverUnderRow label="+8.5" over={{ id: 'e2o', val: '1.88' }} under={{ id: 'e2u', val: '1.88' }} market="Escanteios" matchLabel={matchLabel} league={league} />
        <OverUnderRow label="+10.5" over={{ id: 'e3o', val: '2.62' }} under={{ id: 'e3u', val: '1.42' }} market="Escanteios" matchLabel={matchLabel} league={league} />
      </MarketSection>
    </View>
  );
}

// ─── BET SLIP DROPDOWN (drops from header) ───
function BetSlipDropdown({ navigation }: { navigation: any }) {
  const { selections, totalOdd, betAmount, setBetAmount, removeSelection, clearSelections, openCupom } = useBetCupom();
  const [confirmed, setConfirmed] = useState(false);
  const numBet = parseFloat(betAmount.replace(',', '.')) || 0;
  const gain = numBet > 0 ? (numBet * totalOdd).toFixed(2).replace('.', ',') : '0,00';

  if (selections.length === 0) return null;

  function handleApostar() {
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      navigation.goBack();
    }, 1200);
  }

  return (
    <View style={s.slipDrop}>
      {/* Row: ODDS | APOSTA | GANHO POTENCIAL */}
      <View style={s.slipStatsRow}>
        <View style={s.slipStat}>
          <Text style={s.slipStatLabel}>ODDS</Text>
          <Text style={s.slipStatVal}>{totalOdd.toFixed(2)}</Text>
        </View>
        <View style={s.slipDivider} />
        <View style={s.slipStat}>
          <Text style={s.slipStatLabel}>APOSTA</Text>
          <View style={s.slipInputWrap}>
            <Text style={s.slipInputPrefix}>R$</Text>
            <TextInput
              style={s.slipInput}
              value={betAmount}
              onChangeText={setBetAmount}
              keyboardType="decimal-pad"
              placeholder="20,00"
              placeholderTextColor="rgba(1,24,79,0.4)"
            />
          </View>
        </View>
        <View style={s.slipDivider} />
        <View style={s.slipStat}>
          <Text style={s.slipStatLabel}>GANHO POTENCIAL</Text>
          <Text style={s.slipStatVal}>R$ {numBet > 0 ? gain : (totalOdd * 20).toFixed(2).replace('.', ',')}</Text>
        </View>
      </View>
      {/* Botão APOSTE JÁ / ✓ */}
      <TouchableOpacity
        style={[s.slipApostBtn, confirmed && s.slipApostBtnCheck]}
        onPress={!confirmed ? handleApostar : undefined}
        activeOpacity={0.8}
      >
        <Text style={[s.slipApostTxt, confirmed && s.slipApostTxtCheck]}>
          {confirmed ? '✓' : 'APOSTE JÁ'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── MAIN SCREEN ───
type MatchDetailsRouteProps = {
  params: { matchId?: string; league?: string; homeTeam?: string; awayTeam?: string };
};

export default function MatchDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MatchDetailsRouteProps, 'params'>>();
  const { selections } = useBetCupom();
  const [activeTab, setActiveTab] = useState('Resultado');

  const homeTeam = route.params?.homeTeam || 'Bragantino';
  const awayTeam = route.params?.awayTeam || 'Botafogo';
  const league = route.params?.league || 'Brasileirão série A - Rodada 5';
  const matchLabel = `${homeTeam} vs ${awayTeam}`;

  return (
    <GradientBackground style={[s.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={s.header}>
        <Pressable hitSlop={15} onPress={() => navigation.goBack()} style={s.backBtn}>
          <ArrowLeftIcon />
        </Pressable>
        <Text style={s.leagueText} numberOfLines={1}>{league}</Text>
        <View style={s.aoVivoBadge}>
          <PulseDot />
          <Text style={s.aoVivoText}>AO VIVO</Text>
        </View>
      </View>

      {/* BET SLIP DROPDOWN (below header, green bar) */}
      <BetSlipDropdown navigation={navigation} />

      {/* SCOREBOARD */}
      <View style={s.scoreboard}>
        <View style={s.teamSide}>
          <View style={[s.shieldMock, { backgroundColor: '#BB1C1C' }]}>
            <Text style={s.shieldText}>{homeTeam.substring(0, 2).toUpperCase()}</Text>
          </View>
          <Text style={s.teamName}>{homeTeam}</Text>
          <View style={s.formRow}>
            {['#0AF43D', '#0AF43D', '#0AF43D', '#FF3B3B', '#FF3B3B'].map((c, i) => (
              <View key={i} style={[s.formDot, { backgroundColor: c }]} />
            ))}
          </View>
        </View>
        <View style={s.scoreCenter}>
          <Text style={s.scoreText}>1 × 1</Text>
          <View style={s.timePill}><Text style={s.timeText}>38'</Text></View>
        </View>
        <View style={s.teamSide}>
          <View style={[s.shieldMock, { backgroundColor: '#0B3D8C' }]}>
            <Text style={s.shieldText}>{awayTeam.substring(0, 2).toUpperCase()}</Text>
          </View>
          <Text style={s.teamName}>{awayTeam}</Text>
          <View style={s.formRow}>
            {['#FF3B3B', '#0AF43D', '#FF3B3B', '#FF3B3B', '#0AF43D'].map((c, i) => (
              <View key={i} style={[s.formDot, { backgroundColor: c }]} />
            ))}
          </View>
        </View>
      </View>

      {/* STATS */}
      <View style={s.statsRow}>
        {STATS.map((st, i) => (
          <React.Fragment key={i}>
            <View style={s.statBox}>
              <Text style={s.statVal}>{st.value}</Text>
              <Text style={s.statLbl}>{st.label}</Text>
            </View>
            {i !== STATS.length - 1 && <View style={s.statDiv} />}
          </React.Fragment>
        ))}
      </View>

      {/* TABS */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabsScroll}>
          {TABS.map(t => {
            const active = activeTab === t;
            return (
              <Pressable key={t} onPress={() => setActiveTab(t)} style={s.tabBtn}>
                <Text style={[s.tabTxt, active && s.tabTxtActive]}>{t}</Text>
                {active && <View style={s.tabInd} />}
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={s.tabLine} />
      </View>

      {/* TAB CONTENT */}
      <ScrollView contentContainerStyle={{ paddingBottom: 88 + (insets.bottom || 10) + 60 }} showsVerticalScrollIndicator={false}>
        {activeTab === 'Resultado' && <ResultadoTab matchLabel={matchLabel} league={league} homeTeam={homeTeam} awayTeam={awayTeam} />}
        {activeTab === 'Gols' && <GolsTab matchLabel={matchLabel} league={league} />}
        {activeTab === 'Cartões' && <CartoesTab matchLabel={matchLabel} league={league} />}
        {activeTab === 'Escanteios' && <EscanteiosTab matchLabel={matchLabel} league={league} />}
        {activeTab === '1º Tempo' && (
          <View style={s.tabContent}><Text style={s.emptyLabel}>MERCADOS DO 1º TEMPO EM BREVE</Text></View>
        )}
      </ScrollView>
    </GradientBackground>
  );
}

// ─── STYLES ───
const s = StyleSheet.create({
  container: { flex: 1 },

  /* Header */
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  backBtn: { paddingRight: 4 },
  leagueText: { flex: 1, color: '#8A99BB', fontSize: 12, fontWeight: '700' },
  aoVivoBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,59,59,0.12)', borderWidth: 1, borderColor: '#FF3B3B',
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4,
  },
  aoVivoText: { color: '#FF3B3B', fontSize: 10, fontWeight: '800' },

  /* Bet Slip Dropdown (green bar under header) */
  slipDrop: {
    backgroundColor: colors.secondary, // verde #38E67D
    paddingVertical: 10, paddingHorizontal: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  slipStatsRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  slipStat: { flex: 1 },
  slipDivider: { width: 1, height: 28, backgroundColor: 'rgba(1,24,79,0.2)' },
  slipStatLabel: { color: colors.primaryDark, fontSize: 8, fontWeight: '800', textTransform: 'uppercase', opacity: 0.7 },
  slipStatVal: { color: colors.primaryDark, fontSize: 13, fontWeight: '900' },
  slipInputWrap: { flexDirection: 'row', alignItems: 'center' },
  slipInputPrefix: { color: colors.primaryDark, fontSize: 13, fontWeight: '900' },
  slipInput: { color: colors.primaryDark, fontSize: 13, fontWeight: '900', padding: 0, minWidth: 50 },
  slipActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  slipTodasBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7,
  },
  slipTodasIcon: { fontSize: 13 },
  slipTodasText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  slipBadge: {
    backgroundColor: colors.secondary, borderRadius: 9, width: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  slipBadgeText: { color: colors.primaryDark, fontSize: 9, fontWeight: '900' },
  slipPlusBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  slipPlusTxt: { color: colors.secondary, fontSize: 22, fontWeight: '900', lineHeight: 28 },

  /* Scoreboard */
  scoreboard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, paddingTop: 8 },
  teamSide: { alignItems: 'center', width: 90 },
  shieldMock: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  shieldText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  teamName: { color: '#fff', fontSize: 13, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  formRow: { flexDirection: 'row', gap: 3 },
  formDot: { width: 14, height: 5, borderRadius: 3 },
  scoreCenter: { alignItems: 'center' },
  scoreText: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: 2 },
  timePill: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, marginTop: 4 },
  timeText: { color: '#8A99BB', fontSize: 12, fontWeight: '700' },

  /* Stats */
  statsRow: {
    flexDirection: 'row', marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 14,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statVal: { color: '#fff', fontSize: 15, fontWeight: '800' },
  statLbl: { color: '#8A99BB', fontSize: 10, fontWeight: '600', marginTop: 2, textAlign: 'center' },
  statDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },

  /* Tabs */
  tabsScroll: { paddingHorizontal: 12 },
  tabBtn: { paddingHorizontal: 14, paddingVertical: 12, position: 'relative', marginRight: 4 },
  tabTxt: { color: '#8A99BB', fontSize: 14, fontWeight: '700' },
  tabTxtActive: { color: colors.secondary },
  tabInd: { position: 'absolute', bottom: 0, left: 14, right: 14, height: 2, backgroundColor: colors.secondary, borderTopLeftRadius: 2, borderTopRightRadius: 2 },
  tabLine: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },

  /* Content */
  tabContent: { paddingHorizontal: 12, paddingTop: 12 },
  marketBox: {
    backgroundColor: '#13245B', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 12, overflow: 'hidden',
  },
  marketHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  marketTitle: { color: '#8A99BB', fontSize: 12, fontWeight: '800', letterSpacing: 0.4 },
  cashoutBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: colors.secondary, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2,
  },
  cashoutDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.secondary },
  cashoutText: { color: colors.secondary, fontSize: 9, fontWeight: '800' },
  marketContent: { padding: 10, gap: 8 },
  marketDesc: { color: '#8A99BB', fontSize: 12, marginHorizontal: 2, marginBottom: 8, fontWeight: '600' },

  /* Odds */
  oddsRow: { flexDirection: 'row', gap: 6 },
  oddBox: {
    flex: 1, backgroundColor: '#1C2F70', borderRadius: 10,
    alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4,
    borderWidth: 1.5, borderColor: 'transparent', gap: 4, position: 'relative',
  },
  oddBoxSel: { backgroundColor: 'rgba(56,230,125,0.12)', borderColor: colors.secondary },
  oddLabel: { color: '#8A99BB', fontSize: 11, fontWeight: '600', textAlign: 'center' },
  oddVal: { color: '#fff', fontSize: 16, fontWeight: '900' },
  oddValSel: { color: colors.secondary },

  /* Over/Under */
  ouRow: { flexDirection: 'row', alignItems: 'stretch', gap: 6 },
  ouLabelBox: { backgroundColor: '#1E3278', borderRadius: 10, alignItems: 'center', justifyContent: 'center', width: 52, paddingVertical: 12 },
  ouLabel: { color: '#8A99BB', fontSize: 12, fontWeight: '700' },

  emptyLabel: { color: '#34477A', fontSize: 11, fontWeight: '800', textAlign: 'center', margin: 20 },

  /* APOSTE JÁ button */
  slipApostBtn: {
    backgroundColor: colors.primary, borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 10,
    alignItems: 'center', justifyContent: 'center', minWidth: 100,
  },
  slipApostBtnCheck: {
    backgroundColor: colors.secondary,
  },
  slipApostTxt: { color: colors.white, fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  slipApostTxtCheck: { color: colors.primaryDark, fontSize: 20 },
});
