import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

/* ───────────────── Ícone turbo (raio + gráfico) ───────────────── */

function TurboIcon({ size = 22, color = colors.secondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Seta de gráfico subindo */}
      <Path
        d="M3 17L9 11L13 15L21 7"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 7H21V11"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sparkle pequeno */}
      <Path
        d="M14 3L15 5L17 6L15 7L14 9L13 7L11 6L13 5L14 3Z"
        fill={color}
      />
    </Svg>
  );
}

/* ───────────────── Ícones de esporte ───────────────── */

function SoccerIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
      <Path d="M12 2C12 2 9 6 9 12s3 10 3 10" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Path d="M12 2C12 2 15 6 15 12s-3 10-3 10" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Path d="M2 12h20" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Path d="M3.5 7h17M3.5 17h17" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  );
}

function TennisIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
      <Path d="M5 5.5C7 8 7 16 5 18.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <Path d="M19 5.5C17 8 17 16 19 18.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  );
}

function BasketballIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
      <Path d="M12 2v20M2 12h20" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Path d="M5 4.5C8 8 8 16 5 19.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Path d="M19 4.5C16 8 16 16 19 19.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

function GloveIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 20v-8L4 9a2 2 0 0 1 4 0V8a2 2 0 0 1 4 0V7a2 2 0 0 1 4 0v5h1a2 2 0 0 1 0 4H6z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M6 13h11" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

function ControllerIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="7" width="20" height="11" rx="4" stroke={color} strokeWidth="1.7" />
      <Path d="M7 11v4M5 13h4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <Circle cx="16" cy="11.5" r="1" fill={color} />
      <Circle cx="19" cy="13.5" r="1" fill={color} />
    </Svg>
  );
}

/* ───────────────── Dados mock ───────────────── */

interface SportCategory {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
}

const SPORT_CATEGORIES: SportCategory[] = [
  { id: 'sp1', label: 'Futebol', Icon: SoccerIcon },
  { id: 'sp2', label: 'Tênis', Icon: TennisIcon },
  { id: 'sp3', label: 'Basquete', Icon: BasketballIcon },
  { id: 'sp4', label: 'MMA', Icon: GloveIcon },
  { id: 'sp5', label: 'E-Sports', Icon: ControllerIcon },
];

type TabKey = 'super' | 'normal';

/* ───────────────── Componente principal ───────────────── */

interface OddsturbinadasProps {}

export default function OddsTurbinadas(_props: OddsturbinadasProps) {
  const [activeSport, setActiveSport] = useState('sp1');
  const [activeTab, setActiveTab] = useState<TabKey>('super');

  return (
    <View style={styles.root}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <TurboIcon size={20} color={colors.secondary} />
          <Text style={styles.sectionTitle}>Odds Turbinadas</Text>
        </View>
        <Pressable>
          <Text style={styles.seeAllLink}>Ver tudo →</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sportCatsRow}
      >
        {SPORT_CATEGORIES.map((cat) => {
          const isActive = activeSport === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setActiveSport(cat.id)}
              style={[
                styles.sportPill,
                isActive ? styles.sportPillActive : styles.sportPillInactive,
              ]}
            >
              <cat.Icon size={15} color={isActive ? colors.white : colors.grey} />
              <Text
                style={[
                  styles.sportLabel,
                  isActive ? styles.sportLabelActive : styles.sportLabelInactive,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.tabsRow}>
        <Pressable
          onPress={() => setActiveTab('super')}
          style={[styles.tabItem, activeTab === 'super' && styles.tabItemActive]}
        >
          <TurboIcon size={14} color={activeTab === 'super' ? colors.secondary : colors.grey} />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'super' ? styles.tabLabelActive : styles.tabLabelInactive,
            ]}
          >
            Super Turbinadas
          </Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>3x+</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('normal')}
          style={[styles.tabItem, activeTab === 'normal' && styles.tabItemActive]}
        >
          <TurboIcon size={14} color={activeTab === 'normal' ? '#FFB703' : colors.grey} />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'normal' ? styles.tabLabelActiveAlt : styles.tabLabelInactive,
            ]}
          >
            Turbinadas
          </Text>
          <View style={[styles.tabBadge, { backgroundColor: 'rgba(255,183,3,0.18)' }]}>
            <Text style={[styles.tabBadgeText, { color: '#FFB703' }]}>≤2.99x</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

/* ───────────────── Estilos ───────────────── */

const styles = StyleSheet.create({
  root: {
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
  sectionTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  seeAllLink: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
  },

  sportCatsRow: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
  },
  sportPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  sportPillActive: {
    backgroundColor: colors.card,
    borderWidth: 1.2,
    borderColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  sportPillInactive: {
    backgroundColor: colors.card,
    borderWidth: 1.2,
    borderColor: 'transparent',
  },
  sportLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  sportLabelActive: {
    color: colors.white,
  },
  sportLabelInactive: {
    color: colors.grey,
  },

  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 16,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    backgroundColor: colors.card,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: colors.secondary,
  },
  tabLabel: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: colors.secondary,
  },
  tabLabelActiveAlt: {
    color: '#FFB703',
  },
  tabLabelInactive: {
    color: colors.grey,
  },
  tabBadge: {
    backgroundColor: 'rgba(56,230,125,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tabBadgeText: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: '800',
  },
});
