import { useState, useEffect } from 'react';
import { collection, onSnapshot, QueryConstraint, query } from 'firebase/firestore';
import { db } from '../config/firebase';

interface UseFirestoreOptions {
  transform?: (data: any) => any;
  queryConstraints?: QueryConstraint[];
}

export function useFirestore<T>(
  collectionPath: string,
  options: UseFirestoreOptions = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const collectionRef = collection(db, collectionPath);
    const queryRef = options.queryConstraints 
      ? query(collectionRef, ...options.queryConstraints)
      : collectionRef;

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setData(options.transform ? items.map(options.transform) : items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Error fetching ${collectionPath}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionPath, options.queryConstraints]);

  return { data, loading, error };
}