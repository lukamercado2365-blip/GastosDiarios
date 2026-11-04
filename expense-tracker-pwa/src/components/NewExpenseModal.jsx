import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

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
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#333' }}>Nuevo Gasto</h3>
        <button
          onClick={onClose}
          type="button"
          className="tap-feedback"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            display: 'inline-block',
          }}
        >
          ✕
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target;
          const description = form.description.value;
          const amount = parseFloat(form.amount.value);
          if (onSave) {
            onSave({ description, amount });
          }
          onClose();
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Descripción
            <input
              type="text"
              name="description"
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

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Monto ($)
            <input
              type="number"
              name="amount"
              inputMode="decimal"
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            className="tap-feedback"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              background: '#f8f9fa',
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary tap-feedback"
            style={{ padding: '0.5rem 1rem', fontSize: '0.95rem' }}
          >
            Guardar
          </button>
        </div>
      </form>
    </dialog>,
    document.body
  );
}
