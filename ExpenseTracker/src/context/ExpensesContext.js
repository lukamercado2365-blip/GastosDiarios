import React, { createContext, useContext, useState } from 'react';

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
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES_DATA);
  const [isLoaded] = useState(true);

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
