import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import AuthModal from './src/components/AuthModal';
import MenuSheet from './src/components/MenuSheet';
import PixDepositModal from './src/components/PixDepositModal';
import CustomTabBar from './src/components/CustomTabBar';
import ChatScreen from './src/screens/ChatScreen';
import RoletaStack from './src/navigation/stacks/RoletaStack';
import SlotStack from './src/navigation/stacks/SlotStack';
import FutebolStack from './src/navigation/stacks/FutebolStack';
import PrevisoesStack from './src/navigation/stacks/PrevisoesStack';
import HistoricoScreen from './src/screens/HistoricoScreen';
import { navigationRef } from './src/navigation/navigationRef';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();
const Root = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Futebol"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Roleta" component={RoletaStack} />
      <Tab.Screen name="Futebol" component={FutebolStack} />
      <Tab.Screen name="Previsoes" component={PrevisoesStack} />
      <Tab.Screen name="Slot" component={SlotStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <Root.Navigator screenOptions={{ headerShown: false }}>
            <Root.Screen name="Main" component={MainTabs} />
            <Root.Screen
              name="Suporte"
              component={ChatScreen}
              options={{
                headerShown: true,
                title: 'Suporte',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerTitleStyle: { fontWeight: 'bold' },
              }}
            />
            <Root.Screen
              name="Historico"
              component={HistoricoScreen}
              options={{
                headerShown: true,
                title: 'Histórico',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerTitleStyle: { fontWeight: 'bold' },
              }}
            />
          </Root.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
        <AuthModal />
        <MenuSheet />
        <PixDepositModal />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
