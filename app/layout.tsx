// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home/index" options={{ title: 'Home', tabBarIcon: 'home' }} />
      <Tabs.Screen name="scan/index" options={{ title: 'Scan', tabBarIcon: 'camera' }} />
      <Tabs.Screen name="parking/index" options={{ title: 'Parking', tabBarIcon: 'map' }} />
      <Tabs.Screen name="settings/index" options={{ title: 'Settings', tabBarIcon: 'settings' }} />
    </Tabs>
  );
}