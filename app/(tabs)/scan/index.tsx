// app/(tabs)/scan/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Button } from '../../../components/ui/Button';
import { useNavigation } from 'expo-router';

export type ParkingSignResult = {
  type: 'time-limited' | 'permit-only' | 'no-parking' | 'unlimited' | 'unknown';
  duration?: number; // En heures
  permitRequired?: boolean;
  isAllowed?: boolean;
};

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScan = async () => {
    if (!cameraRef.current || scanning) return;
    
    setScanning(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
      });

      // Simule le scan (dans une version réelle, on enverrait à une API ML)
      setTimeout(() => {
        // Détection aléatoire pour la démo
        const types: ParkingSignResult['type'][] = ['time-limited', 'permit-only', 'no-parking', 'unlimited'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        let result: ParkingSignResult = { type: randomType };
        
        if (randomType === 'time-limited') {
          result.duration = 2; // 2 heures max
        } else if (randomType === 'permit-only') {
          result.permitRequired = true;
        } else if (randomType === 'no-parking') {
          result.isAllowed = false;
        } else if (randomType === 'unlimited') {
          result.isAllowed = true;
        }

        // Enregistre le résultat et passe à l'écran suivant
        navigation.navigate('(tabs)/parking/confirm' as never, {
          scanResult: result,
          photo: photo.uri
        } as never);
        
        setScanning(false);
      }, 1500);
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo. Veuillez réessayer.');
      setScanning(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          La caméra est requise pour scanner les panneaux de stationnement.
        </Text>
        <Button title="Aller aux paramètres" onPress={() => Alert.alert('Aller aux paramètres')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera 
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
          <Text style={styles.instructions}>
            Pointez votre caméra vers le panneau de stationnement
          </Text>
          <TouchableOpacity
            style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
            disabled={scanning}
            onPress={handleScan}
          >
            <Text style={styles.scanButtonText}>
              {scanning ? 'Scan en cours...' : 'Scanner'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  scanArea: {
    position: 'absolute',
    top: '30%',
    width: '80%',
    height: 200,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  },
  instructions: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  scanButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  scanButtonDisabled: {
    backgroundColor: '#66BB6A',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    margin: 20,
  },
});