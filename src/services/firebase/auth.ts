import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { User, UserRole } from '../../types/auth';

// Create a users collection in Firestore to store additional user data
const USERS_COLLECTION = 'users';

export async function signIn(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    
    // Get user role from Firestore
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
    const role = userDoc.exists() ? userDoc.data().role : 'user';

    return {
      username: user.email || '',
      password: '', // Don't store password
      role: role as UserRole,
    };
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Invalid credentials');
    }
    throw new Error('An error occurred during login');
  }
}

export async function createUser(email: string, password: string, role: UserRole = 'user'): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    // Store additional user data in Firestore
    await setDoc(doc(db, USERS_COLLECTION, user.uid), {
      email: user.email,
      role,
      createdAt: new Date(),
    });

    return {
      username: user.email || '',
      password: '',
      role,
    };
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email already in use');
    }
    throw new Error('Error creating user');
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Error sending password reset email');
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export function getCurrentUser(): Promise<FirebaseUser | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Initialize default admin user if it doesn't exist
export async function initializeDefaultUsers() {
  try {
    const adminEmail = 'admin@masterfactu.com';
    const adminPassword = 'admin123';

    try {
      await signIn(adminEmail, adminPassword);
    } catch (error) {
      // If admin doesn't exist, create it
      await createUser(adminEmail, adminPassword, 'admin');
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error initializing default users:', error);
  }
}