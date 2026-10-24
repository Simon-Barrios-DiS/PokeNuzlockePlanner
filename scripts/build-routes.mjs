import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  EXCLUDED_LOCATIONS,
  KIND_ORDER,
  getLocationMeta,
} from './locations.es.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'public', 'data', 'v1');
const OUTPUT_DIR = path.join(DATA_DIR, 'routes');
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
const CONCURRENCY = 6;

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

const getLocationArea = (areaId) => fetchJson(`${BASE_URL}/location-area/${areaId}`);

function compareKind(a, b) {
  return KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind);
}

function compareLocation(a, b) {
  const kind = compareKind(a, b);
  if (kind !== 0) return kind;
  if (a.kind === 'route') {
    if (a.order != null && b.order != null) return a.order - b.order;
    if (a.order != null) return -1;
    if (b.order != null) return 1;
  }
  return a.name.localeCompare(b.name, 'es');
}

async function buildRoutes(game) {
  const pokedex = JSON.parse(
    await readFile(path.join(DATA_DIR, 'pokedex', `${game.id}.json`), 'utf8'),
  );

  const areaIds = new Set();
  for (const entry of pokedex.entries) {
    for (const version of Object.values(entry.availability)) {
      for (const location of version.locations) areaIds.add(location.areaId);
    }
  }

  const areaParents = new Map();
  await mapLimit([...areaIds], CONCURRENCY, async (areaId) => {
    const data = await getLocationArea(areaId);
    areaParents.set(areaId, data.location.name);
  });

  const locations = new Map();

  for (const entry of pokedex.entries) {
    for (const version of Object.values(entry.availability)) {
      for (const location of version.locations) {
        const locationId = areaParents.get(location.areaId);
        if (!locationId || EXCLUDED_LOCATIONS.has(locationId)) continue;

        const meta = getLocationMeta(locationId);
        if (!locations.has(locationId)) {
          locations.set(locationId, {
            locationId,
            name: meta.name,
            nameFallback: meta.fallback,
            kind: meta.kind,
            order: meta.order ?? null,
            subAreas: new Set(),
            methods: new Set(),
            versions: new Set(),
            species: new Set(),
            minLevel: null,
            maxLevel: null,
            encounters: new Map(),
          });
        }

        const area = locations.get(locationId);
        area.subAreas.add(location.areaId);
        area.methods.add(location.methodGroup);
        area.versions.add(location.baseVersionId);
        area.species.add(entry.speciesId);

        const minLevel = location.minLevel ?? null;
        const maxLevel = location.maxLevel ?? null;
        if (minLevel != null && (area.minLevel == null || minLevel < area.minLevel)) {
          area.minLevel = minLevel;
        }
        if (maxLevel != null && (area.maxLevel == null || maxLevel > area.maxLevel)) {
          area.maxLevel = maxLevel;
        }

        const encounterKey = [
          entry.speciesId,
          location.method,
          minLevel,
          maxLevel,
          location.methodGroup,
        ].join('|');

        let encounter = area.encounters.get(encounterKey);
        if (!encounter) {
          encounter = {
            speciesId: entry.speciesId,
            pokemonId: entry.pokemonId,
            nationalNumber: entry.nationalNumber,
            name: entry.name,
            types: entry.types,
            image: entry.image,
            exclusiveTo: entry.exclusiveTo,
            exclusiveNote: entry.exclusiveNote,
            method: location.method,
            methodGroup: location.methodGroup,
            minLevel,
            maxLevel,
            chance: location.chance ?? null,
            versions: new Set(),
            conditions: new Set(),
            subAreas: new Set(),
          };
          area.encounters.set(encounterKey, encounter);
        }

        encounter.versions.add(location.baseVersionId);
        encounter.subAreas.add(location.areaId);
        for (const condition of location.conditions) {
          encounter.conditions.add(condition);
        }
        if (location.chance != null) {
          encounter.chance = Math.max(encounter.chance ?? 0, location.chance);
        }
      }
    }
  }

  const routeList = [...locations.values()]
    .map((area) => ({
      locationId: area.locationId,
      name: area.name,
      nameFallback: area.nameFallback,
      kind: area.kind,
      order: area.order,
      subAreas: [...area.subAreas].sort(),
      methods: [...area.methods].sort(),
      versions: [...area.versions].sort(),
      minLevel: area.minLevel,
      maxLevel: area.maxLevel,
      speciesCount: area.species.size,
      encounterCount: area.encounters.size,
      encounters: [...area.encounters.values()]
        .map((encounter) => ({
          ...encounter,
          versions: [...encounter.versions].sort(),
          conditions: [...encounter.conditions].sort(),
          subAreas: [...encounter.subAreas].sort(),
        }))
        .sort(
          (a, b) =>
            a.minLevel - b.minLevel ||
            a.method.localeCompare(b.method) ||
            a.name.localeCompare(b.name, 'es'),
        ),
    }))
    .sort((a, b) => {
      // En Oro/Plata/Cristal, Johto es la aventura principal y Kanto es post-game.
      if (game.region.id === 'johto' && a.kind === 'route' && b.kind === 'route') {
        const aJohto = a.locationId.startsWith('johto-');
        const bJohto = b.locationId.startsWith('johto-');
        if (aJohto !== bJohto) return aJohto ? -1 : 1;
      }
      return compareLocation(a, b);
    });

  const numberedRouteCount = routeList.filter(
    (location) =>
      /^(kanto|hoenn|johto|sinnoh|unova|kalos|alola|galar)-route-\d+$/.test(location.locationId) ||
      /^kanto-sea-route-\d+$/.test(location.locationId) ||
      /^johto-sea-route-\d+$/.test(location.locationId) ||
      /^sinnoh-sea-route-\d+$/.test(location.locationId) ||
      /^unova-sea-route-\d+$/.test(location.locationId) ||
      /^kalos-sea-route-\d+$/.test(location.locationId) ||
      /^alola-sea-route-\d+$/.test(location.locationId) ||
      /^galar-sea-route-\d+$/.test(location.locationId),
  ).length;
  const routeCount = routeList.filter((location) => location.kind === 'route').length;
  const expectedRoutes = {
    'red-blue': 25,
    yellow: 25,
    'gold-silver': 45,
    crystal: 45,
    'ruby-sapphire': 34,
    'firered-leafgreen': 25,
    emerald: 34,
    'diamond-pearl': 30,
    platinum: 30,
    'heartgold-soulsilver': 47,
  }[game.id];

  if (expectedRoutes != null && numberedRouteCount !== expectedRoutes) {
    throw new Error(
      `${game.id}: se esperaban ${expectedRoutes} rutas numeradas y hay ${numberedRouteCount}`,
    );
  }
  if (numberedRouteCount === 0) {
    console.warn(`  Aviso ${game.id}: no se encontraron rutas numeradas en PokéAPI`);
  }
  if (!routeList.every((location) => location.encounters.length > 0)) {
    throw new Error(`${game.id}: hay localizaciones sin encuentros`);
  }
  const ids = new Set();
  for (const location of routeList) {
    if (ids.has(location.locationId)) {
      throw new Error(`${game.id}: localización duplicada ${location.locationId}`);
    }
    ids.add(location.locationId);
  }

  const coverageNote =
    game.id === 'omega-ruby-alpha-sapphire'
      ? 'PokéAPI solo publica encuentros para 17 de las 34 rutas de Hoenn. Mostramos esas rutas y el resto de localizaciones disponibles; la cobertura es parcial.'
      : null;

  return {
    datasetVersion: 'v1',
    generatedAt: new Date().toISOString(),
    source: BASE_URL,
    gameId: game.id,
    name: game.name,
    shortName: game.shortName,
    generation: game.generation,
    region: game.region,
    versions: game.versions,
    coverageNote,
    locationCount: routeList.length,
    areaCount: areaIds.size,
    routeCount,
    numberedRouteCount,
    locations: routeList,
  };
}

async function main() {
  const gamesDataset = JSON.parse(await readFile(path.join(DATA_DIR, 'games.json'), 'utf8'));
  const games = gamesDataset.games.filter((game) => GAME_IDS.includes(game.id));

  if (games.length !== GAME_IDS.length) {
    throw new Error('No se encontraron los juegos de tercera generación en games.json');
  }

  console.log('Generando rutas y encuentros de los juegos con datos...');

  const results = [];
  for (const game of games) {
    console.log(`- ${game.shortName}`);
    results.push(await buildRoutes(game));
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  for (const result of results) {
    await writeFile(
      path.join(OUTPUT_DIR, `${result.gameId}.json`),
      JSON.stringify(result),
    );
    console.log(
      `  ${result.shortName}: ${result.locationCount} localizaciones · ${result.routeCount} rutas · ${result.areaCount} áreas`,
    );
  }

  await writeFile(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(
      {
        datasetVersion: 'v1',
        generatedAt: new Date().toISOString(),
        source: BASE_URL,
        pilots: results.map((result) => ({
          gameId: result.gameId,
          name: result.name,
          locationCount: result.locationCount,
          routeCount: result.routeCount,
          numberedRouteCount: result.numberedRouteCount,
          areaCount: result.areaCount,
        })),
      },
      null,
      2,
    ),
  );

  console.log('\nRutas generadas en public/data/v1/routes/');
}

main().catch((error) => {
  console.error('\nError generando las rutas:', error);
  process.exitCode = 1;
});
