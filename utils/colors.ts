const colors = [
  { name: 'red', hex: '#EF4444' },
  { name: 'orange', hex: '#F97316' },
  { name: 'amber', hex: '#F59E0B' },
  { name: 'yellow', hex: '#EAB308' },
  { name: 'lime', hex: '#84CC16' },
  { name: 'green', hex: '#22C55E' },
  { name: 'emerald', hex: '#10B981' },
  { name: 'teal', hex: '#14B8A6' },
  { name: 'cyan', hex: '#06B6D4' },
  { name: 'sky', hex: '#0EA5E9' },
  { name: 'blue', hex: '#3B82F6' },
  { name: 'indigo', hex: '#6366F1' },
  { name: 'violet', hex: '#8B5CF6' },
  { name: 'purple', hex: '#A855F7' },
  { name: 'fuchsia', hex: '#D946EF' },
  { name: 'pink', hex: '#EC4899' },
  { name: 'rose', hex: '#F43F5E' },
];

export const pickColorForCategory = (startColor: string, i: number, numOfCategories: number) => {
  const startColorIndex = colors.findIndex(c => c.name === startColor);
  const step = Math.floor(colors.length / numOfCategories);
  return colors[(startColorIndex + i * step) % colors.length];
};
