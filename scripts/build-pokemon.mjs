import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TYPE_ORDER } from '../src/data/types.js';
import { getLocationMeta } from './locations.es.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'public', 'data', 'v1');
const OUTPUT_DIR = path.join(DATA_DIR, 'pokemon');
const CACHE_DIR = path.join(ROOT, '.cache', 'pokeapi');
const BASE_URL = 'https://pokeapi.co/api/v2';
const GAME_IDS = [
  'red-blue',
  'yellow',
  'gold-silver',
  'crystal',
  'ruby-sapphire',
  'emerald',
  'firered-leafgreen',
  'diamond-pearl',
  'platinum',
  'heartgold-soulsilver',
  'black-white',
  'black-2-white-2',
  'x-y',
  'omega-ruby-alpha-sapphire',
  'sun-moon',
  'ultra-sun-ultra-moon',
  'lets-go-pikachu-lets-go-eevee',
  'sword-shield',
];
const CONCURRENCY = 4;

const VERSION_GROUPS_BY_GENERATION = new Map([
  [
    1,
    new Set(['red-blue', 'yellow', 'red-green-japan', 'blue-japan']),
  ],
  [
    2,
    new Set([
      'red-blue',
      'yellow',
      'red-green-japan',
      'blue-japan',
      'gold-silver',
      'crystal',
    ]),
  ],
  [
    3,
    new Set([
      'red-blue',
      'yellow',
      'red-green-japan',
      'blue-japan',
      'gold-silver',
      'crystal',
      'ruby-sapphire',
      'emerald',
      'firered-leafgreen',
      'colosseum',
      'xd',
    ]),
  ],
  [
    4,
    new Set([
      'red-blue',
      'yellow',
      'red-green-japan',
      'blue-japan',
      'gold-silver',
      'crystal',
      'ruby-sapphire',
      'emerald',
      'firered-leafgreen',
      'colosseum',
      'xd',
      'diamond-pearl',
      'platinum',
      'heartgold-soulsilver',
    ]),
  ],
  [
    5,
    new Set([
      'red-blue',
      'yellow',
      'red-green-japan',
      'blue-japan',
      'gold-silver',
      'crystal',
      'ruby-sapphire',
      'emerald',
      'firered-leafgreen',
      'colosseum',
      'xd',
      'diamond-pearl',
      'platinum',
      'heartgold-soulsilver',
      'black-white',
      'black-2-white-2',
    ]),
  ],
  [
    6,
    new Set([
      'red-blue',
      'yellow',
      'red-green-japan',
      'blue-japan',
      'gold-silver',
      'crystal',
      'ruby-sapphire',
      'emerald',
      'firered-leafgreen',
      'colosseum',
      'xd',
      'diamond-pearl',
      'platinum',
      'heartgold-soulsilver',
      'black-white',
      'black-2-white-2',
      'x-y',
      'omega-ruby-alpha-sapphire',
    ]),
  ],
  [
    7,
    new Set([
      'red-blue',
      'yellow',
      'red-green-japan',
      'blue-japan',
      'gold-silver',
      'crystal',
      'ruby-sapphire',
      'emerald',
      'firered-leafgreen',
      'colosseum',
      'xd',
      'diamond-pearl',
      'platinum',
      'heartgold-soulsilver',
      'black-white',
      'black-2-white-2',
      'x-y',
      'omega-ruby-alpha-sapphire',
      'sun-moon',
      'ultra-sun-ultra-moon',
      'lets-go-pikachu-lets-go-eevee',
    ]),
  ],
  [
    8,
    new Set([
      'red-blue',
      'yellow',
      'red-green-japan',
      'blue-japan',
      'gold-silver',
      'crystal',
      'ruby-sapphire',
      'emerald',
      'firered-leafgreen',
      'colosseum',
      'xd',
      'diamond-pearl',
      'platinum',
      'heartgold-soulsilver',
      'black-white',
      'black-2-white-2',
      'x-y',
      'omega-ruby-alpha-sapphire',
      'sun-moon',
      'ultra-sun-ultra-moon',
      'lets-go-pikachu-lets-go-eevee',
      'sword-shield',
      'brilliant-diamond-shining-pearl',
      'the-isle-of-armor',
      'the-crown-tundra',
    ]),
  ],
]);
const NO_CLOCK_GAMES = new Set(['red-blue', 'yellow', 'firered-leafgreen']);
const NO_BEAUTY_GAMES = new Set([
  'red-blue',
  'yellow',
  'gold-silver',
  'crystal',
  'firered-leafgreen',
]);

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function fetchJson(url) {
  await mkdir(CACHE_DIR, { recursive: true });
  const cacheKey = createHash('sha1').update(url).digest('hex');
  const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);

  try {
    return JSON.parse(await readFile(cacheFile, 'utf8'));
  } catch {
    // Sin caché.
  }

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status} para ${url}`);
      const data = await response.json();
      await writeFile(cacheFile, JSON.stringify(data));
      return data;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  throw lastError;
}

const getPokemon = (id) => fetchJson(`${BASE_URL}/pokemon/${id}`);
const getSpecies = (id) => fetchJson(`${BASE_URL}/pokemon-species/${id}`);
const getMove = (id) => fetchJson(`${BASE_URL}/move/${id}`);
const getAbility = (id) => fetchJson(`${BASE_URL}/ability/${id}`);
const getItem = (id) => fetchJson(`${BASE_URL}/item/${id}`);
const getEvolutionChain = (url) => fetchJson(url);
const getType = (id) => fetchJson(`${BASE_URL}/type/${id}`);

function idFromUrl(url = '') {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

function formatName(value = '') {
  return value
    .split('-')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
}

function artworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function shinyArtworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
}

function cleanText(value = '') {
  return value.replace(/[\n\f\r]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function localName(resource, fallback) {
  return resource?.names?.find((entry) => entry.language.name === 'es')?.name ?? fallback;
}

async function buildTypeMap() {
  const typeMap = new Map();

  await mapLimit(TYPE_ORDER, 4, async (type) => {
    const data = await getType(type);
    for (const entry of data.pokemon ?? []) {
      const name = entry.pokemon.name;
      if (!typeMap.has(name)) typeMap.set(name, new Set());
      typeMap.get(name).add(type);
    }
  });

  return typeMap;
}

async function resolveTypes(typeMap, pokemonId, pokemonName) {
  const known = typeMap.get(pokemonName);
  if (known?.size) {
    return [...known].sort((a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b));
  }

  const pokemon = await getPokemon(pokemonId);
  return pokemon.types.map((slot) => slot.type.name);
}

function evolutionMethodLabel(method, itemNames, moveNames, locationName) {
  const trigger = method.trigger?.name ?? 'special';
  const parts = [];

  if (trigger === 'level-up') {
    if (method.min_level != null) parts.push(`Nivel ${method.min_level}`);
    if (method.min_happiness != null) parts.push(`Felicidad ≥ ${method.min_happiness}`);
    if (method.min_beauty != null) parts.push(`Belleza ≥ ${method.min_beauty}`);
    if (method.known_move?.name) parts.push(`Conocer ${moveNames.get(method.known_move.name) ?? formatName(method.known_move.name)}`);
    if (method.known_move_type?.name) parts.push(`Conocer un movimiento de tipo ${formatName(method.known_move_type.name)}`);
    if (method.location?.name) {
      parts.push(
        `En ${
          locationName?.(method.location.name) ?? formatName(method.location.name)
        }`,
      );
    }
    if (method.held_item?.name) parts.push(`Con ${itemNames.get(method.held_item.name) ?? formatName(method.held_item.name)}`);
    if (method.time_of_day) {
      const time = method.time_of_day === 'day' ? 'De día' : method.time_of_day === 'night' ? 'De noche' : method.time_of_day;
      parts.push(time);
    }
    if (method.party_species?.name) parts.push(`Con ${formatName(method.party_species.name)} en el equipo`);
    if (method.party_type?.name) parts.push(`Con un Pokémon de tipo ${formatName(method.party_type.name)}`);
  } else if (trigger === 'use-item') {
    parts.push(
      method.item?.name
        ? `Usar ${itemNames.get(method.item.name) ?? formatName(method.item.name)}`
        : 'Usar un objeto',
    );
  } else if (trigger === 'trade') {
    parts.push('Intercambio');
    if (method.held_item?.name) {
      parts.push(`Con ${itemNames.get(method.held_item.name) ?? formatName(method.held_item.name)}`);
    }
    if (method.trade_species?.name) parts.push(`Por ${formatName(method.trade_species.name)}`);
  } else {
    parts.push(formatName(trigger));
  }

  return parts.join(' · ');
}

function isMethodApplicable(method, game) {
  if (
    method.version_group?.name &&
    !VERSION_GROUPS_BY_GENERATION.get(game.generation)?.has(method.version_group.name)
  ) {
    return false;
  }

  if (NO_CLOCK_GAMES.has(game.id) && method.time_of_day) return false;
  if (NO_BEAUTY_GAMES.has(game.id) && method.min_beauty != null) return false;

  // Las evoluciones por localización de Gen IV usan lugares de Sinnoh.
  // HeartGold/SoulSilver no tienen acceso a Bosque Vetusta, Monte Corónet ni Ruta 217.
  if (game.id === 'heartgold-soulsilver' && method.location?.name) return false;

  return true;
}

function buildEvolutionTree(node, game, context, speciesById) {
  const species = speciesById.get(idFromUrl(node.species.url));
  const details = (node.evolution_details ?? []).filter((method) =>
    isMethodApplicable(method, game),
  );

  const methods = [
    ...new Set(
      details
        .map((method) =>
          evolutionMethodLabel(
            method,
            context.itemNames,
            context.moveNames,
            context.locationName,
          ),
        )
        .filter(Boolean),
    ),
  ];

  const children = (node.evolves_to ?? [])
    .map((child) => buildEvolutionTree(child, game, context, speciesById))
    .filter(Boolean);

  // Si una rama no tiene métodos aplicables y no es la raíz, se omite.
  if (node.evolution_details?.length > 0 && methods.length === 0) return null;

  return {
    speciesId: species?.speciesId ?? 0,
    pokemonId: species?.pokemonId ?? 0,
    nationalNumber: species?.nationalNumber ?? 0,
    name: species?.name ?? formatName(node.species.name),
    image: species?.image ?? '',
    types: species?.types ?? [],
    inGameDex: context.gameSpeciesIds.has(species?.speciesId),
    methods,
    children,
  };
}

async function buildSpeciesContext(speciesId, entry, typeMap) {
  const species = await getSpecies(speciesId);
  const variety = species.varieties.find((item) => item.is_default) ?? species.varieties[0];
  const pokemonId = idFromUrl(variety.pokemon.url);
  const pokemon = await getPokemon(pokemonId);
  const types = entry?.types?.length
    ? entry.types
    : await resolveTypes(typeMap, pokemonId, variety.pokemon.name);
  const name = localName(species, formatName(species.name));
  const genus = species.genera?.find((item) => item.language.name === 'es')?.genus
    ?? species.genera?.find((item) => item.language.name === 'en')?.genus
    ?? '';
  const flavorEntry = species.flavor_text_entries?.find((item) => item.language.name === 'es')
    ?? species.flavor_text_entries?.find((item) => item.language.name === 'en');
  const flavor = flavorEntry ? cleanText(flavorEntry.flavor_text) : '';

  return {
    species,
    pokemon,
    pokemonId,
    types,
    name,
    genus,
    flavor,
    image: artworkUrl(pokemonId),
  };
}

async function buildGame(game, typeMap, speciesDataCache, moveCache, abilityCache, itemCache) {
  const pokedex = JSON.parse(
    await readFile(path.join(DATA_DIR, 'pokedex', `${game.id}.json`), 'utf8'),
  );
  const routesData = JSON.parse(
    await readFile(path.join(DATA_DIR, 'routes', `${game.id}.json`), 'utf8'),
  );
  const areaNameById = new Map();
  for (const location of routesData.locations) {
    for (const areaId of location.subAreas) {
      areaNameById.set(areaId, location.name);
    }
  }
  const extraAreaNames = {
    'kanto-altering-cave-area': 'Cueva Cambiante',
    'hoenn-altering-cave-area': 'Cueva Cambiante',
    'johto-altering-cave-area': 'Cueva Cambiante',
    'kanto-pokecenter-area': 'Centro Pokémon',
    'hoenn-pokecenter-area': 'Centro Pokémon',
    'johto-pokecenter-area': 'Centro Pokémon',
    'roaming-hoenn-area': 'Hoenn errante',
    'roaming-hoenn': 'Hoenn errante',
    'roaming-johto-area': 'Johto errante',
    'roaming-johto': 'Johto errante',
    'roaming-sinnoh-area': 'Sinnoh errante',
    'roaming-sinnoh': 'Sinnoh errante',
    'sinnoh-pokemart-area': 'Tienda Pokémon',
  };
  for (const [areaId, name] of Object.entries(extraAreaNames)) {
    areaNameById.set(areaId, name);
  }
  const entries = pokedex.entries;
  const versionGroup = game.id;
  const moveNames = new Map();
  const itemNames = new Map();

  const speciesIds = new Set(entries.map((entry) => entry.speciesId));
  const gameSpeciesIds = speciesIds;

  // Metadatos de especies de las cadenas evolutivas (incluye especies fuera del dex).
  const chainSpeciesIds = new Set();
  const chainItems = new Set();
  const chainMoves = new Set();

  await mapLimit(entries, CONCURRENCY, async (entry) => {
    const species = await getSpecies(entry.speciesId);
    const url = species.evolution_chain?.url;
    if (!url) return;
    const chain = await getEvolutionChain(url);
    const walk = (node) => {
      chainSpeciesIds.add(idFromUrl(node.species.url));
      for (const detail of node.evolution_details ?? []) {
        if (detail.item?.name) chainItems.add(detail.item.name);
        if (detail.held_item?.name) chainItems.add(detail.held_item.name);
        if (detail.known_move?.name) chainMoves.add(detail.known_move.name);
      }
      for (const child of node.evolves_to ?? []) walk(child);
    };
    walk(chain.chain);
  });

  await mapLimit([...chainItems], 4, async (itemName) => {
    if (itemCache.has(itemName) && itemCache.get(itemName) != null) return;
    const data = await getItem(itemName);
    itemCache.set(itemName, localName(data, formatName(data.name)));
  });
  await mapLimit([...chainMoves], 4, async (moveName) => {
    if (moveCache.has(moveName)) return;
    const data = await getMove(moveName);
    moveCache.set(moveName, {
      id: data.id,
      name: localName(data, formatName(data.name)),
      type: data.type?.name ?? 'normal',
      damageClass: data.damage_class?.name ?? null,
      power: data.power,
      accuracy: data.accuracy,
      pp: data.pp,
    });
  });

  for (const [name, value] of itemCache.entries()) {
    if (value != null) itemNames.set(name, value);
  }
  for (const [name, value] of moveCache.entries()) {
    if (value != null) moveNames.set(name, value.name);
  }

  const speciesById = new Map();
  for (const speciesId of new Set([...speciesIds, ...chainSpeciesIds])) {
    const cached = speciesDataCache.get(speciesId);
    if (cached) {
      speciesById.set(speciesId, cached);
      continue;
    }
    const species = await getSpecies(speciesId);
    const variety = species.varieties.find((item) => item.is_default) ?? species.varieties[0];
    const pokemonId = idFromUrl(variety.pokemon.url);
    const types = await resolveTypes(typeMap, pokemonId, variety.pokemon.name);
    const meta = {
      speciesId,
      pokemonId,
      nationalNumber: species.id,
      name: localName(species, formatName(species.name)),
      image: artworkUrl(pokemonId),
      types,
    };
    speciesDataCache.set(speciesId, meta);
    speciesById.set(speciesId, meta);
  }

  const gameSpecies = new Map(entries.map((entry) => [entry.speciesId, entry]));

  const entriesWithDetails = await mapLimit(entries, CONCURRENCY, async (entry, index) => {
    const context = await buildSpeciesContext(entry.speciesId, entry, typeMap);
    const pokemon = context.pokemon;

    const levelMoves = [];
    const tmMoveNames = new Map();
    const tutorMoveNames = new Map();

    async function resolveMove(moveId, moveName) {
      if (!moveCache.has(moveName)) {
        const data = await getMove(moveName);
        moveCache.set(moveName, {
          id: data.id,
          name: localName(data, formatName(data.name)),
          type: data.type?.name ?? 'normal',
          damageClass: data.damage_class?.name ?? null,
          power: data.power,
          accuracy: data.accuracy,
          pp: data.pp,
        });
      }
      const meta = moveCache.get(moveName);
      moveNames.set(moveName, meta.name);
      return {
        moveId: meta.id,
        name: meta.name,
        type: meta.type,
        damageClass: meta.damageClass,
        power: meta.power,
        accuracy: meta.accuracy,
        pp: meta.pp,
      };
    }

    for (const moveEntry of pokemon.moves ?? []) {
      const moveId = idFromUrl(moveEntry.move.url);
      for (const detail of moveEntry.version_group_details ?? []) {
        if (detail.version_group.name !== versionGroup) continue;

        const method = detail.move_learn_method.name;
        if (method === 'level-up') {
          levelMoves.push({
            moveId,
            moveName: moveEntry.move.name,
            level: detail.level_learned_at ?? 0,
          });
        } else if (method === 'machine') {
          tmMoveNames.set(moveId, moveEntry.move.name);
        } else if (method === 'tutor') {
          tutorMoveNames.set(moveId, moveEntry.move.name);
        }
      }
    }

    const uniqueMoves = new Map();
    for (const move of levelMoves) {
      const key = `${move.moveId}-${move.level}`;
      if (!uniqueMoves.has(key)) uniqueMoves.set(key, move);
    }

    const learnset = [];
    for (const move of uniqueMoves.values()) {
      const meta = await resolveMove(move.moveId, move.moveName);
      learnset.push({ level: move.level, ...meta });
    }
    learnset.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, 'es'));

    const tmMoves = [];
    for (const [moveId, moveName] of tmMoveNames.entries()) {
      tmMoves.push(await resolveMove(moveId, moveName));
    }
    tmMoves.sort((a, b) => a.name.localeCompare(b.name, 'es'));

    const tutorMoves = [];
    for (const [moveId, moveName] of tutorMoveNames.entries()) {
      tutorMoves.push(await resolveMove(moveId, moveName));
    }
    tutorMoves.sort((a, b) => a.name.localeCompare(b.name, 'es'));

    const abilities = [];
    if (game.generation >= 3) {
      for (const abilityEntry of pokemon.abilities ?? []) {
        // Las habilidades ocultas se introdujeron en la Generación V.
        if (abilityEntry.is_hidden && game.generation < 5) continue;

        const abilityName = abilityEntry.ability.name;
        if (!abilityCache.has(abilityName)) {
          const data = await getAbility(abilityName);
          abilityCache.set(abilityName, localName(data, formatName(data.name)));
        }
        abilities.push({
          name: abilityCache.get(abilityName),
          hidden: abilityEntry.is_hidden,
        });
      }
    }

    const stats = (pokemon.stats ?? []).map((stat) => ({
      name: stat.stat.name,
      value: stat.base_stat,
    }));

    let evolutions = null;
    const species = context.species;
    const chainUrl = species.evolution_chain?.url;
    if (chainUrl) {
      const chain = await getEvolutionChain(chainUrl);
      evolutions = buildEvolutionTree(
        chain.chain,
        game,
        { itemNames, moveNames, gameSpeciesIds, locationName: (id) => getLocationMeta(id).name },
        speciesById,
      );
    }

    const regionalNumbers = entry.regionalNumbers ?? [];
    const availability = Object.fromEntries(
      Object.entries(entry.availability ?? {}).map(([versionId, versionData]) => [
        versionId,
        {
          ...versionData,
          locations: (versionData.locations ?? []).map((location) => ({
            ...location,
            areaName: areaNameById.get(location.areaId) ?? location.areaName,
            areaNameFallback: areaNameById.has(location.areaId)
              ? false
              : location.areaNameFallback,
          })),
        },
      ]),
    );
    const progress = (index + 1) % 25 === 0
      ? `  ${index + 1}/${entries.length}`
      : null;
    if (progress) console.log(progress);

    return {
      datasetVersion: 'v1',
      generatedAt: new Date().toISOString(),
      gameId: game.id,
      gameName: game.name,
      gameShortName: game.shortName,
      generation: game.generation,
      versionGroup,
      speciesId: context.species.id,
      slug: context.species.name,
      pokemonId: context.pokemonId,
      nationalNumber: context.species.id,
      name: context.name,
      genus: context.genus,
      flavor: context.flavor,
      types: context.types,
      image: context.image,
      shinyImage: shinyArtworkUrl(context.pokemonId),
      height: pokemon.height,
      weight: pokemon.weight,
      baseExperience: pokemon.base_experience,
      abilities,
      stats,
      regionalNumbers,
      availability,
      methods: entry.methods,
      exclusiveTo: entry.exclusiveTo,
      exclusiveNote: entry.exclusiveNote,
      hasConfirmedAvailability: entry.hasConfirmedAvailability,
      learnset,
      tmMoves,
      tutorMoves,
      evolutions,
      isInGameDex: true,
    };
  });

  // Resolver objetos evolutivos restantes (por si alguno no se recolectó antes).
  for (const [itemName, value] of itemCache.entries()) {
    if (value == null) {
      const data = await getItem(itemName);
      itemCache.set(itemName, localName(data, formatName(data.name)));
    }
  }
  for (const [name, value] of itemCache.entries()) itemNames.set(name, value);

  return entriesWithDetails;
}

async function main() {
  const gamesDataset = JSON.parse(await readFile(path.join(DATA_DIR, 'games.json'), 'utf8'));
  const games = gamesDataset.games.filter((game) => GAME_IDS.includes(game.id));

  if (games.length !== GAME_IDS.length) {
    throw new Error('No se encontraron todos los juegos con fichas en games.json');
  }

  console.log('Generando fichas de Pokémon por juego...');
  console.log('Cargando tipos...');
  const typeMap = await buildTypeMap();
  const speciesDataCache = new Map();
  const moveCache = new Map();
  const abilityCache = new Map();
  const itemCache = new Map();
  const manifestGames = [];
  const speciesIndex = new Map();

  for (const game of games) {
    console.log(`\n${game.name}`);
    const entries = await buildGame(game, typeMap, speciesDataCache, moveCache, abilityCache, itemCache);
    const gameDir = path.join(OUTPUT_DIR, game.id);
    await mkdir(gameDir, { recursive: true });

    for (const entry of entries) {
      await writeFile(
        path.join(gameDir, `${entry.speciesId}.json`),
        JSON.stringify(entry),
      );

      if (!speciesIndex.has(entry.speciesId)) speciesIndex.set(entry.speciesId, []);
      speciesIndex.get(entry.speciesId).push({
        gameId: game.id,
        gameName: game.name,
        shortName: game.shortName,
        generation: game.generation,
        regionalNumbers: entry.regionalNumbers.map(({ dexId, dexName, number }) => ({
          dexId,
          dexName,
          number,
        })),
      });
    }
    manifestGames.push({
      gameId: game.id,
      name: game.name,
      entryCount: entries.length,
    });

    if (game.id === 'firered-leafgreen') {
      const eevee = entries.find((entry) => entry.speciesId === 133);
      const names = (eevee?.evolutions?.children ?? []).map((child) => child.name);
      if (names.includes('Espeon') || names.includes('Umbreon')) {
        throw new Error('RFVH no debería incluir Espeon/Umbreon (no hay reloj interno)');
      }
    }

    if (game.id === 'emerald') {
      const eevee = entries.find((entry) => entry.speciesId === 133);
      if (eevee) {
        const names = (eevee.evolutions?.children ?? []).map((child) => child.name);
        if (!names.includes('Espeon') || !names.includes('Umbreon')) {
          throw new Error('Esmeralda debería incluir Espeon/Umbreon para Eevee');
        }
      }
    }

    if (game.generation === 1) {
      const eevee = entries.find((entry) => entry.speciesId === 133);
      const names = (eevee?.evolutions?.children ?? []).map((child) => child.name);
      if (names.includes('Espeon') || names.includes('Umbreon')) {
        throw new Error(`${game.id} no debería incluir evoluciones de Generación II`);
      }
    }

    if (['gold-silver', 'crystal', 'ruby-sapphire'].includes(game.id)) {
      const eevee = entries.find((entry) => entry.speciesId === 133);
      if (eevee) {
        const names = (eevee.evolutions?.children ?? []).map((child) => child.name);
        if (!names.includes('Espeon') || !names.includes('Umbreon')) {
          throw new Error(`${game.id} debería incluir Espeon/Umbreon para Eevee`);
        }
      }
    }

    if (game.generation === 4) {
      const eevee = entries.find((entry) => entry.speciesId === 133);
      if (eevee) {
        const names = (eevee.evolutions?.children ?? []).map((child) => child.name);
        const expected =
          game.id === 'heartgold-soulsilver'
            ? ['Espeon', 'Umbreon']
            : ['Espeon', 'Umbreon', 'Leafeon', 'Glaceon'];
        const missing = expected.filter((name) => !names.includes(name));
        if (missing.length) {
          throw new Error(`${game.id} debería incluir evoluciones de Eevee: ${missing.join(', ')}`);
        }
        if (
          game.id === 'heartgold-soulsilver' &&
          (names.includes('Leafeon') || names.includes('Glaceon'))
        ) {
          throw new Error('HGSS no debería incluir Leafeon/Glaceon: sus rocas están en Sinnoh');
        }
      }
    }

    if (game.generation < 5) {
      const hidden = entries.flatMap((entry) =>
        entry.abilities.filter((ability) => ability.hidden),
      );
      if (hidden.length) {
        throw new Error(`${game.id} no debería incluir habilidades ocultas (Gen V)`);
      }
    }

    const missingLearnset = entries.filter((entry) => entry.learnset.length === 0);
    if (missingLearnset.length > 0) {
      console.warn(
        `  Aviso: ${missingLearnset.length} especies sin learnset por nivel: ${missingLearnset
          .slice(0, 8)
          .map((entry) => entry.name)
          .join(', ')}`,
      );
    }

    console.log(`  ${entries.length} fichas generadas en public/data/v1/pokemon/${game.id}/`);
  }

  await writeFile(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(
      {
        datasetVersion: 'v1',
        generatedAt: new Date().toISOString(),
        source: BASE_URL,
        games: manifestGames,
        note: 'Fichas individuales en pokemon/{gameId}/{speciesId}.json',
      },
      null,
      2,
    ),
  );

  await writeFile(
    path.join(OUTPUT_DIR, 'index.json'),
    JSON.stringify({
      datasetVersion: 'v1',
      generatedAt: new Date().toISOString(),
      source: BASE_URL,
      species: Object.fromEntries(
        [...speciesIndex.entries()].sort(([a], [b]) => Number(a) - Number(b)),
      ),
    }),
  );

  console.log('\nFichas generadas en public/data/v1/pokemon/');
  console.log(`Índice de versiones: ${speciesIndex.size} especies.`);
}

main().catch((error) => {
  console.error('\nError generando fichas de Pokémon:', error);
  process.exitCode = 1;
});
