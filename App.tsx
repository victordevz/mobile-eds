import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from './src/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esportes da Sorte</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.secondary,
    fontSize: 28,
    fontWeight: 'bold',
  },
});
