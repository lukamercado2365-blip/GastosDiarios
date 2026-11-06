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
      description: newExpense.description || newExpense.name,
      amount: newExpense.amount,
      category: newExpense.category || { id: 'other', label: 'Otros', color: '#6C757D' },
      date: new Date().toISOString().split('T')[0],
      notes: '',
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
          className="btn-primary tap-feedback"
          style={{ padding: '0.5rem 0.85rem', fontSize: '0.9rem' }}
        >
          + Cargar gasto
        </button>
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {expenses.map((expense) => (
          <li key={expense.id}>
            <ExpenseCard expense={expense} />
          </li>
        ))}
      </ul>

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
