import { useState } from 'react';
import { mockExpenses as initialExpenses } from '../data/mockExpenses';
import ExpenseCard from '../components/ExpenseCard';
import NewExpenseModal from '../components/NewExpenseModal';

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddExpense = (newExpense) => {
    const created = {
      id: String(Date.now()),
      description: newExpense.description,
      amount: newExpense.amount,
      category: { id: 'other', label: 'Otros', color: '#6C757D' },
      date: new Date().toISOString().split('T')[0],
    };
    setExpenses([created, ...expenses]);
  };

  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#333' }}>Listado de Gastos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#2b8a3e',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 0.85rem',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          + Cargar gasto
        </button>
      </div>

      <div>
        {expenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#e8f5e9',
          padding: '1rem',
          borderRadius: '8px',
          marginTop: '1rem',
          color: '#1b5e20',
          fontWeight: '700',
        }}
      >
        <span>Total de gastos</span>
        <span style={{ fontSize: '1.15rem' }}>${totalAmount.toLocaleString('es-AR')}</span>
      </div>

      <NewExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddExpense}
      />
    </div>
  );
}
