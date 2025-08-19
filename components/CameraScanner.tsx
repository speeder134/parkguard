// components/CameraScanner.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from 'expo-router';
import { Button } from './ui/Button';
import { getCurrentUser } from '../lib/firebase/auth';

export type ParkingSignResult = {
  type: 'time-limited' | 'permit-only' | 'no-parking' | 'unlimited' | 'unknown';
  duration?: number; // En heures
  permitRequired?: boolean;
  isAllowed?: boolean;
};

interface CameraScannerProps {
  onScanComplete: (result: ParkingSignResult) => void;
}

export function CameraScanner({ onScanComplete }: CameraScannerProps) {
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

        onScanComplete(result);
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
          Camera permission is required to scan parking signs.
        </Text>
        <Button title="Go to Settings" onPress={() => Alert.alert('Go to Settings')} />
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
            Point your camera at the parking sign
          </Text>
          <TouchableOpacity
            style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
            disabled={scanning}
            onPress={handleScan}
          >
            <Text style={styles.scanButtonText}>
              {scanning ? 'Scanning...' : 'Scan Sign'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  scanButtonDisabled: {
    backgroundColor: '#8BC34A',
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