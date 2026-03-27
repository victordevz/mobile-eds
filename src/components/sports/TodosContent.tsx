import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BetSlipData, SPORT_ORDER, SPORT_THEMES, SportType } from '../../types/sports';

const FEATURED: Array<{
  id: string; sport: SportType; league: string;
  home: string; homeEmoji: string;
  away: string; awayEmoji: string;
  homeScore: number; awayScore: number;
  isLive: boolean; time: string;
  homeOdd: number; drawOdd: number | null; awayOdd: number;
}> = [
  { id: 'f1', sport: 'futebol',  league: 'Brasileirão',     home: 'Flamengo',    homeEmoji: '🔴', away: 'Palmeiras',    awayEmoji: '🟢', homeScore: 1, awayScore: 1, isLive: true,  time: "73'",        homeOdd: 2.50,  drawOdd: 3.10, awayOdd: 2.20 },
  { id: 'f2', sport: 'basquete', league: 'NBA',              home: 'Lakers',      homeEmoji: '💛', away: 'Celtics',      awayEmoji: '🍀', homeScore: 98, awayScore: 102, isLive: true, time: 'Q3 5:12',    homeOdd: 2.10,  drawOdd: null, awayOdd: 1.75 },
  { id: 'f3', sport: 'tenis',    league: 'Roland Garros',   home: 'Alcaraz',     homeEmoji: '🇪🇸', away: 'Sinner',       awayEmoji: '🇮🇹', homeScore: 6, awayScore: 4,  isLive: true,  time: "Set 2",      homeOdd: 1.65,  drawOdd: null, awayOdd: 2.25 },
  { id: 'f4', sport: 'volei',    league: 'Superliga',        home: 'Sesc/RJ',     homeEmoji: '🔵', away: 'Praia Clube',  awayEmoji: '🟡', homeScore: 2,  awayScore: 1,  isLive: true,  time: 'Set 4',      homeOdd: 1.80,  drawOdd: null, awayOdd: 2.00 },
  { id: 'f5', sport: 'esports',  league: 'BLAST Premier',   home: 'NAVI',        homeEmoji: '💛', away: 'Vitality',     awayEmoji: '🐝', homeScore: 1,  awayScore: 0,  isLive: true,  time: 'Mapa 2',     homeOdd: 1.90,  drawOdd: null, awayOdd: 1.95 },
];

interface Props {
  onBetPress: (d: BetSlipData) => void;
  onSportSelect: (s: SportType) => void;
}

export default function TodosContent({ onBetPress, onSportSelect }: Props) {
  return (
    <>
      {/* Sport category tiles */}
      <View style={styles.categoryGrid}>
        {SPORT_ORDER.filter(s => s !== 'todos').map(sportId => {
          const t = SPORT_THEMES[sportId];
          return (
            <Pressable
              key={sportId}
              style={[styles.catTile, { borderColor: t.accent + '55' }]}
              onPress={() => onSportSelect(sportId)}
            >
              <View style={[styles.catIconBg, { backgroundColor: t.accent + '22' }]}>
                <Text style={styles.catEmoji}>{t.emoji}</Text>
              </View>
              <Text style={[styles.catLabel, { color: t.accent }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Live matches header */}
      <View style={styles.sectionRow}>
        <View style={styles.accentBar} />
        <Text style={styles.sectionTitle}>Ao Vivo Agora</Text>
        <View style={styles.liveCount}>
          <View style={styles.liveDot} />
          <Text style={styles.liveCountText}>{FEATURED.filter(f => f.isLive).length} jogos</Text>
        </View>
      </View>

      {/* Featured live cards */}
      {FEATURED.map(m => {
        const t = SPORT_THEMES[m.sport];
        return (
          <View key={m.id} style={[styles.matchCard, { borderColor: t.accent + '33' }]}>
            {/* Card top */}
            <View style={[styles.cardTop, { backgroundColor: t.cardBg }]}>
              <View style={styles.liveRow}>
                <View style={styles.liveIndicator} />
                <Text style={styles.liveLabel}>AO VIVO • {m.time}</Text>
              </View>
              <View style={[styles.sportTag, { backgroundColor: t.accent + '22' }]}>
                <Text style={styles.sportTagEmoji}>{t.emoji}</Text>
                <Text style={[styles.sportTagLabel, { color: t.accent }]}>{t.league}</Text>
              </View>
            </View>

            {/* Scores */}
            <View style={[styles.cardBody, { backgroundColor: t.cardBg }]}>
              <View style={styles.teamCol}>
                <Text style={styles.teamEmoji}>{m.homeEmoji}</Text>
                <Text style={styles.teamName}>{m.home}</Text>
              </View>
              <View style={styles.scoreBox}>
                <Text style={[styles.scoreText, { color: t.accent }]}>{m.homeScore}</Text>
                <Text style={styles.scoreSep}>–</Text>
                <Text style={[styles.scoreText, { color: t.accent }]}>{m.awayScore}</Text>
              </View>
              <View style={styles.teamCol}>
                <Text style={styles.teamEmoji}>{m.awayEmoji}</Text>
                <Text style={styles.teamName}>{m.away}</Text>
              </View>
            </View>

            {/* Odds */}
            <View style={[styles.oddsRow, { backgroundColor: t.surface }]}>
              <Pressable style={[styles.oddBtn, { borderColor: t.accent + '55' }]}
                onPress={() => onBetPress({ matchLabel: `${m.home} vs ${m.away}`, oddLabel: m.home, oddValue: m.homeOdd, league: m.league })}>
                <Text style={styles.oddTeamText}>{m.home.slice(0, 8)}</Text>
                <Text style={[styles.oddVal, { color: t.accent }]}>{m.homeOdd.toFixed(2)}</Text>
              </Pressable>
              {m.drawOdd && (
                <Pressable style={[styles.oddBtn, { borderColor: t.accent + '55' }]}
                  onPress={() => onBetPress({ matchLabel: `${m.home} vs ${m.away}`, oddLabel: 'Empate', oddValue: m.drawOdd!, league: m.league })}>
                  <Text style={styles.oddTeamText}>Empate</Text>
                  <Text style={[styles.oddVal, { color: t.accent }]}>{m.drawOdd.toFixed(2)}</Text>
                </Pressable>
              )}
              <Pressable style={[styles.oddBtn, { borderColor: t.accent + '55' }]}
                onPress={() => onBetPress({ matchLabel: `${m.home} vs ${m.away}`, oddLabel: m.away, oddValue: m.awayOdd, league: m.league })}>
                <Text style={styles.oddTeamText}>{m.away.slice(0, 8)}</Text>
                <Text style={[styles.oddVal, { color: t.accent }]}>{m.awayOdd.toFixed(2)}</Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  categoryGrid: {
    flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 10, marginTop: 4,
  },
  catTile: {
    width: '30%', backgroundColor: '#0D1E50', borderRadius: 14, borderWidth: 1,
    padding: 14, alignItems: 'center', gap: 8,
  },
  catIconBg: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  catEmoji: { fontSize: 24 },
  catLabel: { fontSize: 12, fontWeight: '700' },
  sectionRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    marginTop: 8, marginBottom: 10, gap: 10,
  },
  accentBar: { width: 4, height: 18, borderRadius: 2, backgroundColor: '#38E67D' },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '800', flex: 1 },
  liveCount: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(230,57,70,0.15)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E63946' },
  liveCountText: { color: '#E63946', fontSize: 10, fontWeight: '700' },
  matchCard: {
    marginHorizontal: 16, marginBottom: 12, borderRadius: 16, overflow: 'hidden', borderWidth: 1,
  },
  cardTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingTop: 10, paddingBottom: 8,
  },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveIndicator: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#E63946' },
  liveLabel: { color: '#E63946', fontSize: 11, fontWeight: '700' },
  sportTag: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  sportTagEmoji: { fontSize: 12 },
  sportTagLabel: { fontSize: 11, fontWeight: '700' },
  cardBody: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  teamCol: { alignItems: 'center', gap: 6 },
  teamEmoji: { fontSize: 28 },
  teamName: { color: '#fff', fontSize: 12, fontWeight: '700' },
  scoreBox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scoreText: { fontSize: 32, fontWeight: '900' },
  scoreSep: { color: 'rgba(255,255,255,0.4)', fontSize: 22 },
  oddsRow: { flexDirection: 'row', padding: 10, gap: 8 },
  oddBtn: { flex: 1, borderRadius: 10, borderWidth: 1, padding: 10, alignItems: 'center', gap: 4 },
  oddTeamText: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '600' },
  oddVal: { fontSize: 16, fontWeight: '800' },
});
