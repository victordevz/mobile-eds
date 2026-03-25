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
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';
import LiveMatchCard, { LiveMatchData } from './LiveMatchCard';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_W * 0.88;

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

interface MatchEntry {
  id: string;
  data: LiveMatchData;
}

function TeamCircle({ abbr, color }: { abbr: string; color: string }) {
  return (
    <View style={[localStyles.teamCircle, { backgroundColor: color }]}>
      <Text style={localStyles.teamAbbr}>{abbr}</Text>
    </View>
  );
}

const SPORT_CATEGORIES: SportCategory[] = [
  { id: 'sp1', label: 'Futebol', emoji: '⚽' },
  { id: 'sp2', label: 'Tênis', emoji: '🎾' },
  { id: 'sp3', label: 'Basquete', emoji: '🏀' },
  { id: 'sp4', label: 'MMA', emoji: '🥊' },
  { id: 'sp5', label: 'E-Sports', emoji: '🎮' },
];

const SUPER_TURBO_MATCHES: MatchEntry[] = [
  {
    id: 'st1',
    data: {
      league: 'Brasileirão Série A',
      isLive: true,
      minute: "78'",
      homeScore: 2,
      awayScore: 1,
      homeIcon: <TeamCircle abbr="VAS" color="#1F1F1F" />,
      awayIcon: <TeamCircle abbr="GRE" color="#0B6AB0" />,
      odds: [
        { key: 'home', label: 'Vasco', percentage: 55, odd: 1.65 },
        { key: 'draw', label: 'Empate', percentage: 20, odd: 3.10 },
        { key: 'away', label: 'Grêmio', percentage: 25, odd: 2.80 },
      ],
      suggestionTeam: 'Vasco',
      suggestionDetail: 'vence + 1 gol',
    },
  },
  {
    id: 'st2',
    data: {
      league: 'Copa do Brasil',
      isLive: true,
      minute: "45'",
      homeScore: 0,
      awayScore: 2,
      homeIcon: <TeamCircle abbr="REM" color="#003DA5" />,
      awayIcon: <TeamCircle abbr="BAH" color="#004A99" />,
      odds: [
        { key: 'home', label: 'Remo', percentage: 15, odd: 5.00 },
        { key: 'draw', label: 'Empate', percentage: 20, odd: 3.80 },
        { key: 'away', label: 'Bahia', percentage: 65, odd: 1.40 },
      ],
      suggestionTeam: 'Bahia',
      suggestionDetail: 'vence + 3 gols',
    },
  },
  {
    id: 'st3',
    data: {
      league: 'Brasileirão Série A',
      isLive: true,
      minute: "62'",
      homeScore: 1,
      awayScore: 1,
      homeIcon: <TeamCircle abbr="CRU" color="#003DA5" />,
      awayIcon: <TeamCircle abbr="SAN" color="#1F1F1F" />,
      odds: [
        { key: 'home', label: 'Cruzeiro', percentage: 40, odd: 2.10 },
        { key: 'draw', label: 'Empate', percentage: 25, odd: 2.90 },
        { key: 'away', label: 'Santos', percentage: 35, odd: 2.40 },
      ],
      suggestionTeam: 'Cruzeiro',
      suggestionDetail: 'vence + 2 gols',
    },
  },
  {
    id: 'st4',
    data: {
      league: 'Brasileirão Série A',
      isLive: true,
      minute: "33'",
      homeScore: 0,
      awayScore: 0,
      homeIcon: <TeamCircle abbr="FLA" color="#C4161C" />,
      awayIcon: <TeamCircle abbr="PAL" color="#006437" />,
      odds: [
        { key: 'home', label: 'Flamengo', percentage: 45, odd: 1.90 },
        { key: 'draw', label: 'Empate', percentage: 25, odd: 2.90 },
        { key: 'away', label: 'Palmeiras', percentage: 30, odd: 2.50 },
      ],
      suggestionTeam: 'Flamengo',
      suggestionDetail: 'vence',
    },
  },
  {
    id: 'st5',
    data: {
      league: 'Brasileirão Série A',
      isLive: true,
      minute: "15'",
      homeScore: 1,
      awayScore: 0,
      homeIcon: <TeamCircle abbr="COR" color="#1F1F1F" />,
      awayIcon: <TeamCircle abbr="SAO" color="#C4161C" />,
      odds: [
        { key: 'home', label: 'Corinthians', percentage: 50, odd: 1.75 },
        { key: 'draw', label: 'Empate', percentage: 22, odd: 3.00 },
        { key: 'away', label: 'São Paulo', percentage: 28, odd: 2.60 },
      ],
      suggestionTeam: 'Corinthians',
      suggestionDetail: 'vence + 2 gols',
    },
  },
];

const TURBO_MATCHES: MatchEntry[] = [
  {
    id: 'tb1',
    data: {
      league: 'Brasileirão Série A',
      isLive: true,
      minute: "88'",
      homeScore: 2,
      awayScore: 2,
      homeIcon: <TeamCircle abbr="FLU" color="#8B0000" />,
      awayIcon: <TeamCircle abbr="BOT" color="#1F1F1F" />,
      odds: [
        { key: 'home', label: 'Fluminense', percentage: 30, odd: 2.35 },
        { key: 'draw', label: 'Empate', percentage: 35, odd: 2.10 },
        { key: 'away', label: 'Botafogo', percentage: 35, odd: 2.35 },
      ],
      suggestionTeam: 'Botafogo',
      suggestionDetail: 'vence',
    },
  },
  {
    id: 'tb2',
    data: {
      league: 'Brasileirão Série A',
      isLive: true,
      minute: "55'",
      homeScore: 1,
      awayScore: 0,
      homeIcon: <TeamCircle abbr="CAP" color="#C4161C" />,
      awayIcon: <TeamCircle abbr="CFC" color="#006437" />,
      odds: [
        { key: 'home', label: 'Athletico', percentage: 55, odd: 1.60 },
        { key: 'draw', label: 'Empate', percentage: 20, odd: 3.20 },
        { key: 'away', label: 'Coritiba', percentage: 25, odd: 2.75 },
      ],
      suggestionTeam: 'Athletico',
      suggestionDetail: 'vence + 2 gols',
    },
  },
  {
    id: 'tb3',
    data: {
      league: 'Brasileirão Série A',
      isLive: true,
      minute: "70'",
      homeScore: 3,
      awayScore: 1,
      homeIcon: <TeamCircle abbr="INT" color="#C4161C" />,
      awayIcon: <TeamCircle abbr="JUV" color="#006437" />,
      odds: [
        { key: 'home', label: 'Inter', percentage: 70, odd: 1.30 },
        { key: 'draw', label: 'Empate', percentage: 12, odd: 4.00 },
        { key: 'away', label: 'Juventude', percentage: 18, odd: 3.50 },
      ],
      suggestionTeam: 'Inter',
      suggestionDetail: 'vence + 3 gols',
    },
  },
  {
    id: 'tb4',
    data: {
      league: 'Copa do Nordeste',
      isLive: true,
      minute: "40'",
      homeScore: 1,
      awayScore: 1,
      homeIcon: <TeamCircle abbr="FOR" color="#003DA5" />,
      awayIcon: <TeamCircle abbr="CEA" color="#1F1F1F" />,
      odds: [
        { key: 'home', label: 'Fortaleza', percentage: 45, odd: 1.85 },
        { key: 'draw', label: 'Empate', percentage: 25, odd: 2.90 },
        { key: 'away', label: 'Ceará', percentage: 30, odd: 2.50 },
      ],
      suggestionTeam: 'Fortaleza',
      suggestionDetail: 'vence',
    },
  },
];

type TabKey = 'super' | 'normal';

/* ───────────────── Componente principal ───────────────── */

interface OddsturbinadasProps {
  onGamePress?: () => void;
}

export default function OddsTurbinadas({ onGamePress }: OddsturbinadasProps) {
  const [activeSport, setActiveSport] = useState('sp1');
  const [activeTab, setActiveTab] = useState<TabKey>('super');

  const matches = activeTab === 'super' ? SUPER_TURBO_MATCHES : TURBO_MATCHES;

  return (
    <View style={styles.root}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <TurboIcon size={20} color={colors.secondary} />
          <Text style={styles.sectionTitle}>Odds Turbinadas</Text>
        </View>
        <Pressable>
          <Text style={styles.seeAllLink}>Ver tudo →</Text>
        </Pressable>
      </View>

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

      <FlatList
        data={matches}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsRow}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LiveMatchCard
            data={item.data}
            onBetPress={onGamePress}
            style={{ width: CARD_WIDTH, paddingHorizontal: 0, marginTop: 0, alignSelf: 'stretch' }}
          />
        )}
      />
    </View>
  );
}

/* ───────────────── Estilos ───────────────── */

const localStyles = StyleSheet.create({
  teamCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamAbbr: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

const styles = StyleSheet.create({
  root: {
    marginTop: 24,
  },

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

  cardsRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
});
