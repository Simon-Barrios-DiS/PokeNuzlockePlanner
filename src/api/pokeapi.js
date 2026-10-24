const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Caché de promesas en memoria para no repetir peticiones durante la sesión.
 * Guardamos la promesa (no solo el resultado) para deduplicar llamadas simultáneas.
 */
const requestCache = new Map();

function fetchJson(url) {
  if (requestCache.has(url)) return requestCache.get(url);

  const request = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`La PokéAPI respondió con estado ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      // Si falla, quitamos la caché para permitir reintentos.
      requestCache.delete(url);
      throw error;
    });

  requestCache.set(url, request);
  return request;
}

export function getPokemonIndex() {
  return fetchJson(`${BASE_URL}/pokemon?limit=100000&offset=0`);
}

export function getPokemon(nameOrId) {
  return fetchJson(`${BASE_URL}/pokemon/${String(nameOrId).toLowerCase()}`);
}

export function getSpecies(nameOrId) {
  return fetchJson(`${BASE_URL}/pokemon-species/${String(nameOrId).toLowerCase()}`);
}

export function getType(type) {
  return fetchJson(`${BASE_URL}/type/${type}`);
}

export function getEvolutionChain(url) {
  return fetchJson(url);
}
