import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BetSlipData } from '../../types/sports';

const ACCENT = '#FFD700';
const CARD_BG = '#261A00';
const SURFACE = '#352400';
const LEAGUES = ['Superliga M', 'Superliga F', 'Liga das Nações', 'Olímpiadas'];
const LIVE_MATCHES = [
  { id: 'l1', home: 'Sesc/RJ', homeEmoji: '🔵', away: 'Praia Clube', awayEmoji: '🟡', homeSets: 2, awaySets: 1, homePoints: 18, awayPoints: 22, league: 'Superliga F', round: 'Final', homeOdd: 1.80, awayOdd: 2.10 },
  { id: 'l2', home: 'Taubaté', homeEmoji: '🏐', away: 'Cruzeiro VB', awayEmoji: '🔵', homeSets: 1, awaySets: 2, homePoints: 20, awayPoints: 17, league: 'Superliga M', round: 'Semifinal', homeOdd: 2.30, awayOdd: 1.65 },
];
const UPCOMING = [
  { id: 'u1', home: 'Brasil 🇧🇷',  away: 'Itália 🇮🇹',     league: 'Liga das Nações', time: 'Hoje 17:00',   odd: 1.70 },
  { id: 'u2', home: 'Osasco',      away: 'Dentil/Praia', league: 'Superliga F',    time: 'Hoje 20:00',   odd: 2.20 },
  { id: 'u3', home: 'Minas Tênis', away: 'Sada Cruzeiro',league: 'Superliga M',    time: 'Amanhã 18:00', odd: 1.90 },
  { id: 'u4', home: 'Brasil 🇧🇷',  away: 'EUA 🇺🇸',        league: 'Liga das Nações', time: 'Amanhã 21:30', odd: 2.00 },
];
interface Props { onBetPress: (d: BetSlipData) => void; }

export default function VoleiContent({ onBetPress }: Props) {
  const [activeLeague, setActiveLeague] = useState('Superliga F');
  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.leagueRow}>
        {LEAGUES.map(lg => (
          <Pressable key={lg} style={[styles.chip, activeLeague === lg && styles.chipActive]} onPress={() => setActiveLeague(lg)}>
            <Text style={[styles.chipText, activeLeague === lg && styles.chipTextActive]}>{lg}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.sRow}><View style={styles.bar} /><Text style={styles.sTitle}>Ao Vivo</Text><View style={styles.lPill}><View style={styles.lDot} /><Text style={styles.lText}>{LIVE_MATCHES.length} jogos</Text></View></View>
      {LIVE_MATCHES.map(m => (
        <View key={m.id} style={styles.card}>
          <View style={styles.cardTop}><View style={styles.lBadge}><View style={styles.lDot2} /><Text style={styles.lBadgeText}>AO VIVO</Text></View><Text style={styles.roundText}>{m.league} • {m.round}</Text></View>
          <View style={styles.teamRow}><Text style={styles.tEmoji}>{m.homeEmoji}</Text><Text style={styles.tName}>{m.home}</Text><Text style={[styles.sScore, { color: m.homeSets >= m.awaySets ? ACCENT : 'rgba(255,255,255,0.4)' }]}>{m.homeSets}</Text><Text style={styles.pts}>({m.homePoints})</Text></View>
          <View style={styles.div} />
          <View style={styles.teamRow}><Text style={styles.tEmoji}>{m.awayEmoji}</Text><Text style={styles.tName}>{m.away}</Text><Text style={[styles.sScore, { color: m.awaySets > m.homeSets ? ACCENT : 'rgba(255,255,255,0.4)' }]}>{m.awaySets}</Text><Text style={styles.pts}>({m.awayPoints})</Text></View>
          <View style={styles.oddsRow}>
            <Pressable style={styles.oddBox} onPress={() => onBetPress({ matchLabel: `${m.home} vs ${m.away}`, oddLabel: m.home, oddValue: m.homeOdd, league: m.league })}><Text style={styles.oddTeam}>{m.home}</Text><Text style={styles.oddVal}>{m.homeOdd.toFixed(2)}</Text></Pressable>
            <Pressable style={styles.oddBox} onPress={() => onBetPress({ matchLabel: `${m.home} vs ${m.away}`, oddLabel: m.away, oddValue: m.awayOdd, league: m.league })}><Text style={styles.oddTeam}>{m.away}</Text><Text style={styles.oddVal}>{m.awayOdd.toFixed(2)}</Text></Pressable>
          </View>
        </View>
      ))}
      <View style={styles.sRow}><View style={styles.bar} /><Text style={styles.sTitle}>Próximos Jogos</Text></View>
      {UPCOMING.map(m => (
        <Pressable key={m.id} style={styles.upcoming} onPress={() => onBetPress({ matchLabel: `${m.home} vs ${m.away}`, oddLabel: m.home, oddValue: m.odd, league: m.league })}>
          <View style={styles.uInfo}><Text style={styles.uMatch}>{m.home} vs {m.away}</Text><Text style={styles.uMeta}>{m.league}  •  {m.time}</Text></View>
          <View style={styles.uOdd}><Text style={styles.uOddLabel}>Odds</Text><Text style={styles.uOddVal}>{m.odd.toFixed(2)}</Text></View>
        </Pressable>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  leagueRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: CARD_BG, borderWidth: 1, borderColor: `${ACCENT}22` },
  chipActive: { backgroundColor: ACCENT },
  chipText: { color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: 12 },
  chipTextActive: { color: '#181200', fontWeight: '800' },
  sRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 16, marginBottom: 10, gap: 10 },
  bar: { width: 4, height: 18, borderRadius: 2, backgroundColor: ACCENT },
  sTitle: { color: '#fff', fontSize: 17, fontWeight: '800', flex: 1 },
  lPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(230,57,70,0.15)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  lDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E63946' },
  lText: { color: '#E63946', fontSize: 10, fontWeight: '700' },
  card: { marginHorizontal: 16, backgroundColor: CARD_BG, borderRadius: 14, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: `${ACCENT}22` },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  lBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  lDot2: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E63946' },
  lBadgeText: { color: '#E63946', fontSize: 11, fontWeight: '700' },
  roundText: { color: ACCENT, fontSize: 11, fontWeight: '600' },
  teamRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 10 },
  tEmoji: { fontSize: 22 },
  tName: { color: '#fff', fontSize: 14, fontWeight: '700', flex: 1 },
  sScore: { fontSize: 26, fontWeight: '900' },
  pts: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  div: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginHorizontal: 14 },
  oddsRow: { flexDirection: 'row', backgroundColor: SURFACE, padding: 10, gap: 8 },
  oddBox: { flex: 1, backgroundColor: `${ACCENT}22`, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: `${ACCENT}44` },
  oddTeam: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginBottom: 4 },
  oddVal: { color: ACCENT, fontSize: 18, fontWeight: '900' },
  upcoming: { marginHorizontal: 16, backgroundColor: CARD_BG, borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  uInfo: { flex: 1 },
  uMatch: { color: '#fff', fontSize: 13, fontWeight: '700' },
  uMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 },
  uOdd: { backgroundColor: `${ACCENT}22`, borderRadius: 8, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: `${ACCENT}44` },
  uOddLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9 },
  uOddVal: { color: ACCENT, fontSize: 16, fontWeight: '800' },
});
