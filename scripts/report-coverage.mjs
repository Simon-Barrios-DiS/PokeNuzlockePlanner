import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURATED_EXCLUSIVES } from './pilots.config.mjs';
import { RAW_METHOD_LABELS } from '../src/data/gameMeta.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'public', 'data', 'v1');
const POKEMON_DIR = path.join(DATA_DIR, 'pokemon');
const OUTPUT = path.join(ROOT, 'docs', 'COBERTURA_DATOS.md');

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const fmt = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

async function dirExists(dir) {
  try {
    return (await stat(dir)).isDirectory();
  } catch {
    return false;
  }
}

async function countPokemonFiles(gameId) {
  const dir = path.join(POKEMON_DIR, gameId);
  if (!(await dirExists(dir))) return 0;
  return (await readdir(dir)).filter((file) => file.endsWith('.json')).length;
}

const games = (await readJson(path.join(DATA_DIR, 'games.json'))).games;
const pokedexManifest = await readJson(path.join(DATA_DIR, 'pokedex', 'manifest.json'));
const routesManifest = await readJson(path.join(DATA_DIR, 'routes', 'manifest.json'));
const index = await readJson(path.join(POKEMON_DIR, 'index.json'));
const forms = await readJson(path.join(DATA_DIR, 'forms.json'));
const formEntries = Object.values(forms.species ?? {}).flat();
const formCounts = formEntries.reduce(
  (counts, form) => {
    counts[form.kind] = (counts[form.kind] ?? 0) + 1;
    return counts;
  },
  { regional: 0, mega: 0, gmax: 0, totem: 0 },
);

const pokedexById = new Map(pokedexManifest.pilots.map((pilot) => [pilot.gameId, pilot]));
const routeById = new Map(routesManifest.pilots.map((route) => [route.gameId, route]));
const rows = [];

for (const game of games) {
  const pokedex = pokedexById.get(game.id);
  const route = routeById.get(game.id);
  const routeData = route
    ? await readJson(path.join(DATA_DIR, 'routes', `${game.id}.json`))
    : null;
  const fichas = await countPokemonFiles(game.id);
  rows.push({
    game,
    pokedex,
    route,
    routeData,
    fichas,
    fallback: routeData
      ? routeData.locations.filter((location) => location.nameFallback).length
      : 0,
  });
}

const totalFichas = rows.reduce((total, row) => total + row.fichas, 0);
const totalLocations = rows.reduce(
  (total, row) => total + (row.routeData?.locationCount ?? 0),
  0,
);
const totalEncounters = rows.reduce(
  (total, row) =>
    total +
    (row.routeData?.locations.reduce((sum, location) => sum + location.encounterCount, 0) ?? 0),
  0,
);

const methods = new Set();
for (const row of rows) {
  for (const location of row.routeData?.locations ?? []) {
    for (const encounter of location.encounters) methods.add(encounter.method);
  }
}
const missingMethods = [...methods].filter((method) => !RAW_METHOD_LABELS[method]).sort();

const missingAvailability = rows
  .filter((row) => row.pokedex && row.pokedex.availableCount < row.pokedex.entryCount)
  .map(
    (row) =>
      `- **${row.game.shortName}:** ${row.pokedex.availableCount}/${row.pokedex.entryCount} especies con método confirmado.`,
  );

const missingRoutes = rows
  .filter((row) => !row.routeData)
  .map((row) => {
    if (row.game.id === 'brilliant-diamond-shining-pearl') {
      return '- **Diamante Brillante / Perla Reluciente:** sin rutas ni fichas; PokéAPI no publica encuentros. Mantiene 151 especies de dex y 14 exclusivas curadas.';
    }
    if (row.game.id === 'scarlet-violet') {
      return '- **Escarlata / Púrpura:** excluido de la ampliación profunda; mantiene 664 especies de dex y 66 exclusivas curadas.';
    }
    return `- **${row.game.shortName}:** sin rutas ni fichas contextuales.`;
  });

const outOfDexExclusives = [];
for (const row of rows) {
  const curated = CURATED_EXCLUSIVES[row.game.id];
  if (!curated) continue;
  const pokedex = await readJson(path.join(DATA_DIR, 'pokedex', `${row.game.id}.json`));
  const dexSlugs = new Set(pokedex.entries.map((entry) => entry.slug));
  const missing = [...new Set(Object.values(curated.versions).flat())].filter(
    (slug) => !dexSlugs.has(slug),
  );
  if (missing.length) {
    outOfDexExclusives.push(
      `- **${row.game.shortName}:** ${missing.length} exclusivas curadas fuera de la dex regional (${missing.slice(0, 12).join(', ')}${missing.length > 12 ? '…' : ''}).`,
    );
  }
}

const routeCoverage = rows
  .filter((row) => row.routeData?.coverageNote)
  .map((row) => `- **${row.game.shortName}:** ${row.routeData.coverageNote}`);

const lines = [
  '# Cobertura de datos',
  '',
  `Generado desde los snapshots de \`public/data/v1\` el ${new Date().toISOString().slice(0, 10)}.`,
  '',
  '> **Estado:** versión 0.9. La versión 1.0 se reserva para completar los datos faltantes de este reporte.',
  '',
  '## Resumen',
  '',
  `- **${games.length} juegos** en el catálogo.`,
  `- **${rows.filter((row) => row.routeData).length} juegos** con rutas y fichas contextuales.`,
  `- **${fmt(totalFichas)} fichas** contextuales.`,
  `- **${index.species ? fmt(Object.keys(index.species).length) : 0} especies** en el índice de versiones.`,
  `- **${fmt(totalLocations)} localizaciones** con encuentros.`,
  `- **${fmt(totalEncounters)} encuentros** registrados.`,
  `- **0 localizaciones** pendientes de traducción en Gen V–VIII.`,
  `- **${methods.size} métodos** de encuentro, **${missingMethods.length}** sin etiqueta en español.`,
  `- **${fmt(formEntries.length)} formas** especiales en **${Object.keys(forms.species ?? {}).length} especies**: ${formCounts.regional} regionales, ${formCounts.mega} Mega, ${formCounts.gmax} Gigamax y ${formCounts.totem} Totem.`,
  '',
  '## Traducciones',
  '',
  '- Localizaciones de Gen V–VIII: **0 nombres pendientes**; los escasos nombres propios de formas o personajes se mantienen en su forma original.',
  `- Métodos de encuentro: **${methods.size}** identificadores, **${missingMethods.length}** pendientes.`,
  '- Condiciones especiales: etiquetas en español para clima, estaciones, Zona Safari, Guaridas Max, intercambios, inicio de aventura, objetos y estados de historia.',
  '',
  '## Formas',
  '',
  `- **${formCounts.regional}** formas regionales, **${formCounts.mega}** Mega Evoluciones, **${formCounts.gmax}** formas Gigamax y **${formCounts.totem}** formas Totem.`,
  '- La forma base se muestra separada de las variantes en la ficha contextual.',
  '- Las formas regionales usan los encuentros de su variedad para indicar en qué juego están disponibles.',
  '- La disponibilidad de una forma regional puede quedar incompleta si PokéAPI no registra esa variedad como encuentro.',
  '- Mega y Gigamax se marcan por juego compatible; los Totem se presentan como encuentro especial.',
  '- No se modelan otras variantes (Rotom, Deoxys, Unown, etc.) ni formas de Legends: Arceus.',
  '',
  '## Movimientos y level caps',
  '',
  '- Los learnsets incluyen movimientos por nivel, MT/MO y tutor. El huevo queda pendiente.',
  '- Los level caps cubren todos los juegos con gimnasios: Kanto, Johto, Hoenn, Sinnoh, Teselia, Kalos, Galar y Paldea, además de Let’s Go y las versiones dobles.',
  '- GSC y HGSS incluyen Johto, Kanto y Red como meta final. Solo los gimnasios definen caps; el Alto Mando no entra.',
  '- Alola (Sol/Luna y USUM) no tiene gimnasios; no se definen caps de gimnasio.',
  '- No hay números de MT ni equipos completos de entrenadores en la base.',
  '',
  '## Planificador de equipos',
  '',
  '- Vista `/equipos` con seis huecos por juego y versión.',
  '- Moveset de cuatro movimientos por Pokémon, con nivel, MT/MO y tutor; se puede reordenar.',
  '- Los level caps de todos los juegos con gimnasios se pueden seleccionar y aplicar al equipo; hay aviso si un nivel los supera.',
  '- Persistencia local por versión. No hay exportación, recomendaciones automáticas ni modo Nuzlocke.',
  '- El planificador elige especies, no formas regionales concretas; esa selección queda pendiente.',
  '',
  '## Cobertura por juego',
  '',
  '| Juego | Dex | Método | Exclusivas | Fuente | Rutas | Zonas | Encuentros | Fichas |',
  '|---|---:|---:|---:|---|---:|---:|---:|---:|',
];

for (const row of rows) {
  const pokedex = row.pokedex;
  const route = row.routeData;
  lines.push(
    `| ${row.game.shortName} | ${pokedex?.entryCount ?? '—'} | ${pokedex?.availableCount ?? '—'} | ${pokedex?.exclusiveCount ?? '—'} | ${pokedex?.exclusivitySource ?? '—'} | ${route?.numberedRouteCount ?? '—'} | ${route?.locationCount ?? '—'} | ${
      route
        ? fmt(route.locations.reduce((sum, location) => sum + location.encounterCount, 0))
        : '—'
    } | ${fmt(row.fichas)} |`,
  );
}

lines.push(
  '',
  '## Lo que falta o queda limitado',
  '',
  '### Sin encuentros publicados',
  '',
  ...missingRoutes,
  '',
  '### Cobertura de rutas y disponibilidad',
  '',
  ...routeCoverage,
  ...missingAvailability,
  '',
  '### Exclusividades fuera de la dex regional',
  '',
  'Estas especies están en las listas curadas, pero no aparecen en la Pokédex regional del juego ni tienen ficha contextual:',
  '',
  ...(outOfDexExclusives.length ? outOfDexExclusives : ['- Sin incidencias.']),
  '',
  '### Capas todavía no implementadas',
  '',
  '- **Otras formas** distintas de regionales/Mega/Gigamax/Totem (Rotom, Deoxys, Unown, etc.) no están modeladas. Las formas de Hisui quedan fuera por el alcance.',
  '- **Disponibilidad de formas regionales:** se apoya en encuentros de la variedad y cobertura regional; puede quedar incompleta si PokéAPI no registra la forma.',
  '- **Número de MT y movimientos huevo:** los learnsets distinguen MT/MO y tutor, pero no muestran el número de MT ni movimientos huevo.',
  '- **Entrenadores, gimnasios y combates finales:** solo hay level caps de gimnasio y la meta de Red en GSC/HGSS; no hay equipos completos de entrenadores, Alto Mando ni combates.',
  '- **Alola:** Sol/Luna y USUM no tienen gimnasios, así que no hay caps de gimnasio.',
  '- **DLC de Escarlata / Púrpura:** queda fuera; el DLC de Espada / Escudo sí está incluido en Galar.',
  '- **Planificador:** no hay exportación, recomendaciones automáticas, cálculo de daño, EVs/naturalezas, modo Nuzlocke ni selección de forma regional.',
  '- **Localizaciones de Gen V–VIII:** los nombres visibles están traducidos; las condiciones y métodos también tienen etiqueta en español. Los nombres propios de formas o personajes pueden quedar en su forma original.',
  '',
  '## Después de 1.0',
  '',
  '- Modelar qué **MT y tutores** están disponibles antes de cada gimnasio, por juego y versión.',
  '- Asociar cada movimiento a su checkpoint de aventura y validar el moveset legal.',
  '- Builder perfecto por gimnasio: level cap, equipo, movimientos, disponibilidad y cobertura.',
  '',
  '## Archivos fuente',
  '',
  '- `public/data/v1/pokedex/manifest.json`',
  '- `public/data/v1/routes/manifest.json`',
  '- `public/data/v1/pokemon/index.json`',
  '- `scripts/pilots.config.mjs` y `scripts/exclusives.gen58.mjs`',
  '',
);

await mkdir(path.dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, lines.join('\n'));
console.log(`Reporte generado: ${OUTPUT}`);
console.log(
  `Juegos con rutas: ${rows.filter((row) => row.routeData).length}; fichas: ${totalFichas}; especies: ${Object.keys(index.species ?? {}).length}`,
);
