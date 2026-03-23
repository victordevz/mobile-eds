import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CustomTabBar from './src/components/CustomTabBar';
import SuporteStack from './src/navigation/stacks/SuporteStack';
import RoletaStack from './src/navigation/stacks/RoletaStack';
import SlotStack from './src/navigation/stacks/SlotStack';
import FutebolStack from './src/navigation/stacks/FutebolStack';
import HistoricoStack from './src/navigation/stacks/HistoricoStack';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Slot"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Suporte" component={SuporteStack} />
        <Tab.Screen name="Roleta" component={RoletaStack} />
        <Tab.Screen name="Futebol" component={FutebolStack} />
        <Tab.Screen name="Slot" component={SlotStack} />
        <Tab.Screen name="Historico" component={HistoricoStack} />
      </Tab.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}
