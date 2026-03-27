import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BetSlipData } from '../../types/sports';

const ACCENT = '#E63946';
const CARD_BG = '#240000';
const SURFACE = '#360000';

interface EsportsGame {
  id: string; label: string; emoji: string;
}
const GAMES: EsportsGame[] = [
  { id: 'cs2',      label: 'CS2',             emoji: '🔫' },
  { id: 'lol',      label: 'League of Legends',emoji: '⚔️' },
  { id: 'valorant', label: 'Valorant',          emoji: '🎯' },
  { id: 'dota2',    label: 'Dota 2',            emoji: '🗡️' },
  { id: 'overwatch',label: 'Overwatch',         emoji: '🦾' },
  { id: 'freefire', label: 'Free Fire',         emoji: '🔥' },
];

interface EsportsMatch {
  id: string; gameId: string;
  home: string; homeEmoji: string;
  away: string; awayEmoji: string;
  homeMaps: number; awayMaps: number;
  tournament: string; stage: string;
  isLive: boolean; time: string;
  homeOdd: number; awayOdd: number;
}
const ALL_MATCHES: EsportsMatch[] = [
  { id: 'm1',  gameId: 'cs2',      home: 'NAVI',        homeEmoji: '💛', away: 'Vitality',    awayEmoji: '🐝', homeMaps: 1, awayMaps: 0, tournament: 'BLAST Premier',   stage: 'Grand Final', isLive: true,  time: 'Mapa 2',   homeOdd: 1.90, awayOdd: 1.95 },
  { id: 'm2',  gameId: 'cs2',      home: 'Faze Clan',   homeEmoji: '💀', away: 'G2',          awayEmoji: '🐺', homeMaps: 0, awayMaps: 1, tournament: 'BLAST Premier',   stage: 'Semifinal',   isLive: true,  time: 'Mapa 3',   homeOdd: 2.20, awayOdd: 1.65 },
  { id: 'm3',  gameId: 'lol',      home: 'T1',          homeEmoji: '🐯', away: 'Gen.G',       awayEmoji: '🦅', homeMaps: 2, awayMaps: 1, tournament: 'LCK',             stage: 'Final',       isLive: true,  time: 'Game 4',   homeOdd: 1.55, awayOdd: 2.50 },
  { id: 'm4',  gameId: 'valorant', home: 'Sentinels',   homeEmoji: '🛡️', away: 'NRG',         awayEmoji: '⚡', homeMaps: 1, awayMaps: 1, tournament: 'VCT Champions',   stage: 'Semifinal',   isLive: true,  time: 'Mapa 3',   homeOdd: 2.00, awayOdd: 1.80 },
  { id: 'm5',  gameId: 'dota2',    home: 'Team Spirit', homeEmoji: '👻', away: 'OG',          awayEmoji: '🍀', homeMaps: 0, awayMaps: 0, tournament: 'The International',stage: 'Grupo A',      isLive: false, time: 'Hoje 18:00', homeOdd: 1.75, awayOdd: 2.10 },
  { id: 'm6',  gameId: 'overwatch',home: 'SF Shock',    homeEmoji: '⚡', away: 'Dallas Fuel', awayEmoji: '🔥', homeMaps: 0, awayMaps: 0, tournament: 'OWL',             stage: 'Playoffs',    isLive: false, time: 'Hoje 21:00', homeOdd: 1.60, awayOdd: 2.30 },
  { id: 'm7',  gameId: 'freefire', home: 'Fluxo',       homeEmoji: '🔵', away: 'LOUD',        awayEmoji: '🟡', homeMaps: 0, awayMaps: 0, tournament: 'LBFF',            stage: 'Final',       isLive: false, time: 'Amanhã 15:00', homeOdd: 2.10, awayOdd: 1.75 },
  { id: 'm8',  gameId: 'cs2',      home: 'MOUZ',        homeEmoji: '🐭', away: 'Liquid',      awayEmoji: '💧', homeMaps: 0, awayMaps: 0, tournament: 'ESL Pro League',  stage: 'Grupo',       isLive: false, time: 'Amanhã 12:00', homeOdd: 1.85, awayOdd: 2.00 },
];

interface Props { onBetPress: (d: BetSlipData) => void; }

export default function ESportsContent({ onBetPress }: Props) {
  const [activeGame, setActiveGame] = useState('cs2');
  const filtered = ALL_MATCHES.filter(m => m.gameId === activeGame);
  const liveMatches = filtered.filter(m => m.isLive);
  const upcoming = filtered.filter(m => !m.isLive);

  return (
    <>
      {/* Game selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gamesRow}>
        {GAMES.map(g => (
          <Pressable key={g.id} style={[styles.gameChip, activeGame === g.id && styles.gameChipActive]} onPress={() => setActiveGame(g.id)}>
            <Text style={styles.gameEmoji}>{g.emoji}</Text>
            <Text style={[styles.gameLabel, activeGame === g.id && styles.gameLabelActive]}>{g.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Live */}
      {liveMatches.length > 0 && (
        <>
          <View style={styles.sRow}><View style={styles.bar} /><Text style={styles.sTitle}>Ao Vivo</Text><View style={styles.lPill}><View style={styles.lDot} /><Text style={styles.lText}>{liveMatches.length}</Text></View></View>
          {liveMatches.map(m => (
            <View key={m.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.lBadge}><View style={styles.lDot2} /><Text style={styles.lBadgeText}>AO VIVO • {m.time}</Text></View>
                <Text style={styles.tournText}>{m.tournament} — {m.stage}</Text>
              </View>
              {/* Teams + map score */}
              <View style={styles.teamsRow}>
                <View style={styles.tCol}><Text style={styles.tEmoji}>{m.homeEmoji}</Text><Text style={styles.tName}>{m.home}</Text></View>
                <View style={styles.mapScore}>
                  <Text style={[styles.mapNum, { color: m.homeMaps > m.awayMaps ? ACCENT : '#fff' }]}>{m.homeMaps}</Text>
                  <Text style={styles.mapSep}>:</Text>
                  <Text style={[styles.mapNum, { color: m.awayMaps > m.homeMaps ? ACCENT : '#fff' }]}>{m.awayMaps}</Text>
                </View>
                <View style={styles.tCol}><Text style={styles.tEmoji}>{m.awayEmoji}</Text><Text style={styles.tName}>{m.away}</Text></View>
              </View>
              <View style={styles.oddsRow}>
                <Pressable style={styles.oddBox} onPress={() => onBetPress({ matchLabel: `${m.home} vs ${m.away}`, oddLabel: m.home, oddValue: m.homeOdd, league: m.tournament })}>
                  <Text style={styles.oddTeam}>{m.home}</Text><Text style={styles.oddVal}>{m.homeOdd.toFixed(2)}</Text>
                </Pressable>
                <Pressable style={styles.oddBox} onPress={() => onBetPress({ matchLabel: `${m.home} vs ${m.away}`, oddLabel: m.away, oddValue: m.awayOdd, league: m.tournament })}>
                  <Text style={styles.oddTeam}>{m.away}</Text><Text style={styles.oddVal}>{m.awayOdd.toFixed(2)}</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <>
          <View style={styles.sRow}><View style={styles.bar} /><Text style={styles.sTitle}>Próximas Partidas</Text></View>
          {upcoming.map(m => (
            <Pressable key={m.id} style={styles.upcomingCard} onPress={() => onBetPress({ matchLabel: `${m.home} vs ${m.away}`, oddLabel: m.home, oddValue: m.homeOdd, league: m.tournament })}>
              <Text style={styles.uHomeEmoji}>{m.homeEmoji}</Text>
              <View style={styles.uInfo}>
                <Text style={styles.uMatch}>{m.home} vs {m.away} {m.awayEmoji}</Text>
                <Text style={styles.uMeta}>{m.tournament}  •  {m.time}</Text>
              </View>
              <View style={styles.uOdd}><Text style={styles.uOddLabel}>Odds</Text><Text style={styles.uOddVal}>{m.homeOdd.toFixed(2)}</Text></View>
            </Pressable>
          ))}
        </>
      )}

      {filtered.length === 0 && (
        <View style={styles.empty}><Text style={styles.emptyEmoji}>🎮</Text><Text style={styles.emptyText}>Sem jogos agora{'\n'}Selecione outro jogo</Text></View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  gamesRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  gameChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: CARD_BG, borderWidth: 1, borderColor: `${ACCENT}22` },
  gameChipActive: { backgroundColor: ACCENT },
  gameEmoji: { fontSize: 14 },
  gameLabel: { color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: 12 },
  gameLabelActive: { color: '#fff', fontWeight: '800' },
  sRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 16, marginBottom: 10, gap: 10 },
  bar: { width: 4, height: 18, borderRadius: 2, backgroundColor: ACCENT },
  sTitle: { color: '#fff', fontSize: 17, fontWeight: '800', flex: 1 },
  lPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: `${ACCENT}22`, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  lDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT },
  lText: { color: ACCENT, fontSize: 10, fontWeight: '700' },
  card: { marginHorizontal: 16, backgroundColor: CARD_BG, borderRadius: 14, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: `${ACCENT}33` },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  lBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  lDot2: { width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT },
  lBadgeText: { color: ACCENT, fontSize: 11, fontWeight: '700' },
  tournText: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
  teamsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  tCol: { alignItems: 'center', gap: 6, flex: 1 },
  tEmoji: { fontSize: 28 },
  tName: { color: '#fff', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  mapScore: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mapNum: { fontSize: 32, fontWeight: '900' },
  mapSep: { color: 'rgba(255,255,255,0.3)', fontSize: 20 },
  oddsRow: { flexDirection: 'row', backgroundColor: SURFACE, padding: 10, gap: 8 },
  oddBox: { flex: 1, backgroundColor: `${ACCENT}22`, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: `${ACCENT}44` },
  oddTeam: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginBottom: 4 },
  oddVal: { color: ACCENT, fontSize: 18, fontWeight: '900' },
  upcomingCard: { marginHorizontal: 16, backgroundColor: CARD_BG, borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  uHomeEmoji: { fontSize: 22 },
  uInfo: { flex: 1 },
  uMatch: { color: '#fff', fontSize: 13, fontWeight: '700' },
  uMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 },
  uOdd: { backgroundColor: `${ACCENT}22`, borderRadius: 8, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: `${ACCENT}44` },
  uOddLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9 },
  uOddVal: { color: ACCENT, fontSize: 16, fontWeight: '800' },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
