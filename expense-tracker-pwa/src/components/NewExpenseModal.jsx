import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CATEGORIES, getCategory } from '../data/categories';

function NewExpenseForm({ initialExpense, onClose, onSave }) {
  const isEditing = Boolean(initialExpense);
  const [nombre, setNombre] = useState(
    initialExpense ? (initialExpense.title || initialExpense.description || '') : ''
  );
  const [monto, setMonto] = useState(
    initialExpense && initialExpense.amount !== undefined && initialExpense.amount !== null
      ? String(initialExpense.amount)
      : ''
  );
  const [notes, setNotes] = useState(initialExpense?.notes || '');
  const [selectedCategory, setSelectedCategory] = useState(
    initialExpense?.category ? getCategory(initialExpense.category) : CATEGORIES[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(monto);
    if (!nombre.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    if (onSave) {
      onSave({
        title: nombre.trim(),
        description: nombre.trim(),
        amount: parsedAmount,
        category: selectedCategory.label,
        notes: notes.trim(),
      });
    }

    onClose();
  };

  return (
    <>
      <header className="modal-header">
        <h3 className="modal-title">{isEditing ? 'Editar Gasto' : 'Cargar Gasto'}</h3>
        <button
          type="button"
          onClick={onClose}
          className="btn-modal-close tap-feedback"
          aria-label="Cerrar formulario"
        >
          ✕
        </button>
      </header>

      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="expense-name" className="form-label">
            Nombre del gasto
          </label>
          <input
            id="expense-name"
            type="text"
            name="name"
            required
            placeholder="Ej. Almuerzo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="expense-amount" className="form-label">
            Monto
          </label>
          <input
            id="expense-amount"
            type="number"
            step="any"
            inputMode="decimal"
            name="amount"
            required
            placeholder="0"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Categoría</label>
          <div
            className="category-chips-group"
            role="radiogroup"
            aria-label="Categoría del gasto"
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`category-chip ${isSelected ? 'category-chip-active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    borderColor: isSelected ? cat.color : undefined,
                    backgroundColor: isSelected ? `${cat.color}20` : undefined,
                    color: isSelected ? cat.color : undefined,
                  }}
                >
                  <span
                    className="category-chip-dot"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="expense-notes" className="form-label">
            Notas (opcional)
          </label>
          <input
            id="expense-notes"
            type="text"
            name="notes"
            placeholder="Ej. Compra semanal del súper"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn-modal-cancel tap-feedback"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary tap-feedback"
            style={{ padding: '0.5rem 1rem', fontSize: '0.95rem' }}
          >
            {isEditing ? 'Guardar cambios' : 'Guardar'}
          </button>
        </div>
      </form>
    </>
  );
}

export default function NewExpenseModal({ isOpen, onClose, onSave, initialExpense = null }) {
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

  const handleDialogClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleDialogClick}
      className="bottom-sheet-dialog"
    >
      <NewExpenseForm
        key={initialExpense ? `edit-${initialExpense.id}` : 'create'}
        initialExpense={initialExpense}
        onClose={onClose}
        onSave={onSave}
      />
    </dialog>,
    document.body
  );
}
