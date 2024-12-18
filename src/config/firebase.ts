import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB3SBiS2vz-V7uMsIodidROF2pTmmmRsK0",
  authDomain: "alvarosalon1.firebaseapp.com",
  projectId: "alvarosalon1",
  storageBucket: "alvarosalon1.firebasestorage.app",
  messagingSenderId: "356998393587",
  appId: "1:356998393587:web:604fe99e9f687fafadd186"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);