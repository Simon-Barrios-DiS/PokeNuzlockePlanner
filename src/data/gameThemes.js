import { getGeneration } from './generations';

/**
 * Acentos por juego. El color primario tiñe la ficha, la Pokédex y las rutas;
 * el secundario se usa en degradados y detalles.
 */
export const GAME_THEMES = {
  'red-blue': { primary: '#ef4444', secondary: '#3b82f6' },
  yellow: { primary: '#facc15', secondary: '#f59e0b' },
  'gold-silver': { primary: '#eab308', secondary: '#94a3b8' },
  crystal: { primary: '#22d3ee', secondary: '#3b82f6' },
  'ruby-sapphire': { primary: '#ef4444', secondary: '#3b82f6' },
  emerald: { primary: '#34d399', secondary: '#2dd4bf' },
  'firered-leafgreen': { primary: '#fb923c', secondary: '#34d399' },
  'diamond-pearl': { primary: '#60a5fa', secondary: '#f472b6' },
  platinum: { primary: '#94a3b8', secondary: '#22d3ee' },
  'heartgold-soulsilver': { primary: '#fbbf24', secondary: '#cbd5e1' },
  'black-white': { primary: '#e2e8f0', secondary: '#94a3b8' },
  'black-2-white-2': { primary: '#22d3ee', secondary: '#818cf8' },
  'x-y': { primary: '#3b82f6', secondary: '#ef4444' },
  'omega-ruby-alpha-sapphire': { primary: '#ef4444', secondary: '#3b82f6' },
  'sun-moon': { primary: '#fb923c', secondary: '#a78bfa' },
  'ultra-sun-ultra-moon': { primary: '#f59e0b', secondary: '#8b5cf6' },
  'lets-go-pikachu-lets-go-eevee': { primary: '#facc15', secondary: '#a16207' },
  'sword-shield': { primary: '#3b82f6', secondary: '#ec4899' },
  'brilliant-diamond-shining-pearl': { primary: '#f472b6', secondary: '#60a5fa' },
  'scarlet-violet': { primary: '#c084fc', secondary: '#fb923c' },
};

export function getGameTheme(game) {
  const theme = GAME_THEMES[game?.id];
  if (theme) return theme;

  const color = getGeneration(game?.generation ?? 1).color;
  return { primary: color, secondary: color };
}
