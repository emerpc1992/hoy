import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// Generic function to save data
export async function saveData<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: T
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error(`Error saving ${collectionName}:`, error);
    throw error;
  }
}

// Generic function to get data
export async function getData<T>(
  collectionName: string,
  id: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as T : null;
  } catch (error) {
    console.error(`Error getting ${collectionName}:`, error);
    throw error;
  }
}

// Generic function to get all documents from a collection
export async function getAllData<T>(collectionName: string): Promise<T[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  } catch (error) {
    console.error(`Error getting all ${collectionName}:`, error);
    throw error;
  }
}

// Generic function to update data
export async function updateData<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error(`Error updating ${collectionName}:`, error);
    throw error;
  }
}

// Generic function to delete data
export async function deleteData(
  collectionName: string,
  id: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting ${collectionName}:`, error);
    throw error;
  }
}

// Generic function to query data
export async function queryData<T>(
  collectionName: string,
  conditions: { field: string; operator: string; value: any }[],
  orderByField?: string,
  orderDirection: 'asc' | 'desc' = 'desc'
): Promise<T[]> {
  try {
    let q = collection(db, collectionName);

    // Add where clauses
    conditions.forEach(({ field, operator, value }) => {
      q = query(q, where(field, operator as any, value));
    });

    // Add orderBy if specified
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  } catch (error) {
    console.error(`Error querying ${collectionName}:`, error);
    throw error;
  }
}