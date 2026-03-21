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
  background: '#023397',

  /** Texto sobre fundo escuro */
  textLight: '#FFFFFF',

  /** Texto sobre fundo claro */
  textDark: '#023397',
} as const;

export type ColorName = keyof typeof colors;
