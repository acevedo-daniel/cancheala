// app/(user)/canchas.tsx

import { View, Text, StyleSheet } from 'react-native';

export default function Canchas() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Acá irán todas las canchas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
