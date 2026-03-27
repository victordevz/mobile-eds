export interface BetSlipData {
  matchLabel: string;
  oddLabel: string;
  oddValue: number;
  league: string;
}

export type SportType = 'todos' | 'futebol' | 'basquete' | 'tenis' | 'volei' | 'esports';

export interface SportTheme {
  id: SportType;
  label: string;
  emoji: string;
  bg: string;
  accent: string;
  cardBg: string;
  surface: string;
}

export const SPORT_THEMES: Record<SportType, SportTheme> = {
  todos:    { id: 'todos',    label: 'Todos',    emoji: '🎯', bg: '#01184F', accent: '#38E67D', cardBg: '#0D1E50', surface: '#162A6A' },
  futebol:  { id: 'futebol',  label: 'Futebol',  emoji: '⚽', bg: '#01184F', accent: '#38E67D', cardBg: '#0D1E50', surface: '#162A6A' },
  basquete: { id: 'basquete', label: 'Basquete', emoji: '🏀', bg: '#180800', accent: '#FF6B2B', cardBg: '#2A1200', surface: '#3D1C00' },
  tenis:    { id: 'tenis',    label: 'Tênis',    emoji: '🎾', bg: '#001A10', accent: '#C8F063', cardBg: '#00281A', surface: '#003A25' },
  volei:    { id: 'volei',    label: 'Vôlei',    emoji: '🏐', bg: '#181200', accent: '#FFD700', cardBg: '#261A00', surface: '#352400' },
  esports:  { id: 'esports',  label: 'eSports',  emoji: '🎮', bg: '#180000', accent: '#E63946', cardBg: '#240000', surface: '#360000' },
};

export const SPORT_ORDER: SportType[] = ['todos', 'futebol', 'basquete', 'tenis', 'volei', 'esports'];
