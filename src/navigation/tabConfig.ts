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
  icon: React.FC<SvgProps>;
}

export const tabConfig: TabItem[] = [
  { routeName: 'Suporte', label: 'SUPORTE', icon: SuporteIcon },
  { routeName: 'Roleta', label: 'ROLETA', icon: RoletaIcon },
  { routeName: 'Slot', label: 'SLOT', icon: SlotIcon },
  { routeName: 'Futebol', label: 'FUTEBOL', icon: FutebolIcon },
  { routeName: 'Historico', label: 'HISTÓRICO\nAPOSTAS', icon: HistoricoIcon },
];
