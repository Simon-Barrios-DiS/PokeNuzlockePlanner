import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'public', 'data', 'v1');
const OUTPUT = path.join(DATA_DIR, 'forms.json');
const CACHE_DIR = path.join(ROOT, '.cache', 'pokeapi');
const BASE_URL = 'https://pokeapi.co/api/v2';
const CONCURRENCY = 5;

const MEGA_GAMES = ['x-y', 'omega-ruby-alpha-sapphire', 'sun-moon', 'ultra-sun-ultra-moon'];
const MEGA_XY_SPECIES = new Set([
  'venusaur',
  'charizard',
  'blastoise',
  'alakazam',
  'gengar',
  'kangaskhan',
  'pinsir',
  'gyarados',
  'aerodactyl',
  'mewtwo',
  'ampharos',
  'scizor',
  'heracross',
  'houndoom',
  'tyranitar',
  'blaziken',
  'gardevoir',
  'mawile',
  'aggron',
  'medicham',
  'manectric',
  'banette',
  'absol',
  'garchomp',
  'lucario',
  'abomasnow',
]);
const MEGA_ORAS_SPECIES = new Set([
  'beedrill',
  'pidgeot',
  'slowbro',
  'steelix',
  'sceptile',
  'swampert',
  'sableye',
  'sharpedo',
  'camerupt',
  'altaria',
  'glalie',
  'salamence',
  'metagross',
  'latias',
  'latios',
  'rayquaza',
  'lopunny',
  'gallade',
  'audino',
  'diancie',
]);
const GMAX_GAMES = ['sword-shield'];
const TOTEM_GAMES = ['sun-moon', 'ultra-sun-ultra-moon'];
const REGION_GAMES = {
  alola: ['sun-moon', 'ultra-sun-ultra-moon', 'lets-go-pikachu-lets-go-eevee'],
  galar: ['sword-shield'],
  hisui: [],
  paldea: ['scarlet-violet'],
};

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

const getSpecies = (id) => fetchJson(`${BASE_URL}/pokemon-species/${id}`);
const getPokemon = (id) => fetchJson(`${BASE_URL}/pokemon/${id}`);
const getEncounters = (id) => fetchJson(`${BASE_URL}/pokemon/${id}/encounters`);

function spanishName(species, fallback) {
  return species.names?.find((entry) => entry.language.name === 'es')?.name ?? fallback;
}

function classifyForm(slug) {
  if (slug.endsWith('-gmax')) return { kind: 'gmax' };
  if (slug.includes('-mega')) return { kind: 'mega' };
  if (slug.includes('-totem')) {
    const region = slug.includes('alola') ? 'alola' : null;
    return { kind: 'totem', region };
  }

  const regional = slug.match(/-(alola|galar|hisui|paldea)(?:-|$)/);
  if (regional) return { kind: 'regional', region: regional[1] };

  return null;
}

function regionLabel(region) {
  return {
    alola: 'Alola',
    galar: 'Galar',
    hisui: 'Hisui',
    paldea: 'Paldea',
  }[region] ?? '';
}

function formName(baseName, slug, form) {
  if (form.kind === 'mega') {
    const suffix = slug.endsWith('-mega-x') ? ' X' : slug.endsWith('-mega-y') ? ' Y' : '';
    return `Mega ${baseName}${suffix}`;
  }
  if (form.kind === 'gmax') return `${baseName} Gigamax`;
  if (form.kind === 'totem') {
    return `${baseName} Totem${form.region ? ` de ${regionLabel(form.region)}` : ''}`;
  }
  return `${baseName} de ${regionLabel(form.region)}`;
}

function buildVersionMap(games) {
  const versionToGame = new Map();
  for (const game of games) {
    for (const version of game.versions) versionToGame.set(version.id, game.id);
    for (const expansion of game.dlc ?? []) {
      for (const version of expansion.versions) versionToGame.set(version.id, game.id);
    }
  }
  return versionToGame;
}

function gamesForVersions(encounters, versionToGame) {
  const games = new Set();
  for (const area of encounters) {
    for (const detail of area.version_details ?? []) {
      const gameId = versionToGame.get(detail.version.name);
      if (gameId) games.add(gameId);
    }
  }
  return [...games];
}

function formImage(pokemon) {
  return (
    pokemon.sprites?.other?.['official-artwork']?.front_default ??
    pokemon.sprites?.front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
  );
}

async function main() {
  const games = JSON.parse(await readFile(path.join(DATA_DIR, 'games.json'), 'utf8')).games;
  const index = JSON.parse(await readFile(path.join(DATA_DIR, 'pokemon', 'index.json'), 'utf8'));
  const speciesIds = Object.keys(index.species ?? {}).map(Number);
  const versionToGame = buildVersionMap(games);
  const output = {};
  let processed = 0;

  await mapLimit(speciesIds, CONCURRENCY, async (speciesId) => {
    const species = await getSpecies(speciesId);
    const baseName = spanishName(species, species.name);
    const varieties = species.varieties ?? [];
    const forms = [];

    for (const variety of varieties) {
      if (variety.is_default) continue;
      const classified = classifyForm(variety.pokemon.name);
      if (!classified) continue;
      if (
        classified.kind === 'mega' &&
        !MEGA_XY_SPECIES.has(species.name) &&
        !MEGA_ORAS_SPECIES.has(species.name)
      ) {
        continue;
      }
      if (classified.kind === 'regional' && classified.region === 'hisui') continue;

      const pokemon = await getPokemon(variety.pokemon.name);
      let gameIds = [];

      if (classified.kind === 'mega') {
        gameIds = MEGA_XY_SPECIES.has(species.name)
          ? MEGA_GAMES
          : MEGA_GAMES.filter((gameId) => gameId !== 'x-y');
      } else if (classified.kind === 'gmax') gameIds = GMAX_GAMES;
      else if (classified.kind === 'totem') gameIds = TOTEM_GAMES;
      else {
        const encounters = await getEncounters(variety.pokemon.name);
        gameIds = gamesForVersions(encounters, versionToGame);
        if (classified.kind === 'regional') {
          gameIds = [...new Set([...gameIds, ...(REGION_GAMES[classified.region] ?? [])])];
        }
      }

      forms.push({
        id: pokemon.id,
        slug: variety.pokemon.name,
        name: formName(baseName, variety.pokemon.name, classified),
        kind: classified.kind,
        region: classified.region ?? null,
        types: pokemon.types.map((slot) => slot.type.name),
        image: formImage(pokemon),
        games: gameIds,
      });
    }

    if (forms.length) {
      const order = { regional: 0, mega: 1, gmax: 2, totem: 3 };
      const unique = new Map();
      for (const form of forms) {
        const key = `${form.kind}:${form.region ?? ''}:${form.name}`;
        if (!unique.has(key)) unique.set(key, form);
      }
      const deduped = [...unique.values()];
      deduped.sort(
        (a, b) =>
          (order[a.kind] ?? 9) - (order[b.kind] ?? 9) ||
          a.name.localeCompare(b.name, 'es'),
      );
      output[speciesId] = deduped;
    }

    processed += 1;
    if (processed % 50 === 0) console.log(`  ${processed}/${speciesIds.length} especies`);
  });

  await writeFile(
    OUTPUT,
    JSON.stringify({
      datasetVersion: 'v1',
      generatedAt: new Date().toISOString(),
      source: BASE_URL,
      species: output,
    }),
  );

  const formCount = Object.values(output).reduce((total, forms) => total + forms.length, 0);
  console.log(`Formas generadas: ${formCount} en ${Object.keys(output).length} especies.`);
}

main().catch((error) => {
  console.error('\nError generando formas:', error);
  process.exitCode = 1;
});
