import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURATED_EXCLUSIVES, PILOT_GAME_IDS } from './pilots.config.mjs';
import { TYPE_ORDER } from '../src/data/types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CACHE_DIR = path.join(ROOT, '.cache', 'pokeapi');
const DATA_DIR = path.join(ROOT, 'public', 'data', 'v1');
const OUTPUT_DIR = path.join(DATA_DIR, 'pokedex');
const BASE_URL = 'https://pokeapi.co/api/v2';
const CONCURRENCY = 4;
const METHOD_ORDER = ['wild', 'gift', 'static', 'trade', 'other'];

const WILD_METHODS = new Set([
  'walk',
  'surf',
  'old-rod',
  'good-rod',
  'super-rod',
  'rock-smash',
  'headbutt',
  'headbutt-low',
  'headbutt-normal',
  'headbutt-high',
  'seaweed',
  'dark-grass',
  'grass-spots',
  'cave-spots',
  'bridge-spots',
  'super-rod-spots',
  'surf-spots',
  'yellow-flowers',
  'purple-flowers',
  'red-flowers',
  'rough-terrain',
  'roaming-grass',
  'roaming-water',
  'devon-scope',
  'feebas-tile-fishing',
  'island-scan',
  'sos',
  'bubbling-spots',
  'berry-trees',
  'hidden-grotto',
  'honey-tree',
  'overworld',
  'overworld-water',
  'overworld-flying',
  'overworld-special',
  'overworld-flying-special',
  'overworld-water-special',
  'horde',
  'wanderer',
  'wanderer-water',
  'chase-water',
  'dynamax-adventure',
  'max-raid',
  'sos-from-bubbling-spot',
  'pokeflute',
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
    // Sin caché: se descarga.
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
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }
  }

  throw lastError;
}

const getPokedex = (id) => fetchJson(`${BASE_URL}/pokedex/${id}`);
const getSpecies = (id) => fetchJson(`${BASE_URL}/pokemon-species/${id}`);
const getEncounters = (id) => fetchJson(`${BASE_URL}/pokemon/${id}/encounters`);
const getPokemon = (id) => fetchJson(`${BASE_URL}/pokemon/${id}`);
const getType = (name) => fetchJson(`${BASE_URL}/type/${name}`);

function formatName(value = '') {
  return value
    .split('-')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
}

function idFromUrl(url = '') {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

function artworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function methodGroup(method) {
  if (WILD_METHODS.has(method)) return method === 'pokeflute' ? 'static' : 'wild';
  if (method === 'gift' || method === 'gift-egg') return 'gift';
  if (method === 'static' || method === 'pokeflute' || method === 'squirt-bottle') return 'static';
  if (method === 'npc-trade' || method === 'trade') return 'trade';
  return 'other';
}

function sortMethods(methods) {
  return [...methods].sort((a, b) => METHOD_ORDER.indexOf(a) - METHOD_ORDER.indexOf(b));
}

function areaInfo(areaId) {
  const route = areaId.match(
    /^(kanto|hoenn|paldea|kitakami|blueberry|johto|sinnoh|unova|kalos|alola|galar)-route-(\d+)-area$/,
  );

  if (route) {
    return { name: `Ruta ${Number(route[2])}`, fallback: false };
  }

  return {
    name: formatName(areaId.replace(/-area$/, '')),
    fallback: true,
  };
}

function buildVersionIndex(game) {
  const baseVersions = game.versions.map((version) => ({
    id: version.id,
    name: version.name,
    baseId: version.id,
    contentId: 'base',
    contentName: 'Juego base',
  }));

  const dlcVersions = game.dlc.flatMap((expansion) =>
    expansion.versions.map((version) => {
      const base = baseVersions.find((candidate) => version.id.endsWith(`-${candidate.id}`));
      return {
        id: version.id,
        name: version.name,
        baseId: base?.id ?? version.id,
        contentId: expansion.id,
        contentName: expansion.shortName,
      };
    }),
  );

  return [...baseVersions, ...dlcVersions];
}

function processEncounters(encounters, versionIndex) {
  const byBaseVersion = new Map(
    versionIndex
      .filter((version) => version.contentId === 'base')
      .map((version) => [version.id, []]),
  );
  const seen = new Map();

  for (const area of encounters) {
    for (const versionDetail of area.version_details ?? []) {
      const version = versionIndex.find((candidate) => candidate.id === versionDetail.version.name);
      if (!version) continue;

      for (const detail of versionDetail.encounter_details ?? []) {
        const info = areaInfo(area.location_area.name);
        const location = {
          areaId: area.location_area.name,
          areaName: info.name,
          areaNameFallback: info.fallback,
          method: detail.method.name,
          methodGroup: methodGroup(detail.method.name),
          minLevel: detail.min_level,
          maxLevel: detail.max_level,
          chance: detail.chance ?? versionDetail.max_chance ?? null,
          versionId: version.id,
          versionName: version.name,
          baseVersionId: version.baseId,
          contentId: version.contentId,
          contentName: version.contentName,
          conditions: (detail.condition_values ?? []).map((condition) => condition.name),
        };

        const key = [
          location.baseVersionId,
          location.areaId,
          location.method,
          location.minLevel,
          location.maxLevel,
          location.contentId,
        ].join('|');

        const existing = seen.get(key);
        if (existing) {
          existing.chance = Math.max(existing.chance ?? 0, location.chance ?? 0);
          existing.conditions = [...new Set([...existing.conditions, ...location.conditions])];
        } else {
          seen.set(key, location);
          byBaseVersion.get(version.baseId)?.push(location);
        }
      }
    }
  }

  for (const locations of byBaseVersion.values()) {
    locations.sort(
      (a, b) =>
        a.areaName.localeCompare(b.areaName, 'es') ||
        a.minLevel - b.minLevel ||
        a.method.localeCompare(b.method),
    );
  }

  return byBaseVersion;
}

function validatePilot(pilot) {
  const errors = [];
  const speciesIds = new Set();
  const missingTypes = [];
  const missingSpanish = [];

  for (const entry of pilot.entries) {
    if (speciesIds.has(entry.speciesId)) errors.push(`Especie duplicada: ${entry.speciesId}`);
    speciesIds.add(entry.speciesId);

    if (!entry.regionalNumbers.length) errors.push(`${entry.name}: sin número regional`);
    if (!entry.types.length) missingTypes.push(entry.name);
    if (!entry.name) errors.push(`${entry.speciesId}: sin nombre`);
    if (!entry.namesSpanish) missingSpanish.push(entry.name);
    if (entry.exclusiveTo.length > 1) errors.push(`${entry.name}: exclusivo de más de una versión`);
  }

  if (missingTypes.length) errors.push(`Sin tipos: ${missingTypes.slice(0, 12).join(', ')}`);

  const bySlug = (slug) => pilot.entries.find((entry) => entry.slug === slug);

  if (pilot.gameId === 'firered-leafgreen') {
    const ekans = bySlug('ekans');
    const vulpix = bySlug('vulpix');
    if (!ekans || ekans.exclusiveTo.join(',') !== 'firered') {
      errors.push('RFVH: se esperaba Ekans exclusivo de Rojo Fuego');
    }
    if (!vulpix || vulpix.exclusiveTo.join(',') !== 'leafgreen') {
      errors.push('RFVH: se esperaba Vulpix exclusivo de Verde Hoja');
    }
    if (pilot.exclusiveCount < 10) errors.push('RFVH: se esperaban al menos 10 exclusivos');
  }

  if (pilot.gameId === 'emerald' && pilot.exclusiveCount !== 0) {
    errors.push('Esmeralda: no debería tener exclusividades de pareja');
  }

  if (pilot.gameId === 'red-blue') {
    const ekans = bySlug('ekans');
    const vulpix = bySlug('vulpix');
    if (!ekans || ekans.exclusiveTo.join(',') !== 'red') {
      errors.push('Rojo/Azul: se esperaba Ekans exclusivo de Rojo');
    }
    if (!vulpix || vulpix.exclusiveTo.join(',') !== 'blue') {
      errors.push('Rojo/Azul: se esperaba Vulpix exclusivo de Azul');
    }
    if (pilot.exclusiveCount !== 22) {
      errors.push(`Rojo/Azul: se esperaban 22 exclusivos y hay ${pilot.exclusiveCount}`);
    }
  }

  if (pilot.gameId === 'yellow' && pilot.exclusiveCount !== 0) {
    errors.push('Amarillo: no debería tener exclusividades de pareja');
  }

  if (pilot.gameId === 'gold-silver') {
    const spinarak = bySlug('spinarak');
    const ledyba = bySlug('ledyba');
    if (!spinarak || spinarak.exclusiveTo.join(',') !== 'gold') {
      errors.push('Oro/Plata: se esperaba Spinarak exclusivo de Oro');
    }
    if (!ledyba || ledyba.exclusiveTo.join(',') !== 'silver') {
      errors.push('Oro/Plata: se esperaba Ledyba exclusivo de Plata');
    }
    if (pilot.exclusiveCount !== 20) {
      errors.push(`Oro/Plata: se esperaban 20 exclusivos y hay ${pilot.exclusiveCount}`);
    }
  }

  if (pilot.gameId === 'crystal' && pilot.exclusiveCount !== 0) {
    errors.push('Cristal: no debería tener exclusividades de pareja');
  }

  if (pilot.gameId === 'ruby-sapphire') {
    const seedot = bySlug('seedot');
    const lotad = bySlug('lotad');
    if (!seedot || seedot.exclusiveTo.join(',') !== 'ruby') {
      errors.push('Rubí/Zafiro: se esperaba Seedot exclusivo de Rubí');
    }
    if (!lotad || lotad.exclusiveTo.join(',') !== 'sapphire') {
      errors.push('Rubí/Zafiro: se esperaba Lotad exclusivo de Zafiro');
    }
    if (pilot.exclusiveCount !== 14) {
      errors.push(`Rubí/Zafiro: se esperaban 14 exclusivos y hay ${pilot.exclusiveCount}`);
    }
  }

  if (pilot.gameId === 'diamond-pearl') {
    const stunky = bySlug('stunky');
    const glameow = bySlug('glameow');
    if (!stunky || stunky.exclusiveTo.join(',') !== 'diamond') {
      errors.push('Diamante/Perla: se esperaba Stunky exclusivo de Diamante');
    }
    if (!glameow || glameow.exclusiveTo.join(',') !== 'pearl') {
      errors.push('Diamante/Perla: se esperaba Glameow exclusivo de Perla');
    }
    if (pilot.exclusiveCount !== 14) {
      errors.push(`Diamante/Perla: se esperaban 14 exclusivos en la dex y hay ${pilot.exclusiveCount}`);
    }
  }

  if (pilot.gameId === 'platinum' && pilot.exclusiveCount !== 0) {
    errors.push('Platino: no debería tener exclusividades de pareja');
  }

  if (pilot.gameId === 'heartgold-soulsilver') {
    const spinarak = bySlug('spinarak');
    const ledyba = bySlug('ledyba');
    if (!spinarak || spinarak.exclusiveTo.join(',') !== 'heartgold') {
      errors.push('HGSS: se esperaba Spinarak exclusivo de HeartGold');
    }
    if (!ledyba || ledyba.exclusiveTo.join(',') !== 'soulsilver') {
      errors.push('HGSS: se esperaba Ledyba exclusivo de SoulSilver');
    }
    if (pilot.exclusiveCount !== 24) {
      errors.push(`HGSS: se esperaban 24 exclusivos en la dex y hay ${pilot.exclusiveCount}`);
    }
  }

  if (pilot.gameId === 'scarlet-violet') {
    const expected = {
      armarouge: 'scarlet',
      ceruledge: 'violet',
      gligar: 'scarlet',
      aipom: 'violet',
    };

    for (const [slug, version] of Object.entries(expected)) {
      const entry = bySlug(slug);
      if (!entry || entry.exclusiveTo.join(',') !== version) {
        errors.push(`SV: se esperaba ${slug} exclusivo de ${version}`);
      }
    }

    if (pilot.exclusiveCount < 20) errors.push('SV: se esperaban al menos 20 exclusivos curados');
    if (pilot.encounterDataAvailable) {
      errors.push('SV: PokéAPI no debería tener encuentros publicados');
    }
  }

  const curated = CURATED_EXCLUSIVES[pilot.gameId];
  if (curated) {
    const curatedSlugs = Object.values(curated.versions).flat();
    const missingCurated = curatedSlugs.filter((slug) => !bySlug(slug));
    if (missingCurated.length) {
      console.warn(
        `  Aviso ${pilot.gameId}: especies curadas fuera del dex: ${missingCurated.join(', ')}`,
      );
    }
  }

  if (missingSpanish.length) {
    console.warn(
      `  Aviso ${pilot.gameId}: sin nombre en español: ${missingSpanish.slice(0, 10).join(', ')}`,
    );
  }

  if (errors.length) {
    throw new Error(`Validación de ${pilot.gameId} fallida:\n- ${errors.join('\n- ')}`);
  }
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

async function buildPilot(game, typeMap) {
  console.log(`\nGenerando ${game.name}...`);

  const dexData = await mapLimit(game.pokedexes, 2, async (dex) => {
    const data = await getPokedex(dex.id);
    return { ...dex, data };
  });

  const speciesMap = new Map();

  dexData.forEach((dex, dexOrder) => {
    for (const entry of dex.data.pokemon_entries) {
      const speciesId = idFromUrl(entry.pokemon_species.url);
      if (!speciesMap.has(speciesId)) {
        speciesMap.set(speciesId, {
          speciesId,
          slug: entry.pokemon_species.name,
          dexEntries: [],
        });
      }
      speciesMap.get(speciesId).dexEntries.push({
        dexId: dex.id,
        dexName: dex.name,
        number: entry.entry_number,
        dexOrder,
      });
    }
  });

  const speciesList = [...speciesMap.values()];
  const baseVersions = game.versions;
  const versionIndex = buildVersionIndex(game);
  const curated = CURATED_EXCLUSIVES[game.id] ?? null;
  const usesCuratedExclusives = Boolean(curated);
  const skipEncounters = game.id === 'scarlet-violet';
  let processed = 0;

  const entries = await mapLimit(speciesList, CONCURRENCY, async (item) => {
    const species = await getSpecies(item.speciesId);
    const variety = species.varieties.find((entry) => entry.is_default) ?? species.varieties[0];
    const pokemonId = idFromUrl(variety.pokemon.url);
    const types = await resolveTypes(typeMap, pokemonId, variety.pokemon.name);
    const spanishName = species.names.find((entry) => entry.language.name === 'es')?.name;

    const locationsByBase = skipEncounters
      ? new Map()
      : processEncounters(await getEncounters(pokemonId), versionIndex);

    const availability = {};
    for (const version of baseVersions) {
      const locations = locationsByBase.get(version.id) ?? [];
      availability[version.id] = {
        known: !skipEncounters,
        methods: sortMethods(new Set(locations.map((location) => location.methodGroup))),
        locationCount: new Set(locations.map((location) => location.areaId)).size,
        locations,
      };
    }

    const entry = {
      speciesId: species.id,
      slug: species.name,
      pokemonId,
      nationalNumber: species.id,
      name: spanishName ?? formatName(species.name),
      namesSpanish: Boolean(spanishName),
      types,
      image: artworkUrl(pokemonId),
      regionalNumbers: item.dexEntries.sort(
        (a, b) => a.dexOrder - b.dexOrder || a.number - b.number,
      ),
      availability,
      methods: sortMethods(
        new Set(Object.values(availability).flatMap((version) => version.methods)),
      ),
      exclusiveTo: [],
      exclusiveNote: null,
      hasConfirmedAvailability: false,
    };

    processed += 1;
    if (processed % 50 === 0) {
      console.log(`  ${processed}/${speciesList.length} especies`);
    }

    return entry;
  });

  const totalLocations = entries.reduce(
    (total, entry) =>
      total +
      Object.values(entry.availability).reduce(
        (subtotal, version) => subtotal + version.locations.length,
        0,
      ),
    0,
  );
  const encounterDataAvailable = !skipEncounters && totalLocations > 0;

  for (const entry of entries) {
    if (!encounterDataAvailable) {
      for (const version of baseVersions) {
        entry.availability[version.id] = {
          known: false,
          methods: [],
          locationCount: 0,
          locations: [],
        };
      }
      entry.methods = [];
    }

    if (usesCuratedExclusives) {
      for (const [versionId, slugs] of Object.entries(curated.versions)) {
        if (slugs.includes(entry.slug)) entry.exclusiveTo.push(versionId);
      }
      entry.exclusiveNote = curated.notes?.[entry.slug] ?? null;
    } else if (encounterDataAvailable && baseVersions.length > 1) {
      const available = baseVersions
        .filter((version) => entry.availability[version.id].locationCount > 0)
        .map((version) => version.id);
      if (available.length === 1) entry.exclusiveTo = available;
    }

    entry.hasConfirmedAvailability = entry.methods.length > 0;
  }

  entries.sort(
    (a, b) =>
      a.regionalNumbers[0].dexOrder - b.regionalNumbers[0].dexOrder ||
      a.regionalNumbers[0].number - b.regionalNumbers[0].number,
  );

  const pilot = {
    datasetVersion: 'v1',
    generatedAt: new Date().toISOString(),
    source: BASE_URL,
    gameId: game.id,
    name: game.name,
    shortName: game.shortName,
    generation: game.generation,
    region: game.region,
    versions: baseVersions,
    dlc: game.dlc,
    pokedexes: game.pokedexes,
    encounterDataAvailable,
    exclusivitySource: usesCuratedExclusives
      ? 'curated'
      : encounterDataAvailable && baseVersions.length > 1
        ? 'encounters'
        : null,
    dataQuality: encounterDataAvailable ? 'complete' : 'partial',
    entryCount: entries.length,
    availableCount: entries.filter((entry) => entry.hasConfirmedAvailability).length,
    exclusiveCount: entries.filter((entry) => entry.exclusiveTo.length > 0).length,
    entries,
  };

  if (encounterDataAvailable) {
    pilot.dataQuality = 'complete';
  }

  validatePilot(pilot);
  return pilot;
}

async function main() {
  const gamesDataset = JSON.parse(await readFile(path.join(DATA_DIR, 'games.json'), 'utf8'));
  const pilots = gamesDataset.games.filter((game) => PILOT_GAME_IDS.includes(game.id));

  if (pilots.length !== PILOT_GAME_IDS.length) {
    throw new Error('No se encontraron todos los juegos piloto en games.json');
  }

  console.log(`Generando Pokédex de ${pilots.length} juegos piloto...`);
  console.log('Cargando tipos...');
  const typeMap = await buildTypeMap();

  const results = [];
  for (const game of pilots) {
    results.push(await buildPilot(game, typeMap));
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  for (const pilot of results) {
    await writeFile(
      path.join(OUTPUT_DIR, `${pilot.gameId}.json`),
      JSON.stringify(pilot),
    );
    console.log(
      `\n${pilot.shortName}: ${pilot.entryCount} especies · ${pilot.availableCount} con método confirmado · ${pilot.exclusiveCount} exclusivas · encuentros=${pilot.encounterDataAvailable}`,
    );
  }

  await writeFile(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(
      {
        datasetVersion: 'v1',
        generatedAt: new Date().toISOString(),
        source: BASE_URL,
        pilots: results.map((pilot) => ({
          gameId: pilot.gameId,
          name: pilot.name,
          entryCount: pilot.entryCount,
          availableCount: pilot.availableCount,
          exclusiveCount: pilot.exclusiveCount,
          encounterDataAvailable: pilot.encounterDataAvailable,
          exclusivitySource: pilot.exclusivitySource,
          dataQuality: pilot.dataQuality,
        })),
      },
      null,
      2,
    ),
  );

  console.log('\nPokédex de pilotos generada en public/data/v1/pokedex/');
}

main().catch((error) => {
  console.error('\nError generando la Pokédex:', error);
  process.exitCode = 1;
});
