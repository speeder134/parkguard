// app/(tabs)/parking/confirm.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { scheduleParkingReminder } from '../../../lib/services/notifications';

// Type pour les paramètres de l'écran
type Params = {
  scanResult: string;
  photo: string;
};

export type ParkingSession = {
  id: string;
  userId: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  startTime: Date;
  duration: number; // En heures
  status: 'active' | 'completed' | 'cancelled';
};

export default function ConfirmParkingScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [parkingSession, setParkingSession] = useState<ParkingSession | null>(null);
  const navigation = useNavigation();
  const { scanResult, photo } = useLocalSearchParams<Params>();
  
  const result = scanResult ? JSON.parse(scanResult) : null;
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission de localisation requise');
        navigation.goBack();
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLoading(false);
    })();
  }, []);

  const handleStartParking = async () => {
    if (!location || !result) return;
    
    try {
      // Crée une session de stationnement
      const session: ParkingSession = {
        id: Date.now().toString(),
        userId: 'user123', // À remplacer par l'ID utilisateur réel
        vehicleId: 'vehicle1', // À remplacer par l'ID du véhicule sélectionné
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        startTime: new Date(),
        duration: result.duration || 2,
        status: 'active'
      };
      
      setParkingSession(session);
      
      // Programme les notifications
      await scheduleParkingReminder(session);
      
      // Navigue vers l'écran actif
      navigation.replace('(tabs)/parking/active' as never, {
        session: JSON.stringify(session)
      } as never);
    } catch (error) {
      console.error('Error starting parking session:', error);
      alert('Erreur lors du démarrage du stationnement');
    }
  };

  if (loading || !result) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Confirmer le stationnement</Text>
      </View>
      
      <View style={styles.content}>
        {photo && (
          <Image source={{ uri: photo }} style={styles.photo} />
        )}
        
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Panneau détecté :</Text>
          
          {result.type === 'time-limited' && (
            <Text style={styles.resultText}>
              Stationnement autorisé - {result.duration} heure{result.duration > 1 ? 's' : ''}
            </Text>
          )}
          
          {result.type === 'permit-only' && (
            <Text style={styles.resultText}>
              Stationnement avec permis requis
            </Text>
          )}
          
          {result.type === 'no-parking' && (
            <Text style={[styles.resultText, styles.warningText]}>
              Stationnement interdit
            </Text>
          )}
          
          {result.type === 'unlimited' && (
            <Text style={styles.resultText}>
              Stationnement illimité autorisé
            </Text>
          )}
          
          {result.type === 'unknown' && (
            <Text style={styles.resultText}>
              Type de panneau inconnu
            </Text>
          )}
        </View>
        
        <Text style={styles.description}>
          ParkGuard enregistre votre position et vous avertira quand il sera temps de déplacer votre véhicule.
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Commencer le stationnement" 
          onPress={handleStartParking}
          style={styles.button}
        />
        
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
  },
  warningText: {
    color: '#C62828',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    backgroundColor: '#2E7D32',
    marginBottom: 10,
  },
  cancelText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
});