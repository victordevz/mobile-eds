/**
 * Paleta de cores — Esportes da Sorte
 *
 * Azul:  #023397  |  RGB(2, 54, 151)   |  PANTONE 7487 U
 * Verde: #38E67D  |  RGB(56, 230, 125) |  PANTONE 286 U
 */

export const colors = {
  /** Azul principal */
  primary: '#023397',

  /** Verde principal */
  secondary: '#38E67D',

  /** Branco */
  white: '#FFFFFF',

  /** Preto */
  black: '#000000',

  /** Fundo padrão */
  background: '#FFFFFF',

  /** Texto sobre fundo escuro */
  textLight: '#FFFFFF',

  /** Texto sobre fundo claro */
  textDark: '#023397',

  /* ─── Casino UI extras ─── */

  /** Azul escuro para fundos profundos */
  primaryDark: '#01184F',

  /** Azul médio para cards / superfícies */
  card: '#042B7A',

  /** Azul claro para superfícies elevadas */
  cardLight: '#0A3D9E',

  /** Texto secundário / cinza suave */
  grey: '#8892A7',

  /** Superfície semi-transparente clara */
  surface: 'rgba(255,255,255,0.08)',

  /** Superfície semi-transparente média */
  surfaceMid: 'rgba(255,255,255,0.14)',

  /** Overlay escuro */
  overlay: 'rgba(0,0,0,0.35)',
} as const;

export type ColorName = keyof typeof colors;
