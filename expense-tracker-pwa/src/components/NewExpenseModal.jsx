import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { EXPENSE_CATEGORIES } from '../data/mockExpenses';

export default function NewExpenseModal({ isOpen, onClose, onSave }) {
  const dialogRef = useRef(null);
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(EXPENSE_CATEGORIES[0]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(monto);
    console.log('Gasto enviado:', {
      nombre,
      monto: parsedAmount,
      categoria: selectedCategory,
    });

    if (onSave) {
      onSave({
        name: nombre,
        description: nombre,
        amount: parsedAmount,
        category: selectedCategory,
      });
    }

    setNombre('');
    setMonto('');
    setSelectedCategory(EXPENSE_CATEGORIES[0]);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleDialogClick}
      className="bottom-sheet-dialog"
    >
      <header className="modal-header">
        <h3 className="modal-title">Cargar Gasto</h3>
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
            {EXPENSE_CATEGORIES.map((cat) => {
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
            Guardar
          </button>
        </div>
      </form>
    </dialog>,
    document.body
  );
}
