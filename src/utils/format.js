import { HABITAT_LABELS } from '../data/types';

export function formatName(name = '') {
  return name
    .split('-')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
}

export function padId(id) {
  return `#${String(id ?? 0).padStart(4, '0')}`;
}

export function idFromUrl(url = '') {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

export function artworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function artworkShinyUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
}

export function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

/** Convierte decímetros a metros y hectogramos a kilogramos. */
export function formatMeasure(value, unit) {
  if (value == null) return '—';
  const converted = value / 10;
  const formatted = Number.isInteger(converted) ? converted.toString() : converted.toFixed(1);
  return `${formatted} ${unit}`;
}

export function formatHabitat(name) {
  if (!name) return 'Desconocido';
  return HABITAT_LABELS[name] ?? formatName(name);
}
