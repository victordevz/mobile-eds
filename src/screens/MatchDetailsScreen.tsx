import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';
import { useBetCupom } from '../context/BetCupomContext';
import { BetSelection } from '../types/sports';

const { width: SCREEN_W } = Dimensions.get('window');

function ArrowLeftIcon({ size = 24, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18l-6-6 6-6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#FF3B3B',
        marginRight: 5,
        opacity: pulse,
      }}
    />
  );
}

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────
const STATS = [
  { label: 'Escanteios', value: '7' },
  { label: 'Amarelos', value: '3' },
  { label: 'Posse INT', value: '62%' },
  { label: 'Chutes', value: '8' },
];

const TABS = ['Resultado', 'Gols', 'Cartões', 'Escanteios', '1º Tempo'];

// ─────────────────────────────────────────
// Odds clickable box
// ─────────────────────────────────────────
function OddBox({
  id,
  label,
  odd,
  market,
  matchLabel,
  league,
}: {
  id: string;
  label: string;
  odd: string;
  market: string;
  matchLabel: string;
  league: string;
}) {
  const { addSelection, hasSelection, openCupom } = useBetCupom();
  const selected = hasSelection(id);

  function handlePress() {
    const sel: BetSelection = {
      id,
      matchLabel,
      oddLabel: market,
      choiceLabel: label,
      oddValue: parseFloat(odd),
      league,
    };
    addSelection(sel);
    openCupom();
  }

  return (
    <TouchableOpacity
      style={[styles.oddBox, selected && styles.oddBoxSelected]}
      onPress={handlePress}
    >
      <Text style={styles.oddLabelGrid}>{label}</Text>
      <Text style={[styles.oddVal, selected && styles.oddValSelected]}>{odd}</Text>
      {selected && (
        <View style={{ position: 'absolute', top: 4, right: 6 }}>
          <Text style={{ color: '#0AF43D', fontSize: 10 }}>▲</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function OddsGrid3({
  options,
  market,
  matchLabel,
  league,
}: {
  options: { id: string; label: string; odd: string }[];
  market: string;
  matchLabel: string;
  league: string;
}) {
  return (
    <View style={styles.oddsRow}>
      {options.map((opt) => (
        <OddBox key={opt.id} {...opt} market={market} matchLabel={matchLabel} league={league} />
      ))}
    </View>
  );
}

function OddsGrid2({
  options,
  market,
  matchLabel,
  league,
}: {
  options: { id: string; label: string; odd: string }[];
  market: string;
  matchLabel: string;
  league: string;
}) {
  return (
    <View style={styles.oddsRow}>
      {options.map((opt) => (
        <OddBox key={opt.id} {...opt} market={market} matchLabel={matchLabel} league={league} />
      ))}
    </View>
  );
}

function OverUnderRow({
  label,
  over,
  under,
  market,
  matchLabel,
  league,
}: {
  label: string;
  over: { id: string; val: string };
  under: { id: string; val: string };
  market: string;
  matchLabel: string;
  league: string;
}) {
  return (
    <View style={styles.ouRow}>
      <View style={styles.ouLabelBox}>
        <Text style={styles.ouLabel}>{label}</Text>
      </View>
      <OddBox id={over.id} label="↑ Mais" odd={over.val} market={market} matchLabel={matchLabel} league={league} />
      <OddBox id={under.id} label="↓ Menos" odd={under.val} market={market} matchLabel={matchLabel} league={league} />
    </View>
  );
}

function MarketSection({ title, cashout, children }: { title: string; cashout?: boolean; children: React.ReactNode }) {
  return (
    <View style={styles.marketBox}>
      <View style={styles.marketHeader}>
        <Text style={styles.marketTitle}>{title}</Text>
        {cashout && (
          <View style={styles.cashoutBadge}>
            <View style={styles.cashoutDot} />
            <Text style={styles.cashoutText}>Cashout</Text>
          </View>
        )}
      </View>
      <View style={styles.marketContent}>{children}</View>
    </View>
  );
}

// ─────────────────────────────────────────
// TAB CONTENT
// ─────────────────────────────────────────
function ResultadoTab({ matchLabel, league }: { matchLabel: string; league: string }) {
  return (
    <View style={styles.tabContent}>
      <MarketSection title="RESULTADO FINAL" cashout>
        <OddsGrid3
          market="Resultado Final"
          matchLabel={matchLabel}
          league={league}
          options={[
            { id: 'rf-home', label: 'Bragantino', odd: '1.73' },
            { id: 'rf-draw', label: 'Empate', odd: '3.40' },
            { id: 'rf-away', label: 'Botafogo', odd: '4.50' },
          ]}
        />
      </MarketSection>

      <MarketSection title="DUPLA CHANCE">
        <OddsGrid3
          market="Dupla Chance"
          matchLabel={matchLabel}
          league={league}
          options={[
            { id: 'dc-1', label: 'Casa ou emp.', odd: '1.18' },
            { id: 'dc-2', label: 'Casa ou Fora', odd: '1.12' },
            { id: 'dc-3', label: 'Emp. ou Fora', odd: '4.50' },
          ]}
        />
      </MarketSection>
    </View>
  );
}

function GolsTab({ matchLabel, league }: { matchLabel: string; league: string }) {
  return (
    <View style={styles.tabContent}>
      <MarketSection title="AMBAS MARCAM" cashout>
        <OddsGrid2
          market="Ambas Marcam"
          matchLabel={matchLabel}
          league={league}
          options={[
            { id: 'am-sim', label: 'SIM', odd: '1.73' },
            { id: 'am-nao', label: 'NÃO', odd: '1.73' },
          ]}
        />
      </MarketSection>

      <MarketSection title="TOTAL DE GOLS" cashout>
        <OverUnderRow label="+0.5" over={{ id: 'g1-over', val: '1.15' }} under={{ id: 'g1-under', val: '5.20' }} market="Total de Gols" matchLabel={matchLabel} league={league} />
        <OverUnderRow label="+1.5" over={{ id: 'g2-over', val: '1.83' }} under={{ id: 'g2-under', val: '2.15' }} market="Total de Gols" matchLabel={matchLabel} league={league} />
        <OverUnderRow label="+2.5" over={{ id: 'g3-over', val: '2.80' }} under={{ id: 'g3-under', val: '1.32' }} market="Total de Gols" matchLabel={matchLabel} league={league} />
      </MarketSection>
    </View>
  );
}

function CartoesTab({ matchLabel, league }: { matchLabel: string; league: string }) {
  return (
    <View style={styles.tabContent}>
      <MarketSection title="CARTÃO VERMELHO" cashout>
        <Text style={styles.marketDesc}>Algum jogador vai ser expulso nessa partida?</Text>
        <OddsGrid2
          market="Cartão Vermelho"
          matchLabel={matchLabel}
          league={league}
          options={[
            { id: 'cv-sim', label: 'SIM', odd: '1.73' },
            { id: 'cv-nao', label: 'NÃO', odd: '1.73' },
          ]}
        />
      </MarketSection>

      <MarketSection title="CARTÃO VERMELHO">
        <Text style={styles.marketDesc}>Algum jogador vai ser expulso nessa partida?</Text>
        <OddsGrid2
          market="Cartão Vermelho 2"
          matchLabel={matchLabel}
          league={league}
          options={[
            { id: 'cv2-sim', label: 'SIM', odd: '1.73' },
            { id: 'cv2-nao', label: 'NÃO', odd: '1.73' },
          ]}
        />
      </MarketSection>

      <MarketSection title="🟨 AMARELOS — MAIS/MENOS">
        <OverUnderRow label="+1.5" over={{ id: 'am1-over', val: '1.15' }} under={{ id: 'am1-under', val: '5.20' }} market="Amarelos" matchLabel={matchLabel} league={league} />
        <OverUnderRow label="+2.5" over={{ id: 'am2-over', val: '1.83' }} under={{ id: 'am2-under', val: '2.15' }} market="Amarelos" matchLabel={matchLabel} league={league} />
        <OverUnderRow label="+3.5" over={{ id: 'am3-over', val: '2.80' }} under={{ id: 'am3-under', val: '1.32' }} market="Amarelos" matchLabel={matchLabel} league={league} />
      </MarketSection>
    </View>
  );
}

function EscanteiosTab({ matchLabel, league }: { matchLabel: string; league: string }) {
  return (
    <View style={styles.tabContent}>
      <MarketSection title="TOTAL DE ESCANTEIOS" cashout>
        <OverUnderRow label="+7.5" over={{ id: 'e1-over', val: '1.55' }} under={{ id: 'e1-under', val: '2.30' }} market="Escanteios" matchLabel={matchLabel} league={league} />
        <OverUnderRow label="+8.5" over={{ id: 'e2-over', val: '1.88' }} under={{ id: 'e2-under', val: '1.88' }} market="Escanteios" matchLabel={matchLabel} league={league} />
        <OverUnderRow label="+10.5" over={{ id: 'e3-over', val: '2.62' }} under={{ id: 'e3-under', val: '1.42' }} market="Escanteios" matchLabel={matchLabel} league={league} />
      </MarketSection>
    </View>
  );
}

// ─────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────
type MatchDetailsRouteProps = {
  params: {
    matchId?: string;
    league?: string;
    homeTeam?: string;
    awayTeam?: string;
  };
};

export default function MatchDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MatchDetailsRouteProps, 'params'>>();
  const { selections, openCupom } = useBetCupom();

  const [activeTab, setActiveTab] = useState('Resultado');

  const homeTeam = route.params?.homeTeam || 'Bragantino';
  const awayTeam = route.params?.awayTeam || 'Botafogo';
  const league = route.params?.league || 'Brasileirão série A - Rodada 5';
  const matchLabel = `${homeTeam} vs ${awayTeam}`;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable hitSlop={15} onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeftIcon />
        </Pressable>
        <Text style={styles.leagueText} numberOfLines={1}>{league}</Text>
        <View style={styles.aoVivoBadge}>
          <PulseDot />
          <Text style={styles.aoVivoText}>AO VIVO</Text>
        </View>
      </View>

      {/* PLACAR */}
      <View style={styles.scoreboard}>
        <View style={styles.teamSide}>
          <View style={[styles.shieldMock, { backgroundColor: '#BB1C1C' }]}>
            <Text style={styles.shieldText}>{homeTeam.substring(0, 2).toUpperCase()}</Text>
          </View>
          <Text style={styles.teamName}>{homeTeam}</Text>
          <View style={styles.formRow}>
            {['#0AF43D', '#0AF43D', '#0AF43D', '#FF3B3B', '#FF3B3B'].map((c, i) => (
              <View key={i} style={[styles.formDot, { backgroundColor: c }]} />
            ))}
          </View>
        </View>

        <View style={styles.scoreCenter}>
          <Text style={styles.scoreText}>1 × 1</Text>
          <View style={styles.timePill}>
            <Text style={styles.timeText}>38'</Text>
          </View>
        </View>

        <View style={styles.teamSide}>
          <View style={[styles.shieldMock, { backgroundColor: '#0B3D8C' }]}>
            <Text style={styles.shieldText}>{awayTeam.substring(0, 2).toUpperCase()}</Text>
          </View>
          <Text style={styles.teamName}>{awayTeam}</Text>
          <View style={styles.formRow}>
            {['#FF3B3B', '#0AF43D', '#FF3B3B', '#FF3B3B', '#0AF43D'].map((c, i) => (
              <View key={i} style={[styles.formDot, { backgroundColor: c }]} />
            ))}
          </View>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        {STATS.map((s, i) => (
          <React.Fragment key={i}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
            {i !== STATS.length - 1 && <View style={styles.statDivider} />}
          </React.Fragment>
        ))}
      </View>

      {/* TABS */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {TABS.map(t => {
            const isActive = activeTab === t;
            return (
              <Pressable key={t} onPress={() => setActiveTab(t)} style={styles.tabBtn}>
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{t}</Text>
                {isActive && <View style={styles.tabIndicator} />}
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={styles.tabBorderLine} />
      </View>

      {/* TAB CONTENT */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: selections.length > 0 ? 160 : 100 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'Resultado' && <ResultadoTab matchLabel={matchLabel} league={league} />}
        {activeTab === 'Gols' && <GolsTab matchLabel={matchLabel} league={league} />}
        {activeTab === 'Cartões' && <CartoesTab matchLabel={matchLabel} league={league} />}
        {activeTab === 'Escanteios' && <EscanteiosTab matchLabel={matchLabel} league={league} />}
        {activeTab === '1º Tempo' && (
          <View style={styles.tabContent}>
            <Text style={styles.centerSubLabel}>MERCADOS DO 1º TEMPO EM BREVE</Text>
          </View>
        )}
      </ScrollView>

      {/* CUPOM FLOAT BAR */}
      {selections.length > 0 && (
        <TouchableOpacity style={[styles.cupomBar, { paddingBottom: Math.max(insets.bottom, 16) }]} onPress={openCupom}>
          <View style={styles.cupomBadge}>
            <Text style={styles.cupomBadgeText}>{selections.length}</Text>
          </View>
          <Text style={styles.cupomTotal}>{selections.reduce((a, s) => a * s.oddValue, 1).toFixed(2)}</Text>
          <View style={{ flex: 1 }} />
          <View style={styles.cupomBtn}>
            <Text style={styles.cupomBtnText}>APOSTE JÁ</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1E50',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  backBtn: { paddingRight: 4 },
  leagueText: {
    flex: 1,
    color: '#8A99BB',
    fontSize: 12,
    fontWeight: '700',
  },
  aoVivoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,59,59,0.12)',
    borderWidth: 1,
    borderColor: '#FF3B3B',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  aoVivoText: { color: '#FF3B3B', fontSize: 10, fontWeight: '800' },

  /* SCOREBOARD */
  scoreboard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  teamSide: { alignItems: 'center', width: 90 },
  shieldMock: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  shieldText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  teamName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  formRow: { flexDirection: 'row', gap: 3 },
  formDot: { width: 14, height: 5, borderRadius: 3 },
  scoreCenter: { alignItems: 'center' },
  scoreText: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: 2 },
  timePill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 4,
  },
  timeText: { color: '#8A99BB', fontSize: 12, fontWeight: '700' },

  /* STATS */
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 14,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statVal: { color: '#fff', fontSize: 15, fontWeight: '800' },
  statLabel: { color: '#8A99BB', fontSize: 10, fontWeight: '600', marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },

  /* TABS */
  tabsScroll: { paddingHorizontal: 12 },
  tabBtn: { paddingHorizontal: 14, paddingVertical: 12, position: 'relative', marginRight: 4 },
  tabText: { color: '#8A99BB', fontSize: 14, fontWeight: '700' },
  tabTextActive: { color: '#0AF43D' },
  tabIndicator: {
    position: 'absolute',
    bottom: 0, left: 14, right: 14,
    height: 2,
    backgroundColor: '#0AF43D',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  tabBorderLine: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  /* CONTENT */
  tabContent: { paddingHorizontal: 12, paddingTop: 12 },
  marketBox: {
    backgroundColor: '#13245B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 12,
    overflow: 'hidden',
  },
  marketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  marketTitle: { color: '#8A99BB', fontSize: 12, fontWeight: '800', letterSpacing: 0.4 },
  cashoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
  cashoutDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#FCA311' },
  cashoutText: { color: '#FCA311', fontSize: 9, fontWeight: '800' },
  marketContent: { padding: 10, gap: 8 },
  marketDesc: { color: '#8A99BB', fontSize: 12, marginHorizontal: 2, marginBottom: 8, fontWeight: '600' },

  /* ODDS */
  oddsRow: { flexDirection: 'row', gap: 6 },
  oddBox: {
    flex: 1,
    backgroundColor: '#1C2F70',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 4,
    position: 'relative',
  },
  oddBoxSelected: {
    backgroundColor: 'rgba(10,244,61,0.12)',
    borderColor: '#0AF43D',
  },
  oddLabelGrid: { color: '#8A99BB', fontSize: 11, fontWeight: '600', textAlign: 'center' },
  oddVal: { color: '#fff', fontSize: 16, fontWeight: '900' },
  oddValSelected: { color: '#0AF43D' },

  /* OVER/UNDER */
  ouRow: { flexDirection: 'row', alignItems: 'stretch', gap: 6 },
  ouLabelBox: {
    backgroundColor: '#1E3278',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    paddingVertical: 12,
  },
  ouLabel: { color: '#8A99BB', fontSize: 12, fontWeight: '700' },

  centerSubLabel: {
    color: '#34477A',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    margin: 20,
  },

  /* CUPOM FLOAT BAR */
  cupomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E63946',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  cupomBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cupomBadgeText: { color: '#E63946', fontSize: 13, fontWeight: '900' },
  cupomTotal: { color: '#fff', fontSize: 18, fontWeight: '900' },
  cupomBtn: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cupomBtnText: { color: '#E63946', fontSize: 14, fontWeight: '900' },
});
