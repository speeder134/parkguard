// app/(tabs)/parking/index.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { useNavigation } from 'expo-router';

export default function ParkingScreen() {
  const navigation = useNavigation();

  const handleStartParking = () => {
    navigation.navigate('(tabs)/scan' as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stationnement</Text>
      <Text style={styles.subtitle}>Gérez vos sessions de stationnement</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Commencer un stationnement" 
          onPress={handleStartParking}
          style={styles.button}
        />
        
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => navigation.navigate('(tabs)/parking/history' as never)}
        >
          <Text style={styles.historyButtonText}>Historique</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#2E7D32',
    marginBottom: 15,
  },
  historyButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#333',
    fontWeight: '500',
  },
});