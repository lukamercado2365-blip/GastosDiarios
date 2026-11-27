import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../services/firebase';

const ExpensesContext = createContext(null);

function getExpensesCollection(uid) {
  return uid ? collection(db, 'users', uid, 'expenses') : collection(db, 'expenses');
}

function getExpenseDoc(uid, id) {
  return uid ? doc(db, 'users', uid, 'expenses', id) : doc(db, 'expenses', id);
}

function normalizeExpensePayload(data) {
  const title = data.title || data.description || 'Sin título';
  const categoryName = typeof data.category === 'object' && data.category !== null
    ? data.category.label
    : (data.category || 'Otros');

  return {
    title,
    description: title,
    amount: Number(data.amount) || 0,
    category: categoryName,
    notes: data.notes || '',
  };
}

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthReady(true);
      return undefined;
    }

    return onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setAuthReady(true);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error('Error al iniciar sesión anónima en Firebase Auth:', error);
          setAuthReady(true);
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!authReady) {
      return undefined;
    }

    if (!isFirebaseConfigured || !db) {
      setIsLoaded(true);
      return undefined;
    }

    const expensesQuery = query(getExpensesCollection(userId), orderBy('createdAt', 'desc'));
    return onSnapshot(
      expensesQuery,
      { includeMetadataChanges: true },
      (snapshot) => {
        setExpenses(snapshot.docs.map((expenseDoc) => {
          const data = expenseDoc.data();
          return {
            ...data,
            id: expenseDoc.id,
            createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt ?? '',
            hasPendingWrites: Boolean(expenseDoc.metadata?.hasPendingWrites),
          };
        }));
        setIsLoaded(true);
      },
      (error) => {
        console.error('Error al sincronizar gastos desde Firestore:', error);
        setIsLoaded(true);
      }
    );
  }, [authReady, userId]);

  const addExpense = async (data) => {
    if (!isFirebaseConfigured || !db) {
      console.warn('Firestore no está configurado. Verificá las variables EXPO_PUBLIC_FIREBASE_*.');
      return null;
    }

    return addDoc(getExpensesCollection(userId), {
      ...normalizeExpensePayload(data),
      createdAt: serverTimestamp(),
    });
  };

  const updateExpense = async (id, data) => {
    if (!isFirebaseConfigured || !db) {
      console.warn('Firestore no está configurado. Verificá las variables EXPO_PUBLIC_FIREBASE_*.');
      return null;
    }

    return updateDoc(getExpenseDoc(userId, id), normalizeExpensePayload(data));
  };

  const removeExpense = (id) => {
    if (!isFirebaseConfigured || !db) {
      console.warn('Firestore no está configurado. Verificá las variables EXPO_PUBLIC_FIREBASE_*.');
      return Promise.resolve();
    }
    return deleteDoc(getExpenseDoc(userId, id));
  };

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        isLoaded,
        userId,
        addExpense,
        updateExpense,
        removeExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) throw new Error('useExpenses debe ser utilizado dentro de un ExpensesProvider');
  return context;
}

export default ExpensesContext;
