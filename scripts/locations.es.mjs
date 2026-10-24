import { LOCATIONS_GEN58 } from './locations.gen58.mjs';

/**
 * Nombres en español para las localizaciones de los pilotos de tercera generación.
 * Las rutas se generan automáticamente (Ruta 1, Ruta 101...).
 * Si una localización no está aquí, se usa el nombre en inglés con nameFallback=true.
 */
export const LOCATIONS_ES = {
  // Kanto: pueblos y ciudades
  'pallet-town': { name: 'Pueblo Paleta', kind: 'town' },
  'viridian-city': { name: 'Ciudad Verde', kind: 'town' },
  'pewter-city': { name: 'Ciudad Plateada', kind: 'town' },
  'cerulean-city': { name: 'Ciudad Celeste', kind: 'town' },
  'vermilion-city': { name: 'Ciudad Carmín', kind: 'town' },
  'lavender-town': { name: 'Pueblo Lavanda', kind: 'town' },
  'celadon-city': { name: 'Ciudad Azulona', kind: 'town' },
  'fuchsia-city': { name: 'Ciudad Fucsia', kind: 'town' },
  'saffron-city': { name: 'Ciudad Azafrán', kind: 'town' },
  'cinnabar-island': { name: 'Isla Canela', kind: 'town' },

  // Kanto: rutas y zonas
  'viridian-forest': { name: 'Bosque Verde', kind: 'dungeon' },
  'mt-moon': { name: 'Monte Moon', kind: 'dungeon' },
  'rock-tunnel': { name: 'Túnel Roca', kind: 'dungeon' },
  'digletts-cave': { name: 'Cueva Diglett', kind: 'dungeon' },
  'cerulean-cave': { name: 'Cueva Celeste', kind: 'dungeon' },
  'pokemon-tower': { name: 'Torre Pokémon', kind: 'dungeon' },
  'pokemon-mansion': { name: 'Mansión Pokémon', kind: 'dungeon' },
  'kanto-power-plant': { name: 'Central Eléctrica', kind: 'dungeon' },
  'seafoam-islands': { name: 'Islas Espuma', kind: 'dungeon' },
  'kanto-safari-zone': { name: 'Zona Safari', kind: 'dungeon' },
  'kanto-victory-road-1': { name: 'Calle Victoria', kind: 'dungeon' },
  'kanto-victory-road-2': { name: 'Calle Victoria', kind: 'dungeon' },
  'kanto-underground-path': { name: 'Paso Subterráneo', kind: 'other' },
  'ss-anne': { name: 'S.S. Anne', kind: 'other' },
  'trainer-tower': { name: 'Torre Entrenadores', kind: 'dungeon' },
  'kanto-altering-cave': { name: 'Cueva Cambiante', kind: 'other' },
  'kanto-pokecenter': { name: 'Centro Pokémon', kind: 'other' },

  // Sevii
  'one-island': { name: 'Isla Prima', kind: 'town' },
  'two-island': { name: 'Isla Segunda', kind: 'town' },
  'three-island': { name: 'Isla Tercera', kind: 'town' },
  'four-island': { name: 'Isla Cuarta', kind: 'town' },
  'five-island': { name: 'Isla Quinta', kind: 'town' },
  'six-island': { name: 'Isla Sexta', kind: 'town' },
  'seven-island': { name: 'Isla Séptima', kind: 'town' },
  'kindle-road': { name: 'Camino Ascuas', kind: 'route' },
  'treasure-beach': { name: 'Playa Tesoro', kind: 'dungeon' },
  'berry-forest': { name: 'Bosque Baya', kind: 'dungeon' },
  'cape-brink': { name: 'Cabo Extremo', kind: 'dungeon' },
  'bond-bridge': { name: 'Puente Vínculo', kind: 'route' },
  'five-isle-meadow': { name: 'Pradera Isla Quinta', kind: 'route' },
  'memorial-pillar': { name: 'Pilar Conmemorativo', kind: 'dungeon' },
  'outcast-island': { name: 'Isla Apartada', kind: 'town' },
  'pattern-bush': { name: 'Arbusto Patrón', kind: 'dungeon' },
  'resort-gorgeous': { name: 'Complejo Lujo', kind: 'town' },
  'ruin-valley': { name: 'Valle Ruinas', kind: 'dungeon' },
  'sevault-canyon': { name: 'Cañón Sevault', kind: 'route' },
  'tanoby-ruins': { name: 'Ruinas Tanoby', kind: 'dungeon' },
  'water-labyrinth': { name: 'Laberinto de Agua', kind: 'dungeon' },
  'water-path': { name: 'Sendero Acuático', kind: 'route' },
  'lost-cave': { name: 'Cueva Perdida', kind: 'dungeon' },
  'mt-ember': { name: 'Monte Ascuas', kind: 'dungeon' },
  'icefall-cave': { name: 'Cueva Glaciada', kind: 'dungeon' },
  'green-path': { name: 'Camino Verde', kind: 'route' },
  'canyon-entrance': { name: 'Entrada del Cañón', kind: 'route' },

  // Hoenn: pueblos y ciudades
  'littleroot-town': { name: 'Pueblo Escaso', kind: 'town' },
  'oldale-town': { name: 'Pueblo Sol', kind: 'town' },
  'petalburg-city': { name: 'Ciudad Petalia', kind: 'town' },
  'rustboro-city': { name: 'Ciudad Férrica', kind: 'town' },
  'dewford-town': { name: 'Pueblo Azuliza', kind: 'town' },
  'slateport-city': { name: 'Ciudad Portual', kind: 'town' },
  'mauville-city': { name: 'Ciudad Malvalona', kind: 'town' },
  'verdanturf-town': { name: 'Pueblo Verdegal', kind: 'town' },
  'fallarbor-town': { name: 'Pueblo Pardal', kind: 'town' },
  'lavaridge-town': { name: 'Pueblo Lavacalda', kind: 'town' },
  'fortree-city': { name: 'Ciudad Arborada', kind: 'town' },
  'lilycove-city': { name: 'Ciudad Calagua', kind: 'town' },
  'mossdeep-city': { name: 'Ciudad Algaria', kind: 'town' },
  'sootopolis-city': { name: 'Ciudad Arrecípolis', kind: 'town' },
  'pacifidlog-town': { name: 'Pueblo Oromar', kind: 'town' },
  'ever-grande-city': { name: 'Ciudad Colosalia', kind: 'town' },

  // Hoenn: rutas y zonas
  'petalburg-woods': { name: 'Bosque Petalia', kind: 'dungeon' },
  'rusturf-tunnel': { name: 'Túnel Férrico', kind: 'dungeon' },
  'granite-cave': { name: 'Cueva Granito', kind: 'dungeon' },
  'meteor-falls': { name: 'Cascada Meteoro', kind: 'dungeon' },
  'fiery-path': { name: 'Senda Ígnea', kind: 'dungeon' },
  'jagged-pass': { name: 'Desfiladero', kind: 'dungeon' },
  'mt-pyre': { name: 'Monte Pira', kind: 'dungeon' },
  'shoal-cave': { name: 'Cueva Cardumen', kind: 'dungeon' },
  'seafloor-cavern': { name: 'Caverna Abisal', kind: 'dungeon' },
  'sky-pillar': { name: 'Pilar Celeste', kind: 'dungeon' },
  'cave-of-origin': { name: 'Cueva Ancestral', kind: 'dungeon' },
  'new-mauville': { name: 'Nuevo Malvalona', kind: 'dungeon' },
  'mirage-tower': { name: 'Torre Espejismo', kind: 'dungeon' },
  'mirage-island': { name: 'Isla Espejismo', kind: 'dungeon' },
  'desert-ruins': { name: 'Ruinas del Desierto', kind: 'dungeon' },
  'desert-underpass': { name: 'Paso del Desierto', kind: 'dungeon' },
  'island-cave': { name: 'Cueva Isla', kind: 'dungeon' },
  'ancient-tomb': { name: 'Tumba Antigua', kind: 'dungeon' },
  'team-aqua-hideout': { name: 'Guarida del Equipo Aqua', kind: 'dungeon' },
  'team-magma-hideout': { name: 'Guarida del Equipo Magma', kind: 'dungeon' },
  'magma-hideout': { name: 'Guarida Magma', kind: 'dungeon' },
  'abandoned-ship': { name: 'Barco Abandonado', kind: 'dungeon' },
  'southern-island': { name: 'Isla del Sur', kind: 'dungeon' },
  'birth-island': { name: 'Isla Nacimiento', kind: 'dungeon' },
  'marine-cave': { name: 'Cueva Marina', kind: 'dungeon' },
  'terra-cave': { name: 'Cueva Tierra', kind: 'dungeon' },
  'hoenn-safari-zone': { name: 'Zona Safari', kind: 'dungeon' },
  'hoenn-victory-road': { name: 'Calle Victoria', kind: 'dungeon' },
  'hoenn-altering-cave': { name: 'Cueva Cambiante', kind: 'other' },
  'hoenn-pokecenter': { name: 'Centro Pokémon', kind: 'other' },
  'roaming-hoenn': { name: 'Hoenn errante', kind: 'other' },

  // Johto: pueblos y ciudades
  'new-bark-town': { name: 'Pueblo Primavera', kind: 'town' },
  'cherrygrove-city': { name: 'Ciudad Cerezo', kind: 'town' },
  'violet-city': { name: 'Ciudad Malva', kind: 'town' },
  'azalea-town': { name: 'Pueblo Azalea', kind: 'town' },
  'goldenrod-city': { name: 'Ciudad Trigal', kind: 'town' },
  'ecruteak-city': { name: 'Ciudad Iris', kind: 'town' },
  'olivine-city': { name: 'Ciudad Oliva', kind: 'town' },
  'cianwood-city': { name: 'Ciudad Orquídea', kind: 'town' },
  'mahogany-town': { name: 'Pueblo Caoba', kind: 'town' },
  'blackthorn-city': { name: 'Ciudad Endrino', kind: 'town' },

  // Johto: rutas y zonas
  'sprout-tower': { name: 'Torre Bellsprout', kind: 'dungeon' },
  'ilex-forest': { name: 'Bosque Ilex', kind: 'dungeon' },
  'union-cave': { name: 'Cueva Unión', kind: 'dungeon' },
  'slowpoke-well': { name: 'Pozo Slowpoke', kind: 'dungeon' },
  'ruins-of-alph': { name: 'Ruinas Alfa', kind: 'dungeon' },
  'mt-mortar': { name: 'Monte Mortero', kind: 'dungeon' },
  'lake-of-rage': { name: 'Lago de la Furia', kind: 'dungeon' },
  'team-rocket-hq': { name: 'Guarida del Team Rocket', kind: 'dungeon' },
  'ice-path': { name: 'Senda Helada', kind: 'dungeon' },
  'dragons-den': { name: 'Guarida Dragón', kind: 'dungeon' },
  'dark-cave': { name: 'Cueva Oscura', kind: 'dungeon' },
  'whirl-islands': { name: 'Islas Remolino', kind: 'dungeon' },
  'mt-silver': { name: 'Monte Plata', kind: 'dungeon' },
  'tohjo-falls': { name: 'Cascadas Tohjo', kind: 'dungeon' },
  'bell-tower': { name: 'Torre Campana', kind: 'dungeon' },
  'burned-tower': { name: 'Torre Quemada', kind: 'dungeon' },
  'national-park': { name: 'Parque Nacional', kind: 'dungeon' },
  'olivine-lighthouse': { name: 'Faro de Ciudad Oliva', kind: 'dungeon' },
  'johto-victory-road': { name: 'Calle Victoria', kind: 'dungeon' },
  'johto-safari-zone': { name: 'Zona Safari', kind: 'dungeon' },
  'johto-altering-cave': { name: 'Cueva Cambiante', kind: 'other' },
  'johto-pokecenter': { name: 'Centro Pokémon', kind: 'other' },
  'roaming-johto': { name: 'Johto errante', kind: 'other' },
  'indigo-plateau': { name: 'Meseta Añil', kind: 'town' },

  // Sinnoh: pueblos y ciudades
  'twinleaf-town': { name: 'Pueblo Hojaverde', kind: 'town' },
  'sandgem-town': { name: 'Pueblo Arena', kind: 'town' },
  'jubilife-city': { name: 'Ciudad Jubileo', kind: 'town' },
  'oreburgh-city': { name: 'Ciudad Pirita', kind: 'town' },
  'floaroma-town': { name: 'Pueblo Aromaflor', kind: 'town' },
  'eterna-city': { name: 'Ciudad Vetusta', kind: 'town' },
  'hearthome-city': { name: 'Ciudad Corazón', kind: 'town' },
  'solaceon-town': { name: 'Pueblo Solaceon', kind: 'town' },
  'veilstone-city': { name: 'Ciudad Rocavelo', kind: 'town' },
  'pastoria-city': { name: 'Ciudad Pastoria', kind: 'town' },
  'celestic-town': { name: 'Pueblo Caelestis', kind: 'town' },
  'canalave-city': { name: 'Ciudad Canal', kind: 'town' },
  'snowpoint-city': { name: 'Ciudad Puntaneva', kind: 'town' },
  'sunyshore-city': { name: 'Ciudad Marina', kind: 'town' },
  'resort-area': { name: 'Área Descanso', kind: 'town' },
  'sinnoh-pokemon-league': { name: 'Liga Pokémon', kind: 'town' },
  'sinnoh-pokemart': { name: 'Tienda Pokémon', kind: 'other' },

  // Sinnoh: rutas y zonas
  'oreburgh-gate': { name: 'Puerta Pirita', kind: 'dungeon' },
  'oreburgh-mine': { name: 'Mina Pirita', kind: 'dungeon' },
  'ravaged-path': { name: 'Senda Desolada', kind: 'dungeon' },
  'floaroma-meadow': { name: 'Pradera Aromaflor', kind: 'dungeon' },
  'fuego-ironworks': { name: 'Fundición Fuego', kind: 'dungeon' },
  'valley-windworks': { name: 'Valle Eólico', kind: 'dungeon' },
  'eterna-forest': { name: 'Bosque Vetusta', kind: 'dungeon' },
  'old-chateau': { name: 'Vieja Mansión', kind: 'dungeon' },
  'mt-coronet': { name: 'Monte Corónet', kind: 'dungeon' },
  'lost-tower': { name: 'Torre Perdida', kind: 'dungeon' },
  'solaceon-ruins': { name: 'Ruinas Solaceon', kind: 'dungeon' },
  'wayward-cave': { name: 'Cueva Desvío', kind: 'dungeon' },
  'maniac-tunnel': { name: 'Túnel del Maníaco', kind: 'dungeon' },
  'ruin-maniac-cave': { name: 'Cueva del Maníaco', kind: 'dungeon' },
  'trophy-garden': { name: 'Jardín Trofeo', kind: 'dungeon' },
  'great-marsh': { name: 'Gran Pantano', kind: 'dungeon' },
  'lake-verity': { name: 'Lago Verdad', kind: 'dungeon' },
  'lake-valor': { name: 'Lago Valor', kind: 'dungeon' },
  'lake-acuity': { name: 'Lago Agudeza', kind: 'dungeon' },
  'valor-lakefront': { name: 'Orilla del Lago Valor', kind: 'dungeon' },
  'acuity-lakefront': { name: 'Orilla del Lago Agudeza', kind: 'dungeon' },
  'sendoff-spring': { name: 'Manantial Despedida', kind: 'dungeon' },
  'iron-island': { name: 'Isla Hierro', kind: 'dungeon' },
  'snowpoint-temple': { name: 'Templo Puntaneva', kind: 'dungeon' },
  'spear-pillar': { name: 'Columna Lanza', kind: 'dungeon' },
  'stark-mountain': { name: 'Monte Corona', kind: 'dungeon' },
  'turnback-cave': { name: 'Cueva Retorno', kind: 'dungeon' },
  'distortion-world': { name: 'Mundo Distorsión', kind: 'dungeon' },
  'sinnoh-victory-road': { name: 'Calle Victoria', kind: 'dungeon' },
  'roaming-sinnoh': { name: 'Sinnoh errante', kind: 'other' },

  // HGSS: nuevas zonas
  'safari-zone': { name: 'Zona Safari', kind: 'dungeon' },
  'safari-zone-gate': { name: 'Entrada de la Zona Safari', kind: 'other' },
  'cliff-cave': { name: 'Cueva Acantilado', kind: 'dungeon' },
  'cliff-edge-gate': { name: 'Puerta del Acantilado', kind: 'other' },
  'embedded-tower': { name: 'Torre Oculta', kind: 'dungeon' },
  'sinjoh-ruins': { name: 'Ruinas Sinjoh', kind: 'dungeon' },
  'pokeathlon-dome': { name: 'Domo Pokéathlon', kind: 'other' },
  'unknown-all-bugs': { name: 'Zona Safari · Bichos', kind: 'dungeon' },
  'unknown-all-poliwag': { name: 'Zona Safari · Poliwag', kind: 'dungeon' },
  'unknown-all-rattata': { name: 'Zona Safari · Rattata', kind: 'dungeon' },
};

Object.assign(LOCATIONS_ES, LOCATIONS_GEN58);

export const EXCLUDED_LOCATIONS = new Set([
  'kanto-pokecenter',
  'hoenn-pokecenter',
  'johto-pokecenter',
  'kanto-altering-cave',
  'hoenn-altering-cave',
  'johto-altering-cave',
  'roaming-hoenn',
  'roaming-johto',
  'roaming-sinnoh',
  'sinnoh-pokemart',
]);

export const KIND_ORDER = ['route', 'town', 'dungeon', 'other'];

export function getLocationMeta(locationId) {
  const route = locationId.match(/^(kanto|hoenn|johto|sinnoh|unova|kalos|alola|galar)-route-(\d+)$/);
  if (route) {
    return {
      name: `Ruta ${Number(route[2])}`,
      kind: 'route',
      order: Number(route[2]),
      fallback: false,
    };
  }

  const seaRoute = locationId.match(/^(kanto|johto|sinnoh|unova|kalos|alola|galar)-sea-route-(\d+)$/);
  if (seaRoute) {
    return {
      name: `Ruta marina ${Number(seaRoute[2])}`,
      kind: 'route',
      order: Number(seaRoute[2]),
      fallback: false,
    };
  }

  const curated = LOCATIONS_ES[locationId];
  if (curated) {
    return { ...curated, order: null, fallback: false };
  }

  return {
    name: locationId
      .split('-')
      .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
      .join(' '),
    kind: 'other',
    order: null,
    fallback: true,
  };
}
