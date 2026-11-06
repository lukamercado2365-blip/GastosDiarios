import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockExpenses as initialExpenses } from '../data/mockExpenses';
import NewExpenseModal from '../components/NewExpenseModal';

export default function HomeScreen() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalMovements = expenses.length;

  const handleAddExpense = (newExpense) => {
    const created = {
      id: String(Date.now()),
      description: newExpense.description,
      amount: newExpense.amount,
      category: { id: 'other', label: 'Otros', color: '#6C757D' },
      date: new Date().toISOString().split('T')[0],
    };
    setExpenses((prev) => [created, ...prev]);
  };

  return (
    <section className="welcome-screen">
      <section className="welcome-card">
        <header className="welcome-card-header">
          <h1 className="welcome-title">ExpenseTracker</h1>
          <p className="welcome-greeting">¡Te damos la bienvenida!</p>
        </header>

        <p className="welcome-description">
          Registrá y controlá tus gastos diarios de forma simple.
        </p>

        <section className="welcome-summary">
          <p className="summary-title">Total registrado</p>
          <p className="summary-total">${totalAmount.toLocaleString('es-AR')}</p>
          <p className="summary-movements">
            {totalMovements} {totalMovements === 1 ? 'movimiento registrado' : 'movimientos registrados'}
          </p>
        </section>

        <section className="welcome-actions">
          <button
            type="button"
            className="btn-welcome-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Registrar Nuevo Gasto
          </button>
          <Link to="/expenses" className="btn-welcome-secondary">
            Ver Listado Completo
          </Link>
        </section>
      </section>

      <NewExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddExpense}
      />
    </section>
  );
}
