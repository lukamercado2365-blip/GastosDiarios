export const CATEGORIES = [
  { id: 'food', label: 'Alimentación', icon: 'fast-food-outline', color: '#D1495B' },
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

export function getCategory(category) {
  if (!category) {
    return CATEGORIES.find((c) => c.id === 'other');
  }
  if (typeof category === 'object' && category.label) {
    return category;
  }
  const found = CATEGORIES.find(
    (c) => c.label.toLowerCase() === String(category).toLowerCase() ||
           c.id.toLowerCase() === String(category).toLowerCase() ||
           (c.id === 'food' && String(category).toLowerCase().startsWith('alim'))
  );
  return found || { id: 'other', label: String(category), icon: 'ellipsis-horizontal', color: '#6C757D' };
}
