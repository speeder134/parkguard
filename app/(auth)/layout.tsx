// app/(auth)/layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: 'Connexion' }} />
      <Stack.Screen name="register" options={{ title: 'Créer un compte' }} />
      <Stack.Screen name="verify" options={{ title: 'Vérification' }} />
    </Stack>
  );
}