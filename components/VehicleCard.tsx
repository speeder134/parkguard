// components/VehicleCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Vehicle } from '../types/parking';

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected?: boolean;
  onPress: () => void;
}

export function VehicleCard({ vehicle, isSelected, onPress }: VehicleCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, isSelected && styles.selected]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🚗</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.makeModel}>
          {vehicle.make} {vehicle.model}
        </Text>
        <Text style={styles.plate}>
          {vehicle.licensePlate}
        </Text>
      </View>
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  selected: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 24,
  },
  details: {
    flex: 1,
  },
  makeModel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  plate: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
  },
});