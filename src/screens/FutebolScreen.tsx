import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line } from 'react-native-svg';
import { colors } from '../theme';
import Logotipo from '../../assets/logotipo.svg';
import LiveMatchCard from '../components/LiveMatchCard';
import { useAuth } from '../context/AuthContext';

/* ───────────────────── Constantes ───────────────────── */

const { width: SCREEN_W } = Dimensions.get('window');
const BANNER_W = SCREEN_W - 32;
const BANNER_H = 160;

/* ───────────────────── Dados mock ───────────────────── */

const BANNERS = [
  {
    id: 'b1',
    badge: '● EM DESTAQUE',
    game: 'Gates of Olympus',
    multiplier: '5000x',
    image: require('../../assets/gatesof.jpg'),
    accent: '#3A86FF',
  },
  {
    id: 'b2',
    badge: '● NOVO',
    game: 'Sweet Bonanza',
    multiplier: '21100x',
    image: require('../../assets/sweetbonanza.webp'),
    accent: '#FB5607',
  },
  {
    id: 'b3',
    badge: '● POPULAR',
    game: 'Aviator',
    multiplier: '1000000x',
    image: require('../../assets/aviator.jpeg'),
    accent: '#E63946',
  },
];

interface Story {
  id: string;
  label: string;
  emoji: string;
  active: boolean;
  bg: string;
}

const STORIES: Story[] = [
  { id: 's1', label: 'WORLD CUP',   emoji: '🏆', active: true,  bg: '#01184F' },
  { id: 's2', label: 'FLASH ODDS',  emoji: '⚡', active: true,  bg: '#01184F' },
  { id: 's3', label: 'PROMOÇÕES',   emoji: '🇧🇷', active: false, bg: '#01184F' },
  { id: 's4', label: 'FAVORITOS',   emoji: '⭐', active: false, bg: '#01184F' },
  { id: 's5', label: 'AO VIVO',     emoji: '🔴', active: false, bg: '#01184F' },
  { id: 's6', label: 'LIGAS',       emoji: '🏅', active: false, bg: '#01184F' },
];

interface Championship {
  id: string;
  label: string;
  emoji: string;
}

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

/* ───────────────────── Componentes auxiliares ──────────── */

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
            {/* Imagem de fundo */}
            <Image source={item.image} style={styles.bannerImage} />

            {/* Gradiente sobre o conteúdo */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.82)']}
              style={styles.bannerGradient}
            />

            {/* Conteúdo */}
            <View style={styles.bannerContent}>
              {/* Badge */}
              <View style={[styles.bannerBadge, { borderColor: item.accent }]}>
                <Text style={[styles.bannerBadgeText, { color: item.accent }]}>{item.badge}</Text>
              </View>

              {/* Título */}
              <Text style={styles.bannerTitle}>{item.game}</Text>

              {/* Multiplicador */}
              <Text style={styles.bannerSubtitle}>
                Multiplicador até{' '}
                <Text style={[styles.bannerMultiplier, { color: colors.secondary }]}>{item.multiplier}</Text>
              </Text>

              {/* Botões */}
              <View style={styles.bannerButtons}>
                <Pressable style={styles.bannerBtnPlay}>
                  <Text style={styles.bannerBtnPlayText}>▶  Jogar</Text>
                </Pressable>
                <Pressable style={styles.bannerBtnInfo}>
                  <Text style={styles.bannerBtnInfoText}>+ Info</Text>
                </Pressable>
              </View>
            </View>
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

/** Barra de stories estilo Instagram */
function StoriesBar() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.storiesContainer}
    >
      {STORIES.map((story) => (
        <Pressable key={story.id} style={styles.storyItem}>
          {/* Anel externo: verde se ativo, cinza se inativo */}
          <View
            style={[
              styles.storyRingOuter,
              story.active
                ? styles.storyRingActive
                : styles.storyRingInactive,
            ]}
          >
            {/* Espaço entre anel e círculo interno */}
            <View style={styles.storyRingGap}>
              <View style={styles.storyCircle}>
                <Text style={styles.storyEmoji}>{story.emoji}</Text>
              </View>
            </View>
          </View>
          <Text
            style={[
              styles.storyLabel,
              story.active ? styles.storyLabelActive : styles.storyLabelInactive,
            ]}
            numberOfLines={1}
          >
            {story.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
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
        <LiveMatchCard onBetPress={handleGamePress} />
      </ScrollView>
    </View>
  );
}

/* ───────────────────── Estilos ───────────────────── */

const styles = StyleSheet.create({
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

});
