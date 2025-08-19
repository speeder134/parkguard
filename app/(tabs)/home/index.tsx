// app/(tabs)/home/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Button } from '../../../components/ui/Button';
import { useNavigation } from 'expo-router';
import * as Location from 'expo-location';

// ✅ CORRECT - export default
export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        // ✅ Demande les permissions de localisation
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission de localisation refusée');
          return;
        }

        // ✅ Obtient la position actuelle
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        
        // ✅ Configure la région de la carte
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        setErrorMsg('Erreur lors de l\'obtention de la localisation');
        console.error(error);
      }
    })();
  }, []);

  const handleStartParking = () => {
    navigation.navigate('(tabs)/scan' as never);
  };

  // ✅ Gestion du chargement
  if (!region) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>
          {errorMsg ? errorMsg : 'Obtention de votre position...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onMapReady={() => setIsMapReady(true)}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {/* ✅ Zones autorisées de stationnement (exemple) */}
        <Marker
          coordinate={{ latitude: region.latitude + 0.001, longitude: region.longitude - 0.001 }}
          title="Zone autorisée"
          description="Stationnement gratuit - 2H max"
        />
        
        <Marker
          coordinate={{ latitude: region.latitude - 0.001, longitude: region.longitude + 0.001 }}
          title="Zone autorisée avec permis"
          description="Stationnement 1H max - Permis requis"
        />
        
        {/* ✅ Zone interdite (exemple) */}
        <Marker
          coordinate={{ latitude: region.latitude + 0.0015, longitude: region.longitude + 0.0015 }}
          title="Zone interdite"
          description="Pas de stationnement"
        />
      </MapView>
      
      <View style={styles.parkingButtonContainer}>
        <Button 
          title="Je me gare" 
          onPress={handleStartParking}
          style={styles.parkingButton}
        />
      </View>
      
      <View style={styles.infoPanel}>
        <Text style={styles.infoTitle}>ParkGuard</Text>
        <Text style={styles.infoText}>
          Trouvez des places de stationnement et évitez les contraventions
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  parkingButtonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  parkingButton: {
    width: '90%',
    backgroundColor: '#2E7D32',
  },
  infoPanel: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});