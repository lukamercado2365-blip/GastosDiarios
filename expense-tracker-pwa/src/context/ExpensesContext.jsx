import { createContext, useContext, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { db, isFirebaseConfigured } from '../services/firebase';

const ExpensesContext = createContext(null);

const INITIAL_EXPENSES_DATA = [
  {
    id: '1',
    title: 'Supermercado',
    description: 'Supermercado',
    amount: 25000,
    category: 'Alimentación',
    notes: 'Compra semanal',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Combustible',
    description: 'Combustible',
    amount: 18000,
    category: 'Transporte',
    notes: 'Carga de nafta',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Internet',
    description: 'Internet',
    amount: 32000,
    category: 'Servicios',
    notes: 'Abono mensual',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Lee los gastos desde localStorage de forma síncrona (respaldo cuando Firebase no está configurado).
 * - null: devuelve los datos iniciales de ejemplo.
 * - Arreglo JSON válido (incluso []): respeta la lista guardada.
 * - JSON dañado o formato inesperado: devuelve [] para no romper la app.
 */
function readExpenses(storage) {
  try {
    const targetStorage = storage ?? globalThis.localStorage;
    const savedExpenses = targetStorage.getItem(STORAGE_KEYS.EXPENSES);

    if (savedExpenses === null) {
      return INITIAL_EXPENSES_DATA;
    }

    const parsedExpenses = JSON.parse(savedExpenses);
    if (Array.isArray(parsedExpenses)) {
      return parsedExpenses;
    }

    console.error('Los gastos guardados en localStorage no tienen formato de arreglo.');
    return [];
  } catch (error) {
    console.error('Error al leer los gastos desde localStorage:', error);
    return [];
  }
}

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState(() => (isFirebaseConfigured ? [] : readExpenses()));
  const [isLoaded, setIsLoaded] = useState(() => !isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      return undefined;
    }

    const expensesQuery = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
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
  }, []);

  useEffect(() => {
    if (isFirebaseConfigured) {
      return;
    }

    try {
      globalThis.localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error al guardar los gastos en localStorage:', error);
    }
  }, [expenses]);

  const addExpense = (data) => {
    const title = data.title || data.description || 'Sin título';
    const categoryName = typeof data.category === 'object' && data.category !== null
      ? data.category.label
      : (data.category || 'Otros');

    if (isFirebaseConfigured && db) {
      return addDoc(collection(db, 'expenses'), {
        title,
        description: title,
        amount: Number(data.amount) || 0,
        category: categoryName,
        notes: data.notes || '',
        createdAt: serverTimestamp(),
      });
    }

    const newExpense = {
      id: data.id || Math.random().toString(36).substring(2, 9),
      title,
      description: title,
      amount: Number(data.amount) || 0,
      category: categoryName,
      notes: data.notes || '',
      createdAt: data.createdAt || new Date().toISOString(),
      hasPendingWrites: false,
    };

    setExpenses((prev) => [newExpense, ...prev]);
    return newExpense;
  };

  const removeExpense = (id) => {
    if (isFirebaseConfigured && db) {
      return deleteDoc(doc(db, 'expenses', id));
    }

    setExpenses((prev) => prev.filter((item) => item.id !== id));
    return Promise.resolve();
  };

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        isLoaded,
        addExpense,
        removeExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses debe ser utilizado dentro de un ExpensesProvider');
  }
  return context;
}

export default ExpensesContext;
