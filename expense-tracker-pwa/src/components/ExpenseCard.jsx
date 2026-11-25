import { Link } from 'react-router-dom';
import CategoryBadge from './CategoryBadge';

function formatAmount(amount) {
  return `$${Number(amount).toLocaleString('es-AR')}`;
}

export default function ExpenseCard({ expense, onDelete }) {
  if (!expense) return null;

  const itemTitle = expense.title || expense.description || 'Sin título';

  return (
    <div
      className="expense-card tap-feedback"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        marginBottom: '0.75rem',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <Link
        to={`/expenses/${expense.id}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          alignItems: 'flex-start',
          textDecoration: 'none',
          color: 'inherit',
          flex: 1,
        }}
      >
        <span
          style={{
            color: '#212529',
            fontWeight: '600',
            fontSize: '1rem',
          }}
        >
          {itemTitle}
        </span>
        <CategoryBadge category={expense.category} />
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span
          style={{
            color: '#2b8a3e',
            fontWeight: '700',
            fontSize: '1.05rem',
            whiteSpace: 'nowrap',
          }}
        >
          {formatAmount(expense.amount)}
        </span>
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (window.confirm(`¿Estás seguro de que querés eliminar "${itemTitle}"?`)) {
                onDelete(expense.id);
              }
            }}
            aria-label={`Eliminar ${itemTitle}`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#dc3545',
              fontSize: '1rem',
              padding: '4px',
            }}
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
