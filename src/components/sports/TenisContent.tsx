import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BetSlipData } from '../../types/sports';

const ACCENT = '#C8F063';
const CARD_BG = '#00281A';
const SURFACE = '#003A25';

const TOURNAMENTS = ['Roland Garros', 'Wimbledon', 'US Open', 'Australian Open', 'ATP 1000'];

const LIVE_MATCHES = [
  { id: 'l1', home: 'Alcaraz', homeFlag: '🇪🇸', away: 'Sinner', awayFlag: '🇮🇹', homeSet: '6-4, 3', awaySet: '6-4, 2', tournament: 'Roland Garros', round: 'Semifinal', homeOdd: 1.65, awayOdd: 2.25 },
  { id: 'l2', home: 'Swiatek',  homeFlag: '🇵🇱', away: 'Gauff',  awayFlag: '🇺🇸', homeSet: '7-5, 4', awaySet: '7-5, 3', tournament: 'Roland Garros', round: 'Semifinal WTA', homeOdd: 1.40, awayOdd: 3.00 },
];

const UPCOMING = [
  { id: 'u1', home: 'Djokovic',   homeFlag: '🇷🇸', away: 'Zverev',   awayFlag: '🇩🇪', tournament: 'Roland Garros', time: 'Hoje 14:00', odd: 1.85 },
  { id: 'u2', home: 'Medvedev',   homeFlag: '🇷🇺', away: 'Rune',     awayFlag: '🇩🇰', tournament: 'ATP 1000',      time: 'Hoje 16:30', odd: 1.55 },
  { id: 'u3', home: 'Sabalenka',  homeFlag: '🇧🇾', away: 'Pegula',   awayFlag: '🇺🇸', tournament: 'WTA Tour',      time: 'Amanhã 13:00', odd: 1.70 },
  { id: 'u4', home: 'Tsitsipas',  homeFlag: '🇬🇷', away: 'Ruud',     awayFlag: '🇳🇴', tournament: 'Roland Garros', time: 'Amanhã 15:00', odd: 2.10 },
];

interface Props { onBetPress: (d: BetSlipData) => void; }

export default function TenisContent({ onBetPress }: Props) {
  const [activeTournament, setActiveTournament] = useState('Roland Garros');

  return (
    <>
      {/* Tournament selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tourRow}>
        {TOURNAMENTS.map(t => (
          <Pressable key={t} style={[styles.tourChip, activeTournament === t && styles.tourChipActive]}
            onPress={() => setActiveTournament(t)}>
            <Text style={[styles.tourText, activeTournament === t && styles.tourTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* AO VIVO */}
      <View style={styles.sectionRow}>
        <View style={styles.accentBar} />
        <Text style={styles.sectionTitle}>Ao Vivo</Text>
        <View style={styles.livePill}><View style={styles.liveDot} /><Text style={styles.liveText}>{LIVE_MATCHES.length} partidas</Text></View>
      </View>

      {LIVE_MATCHES.map(m => (
        <View key={m.id} style={styles.matchCard}>
          <View style={styles.cardHeader}>
            <View style={styles.liveBadge}><View style={styles.liveDot2} /><Text style={styles.liveBadgeText}>AO VIVO</Text></View>
            <Text style={styles.roundText}>{m.tournament} • {m.round}</Text>
          </View>
          <View style={styles.tennisRows}>
            <Pressable style={styles.playerRow}
              onPress={() => onBetPress({ matchLabel: `${m.home} vs ${m.away}`, oddLabel: m.home, oddValue: m.homeOdd, league: m.tournament })}>
              <Text style={styles.playerFlag}>{m.homeFlag}</Text>
              <Text style={styles.playerName}>{m.home}</Text>
              <Text style={styles.setsText}>{m.homeSet}*</Text>
              <View style={[styles.tennisOdd, { borderColor: ACCENT + '66' }]}>
                <Text style={[styles.tennisOddVal]}>{m.homeOdd.toFixed(2)}</Text>
              </View>
            </Pressable>
            <View style={styles.tennisDiv} />
            <Pressable style={styles.playerRow}
              onPress={() => onBetPress({ matchLabel: `${m.home} vs ${m.away}`, oddLabel: m.away, oddValue: m.awayOdd, league: m.tournament })}>
              <Text style={styles.playerFlag}>{m.awayFlag}</Text>
              <Text style={styles.playerName}>{m.away}</Text>
              <Text style={styles.setsText}>{m.awaySet}</Text>
              <View style={[styles.tennisOdd, { borderColor: ACCENT + '66' }]}>
                <Text style={styles.tennisOddVal}>{m.awayOdd.toFixed(2)}</Text>
              </View>
            </Pressable>
          </View>
        </View>
      ))}

      {/* Próximas partidas */}
      <View style={styles.sectionRow}>
        <View style={styles.accentBar} />
        <Text style={styles.sectionTitle}>Próximas Partidas</Text>
      </View>

      {UPCOMING.map(m => (
        <Pressable key={m.id} style={styles.upcomingCard}
          onPress={() => onBetPress({ matchLabel: `${m.home} vs ${m.away}`, oddLabel: m.home, oddValue: m.odd, league: m.tournament })}>
          <Text style={styles.playerFlag}>{m.homeFlag}</Text>
          <View style={styles.upcomingInfo}>
            <Text style={styles.upcomingMatch}>{m.home} vs {m.away} {m.awayFlag}</Text>
            <Text style={styles.upcomingMeta}>{m.tournament}  •  {m.time}</Text>
          </View>
          <View style={styles.upcomingOdd}>
            <Text style={styles.upcomingOddLabel}>Odds</Text>
            <Text style={styles.upcomingOddVal}>{m.odd.toFixed(2)}</Text>
          </View>
        </Pressable>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  tourRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  tourChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: CARD_BG, borderWidth: 1, borderColor: `${ACCENT}22` },
  tourChipActive: { backgroundColor: ACCENT },
  tourText: { color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: 12 },
  tourTextActive: { color: '#001812', fontWeight: '800' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 16, marginBottom: 10, gap: 10 },
  accentBar: { width: 4, height: 18, borderRadius: 2, backgroundColor: ACCENT },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '800', flex: 1 },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(230,57,70,0.15)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E63946' },
  liveText: { color: '#E63946', fontSize: 10, fontWeight: '700' },
  matchCard: { marginHorizontal: 16, backgroundColor: CARD_BG, borderRadius: 14, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: `${ACCENT}22` },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot2: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E63946' },
  liveBadgeText: { color: '#E63946', fontSize: 11, fontWeight: '700' },
  roundText: { color: ACCENT, fontSize: 11, fontWeight: '600' },
  tennisRows: { padding: 4 },
  playerRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  playerFlag: { fontSize: 20 },
  playerName: { color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 },
  setsText: { color: ACCENT, fontSize: 14, fontWeight: '800', marginRight: 8 },
  tennisOdd: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  tennisOddVal: { color: '#fff', fontSize: 15, fontWeight: '800' },
  tennisDiv: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginHorizontal: 12 },
  upcomingCard: { marginHorizontal: 16, backgroundColor: CARD_BG, borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  upcomingInfo: { flex: 1 },
  upcomingMatch: { color: '#fff', fontSize: 13, fontWeight: '700' },
  upcomingMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 },
  upcomingOdd: { backgroundColor: `${ACCENT}22`, borderRadius: 8, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: `${ACCENT}44` },
  upcomingOddLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9 },
  upcomingOddVal: { color: ACCENT, fontSize: 16, fontWeight: '800' },
});
