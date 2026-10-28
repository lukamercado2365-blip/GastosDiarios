import { Link } from 'react-router-dom';
import { mockExpenses } from '../data/mockExpenses';
import ExpenseCard from '../components/ExpenseCard';

export default function HomeScreen() {
  const totalAmount = mockExpenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <div
        style={{
          backgroundColor: '#e8f5e9',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '0.9rem', color: '#1b5e20', fontWeight: '500' }}>Total Acumulado</span>
        <h2 style={{ margin: '0.25rem 0', color: '#1b5e20', fontSize: '1.75rem' }}>
          ${totalAmount.toLocaleString('es-AR')}
        </h2>
        <span style={{ fontSize: '0.8rem', color: '#2e7d32' }}>{mockExpenses.length} gastos registrados</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#333' }}>Gastos Recientes</h3>
        <Link
          to="/expenses"
          style={{
            color: '#2b8a3e',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '600',
          }}
        >
          Ver todos →
        </Link>
      </div>

      <div>
        {mockExpenses.slice(0, 3).map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </div>
    </div>
  );
}
