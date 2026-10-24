export const GENERATIONS = [
  { number: 1, roman: 'I', color: '#ef4444' },
  { number: 2, roman: 'II', color: '#f59e0b' },
  { number: 3, roman: 'III', color: '#10b981' },
  { number: 4, roman: 'IV', color: '#3b82f6' },
  { number: 5, roman: 'V', color: '#8b5cf6' },
  { number: 6, roman: 'VI', color: '#ec4899' },
  { number: 7, roman: 'VII', color: '#14b8a6' },
  { number: 8, roman: 'VIII', color: '#f97316' },
  { number: 9, roman: 'IX', color: '#a855f7' },
];

export const GENERATION_BY_NUMBER = Object.fromEntries(
  GENERATIONS.map((generation) => [generation.number, generation]),
);

export const GENERATION_ROMANS = GENERATIONS.map((generation) => generation.roman);

export function getGeneration(number) {
  return (
    GENERATION_BY_NUMBER[number] ?? {
      number,
      roman: String(number),
      color: '#7c8aa5',
    }
  );
}
