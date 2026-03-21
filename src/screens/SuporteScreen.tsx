import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function SuporteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suporte</Text>
      <Text style={styles.subtitle}>Como podemos ajudar?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 16,
    marginTop: 8,
  },
});
