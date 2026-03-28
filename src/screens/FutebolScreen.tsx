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
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';
// import Logotipo from '../../assets/logotipo.svg';
import LiveMatchCard from '../components/LiveMatchCard';
import { useAuth } from '../context/AuthContext';
import { storiesApi, StoryItem } from '../services/api';
import { BetSlipData, SPORT_ORDER, SPORT_THEMES, SportTheme, SportType } from '../types/sports';
import TodosContent from '../components/sports/TodosContent';
import BasqueteContent from '../components/sports/BasqueteContent';
import TenisContent from '../components/sports/TenisContent';
import VoleiContent from '../components/sports/VoleiContent';
import ESportsContent from '../components/sports/ESportsContent';
import StoriesBar from '../components/StoriesBar';
import { GradientBackground } from '../components/GradientBackground';


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
import SubtractIcon from '../../assets/Subtract.svg';
function Fighter1Icon({ width = 48, height = 48 }: { width?: number; height?: number }) {
  return <Image source={require('../../assets/fighter_one.png')} style={{ width: width * 0.8, height: height * 0.8, borderRadius: (width * 0.8) / 2 }} />;
}

function Fighter2Icon({ width = 48, height = 48 }: { width?: number; height?: number }) {
  return <Image source={require('../../assets/fighter_two.png')} style={{ width: width * 0.8, height: height * 0.8, borderRadius: (width * 0.8) / 2 }} />;
}

/* ───────────────────── Constantes ───────────────────── */

const { width: SCREEN_W } = Dimensions.get('window');
const BANNER_W = SCREEN_W - 32;
const BANNER_H = 160;


const BANNERS: any[] = [
  {
    id: 'b0',
    badge: 'EM DESTAQUE',
    badgeIcon: SubtractIcon,
    game: 'Copa do\nMundo ',
    gameHighlight: '26',
    subtitle: 'ODDS Turbinadas',
    buttonText: 'Criar Aposta',
    image: require('../../assets/copadomundo.png'),
    accent: '#38E67D',
    hideOverlay: false,
    hideInfoButton: true,
  },
  {
    id: 'b-hexa',
    badge: '',
    game: '',
    multiplier: '',
    image: require('../../assets/rumo-ao-hexa.png'),
    accent: '#38E67D',
    hideOverlay: true,
  },
];



interface Championship {
  id: string;
  bgUrl?: any;
  logoUrl?: any;
  isDestaque?: boolean;
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
  sportId: string;
}

const MEGA_COTACAO: MegaCotacaoMatch[] = [
  { id: 'm1', date: 'Hoje', time: '15:30', homeTeam: 'Flamengo', HomeIcon: FlamengoIcon, awayTeam: 'Palmeiras', AwayIcon: PalmeirasIcon, league: 'Brasileirão', odd: 4.20, sportId: 'sp1' },
  { id: 'm2', date: 'Hoje', time: '18:00', homeTeam: 'Barcelona', HomeIcon: BarcelonaIcon, awayTeam: 'Real Madrid', AwayIcon: RealMadridIcon, league: 'La Liga', odd: 3.80, sportId: 'sp1' },
  { id: 'm3', date: 'Amanhã', time: '20:45', homeTeam: 'Alemanha', HomeIcon: AlemanhaIcon, awayTeam: 'Inglaterra', AwayIcon: InglaterraIcon, league: 'Amistoso Internacional', odd: 5.50, sportId: 'sp1' },
  { id: 'm4', date: 'Amanhã', time: '22:00', homeTeam: 'Brasil', HomeIcon: BrasilIcon, awayTeam: 'Espanha', AwayIcon: EspanhaIcon, league: 'Copa do Mundo', odd: 2.90, sportId: 'sp1' },
  { id: 'm5', date: 'Hoje', time: '14:00', homeTeam: 'Alcaraz', HomeIcon: AlemanhaIcon, awayTeam: 'Djokovic', AwayIcon: EspanhaIcon, league: 'Wimbledon', odd: 1.85, sportId: 'sp2' },
  { id: 'm6', date: 'Hoje', time: '16:00', homeTeam: 'Nadal', HomeIcon: FluminenseIcon, awayTeam: 'Ruud', AwayIcon: BarcelonaIcon, league: 'Roland Garros', odd: 3.10, sportId: 'sp2' },
  { id: 'm7', date: 'Amanhã', time: '21:30', homeTeam: 'Lakers', HomeIcon: BrasilIcon, awayTeam: 'Warriors', AwayIcon: AlemanhaIcon, league: 'NBA', odd: 2.10, sportId: 'sp3' },
  { id: 'm8', date: 'Hoje', time: '19:00', homeTeam: 'Bucks', HomeIcon: PalmeirasIcon, awayTeam: 'Nets', AwayIcon: CorinthiasIcon, league: 'NBA', odd: 1.90, sportId: 'sp3' },
  { id: 'm9', date: 'Hoje', time: '23:00', homeTeam: 'Pereira', HomeIcon: Fighter1Icon, awayTeam: 'Hill', AwayIcon: Fighter2Icon, league: 'UFC 300', odd: 1.70, sportId: 'sp4' },
  { id: 'm10', date: 'Amanhã', time: '22:00', homeTeam: 'Oliveira', HomeIcon: Fighter2Icon, awayTeam: 'Makhachev', AwayIcon: Fighter1Icon, league: 'UFC 294', odd: 2.80, sportId: 'sp4' },
  { id: 'm11', date: 'Hoje', time: '19:00', homeTeam: 'G2', HomeIcon: EspanhaIcon, awayTeam: 'FaZe', AwayIcon: AlemanhaIcon, league: 'PGL Major', odd: 2.40, sportId: 'sp5' },
  { id: 'm12', date: 'Hoje', time: '21:00', homeTeam: 'NAVI', HomeIcon: BrasilIcon, awayTeam: 'Vitality', AwayIcon: InglaterraIcon, league: 'IEM Katowice', odd: 1.95, sportId: 'sp5' },
];

const CHAMPIONSHIPS: Championship[] = [
  { id: 'c1', bgUrl: require('../../assets/bg_nordestecup.png'), logoUrl: require('../../assets/logo_nordestecup.png'), isDestaque: true },
  { id: 'c2', bgUrl: require('../../assets/bg_brasilcup.png'), logoUrl: require('../../assets/logo_brasilcup.png'), isDestaque: false },
  { id: 'c3', bgUrl: require('../../assets/bg_worldcup.png'), logoUrl: require('../../assets/logo_worldcup.png'), isDestaque: true },
  { id: 'c4', bgUrl: require('../../assets/bg_championscup.png'), logoUrl: require('../../assets/logo_championscup.png'), isDestaque: false },
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

function LeagueIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M6 9H4.5C3.67 9 3 8.33 3 7.5V6.5C3 5.67 3.67 5 4.5 5H6" 
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" 
      />
      <Path 
        d="M18 9H19.5C20.33 9 21 8.33 21 7.5V6.5C21 5.67 20.33 5 19.5 5H18" 
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" 
      />
      <Path 
        d="M4 22H20" 
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" 
      />
      <Path 
        d="M10 22V18" 
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" 
      />
      <Path 
        d="M14 22V18" 
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" 
      />
      <Path 
        d="M18 4H6V11C6 14.31 8.69 17 12 17C15.31 17 18 14.31 18 11V4Z" 
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" 
      />
      <Path 
        d="M12 7.5L13.2 10.2H16L13.8 11.8L14.6 14.5L12 13L9.4 14.5L10.2 11.8L8 10.2H10.8L12 7.5Z" 
        fill={color} 
      />
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
  { id: 'p1', date: 'Hoje', time: '16:00', homeTeam: 'Flamengo', HomeIcon: FlamengoIcon, awayTeam: 'Vasco', AwayIcon: VascoIcon, league: 'Brasileirão', odd: 2.10, sportId: 'sp1' },
  { id: 'p2', date: 'Hoje', time: '19:00', homeTeam: 'Fluminense', HomeIcon: FluminenseIcon, awayTeam: 'Corinthians', AwayIcon: CorinthiasIcon, league: 'Brasileirão', odd: 3.50, sportId: 'sp1' },
  { id: 'p3', date: 'Amanhã', time: '21:00', homeTeam: 'Bayer', HomeIcon: BayerIcon, awayTeam: 'Barcelona', AwayIcon: BarcelonaIcon, league: 'Champions League', odd: 2.80, sportId: 'sp1' },
  { id: 'p4', date: 'Amanhã', time: '17:30', homeTeam: 'Bragantino', HomeIcon: BragatinoIcon, awayTeam: 'Palmeiras', AwayIcon: PalmeirasIcon, league: 'Brasileirão', odd: 3.10, sportId: 'sp1' },
  { id: 'p10', date: 'Hoje', time: '15:45', homeTeam: 'Real Madrid', HomeIcon: RealMadridIcon, awayTeam: 'Atletico', AwayIcon: FluminenseIcon, league: 'La Liga', odd: 1.85, sportId: 'sp1' },
  { id: 'p5', date: 'Hoje', time: '20:00', homeTeam: 'Furia', HomeIcon: BrasilIcon, awayTeam: 'Navi', AwayIcon: AlemanhaIcon, league: 'CS2 Major', odd: 5.00, sportId: 'sp5' },
  { id: 'p6', date: 'Hoje', time: '22:00', homeTeam: 'Sinner', HomeIcon: FluminenseIcon, awayTeam: 'Medvedev', AwayIcon: VascoIcon, league: 'Miami Open', odd: 1.95, sportId: 'sp2' },
  { id: 'p11', date: 'Amanhã', time: '14:00', homeTeam: 'Swiatek', HomeIcon: AlemanhaIcon, awayTeam: 'Sabalenka', AwayIcon: EspanhaIcon, league: 'WTA Finals', odd: 1.75, sportId: 'sp2' },
  { id: 'p12', date: 'Hoje', time: '18:30', homeTeam: 'Tsitsipas', HomeIcon: BayerIcon, awayTeam: 'Zverev', AwayIcon: AlemanhaIcon, league: 'Monte Carlo', odd: 2.20, sportId: 'sp2' },
  { id: 'p7', date: 'Hoje', time: '21:00', homeTeam: 'Celtics', HomeIcon: PalmeirasIcon, awayTeam: 'Bulls', AwayIcon: CorinthiasIcon, league: 'NBA', odd: 1.45, sportId: 'sp3' },
  { id: 'p13', date: 'Hoje', time: '22:30', homeTeam: 'Heat', HomeIcon: BrasilIcon, awayTeam: '76ers', AwayIcon: FluminenseIcon, league: 'NBA', odd: 2.65, sportId: 'sp3' },
  { id: 'p14', date: 'Amanhã', time: '20:00', homeTeam: 'Suns', HomeIcon: RealMadridIcon, awayTeam: 'Kings', AwayIcon: VascoIcon, league: 'NBA Playoffs', odd: 1.88, sportId: 'sp3' },
  { id: 'p8', date: 'Amanhã', time: '00:30', homeTeam: 'Poirier', HomeIcon: Fighter1Icon, awayTeam: 'Saint Denis', AwayIcon: Fighter2Icon, league: 'UFC 299', odd: 2.15, sportId: 'sp4' },
  { id: 'p15', date: 'Hoje', time: '23:45', homeTeam: 'Burns', HomeIcon: Fighter2Icon, awayTeam: 'Della', AwayIcon: Fighter1Icon, league: 'UFC 299', odd: 2.30, sportId: 'sp4' },
  { id: 'p16', date: 'Dmg', time: '22:00', homeTeam: 'O Malley', HomeIcon: Fighter1Icon, awayTeam: 'Vera', AwayIcon: Fighter2Icon, league: 'UFC Title Match', odd: 1.60, sportId: 'sp4' },
  { id: 'p9', date: 'Hoje', time: '15:00', homeTeam: 'Liquid', HomeIcon: FluminenseIcon, awayTeam: 'Spirit', AwayIcon: RealMadridIcon, league: 'Dota 2 Masters', odd: 3.20, sportId: 'sp5' },
  { id: 'p17', date: 'Hoje', time: '17:00', homeTeam: 'LOUD', HomeIcon: BrasilIcon, awayTeam: 'Leviatán', AwayIcon: FluminenseIcon, league: 'Valorant VCT', odd: 2.10, sportId: 'sp5' },
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

/** Componente de bolinha pulsante para o AO VIVO */
function PulseDot() {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View 
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF4D4D',
        marginRight: 6,
        opacity: pulse,
        shadowColor: '#FF4D4D',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 2,
      }} 
    />
  );
}

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
function MegaCotacaoSection({ onPress, activeSport }: { onPress: (data: BetSlipData) => void, activeSport: string }) {
  const matches = React.useMemo(() => {
    if (activeSport === 'sp0') {
      return [...MEGA_COTACAO].sort((a, b) => b.odd - a.odd);
    }
    return MEGA_COTACAO.filter(m => m.sportId === activeSport);
  }, [activeSport]);

  if (matches.length === 0) return null;

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
        {matches.map((match) => (
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
function PopularesSection({ onPress, activeSport, setActiveSport }: { onPress: (data: BetSlipData) => void, activeSport: string, setActiveSport: (s: string) => void }) {
  const [tab, setTab] = useState<'live' | 'next'>('live');

  const matches = React.useMemo(() => {
    if (activeSport === 'sp0') {
      return [...POPULARES_MATCHES].sort((a, b) => b.odd - a.odd);
    }
    return POPULARES_MATCHES.filter(m => m.sportId === activeSport);
  }, [activeSport]);

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

      {matches.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.megaContainer}
        >
          {matches.map((match) => (
            <Pressable key={match.id} style={styles.megaCard} onPress={() => onPress({
              matchLabel: `${match.homeTeam} vs ${match.awayTeam}`,
              oddLabel: match.homeTeam,
              oddValue: match.odd,
              league: match.league,
            })}>
              <View style={styles.megaDateRow}>
                <View style={styles.megaAccentBar} />
                {tab === 'live' ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <PulseDot />
                    <Text style={[styles.megaDate, { color: colors.secondary }]}>AO VIVO</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.megaDate}>{match.date}</Text>
                    <Text style={styles.megaTime}>{match.time}</Text>
                  </>
                )}
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
      )}
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
            <View style={styles.champImageWrapper}>
              <View style={[styles.champNativeCard, isActive && styles.champNativeCardActive]}>
                {item.bgUrl && <Image source={item.bgUrl} style={styles.champBgImg} resizeMode="cover" />}
                <View style={styles.champNativeOverlay} />
                {item.logoUrl && (
                  <View style={styles.champLogoContainer}>
                    <Image source={item.logoUrl} style={styles.champLogoImg} resizeMode="contain" />
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/* ──────────────── Header com seletor de esporte ────────────── */

function SearchIcon({ size = 20, color = '#FFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
      <Line x1="16.5" y1="16.5" x2="22" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

interface HeaderProps { sport: SportTheme; onToggleDropdown?: () => void; isDropdownOpen?: boolean; onCloseDropdown?: () => void; }

function Header({ sport, onToggleDropdown, isDropdownOpen, onCloseDropdown }: HeaderProps) {
  const { openMenu, openDepositModal, balance, isAuthenticated } = useAuth();
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    if (isDropdownOpen && isSearchActive) setIsSearchActive(false);
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isSearchActive && isDropdownOpen && onCloseDropdown) onCloseDropdown();
  }, [isSearchActive]);
  const balanceLabel = isAuthenticated && balance !== null
    ? `R$ ${balance.toFixed(2).replace('.', ',')}`
    : 'R$ 0,00';

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Image source={require('../../assets/logo.png')} style={{ width: 72, height: 24, resizeMode: 'contain', marginLeft: -8 }} />

        <Pressable 
          style={[styles.sportSelector, { marginLeft: 16, zIndex: 20 }]} 
          onPress={onToggleDropdown}
        >
          <Text style={styles.sportSelectorEmoji}>{sport.emoji}</Text>
          <Text style={[styles.sportSelectorArrow, { color: colors.secondary }]}>{isDropdownOpen ? '▲' : '▼'}</Text>
        </Pressable>
        <View style={{ flex: 1 }} />

        <View style={styles.headerActions}>
          <View style={{ zIndex: 1, marginRight: 6 }}>
            <Pressable style={[styles.searchIconBtn, isSearchActive && styles.searchIconBtnActive]} onPress={() => setIsSearchActive(!isSearchActive)}>
              <SearchIcon size={24} />
            </Pressable>
            {isSearchActive && (
              <>
                <View style={{ position: 'absolute', bottom: -10, left: -6, right: -6, height: 10, backgroundColor: '#042B7A', zIndex: -1 }} />
                <View pointerEvents="none" style={{ position: 'absolute', bottom: -10, left: -30, width: 30, height: 30, backgroundColor: '#042B7A', zIndex: -1 }}>
                  <View style={{ flex: 1, backgroundColor: colors.primary, borderBottomRightRadius: 30 }} />
                </View>
                <View pointerEvents="none" style={{ position: 'absolute', bottom: -10, right: -30, width: 30, height: 30, backgroundColor: '#042B7A', zIndex: -1 }}>
                  <View style={{ flex: 1, backgroundColor: colors.primary, borderBottomLeftRadius: 30 }} />
                </View>
              </>
            )}
          </View>
          <Pressable style={[styles.balancePill, { zIndex: 20 }]} onPress={openDepositModal}>
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

      {isSearchActive && (
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            placeholderTextColor={colors.secondary}
          />
          <Pressable onPress={() => setIsSearchActive(false)}>
            <Text style={styles.searchCancelText}>Cancelar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

/** Banner promocional com paginação */
function PromoBanner({ onPlay }: { onPlay: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
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
                <View style={[styles.bannerContent, { justifyContent: 'center' }]}>
                  <View style={[styles.bannerBadge, { borderColor: item.accent }, item.badgeIcon && { flexDirection: 'row', alignItems: 'center', paddingRight: 6 }]}>
                    <Text style={[styles.bannerBadgeText, { color: item.accent }]}>{item.badge}</Text>
                    {item.badgeIcon && (
                      <item.badgeIcon width={12} height={12} fill={item.accent} style={{ marginLeft: 6 }} />
                    )}
                  </View>
                  <Text style={styles.bannerTitle}>
                    {item.game}
                    {item.gameHighlight && <Text style={{ color: item.accent }}>{item.gameHighlight}</Text>}
                  </Text>
                  {item.subtitle ? (
                    <Text style={[styles.bannerSubtitle, { fontSize: 16, fontWeight: '600', color: '#fff' }]}>{item.subtitle}</Text>
                  ) : (
                    <Text style={styles.bannerSubtitle}>
                      Multiplicador até{' '}
                      <Text style={[styles.bannerMultiplier, { color: colors.secondary }]}>{item.multiplier}</Text>
                    </Text>
                  )}
                  <View style={styles.bannerButtons}>
                    <Pressable 
                      onPressIn={() => scale.value = withSpring(0.95)}
                      onPressOut={() => scale.value = withSpring(1)}
                      onPress={onPlay}
                    >
                      <Animated2.View style={[
                        styles.bannerBtnPlay, 
                        item.buttonText && { backgroundColor: item.accent },
                        animatedButtonStyle
                      ]}>
                        {item.buttonText ? (
                          <Text style={[styles.bannerBtnPlayText, { color: '#0A1128' }]}>▶  {item.buttonText}</Text>
                        ) : (
                          <Text style={styles.bannerBtnPlayText}>▶  Jogar</Text>
                        )}
                      </Animated2.View>
                    </Pressable>
                    {!item.hideInfoButton && (
                      <Pressable style={styles.bannerBtnInfo}>
                        <Text style={styles.bannerBtnInfoText}>+ Info</Text>
                      </Pressable>
                    )}
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

  const filteredSports = SPORT_ORDER.filter(s => s !== 'todos' && s !== current);

  return (
    <>
      <Pressable style={styles.dropBackdrop} onPress={onClose} />
      <Animated2.View style={[styles.sportDropdown, animStyle, { maxHeight: 320, top: (insets.top || 0) + 72, zIndex: 18 }]}>
        <ScrollView showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
          
          {/* Item selecionado atual, fixo no topo com separador abaixo */}
          <Pressable style={styles.dropItem} onPress={onClose}>
            <Text style={styles.dropEmoji}>{SPORT_THEMES[current].emoji}</Text>
            <Text style={[styles.dropLabel, { color: SPORT_THEMES[current].accent }]}>{SPORT_THEMES[current].label}</Text>
          </Pressable>

          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 16, marginBottom: 4 }} />

          {/* Demais esportes */}
          {filteredSports.map(sid => {
            const t = SPORT_THEMES[sid];
            return (
              <Pressable
                key={sid}
                style={styles.dropItem}
                onPress={() => onSelect(sid)}
              >
                <Text style={styles.dropEmoji}>{t.emoji}</Text>
                <Text style={[styles.dropLabel, { color: '#10D166' }]}>{t.label}</Text>
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
  onExpand?: () => void; // New prop for '+' button
}

function BetSlipPanel({ data, betAmount, onChangeBet, onClose, onConfirm, onExpand }: BetSlipPanelProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const translateY = useSharedValue(-300); // Começa acima da tela

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 14, stiffness: 140 });
  }, []);

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

  function handleBet() {
    setIsConfirmed(true);
    setTimeout(() => {
      translateY.value = withTiming(-300, { duration: 300 });
      setTimeout(onConfirm, 280);
    }, 1000);
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
        {onExpand && (
          <Pressable onPress={onExpand} style={styles.betSlipExpandBtn} hitSlop={12}>
            <Text style={styles.betSlipExpandText}>+</Text>
          </Pressable>
        )}
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
      </View>

      {/* Row 3: ganho potencial + confirmar */}
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
    </Animated2.View>
  );
}

/* ───────────────────── Tela principal ───────────────────── */

export default function FutebolScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigation = useNavigation<any>();

  const [selectedSport, setSelectedSport] = useState<SportType>('futebol');
  const [showDropdown, setShowDropdown] = useState(false);
  const [betSlip, setBetSlip] = useState<BetSlipData | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [activeLiveIndex, setActiveLiveIndex] = useState(0);
  const [activeSportFilter, setActiveSportFilter] = useState('sp0');

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
  function handleConfirmBet() {
    if (!betSlip) return;
    const data = { ...betSlip };
    const parts = data.matchLabel.split(' vs ');
    closeBetSlip();
    
    // Pequeno delay para garantir que o modal fechou suavemente antes da transição de tela
    setTimeout(() => {
      navigation.navigate('MatchDetails', {
        league: data.league,
        homeTeam: parts[0] || 'Internacional',
        awayTeam: parts[1] || 'Chapecoense'
      });
    }, 100);
  }
  function handleGamePress() {
    if (!isAuthenticated) { openAuthModal('login'); return; }
    openBetSlip({ matchLabel: 'Bragantino vs Botafogo', oddLabel: 'Empate', oddValue: 3.30, league: 'Brasileirão' });
  }
  function handleSportSelect(s: SportType) {
    setSelectedSport(s);
    setShowDropdown(false);
    closeBetSlip();
  }
  function handleExpandBet() {
    if (!betSlip) return;
    const parts = betSlip.matchLabel.split(' vs ');
    const homeTeam = parts[0];
    const awayTeam = parts[1];
    closeBetSlip();
    navigation.navigate('MatchDetails', {
      league: betSlip.league,
      homeTeam: homeTeam || 'Internacional',
      awayTeam: awayTeam || 'Chapecoense'
    });
  }

  return (
    <GradientBackground style={styles.container}>
      {/* Fixed header */}
      <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, backgroundColor: colors.primary }} />
        <Header 
          sport={sport} 
          onToggleDropdown={() => setShowDropdown(!showDropdown)} 
          isDropdownOpen={showDropdown} 
          onCloseDropdown={() => setShowDropdown(false)}
        />
      </View>

      {/* Dropdown */}
      {showDropdown && (
        <SportDropdown current={selectedSport} insets={insets} onSelect={handleSportSelect} onClose={() => setShowDropdown(false)} />
      )}

      {/* BetSlip */}
      {betSlip && !showDropdown && (
        <BetSlipPanel data={betSlip} betAmount={betAmount} onChangeBet={setBetAmount} onClose={closeBetSlip} onConfirm={handleConfirmBet} onExpand={handleExpandBet} />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 88 + (insets.bottom || 10) + 60 }]}
      >
        <View style={{ height: 16 }} />

        {/* ── FUTEBOL ── */}
        {selectedSport === 'futebol' && (
          <>
            <StoriesBar />
            <PromoBanner onPlay={handleGamePress} />
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
        <MegaCotacaoSection onPress={openBetSlip} activeSport={activeSportFilter} />
        <PopularesSection onPress={openBetSlip} activeSport={activeSportFilter} setActiveSport={setActiveSportFilter} />
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
    </GradientBackground>
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
    borderRadius: 20,
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
    zIndex: 20,
  },

  /* ── Bet Slip ── */
  betSlip: {
    zIndex: 15, // atrás do header (zIndex 20)
    backgroundColor: '#042B7A',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    marginTop: -16, // tuck under header
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
  },
  scroll: {
    paddingBottom: 0,
  },

  /* ── Header ── */
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
    paddingTop: 14,
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
  searchIconBtnActive: {
    backgroundColor: '#042B7A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#042B7A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  searchCancelText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
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
    borderRadius: 16,
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
    paddingTop: 16,
    paddingBottom: 12,
    gap: 10,
  },
  champItem: {
    alignItems: 'center',
  },
  champImageWrapper: {
    position: 'relative',
    width: 175,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  champNativeCard: {
    width: 175,
    height: 120,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(56, 230, 125, 0.3)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    // Glow effect for the card
    shadowColor: '#38E67D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  champNativeCardActive: {
    borderColor: '#38E67D',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  champBgImg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.5, // Darker background
  },
  champNativeOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)', // Much darker overlay
  },
  champLogoContainer: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    // Glow effect for the cup itself
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  champLogoImg: {
    width: 110, // Larger logo (cup)
    height: 110,
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
