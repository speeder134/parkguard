// lib/firebase/auth.ts
import { getAuth, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithCredential, AuthCredential } from 'firebase/auth';
import app from './config';

const auth = getAuth(app);

// Fonctions d'authentification
export const signIn = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signUp = async (email: string, password: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  return userCredential.user;
};

export const signOut = async (): Promise<void> => {
  await auth.signOut();
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const linkWithCredential = async (credential: AuthCredential) => {
  if (!auth.currentUser) throw new Error('No user logged in');
  return await signInWithCredential(auth, credential);
};

// Export auth pour les observateurs
export { auth };