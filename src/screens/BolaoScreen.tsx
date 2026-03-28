import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { GradientBackground } from '../components/GradientBackground';
import { useAuth } from '../context/AuthContext';
import Svg, { Circle, Line, Path } from 'react-native-svg';

const { width: SCREEN_W } = Dimensions.get('window');

// --- Icons Auxiliares ---
function SearchIcon({ size = 20, color = '#FFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
      <Line x1="16.5" y1="16.5" x2="22" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

const TABS = ['Meus palpites', 'Prêmios', 'Ranking', 'Minhas salas'] as const;
type TabType = typeof TABS[number];

export default function BolaoScreen() {
  const insets = useSafeAreaInsets();
  const { openMenu, openDepositModal, balance, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('Meus palpites');

  const balanceLabel = isAuthenticated && balance != null
    ? `R$ ${Number(balance).toFixed(2).replace('.', ',')}`
    : 'R$ 0,00';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Meus palpites':
        return <MeusPalpitesContent />;
      case 'Prêmios':
        return <PremiosContent />;
      case 'Ranking':
        return <RankingContent />;
      case 'Minhas salas':
        return <MinhasSalasContent />;
      default:
        return null;
    }
  };

  return (
    <GradientBackground style={styles.container}>
      {/* Fixed header Wrapper */}
      <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, backgroundColor: colors.primary }} />
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Image source={require('../../assets/logo.png')} style={{ width: 72, height: 24, resizeMode: 'contain', marginLeft: -8 }} />
            <Text style={{ color: colors.white, fontSize: 18, fontWeight: 'bold' }}>Bolão</Text>
            <View style={{ flex: 1 }} />
            <View style={styles.headerActions}>
              <View style={{ zIndex: 1, marginRight: 2 }}>
                <Pressable style={styles.searchIconBtn}>
                  <SearchIcon size={24} />
                </Pressable>
              </View>
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
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* White container resembling the prototype */}
        <View style={styles.contentCard}>
          {/* Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {renderTabContent()}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>
    </GradientBackground>
  );
}

// --- Content Components ---

function MeusPalpitesContent() {
  return (
    <View style={styles.tabSection}>
      <Text style={styles.timerText}>Faltam 3 dias para acabar</Text>
      
      {/* Score squares */}
      <View style={styles.scoreSquaresContainer}>
        <View style={styles.scoreSquare} />
        <Text style={styles.colon}>:</Text>
        <View style={styles.scoreSquare} />
        <View style={{ width: 16 }} />
        <View style={styles.scoreSquare} />
        <View style={styles.scoreSquare} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '62.5%' }]} />
        </View>
        <Text style={styles.progressText}>5/8</Text>
      </View>

      {/* Jogos da rodada */}
      <View style={styles.jogosHeader}>
        <View style={styles.verticalBar} />
        <Text style={styles.jogosTitle}>Jogos da rodada</Text>
      </View>

      {/* Jogo Card */}
      <View style={styles.jogoCard}>
        <View style={styles.jogoCardTop}>
          <View>
            <Text style={styles.grupoText}>Grupo B</Text>
            <Text style={styles.dataText}>26/03 • 19:30</Text>
          </View>
          <View style={styles.teamsCircleRow}>
            <View style={styles.teamCircle} />
            <Text style={{ marginHorizontal: 8, color: '#999', fontWeight: 'bold' }}>X</Text>
            <View style={styles.teamCircle} />
          </View>
          <View style={styles.abertoBadge}>
            <Text style={styles.abertoText}>ABERTO</Text>
          </View>
        </View>

        <View style={styles.oddsRow}>
          <View style={[styles.oddBox, styles.oddBoxDark]}>
            <Text style={styles.oddValue}>60%</Text>
            <Text style={styles.oddLabel}>Bragantino</Text>
          </View>
          <View style={[styles.oddBox, styles.oddBoxLight]}>
            <Text style={styles.oddValueLight}>10%</Text>
            <Text style={styles.oddLabelLight}>Empate</Text>
          </View>
          <View style={[styles.oddBox, styles.oddBoxDark]}>
            <Text style={styles.oddValue}>30%</Text>
            <Text style={styles.oddLabel}>Botafogo</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function PremiosContent() {
  return (
    <View style={styles.tabSection}>
      <Text style={styles.timerText}>Faltam 3 dias para acabar</Text>
      
      {/* Score squares */}
      <View style={styles.scoreSquaresContainer}>
        <View style={styles.scoreSquare} />
        <Text style={styles.colon}>:</Text>
        <View style={styles.scoreSquare} />
        <View style={{ width: 16 }} />
        <View style={styles.scoreSquare} />
        <View style={styles.scoreSquare} />
      </View>

      <View style={styles.premiosList}>
        <PremioRow acertos="8/8" title="Prêmio Máximo" value="RS 500,00" players="3 jogadores" />
        <PremioRow acertos="X/8" title="Prêmio Prata" value="RS X" players="X jogadores" />
        <PremioRow acertos="X/8" title="Prêmio Bronze" value="RS X" players="X jogadores" />
        <PremioRow acertos="3/8" title="Participação" value="X Rodadas Grátis" players="X jogadores" />

        <View style={styles.premioTotalBox}>
          <Text style={styles.premioTotalTitle}>Prêmio Acumulado</Text>
          <Text style={styles.premioTotalValue}>R$ 500,00</Text>
          <Text style={styles.premioTotalSubtitle}>X Participantes nessa rodada</Text>
        </View>
      </View>
    </View>
  );
}

function PremioRow({ acertos, title, value, players }: { acertos: string; title: string; value: string; players: string }) {
  return (
    <View style={styles.premioRow}>
      <View style={styles.acertosBadge}>
        <Text style={styles.acertosTitle}>{acertos}</Text>
        <Text style={styles.acertosSub}>Acertos</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.premioTitle}>{title}</Text>
        <Text style={styles.premioValue}>{value}</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <View style={styles.playerSquare} />
        <Text style={styles.playersText}>{players}</Text>
      </View>
    </View>
  );
}

function RankingContent() {
  return (
    <View style={styles.tabSection}>
      <Text style={styles.timerText}>Faltam 3 dias para acabar</Text>
      
      <View style={styles.scoreSquaresContainer}>
        <View style={styles.scoreSquare} />
        <Text style={styles.colon}>:</Text>
        <View style={styles.scoreSquare} />
        <View style={{ width: 16 }} />
        <View style={styles.scoreSquare} />
        <View style={styles.scoreSquare} />
      </View>

      <View style={styles.jogosHeader}>
        <View style={styles.verticalBar} />
        <Text style={styles.jogosTitle}>Sua posição</Text>
      </View>

      <View style={styles.rankingRow}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankNum}>10</Text>
          <Text style={styles.rankSub}>Lugar</Text>
        </View>
        <View style={styles.rankInfo}>
          <Text style={styles.rankName}>Você</Text>
          <Text style={styles.rankStats}>5/8 palpites</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.rankPointsNum}>30</Text>
          <Text style={styles.rankPointsLabel}>Pontos</Text>
        </View>
      </View>

      <View style={styles.jogosHeader}>
        <View style={styles.verticalBar} />
        <Text style={styles.jogosTitle}>Top Jogadores</Text>
      </View>

      <RankingItem place="1" name="@joaosilva" />
      <RankingItem place="2" name="@mariaclara" />
      <RankingItem place="3" name="@pedro" />
    </View>
  );
}

function RankingItem({ place, name }: { place: string; name: string }) {
  return (
    <View style={styles.rankingRow}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankNum}>{place}</Text>
        <Text style={styles.rankSub}>Lugar</Text>
      </View>
      <View style={styles.avatarCircle} />
      <View style={styles.rankInfo}>
        <Text style={styles.rankName}>{name}</Text>
        <Text style={styles.rankStats}>5/8 acertos • Rodada perfeita</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.rankPointsNum}>30</Text>
        <Text style={styles.rankPointsLabel}>Pontos</Text>
      </View>
    </View>
  );
}

function MinhasSalasContent() {
  return (
    <View style={styles.tabSection}>
      <Text style={styles.timerText}>Faltam 3 dias para acabar</Text>

      <View style={styles.salaHighlightBox}>
        <Text style={styles.salaHighlightTitle}>Crie sua sala privada</Text>
        <Text style={styles.salaHighlightSub}>Monte um bolão com família ou amigos. Acompanhe os palpites em tempo real e veja quem domina o grupo!</Text>
      </View>

      <Text style={styles.inputLabel}>Nome da sala:</Text>
      <TextInput style={styles.inputBox} placeholder="Ex: Família Silva, Pelada da firma" placeholderTextColor="#999" />

      <Text style={styles.inputLabel}>Seu nome:</Text>
      <TextInput style={styles.inputBox} placeholder="Como vai aparecer para os outros?" placeholderTextColor="#999" />

      <Pressable style={styles.actionBtn}>
        <Text style={styles.actionBtnText}>Criar Sala e Gerar Link</Text>
      </Pressable>

      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>ou entre em uma sala já existente</Text>
        <View style={styles.orLine} />
      </View>

      <View style={styles.enterRoomRow}>
        <TextInput style={[styles.inputBox, { flex: 1, marginBottom: 0 }]} placeholder="Cole o código da sala aqui!" placeholderTextColor="#999" />
        <Pressable style={styles.enterBtn}>
          <Text style={styles.enterBtnText}>Entrar</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 24, gap: 12 }}>
        <View style={styles.featurePill}><Text style={styles.featurePillText}>Ranking exclusivo do grupo</Text></View>
        <View style={styles.featurePill}><Text style={styles.featurePillText}>Compare palpites em tempo real</Text></View>
        <View style={styles.featurePill}><Text style={styles.featurePillText}>Desafios e badges exclusivos</Text></View>
        <View style={styles.featurePill}><Text style={styles.featurePillText}>Link e QR Code de convite</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020B24',
  },
  headerWrapper: {
    zIndex: 20,
    backgroundColor: colors.white, // In prototype it looks like the header top is part of blue
  },
  headerContainer: {
    backgroundColor: '#003399', // A deeper blue as seen in prototype
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchIconBtn: { padding: 6 },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 50,
    paddingVertical: 5,
    paddingRight: 12,
    paddingLeft: 5,
    gap: 6,
  },
  depositCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  menuBtn: {
    gap: 4,
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 2,
  },
  menuBar: {
    width: 22,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  scrollContent: {
    backgroundColor: '#EBEBEB',
    flexGrow: 1,
  },
  contentCard: {
    backgroundColor: '#FFF',
    paddingHorizontal: 0,
    paddingTop: 16,
    paddingBottom: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  tabBtn: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#666',
  },
  tabText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#FFF',
  },
  tabSection: {
    paddingHorizontal: 16,
  },
  timerText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 12,
  },
  scoreSquaresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  colon: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: '#333',
  },
  scoreSquare: {
    width: 40,
    height: 40,
    backgroundColor: '#777',
    borderRadius: 4,
    marginRight: 4,
  },
  progressContainer: {
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#CCC',
    borderRadius: 4,
    marginRight: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#555',
    borderRadius: 4,
  },
  progressText: {
    fontWeight: 'bold',
    color: '#333',
  },
  jogosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  verticalBar: {
    width: 4,
    height: 16,
    backgroundColor: '#000',
    marginRight: 8,
  },
  jogosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  jogoCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  jogoCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  grupoText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  dataText: {
    fontSize: 10,
    color: '#999',
  },
  teamsCircleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#666',
  },
  abertoBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  abertoText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  oddsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  oddBox: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
  },
  oddBoxDark: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  oddBoxLight: {
    backgroundColor: '#E5E7EB',
    borderColor: '#CCC',
  },
  oddValue: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  oddLabel: {
    color: '#FFF',
    fontSize: 10,
  },
  oddValueLight: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  oddLabelLight: {
    color: '#666',
    fontSize: 10,
  },
  premiosList: {
    marginTop: 8,
  },
  premioRow: {
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  acertosBadge: {
    backgroundColor: '#888',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
  },
  acertosTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  acertosSub: { color: '#FFF', fontSize: 10 },
  premioTitle: { color: '#333', fontSize: 14, fontWeight: '500' },
  premioValue: { color: '#000', fontSize: 14, fontWeight: 'bold' },
  playerSquare: {
    width: 24, height: 24, backgroundColor: '#999', borderRadius: 4, marginBottom: 4,
  },
  playersText: { color: '#666', fontSize: 10 },
  premioTotalBox: {
    backgroundColor: '#777',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  premioTotalTitle: { color: '#FFF', fontSize: 12 },
  premioTotalValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginVertical: 4 },
  premioTotalSubtitle: { color: '#FFF', fontSize: 12 },
  rankingRow: {
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  rankBadge: {
    backgroundColor: '#888',
    padding: 6,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  rankNum: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  rankSub: { color: '#FFF', fontSize: 10 },
  avatarCircle: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#000', marginHorizontal: 12,
  },
  rankInfo: { flex: 1, paddingLeft: 12 },
  rankName: { color: '#333', fontWeight: 'bold', fontSize: 14 },
  rankStats: { color: '#666', fontSize: 12, marginTop: 2 },
  rankPointsNum: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  rankPointsLabel: { color: '#666', fontSize: 10 },
  salaHighlightBox: {
    backgroundColor: '#E5E5E5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  salaHighlightTitle: {
    fontWeight: 'bold', fontSize: 16, color: '#000', marginBottom: 8,
  },
  salaHighlightSub: {
    color: '#666', fontSize: 12, textAlign: 'center', lineHeight: 18,
  },
  inputLabel: {
    color: '#333', fontSize: 14, marginBottom: 8,
  },
  inputBox: {
    backgroundColor: '#E5E5E5',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  actionBtn: {
    backgroundColor: '#666',
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  actionBtnText: {
    color: '#FFF', fontWeight: 'bold', fontSize: 14,
  },
  orRow: {
    flexDirection: 'row', alignItems: 'center', marginVertical: 24,
  },
  orLine: {
    flex: 1, height: 1, backgroundColor: '#CCC',
  },
  orText: {
    marginHorizontal: 12, color: '#666', fontSize: 12,
  },
  enterRoomRow: {
    flexDirection: 'row', gap: 12,
  },
  enterBtn: {
    backgroundColor: '#777',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  enterBtnText: {
    color: '#FFF', fontWeight: 'bold', fontSize: 14,
  },
  featurePill: {
    backgroundColor: '#E5E5E5',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  featurePillText: {
    color: '#555', fontSize: 12, fontWeight: 'bold',
  },
});
