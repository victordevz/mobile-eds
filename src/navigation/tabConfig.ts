import React from 'react';
import { SvgProps } from 'react-native-svg';

import RoletaIcon from '../../assets/roleta.svg';
import SlotIcon from '../../assets/slot.svg';
import FutebolIcon from '../../assets/futebol.svg';

export interface TabItem {
  routeName: string;
  label: string;
  showLabel?: boolean;
  icon: React.FC<SvgProps>;
}

export const tabConfig: TabItem[] = [
  { routeName: 'Roleta', label: 'CASSINO', showLabel: true, icon: RoletaIcon },
  { routeName: 'Futebol', label: 'ESPORTES', showLabel: true, icon: FutebolIcon },
  { routeName: 'Slot', label: 'SLOT', showLabel: true, icon: SlotIcon },
];
