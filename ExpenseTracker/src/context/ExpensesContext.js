import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

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

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hydrationFailed, setHydrationFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadExpenses = async () => {
      try {
        const savedExpenses = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);

        if (!isMounted) {
          return;
        }

        if (savedExpenses === null) {
          setExpenses(INITIAL_EXPENSES_DATA);
        } else {
          const parsedExpenses = JSON.parse(savedExpenses);
          if (Array.isArray(parsedExpenses)) {
            setExpenses(parsedExpenses);
          } else {
            console.error('Los gastos guardados en AsyncStorage no tienen formato de arreglo.');
            setHydrationFailed(true);
            setExpenses(INITIAL_EXPENSES_DATA);
          }
        }
      } catch (error) {
        console.error('Error al cargar los gastos desde AsyncStorage:', error);
        if (isMounted) {
          setHydrationFailed(true);
          setExpenses(INITIAL_EXPENSES_DATA);
        }
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    loadExpenses();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || hydrationFailed) {
      return;
    }

    const saveExpenses = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
      } catch (error) {
        console.error('Error al guardar los gastos en AsyncStorage:', error);
      }
    };

    saveExpenses();
  }, [expenses, isLoaded, hydrationFailed]);

  const addExpense = (data) => {
    const title = data.title || data.description || 'Sin título';
    const categoryName = typeof data.category === 'object' && data.category !== null
      ? data.category.label
      : (data.category || 'Otros');

    const newExpense = {
      id: data.id || Math.random().toString(36).substring(2, 9),
      title,
      description: title,
      amount: Number(data.amount) || 0,
      category: categoryName,
      notes: data.notes || '',
      createdAt: data.createdAt || new Date().toISOString(),
    };

    setExpenses((prev) => [newExpense, ...prev]);
    return newExpense;
  };

  const removeExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
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
