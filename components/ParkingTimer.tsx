// components/ParkingTimer.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatDuration } from '../lib/utils/time';

interface ParkingTimerProps {
  startTime: Date;
  duration: number; // En heures
}

export function ParkingTimer({ startTime, duration }: ParkingTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  function calculateTimeLeft() {
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + duration);
    const diff = endTime.getTime() - Date.now();
    return Math.max(0, diff);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, duration]);

  if (timeLeft === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.timeText, styles.expired]}>
          Temps expiré !
        </Text>
      </View>
    );
  }

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Temps restant</Text>
      <Text style={styles.timeText}>
        {formatDuration({ hours, minutes, seconds })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  expired: {
    color: '#C62828',
  },
});