import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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

/* ───────────────────── Constantes ───────────────────── */

const { width: SCREEN_W } = Dimensions.get('window');
const BANNER_W = SCREEN_W - 32;
const BANNER_H = 160;

/* ───────────────────── Dados mock ───────────────────── */

const STORIES_FALLBACK: StoryItem[] = [
  { id: 's1', title: '1 MILHÃO',      videoUrl: '', thumbnailUrl: null, order: 1, active: true,  createdAt: '', viewed: false },
  { id: 's2', title: 'COTAÇÕES',      videoUrl: '', thumbnailUrl: null, order: 2, active: true,  createdAt: '', viewed: false },
  { id: 's3', title: 'PRÊMIOS',       videoUrl: '', thumbnailUrl: null, order: 3, active: false, createdAt: '', viewed: false },
  { id: 's4', title: 'CASHBACK',      videoUrl: '', thumbnailUrl: null, order: 4, active: false, createdAt: '', viewed: false },
  { id: 's5', title: 'GRÁTIS',        videoUrl: '', thumbnailUrl: null, order: 5, active: false, createdAt: '', viewed: false },
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
  emoji: string;
}

interface MegaCotacaoMatch {
  id: string;
  date: string;
  time: string;
  homeTeam: string;
  homeEmoji: string;
  awayTeam: string;
  awayEmoji: string;
  league: string;
  odd: number;
}

const MEGA_COTACAO: MegaCotacaoMatch[] = [
  { id: 'm1', date: 'Hoje',   time: '15:30', homeTeam: 'Flamengo',   homeEmoji: '🔴', awayTeam: 'Palmeiras',  awayEmoji: '🟢', league: 'Brasileirão',     odd: 4.20 },
  { id: 'm2', date: 'Hoje',   time: '18:00', homeTeam: 'Barcelona',  homeEmoji: '🔵', awayTeam: 'Real Madrid', awayEmoji: '⚪', league: 'La Liga',         odd: 3.80 },
  { id: 'm3', date: 'Amanhã', time: '20:45', homeTeam: 'PSG',        homeEmoji: '🔷', awayTeam: 'Man City',   awayEmoji: '🩵', league: 'Champions League', odd: 5.50 },
  { id: 'm4', date: 'Amanhã', time: '22:00', homeTeam: 'Brasil',     homeEmoji: '🇧🇷', awayTeam: 'Argentina',  awayEmoji: '🇦🇷', league: 'Copa América',    odd: 2.90 },
];

const CHAMPIONSHIPS: Championship[] = [
  { id: 'c1', label: 'Copa do\nNordeste',  emoji: '🏆' },
  { id: 'c2', label: 'Brasileirão',         emoji: '🇧🇷' },
  { id: 'c3', label: 'Copa do\nBrasil',     emoji: '🏅' },
  { id: 'c4', label: 'Libertadores',        emoji: '⭐' },
  { id: 'c5', label: 'Champions\nLeague',   emoji: '🌟' },
  { id: 'c6', label: 'Premier\nLeague',     emoji: '🦁' },
  { id: 'c7', label: 'La Liga',             emoji: '🔴' },
  { id: 'c8', label: 'Serie A',             emoji: '🇮🇹' },
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
  { id: 'sp1', label: 'Futebol',  Icon: SoccerIcon },
  { id: 'sp2', label: 'Tênis',    Icon: TennisIcon },
  { id: 'sp3', label: 'Basquete', Icon: BasketballIcon },
  { id: 'sp4', label: 'MMA',      Icon: GloveIcon },
  { id: 'sp5', label: 'E-Sports', Icon: ControllerIcon },
];

const POPULARES_MATCHES: MegaCotacaoMatch[] = [
  { id: 'p1', date: 'Hoje',   time: '16:00', homeTeam: 'Botafogo',   homeEmoji: '⭐', awayTeam: 'Vasco',      awayEmoji: '⚫', league: 'Brasileirão',       odd: 2.10 },
  { id: 'p2', date: 'Hoje',   time: '19:00', homeTeam: 'São Paulo', homeEmoji: '🔴', awayTeam: 'Corinthians', awayEmoji: '⚪', league: 'Brasileirão',       odd: 3.50 },
  { id: 'p3', date: 'Amanhã', time: '21:00', homeTeam: 'Man Utd',   homeEmoji: '🔴', awayTeam: 'Arsenal',    awayEmoji: '🔴', league: 'Premier League',     odd: 2.80 },
  { id: 'p4', date: 'Amanhã', time: '17:30', homeTeam: 'Juve',      homeEmoji: '⚫', awayTeam: 'Inter',      awayEmoji: '🐍', league: 'Serie A',            odd: 3.10 },
];

/* ───────────────────── Componentes auxiliares ──────────── */

/** Seção Mega Cotação */
function MegaCotacaoSection({ onPress }: { onPress: () => void }) {
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
          <Pressable key={match.id} style={styles.megaCard} onPress={onPress}>
            <View style={styles.megaDateRow}>
              <View style={styles.megaAccentBar} />
              <Text style={styles.megaDate}>{match.date}</Text>
              <Text style={styles.megaTime}>{match.time}</Text>
            </View>
            <View style={styles.megaMatchArea}>
              <View style={styles.megaTeam}>
                <Text style={styles.megaEmoji}>{match.homeEmoji}</Text>
                <Text style={styles.megaTeamName} numberOfLines={1}>{match.homeTeam}</Text>
              </View>
              <Text style={styles.megaVs}>VS</Text>
              <View style={styles.megaTeam}>
                <Text style={styles.megaEmoji}>{match.awayEmoji}</Text>
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
function PopularesSection({ onPress }: { onPress: () => void }) {
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
          <Pressable key={match.id} style={styles.megaCard} onPress={onPress}>
            <View style={styles.megaDateRow}>
              <View style={styles.megaAccentBar} />
              <Text style={styles.megaDate}>{match.date}</Text>
              <Text style={styles.megaTime}>{match.time}</Text>
            </View>
            <View style={styles.megaMatchArea}>
              <View style={styles.megaTeam}>
                <Text style={styles.megaEmoji}>{match.homeEmoji}</Text>
                <Text style={styles.megaTeamName} numberOfLines={1}>{match.homeTeam}</Text>
              </View>
              <Text style={styles.megaVs}>VS</Text>
              <View style={styles.megaTeam}>
                <Text style={styles.megaEmoji}>{match.awayEmoji}</Text>
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
                <Text style={styles.champEmoji}>{item.emoji}</Text>
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


function Header() {
  const { openMenu, openDepositModal, balance, isAuthenticated } = useAuth();

  const balanceLabel = isAuthenticated && balance !== null
    ? `R$ ${balance.toFixed(2).replace('.', ',')}`
    : 'R$ 0,00';

  return (
    <View style={styles.header}>
      {/* Logo */}
      <Logotipo width={80} height={28} />

      <View style={styles.headerActions}>
        {/* Lupa */}
        <Pressable style={styles.searchIconBtn}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle cx="11" cy="11" r="7" stroke="#FFFFFF" strokeWidth="2" />
            <Line x1="16.5" y1="16.5" x2="22" y2="22" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </Svg>
        </Pressable>

        {/* Pill unificada: botão + */}
        <Pressable style={styles.balancePill} onPress={openDepositModal}>
          <View style={styles.depositCircle}>
            <View style={styles.plusHorizontal} />
            <View style={styles.plusVertical} />
          </View>
          <Text style={styles.balanceValue}>{balanceLabel}</Text>
        </Pressable>

        {/* Sanduiche */}
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
        .catch(() => {});
    }, [isAuthenticated, token]),
  );

  function handleViewed(id: string) {
    if (!token) return;
    storiesApi.markViewed(id, token).catch(() => {});
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

/* ───────────────────── Tela principal ───────────────────── */

export default function FutebolScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, openAuthModal } = useAuth();

  function handleGamePress() {
    if (!isAuthenticated) openAuthModal('login');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 88 + (insets.bottom || 10) + 24 }]}
      >
        <Header />
        <StoriesBar />
        <PromoBanner />
        <ChampionshipsBar />
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleBar} />
          <Text style={styles.sectionTitle}>Ao Vivo</Text>
        </View>
        <LiveMatchCard onBetPress={handleGamePress} />
        <MegaCotacaoSection onPress={handleGamePress} />
        <PopularesSection onPress={handleGamePress} />
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
  champEmoji: {
    fontSize: 22,
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
    width: 160,
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
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
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

});
