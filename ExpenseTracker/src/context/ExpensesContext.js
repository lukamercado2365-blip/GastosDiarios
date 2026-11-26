import React, { createContext, useContext, useEffect, useState } from 'react';
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
import { db } from '../services/firebase';

const ExpensesContext = createContext(null);

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const expensesQuery = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
    return onSnapshot(expensesQuery, (snapshot) => {
      setExpenses(snapshot.docs.map((expenseDoc) => {
        const data = expenseDoc.data();
        return {
          ...data,
          id: expenseDoc.id,
          createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt ?? '',
        };
      }));
      setIsLoaded(true);
    }, (error) => {
      console.error('Error al sincronizar gastos desde Firestore:', error);
      setIsLoaded(true);
    });
  }, []);

  const addExpense = async (data) => {
    const title = data.title || data.description || 'Sin título';
    const categoryName = typeof data.category === 'object' && data.category !== null
      ? data.category.label
      : (data.category || 'Otros');

    return addDoc(collection(db, 'expenses'), {
      title,
      description: title,
      amount: Number(data.amount) || 0,
      category: categoryName,
      notes: data.notes || '',
      createdAt: serverTimestamp(),
    });
  };

  const removeExpense = (id) => deleteDoc(doc(db, 'expenses', id));

  return (
    <ExpensesContext.Provider value={{ expenses, isLoaded, addExpense, removeExpense }}>
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
