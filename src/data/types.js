/** Tipos oficiales, ordenados como en la Pokédex Nacional. */
export const TYPES = {
  normal: { label: 'Normal', color: '#A8A77A' },
  fire: { label: 'Fuego', color: '#F08030' },
  water: { label: 'Agua', color: '#6890F0' },
  electric: { label: 'Eléctrico', color: '#F8D030' },
  grass: { label: 'Planta', color: '#78C850' },
  ice: { label: 'Hielo', color: '#98D8D8' },
  fighting: { label: 'Lucha', color: '#C03028' },
  poison: { label: 'Veneno', color: '#A040A0' },
  ground: { label: 'Tierra', color: '#E0C068' },
  flying: { label: 'Volador', color: '#A890F0' },
  psychic: { label: 'Psíquico', color: '#F85888' },
  bug: { label: 'Bicho', color: '#A8B820' },
  rock: { label: 'Roca', color: '#B8A038' },
  ghost: { label: 'Fantasma', color: '#705898' },
  dragon: { label: 'Dragón', color: '#7038F8' },
  dark: { label: 'Siniestro', color: '#705848' },
  steel: { label: 'Acero', color: '#B8B8D0' },
  fairy: { label: 'Hada', color: '#EE99AC' },
};

export const TYPE_ORDER = Object.keys(TYPES);

export const STAT_LABELS = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Especial',
  'special-defense': 'Def. Especial',
  speed: 'Velocidad',
};

export const HABITAT_LABELS = {
  cave: 'Cueva',
  forest: 'Bosque',
  grassland: 'Pradera',
  mountain: 'Montaña',
  rare: 'Raro',
  'rough-terrain': 'Terreno abrupto',
  sea: 'Mar',
  urban: 'Ciudad',
  'waters-edge': 'Orilla del agua',
};

export const SUGGESTED_SEARCHES = ['pikachu', 'charizard', 'eevee', 'gengar', 'lucario', 'greninja'];
