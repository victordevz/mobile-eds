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
import OddsTurbinadas from '../components/OddsTurbinadas';

/* ───────────────────── Constantes ───────────────────── */

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = 120;
const CARD_H = 150;
const CARD_GAP = 12;
const BANNER_W = SCREEN_W - 32;
const BANNER_H = 160;

/* ───────────────────── Dados mock ───────────────────── */

interface Game {
  id: string;
  title: string;
  provider: string;
  accent: string;
  emoji: string;
}

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

const POPULAR_GAMES: Game[] = [
  { id: 'p1', title: 'Fortune Tiger', provider: 'PG Soft', accent: '#FF6B35', emoji: '🐯' },
  { id: 'p2', title: 'Fortune Ox', provider: 'PG Soft', accent: '#D62828', emoji: '🐂' },
  { id: 'p3', title: 'Fortune Mouse', provider: 'PG Soft', accent: '#E8A317', emoji: '🐭' },
  { id: 'p4', title: 'Fortune Rabbit', provider: 'PG Soft', accent: '#FF85A1', emoji: '🐇' },
  { id: 'p5', title: 'Gates of Olympus', provider: 'Pragmatic', accent: '#3A86FF', emoji: '⚡' },
  { id: 'p6', title: 'Sweet Bonanza', provider: 'Pragmatic', accent: '#FB5607', emoji: '🍬' },
  { id: 'p7', title: 'Big Bass Splash', provider: 'Pragmatic', accent: '#118AB2', emoji: '🐟' },
  { id: 'p8', title: 'Dog House', provider: 'Pragmatic', accent: '#6A4C93', emoji: '🐶' },
];

const NEW_GAMES: Game[] = [
  { id: 'n1', title: 'Starlight Princess', provider: 'Pragmatic', accent: '#9B5DE5', emoji: '✨' },
  { id: 'n2', title: 'Sugar Rush', provider: 'Pragmatic', accent: '#FF006E', emoji: '🍭' },
  { id: 'n3', title: 'Zeus vs Hades', provider: 'Pragmatic', accent: '#023E8A', emoji: '🔱' },
  { id: 'n4', title: 'Wisdom of Athena', provider: 'Pragmatic', accent: '#FFB703', emoji: '🦉' },
  { id: 'n5', title: 'Wild West Gold', provider: 'Pragmatic', accent: '#B5651D', emoji: '🤠' },
  { id: 'n6', title: 'Gems Bonanza', provider: 'Pragmatic', accent: '#06D6A0', emoji: '💎' },
  { id: 'n7', title: 'Might of Ra', provider: 'Pragmatic', accent: '#DDA15E', emoji: '☀️' },
  { id: 'n8', title: 'Chilli Heat', provider: 'Pragmatic', accent: '#E63946', emoji: '🌶️' },
];

const CRASH_GAMES: Game[] = [
  { id: 'cr1', title: 'Aviator', provider: 'Spribe', accent: '#E63946', emoji: '✈️' },
  { id: 'cr2', title: 'Spaceman', provider: 'Pragmatic', accent: '#7209B7', emoji: '🧑‍🚀' },
  { id: 'cr3', title: 'Mines', provider: 'Spribe', accent: '#2EC4B6', emoji: '💣' },
  { id: 'cr4', title: 'Plinko', provider: 'Spribe', accent: '#FF9F1C', emoji: '🔴' },
  { id: 'cr5', title: 'Goal', provider: 'Spribe', accent: '#38B000', emoji: '⚽' },
  { id: 'cr6', title: 'Dice', provider: 'EvoPlay', accent: '#3F37C9', emoji: '🎲' },
  { id: 'cr7', title: 'Hi-Lo', provider: 'EvoPlay', accent: '#F72585', emoji: '🃏' },
  { id: 'cr8', title: 'Keno', provider: 'Spribe', accent: '#4361EE', emoji: '🎯' },
];

const PROVIDERS = [
  'PG Soft',
  'Pragmatic Play',
  'Spribe',
  'Evolution',
  'EvoPlay',
  'Hacksaw',
  "Play'n GO",
  'NetEnt',
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

/* ───────────────────── Componentes auxiliares ──────────── */

/** Cabeçalho com saudação e saldo */
function Header() {
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

        {/* Pill unificada: botão + e saldo */}
        <Pressable style={styles.balancePill}>
          <View style={styles.depositCircle}>
            <View style={styles.plusHorizontal} />
            <View style={styles.plusVertical} />
          </View>
          <Text style={styles.balanceValue}>R$ 1.300,50</Text>
        </Pressable>

        {/* Sanduiche */}
        <Pressable style={styles.menuBtn}>
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

/** Card de jogo individual */
function GameCard({ game }: { game: Game }) {
  return (
    <Pressable style={styles.gameCard}>
      <View style={[styles.gameThumb, { backgroundColor: game.accent }]}>
        <Text style={styles.gameEmoji}>{game.emoji}</Text>
        <LinearGradient
          colors={['transparent', 'rgba(5,60,30,0.45)', 'rgba(5,50,25,0.82)']}
          locations={[0, 0.55, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gameTitleOverlay}
        >
          <Text style={styles.gameTitle} numberOfLines={1}>
            {game.title}
          </Text>
        </LinearGradient>
      </View>
    </Pressable>
  );
}

/** Seção com título + lista horizontal de jogos */
function GameSection({
  title,
  games,
}: {
  title: string;
  games: Game[];
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable>
          <Text style={styles.sectionLink}>Ver tudo →</Text>
        </Pressable>
      </View>

      <FlatList
        data={games}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gameList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GameCard game={item} />}
      />
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

/** Seção de provedores */
function ProvidersSection() {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { paddingHorizontal: 16 }]}>
        Provedores
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.providersRow}
      >
        {PROVIDERS.map((p) => (
          <View key={p} style={styles.providerChip}>
            <Text style={styles.providerText}>{p}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ───────────────────── Tela principal ───────────────────── */

export default function FutebolScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Header />
        <StoriesBar />
        <PromoBanner />
        <OddsTurbinadas />
        <GameSection title="🔥  Populares" games={POPULAR_GAMES} />
        <GameSection title="⭐  Novos Jogos" games={NEW_GAMES} />
        <GameSection title="🚀  Crash Games" games={CRASH_GAMES} />
        <ProvidersSection />
        <View style={{ height: 24 }} />
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
    paddingBottom: 16,
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

  /* ── Section ── */
  section: {
    marginTop: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionLink: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
  },

  /* ── Game list ── */
  gameList: {
    paddingHorizontal: 16,
    gap: CARD_GAP,
  },

  /* ── Game card ── */
  gameCard: {
    width: CARD_W,
  },
  gameThumb: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gameEmoji: {
    fontSize: 44,
  },
  gameTitleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    paddingBottom: 7,
    paddingHorizontal: 6,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  gameTitle: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
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

  /* ── Providers ── */
  providersRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  providerChip: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceMid,
  },
  providerText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});
