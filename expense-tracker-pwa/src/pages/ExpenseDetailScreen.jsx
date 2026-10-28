import { useNavigate, useParams } from 'react-router-dom';
import { mockExpenses } from '../data/mockExpenses';
import CategoryBadge from '../components/CategoryBadge';

export default function ExpenseDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const expense = mockExpenses.find((item) => String(item.id) === String(id));

  if (!expense) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Gasto no encontrado.</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '0.5rem 1rem',
            background: '#2b8a3e',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #e0e0e0',
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: '#2b8a3e',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '1rem',
          padding: 0,
        }}
      >
        ← Volver
      </button>

      <h2 style={{ marginTop: 0, color: '#333' }}>{expense.description}</h2>

      <div style={{ marginBottom: '1rem' }}>
        <CategoryBadge category={expense.category} />
      </div>

      <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2b8a3e', marginBottom: '1rem' }}>
        ${expense.amount.toLocaleString('es-AR')}
      </div>

      <div style={{ color: '#6c757d', fontSize: '0.85rem' }}>
        Fecha registrada: {expense.date || 'Sin fecha'}
      </div>
    </div>
  );
}
