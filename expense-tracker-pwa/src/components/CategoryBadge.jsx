export default function CategoryBadge({ category }) {
  if (!category) return null;

  return (
    <span
      className="category-badge"
      style={{
        backgroundColor: `${category.color}20`,
        color: category.color,
        border: `1px solid ${category.color}50`,
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {category.label}
    </span>
  );
}
