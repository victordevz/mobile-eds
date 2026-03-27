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
import Svg, { Circle, Ellipse, Line, Path, Polygon, Rect, G } from 'react-native-svg';
import { colors } from '../theme';
import Logotipo from '../../assets/logotipo.svg';
import { useAuth } from '../context/AuthContext';

const { width: SCREEN_W } = Dimensions.get('window');
const BANNER_W = SCREEN_W - 32;

/* ─────────────── Dados mock ─────────────── */

const BANNERS = [
  {
    id: 'b1',
    title: 'Poker ao Vivo',
    subtitle: 'Jackpot de até R$ 500.000',
    accent: '#38E67D',
    badge: '🃏 POKER',
    image: require('../../assets/casino_banner_poker.png'),
  },
  {
    id: 'b2',
    title: 'Roleta Europeia',
    subtitle: 'Odds de até 35x',
    accent: '#FF6B35',
    badge: '🎰 ROLETA',
    image: require('../../assets/casino_banner_roulette.png'),
  },
  {
    id: 'b3',
    title: 'Slots Premium',
    subtitle: 'Multiplicadores até 5000x',
    accent: '#FFD700',
    badge: '🎰 SLOTS',
    image: require('../../assets/casino_banner_slots.png'),
  },
];

interface GameCategory {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

const GAME_CATEGORIES: GameCategory[] = [
  { id: 'gc1', label: 'Roleta', emoji: '🎡', color: '#E63946' },
  { id: 'gc2', label: 'Blackjack', emoji: '🃏', color: '#2A9D8F' },
  { id: 'gc3', label: 'Dados', emoji: '🎲', color: '#E9C46A' },
  { id: 'gc4', label: 'Baccarat', emoji: '💎', color: '#9B5DE5' },
  { id: 'gc5', label: 'Poker', emoji: '♠️', color: '#38E67D' },
  { id: 'gc6', label: 'Crash', emoji: '🚀', color: '#F77F00' },
  { id: 'gc7', label: 'Mines', emoji: '💣', color: '#4CC9F0' },
  { id: 'gc8', label: 'Plinko', emoji: '⚪', color: '#FF6B6B' },
];

interface CasinoGame {
  id: string;
  name: string;
  provider: string;
  rtp: string;
  hot?: boolean;
  new?: boolean;
  category: string[];
  players: number;
}

const TOP10_GAMES: CasinoGame[] = [
  { id: 't1',  name: 'Gates of Olympus',    provider: 'Pragmatic',   rtp: '96.5%', hot: true,  category: ['Slots', 'Popular'], players: 12400 },
  { id: 't2',  name: 'Sweet Bonanza',        provider: 'Pragmatic',   rtp: '96.4%', hot: true,  category: ['Slots', 'Popular'], players: 9800  },
  { id: 't3',  name: 'Lightning Roulette',   provider: 'Evolution',   rtp: '97.3%', hot: true,  category: ['Roletas Ao Vivo'],  players: 8700  },
  { id: 't4',  name: 'Crazy Time',           provider: 'Evolution',   rtp: '96.0%', hot: true,  category: ['Game Shows'],       players: 8100  },
  { id: 't5',  name: 'Aviator',              provider: 'Spribe',      rtp: '97.0%', hot: true,  category: ['Crash'],            players: 7500  },
  { id: 't6',  name: 'Monopoly Live',        provider: 'Evolution',   rtp: '96.2%',             category: ['Game Shows'],       players: 6200  },
  { id: 't7',  name: 'Speed Baccarat',       provider: 'Evolution',   rtp: '98.9%',             category: ['Jogos de Cartas'],  players: 5900  },
  { id: 't8',  name: 'Mega Ball',            provider: 'Evolution',   rtp: '95.4%',             category: ['Game Shows'],       players: 5400  },
  { id: 't9',  name: 'Infinite Blackjack',   provider: 'Evolution',   rtp: '99.5%',             category: ['Jogos de Cartas'],  players: 4900  },
  { id: 't10', name: 'Dragon Tiger',         provider: 'Evolution',   rtp: '96.7%', new: true,  category: ['Jogos de Cartas'],  players: 4200  },
];

type CategoryTab = 'Game Shows' | 'Roletas Ao Vivo' | 'Jogos de Cartas' | 'Crash' | 'Slots' | 'Popular';

const CATEGORY_TABS: CategoryTab[] = [
  'Popular',
  'Game Shows',
  'Roletas Ao Vivo',
  'Jogos de Cartas',
  'Crash',
  'Slots',
];

const ALL_GAMES: CasinoGame[] = [
  ...TOP10_GAMES,
  { id: 'g1',  name: 'Immersive Roulette',  provider: 'Evolution',  rtp: '97.3%', category: ['Roletas Ao Vivo', 'Popular'], players: 3800 },
  { id: 'g2',  name: 'Auto Roulette',       provider: 'Evolution',  rtp: '97.3%', category: ['Roletas Ao Vivo'],           players: 2900 },
  { id: 'g3',  name: 'Deal or No Deal',     provider: 'Evolution',  rtp: '95.4%', category: ['Game Shows'],                players: 2300 },
  { id: 'g4',  name: 'Book of Dead',        provider: 'Play\'n GO', rtp: '96.2%', new: true, category: ['Slots'],          players: 2100 },
  { id: 'g5',  name: 'Mines',               provider: 'Spribe',     rtp: '97.0%', category: ['Crash'],                    players: 1900 },
  { id: 'g6',  name: 'JetX',               provider: 'SmartSoft',  rtp: '97.0%', category: ['Crash'],                    players: 1700 },
  { id: 'g7',  name: 'VIP Blackjack',       provider: 'Evolution',  rtp: '99.5%', category: ['Jogos de Cartas'],          players: 1600 },
  { id: 'g8',  name: 'Three Card Poker',    provider: 'Evolution',  rtp: '97.6%', category: ['Jogos de Cartas'],          players: 1400 },
];

/* ─────────────── SVG Ícones ─────────────── */

function SearchIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke="#FFF" strokeWidth="2" />
      <Line x1="16.5" y1="16.5" x2="22" y2="22" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function PlayIcon() {
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="23" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <Path d="M19 15l16 9-16 9V15z" fill="white" />
    </Svg>
  );
}

/* ─────────────── Header ─────────────── */

function Header() {
  const { openMenu, openDepositModal, balance, isAuthenticated } = useAuth();
  const balanceLabel =
    isAuthenticated && balance !== null
      ? `R$ ${balance.toFixed(2).replace('.', ',')}`
      : 'R$ 0,00';

  return (
    <View style={styles.header}>
      <Logotipo width={80} height={28} />
      <View style={styles.headerActions}>
        <Pressable style={styles.searchBtn}>
          <SearchIcon />
        </Pressable>
        <Pressable style={styles.balancePill} onPress={openDepositModal}>
          <View style={styles.depositCircle}>
            <View style={styles.plusH} />
            <View style={styles.plusV} />
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

/* ─────────────── Banner Slider ─────────────── */

function BannerSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (BANNER_W + 12));
    setActiveIndex(idx);
  }, []);

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
            <LinearGradient
              colors={['transparent', 'rgba(1,24,79,0.92)']}
              style={styles.bannerGrad}
            />
            <View style={styles.bannerContent}>
              <View style={[styles.bannerBadge, { borderColor: item.accent }]}>
                <Text style={[styles.bannerBadgeText, { color: item.accent }]}>{item.badge}</Text>
              </View>
              <Text style={styles.bannerTitle}>{item.title}</Text>
              <Text style={styles.bannerSub}>{item.subtitle}</Text>
              <Pressable style={[styles.bannerBtn, { backgroundColor: item.accent }]}>
                <Text style={styles.bannerBtnText}>Jogar agora</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
      {/* Dots */}
      <View style={styles.dots}>
        {BANNERS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>
    </View>
  );
}

/* ─────────────── Game Category Icons ─────────────── */

function CategoriesRow({ onPress }: { onPress: (label: string) => void }) {
  const [active, setActive] = useState('gc1');

  return (
    <View style={styles.section}>
      <SectionHeader title="Jogos de Cassino" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catRow}
      >
        {GAME_CATEGORIES.map((cat) => {
          const isActive = active === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={styles.catItem}
              onPress={() => {
                setActive(cat.id);
                onPress(cat.label);
              }}
            >
              <View
                style={[
                  styles.catCircle,
                  { backgroundColor: isActive ? cat.color : colors.card },
                  isActive && { shadowColor: cat.color, shadowOpacity: 0.6, shadowRadius: 8, elevation: 6 },
                ]}
              >
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
              </View>
              <Text style={[styles.catLabel, isActive && { color: colors.white, fontWeight: '700' }]}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

/* ─────────────── Live Dealer ─────────────── */

function LiveDealerSection({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Ao Vivo" badge="AO VIVO" />
      <Pressable style={styles.liveCard} onPress={onPress}>
        <Image source={require('../../assets/casino_live_dealer.png')} style={styles.liveImage} />
        <LinearGradient
          colors={['rgba(1,24,79,0.15)', 'rgba(1,24,79,0.70)']}
          style={StyleSheet.absoluteFill}
        />
        {/* AO VIVO badge */}
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveBadgeText}>AO VIVO</Text>
        </View>
        {/* Play button */}
        <View style={styles.livePlayArea}>
          <PlayIcon />
        </View>
        {/* Bottom info */}
        <View style={styles.liveBottom}>
          <Text style={styles.liveTitle}>Dealer ao Vivo — Mesa Principal</Text>
          <Text style={styles.liveSub}>18 jogadores online agora</Text>
        </View>
      </Pressable>
    </View>
  );
}

/* ─────────────── Top 10 ─────────────── */

function Top10Section({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Top 10" subtitle="Mais jogados agora" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.top10Row}
      >
        {TOP10_GAMES.map((game, index) => (
          <Pressable key={game.id} style={styles.top10Card} onPress={onPress}>
            {/* Rank badge */}
            <View style={[styles.rankBadge, index < 3 && styles.rankBadgeGold]}>
              <Text style={[styles.rankText, index < 3 && styles.rankTextGold]}>
                {index + 1}
              </Text>
            </View>
            {/* Game thumb placeholder */}
            <View style={styles.top10Thumb}>
              <Text style={styles.top10Emoji}>
                {index === 0 ? '⚡' : index === 1 ? '🍬' : index === 2 ? '⚡' : index === 3 ? '🎪' : index === 4 ? '✈️' : '🎰'}
              </Text>
            </View>
            <Text style={styles.top10Name} numberOfLines={2}>{game.name}</Text>
            <Text style={styles.top10Provider} numberOfLines={1}>{game.provider}</Text>
            <View style={styles.top10Footer}>
              <Text style={styles.top10Rtp}>RTP {game.rtp}</Text>
              {(game.hot || game.new) && (
                <View style={[styles.top10Badge, game.new ? styles.top10BadgeNew : styles.top10BadgeHot]}>
                  <Text style={styles.top10BadgeText}>{game.new ? 'NOVO' : 'HOT'}</Text>
                </View>
              )}
            </View>
            {/* Players */}
            <View style={styles.top10Players}>
              <View style={styles.top10PlayerDot} />
              <Text style={styles.top10PlayersText}>{(game.players / 1000).toFixed(1)}K jogando</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

/* ─────────────── Games by Category ─────────────── */

function GamesByCategory({ onPress }: { onPress: () => void }) {
  const [activeTab, setActiveTab] = useState<CategoryTab>('Popular');

  const filteredGames = ALL_GAMES.filter((g) => g.category.includes(activeTab));

  return (
    <View style={styles.section}>
      <SectionHeader title="Jogos" />

      {/* Tab strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabStrip}
      >
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              style={[styles.tabPill, isActive && styles.tabPillActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabPillText, isActive && styles.tabPillTextActive]}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Games grid */}
      <View style={styles.gamesGrid}>
        {filteredGames.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum jogo nessa categoria</Text>
          </View>
        ) : (
          filteredGames.map((game) => (
            <Pressable key={game.id} style={styles.gameCard} onPress={onPress}>
              <View style={styles.gameThumb}>
                <Text style={styles.gameThumbEmoji}>🎰</Text>
                {(game.hot || game.new) && (
                  <View style={[styles.gameCardBadge, game.new ? styles.gameCardBadgeNew : styles.gameCardBadgeHot]}>
                    <Text style={styles.gameCardBadgeText}>{game.new ? 'NOVO' : '🔥'}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.gameName} numberOfLines={1}>{game.name}</Text>
              <Text style={styles.gameProvider} numberOfLines={1}>{game.provider}</Text>
              <View style={styles.gameRtpRow}>
                <Text style={styles.gameRtp}>RTP {game.rtp}</Text>
                <View style={styles.gameOnline}>
                  <View style={styles.gameOnlineDot} />
                  <Text style={styles.gameOnlineText}>{(game.players / 1000).toFixed(1)}K</Text>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </View>
    </View>
  );
}

/* ─────────────── Section Header ─────────────── */

function SectionHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionBarAccent} />
      <View style={{ flex: 1 }}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {badge && (
            <View style={styles.liveBadgeSmall}>
              <View style={styles.liveDotSmall} />
              <Text style={styles.liveBadgeSmallText}>{badge}</Text>
            </View>
          )}
        </View>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

/* ─────────────── Main Screen ─────────────── */

export default function RoletaScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, openAuthModal } = useAuth();

  function handleGamePress() {
    if (!isAuthenticated) openAuthModal('login');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 88 + (insets.bottom || 10) + 24 }}
      >
        <Header />
        <BannerSlider />
        <CategoriesRow onPress={(_label) => handleGamePress()} />
        <LiveDealerSection onPress={handleGamePress} />
        <Top10Section onPress={handleGamePress} />
        <GamesByCategory onPress={handleGamePress} />
      </ScrollView>
    </View>
  );
}

/* ─────────────── Styles ─────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
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
  searchBtn: { padding: 6 },
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
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.secondary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.secondary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7, shadowRadius: 8, elevation: 6,
  },
  plusH: { position: 'absolute', width: 16, height: 2.5, borderRadius: 2, backgroundColor: colors.primaryDark },
  plusV: { position: 'absolute', width: 2.5, height: 16, borderRadius: 2, backgroundColor: colors.primaryDark },
  balanceValue: { color: colors.secondary, fontSize: 15, fontWeight: '800' },
  menuBtn: { gap: 5, justifyContent: 'center', alignItems: 'flex-end', padding: 4 },
  menuBar: { width: 22, height: 2.5, borderRadius: 2, backgroundColor: colors.white },

  /* ── Banner ── */
  bannerSection: { marginTop: 12 },
  bannerList: { paddingHorizontal: 16, gap: 12 },
  bannerCard: {
    width: BANNER_W,
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bannerImage: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    width: '100%', height: '100%', resizeMode: 'cover',
  },
  bannerGrad: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: '80%',
  },
  bannerContent: { paddingHorizontal: 18, paddingBottom: 18, gap: 6 },
  bannerBadge: {
    alignSelf: 'flex-start', borderWidth: 1, borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bannerBadgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  bannerTitle: { color: colors.white, fontSize: 24, fontWeight: '900', lineHeight: 28 },
  bannerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  bannerBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 10, marginTop: 4,
  },
  bannerBtnText: { color: colors.primaryDark, fontWeight: '800', fontSize: 13 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 6 },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 20, backgroundColor: colors.secondary },
  dotInactive: { width: 6, backgroundColor: colors.grey },

  /* ── Section ── */
  section: { marginTop: 28, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  sectionBarAccent: { width: 4, height: 20, borderRadius: 2, backgroundColor: colors.secondary, marginTop: 2 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: colors.white, fontSize: 18, fontWeight: '800' },
  sectionSubtitle: { color: colors.grey, fontSize: 12, marginTop: 2 },

  /* ── Live badge small ── */
  liveBadgeSmall: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(230,57,70,0.15)',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: '#E63946',
  },
  liveDotSmall: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E63946' },
  liveBadgeSmallText: { color: '#E63946', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  /* ── Game Categories ── */
  catRow: { gap: 4, paddingVertical: 4 },
  catItem: { alignItems: 'center', marginRight: 18, width: 64 },
  catCircle: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  catEmoji: { fontSize: 24 },
  catLabel: { color: colors.grey, fontSize: 11, fontWeight: '600', textAlign: 'center' },

  /* ── Live Dealer ── */
  liveCard: {
    width: '100%', height: 200,
    borderRadius: 18, overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  liveImage: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    width: '100%', height: '100%', resizeMode: 'cover',
  },
  liveBadge: {
    position: 'absolute', top: 14, left: 14,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(230,57,70,0.90)',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff' },
  liveBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  livePlayArea: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  liveBottom: { padding: 16, paddingTop: 8 },
  liveTitle: { color: colors.white, fontSize: 15, fontWeight: '700' },
  liveSub: { color: colors.secondary, fontSize: 12, marginTop: 2 },

  /* ── Top 10 ── */
  top10Row: { gap: 12, paddingVertical: 4 },
  top10Card: {
    width: 140,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  rankBadge: {
    position: 'absolute', top: -8, left: -6,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)',
    zIndex: 2,
  },
  rankBadgeGold: { backgroundColor: '#FFD700', borderColor: '#FFA500' },
  rankText: { color: colors.grey, fontSize: 11, fontWeight: '800' },
  rankTextGold: { color: '#01184F' },
  top10Thumb: {
    width: '100%', height: 90,
    backgroundColor: colors.cardLight,
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  top10Emoji: { fontSize: 36 },
  top10Name: { color: colors.white, fontSize: 13, fontWeight: '700', marginBottom: 2 },
  top10Provider: { color: colors.grey, fontSize: 11, marginBottom: 6 },
  top10Footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  top10Rtp: { color: colors.secondary, fontSize: 11, fontWeight: '600' },
  top10Badge: { borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  top10BadgeHot: { backgroundColor: 'rgba(255,107,53,0.2)', borderWidth: 1, borderColor: '#FF6B35' },
  top10BadgeNew: { backgroundColor: 'rgba(56,230,125,0.15)', borderWidth: 1, borderColor: colors.secondary },
  top10BadgeText: { fontSize: 9, fontWeight: '800', color: colors.white },
  top10Players: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  top10PlayerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#38E67D' },
  top10PlayersText: { color: colors.grey, fontSize: 10 },

  /* ── Category Tab Strip ── */
  tabStrip: { gap: 8, paddingVertical: 4, marginBottom: 16 },
  tabPill: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  tabPillActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  tabPillText: { color: colors.grey, fontSize: 13, fontWeight: '600' },
  tabPillTextActive: { color: colors.primaryDark, fontWeight: '800' },

  /* ── Games Grid ── */
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gameCard: {
    width: (SCREEN_W - 32 - 12 - 32) / 3,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  gameThumb: {
    width: '100%', aspectRatio: 1,
    backgroundColor: colors.cardLight,
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  gameThumbEmoji: { fontSize: 28 },
  gameCardBadge: {
    position: 'absolute', top: 4, right: 4,
    borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2,
  },
  gameCardBadgeHot: { backgroundColor: 'rgba(255,107,53,0.9)' },
  gameCardBadgeNew: { backgroundColor: 'rgba(56,230,125,0.9)' },
  gameCardBadgeText: { color: colors.primaryDark, fontSize: 8, fontWeight: '900' },
  gameName: { color: colors.white, fontSize: 11, fontWeight: '700', marginBottom: 2 },
  gameProvider: { color: colors.grey, fontSize: 10, marginBottom: 4 },
  gameRtpRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gameRtp: { color: colors.secondary, fontSize: 9, fontWeight: '600' },
  gameOnline: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  gameOnlineDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#38E67D' },
  gameOnlineText: { color: colors.grey, fontSize: 9 },
  emptyState: { flex: 1, alignItems: 'center', paddingVertical: 32 },
  emptyText: { color: colors.grey, fontSize: 14 },
});
