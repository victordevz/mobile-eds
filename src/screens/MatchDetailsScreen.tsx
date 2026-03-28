import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated2, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSpring 
} from 'react-native-reanimated';
import { colors } from '../theme';
import { GradientBackground } from '../components/GradientBackground';


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
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF3B3B',
        marginRight: 6,
        opacity: pulse,
        shadowColor: '#FF3B3B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 2,
      }}
    />
  );
}

// ─────────────────────────────────────────
// FAKE DATA / MOCKS
// ─────────────────────────────────────────
const STATS = [
  { label: 'Escanteios', value: '7' },
  { label: 'Amarelos', value: '3' },
  { label: 'Posse INT', value: '62%' },
  { label: 'Chutes', value: '8' },
];

const TABS = ['Resultado', 'Gols', 'Cartões', 'Escanteios', '1º Tempo'];

// ─────────────────────────────────────────
// COMPONENTES AUXILIARES DE MERCADO
// ─────────────────────────────────────────

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

function OddsGrid3({ options }: { options: { label: string; odd: string; active?: boolean; alignRight?: boolean }[] }) {
  return (
    <View style={styles.oddsRow}>
      {options.map((opt, i) => (
        <View key={i} style={[styles.oddBox, opt.active && styles.oddBoxActive]}>
          <Text style={styles.oddLabelGrid}>{opt.label}</Text>
          <Text style={[styles.oddVal, opt.active && styles.oddValActive]}>{opt.odd}</Text>
          {opt.alignRight && opt.active && (
            <View style={{ position: 'absolute', top: 4, right: 6 }}>
              <Text style={{ color: '#0AF43D', fontSize: 10 }}>▲</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

function OddsGrid2({ options }: { options: { label: string; odd: string; active?: boolean }[] }) {
  return (
    <View style={styles.oddsRow}>
      {options.map((opt, i) => (
        <View key={i} style={[styles.oddBox, opt.active && styles.oddBoxActive, { paddingVertical: 14 }]}>
          <Text style={styles.oddLabelGrid}>{opt.label}</Text>
          <Text style={[styles.oddVal, opt.active && styles.oddValActive]}>{opt.odd}</Text>
        </View>
      ))}
    </View>
  );
}

function OverUnderRow({ label, over, under }: { label: string; over: { val: string; active?: boolean }; under: { val: string; active?: boolean } }) {
  return (
    <View style={styles.ouRow}>
      <View style={styles.ouLabelBox}>
        <Text style={styles.ouLabel}>{label}</Text>
      </View>
      <View style={[styles.ouOddBox, over.active && styles.oddBoxActive]}>
        <Text style={[styles.ouOddDir, over.active && { color: '#0AF43D' }]}>↑ Mais</Text>
        <Text style={[styles.oddVal, over.active && styles.oddValActive]}>{over.val}</Text>
      </View>
      <View style={[styles.ouOddBox, under.active && styles.oddBoxActive]}>
        <Text style={[styles.ouOddDir, under.active && { color: '#ff4d4d' }]}>↓ Menos</Text>
        <Text style={[styles.oddVal, under.active && styles.oddValActive]}>{under.val}</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────
// CONTEÚDO DAS ABAS
// ─────────────────────────────────────────

function ResultadoTab() {
  return (
    <View style={styles.tabContent}>
      <MarketSection title="RESULTADO FINAL" cashout>
        <OddsGrid3 options={[
          { label: 'Internacional', odd: '1.73' },
          { label: 'Empate', odd: '3.40' },
          { label: 'Chapecoense', odd: '4.50', alignRight: true },
        ]} />
      </MarketSection>

      <MarketSection title="DUPLA CHANCE">
        <OddsGrid3 options={[
          { label: 'Casa ou Emp.', odd: '1.18' },
          { label: 'Casa ou Fora', odd: '1.12' },
          { label: 'Emp. ou Fora', odd: '2.10' },
        ]} />
      </MarketSection>

      <MarketSection title="HANDICAP ASIÁTICO" cashout>
        <View style={styles.ouRow}>
          <View style={styles.ouLabelBox}><Text style={styles.ouLabel}>-0.5</Text></View>
          <View style={styles.ouOddBox}><Text style={styles.ouOddDir}>↑ Internacional</Text><Text style={styles.oddVal}>1.88</Text></View>
          <View style={styles.ouOddBox}><Text style={styles.ouOddDir}>↑ Chapecoense</Text><Text style={styles.oddVal}>1.88</Text></View>
        </View>
        <View style={styles.ouRow}>
          <View style={styles.ouLabelBox}><Text style={styles.ouLabel}>-1.5</Text></View>
          <View style={styles.ouOddBox}><Text style={styles.ouOddDir}>↑ Internacional</Text><Text style={styles.oddVal}>2.60</Text></View>
          <View style={styles.ouOddBox}><Text style={styles.ouOddDir}>↑ Chapecoense</Text><Text style={styles.oddVal}>1.45</Text></View>
        </View>
      </MarketSection>
    </View>
  );
}

function GolsTab() {
  return (
    <View style={styles.tabContent}>
      <MarketSection title="TOTAL DE GOLS" cashout>
        <OverUnderRow label="+0.5" over={{ val: '1.15' }} under={{ val: '5.20' }} />
        <OverUnderRow label="+1.5" over={{ val: '1.62' }} under={{ val: '2.15' }} />
        <OverUnderRow label="+2.5" over={{ val: '2.80', active: true }} under={{ val: '1.38' }} />
        <OverUnderRow label="+3.5" over={{ val: '5.10' }} under={{ val: '1.12', active: true }} />
      </MarketSection>

      <MarketSection title="AMBAS MARCAM" cashout>
        <OddsGrid2 options={[
          { label: 'Sim', odd: '1.95' },
          { label: 'Não', odd: '1.82' },
        ]} />
      </MarketSection>
    </View>
  );
}

function CartoesTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.centerSubLabel}>TOTAL DA PARTIDA</Text>
      
      <MarketSection title="🟨 AMARELOS — MAIS/MENOS" cashout>
        <OverUnderRow label="+1.5" over={{ val: '1.28' }} under={{ val: '3.60' }} />
        <OverUnderRow label="+2.5" over={{ val: '1.75' }} under={{ val: '2.00' }} />
        <OverUnderRow label="+3.5" over={{ val: '2.40' }} under={{ val: '1.55' }} />
        <OverUnderRow label="+4.5" over={{ val: '3.80' }} under={{ val: '1.22' }} />
      </MarketSection>

      <MarketSection title="🟥 CARTÃO VERMELHO">
        <Text style={styles.marketDesc}>Algum jogador vai ser expulso nessa partida?</Text>
        <View style={styles.oddsRow}>
          <View style={styles.oddBox}><Text style={{ color: '#0AF43D', fontWeight: '800', marginBottom: 4 }}>SIM</Text><Text style={styles.oddVal}>2.35</Text></View>
          <View style={styles.oddBox}><Text style={{ color: '#FF3B3B', fontWeight: '800', marginBottom: 4 }}>NÃO</Text><Text style={styles.oddVal}>1.58</Text></View>
        </View>
      </MarketSection>

      <MarketSection title="🟨 2º AMARELO = VERMELHO">
        <Text style={styles.marketDesc}>Algum jogador vai tomar dois amarelos e ser expulso?</Text>
        <View style={styles.oddsRow}>
          <View style={styles.oddBox}><Text style={{ color: '#0AF43D', fontWeight: '800', marginBottom: 4 }}>SIM</Text><Text style={styles.oddVal}>3.10</Text></View>
          <View style={styles.oddBox}><Text style={{ color: '#FF3B3B', fontWeight: '800', marginBottom: 4 }}>NÃO</Text><Text style={styles.oddVal}>1.32</Text></View>
        </View>
      </MarketSection>
      
      <Text style={styles.centerSubLabel}>POR TIME</Text>

      <MarketSection title="🟨 AMARELOS — INTERNACIONAL">
        <OverUnderRow label="+0.5" over={{ val: '1.55' }} under={{ val: '2.30' }} />
        <OverUnderRow label="+1.5" over={{ val: '2.20' }} under={{ val: '1.65' }} />
      </MarketSection>

      <MarketSection title="🟨 AMARELOS — CHAPECOENSE">
        <OverUnderRow label="+0.5" over={{ val: '1.48' }} under={{ val: '2.50' }} />
        <OverUnderRow label="+1.5" over={{ val: '2.10' }} under={{ val: '1.72' }} />
      </MarketSection>

      <Text style={styles.centerSubLabel}>QUEM LEVA MAIS</Text>
      
      <MarketSection title="🟨 TIME COM MAIS CARTÕES">
        <OddsGrid3 options={[
          { label: 'Internacional', odd: '2.05' },
          { label: 'Empate', odd: '4.80' },
          { label: 'Chapecoense', odd: '1.88' },
        ]} />
      </MarketSection>

    </View>
  );
}

function EscanteiosTab() {
  return (
    <View style={styles.tabContent}>
      <MarketSection title="TOTAL DE ESCANTEIOS" cashout>
        <OverUnderRow label="+7.5" over={{ val: '1.55' }} under={{ val: '2.30' }} />
        <OverUnderRow label="+8.5" over={{ val: '1.88' }} under={{ val: '1.88' }} />
        <OverUnderRow label="+10.5" over={{ val: '2.62' }} under={{ val: '1.42' }} />
      </MarketSection>
    </View>
  );
}

// ─────────────────────────────────────────
// TELA PRINCIPAL
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

  const [activeTab, setActiveTab] = useState('Resultado');

  const glow = useSharedValue(0.5);
  const scale = useSharedValue(1);

  useEffect(() => {
    glow.value = withRepeat(
      withTiming(0.9, { duration: 1200 }),
      -1,
      true
    );
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: glow.value,
  }));

  // Valores mock ou vindos dos params se possível
  const homeTeam = route.params?.homeTeam || 'Internacional';
  const awayTeam = route.params?.awayTeam || 'Chapecoense';
  const league = route.params?.league || 'BRASILEIRÃO SÉRIE A • RODADA 5';

  return (
    <GradientBackground style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1E50" />
      
      {/* HEADER TELA */}
      <View style={styles.header}>
        <Pressable hitSlop={15} onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeftIcon />
        </Pressable>
        <View style={styles.leagueBox}>
          <View style={styles.bolaVerde} />
          <Text style={styles.leagueText}>{league.toUpperCase()}</Text>
        </View>
        <View style={styles.aoVivoBadge}>
          <PulseDot />
          <Text style={styles.aoVivoText}>AO VIVO</Text>
        </View>
      </View>

      {/* PLACAR */}
      <View style={styles.scoreboard}>
        <View style={styles.teamSide}>
          <View style={[styles.shieldMock, { backgroundColor: '#E63946' }]}>
            <Text style={styles.shieldText}>{homeTeam.substring(0,2).toUpperCase()}</Text>
          </View>
          <Text style={styles.teamName}>{homeTeam}</Text>
          <View style={styles.formRow}>
            <View style={[styles.formDot, { backgroundColor: '#0AF43D' }]}/>
            <View style={[styles.formDot, { backgroundColor: '#0AF43D' }]}/>
            <View style={[styles.formDot, { backgroundColor: '#0AF43D' }]}/>
            <View style={[styles.formDot, { backgroundColor: '#FF3B3B' }]}/>
            <View style={[styles.formDot, { backgroundColor: '#FF3B3B' }]}/>
          </View>
        </View>

        <View style={styles.scoreCenter}>
          <Text style={styles.scoreText}>1 - 0</Text>
          <View style={styles.timePill}>
            <Text style={styles.timeText}>38'</Text>
          </View>
        </View>

        <View style={styles.teamSide}>
          <View style={[styles.shieldMock, { backgroundColor: '#2E8540' }]}>
            <Text style={styles.shieldText}>{awayTeam.substring(0,2).toUpperCase()}</Text>
          </View>
          <Text style={styles.teamName}>{awayTeam}</Text>
          <View style={styles.formRow}>
            <View style={[styles.formDot, { backgroundColor: '#FF3B3B' }]}/>
            <View style={[styles.formDot, { backgroundColor: '#0AF43D' }]}/>
            <View style={[styles.formDot, { backgroundColor: '#FF3B3B' }]}/>
            <View style={[styles.formDot, { backgroundColor: '#FF3B3B' }]}/>
            <View style={[styles.formDot, { backgroundColor: '#0AF43D' }]}/>
          </View>
        </View>
      </View>

      {/* STATS BASE */}
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
        <View style={styles.tabBorderLines} />
      </View>

      {/* TAB CONTENT */}
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 240 }]}>
        {activeTab === 'Resultado' && <ResultadoTab />}
        {activeTab === 'Gols' && <GolsTab />}
        {activeTab === 'Cartões' && <CartoesTab />}
        {activeTab === 'Escanteios' && <EscanteiosTab />}
        {activeTab === '1º Tempo' && <View style={styles.tabContent}><Text style={styles.centerSubLabel}>MERCADOS DO 1º TEMPO EM BREVE</Text></View>}
      </ScrollView>

      {/* FLOAT BOTTOM BAR */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.selectionCount}>
          <Text style={styles.selectionNumber}>2</Text>
        </View>
        <Text style={styles.selectionLabel}>2 seleções</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.oddTotal}>Odd 3.14</Text>
        {/* Quando clicado abriremos o verdadeiro BetSlipPanel com as odds escolhidas ou efetuará compra */}
        <Pressable 
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
          onPressIn={() => scale.value = withSpring(0.96)}
          onPressOut={() => scale.value = withSpring(1)}
        >
          <Animated2.View style={[styles.apostarBtn, animatedButtonStyle]}>
            <Text style={styles.apostarText}>Apostar</Text>
          </Animated2.View>
        </Pressable>
      </View>

    </GradientBackground>
  );
}

// ─────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backBtn: {
    paddingRight: 12,
  },
  leagueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  bolaVerde: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#C5F400',
  },
  leagueText: {
    color: '#8A99BB',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  aoVivoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,59,59,0.15)',
    borderWidth: 1,
    borderColor: '#FF3B3B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  aoVivoText: {
    color: '#FF3B3B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* SCOREBOARD */
  scoreboard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  teamSide: {
    alignItems: 'center',
    width: 80,
  },
  shieldMock: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
  },
  shieldText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  teamName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  formRow: {
    flexDirection: 'row',
    gap: 3,
  },
  formDot: {
    width: 14,
    height: 6,
    borderRadius: 3,
  },
  scoreCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 2,
  },
  timePill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  timeText: {
    color: '#8A99BB',
    fontSize: 12,
    fontWeight: '700',
  },

  /* STATS BASE */
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    color: '#8A99BB',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  /* TABS */
  tabsScroll: {
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
    marginRight: 8,
  },
  tabText: {
    color: '#8A99BB',
    fontSize: 14,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#0AF43D',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: '#0AF43D',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  tabBorderLines: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: -1,
  },

  /* CONTENT */
  scrollContent: {
    paddingTop: 16,
  },
  tabContent: {
    paddingHorizontal: 12,
  },
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  marketTitle: {
    color: '#8A99BB',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cashoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
  cashoutDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: '#FCA311'
  },
  cashoutText: {
    color: '#FCA311',
    fontSize: 9,
    fontWeight: '800',
  },
  marketContent: {
    padding: 10,
    gap: 8,
  },
  marketDesc: {
    color: '#8A99BB',
    fontSize: 12,
    marginHorizontal: 4,
    marginBottom: 10,
    fontWeight: '600'
  },

  /* GRIDS ODDS */
  oddsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  oddBox: {
    flex: 1,
    backgroundColor: '#1C2F70',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  oddBoxActive: {
    backgroundColor: 'rgba(10,244,61,0.1)',
    borderColor: '#0AF43D',
  },
  oddLabelGrid: {
    color: '#8A99BB',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  oddVal: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  oddValActive: {
    color: '#0AF43D',
  },

  /* OVER UNDER */
  ouRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
  },
  ouLabelBox: {
    backgroundColor: '#1E3278',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  ouLabel: {
    color: '#8A99BB',
    fontSize: 13,
    fontWeight: '700',
  },
  ouOddBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1C2F70',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  ouOddDir: {
    color: '#8A99BB',
    fontSize: 12,
    fontWeight: '600',
  },

  centerSubLabel: {
    color: '#34477A',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 8,
    letterSpacing: 0.5,
  },

  /* FLOAT BOTTOM BAR */
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#0D1E50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 10,
  },
  selectionCount: {
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: '#0AF43D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectionNumber: {
    color: '#023397',
    fontSize: 13,
    fontWeight: '900',
  },
  selectionLabel: {
    color: '#8A99BB',
    fontSize: 13,
    fontWeight: '600',
  },
  oddTotal: {
    color: '#0AF43D',
    fontSize: 16,
    fontWeight: '900',
    marginRight: 12,
  },
  apostarBtn: {
    backgroundColor: '#0AF43D',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  apostarText: {
    color: '#023397',
    fontSize: 15,
    fontWeight: '800',
  },
});
