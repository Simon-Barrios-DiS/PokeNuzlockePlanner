import { idFromUrl } from '../utils/format';

/** Devuelve la cadena evolutiva agrupada por etapas (soporta ramificaciones como Eevee). */
export function getEvolutionStages(chain) {
  if (!chain) return [];

  const stages = [];
  let currentLevel = [chain];

  while (currentLevel.length > 0) {
    stages.push(
      currentLevel.map((node) => ({
        id: idFromUrl(node.species.url),
        name: node.species.name,
      })),
    );
    currentLevel = currentLevel.flatMap((node) => node.evolves_to ?? []);
  }

  return stages;
}

/** Texto de la Pokédex priorizando español, con respaldo en inglés. */
export function getFlavorText(species) {
  if (!species?.flavor_text_entries?.length) return '';

  const entry =
    species.flavor_text_entries.find((item) => item.language.name === 'es') ??
    species.flavor_text_entries.find((item) => item.language.name === 'en');

  return entry
    ? entry.flavor_text.replace(/[\n\f\r]+/g, ' ').replace(/\s+/g, ' ').trim()
    : '';
}

/** Género de la especie (ej. "Pokémon Ratón") en español si existe. */
export function getGenus(species) {
  if (!species?.genera?.length) return '';

  const entry =
    species.genera.find((item) => item.language.name === 'es') ??
    species.genera.find((item) => item.language.name === 'en');

  return entry?.genus ?? '';
}
