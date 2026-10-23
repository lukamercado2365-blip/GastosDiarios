const CATEGORY_COLORS = [
  '#D1495B',
  '#00798C',
  '#30638E',
  '#6A4C93',
  '#2A9D8F',
  '#E76F51',
  '#8A5A44',
  '#577590',
  '#BC6C25',
  '#6C757D',
];

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

const categoryDetails = [
  { id: 'food', label: 'Alimentos', icon: 'fast-food-outline' },
  { id: 'transport', label: 'Transporte', icon: 'car-outline' },
  { id: 'home', label: 'Hogar', icon: 'home-outline' },
  { id: 'health', label: 'Salud', icon: 'medkit-outline' },
  { id: 'education', label: 'Educación', icon: 'school-outline' },
  { id: 'entertainment', label: 'Entretenimiento', icon: 'film-outline' },
  { id: 'clothing', label: 'Ropa', icon: 'shirt-outline' },
  { id: 'services', label: 'Servicios', icon: 'flash-outline' },
  { id: 'pets', label: 'Mascotas', icon: 'paw-outline' },
  { id: 'other', label: 'Otros', icon: 'ellipsis-horizontal' },
];

const shuffledColors = shuffle(CATEGORY_COLORS);

export const EXPENSE_CATEGORIES = categoryDetails.map((category, index) => ({
  ...category,
  color: shuffledColors[index],
}));
