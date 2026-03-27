import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BetSlipData } from '../../types/sports';

const ACCENT = '#FF6B2B';
const BG = '#180800';
const CARD_BG = '#2A1200';
const SURFACE = '#3D1C00';

const LEAGUES = ['NBA', 'NBB', 'EuroLeague', 'FIBA'];

const LIVE_MATCHES = [
  { id: 'l1', home: 'Lakers', homeEmoji: '💛', away: 'Celtics', awayEmoji: '🍀', homeScore: 98, awayScore: 102, league: 'NBA', time: 'Q3 8:42', homeOdd: 2.10, awayOdd: 1.75 },
  { id: 'l2', home: 'Flamengo BB', homeEmoji: '🔴', away: 'Franca', awayEmoji: '🔵', homeScore: 76, awayScore: 81, league: 'NBB', time: 'Q4 3:15', homeOdd: 1.85, awayOdd: 2.05 },
];

const UPCOMING = [
  { id: 'u1', home: 'Warriors', homeEmoji: '💛', away: 'Heat',        awayEmoji: '🔴', league: 'NBA',        time: 'Hoje 21:30',    odd: 2.40 },
  { id: 'u2', home: 'Thunder',  homeEmoji: '⚡', away: 'Nuggets',     awayEmoji: '🟡', league: 'NBA',        time: 'Hoje 23:00',    odd: 1.95 },
  { id: 'u3', home: 'R. Madrid BB', homeEmoji: '⚪', away: 'Barcelona BB', awayEmoji: '🔵', league: 'EuroLeague', time: 'Amanhã 16:00', odd: 2.10 },
  { id: 'u4', home: 'Sesi Franca', homeEmoji: '🟣', away: 'Corinthians BB', awayEmoji: '🖤', league: 'NBB', time: 'Amanhã 19:00',  odd: 1.80 },
];

interface Props { onBetPress: (d: BetSlipData) => void; }

export default function BasqueteContent({ onBetPress }: Props) {
  const [activeLeague, setActiveLeague] = useState('NBA');

  const filteredUpcoming = activeLeague === 'NBA'
    ? UPCOMING.filter(m => m.league === 'NBA')
    : UPCOMING;

  return (
    <>
      {/* League selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.leagueRow}>
        {LEAGUES.map(lg => (
          <Pressable key={lg} style={[styles.leagueChip, activeLeague === lg && styles.leagueChipActive]}
            onPress={() => setActiveLeague(lg)}>
            <Text style={[styles.leagueText, activeLeague === lg && styles.leagueTextActive]}>{lg}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Ao Vivo */}
      <View style={styles.sectionRow}>
        <View style={styles.accentBar} />
        <Text style={styles.sectionTitle}>Ao Vivo</Text>
        <View style={styles.livePill}><View style={styles.liveDot} /><Text style={styles.liveText}>{LIVE_MATCHES.length} jogos</Text></View>
      </View>

      {LIVE_MATCHES.map(m => (
        <View key={m.id} style={styles.matchCard}>
          <View style={styles.matchHeader}>
            <View style={styles.liveBadge}><View style={styles.liveDot2} /><Text style={styles.liveBadgeText}>AO VIVO • {m.time}</Text></View>
            <Text style={styles.leagueLabel}>{m.league}</Text>
          </View>
          <View style={styles.matchBody}>
            <View style={styles.teamCol}><Text style={styles.teamEmoji}>{m.homeEmoji}</Text><Text style={styles.teamName}>{m.home}</Text></View>
            <View style={styles.scoreBox}>
              <Text style={styles.score}>{m.homeScore}</Text>
              <Text style={styles.scoreSep}>–</Text>
              <Text style={styles.score}>{m.awayScore}</Text>
            </View>
            <View style={styles.teamCol}><Text style={styles.teamEmoji}>{m.awayEmoji}</Text><Text style={styles.teamName}>{m.away}</Text></View>
          </View>
          <View style={styles.oddsRow}>
            <Pressable style={styles.oddBox}
              onPress={() => onBetPress({ matchLabel: `${m.home} vs ${m.away}`, oddLabel: m.home, oddValue: m.homeOdd, league: m.league })}>
              <Text style={styles.oddTeam}>{m.homeEmoji} {m.home}</Text>
              <Text style={styles.oddValue}>{m.homeOdd.toFixed(2)}</Text>
            </Pressable>
            <Pressable style={styles.oddBox}
              onPress={() => onBetPress({ matchLabel: `${m.home} vs ${m.away}`, oddLabel: m.away, oddValue: m.awayOdd, league: m.league })}>
              <Text style={styles.oddTeam}>{m.awayEmoji} {m.away}</Text>
              <Text style={styles.oddValue}>{m.awayOdd.toFixed(2)}</Text>
            </Pressable>
          </View>
        </View>
      ))}

      {/* Próximos jogos */}
      <View style={styles.sectionRow}>
        <View style={styles.accentBar} />
        <Text style={styles.sectionTitle}>Próximos Jogos</Text>
      </View>

      {filteredUpcoming.map(m => (
        <Pressable key={m.id} style={styles.upcomingCard}
          onPress={() => onBetPress({ matchLabel: `${m.home} vs ${m.away}`, oddLabel: m.home, oddValue: m.odd, league: m.league })}>
          <Text style={styles.upcomingEmoji}>{m.homeEmoji}</Text>
          <View style={styles.upcomingInfo}>
            <Text style={styles.upcomingMatch}>{m.home} vs {m.away}</Text>
            <Text style={styles.upcomingMeta}>{m.league}  •  {m.time}</Text>
          </View>
          <Text style={styles.upcomingEmoji}>{m.awayEmoji}</Text>
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
  leagueRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  leagueChip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: CARD_BG, borderWidth: 1, borderColor: 'rgba(255,107,43,0.2)' },
  leagueChipActive: { backgroundColor: ACCENT },
  leagueText: { color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: 13 },
  leagueTextActive: { color: '#fff', fontWeight: '800' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 16, marginBottom: 10, gap: 10 },
  accentBar: { width: 4, height: 18, borderRadius: 2, backgroundColor: ACCENT },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '800', flex: 1 },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(230,57,70,0.15)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E63946' },
  liveText: { color: '#E63946', fontSize: 10, fontWeight: '700' },
  matchCard: { marginHorizontal: 16, backgroundColor: CARD_BG, borderRadius: 14, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: `${ACCENT}33` },
  matchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot2: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E63946' },
  liveBadgeText: { color: '#E63946', fontSize: 11, fontWeight: '700' },
  leagueLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  matchBody: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  teamCol: { alignItems: 'center', gap: 6, flex: 1 },
  teamEmoji: { fontSize: 32 },
  teamName: { color: '#fff', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  scoreBox: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  score: { color: '#fff', fontSize: 32, fontWeight: '900' },
  scoreSep: { color: 'rgba(255,255,255,0.4)', fontSize: 20 },
  oddsRow: { flexDirection: 'row', backgroundColor: SURFACE, padding: 10, gap: 8 },
  oddBox: { flex: 1, backgroundColor: `${ACCENT}22`, borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: `${ACCENT}44` },
  oddTeam: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 4 },
  oddValue: { color: ACCENT, fontSize: 18, fontWeight: '900' },
  upcomingCard: { marginHorizontal: 16, backgroundColor: CARD_BG, borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  upcomingEmoji: { fontSize: 22 },
  upcomingInfo: { flex: 1 },
  upcomingMatch: { color: '#fff', fontSize: 13, fontWeight: '700' },
  upcomingMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 },
  upcomingOdd: { backgroundColor: `${ACCENT}22`, borderRadius: 8, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: `${ACCENT}44` },
  upcomingOddLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: '600' },
  upcomingOddVal: { color: ACCENT, fontSize: 16, fontWeight: '800' },
});
