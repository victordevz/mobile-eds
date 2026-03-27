declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

interface HistoryItem {
  id: string;
  type: 'casino' | 'sports';
  category: 'slots' | 'crash' | 'roleta' | 'futebol';
  title: string;
  subtitle: string;
  betAmount: number;
  payout: number;
  status: 'won' | 'lost' | 'pending';
  createdAt: string;
}

interface HistorySection {
  title: string;
  data: HistoryItem[];
}
