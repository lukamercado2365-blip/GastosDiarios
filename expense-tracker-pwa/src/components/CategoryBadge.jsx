import { getCategory } from '../data/categories';

export default function CategoryBadge({ category }) {
  if (!category) return null;

  const categoryInfo = getCategory(category);

  return (
    <span
      className="category-badge"
      style={{
        backgroundColor: `${categoryInfo.color}20`,
        color: categoryInfo.color,
        border: `1px solid ${categoryInfo.color}50`,
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {categoryInfo.label}
    </span>
  );
}
