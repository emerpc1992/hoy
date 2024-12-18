import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { AppearanceState } from '../../../types/appearance';

const SETTINGS_DOC = 'settings/appearance';

export async function saveAppearanceSettings(settings: AppearanceState): Promise<void> {
  try {
    await setDoc(doc(db, SETTINGS_DOC), settings);
  } catch (error) {
    console.error('Error saving appearance settings:', error);
    throw error;
  }
}

export async function getAppearanceSettings(): Promise<AppearanceState | null> {
  try {
    const docRef = doc(db, SETTINGS_DOC);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as AppearanceState : null;
  } catch (error) {
    console.error('Error getting appearance settings:', error);
    throw error;
  }
}