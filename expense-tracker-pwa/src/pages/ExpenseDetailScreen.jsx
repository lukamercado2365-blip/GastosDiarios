import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExpenses } from '../context/ExpensesContext';
import CategoryBadge from '../components/CategoryBadge';
import NewExpenseModal from '../components/NewExpenseModal';

function formatDate(dateString) {
  if (!dateString) return 'Sin fecha';
  try {
    const cleanDate = String(dateString).split('T')[0];
    const parts = cleanDate.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
  } catch {
    return dateString;
  }
  return dateString;
}

export default function ExpenseDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { expenses, updateExpense, removeExpense } = useExpenses();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const expense = expenses.find((item) => String(item.id) === String(id));

  const handleBack = () => {
    if (window.history.state?.idx === 0) {
      navigate('/expenses');
    } else {
      navigate(-1);
    }
  };

  if (!expense) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '2rem 1.5rem',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
        }}
      >
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: '#333' }}>
          Gasto no encontrado
        </h2>
        <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          No existe ningún gasto registrado con el identificador #{id}.
        </p>
        <button
          onClick={handleBack}
          className="btn-primary tap-feedback"
          style={{ marginTop: '1rem' }}
        >
          Volver a gastos
        </button>
      </div>
    );
  }

  const itemTitle = expense.title || expense.description || 'Sin título';

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que querés eliminar "${itemTitle}"?`)) {
      removeExpense(expense.id);
      navigate('/expenses');
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <button
          onClick={handleBack}
          className="tap-feedback"
          style={{
            background: 'none',
            border: 'none',
            color: '#2b8a3e',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          ← Volver
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="tap-feedback"
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
            ✏️ Editar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="tap-feedback"
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
            🗑️ Eliminar
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <span
            style={{
              display: 'block',
              fontSize: '0.8rem',
              color: '#6c757d',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600',
              marginBottom: '0.25rem',
            }}
          >
            Descripción
          </span>
          <h2 style={{ margin: 0, color: '#212529', fontSize: '1.35rem' }}>
            {itemTitle}
          </h2>
        </div>

        <div>
          <span
            style={{
              display: 'block',
              fontSize: '0.8rem',
              color: '#6c757d',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600',
              marginBottom: '0.25rem',
            }}
          >
            Monto
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2b8a3e' }}>
            ${Number(expense.amount).toLocaleString('es-AR')}
          </div>
        </div>

        <div>
          <span
            style={{
              display: 'block',
              fontSize: '0.8rem',
              color: '#6c757d',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600',
              marginBottom: '0.35rem',
            }}
          >
            Categoría
          </span>
          <CategoryBadge category={expense.category} />
        </div>

        <div>
          <span
            style={{
              display: 'block',
              fontSize: '0.8rem',
              color: '#6c757d',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600',
              marginBottom: '0.25rem',
            }}
          >
            Fecha
          </span>
          <div style={{ color: '#212529', fontSize: '1rem' }}>
            {formatDate(expense.createdAt || expense.date)}
          </div>
        </div>

        <div>
          <span
            style={{
              display: 'block',
              fontSize: '0.8rem',
              color: '#6c757d',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600',
              marginBottom: '0.25rem',
            }}
          >
            Notas
          </span>
          <div
            style={{
              color: expense.notes ? '#212529' : '#6c757d',
              fontStyle: expense.notes ? 'normal' : 'italic',
              fontSize: '0.95rem',
              backgroundColor: '#f8f9fa',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #e9ecef',
              lineHeight: 1.4,
            }}
          >
            {expense.notes || 'Sin notas'}
          </div>
        </div>

        {expense.hasPendingWrites && (
          <div
            style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              color: '#92400e',
              fontSize: '0.88rem',
              fontWeight: '600',
            }}
          >
            ⏳ Pendiente de sincronizar (en Sync Queue local)
          </div>
        )}
      </div>

      <NewExpenseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialExpense={expense}
        onSave={(data) => updateExpense(expense.id, data)}
      />
    </div>
  );
}
