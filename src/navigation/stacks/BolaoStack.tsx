import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BolaoScreen from '../../screens/BolaoScreen';

const Stack = createNativeStackNavigator();

export default function BolaoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BolaoMain" component={BolaoScreen} />
    </Stack.Navigator>
  );
}
