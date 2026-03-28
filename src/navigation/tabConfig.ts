import React from 'react';
import { SvgProps } from 'react-native-svg';
import { ImageSourcePropType } from 'react-native';

import CassinoChipIcon from '../../assets/cassino_chip.svg';
import SlotIcon from '../../assets/slot.svg';
import FutebolIcon from '../../assets/futebol.svg';
import PrevisoesIcon from '../../assets/previsoes.svg';
import BolaoIcon from '../../assets/bolao.svg';

export interface TabItem {
  routeName: string;
  label: string;
  showLabel?: boolean;
  icon?: React.FC<SvgProps>;
  imageIcon?: ImageSourcePropType;
}

export const tabConfig: TabItem[] = [
  { routeName: 'Previsoes', label: 'PREVISÕES', showLabel: true, icon: PrevisoesIcon },
  { routeName: 'Roleta', label: 'CASSINO', showLabel: true, icon: CassinoChipIcon },
  { routeName: 'Futebol', label: 'ESPORTES', showLabel: true, icon: FutebolIcon },
  { routeName: 'Slot', label: 'SLOT', showLabel: true, icon: SlotIcon },
  { routeName: 'Bolao', label: 'BOLÃO', showLabel: true, icon: BolaoIcon },
];
