export const METHOD_LABELS = {
  wild: 'Salvaje',
  gift: 'Regalo',
  static: 'Estático',
  trade: 'Intercambio',
  other: 'Otro',
};

export const METHOD_ORDER = ['wild', 'gift', 'static', 'trade', 'other'];

export const RAW_METHOD_LABELS = {
  walk: 'Caminando',
  surf: 'Surf',
  'old-rod': 'Caña vieja',
  'good-rod': 'Caña buena',
  'super-rod': 'Caña excelente',
  'rock-smash': 'Demolición',
  headbutt: 'Cabezazo',
  'headbutt-low': 'Cabezazo (bajo)',
  'headbutt-normal': 'Cabezazo (normal)',
  'headbutt-high': 'Cabezazo (alto)',
  'squirt-bottle': 'Regadera',
  gift: 'Regalo',
  'gift-egg': 'Huevo de regalo',
  static: 'Estático',
  'npc-trade': 'Intercambio',
  pokeflute: 'Pokéflauta',
  'devon-scope': 'Pokédex Devon',
  'feebas-tile-fishing': 'Pesca especial',
  'roaming-grass': 'Errante (hierba)',
  'roaming-water': 'Errante (agua)',
  seaweed: 'Alga',
  horde: 'Horda',
  'dark-grass': 'Hierba oscura',
  'grass-spots': 'Manchas de hierba',
  'cave-spots': 'Manchas de cueva',
  'bridge-spots': 'Manchas del puente',
  'surf-spots': 'Manchas de surf',
  'super-rod-spots': 'Manchas de caña',
  'yellow-flowers': 'Flores amarillas',
  'purple-flowers': 'Flores moradas',
  'red-flowers': 'Flores rojas',
  'rough-terrain': 'Terreno abrupto',
  'berry-trees': 'Árboles de bayas',
  'hidden-grotto': 'Gruta oculta',
  'honey-tree': 'Árbol de miel',
  'max-raid': 'Max Raid',
  'dynamax-adventure': 'Aventura Dinamax',
  'overworld': 'Mundo abierto',
  'overworld-water': 'Mundo abierto (agua)',
  'overworld-flying': 'Mundo abierto (volando)',
  'overworld-dirt': 'Mundo abierto (tierra)',
  'overworld-special': 'Mundo abierto (especial)',
  'overworld-water-special': 'Mundo abierto (agua especial)',
  'overworld-flying-special': 'Mundo abierto (volando especial)',
  'ceiling-ambush': 'Emboscada desde el techo',
  'ground-ambush': 'Emboscada desde el suelo',
  'rustling-bush-ambush': 'Emboscada en arbusto',
  'sky-ambush': 'Emboscada desde el cielo',
  'trash-can-ambush': 'Emboscada en cubo de basura',
  'chase-water': 'Persecución acuática',
  'wanderer': 'Errante',
  'wanderer-water': 'Errante (agua)',
  'sos': 'SOS',
  'bubbling-spots': 'Burbujas',
  'sos-from-bubbling-spot': 'SOS en burbujas',
  'island-scan': 'Escáner isla',
  'rock-smash-spots': 'Manchas de demolición',
};

export const KIND_LABELS = {
  route: 'Rutas',
  town: 'Ciudades y pueblos',
  dungeon: 'Cuevas y zonas',
  other: 'Otras zonas',
};

export const KIND_ORDER = ['route', 'town', 'dungeon', 'other'];

export function formatDexNumber(value) {
  return String(value ?? 0).padStart(3, '0');
}

export function getMethodLabel(method) {
  return (
    RAW_METHOD_LABELS[method] ??
    method
      .split('-')
      .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
      .join(' ')
  );
}

const PHYSICAL_TYPES = new Set([
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
]);

/**
 * Hasta Gen III la categoría dependía del tipo del movimiento.
 * Desde Gen IV cada movimiento tiene su propia categoría.
 */
export function getMoveCategory(move, generation) {
  if (generation >= 4) return move.damageClass ?? 'status';
  if (move.damageClass === 'status') return 'status';
  return PHYSICAL_TYPES.has(move.type) ? 'physical' : 'special';
}

export function formatCondition(condition) {
  const labels = {
    'time-morning': 'De mañana',
    'time-day': 'De día',
    'time-night': 'De noche',
    'story-progress-beat-red': 'Tras derrotar a Rojo',
    'story-progress-beat-champion': 'Tras el Campeón',
    'story-progress-beat-team-galactic-iron-island': 'Tras el Equipo Galaxia en Isla Hierro',
    'story-progress-before-national-dex': 'Antes de la Pokédex Nacional',
    'story-progress-defeat-jupiter': 'Tras derrotar a Júpiter',
    'story-progress-defeat-mars': 'Tras derrotar a Marte',
    'story-progress-hall-of-fame': 'Tras el Salón de la Fama',
    'story-progress-national-dex': 'Con la Pokédex Nacional',
    'story-progress-receive-tm-from-claire': 'Tras recibir el MT de Débora',
    'story-progress-returned-machine-part': 'Tras devolver la pieza de la máquina',
    'story-progress-zephyr-badge': 'Con la Medalla Céfiro',
    'slot2-ruby': 'Con Rubí en la ranura',
    'slot2-sapphire': 'Con Zafiro en la ranura',
    'slot2-emerald': 'Con Esmeralda en la ranura',
    'slot2-firered': 'Con Rojo Fuego en la ranura',
    'slot2-leafgreen': 'Con Verde Hoja en la ranura',
    'slot2-none': 'Sin juego en la ranura 2',
    'item-claw-fossil': 'Fósil Garra',
    'item-dome-fossil': 'Fósil Domo',
    'item-helix-fossil': 'Fósil Hélix',
    'item-old-amber': 'Ámbar Viejo',
    'item-root-fossil': 'Fósil Raíz',
    'item-armor-fossil': 'Fósil Coraza',
    'item-skull-fossil': 'Fósil Cráneo',
    'item-adamant-orb': 'Orbe Adamante',
    'item-lustrous-orb': 'Orbe Lustroso',
    'item-odd-keystone': 'Piedra Extraña',
    'swarm-yes': 'Con plaga',
    'swarm-no': 'Sin plaga',
    'other-virtual-console': 'Consola Virtual',
    'other-correct-password': 'Contraseña correcta',
    'other-captured-all-ultra-beasts': 'Tras capturar todos los Ultraentes',
    'other-captured-reshiram-or-zekrom': 'Tras capturar a Reshiram o Zekrom',
    'other-caught-articuno': 'Tras capturar a Articuno',
    'other-caught-moltres': 'Tras capturar a Moltres',
    'other-caught-zapdos': 'Tras capturar a Zapdos',
    'other-choose-regidrago-pattern': 'Elegir el patrón de Regidrago',
    'other-choose-regieleki-pattern': 'Elegir el patrón de Regieleki',
    'other-found-11-times-roaming': 'Encontrado 11 veces como errante',
    'other-grow-iceroot-carrot': 'Cultivar zanahoria helada',
    'other-grow-shaderoot-carrot': 'Cultivar zanahoria sombría',
    'other-scan-qr-code': 'Escanear código QR',
    'other-talked-to-32-people': 'Tras hablar con 32 personas',
    'defeated-ghetsis': 'Tras derrotar a Ghetsis',
    'special-encounter-couldnt-capture-before': 'Encuentro especial no capturado antes',
    'story-progress-beat-olivias-trial': 'Tras superar la prueba de Olivia',
    'story-progress-before-hall-of-fame': 'Antes del Salón de la Fama',
    'story-progress-finished-looker-sidequest': 'Tras completar la misión de Looker',
    'story-progress-master-dojo-complete-first-trial': 'Dojo Maestro: primera prueba completada',
    'story-progress-master-dojo-complete-third-trial': 'Dojo Maestro: tercera prueba completada',
    'story-progress-quake-badge': 'Con la Medalla Temblor',
    'weather-fog': 'Clima: niebla',
    'weather-intense-sun': 'Clima: sol intenso',
    'weather-normal': 'Clima: normal',
    'weather-overcast': 'Clima: nublado',
    'weather-raining': 'Clima: lluvia',
    'weather-sandstorm': 'Clima: tormenta de arena',
    'weather-snowing': 'Clima: nieve',
    'weather-snowstorm': 'Clima: ventisca',
    'weather-thunderstorm': 'Clima: tormenta eléctrica',
    'season-spring': 'Estación: primavera',
    'season-summer': 'Estación: verano',
    'season-autumn': 'Estación: otoño',
    'season-winter': 'Estación: invierno',
    'item-cover-fossil': 'Fósil Tapa',
    'item-dark-stone': 'Piedra Oscura',
    'item-fossilized-bird': 'Fósil Ave',
    'item-fossilized-dino': 'Fósil Dino',
    'item-fossilized-drake': 'Fósil Draco',
    'item-fossilized-fish': 'Fósil Pez',
    'item-light-stone': 'Piedra Luz',
    'item-plume-fossil': 'Fósil Pluma',
    'item-reins-of-unity': 'Riendas de la Unión',
    'trash-can-type-daily': 'Cubo de basura: tipo diario',
    'trash-can-type-thursday': 'Cubo de basura: tipo jueves',
    'trash-can-type-tuesday': 'Cubo de basura: tipo martes',
    'other-giratina-not-caught-in-distortion-world':
      'Giratina no capturado en el Mundo Distorsión',
    'other-snorlax-11-beat-league': 'Snorlax: tras vencer la Liga',
    'other-talked-to-32-people-underground': 'Tras hablar con 32 personas bajo tierra',
    'other-talk-to-cynthias-grandmother': 'Tras hablar con la abuela de Cintia',
    'backlot-mentioned': 'Mencionado por Backlot',
    'backlot-not-mentioned': 'No mencionado por Backlot',
    'bug-catching-contest-yes': 'Con Concurso de Captura',
    'bug-catching-contest-no': 'Sin Concurso de Captura',
    'radar-on': 'Radar activado',
    'radar-off': 'Radar desactivado',
    'radio-off': 'Radio apagada',
    'trade-any-pokemon': 'Intercambio por cualquier Pokémon',
    'johto-safari-blocks-inactive': 'Zona Safari: sin bloques',
    'weekday-monday': 'Lunes',
    'weekday-tuesday': 'Martes',
    'weekday-wednesday': 'Miércoles',
    'weekday-thursday': 'Jueves',
    'weekday-friday': 'Viernes',
    'weekday-saturday': 'Sábado',
    'weekday-sunday': 'Domingo',
    'headbutt-tree-common': 'Árbol de Cabezazo (común)',
    'headbutt-tree-rare': 'Árbol de Cabezazo (raro)',
    'headbutt-tree-secret': 'Árbol de Cabezazo (secreto)',
    'honey-tree-group-a': 'Árbol de miel (grupo A)',
    'honey-tree-group-b': 'Árbol de miel (grupo B)',
    'honey-tree-group-c': 'Árbol de miel (grupo C)',
  };

  if (labels[condition]) return labels[condition];

  const coins = condition.match(/^coins-(\d+)$/);
  if (coins) return `${Number(coins[1])} monedas`;

  const greatMarsh = condition.match(/^great-marsh-daily-slot-(\d+)-of-(\d+)$/);
  if (greatMarsh) {
    return `Gran Pantano: slot ${Number(greatMarsh[1])} de ${Number(greatMarsh[2])}`;
  }
  if (condition === 'great-marsh-daily-slot-none') {
    return 'Gran Pantano: sin slot diario';
  }

  const safariBlocks = condition.match(
    /^johto-safari-blocks-(forest|peak|plains|water)-min-(\d+)$/,
  );
  if (safariBlocks) {
    const zone = {
      forest: 'Bosque',
      peak: 'Cumbre',
      plains: 'Llanura',
      water: 'Agua',
    }[safariBlocks[1]];
    return `Zona Safari: bloques ${zone} ≥ ${Number(safariBlocks[2])}`;
  }

  const diglett = condition.match(/^alolan-diglett-found-(\d+)$/);
  if (diglett) return `Diglett de Alola encontrados: ${Number(diglett[1])}`;

  const berryTree = condition.match(/^berry-tree-type-(blue|green|pink|purple|red|yellow)$/);
  if (berryTree) {
    const color = {
      blue: 'azul',
      green: 'verde',
      pink: 'rosa',
      purple: 'morada',
      red: 'roja',
      yellow: 'amarilla',
    }[berryTree[1]];
    return `Árbol de bayas: baya ${color}`;
  }

  const friendSafari = condition.match(/^friend-safari-slot-(\d+)$/);
  if (friendSafari) return `Safari Amistad: slot ${Number(friendSafari[1])}`;

  const maxRarity = condition.match(/^max-den-rarity-(common|rare|special)$/);
  if (maxRarity) {
    const rarity = { common: 'común', rare: 'rara', special: 'especial' }[maxRarity[1]];
    return `Guarida Max: rareza ${rarity}`;
  }

  const maxRating = condition.match(/^max-den-rating-(\d)-star$/);
  if (maxRating) return `Guarida Max: ${Number(maxRating[1])} estrellas`;

  const footprints = condition.match(
    /^other-find-50-(cavern|grassland|iron-will)-footprints$/,
  );
  if (footprints) {
    const zone = {
      cavern: 'Caverna',
      grassland: 'Pradera',
      'iron-will': 'Voluntad Férrea',
    }[footprints[1]];
    return `Encontrar 50 huellas de ${zone}`;
  }

  const starter = condition.match(/^starter-(chespin|fennekin|froakie)$/);
  if (starter) {
    const name = { chespin: 'Chespin', fennekin: 'Fennekin', froakie: 'Froakie' }[starter[1]];
    return `Inicial ${name}`;
  }

  const saveData = condition.match(/^save-data-from-lets-go-(eevee|pikachu)$/);
  if (saveData) {
    return `Datos de guardado de Let’s Go, ${saveData[1] === 'eevee' ? 'Eevee' : 'Pikachu'}!`;
  }

  const tradeGalar = condition.match(/^trade-(.+)-galar$/);
  if (tradeGalar) {
    const name = tradeGalar[1]
      .split('-')
      .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
      .join(' ');
    return `Intercambio por ${name} de Galar`;
  }

  const trade = condition.match(/^trade-(.+)$/);
  if (trade) {
    const name = trade[1]
      .split('-')
      .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
      .join(' ');
    return `Intercambio por ${name}`;
  }

  return condition
    .split('-')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
}
