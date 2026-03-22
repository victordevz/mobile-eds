import React from 'react';
import { SvgProps } from 'react-native-svg';

import SuporteIcon from '../../assets/suporte.svg';
import RoletaIcon from '../../assets/roleta.svg';
import SlotIcon from '../../assets/slot.svg';
import FutebolIcon from '../../assets/futebol.svg';
import HistoricoIcon from '../../assets/historico.svg';

export interface TabItem {
  routeName: string;
  label: string;
  showLabel?: boolean;
  icon: React.FC<SvgProps>;
}

export const tabConfig: TabItem[] = [
  { routeName: 'Suporte', label: 'SUPORTE', showLabel: true, icon: SuporteIcon },
  { routeName: 'Roleta', label: 'ROLETA', showLabel: true, icon: RoletaIcon },
  { routeName: 'Slot', label: 'SLOT', showLabel: true, icon: SlotIcon },
  { routeName: 'Futebol', label: 'FUTEBOL', showLabel: true, icon: FutebolIcon },
  { routeName: 'Historico', label: 'HISTÓRICO', showLabel: true, icon: HistoricoIcon },
];
