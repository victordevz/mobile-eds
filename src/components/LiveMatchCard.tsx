import React, { useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../theme';
import BragatinoLogo from '../../assets/bragatino.svg';
import BotafogoLogo from '../../assets/botafogo.svg';
import Foguinho from '../../assets/foguinho.svg';

const { width: SCREEN_W } = Dimensions.get('window');

const FIRE = String.fromCodePoint(0x1F525);
const BALL = String.fromCodePoint(0x26BD);

interface OddOption {
  key: 'home' | 'draw' | 'away';
  label: string;
  percentage: number;
  odd: number;
}

const ODDS: OddOption[] = [
  { key: 'home', label: 'Bragantino', percentage: 60, odd: 1.50 },
  { key: 'draw', label: 'Empate',     percentage: 10, odd: 3.30 },
  { key: 'away', label: 'Botafogo',   percentage: 30, odd: 2.20 },
];

interface LiveMatchCardProps {
  onBetPress?: () => void;
}

export default function LiveMatchCard({ onBetPress }: LiveMatchCardProps) {
  const [selected, setSelected] = useState<string | null>('draw');

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.leagueText}>Brasileirão</Text>
            <View style={styles.liveRow}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>AO VIVO</Text>
              <Text style={styles.liveTime}>90'4</Text>
            </View>
          </View>
          <Pressable style={styles.betButton} onPress={onBetPress}>
            <Text style={styles.betButtonText}>Criar aposta &gt;</Text>
          </Pressable>
        </View>

        {/* Match row */}
        <View style={styles.matchRow}>
          <View style={styles.teamBlock}>
            <BragatinoLogo width={52} height={52} />
          </View>
          <Text style={styles.scoreText}>1 x 1</Text>
          <View style={styles.teamBlock}>
            <BotafogoLogo width={52} height={52} />
          </View>
        </View>

        {/* Odds */}
        <View style={styles.oddsRow}>
          {ODDS.map((opt) => {
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
                <Text style={[styles.oddValue, isSelected && styles.oddValueSelected]}>
                  {opt.odd.toFixed(2)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Suggestion bar */}
        <View style={styles.suggestion}>
          <View style={styles.rectangle57} />
          <View style={styles.suggestionRow}>
            <Foguinho width={16} height={16} />
            <Text style={styles.suggestionText}>
              Botafogo <Text style={styles.bold}>vence</Text> + 2 gols
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
    paddingHorizontal: 14,
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
    borderRadius: 20,
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
    gap: 4,
  },
  oddBoxSelected: {
    backgroundColor: colors.white,
  },
  oddPct: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
  },
  oddPctSelected: {
    color: '#023397',
  },
  oddLabel: {
    color: colors.grey,
    fontSize: 12,
    fontWeight: '600',
  },
  oddLabelSelected: {
    color: '#023397',
  },
  oddValue: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  oddValueSelected: {
    color: '#023397',
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
  emoji: {
    fontWeight: 'normal',
    fontFamily: undefined,
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
