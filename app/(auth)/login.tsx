// app/(auth)/login.tsx
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signIn } from '../../lib/firebase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('(tabs)/home' as never);
    } catch (error) {
      setError('Email ou mot de passe incorrect');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Mot de passe"
        secureTextEntry
        autoComplete="password"
      />
      
      <Button 
        title={loading ? 'Connexion...' : 'Se connecter'} 
        onPress={handleLogin}
        disabled={loading}
        color="#2E7D32"
      />
      
      <Button 
        title="Créer un compte" 
        onPress={() => router.push('(auth)/register' as never)}
        color="#666"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  error: {
    color: '#C62828',
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
});