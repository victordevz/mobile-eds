import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme';
import BragatinoLogo from '../../assets/bragatino.svg';
import BotafogoLogo from '../../assets/botafogo.svg';
import Foguinho from '../../assets/foguinho.svg';

export interface LiveMatchOdd {
  key: string;
  label: string;
  percentage: number;
  odd: number;
}

export interface LiveMatchData {
  league: string;
  isLive?: boolean;
  minute?: string;
  homeScore: number;
  awayScore: number;
  homeIcon: ReactNode;
  awayIcon: ReactNode;
  odds: LiveMatchOdd[];
  suggestionTeam: string;
  suggestionDetail: string;
  defaultSelected?: string;
}

interface LiveMatchCardProps {
  data?: LiveMatchData;
  onBetPress?: () => void;
  style?: ViewStyle;
}

const DEFAULT_DATA: LiveMatchData = {
  league: 'Brasileirão',
  isLive: true,
  minute: "90'4",
  homeScore: 1,
  awayScore: 1,
  homeIcon: <BragatinoLogo width={52} height={52} />,
  awayIcon: <BotafogoLogo width={52} height={52} />,
  odds: [
    { key: 'home', label: 'Bragantino', percentage: 60, odd: 1.50 },
    { key: 'draw', label: 'Empate', percentage: 10, odd: 3.30 },
    { key: 'away', label: 'Botafogo', percentage: 30, odd: 2.20 },
  ],
  suggestionTeam: 'Botafogo',
  suggestionDetail: 'vence + 2 gols',
  defaultSelected: 'draw',
};

export default function LiveMatchCard({ data, onBetPress, style }: LiveMatchCardProps) {
  const d = data ?? DEFAULT_DATA;
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!d.isLive) return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0.2, duration: 800, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [d.isLive]);

  const [selected, setSelected] = useState<string>(
    d.defaultSelected ?? d.odds.find((o) => o.key === 'draw')?.key ?? d.odds[0]?.key ?? '',
  );

  return (
    <View style={[styles.root, style]}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.leagueText}>{d.league}</Text>
            {d.isLive && (
              <View style={styles.liveRow}>
                <Animated.View style={[styles.liveDot, { opacity: blink }]} />
                <Text style={styles.liveText}>AO VIVO</Text>
                {d.minute && <Text style={styles.liveTime}>{d.minute}</Text>}
              </View>
            )}
          </View>
          <Pressable style={styles.betButton} onPress={onBetPress}>
            <Text style={styles.betButtonText}>Criar aposta &gt;</Text>
          </Pressable>
        </View>

        <View style={styles.matchRow}>
          <View style={styles.teamBlock}>{d.homeIcon}</View>
          <Text style={styles.scoreText}>{d.homeScore} x {d.awayScore}</Text>
          <View style={styles.teamBlock}>{d.awayIcon}</View>
        </View>

        <View style={styles.oddsRow}>
          {d.odds.map((opt) => {
            const isSelected = selected === opt.key;
            return (
              <Pressable
                key={opt.key}
                style={[styles.oddBox, isSelected && styles.oddBoxSelected]}
                onPress={() => setSelected(opt.key)}
              >
                <Text style={[styles.oddPct, isSelected && styles.oddPctSelected]}>
                  {opt.percentage}%
                </Text>
                <Text style={[styles.oddLabel, isSelected && styles.oddLabelSelected]}>
                  {opt.label}
                </Text>
                <View style={[styles.oddValueBox, isSelected && styles.oddValueBoxSelected]}>
                  <Text style={[styles.oddValue, isSelected && styles.oddValueSelected]}>
                    {opt.odd.toFixed(2)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.suggestion}>
          <View style={styles.rectangle57} />
          <View style={styles.suggestionRow}>
            <Foguinho width={16} height={16} />
            <Text style={styles.suggestionText}>
              {d.suggestionTeam} <Text style={styles.bold}>{d.suggestionDetail}</Text>
            </Text>
          </View>
          <Pressable style={styles.goButton} onPress={onBetPress}>
            <Text style={styles.goButtonText}>VAMO LÁ</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  card: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0D1E50',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingLeft: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  leagueText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FF3B3B',
  },
  liveText: {
    color: '#FF3B3B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  liveTime: {
    color: colors.grey,
    fontSize: 11,
    fontWeight: '600',
  },
  betButton: {
    backgroundColor: '#E63946',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  betButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },

  /* Match */
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 16,
  },
  teamBlock: {
    alignItems: 'center',
  },
  scoreText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },

  /* Odds */
  oddsRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 6,
    paddingBottom: 10,
  },
  oddBox: {
    flex: 1,
    backgroundColor: '#162A6A',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    gap: 4,
  },
  oddBoxSelected: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  oddPct: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
  },
  oddPctSelected: {
    color: colors.white,
  },
  oddLabel: {
    color: colors.grey,
    fontSize: 12,
    fontWeight: '600',
  },
  oddLabelSelected: {
    color: colors.white,
  },
  oddValue: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  oddValueSelected: {
    color: '#023397',
  },
  oddValueBox: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 2,
  },
  oddValueBoxSelected: {
    backgroundColor: colors.white,
  },

  /* Suggestion */
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  rectangle57: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    opacity: 0.12,
    borderRadius: 12,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
    marginRight: 10,
  },
  suggestionText: {
    color: colors.white,
    fontSize: 13,
  },
  bold: {
    fontWeight: '800',
  },
  goButton: {
    backgroundColor: '#0AF43D',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  goButtonText: {
    color: '#023397',
    fontSize: 11,
    fontWeight: '700',
  },
});
