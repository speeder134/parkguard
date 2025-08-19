// lib/services/storage.ts
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEYS = {
  VEHICLES: 'parkguard_vehicles',
  ACTIVE_SESSION: 'parkguard_active_session',
  DEFAULT_VEHICLE_ID: 'parkguard_default_vehicle_id',
};

// Véhicules
export const getVehicles = async (): Promise<Vehicle[]> => {
  const data = await SecureStore.getItemAsync(STORAGE_KEYS.VEHICLES);
  return data ? JSON.parse(data) : [];
};

export const saveVehicles = async (vehicles: Vehicle[]) => {
  await SecureStore.setItemAsync(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
};

export const getDefaultVehicleId = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(STORAGE_KEYS.DEFAULT_VEHICLE_ID);
};

export const setDefaultVehicleId = async (id: string) => {
  await SecureStore.setItemAsync(STORAGE_KEYS.DEFAULT_VEHICLE_ID, id);
};

// Session active
export const getActiveSession = async (): Promise<ParkingSession | null> => {
  const data = await SecureStore.getItemAsync(STORAGE_KEYS.ACTIVE_SESSION);
  return data ? JSON.parse(data) : null;
};

export const saveActiveSession = async (session: ParkingSession | null) => {
  if (session) {
    await SecureStore.setItemAsync(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
  } else {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ACTIVE_SESSION);
  }
};