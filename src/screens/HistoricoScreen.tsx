import React, { useState, useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme';

type FilterType = 'all' | 'casino' | 'sports';

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: '1',
    type: 'casino',
    category: 'slots',
    title: 'Gates of Olympus',
    subtitle: 'Pragmatic Play',
    betAmount: 20,
    payout: 87.5,
    status: 'won',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'sports',
    category: 'futebol',
    title: 'Flamengo vs Palmeiras',
    subtitle: 'Brasileirão Série A',
    betAmount: 50,
    payout: 0,
    status: 'lost',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'casino',
    category: 'crash',
    title: 'Aviator',
    subtitle: 'Spribe',
    betAmount: 30,
    payout: 30,
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    type: 'casino',
    category: 'slots',
    title: 'Fortune Tiger',
    subtitle: 'PG Soft',
    betAmount: 15,
    payout: 42,
    status: 'won',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '5',
    type: 'sports',
    category: 'futebol',
    title: 'Real Madrid vs Bayern',
    subtitle: 'Champions League',
    betAmount: 100,
    payout: 185,
    status: 'won',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '6',
    type: 'casino',
    category: 'roleta',
    title: 'Roleta Europeia',
    subtitle: 'Evolution Gaming',
    betAmount: 25,
    payout: 0,
    status: 'lost',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '7',
    type: 'casino',
    category: 'slots',
    title: 'Sweet Bonanza',
    subtitle: 'Pragmatic Play',
    betAmount: 40,
    payout: 160,
    status: 'won',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: '8',
    type: 'sports',
    category: 'futebol',
    title: 'Barcelona vs Inter',
    subtitle: 'Champions League',
    betAmount: 60,
    payout: 0,
    status: 'lost',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

const CATEGORY_EMOJI: Record<HistoryItem['category'], string> = {
  slots: '🎰',
  crash: '✈️',
  roleta: '🎡',
  futebol: '⚽',
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (sameDay(date, now)) return 'Hoje';
  if (sameDay(date, yesterday)) return 'Ontem';

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function groupByDate(items: HistoryItem[], filter: FilterType): HistorySection[] {
  const filtered = filter === 'all' ? items : items.filter(i => {
    if (filter === 'casino') return i.type === 'casino';
    return i.type === 'sports';
  });

  const map = new Map<string, HistoryItem[]>();
  for (const item of filtered) {
    const key = formatDate(item.createdAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }

  return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Cassino', value: 'casino' },
  { label: 'Esportes', value: 'sports' },
];

function FilterPills({
  active,
  onChange,
}: {
  active: FilterType;
  onChange: (v: FilterType) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.pillsContainer}
    >
      {FILTERS.map(f => (
        <TouchableOpacity
          key={f.value}
          onPress={() => onChange(f.value)}
          style={[styles.pill, active === f.value && styles.pillActive]}
        >
          <Text style={[styles.pillText, active === f.value && styles.pillTextActive]}>
            {f.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title.toUpperCase()}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: HistoryItem['status'] }) {
  const map: Record<HistoryItem['status'], { label: string; color: string; bg: string }> = {
    won: { label: 'GANHOU', color: colors.primaryDark, bg: colors.secondary },
    lost: { label: 'PERDEU', color: colors.white, bg: '#D94040' },
    pending: { label: 'PENDENTE', color: colors.black, bg: '#F0C040' },
  };
  const cfg = map[status];
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

function PayoutText({ item }: { item: HistoryItem }) {
  if (item.status === 'won') {
    return (
      <Text style={[styles.payout, { color: colors.secondary }]}>
        +{toCurrency(item.payout)}
      </Text>
    );
  }
  if (item.status === 'pending') {
    return (
      <Text style={[styles.payout, { color: '#F0C040' }]}>
        {toCurrency(item.betAmount)}
      </Text>
    );
  }
  return (
    <Text style={[styles.payout, { color: colors.grey }]}>
      -{toCurrency(item.betAmount)}
    </Text>
  );
}

function HistoryCard({ item }: { item: HistoryItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardIcon}>
        <Text style={styles.cardEmoji}>{CATEGORY_EMOJI[item.category]}</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <StatusBadge status={item.status} />
        </View>

        <Text style={styles.cardSubtitle}>
          {item.subtitle} · {formatTime(item.createdAt)}
        </Text>

        <View style={styles.cardRow}>
          <Text style={styles.cardBet}>Aposta: {toCurrency(item.betAmount)}</Text>
          <PayoutText item={item} />
        </View>
      </View>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🕐</Text>
      <Text style={styles.emptyText}>Nenhuma atividade ainda</Text>
    </View>
  );
}

export default function HistoricoScreen() {
  const [filter, setFilter] = useState<FilterType>('all');

  const sections = useMemo(() => groupByDate(MOCK_HISTORY, filter), [filter]);

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <HistoryCard item={item} />}
        renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
        ListHeaderComponent={<FilterPills active={filter} onChange={setFilter} />}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={[
          styles.listContent,
          sections.length === 0 && styles.listEmpty,
        ]}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  listContent: {
    paddingBottom: 100,
  },
  listEmpty: {
    flexGrow: 1,
  },

  pillsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
  },
  pillActive: {
    backgroundColor: colors.secondary,
  },
  pillText: {
    color: colors.grey,
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: colors.black,
  },

  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    color: colors.grey,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },

  card: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardLight,
    gap: 12,
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {
    fontSize: 22,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  cardSubtitle: {
    color: colors.grey,
    fontSize: 12,
  },
  cardBet: {
    color: colors.grey,
    fontSize: 12,
  },
  payout: {
    fontSize: 13,
    fontWeight: '700',
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    color: colors.grey,
    fontSize: 16,
  },
});
