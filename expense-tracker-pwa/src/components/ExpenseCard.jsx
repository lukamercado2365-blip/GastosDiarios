import { Link } from 'react-router-dom';
import CategoryBadge from './CategoryBadge';

function formatAmount(amount) {
  return `$${Number(amount).toLocaleString('es-AR')}`;
}

export default function ExpenseCard({ expense }) {
  if (!expense) return null;

  return (
    <Link
      to={`/expenses/${expense.id}`}
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
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
        <span
          style={{
            color: '#212529',
            fontWeight: '600',
            fontSize: '1rem',
          }}
        >
          {expense.description}
        </span>
        <CategoryBadge category={expense.category} />
      </div>
      <span
        style={{
          color: '#2b8a3e',
          fontWeight: '700',
          fontSize: '1.05rem',
        }}
      >
        {formatAmount(expense.amount)}
      </span>
    </Link>
  );
}
