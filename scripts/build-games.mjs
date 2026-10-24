import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEX_NAMES, GAMES, REGIONS } from './games.config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CACHE_DIR = path.join(ROOT, '.cache', 'pokeapi');
const OUTPUT_DIR = path.join(ROOT, 'public', 'data', 'v1');
const BASE_URL = 'https://pokeapi.co/api/v2';
const CONCURRENCY = 4;

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
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} para ${url}`);
      }

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

function getVersionGroup(id) {
  return fetchJson(`${BASE_URL}/version-group/${id}`);
}

function getVersion(id) {
  return fetchJson(`${BASE_URL}/version/${id}`);
}

function getPokedex(id) {
  return fetchJson(`${BASE_URL}/pokedex/${id}`);
}

function spanishName(resource, fallback) {
  const name = resource?.names?.find((entry) => entry.language.name === 'es')?.name;
  return name ?? fallback;
}

function dexLabel(id, fallback) {
  return DEX_NAMES[id] ?? fallback ?? id;
}

async function buildGame(game) {
  const versionGroup = await getVersionGroup(game.id);

  const versions = await mapLimit(game.versions, CONCURRENCY, async (versionId) => {
    const version = await getVersion(versionId);
    return {
      id: version.name,
      name: spanishName(version, versionId),
    };
  });

  const pokedexes = await mapLimit(versionGroup.pokedexes, CONCURRENCY, async (dex) => {
    const data = await getPokedex(dex.name);
    return {
      id: data.id,
      name: dexLabel(dex.name, data.name),
      entryCount: data.pokemon_entries.length,
      species: data.pokemon_entries.map((entry) => entry.pokemon_species.name),
    };
  });

  const species = new Set(
    pokedexes.flatMap((dex) => dex.species),
  );

  const dlc = await mapLimit(game.dlc ?? [], 2, async (expansion) => {
    const dlcGroup = await getVersionGroup(expansion.id);
    const dexRefs = expansion.pokedexIds?.length
      ? dlcGroup.pokedexes.filter((dex) => expansion.pokedexIds.includes(dex.name))
      : dlcGroup.pokedexes;

    const dexes = await mapLimit(dexRefs, CONCURRENCY, async (dex) => {
      const data = await getPokedex(dex.name);
      return {
        id: data.id,
        name: dexLabel(dex.name, data.name),
        entryCount: data.pokemon_entries.length,
      };
    });

    const dlcVersions = await mapLimit(dlcGroup.versions, CONCURRENCY, async (versionRef) => {
      const version = await getVersion(versionRef.name);
      return {
        id: version.name,
        name: spanishName(version, versionRef.name),
      };
    });

    return {
      id: expansion.id,
      name: expansion.name,
      shortName: expansion.shortName ?? expansion.name,
      releaseYear: expansion.releaseYear,
      versions: dlcVersions,
      pokedexes: dexes,
    };
  });

  return {
    id: game.id,
    name: game.name,
    shortName: game.shortName,
    generation: game.generation,
    region: {
      id: game.region,
      name: REGIONS[game.region] ?? game.region,
    },
    releaseYear: game.releaseYear,
    versions,
    pokedexes: pokedexes.map(({ species: _species, ...dex }) => dex),
    speciesCount: species.size,
    dlc,
    dataQuality: 'partial',
    catalogOnly: true,
    pilot: Boolean(game.pilot),
    routesAvailable: Boolean(game.routes),
  };
}

function validateGames(games) {
  const errors = [];
  const ids = new Set();

  for (const game of games) {
    if (ids.has(game.id)) errors.push(`ID duplicado: ${game.id}`);
    ids.add(game.id);

    if (!game.name || !game.shortName) errors.push(`${game.id}: falta nombre`);
    if (!game.versions?.length) errors.push(`${game.id}: sin versiones`);
    if (!game.pokedexes?.length) errors.push(`${game.id}: sin dex`);
    if (!game.speciesCount) errors.push(`${game.id}: sin especies`);

    for (const dex of game.pokedexes ?? []) {
      if (!dex.name || !dex.entryCount) {
        errors.push(`${game.id}: dex inválida (${dex.id})`);
      }
    }

    for (const expansion of game.dlc ?? []) {
      if (!expansion.name || !expansion.pokedexes?.length) {
        errors.push(`${game.id}: DLC inválido (${expansion.id})`);
      }
      for (const dex of expansion.pokedexes ?? []) {
        if (!game.pokedexes.some((baseDex) => baseDex.id === dex.id)) {
          errors.push(`${game.id}: la dex ${dex.name} del DLC no está en la ficha base`);
        }
      }
    }
  }

  if (games.length !== GAMES.length) {
    errors.push(`Se esperaban ${GAMES.length} juegos y se generaron ${games.length}`);
  }

  if (errors.length) {
    throw new Error(`Validación del catálogo fallida:\n- ${errors.join('\n- ')}`);
  }
}

async function main() {
  console.log('Generando catálogo de juegos principales + DLC...');

  const games = await mapLimit(GAMES, 3, async (game) => {
    console.log(`- ${game.shortName}`);
    return buildGame(game);
  });

  validateGames(games);

  const dataset = {
    datasetVersion: 'v1',
    generatedAt: new Date().toISOString(),
    source: BASE_URL,
    scope: 'main-game-and-dlc',
    locale: 'es-ES',
    gameCount: games.length,
    games,
  };

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(path.join(OUTPUT_DIR, 'games.json'), JSON.stringify(dataset));
  await writeFile(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(
      {
        datasetVersion: dataset.datasetVersion,
        generatedAt: dataset.generatedAt,
        source: dataset.source,
        scope: dataset.scope,
        locale: dataset.locale,
        gameCount: dataset.gameCount,
        versionCount: games.reduce((total, game) => total + game.versions.length, 0),
        pokedexCount: games.reduce((total, game) => total + game.pokedexes.length, 0),
        dlcCount: games.reduce((total, game) => total + game.dlc.length, 0),
      },
      null,
      2,
    ),
  );

  console.log(`\nListo: ${games.length} juegos, ${dataset.source}`);
  console.log(`Salida: ${path.join(OUTPUT_DIR, 'games.json')}`);
}

main().catch((error) => {
  console.error('\nError generando el catálogo:', error);
  process.exitCode = 1;
});
