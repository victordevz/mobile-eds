import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_W * 0.72;

/* ───────────────── Ícone turbo (raio + gráfico) ───────────────── */

function TurboIcon({ size = 22, color = colors.secondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Seta de gráfico subindo */}
      <Path
        d="M3 17L9 11L13 15L21 7"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 7H21V11"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sparkle pequeno */}
      <Path
        d="M14 3L15 5L17 6L15 7L14 9L13 7L11 6L13 5L14 3Z"
        fill={color}
      />
    </Svg>
  );
}

/* ───────────────── Dados mock ───────────────── */

interface SportCategory {
  id: string;
  label: string;
  emoji: string;
}

interface OddMatch {
  id: string;
  teamA: string;
  teamB: string;
  league: string;
  description: string;
  originalOdd: number;
  boostedOdd: number;
}

const SPORT_CATEGORIES: SportCategory[] = [
  { id: 'sp1', label: 'Futebol', emoji: '⚽' },
  { id: 'sp2', label: 'Tênis', emoji: '🎾' },
  { id: 'sp3', label: 'Basquete', emoji: '🏀' },
  { id: 'sp4', label: 'MMA', emoji: '🥊' },
  { id: 'sp5', label: 'E-Sports', emoji: '🎮' },
];

const SUPER_TURBO_MATCHES: OddMatch[] = [
  {
    id: 'st1',
    teamA: 'Vasco da Gama',
    teamB: 'Grêmio',
    league: 'Brasileirão Série A',
    description: 'Total de Gols Mais/Menos - Mais de 1.5 • Chutes no gol Carlos Vinícius - Mais de 0.5',
    originalOdd: 2.75,
    boostedOdd: 3.45,
  },
  {
    id: 'st2',
    teamA: 'Remo',
    teamB: 'Bahia',
    league: 'Copa do Brasil',
    description: 'Resultado Final - Bahia • Total de Gols Mais/Menos - Mais de 2.5',
    originalOdd: 4.00,
    boostedOdd: 5.00,
  },
  {
    id: 'st3',
    teamA: 'Cruzeiro',
    teamB: 'Santos',
    league: 'Brasileirão Série A',
    description: 'Chutes no gol - Neymar Mais de 0.5 e Rony Mais de 0.5',
    originalOdd: 3.40,
    boostedOdd: 4.25,
  },
  {
    id: 'st4',
    teamA: 'Flamengo',
    teamB: 'Palmeiras',
    league: 'Brasileirão Série A',
    description: 'Ambas Marcam - Sim • Total de Gols Mais de 2.5',
    originalOdd: 2.90,
    boostedOdd: 3.80,
  },
  {
    id: 'st5',
    teamA: 'Corinthians',
    teamB: 'São Paulo',
    league: 'Brasileirão Série A',
    description: 'Resultado Final - Corinthians • Total de Escanteios Mais de 8.5',
    originalOdd: 3.10,
    boostedOdd: 4.10,
  },
];

const TURBO_MATCHES: OddMatch[] = [
  {
    id: 'tb1',
    teamA: 'Fluminense',
    teamB: 'Botafogo',
    league: 'Brasileirão Série A',
    description: 'Resultado Final - Fluminense • Ambas Marcam - Sim',
    originalOdd: 1.80,
    boostedOdd: 2.35,
  },
  {
    id: 'tb2',
    teamA: 'Athletico-PR',
    teamB: 'Coritiba',
    league: 'Brasileirão Série A',
    description: 'Handicap Asiático - Athletico -1.5 Gols',
    originalOdd: 2.10,
    boostedOdd: 2.75,
  },
  {
    id: 'tb3',
    teamA: 'Internacional',
    teamB: 'Juventude',
    league: 'Brasileirão Série A',
    description: 'Total de Gols Mais/Menos - Mais de 1.5 • Resultado Final - Internacional',
    originalOdd: 1.90,
    boostedOdd: 2.50,
  },
  {
    id: 'tb4',
    teamA: 'Fortaleza',
    teamB: 'Ceará',
    league: 'Copa do Nordeste',
    description: 'Resultado Intervalo - Fortaleza • Resultado Final - Fortaleza',
    originalOdd: 2.30,
    boostedOdd: 2.99,
  },
];

type TabKey = 'super' | 'normal';

/* ───────────────── Componente principal ───────────────── */

export default function OddsTurbinadas() {
  const [activeSport, setActiveSport] = useState('sp1');
  const [activeTab, setActiveTab] = useState<TabKey>('super');

  const matches = activeTab === 'super' ? SUPER_TURBO_MATCHES : TURBO_MATCHES;
  const isSuperTab = activeTab === 'super';

  return (
    <View style={styles.root}>
      {/* ── Título da seção ── */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <TurboIcon size={20} color={colors.secondary} />
          <Text style={styles.sectionTitle}>Odds Turbinadas</Text>
        </View>
        <Pressable>
          <Text style={styles.seeAllLink}>Ver tudo →</Text>
        </Pressable>
      </View>

      {/* ── Categorias de esportes ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sportCatsRow}
      >
        {SPORT_CATEGORIES.map((cat) => {
          const isActive = activeSport === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setActiveSport(cat.id)}
              style={[
                styles.sportPill,
                isActive ? styles.sportPillActive : styles.sportPillInactive,
              ]}
            >
              <Text style={styles.sportEmoji}>{cat.emoji}</Text>
              <Text
                style={[
                  styles.sportLabel,
                  isActive ? styles.sportLabelActive : styles.sportLabelInactive,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── Tabs Super / Normal ── */}
      <View style={styles.tabsRow}>
        <Pressable
          onPress={() => setActiveTab('super')}
          style={[styles.tabItem, activeTab === 'super' && styles.tabItemActive]}
        >
          <TurboIcon size={14} color={activeTab === 'super' ? colors.secondary : colors.grey} />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'super' ? styles.tabLabelActive : styles.tabLabelInactive,
            ]}
          >
            Super Turbinadas
          </Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>3x+</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('normal')}
          style={[styles.tabItem, activeTab === 'normal' && styles.tabItemActive]}
        >
          <TurboIcon size={14} color={activeTab === 'normal' ? '#FFB703' : colors.grey} />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'normal' ? styles.tabLabelActiveAlt : styles.tabLabelInactive,
            ]}
          >
            Turbinadas
          </Text>
          <View style={[styles.tabBadge, { backgroundColor: 'rgba(255,183,3,0.18)' }]}>
            <Text style={[styles.tabBadgeText, { color: '#FFB703' }]}>≤2.99x</Text>
          </View>
        </Pressable>
      </View>

      {/* ── Cards de jogos ── */}
      <FlatList
        data={matches}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsRow}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MatchCard match={item} isSuper={isSuperTab} />
        )}
      />
    </View>
  );
}

/* ───────────────── Card de partida ───────────────── */

function MatchCard({ match, isSuper }: { match: OddMatch; isSuper: boolean }) {
  const accentColor = isSuper ? colors.secondary : '#FFB703';

  return (
    <View style={styles.matchCard}>
      {/* Gradiente sutil no topo */}
      <LinearGradient
        colors={[
          isSuper ? 'rgba(56,230,125,0.08)' : 'rgba(255,183,3,0.08)',
          'transparent',
        ]}
        style={styles.cardGradient}
      />

      {/* Header do card: ícone turbo + times */}
      <View style={styles.cardHeader}>
        <View style={[styles.turboIconCircle, { backgroundColor: isSuper ? 'rgba(56,230,125,0.15)' : 'rgba(255,183,3,0.15)' }]}>
          <TurboIcon size={16} color={accentColor} />
        </View>
        <View style={styles.cardTeams}>
          <Text style={[styles.cardTeamText, { color: accentColor }]} numberOfLines={1}>
            {match.teamA} - {match.teamB}
          </Text>
          <Text style={styles.cardLeague} numberOfLines={1}>{match.league}</Text>
        </View>
      </View>

      {/* Descrição da aposta */}
      <Text style={styles.cardDescription} numberOfLines={3}>
        {match.description}
      </Text>

      {/* Odds */}
      <View style={styles.cardOddsRow}>
        <View style={[styles.oddsBox, { borderColor: isSuper ? 'rgba(56,230,125,0.25)' : 'rgba(255,183,3,0.25)' }]}>
          <Text style={styles.originalOdd}>{match.originalOdd.toFixed(2)}</Text>
          <Text style={[styles.boostedOdd, { color: accentColor }]}>
            {match.boostedOdd.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.turboTag, { backgroundColor: isSuper ? 'rgba(56,230,125,0.12)' : 'rgba(255,183,3,0.12)' }]}>
          <TurboIcon size={12} color={accentColor} />
          <Text style={[styles.turboTagText, { color: accentColor }]}>
            {isSuper ? 'SUPER' : 'TURBO'}
          </Text>
        </View>
      </View>
    </View>
  );
}

/* ───────────────── Estilos ───────────────── */

const styles = StyleSheet.create({
  root: {
    marginTop: 24,
  },

  /* Seção título */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  seeAllLink: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
  },

  /* Categorias de esportes */
  sportCatsRow: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
  },
  sportPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  sportPillActive: {
    backgroundColor: colors.card,
    borderWidth: 1.2,
    borderColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  sportPillInactive: {
    backgroundColor: colors.card,
    borderWidth: 1.2,
    borderColor: 'transparent',
  },
  sportEmoji: {
    fontSize: 15,
  },
  sportLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  sportLabelActive: {
    color: colors.white,
  },
  sportLabelInactive: {
    color: colors.grey,
  },

  /* Tabs */
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 16,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    backgroundColor: colors.card,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: colors.secondary,
  },
  tabLabel: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: colors.secondary,
  },
  tabLabelActiveAlt: {
    color: '#FFB703',
  },
  tabLabelInactive: {
    color: colors.grey,
  },
  tabBadge: {
    backgroundColor: 'rgba(56,230,125,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tabBadgeText: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: '800',
  },

  /* Cards row */
  cardsRow: {
    paddingHorizontal: 16,
    gap: 12,
  },

  /* Match card */
  matchCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceMid,
    overflow: 'hidden',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  /* Card header */
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  turboIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTeams: {
    flex: 1,
  },
  cardTeamText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  cardLeague: {
    color: colors.grey,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },

  /* Descrição */
  cardDescription: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 17,
    marginBottom: 14,
    minHeight: 51,
  },

  /* Odds */
  cardOddsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  oddsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  originalOdd: {
    color: colors.grey,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'line-through',
  },
  boostedOdd: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  turboTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  turboTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
