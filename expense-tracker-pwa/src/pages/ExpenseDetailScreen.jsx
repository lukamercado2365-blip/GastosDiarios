import { useNavigate, useParams } from 'react-router-dom';
import { useExpenses } from '../context/ExpensesContext';
import CategoryBadge from '../components/CategoryBadge';

export default function ExpenseDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { expenses, removeExpense } = useExpenses();

  const expense = expenses.find((item) => String(item.id) === String(id));

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

  const itemTitle = expense.title || expense.description || 'Sin título';

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que querés eliminar "${itemTitle}"?`)) {
      removeExpense(expense.id);
      navigate(-1);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #e0e0e0',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: '#2b8a3e',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          ← Volver
        </button>
        <button
          onClick={handleDelete}
          style={{
            background: 'none',
            border: 'none',
            color: '#dc3545',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Eliminar
        </button>
      </div>

      <h2 style={{ marginTop: 0, color: '#333' }}>{itemTitle}</h2>

      <div style={{ marginBottom: '1rem' }}>
        <CategoryBadge category={expense.category} />
      </div>

      <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2b8a3e', marginBottom: '1rem' }}>
        ${Number(expense.amount).toLocaleString('es-AR')}
      </div>

      {expense.notes ? (
        <div style={{ color: '#495057', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
          <strong>Notas:</strong> {expense.notes}
        </div>
      ) : null}

      <div style={{ color: '#6c757d', fontSize: '0.85rem' }}>
        Fecha registrada: {expense.createdAt ? new Date(expense.createdAt).toLocaleDateString('es-AR') : (expense.date || 'Sin fecha')}
      </div>
    </div>
  );
}
