import React, { createContext, useContext, ReactNode } from 'react';
import { db, auth, storage } from '../config/firebase';

interface FirebaseContextType {
  db: typeof db;
  auth: typeof auth;
  storage: typeof storage;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseContext.Provider value={{ db, auth, storage }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}