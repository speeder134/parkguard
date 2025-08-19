// app/(tabs)/parking/active.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ParkingTimer } from '../../../components/ParkingTimer';
import { cancelParkingNotifications } from '../../../lib/services/notifications';

// Type pour les paramètres de l'écran
type Params = {
  session: string;
};

export default function ActiveParkingScreen() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const { session: sessionParam } = useLocalSearchParams<Params>();
  
  useEffect(() => {
    if (sessionParam) {
      try {
        const parsedSession = JSON.parse(sessionParam);
        setSession(parsedSession);
      } catch (error) {
        console.error('Error parsing session:', error);
        router.replace('(tabs)/home' as never);
      }
    } else {
      router.replace('(tabs)/home' as never);
    }
  }, [sessionParam]);

  const handleEndParking = async () => {
    if (session) {
      // Annule les notifications programmées
      await cancelParkingNotifications(session.id);
      
      // Ici, tu mettrais à jour le statut dans Firestore
      // await api.put(`/api/v1/parking/end/${session.id}`);
      
      router.replace('(tabs)/parking/history' as never);
    }
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const startTime = new Date(session.startTime);
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + (session.duration || 2));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stationnement en cours</Text>
      </View>
      
      <View style={styles.content}>
        <ParkingTimer 
          startTime={startTime} 
          duration={session.duration || 2} 
        />
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Informations</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Début :</Text>
            <Text style={styles.infoValue}>
              {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fin prévue :</Text>
            <Text style={styles.infoValue}>
              {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Durée :</Text>
            <Text style={styles.infoValue}>
              {session.duration} heure{session.duration > 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        
        <Text style={styles.description}>
          Vous recevrez une notification 10 minutes avant la fin de votre stationnement.
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Terminer le stationnement" 
          onPress={handleEndParking}
          style={styles.endButton}
        />
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
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
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
  endButton: {
    backgroundColor: '#C62828',
  },
});