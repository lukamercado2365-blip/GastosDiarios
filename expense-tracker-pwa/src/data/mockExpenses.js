export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Alimentos', icon: 'fast-food-outline', color: '#D1495B' },
  { id: 'transport', label: 'Transporte', icon: 'car-outline', color: '#00798C' },
  { id: 'home', label: 'Hogar', icon: 'home-outline', color: '#30638E' },
  { id: 'health', label: 'Salud', icon: 'medkit-outline', color: '#6A4C93' },
  { id: 'education', label: 'Educación', icon: 'school-outline', color: '#2A9D8F' },
  { id: 'entertainment', label: 'Entretenimiento', icon: 'film-outline', color: '#E76F51' },
  { id: 'clothing', label: 'Ropa', icon: 'shirt-outline', color: '#8A5A44' },
  { id: 'services', label: 'Servicios', icon: 'flash-outline', color: '#577590' },
  { id: 'pets', label: 'Mascotas', icon: 'paw-outline', color: '#BC6C25' },
  { id: 'other', label: 'Otros', icon: 'ellipsis-horizontal', color: '#6C757D' },
];

export const mockExpenses = [
  {
    id: '1',
    description: 'Supermercado',
    amount: 25000,
    category: EXPENSE_CATEGORIES[0],
    date: '2026-10-21',
  },
  {
    id: '2',
    description: 'Combustible',
    amount: 18000,
    category: EXPENSE_CATEGORIES[1],
    date: '2026-10-21',
  },
  {
    id: '3',
    description: 'Internet',
    amount: 32000,
    category: EXPENSE_CATEGORIES[7],
    date: '2026-10-21',
  },
];
