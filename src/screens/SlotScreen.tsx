import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useCatalog } from '../hooks/useCatalog';
import { CatalogItem } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SlotStackParamList } from '../navigation/stacks/SlotStack';
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
  LayoutAnimation,
  UIManager,
  Platform,
  Animated,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line } from 'react-native-svg';
import { colors } from '../theme';
// import Logotipo from '../../assets/logotipo.svg';
import { useAuth } from '../context/AuthContext';

import StoriesBar from '../components/StoriesBar';
import { GradientBackground } from '../components/GradientBackground';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const WIN_COLS = {
  col1: 140,
  col2: 80,
  col3: 50,
  col4: 80,
  col5: 50,
  col6: 100,
};

function generateWin() {
  const games = [
    { name: 'Starlight Princess', icon: require('../../assets/ZU_Thumb-HoodH51vs-Wolf.webp') },
    { name: 'Gates of Olympus', icon: require('../../assets/gates_of_olympus_1000_game_thumbnail-v2.avif') },
    { name: 'Sweet Bonanza', icon: require('../../assets/sweet_bonanza_thumbnail_game.webp') },
    { name: 'Sugar Rush', icon: require('../../assets/gb_sweet-land_420x560_1803.avif') },
    { name: 'Big Bass Bonanza', icon: require('../../assets/big_bass_bonanza_3_reeler_thumbnail_game_logo-v2.webp') },
  ];
  const users = ['Anônimo', 'joao***', 'maria***', 'carlos***', 'lucas***', 'ana***', 'victor***'];
  const gameInfo = games[Math.floor(Math.random() * games.length)];
  const user = users[Math.floor(Math.random() * users.length)];
  const betVal = (Math.random() * 50 + 1).toFixed(2);
  const multVal = Math.floor(Math.random() * 50) + 2;
  const winVal = (parseFloat(betVal) * multVal).toFixed(2);

  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return {
    id: Math.random().toString(36).substring(7),
    game: gameInfo.name,
    icon: gameInfo.icon,
    user,
    time,
    bet: `R$ ${betVal.replace('.', ',')}`,
    mult: `${multVal}x`,
    win: `R$ ${winVal.replace('.', ',')}`,
  };
}

/* ───────────────────── Constantes ───────────────────── */

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = 120;
const CARD_H = 150;
const CARD_GAP = 12;
const BANNER_W = SCREEN_W - 32;
const BANNER_H = 160;

const LOCAL_GAME_THUMBS: Record<string, ReturnType<typeof require>> = {
  'Gates of Olympus': require('../../assets/gates_of_olympus_1000_game_thumbnail-v2.avif'),
  'Sweet Bonanza': require('../../assets/sweet_bonanza_thumbnail_game.webp'),
  'Sugar Rush': require('../../assets/gb_sweet-land_420x560_1803.avif'),
  'Big Bass Bonanza': require('../../assets/big_bass_bonanza_3_reeler_thumbnail_game_logo-v2.webp'),
  'Starlight Princess': require('../../assets/ZU_Thumb-HoodH51vs-Wolf.webp'),
};

/* ───────────────────── Constantes estáticas ───────────────────── */

const CATEGORIES = [
  { id: 'all', label: 'Todos', apiCategory: undefined as 'slots' | 'crash' | 'roulette' | 'blackjack' | undefined },
  { id: 'slots', label: 'Slots', apiCategory: 'slots' as const },
  { id: 'crash', label: 'Crash', apiCategory: 'crash' as const },
  { id: 'roulette', label: 'Roleta', apiCategory: 'roulette' as const },
  { id: 'blackjack', label: 'Blackjack', apiCategory: 'blackjack' as const },
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

/* ───────────────────── Componentes auxiliares ──────────── */

function SearchIcon({ size = 20, color = '#FFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
      <Line x1="16.5" y1="16.5" x2="22" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

/** Cabeçalho com saudação e saldo */
function Header() {
  const { openMenu, openDepositModal, balance, isAuthenticated } = useAuth();
  const [isSearchActive, setIsSearchActive] = useState(false);

  const balanceLabel = isAuthenticated && balance !== null
    ? `R$ ${balance.toFixed(2).replace('.', ',')}`
    : 'R$ 0,00';

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        {/* Logo */}
        <Image source={require('../../assets/logo.png')} style={{ width: 72, height: 24, resizeMode: 'contain', marginLeft: -8 }} />

        <View style={styles.headerActions}>
          <View style={{ zIndex: 1, marginRight: 6 }}>
            <Pressable style={[styles.searchIconBtn, isSearchActive && styles.searchIconBtnActive]} onPress={() => setIsSearchActive(!isSearchActive)}>
              <SearchIcon size={24} />
            </Pressable>
            {isSearchActive && (
              <>
                <View style={{ position: 'absolute', bottom: -10, left: 0, right: 0, height: 10, backgroundColor: '#042B7A' }} />
                <View pointerEvents="none" style={{ position: 'absolute', bottom: -10, left: -30, width: 30, height: 30, backgroundColor: '#042B7A' }}>
                  <View style={{ flex: 1, backgroundColor: colors.primary, borderBottomRightRadius: 30 }} />
                </View>
                <View pointerEvents="none" style={{ position: 'absolute', bottom: -10, right: -30, width: 30, height: 30, backgroundColor: '#042B7A' }}>
                  <View style={{ flex: 1, backgroundColor: colors.primary, borderBottomLeftRadius: 30 }} />
                </View>
              </>
            )}
          </View>
          {/* Pill unificada: botão + */}
          <Pressable style={[styles.balancePill, { zIndex: 20 }]} onPress={openDepositModal}>
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
function PromoBanner({
  onPlay,
  games
}: {
  onPlay: (game: any) => void;
  games: any[];
}) {

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % BANNERS.length;
        flatListRef.current?.scrollToOffset({
          offset: next * (BANNER_W + 12),
          animated: true,
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const idx = Math.round(offsetX / (BANNER_W + 12));
      if (idx !== activeIndex && idx >= 0 && idx < BANNERS.length) {
        setActiveIndex(idx);
      }
    },
    [activeIndex],
  );


  return (
    <View style={styles.bannerSection}>
      <FlatList
        ref={flatListRef}
        data={BANNERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_W + 12}
        snapToAlignment="start"
        decelerationRate="fast"
        // nestedScrollEnabled removido para evitar conflitos de gesto desnecessários no iOS/Android (horizontal vs vertical)
        overScrollMode="never"
        scrollEventThrottle={32}

        contentContainerStyle={styles.bannerList}
        onScroll={onScroll}
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
                <Pressable
                  style={styles.bannerBtnPlay}
                  onPress={() => {
                    const game = games.find((g: any) => g.title === item.game);
                    if (game) onPlay(game);
                  }}
                >

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
          <Pressable
            key={b.id}
            onPress={() => {
              flatListRef.current?.scrollToOffset({
                offset: i * (BANNER_W + 12),
                animated: true,
              });
              setActiveIndex(i);
            }}
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
function CategoryPills({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      overScrollMode="never"
      contentContainerStyle={styles.pillsContainer}
    >

      {CATEGORIES.map((cat) => {
        const isActive = active === cat.id;
        return (
          <Pressable
            key={cat.id}
            onPress={() => onChange(cat.id)}
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

function GameCard({ game, showBadge, onPress }: { game: CatalogItem; showBadge?: string; onPress?: (game: CatalogItem) => void }) {
  const bg = game.accent ?? '#1A2235';
  const remoteSource = game.imageUrl ?? game.thumbnail;
  const localThumb = LOCAL_GAME_THUMBS[game.title];
  return (
    <Pressable style={styles.gameCard} onPress={() => onPress?.(game)}>
      <View style={[styles.gameThumb, { backgroundColor: bg }]}>
        {remoteSource ? (
          <Image source={{ uri: remoteSource }} style={styles.gameThumbImage} />
        ) : localThumb ? (
          <Image source={localThumb} style={styles.gameThumbImage} />
        ) : (
          <Text style={styles.gameThumbInitial}>
            {game.title.charAt(0).toUpperCase()}
          </Text>
        )}
        {showBadge && (
          <View style={[styles.cardBadge, showBadge === 'NOVO' && styles.cardBadgeNew]}>
            <Text style={styles.cardBadgeText}>{showBadge}</Text>
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.72)']}
          style={styles.cardTitleGradient}
        >
          <Text style={styles.cardTitleText} numberOfLines={2}>{game.title}</Text>
        </LinearGradient>
      </View>
      <Text style={styles.cardProviderText} numberOfLines={1}>{game.provider}</Text>
    </Pressable>
  );
}

/** Seção com título + lista horizontal de jogos */
function GameSection({
  title,
  games,
  loading,
  onGamePress,
}: {
  title: string;
  games: CatalogItem[];
  loading?: boolean;
  onGamePress?: (game: CatalogItem) => void;
}) {
  if (!loading && games.length === 0) return null;

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

      {loading ? (
        <View style={styles.gameListSkeleton}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.gameCard, styles.skeletonCard]} />
          ))}
        </View>
      ) : (
        <FlatList
          data={games}
          horizontal
          showsHorizontalScrollIndicator={false}
          overScrollMode="never"
          contentContainerStyle={styles.gameList}
          keyExtractor={(item) => item.id}

          renderItem={({ item, index }) => (
            <GameCard
              game={item}
              showBadge={item.badge ?? (index === 0 ? 'HOT' : undefined)}
              onPress={() => onGamePress?.(item)}
            />
          )}
        />
      )}
    </View>
  );
}

/** Seção de provedores */
function ProvidersSection({
  providers,
  active,
  onChange,
}: {
  providers: string[];
  active: string | null;
  onChange: (p: string | null) => void;
}) {
  if (providers.length === 0) return null;
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
        {providers.map((p) => {
          const isActive = active === p;
          return (
            <Pressable
              key={p}
              onPress={() => onChange(isActive ? null : p)}
              style={[
                styles.providerChip,
                isActive && styles.providerChipActive,
              ]}
            >
              <Text style={[styles.providerText, isActive && styles.providerTextActive]}>
                {p}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

/** Card individual de ganho para a esteira */
function RecentWinTickerItem({ item }: { item: any }) {
  return (
    <View style={styles.tickerCard}>
      <Image source={item.icon} style={styles.tickerIcon} />
      <View style={styles.tickerInfo}>
        <Text style={styles.tickerUser} numberOfLines={1}>{item.user}</Text>
        <Text style={styles.tickerGame} numberOfLines={1}>{item.game}</Text>
      </View>
      <View style={styles.tickerValues}>
        <Text style={styles.tickerWin}>{item.win}</Text>
        <Text style={styles.tickerMult}>{item.mult}</Text>
      </View>
    </View>
  );
}

/** Esteira de Últimos Ganhos (Ticker) com Autoscroll */
function RecentWins() {
  const [wins] = useState(() => Array.from({ length: 15 }).map(() => generateWin()));
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    // Animação de piscar "AO VIVO"
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (contentWidth > 0) {
      // Reinicia a animação sempre que o loop deve acontecer
      // Para um ticker infinito suave, animamos o translateX
      const duration = contentWidth * 25; // Ajuste a velocidade aqui (ms por pixel)
      
      scrollAnim.setValue(0);
      Animated.loop(
        Animated.timing(scrollAnim, {
          toValue: -contentWidth / 2, // Anda metade do conteúdo (que é duplicado)
          duration: duration / 2,
          useNativeDriver: true,
          easing: (t) => t, // Linear
        })
      ).start();
    }
  }, [contentWidth]);

  // Duplicamos a lista para criar o efeito de loop infinito suave
  const displayWins = [...wins, ...wins];

  return (
    <View style={styles.tickerSection}>
      <View style={styles.tickerHeader}>
        <View style={styles.tickerTitleRow}>
          <Text style={styles.tickerStar}>★</Text>
          <Text style={styles.tickerTitle}>Ganhos em Tempo Real</Text>
        </View>
      </View>

      <View style={{ overflow: 'hidden' }}>
        <Animated.View
          style={[
            styles.tickerScrollContent,
            {
              flexDirection: 'row',
              transform: [{ translateX: scrollAnim }],
            },
          ]}
          onLayout={(e) => setContentWidth(e.nativeEvent.layout.width)}
        >
          {displayWins.map((item, index) => (
            <RecentWinTickerItem key={`${item.id}-${index}`} item={item} />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

/* ───────────────────── Tela principal ───────────────────── */

export default function SlotScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<SlotStackParamList>>();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const selectedCategory = CATEGORIES.find(c => c.id === activeCategory)?.apiCategory;
  const showCrashSection = activeCategory === 'all';

  const popular = useCatalog({ section: 'popular', category: selectedCategory, provider: activeProvider ?? undefined, limit: 20 });
  const newGames = useCatalog({ section: 'new', category: selectedCategory, provider: activeProvider ?? undefined, limit: 20 });
  const crash = useCatalog(showCrashSection ? { category: 'crash', provider: activeProvider ?? undefined, limit: 20 } : { limit: 0 });

  const allProviders = useCatalog({ category: selectedCategory, limit: 100 });
  const providers = [...new Set(allProviders.data.map(g => g.provider))].filter(p => p === 'Pragmatic Play' || p === 'PG Soft');

  function handleGamePress(game: CatalogItem) {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (game.gameUrl) {
      navigation.navigate('Game', { gameUrl: game.gameUrl, title: game.title });
    }
  }

  function handleCategoryChange(id: string) {
    setActiveCategory(id);
    setActiveProvider(null);
  }

  return (
    <GradientBackground style={[styles.container, { paddingTop: insets.top }]}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, backgroundColor: colors.primary, zIndex: 100 }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 160 + (insets.bottom || 0) }]}
        style={{ flex: 1 }} // Garante que o ScrollView ocupe o espaço e receba toques corretamente
      >
        <Header />
        <View style={{ height: 16 }} />
        <StoriesBar />
        <PromoBanner onPlay={handleGamePress} games={popular.data} />
        <CategoryPills active={activeCategory} onChange={handleCategoryChange} />

        <GameSection
          title="Mais Jogados"
          games={popular.data}
          loading={popular.loading}
          onGamePress={handleGamePress}
        />
        <RecentWins />
        <GameSection
          title="Novidades"
          games={newGames.data}
          loading={newGames.loading}
          onGamePress={handleGamePress}
        />
        {showCrashSection && (
          <GameSection
            title="Crash Games"
            games={crash.data}
            loading={crash.loading}
            onGamePress={handleGamePress}
          />
        )}
        <ProvidersSection providers={providers} active={activeProvider} onChange={setActiveProvider} />
        <View style={{ height: 24 }} />
      </ScrollView>
    </GradientBackground>
  );
}

/* ───────────────────── Estilos ───────────────────── */

const styles = StyleSheet.create({
  /* ── Layout raiz ── */
  container: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 120,
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
  gameThumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gameThumbInitial: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 40,
    fontWeight: '800',
  },
  cardTitleGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 24,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardTitleText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
  cardProviderText: {
    color: colors.grey,
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
    paddingHorizontal: 2,
  },
  gameListSkeleton: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: CARD_GAP,
  },
  skeletonCard: {
    height: CARD_H,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
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
  providerChipActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  providerText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  providerTextActive: {
    color: colors.primaryDark,
  },

  /* ── Recent Wins Ticker ── */
  tickerSection: {
    marginTop: 20,
    marginBottom: 8,
  },
  tickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  tickerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tickerStar: {
    color: '#FFB703',
    fontSize: 14,
  },
  tickerTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  tickerLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(230, 57, 70, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(230, 57, 70, 0.3)',
    gap: 5,
  },
  tickerLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E63946',
  },
  tickerLiveText: {
    color: '#E63946',
    fontSize: 10,
    fontWeight: '900',
  },
  tickerScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tickerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2235',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 12,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tickerIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  tickerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  tickerUser: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  tickerGame: {
    color: colors.grey,
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  tickerValues: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  tickerWin: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '900',
  },
  tickerMult: {
    color: 'rgba(56, 230, 125, 0.8)',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
});
