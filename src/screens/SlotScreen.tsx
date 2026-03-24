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
import { useAuth } from '../context/AuthContext';

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

const CATEGORIES = [
  { id: 'c1', label: 'Todos' },
  { id: 'c2', label: 'Slots' },
  { id: 'c3', label: 'Crash' },
  { id: 'c4', label: 'Roleta' },
  { id: 'c5', label: 'Blackjack' },
];

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

/* ───────────────────── Componentes auxiliares ──────────── */

/** Cabeçalho com saudação e saldo */
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

/** Abas secundárias (Cassino, Slots, Ao Vivo, Jackpot) */
function SubTopBar() {
  const tabs = ['Cassino', 'Slots', 'Ao Vivo', 'Jackpot'];
  return (
    <View style={styles.subTopBar}>
      {tabs.map((tab, i) => {
        const isActive = i === 0;
        return (
          <View key={tab} style={styles.subTabWrapper}>
            <Text style={[styles.subTab, isActive && styles.subTabActive]}>{tab}</Text>
            {isActive && <View style={styles.subTabIndicator} />}
          </View>
        );
      })}
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
              <View style={[styles.bannerBadge, { borderColor: '#D4AF37' }]}>
                <Text style={[styles.bannerBadgeText, { color: '#D4AF37' }]}>{item.badge}</Text>
              </View>

              {/* Título */}
              <Text style={styles.bannerTitle}>{item.game.replace(' ', '\n')}</Text>

              {/* Multiplicador */}
              <Text style={styles.bannerSubtitle}>
                Multiplicador até{' '}
                <Text style={styles.bannerMultiplier}>{item.multiplier}</Text>
              </Text>

              {/* Botões */}
              <View style={styles.bannerButtons}>
                <Pressable style={styles.bannerBtnPlay}>
                  <Text style={styles.bannerBtnPlayText}>▶ Jogar</Text>
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

/** Pills de categorias */
function CategoryPills() {
  const [active, setActive] = useState('c1');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.pillsContainer}
    >
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.id;
        return (
          <Pressable
            key={cat.id}
            onPress={() => setActive(cat.id)}
            style={[
              styles.pill,
              isActive ? styles.pillActive : styles.pillInactive,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                isActive ? styles.pillTextActive : styles.pillTextInactive,
              ]}
            >
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/** Card de jogo individual */
function GameCard({ game, showBadge, onPress }: { game: Game; showBadge?: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.gameCard} onPress={onPress}>
      <View style={[styles.gameThumb, { backgroundColor: game.accent }]}>
        {showBadge && (
          <View style={[styles.cardBadge, showBadge === 'NOVO' && styles.cardBadgeNew]}>
            <Text style={styles.cardBadgeText}>{showBadge}</Text>
          </View>
        )}
        <Text style={styles.gameEmoji}>{game.emoji}</Text>
      </View>
    </Pressable>
  );
}

/** Seção com título + lista horizontal de jogos */
function GameSection({
  title,
  games,
  onGamePress,
}: {
  title: string;
  games: Game[];
  onGamePress?: () => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionTitleBar} />
          <Text style={styles.sectionTitle}>{title}</Text>
          {title.includes('Mais Jogados') && (
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>AO VIVO</Text>
            </View>
          )}
        </View>
        <Pressable>
          <Text style={styles.sectionLink}>Ver todos ›</Text>
        </Pressable>
      </View>

      <FlatList
        data={games}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gameList}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <GameCard game={item} showBadge={index === 0 ? 'HOT' : index === 2 ? 'NOVO' : undefined} onPress={onGamePress} />}
      />
    </View>
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

export default function SlotScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, openAuthModal } = useAuth();

  function handleGamePress() {
    if (!isAuthenticated) openAuthModal('login');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Header />
        <PromoBanner />
        <CategoryPills />
        <GameSection title="Mais Jogados" games={POPULAR_GAMES} onGamePress={handleGamePress} />
        <GameSection title="Novidades" games={NEW_GAMES} onGamePress={handleGamePress} />
        <GameSection title="Crash Games" games={CRASH_GAMES} onGamePress={handleGamePress} />
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
    paddingBottom: 120,
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

  /* ── SubTopBar ── */
  subTopBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  subTabWrapper: {
    paddingBottom: 8,
    alignItems: 'center',
  },
  subTab: {
    color: colors.grey,
    fontSize: 13,
    fontWeight: '600',
  },
  subTabActive: {
    color: colors.white,
    fontWeight: '700',
  },
  subTabIndicator: {
    position: 'absolute',
    bottom: -1,
    width: '100%',
    height: 3,
    backgroundColor: colors.secondary,
    borderRadius: 2,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  bannerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.2,
    lineHeight: 32,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '400',
  },
  bannerMultiplier: {
    color: colors.secondary,
    fontWeight: '800',
    fontSize: 14,
  },
  bannerButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  bannerBtnPlay: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bannerBtnPlayText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },
  bannerBtnInfo: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
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
  sectionTitleBar: {
    width: 3,
    height: 16,
    backgroundColor: '#D4AF37', // Dourado
    borderRadius: 2,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sectionBadgeText: {
    color: '#D4AF37',
    fontSize: 9,
    fontWeight: '800',
  },
  sectionLink: {
    color: colors.grey,
    fontSize: 12,
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
    gap: 6,
  },
  gameThumb: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#E63946',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 2,
  },
  cardBadgeNew: {
    backgroundColor: '#FFB703',
  },
  cardBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
  gameEmoji: {
    fontSize: 50,
  },
  gameTitleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    paddingBottom: 8,
    paddingHorizontal: 8,
    justifyContent: 'flex-end',
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPercentRow: {
    backgroundColor: 'rgba(56, 230, 125, 0.2)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(56, 230, 125, 0.4)',
  },
  cardPercentText: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: '700',
  },
  cardPlayersRow: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardPlayersText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  cardTitleBelow: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  cardProviderBelow: {
    color: colors.grey,
    fontSize: 11,
    fontWeight: '500',
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
