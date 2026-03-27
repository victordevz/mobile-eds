import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated2, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';
import Logotipo from '../../assets/logotipo.svg';
import LiveMatchCard from '../components/LiveMatchCard';
import { useAuth } from '../context/AuthContext';
import { storiesApi, StoryItem } from '../services/api';
import { BetSlipData, SPORT_ORDER, SPORT_THEMES, SportTheme, SportType } from '../types/sports';
import TodosContent from '../components/sports/TodosContent';
import BasqueteContent from '../components/sports/BasqueteContent';
import TenisContent from '../components/sports/TenisContent';
import VoleiContent from '../components/sports/VoleiContent';
import ESportsContent from '../components/sports/ESportsContent';

import AlemanhaIcon from '../../assets/alemanha.svg';
import BarcelonaIcon from '../../assets/barcelona.svg';
import BayerIcon from '../../assets/bayer.svg';
import BotafogoIcon from '../../assets/botafogo.svg';
import BragatinoIcon from '../../assets/bragatino.svg';
import BrasilIcon from '../../assets/brasil.svg';
import CorinthiasIcon from '../../assets/corinthias.svg';
import EspanhaIcon from '../../assets/espanha.svg';
import FlamengoIcon from '../../assets/flamengo.svg';
import FluminenseIcon from '../../assets/fluminense.svg';
import InglaterraIcon from '../../assets/inglaterra.svg';
import PalmeirasIcon from '../../assets/palmeiras.svg';
import RealMadridIcon from '../../assets/realmadrid.svg';
import VascoIcon from '../../assets/vasco.svg';

/* ───────────────────── Constantes ───────────────────── */

const { width: SCREEN_W } = Dimensions.get('window');
const BANNER_W = SCREEN_W - 32;
const BANNER_H = 160;

/* ───────────────────── Dados mock ───────────────────── */

const STORIES_FALLBACK: StoryItem[] = [
  { id: 's1', title: '1 MILHÃO', videoUrl: '', thumbnailUrl: null, order: 1, active: true, createdAt: '', viewed: false },
  { id: 's2', title: 'COTAÇÕES', videoUrl: '', thumbnailUrl: null, order: 2, active: true, createdAt: '', viewed: false },
  { id: 's3', title: 'PRÊMIOS', videoUrl: '', thumbnailUrl: null, order: 3, active: false, createdAt: '', viewed: false },
  { id: 's4', title: 'CASHBACK', videoUrl: '', thumbnailUrl: null, order: 4, active: false, createdAt: '', viewed: false },
  { id: 's5', title: 'GRÁTIS', videoUrl: '', thumbnailUrl: null, order: 5, active: false, createdAt: '', viewed: false },
];

const BANNERS = [
  {
    id: 'b0',
    badge: '',
    game: '',
    multiplier: '',
    image: require('../../assets/rumo-ao-hexa.png'),
    accent: '#38E67D',
    hideOverlay: true,
  },
  {
    id: 'b1',
    badge: '● EM DESTAQUE',
    game: 'Gates of Olympus',
    multiplier: '5000x',
    image: require('../../assets/gatesof.jpg'),
    accent: '#3A86FF',
    hideOverlay: false,
  },
  {
    id: 'b2',
    badge: '● NOVO',
    game: 'Sweet Bonanza',
    multiplier: '21100x',
    image: require('../../assets/sweetbonanza.webp'),
    accent: '#FB5607',
    hideOverlay: false,
  },
  {
    id: 'b3',
    badge: '● POPULAR',
    game: 'Aviator',
    multiplier: '1000000x',
    image: require('../../assets/aviator.jpeg'),
    accent: '#E63946',
    hideOverlay: false,
  },
];



interface Championship {
  id: string;
  label: string;
  Icon: React.FC<{ size?: number; color?: string }>;
}

interface MegaCotacaoMatch {
  id: string;
  date: string;
  time: string;
  homeTeam: string;
  HomeIcon: React.FC<{ width?: number; height?: number }>;
  awayTeam: string;
  AwayIcon: React.FC<{ width?: number; height?: number }>;
  league: string;
  odd: number;
}

const MEGA_COTACAO: MegaCotacaoMatch[] = [
  { id: 'm1', date: 'Hoje', time: '15:30', homeTeam: 'Flamengo', HomeIcon: FlamengoIcon, awayTeam: 'Palmeiras', AwayIcon: PalmeirasIcon, league: 'Brasileirão', odd: 4.20 },
  { id: 'm2', date: 'Hoje', time: '18:00', homeTeam: 'Barcelona', HomeIcon: BarcelonaIcon, awayTeam: 'Real Madrid', AwayIcon: RealMadridIcon, league: 'La Liga', odd: 3.80 },
  { id: 'm3', date: 'Amanhã', time: '20:45', homeTeam: 'Alemanha', HomeIcon: AlemanhaIcon, awayTeam: 'Inglaterra', AwayIcon: InglaterraIcon, league: 'Amistoso Internacional', odd: 5.50 },
  { id: 'm4', date: 'Amanhã', time: '22:00', homeTeam: 'Brasil', HomeIcon: BrasilIcon, awayTeam: 'Espanha', AwayIcon: EspanhaIcon, league: 'Copa do Mundo', odd: 2.90 },
];

const CHAMPIONSHIPS: Championship[] = [
  { id: 'c1', label: 'Copa do\nNordeste', Icon: TrophyIcon },
  { id: 'c2', label: 'Brasileirão', Icon: SoccerIcon },
  { id: 'c3', label: 'Copa do\nBrasil', Icon: TrophyIcon },
  { id: 'c4', label: 'Libertadores', Icon: SoccerIcon },
  { id: 'c5', label: 'Champions\nLeague', Icon: SoccerIcon },
  { id: 'c6', label: 'Premier\nLeague', Icon: SoccerIcon },
  { id: 'c7', label: 'La Liga', Icon: SoccerIcon },
  { id: 'c8', label: 'Serie A', Icon: SoccerIcon },
];

interface SportCategory {
  id: string;
  label: string;
  Icon: React.FC<{ size?: number; color?: string }>;
}

function SoccerIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
      <Path d="M12 2C12 2 9 6 9 12s3 10 3 10" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Path d="M12 2C12 2 15 6 15 12s-3 10-3 10" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Path d="M2 12h20" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Path d="M3.5 7h17M3.5 17h17" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  );
}

function TrophyIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <Path d="M4 22h16" />
      <Path d="M10 22V18" />
      <Path d="M14 22V18" />
      <Path d="M18 4H6v7a6 6 0 0 0 12 0V4Z" />
    </Svg>
  );
}

function TennisIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
      <Path d="M5 5.5C7 8 7 16 5 18.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <Path d="M19 5.5C17 8 17 16 19 18.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  );
}

function BasketballIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
      <Path d="M12 2v20M2 12h20" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Path d="M5 4.5C8 8 8 16 5 19.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Path d="M19 4.5C16 8 16 16 19 19.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

function GloveIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 20v-8L4 9a2 2 0 0 1 4 0V8a2 2 0 0 1 4 0V7a2 2 0 0 1 4 0v5h1a2 2 0 0 1 0 4H6z" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 13h11" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

function ControllerIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="7" width="20" height="11" rx="4" stroke={color} strokeWidth="1.7" />
      <Path d="M7 11v4M5 13h4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <Circle cx="16" cy="11.5" r="1" fill={color} />
      <Circle cx="19" cy="13.5" r="1" fill={color} />
    </Svg>
  );
}

const SPORT_CATEGORIES: SportCategory[] = [
  { id: 'sp1', label: 'Futebol', Icon: SoccerIcon },
  { id: 'sp2', label: 'Tênis', Icon: TennisIcon },
  { id: 'sp3', label: 'Basquete', Icon: BasketballIcon },
  { id: 'sp4', label: 'MMA', Icon: GloveIcon },
  { id: 'sp5', label: 'E-Sports', Icon: ControllerIcon },
];

const POPULARES_MATCHES: MegaCotacaoMatch[] = [
  { id: 'p1', date: 'Hoje', time: '16:00', homeTeam: 'Flamengo', HomeIcon: FlamengoIcon, awayTeam: 'Vasco', AwayIcon: VascoIcon, league: 'Brasileirão', odd: 2.10 },
  { id: 'p2', date: 'Hoje', time: '19:00', homeTeam: 'Fluminense', HomeIcon: FluminenseIcon, awayTeam: 'Corinthians', AwayIcon: CorinthiasIcon, league: 'Brasileirão', odd: 3.50 },
  { id: 'p3', date: 'Amanhã', time: '21:00', homeTeam: 'Bayer', HomeIcon: BayerIcon, awayTeam: 'Barcelona', AwayIcon: BarcelonaIcon, league: 'Champions League', odd: 2.80 },
  { id: 'p4', date: 'Amanhã', time: '17:30', homeTeam: 'Bragantino', HomeIcon: BragatinoIcon, awayTeam: 'Palmeiras', AwayIcon: PalmeirasIcon, league: 'Brasileirão', odd: 3.10 },
];

const LIVE_MATCHES = [
  {
    id: 'l1',
    league: 'Brasileirão',
    isLive: true,
    minute: "90'4",
    homeTeam: 'Bragantino',
    awayTeam: 'Botafogo',
    homeScore: 1,
    awayScore: 1,
    HomeIcon: BragatinoIcon,
    AwayIcon: BotafogoIcon,
    odds: [
      { key: 'home', label: 'Bragantino', percentage: 60, odd: 1.50 },
      { key: 'draw', label: 'Empate', percentage: 10, odd: 3.30 },
      { key: 'away', label: 'Botafogo', percentage: 30, odd: 2.20 },
    ],
    suggestionTeam: 'Botafogo',
    suggestionDetail: 'vence + 2 gols',
    defaultSelected: 'draw',
  },
  {
    id: 'l2',
    league: 'La Liga',
    isLive: true,
    minute: "32'2",
    homeTeam: 'Barcelona',
    awayTeam: 'Real Madrid',
    homeScore: 0,
    awayScore: 2,
    HomeIcon: BarcelonaIcon,
    AwayIcon: RealMadridIcon,
    odds: [
      { key: 'home', label: 'Barcelona', percentage: 20, odd: 4.50 },
      { key: 'draw', label: 'Empate', percentage: 15, odd: 3.80 },
      { key: 'away', label: 'Real Madrid', percentage: 65, odd: 1.45 },
    ],
    suggestionTeam: 'Real Madrid',
    suggestionDetail: 'vence + 1 gol',
    defaultSelected: 'away',
  },
  {
    id: 'l3',
    league: 'Brasileirão',
    isLive: true,
    minute: "15'0",
    homeTeam: 'Flamengo',
    awayTeam: 'Vasco',
    homeScore: 0,
    awayScore: 0,
    HomeIcon: FlamengoIcon,
    AwayIcon: VascoIcon,
    odds: [
      { key: 'home', label: 'Flamengo', percentage: 55, odd: 1.80 },
      { key: 'draw', label: 'Empate', percentage: 25, odd: 3.20 },
      { key: 'away', label: 'Vasco', percentage: 20, odd: 4.20 },
    ],
    suggestionTeam: 'Flamengo',
    suggestionDetail: 'vence o 1º tempo',
    defaultSelected: 'home',
  },
  {
    id: 'l4',
    league: 'Amistoso',
    isLive: true,
    minute: "76'5",
    homeTeam: 'Bayer',
    awayTeam: 'Fluminense',
    homeScore: 3,
    awayScore: 1,
    HomeIcon: BayerIcon,
    AwayIcon: FluminenseIcon,
    odds: [
      { key: 'home', label: 'Bayer', percentage: 80, odd: 1.20 },
      { key: 'draw', label: 'Empate', percentage: 12, odd: 4.80 },
      { key: 'away', label: 'Fluminense', percentage: 8, odd: 9.00 },
    ],
    suggestionTeam: 'Bayer',
    suggestionDetail: 'mais de 3.5 gols',
    defaultSelected: 'home',
  }
];

/* ───────────────────── Componentes auxiliares ──────────── */

/** Componente padronizado para ícones de times */
function TeamIcon({ Icon, size = 48 }: { Icon: React.FC<{ width?: number; height?: number }>; size?: number }) {
  return (
    <View style={styles.teamIconBox}>
      <Icon width={size} height={size} />
    </View>
  );
}

/** Seção Mega Cotação */
function MegaCotacaoSection({ onPress }: { onPress: (data: BetSlipData) => void }) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleBar} />
        <Text style={styles.sectionTitle}>Mega cotação</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.megaContainer}
      >
        {MEGA_COTACAO.map((match) => (
          <Pressable key={match.id} style={styles.megaCard} onPress={() => onPress({
            matchLabel: `${match.homeTeam} vs ${match.awayTeam}`,
            oddLabel: match.homeTeam,
            oddValue: match.odd,
            league: match.league,
          })}>
            <View style={styles.megaDateRow}>
              <View style={styles.megaAccentBar} />
              <Text style={styles.megaDate}>{match.date}</Text>
              <Text style={styles.megaTime}>{match.time}</Text>
            </View>
            <View style={styles.megaMatchArea}>
              <View style={styles.megaTeam}>
                <TeamIcon Icon={match.HomeIcon} />
                <Text style={styles.megaTeamName} numberOfLines={1}>{match.homeTeam}</Text>
              </View>
              <Text style={styles.megaVs}>VS</Text>
              <View style={styles.megaTeam}>
                <TeamIcon Icon={match.AwayIcon} />
                <Text style={styles.megaTeamName} numberOfLines={1}>{match.awayTeam}</Text>
              </View>
            </View>
            <Text style={styles.megaLeague} numberOfLines={1}>{match.league}</Text>
            <View style={styles.megaOddsRow}>
              <View style={styles.megaAccentBar} />
              <Text style={styles.megaOddsLabel}>Odds</Text>
              <View style={styles.megaOddBadge}>
                <Text style={styles.megaOddValue}>{match.odd.toFixed(2)}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}

/** Seção Populares */
function PopularesSection({ onPress }: { onPress: (data: BetSlipData) => void }) {
  const [tab, setTab] = useState<'live' | 'next'>('live');
  const [activeSport, setActiveSport] = useState('sp0');

  return (
    <>
      <View style={styles.popHeader}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleBar} />
          <Text style={styles.sectionTitle}>Populares</Text>
        </View>
        <View style={styles.popToggles}>
          <Pressable
            style={[styles.popToggleBtn, tab === 'live' && styles.popToggleBtnActive]}
            onPress={() => setTab('live')}
          >
            <Text style={[styles.popToggleText, tab === 'live' && styles.popToggleTextActive]}>AO VIVO</Text>
          </Pressable>
          <Pressable
            style={[styles.popToggleBtn, tab === 'next' && styles.popToggleBtnActive]}
            onPress={() => setTab('next')}
          >
            <Text style={[styles.popToggleText, tab === 'next' && styles.popToggleTextActive]}>Próximos</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sportCatsRow}
      >
        <Pressable
          style={[styles.sportPill, activeSport === 'sp0' ? styles.sportPillActive : styles.sportPillInactive]}
          onPress={() => setActiveSport('sp0')}
        >
          <Text style={[styles.sportPillText, activeSport === 'sp0' ? styles.sportPillTextActive : styles.sportPillTextInactive]}>Em alta</Text>
        </Pressable>
        {SPORT_CATEGORIES.map((cat) => {
          const isActive = activeSport === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={[styles.sportPill, isActive ? styles.sportPillActive : styles.sportPillInactive]}
              onPress={() => setActiveSport(cat.id)}
            >
              <cat.Icon size={14} color={isActive ? colors.white : colors.grey} />
              <Text style={[styles.sportPillText, isActive ? styles.sportPillTextActive : styles.sportPillTextInactive]}>{cat.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.megaContainer}
      >
        {POPULARES_MATCHES.map((match) => (
          <Pressable key={match.id} style={styles.megaCard} onPress={() => onPress({
            matchLabel: `${match.homeTeam} vs ${match.awayTeam}`,
            oddLabel: match.homeTeam,
            oddValue: match.odd,
            league: match.league,
          })}>
            <View style={styles.megaDateRow}>
              <View style={styles.megaAccentBar} />
              <Text style={styles.megaDate}>{match.date}</Text>
              <Text style={styles.megaTime}>{match.time}</Text>
            </View>
            <View style={styles.megaMatchArea}>
              <View style={styles.megaTeam}>
                <TeamIcon Icon={match.HomeIcon} />
                <Text style={styles.megaTeamName} numberOfLines={1}>{match.homeTeam}</Text>
              </View>
              <Text style={styles.megaVs}>VS</Text>
              <View style={styles.megaTeam}>
                <TeamIcon Icon={match.AwayIcon} />
                <Text style={styles.megaTeamName} numberOfLines={1}>{match.awayTeam}</Text>
              </View>
            </View>
            <Text style={styles.megaLeague} numberOfLines={1}>{match.league}</Text>
            <View style={styles.megaOddsRow}>
              <View style={styles.megaAccentBar} />
              <Text style={styles.megaOddsLabel}>Odds</Text>
              <View style={styles.megaOddBadge}>
                <Text style={styles.megaOddValue}>{match.odd.toFixed(2)}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}

/** Barra de campeonatos */
function ChampionshipsBar() {
  const [active, setActive] = useState<string>('c1');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.champContainer}
    >
      {CHAMPIONSHIPS.map((item) => {
        const isActive = active === item.id;
        return (
          <Pressable key={item.id} style={styles.champItem} onPress={() => setActive(item.id)}>
            <View style={[styles.champCard, isActive && styles.champCardActive]}>
              <View style={[styles.champCircle, isActive && styles.champCircleActive]}>
                <item.Icon size={24} color={isActive ? colors.secondary : colors.white} />
              </View>
              <Text style={[styles.champLabel, isActive && styles.champLabelActive]} numberOfLines={2}>
                {item.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/* ──────────────── Header com seletor de esporte ────────────── */

interface HeaderProps { sport: SportTheme; onSportPress: () => void; }

function Header({ sport, onSportPress }: HeaderProps) {
  const { openMenu, openDepositModal, balance, isAuthenticated } = useAuth();
  const balanceLabel = isAuthenticated && balance !== null
    ? `R$ ${balance.toFixed(2).replace('.', ',')}`
    : 'R$ 0,00';

  return (
    <View style={styles.header}>
      <Logotipo width={80} height={28} />

      {/* Sport selector pill */}
      <Pressable style={[styles.sportSelector, { borderColor: sport.accent + '80', paddingHorizontal: 12 }]} onPress={onSportPress}>
        <Text style={styles.sportSelectorEmoji}>{sport.emoji}</Text>
      </Pressable>

      <View style={styles.headerActions}>
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
  );
}

/** Banner promocional com paginação */
function PromoBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / BANNER_W);
      setActiveIndex(idx);
    },
    [],
  );

  return (
    <View style={styles.bannerSection}>
      <FlatList
        ref={flatListRef}
        data={BANNERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_W + 12}
        decelerationRate="fast"
        contentContainerStyle={styles.bannerList}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bannerCard}>
            <Image source={item.image} style={styles.bannerImage} />
            {!item.hideOverlay && (
              <>
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.82)']}
                  style={styles.bannerGradient}
                />
                <View style={styles.bannerContent}>
                  <View style={[styles.bannerBadge, { borderColor: item.accent }]}>
                    <Text style={[styles.bannerBadgeText, { color: item.accent }]}>{item.badge}</Text>
                  </View>
                  <Text style={styles.bannerTitle}>{item.game}</Text>
                  <Text style={styles.bannerSubtitle}>
                    Multiplicador até{' '}
                    <Text style={[styles.bannerMultiplier, { color: colors.secondary }]}>{item.multiplier}</Text>
                  </Text>
                  <View style={styles.bannerButtons}>
                    <Pressable style={styles.bannerBtnPlay}>
                      <Text style={styles.bannerBtnPlayText}>▶  Jogar</Text>
                    </Pressable>
                    <Pressable style={styles.bannerBtnInfo}>
                      <Text style={styles.bannerBtnInfoText}>+ Info</Text>
                    </Pressable>
                  </View>
                </View>
              </>
            )}
          </View>
        )}
      />

      {/* Indicadores de paginação */}
      <View style={styles.dots}>
        {BANNERS.map((b, i) => (
          <View
            key={b.id}
            style={[
              styles.dot,
              i === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const STORY_DURATION = 10000;

function StoryViewerModal({
  story,
  stories,
  onClose,
  onViewed,
  onNext,
  onPrev,
}: {
  story: StoryItem;
  stories: StoryItem[];
  onClose: () => void;
  onViewed: (id: string) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const currentIndex = stories.findIndex((s) => s.id === story.id);
  const progress = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  const player = useVideoPlayer(
    story.videoUrl ? { uri: story.videoUrl } : null,
    (p) => {
      if (story.videoUrl) {
        p.loop = false;
        p.play();
      }
    },
  );

  function startProgress(durationMs: number) {
    animRef.current?.stop();
    progress.setValue(0);
    animRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: durationMs,
      useNativeDriver: false,
    });
    animRef.current.start(({ finished }) => {
      if (finished) onNext();
    });
  }

  useEffect(() => {
    onViewed(story.id);
    progress.setValue(0);

    if (!story.videoUrl) {
      startProgress(STORY_DURATION);
      return () => { animRef.current?.stop(); };
    }

    const sub = player.addListener('statusChange', (status) => {
      if (status.status === 'readyToPlay' && player.duration > 0) {
        startProgress(player.duration * 1000);
        sub.remove();
      }
    });

    startProgress(STORY_DURATION);

    return () => {
      sub.remove();
      animRef.current?.stop();
    };
  }, [story.id]);

  const { width: SW } = Dimensions.get('window');
  const segmentW = (SW - 32 - (stories.length - 1) * 4) / stories.length;

  return (
    <Modal
      visible
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <View style={styles.storyModalOverlay}>
        {story.videoUrl ? (
          <VideoView
            player={player}
            style={styles.storyModalBg}
            contentFit="cover"
            nativeControls={false}
          />
        ) : story.thumbnailUrl ? (
          <Image source={{ uri: story.thumbnailUrl }} style={styles.storyModalBg} />
        ) : (
          <View style={[styles.storyModalBg, { backgroundColor: colors.card }]} />
        )}

        <View style={styles.storyModalDim} />

        {/* Barras de progresso */}
        <View style={styles.storyProgressRow}>
          {stories.map((s, i) => (
            <View key={s.id} style={[styles.storyProgressSegment, { width: segmentW, backgroundColor: 'rgba(255,255,255,0.35)' }]}>
              {i < currentIndex && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.white }]} />
              )}
              {i === currentIndex && (
                <Animated.View
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      backgroundColor: colors.white,
                      width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        {/* Header */}
        <View style={styles.storyModalHeader}>
          <View style={styles.storyModalUser}>
            <View style={styles.storyModalAvatar}>
              {story.thumbnailUrl ? (
                <Image source={{ uri: story.thumbnailUrl }} style={styles.storyModalAvatarImg} />
              ) : (
                <Text style={styles.storyInitial}>{story.title.charAt(0).toUpperCase()}</Text>
              )}
            </View>
            <Text style={styles.storyModalTitle}>{story.title}</Text>
          </View>
          <Pressable onPress={onClose} hitSlop={12} style={styles.storyModalClose}>
            <Text style={styles.storyModalCloseText}>✕</Text>
          </Pressable>
        </View>

        {/* Zonas de toque: prev / next */}
        <View style={styles.storyTouchRow} pointerEvents="box-none">
          <Pressable style={styles.storyTouchZone} onPress={onPrev} />
          <Pressable style={styles.storyTouchZone} onPress={onNext} />
        </View>
      </View>
    </Modal>
  );
}

function StoriesBar() {
  const { token, isAuthenticated } = useAuth();
  const [stories, setStories] = useState<StoryItem[]>(STORIES_FALLBACK);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});

  async function generateThumbs(items: StoryItem[]) {
    const entries = await Promise.all(
      items.map(async (s) => {
        if (!s.videoUrl) return null;
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(s.videoUrl, { time: 0 });
          return [s.id, uri] as [string, string];
        } catch {
          return null;
        }
      }),
    );
    const map: Record<string, string> = {};
    for (const entry of entries) {
      if (entry) map[entry[0]] = entry[1];
    }
    setThumbs(map);
  }

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated || !token) return;
      storiesApi
        .list(token)
        .then((data) => {
          if (data.length > 0) {
            setStories(data);
            generateThumbs(data);
          }
        })
        .catch(() => { });
    }, [isAuthenticated, token]),
  );

  function handleViewed(id: string) {
    if (!token) return;
    storiesApi.markViewed(id, token).catch(() => { });
    setStories(prev => prev.map(s => (s.id === id ? { ...s, viewed: true } : s)));
  }

  function handleNext() {
    setActiveIndex(prev => {
      if (prev === null) return null;
      const next = prev + 1;
      return next < stories.length ? next : null;
    });
  }

  function handlePrev() {
    setActiveIndex(prev => {
      if (prev === null) return null;
      const p = prev - 1;
      return p >= 0 ? p : 0;
    });
  }

  const activeStory = activeIndex !== null ? stories[activeIndex] : null;

  return (
    <>
      {activeStory && (
        <StoryViewerModal
          story={activeStory}
          stories={stories}
          onClose={() => setActiveIndex(null)}
          onViewed={handleViewed}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContainer}
      >
        {stories.map((story, index) => (
          <Pressable key={story.id} style={styles.storyItem} onPress={() => setActiveIndex(index)}>
            <View
              style={[
                styles.storyRingOuter,
                !story.viewed ? styles.storyRingActive : styles.storyRingInactive,
              ]}
            >
              <View style={styles.storyRingGap}>
                <View style={styles.storyCircle}>
                  {thumbs[story.id] || story.thumbnailUrl ? (
                    <Image source={{ uri: thumbs[story.id] ?? story.thumbnailUrl! }} style={styles.storyThumb} />
                  ) : (
                    <Text style={styles.storyInitial}>{story.title.charAt(0).toUpperCase()}</Text>
                  )}
                </View>
              </View>
            </View>
            <Text
              style={[
                styles.storyLabel,
                !story.viewed ? styles.storyLabelActive : styles.storyLabelInactive,
              ]}
              numberOfLines={1}
            >
              {story.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}



/* ───────────────── Sport Dropdown ───────────────── */

function SportDropdown({
  current,
  insets,
  onSelect,
  onClose,
}: {
  current: SportType;
  insets: any;
  onSelect: (s: SportType) => void;
  onClose: () => void;
}) {
  const translateY = useSharedValue(-240);
  useEffect(() => { translateY.value = withTiming(0, { duration: 200 }); }, []);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <>
      {/* Backdrop */}
      <Pressable style={styles.dropBackdrop} onPress={onClose} />
      <Animated2.View style={[styles.sportDropdown, animStyle, { maxHeight: 320, top: (insets.top || 0) + 56, zIndex: 18 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {SPORT_ORDER.map(sid => {
            const t = SPORT_THEMES[sid];
            const isActive = current === sid;
            return (
              <Pressable
                key={sid}
                style={[styles.dropItem, isActive && { backgroundColor: t.accent + '1A' }]}
                onPress={() => onSelect(sid)}
              >
                <Text style={styles.dropEmoji}>{t.emoji}</Text>
                <Text style={[styles.dropLabel, { color: isActive ? t.accent : '#fff' }]}>{t.label}</Text>
                {isActive && <View style={[styles.dropCheck, { backgroundColor: t.accent }]} />}
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated2.View>
    </>
  );
}

/* ───────────────── BetSlip Panel ───────────────── */

interface BetSlipPanelProps {
  data: BetSlipData;
  betAmount: string;
  onChangeBet: (v: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

function BetSlipPanel({ data, betAmount, onChangeBet, onClose, onConfirm }: BetSlipPanelProps) {
  // Sem animação de entrada — aparece diretamente
  const translateY = useSharedValue(0);

  // PanResponder: detecta swipe para CIMA e dispensa o painel
  const pan = useRef(
    PanResponder.create({
      // Só assume o gesto se for um movimento claramente vertical para cima
      onMoveShouldSetPanResponder: (_, gs) =>
        gs.dy < -8 && Math.abs(gs.dy) > Math.abs(gs.dx) * 1.5,
      onPanResponderMove: (_, gs) => {
        if (gs.dy < 0) translateY.value = gs.dy; // acompanha o dedo
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy < -50 || gs.vy < -0.5) {
          // Swipe rápido/longe o suficiente → fecha
          translateY.value = withTiming(-260, { duration: 180 });
          setTimeout(onClose, 175);
        } else {
          // Volta para posição original
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

  return (
    <Animated2.View style={[styles.betSlip, animStyle]} {...pan.panHandlers}>
      {/* Alça de arrasto — dica visual para o usuário */}
      <View style={styles.betSlipDragHandle} />

      {/* Row 1: odd info */}
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
        <Pressable onPress={onClose} style={styles.betSlipClose} hitSlop={12}>
          <Text style={styles.betSlipCloseText}>✕</Text>
        </Pressable>
      </View>

      {/* Row 2: inputs */}
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
        <Pressable style={styles.betSlipTrash} onPress={() => onChangeBet('')}>
          <Text style={styles.betSlipTrashIcon}>🗑️</Text>
        </Pressable>
      </View>

      {/* Row 3: ganho potencial + confirmar */}
      <View style={styles.betSlipFooter}>
        <View>
          <Text style={styles.betSlipGainLabel}>GANHO POTENCIAL</Text>
          <Text style={styles.betSlipGainValue}>R$ {gain}</Text>
        </View>
        <Pressable style={styles.betSlipConfirm} onPress={onConfirm}>
          <Text style={styles.betSlipConfirmText}>APOSTAR</Text>
        </Pressable>
      </View>
    </Animated2.View>
  );
}

/* ───────────────────── Tela principal ───────────────────── */

export default function FutebolScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [selectedSport, setSelectedSport] = useState<SportType>('todos');
  const [showDropdown, setShowDropdown] = useState(false);
  const [betSlip, setBetSlip] = useState<BetSlipData | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [activeLiveIndex, setActiveLiveIndex] = useState(0);

  const sport = SPORT_THEMES[selectedSport];

  const onLiveScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
      setActiveLiveIndex(idx);
    },
    [],
  );

  function openBetSlip(data: BetSlipData) {
    if (!isAuthenticated) { openAuthModal('login'); return; }
    setShowDropdown(false);
    setBetSlip(data);
    setBetAmount('');
  }
  function closeBetSlip() { setBetSlip(null); setBetAmount(''); }
  function handleConfirmBet() { closeBetSlip(); }
  function handleGamePress() {
    if (!isAuthenticated) { openAuthModal('login'); return; }
    openBetSlip({ matchLabel: 'Bragantino vs Botafogo', oddLabel: 'Empate', oddValue: 3.30, league: 'Brasileirão' });
  }
  function handleSportSelect(s: SportType) {
    setSelectedSport(s);
    setShowDropdown(false);
    closeBetSlip();
  }

  return (
    <View style={[styles.container, { backgroundColor: sport.bg }]}>
      {/* Fixed header */}
      <View style={[styles.headerWrapper, { backgroundColor: sport.bg, paddingTop: insets.top }]}>
        <Header sport={sport} onSportPress={() => setShowDropdown(v => !v)} />
      </View>

      {/* Dropdown */}
      {showDropdown && (
        <SportDropdown current={selectedSport} insets={insets} onSelect={handleSportSelect} onClose={() => setShowDropdown(false)} />
      )}

      {/* BetSlip */}
      {betSlip && !showDropdown && (
        <BetSlipPanel data={betSlip} betAmount={betAmount} onChangeBet={setBetAmount} onClose={closeBetSlip} onConfirm={handleConfirmBet} />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 88 + (insets.bottom || 10) + 24 }]}
      >
        <View style={{ height: betSlip && !showDropdown ? 190 : (insets.top || 0) + 52 }} />

        {/* ── TODOS ── */}
        {selectedSport === 'todos' && (
          <TodosContent onBetPress={openBetSlip} onSportSelect={handleSportSelect} />
        )}

        {/* ── FUTEBOL ── */}
        {selectedSport === 'futebol' && (
          <>
            <StoriesBar />
            <PromoBanner />
            <ChampionshipsBar />
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleBar} />
              <Text style={styles.sectionTitle}>Ao Vivo</Text>
            </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.liveScrollContainer}
          snapToInterval={SCREEN_W}
          decelerationRate="fast"
          onScroll={onLiveScroll}
          scrollEventThrottle={16}
        >
          {LIVE_MATCHES.map((match) => (
            <LiveMatchCard
              key={match.id}
              style={styles.liveMatchCardWidth}
              data={{
                league: match.league,
                isLive: match.isLive,
                minute: match.minute,
                homeScore: match.homeScore,
                awayScore: match.awayScore,
                homeIcon: <match.HomeIcon width={52} height={52} />,
                awayIcon: <match.AwayIcon width={52} height={52} />,
                odds: match.odds,
                suggestionTeam: match.suggestionTeam,
                suggestionDetail: match.suggestionDetail,
                defaultSelected: match.defaultSelected,
              }}
              onBetPress={() => openBetSlip({
                matchLabel: `${match.homeTeam} vs ${match.awayTeam}`,
                oddLabel: match.odds.find(o => o.key === match.defaultSelected)?.label || 'Empate',
                oddValue: match.odds.find(o => o.key === match.defaultSelected)?.odd || 1.00,
                league: match.league,
              })}
            />
          ))}
        </ScrollView>

        <View style={styles.liveDots}>
          {LIVE_MATCHES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeLiveIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
        <MegaCotacaoSection onPress={openBetSlip} />
        <PopularesSection onPress={openBetSlip} />
          </>
        )}

        {/* ── BASQUETE ── */}
        {selectedSport === 'basquete' && <BasqueteContent onBetPress={openBetSlip} />}
        {/* ── TÊnis ── */}
        {selectedSport === 'tenis' && <TenisContent onBetPress={openBetSlip} />}
        {/* ── VÔLEI ── */}
        {selectedSport === 'volei' && <VoleiContent onBetPress={openBetSlip} />}
        {/* ── ESPORTS ── */}
        {selectedSport === 'esports' && <ESportsContent onBetPress={openBetSlip} />}
      </ScrollView>
    </View>
  );
}

/* ───────────────────── Estilos ───────────────────── */

const styles = StyleSheet.create({
  /* ── Section header ── */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 4,
    gap: 10,
  },
  sectionTitleBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: colors.secondary,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  /* ── Sport Selector ── */
  sportSelector: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1.5, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  sportSelectorEmoji: { fontSize: 14 },
  sportSelectorLabel: { fontSize: 13, fontWeight: '800' },
  sportSelectorArrow: { fontSize: 12, fontWeight: '700' },

  /* ── Sport Dropdown ── */
  dropBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 17 },
  sportDropdown: {
    position: 'absolute', top: 56, left: 16, zIndex: 18,
    backgroundColor: '#0D1E50', borderRadius: 16,
    paddingVertical: 6, minWidth: 200,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  dropItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, gap: 12 },
  dropEmoji: { fontSize: 18 },
  dropLabel: { fontSize: 15, fontWeight: '700', flex: 1 },
  dropCheck: { width: 8, height: 8, borderRadius: 4 },

  /* ── Header wrapper ── */
  headerWrapper: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
  },

  /* ── Bet Slip ── */
  betSlip: {
    position: 'absolute',
    top: 56, // logo abaixo do header
    left: 0,
    right: 0,
    zIndex: 15, // atrás do header (zIndex 20), à frente do scroll
    backgroundColor: '#042B7A',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  betSlipQuickText: { color: colors.secondary, fontSize: 12, fontWeight: '700' },
  betSlipAmountBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  betSlipAmountPrefix: { color: colors.grey, fontSize: 12, fontWeight: '600' },
  betSlipAmountInput: { flex: 1, color: colors.white, fontSize: 15, fontWeight: '700', padding: 0 },
  betSlipTrash: { padding: 6 },
  betSlipTrashIcon: { fontSize: 16 },

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

  /* ── Layout raiz ── */
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  scroll: {
    paddingBottom: 0,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 50,
    paddingVertical: 6,
    paddingRight: 18,
    paddingLeft: 6,
    gap: 10,
  },
  depositCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  depositCircleText: {
    color: colors.primaryDark,
    fontSize: 26,
    fontWeight: '400',
    lineHeight: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
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
    gap: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 4,
  },
  menuBar: {
    width: 22,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: colors.white,
  },

  searchIconBtn: {
    padding: 6,
  },

  /* ── Banner ── */
  bannerSection: {
    marginTop: 18,
  },
  bannerList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  bannerCard: {
    width: BANNER_W,
    height: 230,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  bannerContent: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    gap: 6,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  bannerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.2,
    lineHeight: 30,
  },
  bannerSubtitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.9,
  },
  bannerMultiplier: {
    fontWeight: '800',
    fontSize: 14,
  },
  bannerButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  bannerBtnPlay: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 12,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  bannerBtnPlayText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },
  bannerBtnInfo: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  bannerBtnInfoText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },

  /* ── Dots ── */
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.secondary,
  },
  dotInactive: {
    width: 6,
    backgroundColor: colors.grey,
  },

  /* ── Category pills ── */
  pillsContainer: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 6,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pillActive: {
    backgroundColor: colors.secondary,
  },
  pillInactive: {
    backgroundColor: colors.card,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: colors.primaryDark,
  },
  pillTextInactive: {
    color: colors.white,
  },

  /* ── Championships ── */
  champContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 10,
  },
  champItem: {
    alignItems: 'center',
  },
  champCard: {
    width: 76,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  champCardActive: {
    borderColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  champCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  champCircleActive: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(56,230,125,0.12)',
  },
  champLabel: {
    color: colors.grey,
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 14,
    minHeight: 28,
    textAlignVertical: 'top',
  },
  champLabelActive: {
    color: colors.white,
  },

  /* ── Stories ── */
  storiesContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
    gap: 16,
  },
  storyItem: {
    alignItems: 'center',
    gap: 6,
    width: 68,
  },
  storyRingOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    padding: 3,
  },
  storyRingActive: {
    borderColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 4,
  },
  storyRingInactive: {
    borderColor: colors.grey,
  },
  storyRingGap: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
  },
  storyCircle: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyEmoji: {
    fontSize: 26,
  },
  storyThumb: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  storyInitial: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  storyLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  storyLabelActive: {
    color: colors.white,
  },
  storyLabelInactive: {
    color: colors.grey,
  },

  /* ── Story Modal ── */
  storyModalOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  storyModalBg: {
    ...StyleSheet.absoluteFillObject,
  },
  storyModalDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  storyProgressRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 52,
    gap: 4,
  },
  storyProgressSegment: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  storyModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 14,
  },
  storyModalUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  storyModalAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  storyModalAvatarImg: {
    width: '100%',
    height: '100%',
  },
  storyModalTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  storyModalClose: {
    padding: 6,
  },
  storyModalCloseText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '300',
  },
  storyTouchRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    top: 120,
  },
  storyTouchZone: {
    flex: 1,
  },

  liveScrollContainer: {
    paddingBottom: 12,
  },
  liveMatchCardWidth: {
    width: SCREEN_W,
    marginTop: 0, // Overriding the default 20
  },
  liveDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -8,
    marginBottom: 8,
    gap: 6,
  },
  /* ── Populares ── */
  popHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
    marginTop: 24,
  },
  popToggles: {
    flexDirection: 'row',
    gap: 6,
  },
  popToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  popToggleBtnActive: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(56,230,125,0.12)',
  },
  popToggleText: {
    color: colors.grey,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  popToggleTextActive: {
    color: colors.secondary,
  },
  sportCatsRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 8,
  },
  sportPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  sportPillActive: {
    backgroundColor: colors.card,
    borderColor: colors.secondary,
  },
  sportPillInactive: {
    backgroundColor: colors.card,
    borderColor: 'transparent',
  },
  sportPillText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  sportPillTextActive: {
    color: colors.white,
  },
  sportPillTextInactive: {
    color: colors.grey,
  },

  /* ── Mega Cotação ── */
  megaContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  megaCard: {
    width: 180,
    borderRadius: 14,
    backgroundColor: colors.card,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  megaDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  megaAccentBar: {
    width: 3,
    height: 13,
    borderRadius: 2,
    backgroundColor: colors.secondary,
  },
  megaDate: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  megaTime: {
    color: colors.grey,
    fontSize: 11,
    fontWeight: '600',
  },
  megaMatchArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  megaTeam: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  megaEmoji: {
    fontSize: 28,
  },
  megaTeamName: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },
  megaVs: {
    color: colors.grey,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 6,
  },
  megaLeague: {
    color: colors.grey,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  megaOddsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  megaOddsLabel: {
    color: colors.grey,
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  megaOddBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 3,
  },
  megaOddValue: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '900',
  },

  teamIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
});
