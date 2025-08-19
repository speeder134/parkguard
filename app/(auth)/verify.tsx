// app/(auth)/verify.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Button } from '../../components/ui/Button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getCurrentUser } from '../../lib/firebase/auth';
import { sendEmailVerification } from 'firebase/auth';
import app from '../../lib/firebase/config';

export default function VerifyScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  
  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    } else {
      const user = getCurrentUser();
      if (user?.email) {
        setEmail(user.email);
      } else {
        Alert.alert('Erreur', 'Aucun utilisateur connecté', [
          { text: 'OK', onPress: () => router.replace('(auth)/login' as never) }
        ]);
      }
    }
  }, []);

  const handleResend = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Aucun utilisateur connecté');
      }
      
      await sendEmailVerification(user);
      Alert.alert('Succès', 'Email de vérification renvoyé avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de renvoyer l\'email de vérification');
      console.error('Error resending verification email:', error);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('Erreur', 'Le code doit contenir 6 chiffres');
      return;
    }
    
    setLoading(true);
    try {
      // Dans une application réelle, tu vérifierais le code avec ton backend
      // Ici, on simule la vérification en rechargeant l'utilisateur
      const user = getCurrentUser();
      
      if (user) {
        // On attend un peu pour simuler une vérification
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dans une app réelle, tu appelleras une API pour vérifier le code
        // await api.post('/api/v1/auth/verify', { code });
        
        // On redirige vers l'accueil
        router.replace('(tabs)/home' as never);
      } else {
        Alert.alert('Erreur', 'Session expirée, veuillez vous reconnecter');
        router.replace('(auth)/login' as never);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Code de vérification invalide');
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vérification de compte</Text>
      
      <Text style={styles.subtitle}>
        Nous avons envoyé un code de vérification à{'\n'}
        <Text style={styles.email}>{email}</Text>
      </Text>
      
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="Entrez le code"
        keyboardType="numeric"
        maxLength={6}
        autoFocus={true}
        textAlign="center"
        style={styles.codeInput}
      />
      
      <Button 
        title={loading ? 'Vérification...' : 'Vérifier'} 
        onPress={handleVerify}
        style={styles.button}
        disabled={loading || code.length !== 6}
      />
      
      <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
        <Text style={styles.resendText}>Renvoyer le code</Text>
      </TouchableOpacity>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2E7D32" />
          <Text style={styles.loadingText}>Vérification en cours...</Text>
        </View>
      )}
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  email: {
    fontWeight: 'bold',
    color: '#333',
  },
  codeInput: {
    fontSize: 24,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  input: {
    fontSize: 24,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2E7D32',
    marginBottom: 15,
  },
  resendButton: {
    marginTop: 10,
  },
  resendText: {
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loadingText: {
    marginLeft: 5,
    color: '#666',
  },
});