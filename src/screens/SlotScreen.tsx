import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

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
  { id: 'c1', label: '🔥  Populares' },
  { id: 'c2', label: '⭐  Novos' },
  { id: 'c3', label: '🎰  Slots' },
  { id: 'c4', label: '🚀  Crash' },
  { id: 'c5', label: '🃏  Ao Vivo' },
  { id: 'c6', label: '🎲  Mesa' },
];

const BANNERS = [
  {
    id: 'b1',
    title: 'BÔNUS DE BOAS-VINDAS',
    subtitle: 'Até R$ 500 no primeiro depósito',
    cta: 'DEPOSITAR',
    accent: colors.secondary,
  },
  {
    id: 'b2',
    title: 'GIROS GRÁTIS',
    subtitle: '50 rodadas em Fortune Tiger',
    cta: 'RESGATAR',
    accent: '#FF6B35',
  },
  {
    id: 'b3',
    title: 'CASHBACK SEMANAL',
    subtitle: 'Receba 15% de volta toda segunda',
    cta: 'SAIBA MAIS',
    accent: '#9B5DE5',
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
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerGreeting}>Olá, Jogador 👋</Text>
        <Text style={styles.headerBalance}>R$ 1.250,00</Text>
      </View>
      <View style={styles.headerActions}>
        <Pressable style={styles.depositBtn}>
          <Text style={styles.depositBtnText}>DEPOSITAR</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Barra de busca */
function SearchBar() {
  return (
    <View style={styles.searchWrapper}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar jogos..."
        placeholderTextColor={colors.grey}
        selectionColor={colors.secondary}
      />
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
          <View style={[styles.bannerCard, { borderColor: item.accent }]}>
            <View style={[styles.bannerAccentBar, { backgroundColor: item.accent }]} />
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>{item.title}</Text>
              <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
              <Pressable
                style={[styles.bannerCta, { backgroundColor: item.accent }]}
              >
                <Text style={styles.bannerCtaText}>{item.cta}</Text>
              </Pressable>
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
function GameCard({ game }: { game: Game }) {
  return (
    <Pressable style={styles.gameCard}>
      <View style={[styles.gameThumb, { backgroundColor: game.accent }]}>
        <Text style={styles.gameEmoji}>{game.emoji}</Text>
      </View>
      <Text style={styles.gameTitle} numberOfLines={1}>
        {game.title}
      </Text>
      <Text style={styles.gameProvider} numberOfLines={1}>
        {game.provider}
      </Text>
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Header />
        <SearchBar />
        <PromoBanner />
        <CategoryPills />
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
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerGreeting: {
    color: colors.grey,
    fontSize: 13,
  },
  headerBalance: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  depositBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  depositBtnText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* ── Search ── */
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
    paddingVertical: 0,
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
    height: BANNER_H,
    backgroundColor: colors.card,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
  },
  bannerAccentBar: {
    height: 4,
    width: '100%',
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  bannerSubtitle: {
    color: colors.grey,
    fontSize: 13,
    marginTop: 6,
  },
  bannerCta: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bannerCtaText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
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
  },
  gameEmoji: {
    fontSize: 44,
  },
  gameTitle: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  gameProvider: {
    color: colors.grey,
    fontSize: 11,
    marginTop: 2,
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
