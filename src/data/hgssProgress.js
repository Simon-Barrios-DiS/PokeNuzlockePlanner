export const HGSS_RED = {
  name: 'Red',
  locationId: 'mt-silver',
  locationName: 'Monte Plata',
  targetLevel: 88,
  team: [
    { name: 'Pikachu', level: 88, types: ['electric'] },
    { name: 'Snorlax', level: 82, types: ['normal'] },
    { name: 'Lapras', level: 80, types: ['water', 'ice'] },
    { name: 'Venusaur', level: 84, types: ['grass', 'poison'] },
    { name: 'Charizard', level: 84, types: ['fire', 'flying'] },
    { name: 'Blastoise', level: 84, types: ['water'] },
  ],
};

export const HGSS_CHAPTERS = [
  {
    id: 'johto',
    name: 'Johto',
    eyebrow: 'Aventura principal',
    description: '8 medallas, Liga Pokémon y camino hacia Kanto.',
    matches: (locationId) => locationId.startsWith('johto-'),
  },
  {
    id: 'kanto',
    name: 'Kanto',
    eyebrow: 'Post-game',
    description: '8 medallas de Kanto y preparación para Monte Plata.',
    matches: (locationId) => locationId.startsWith('kanto-'),
  },
  {
    id: 'mt-silver',
    name: 'Monte Plata',
    eyebrow: 'Camino final',
    description: 'La subida final antes del combate contra Red.',
    matches: (locationId) => locationId === 'mt-silver',
  },
];
