import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CATEGORIES } from '../data/categories';

export default function NewExpenseModal({ isOpen, onClose, onSave }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      style={{
        border: 'none',
        borderRadius: '12px',
        padding: '1.5rem',
        maxWidth: '420px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#333' }}>Nuevo Gasto</h3>
        <button
          onClick={onClose}
          type="button"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target;
          const title = form.title.value;
          const amount = parseFloat(form.amount.value);
          const category = form.category.value;
          const notes = form.notes.value;
          if (onSave) {
            onSave({ title, amount, category, notes });
          }
          onClose();
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Título del gasto
            <input
              type="text"
              name="title"
              required
              placeholder="Ej. Supermercado"
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
                marginTop: '0.25rem',
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Monto ($)
            <input
              type="number"
              name="amount"
              inputMode="decimal"
              step="any"
              required
              placeholder="0"
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
                marginTop: '0.25rem',
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Categoría
            <select
              name="category"
              defaultValue="Alimentación"
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
                marginTop: '0.25rem',
                backgroundColor: '#fff',
              }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Notas (opcional)
            <input
              type="text"
              name="notes"
              placeholder="Ej. Compra semanal"
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
                marginTop: '0.25rem',
              }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              background: '#f8f9fa',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: '#2b8a3e',
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Guardar
          </button>
        </div>
      </form>
    </dialog>,
    document.body
  );
}
