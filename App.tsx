import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import AuthModal from './src/components/AuthModal';
import MenuSheet from './src/components/MenuSheet';
import PixDepositModal from './src/components/PixDepositModal';
import CustomTabBar from './src/components/CustomTabBar';
import SuporteStack from './src/navigation/stacks/SuporteStack';
import RoletaStack from './src/navigation/stacks/RoletaStack';
import SlotStack from './src/navigation/stacks/SlotStack';
import FutebolStack from './src/navigation/stacks/FutebolStack';
import HistoricoStack from './src/navigation/stacks/HistoricoStack';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
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
        <AuthModal />
        <MenuSheet />
        <PixDepositModal />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
