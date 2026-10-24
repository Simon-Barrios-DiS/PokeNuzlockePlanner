const cache = new Map();
let indexPromise;
let formsPromise;

export function loadGamePokemon(gameId, speciesId) {
  const key = `${gameId}:${speciesId}`;

  if (!cache.has(key)) {
    const url = `${import.meta.env.BASE_URL}data/v1/pokemon/${gameId}/${speciesId}.json`;

    const promise = fetch(url)
      .then((response) => {
        if (response.status === 404) return null;
        if (!response.ok) {
          throw new Error(`No se pudo cargar la ficha del Pokémon (HTTP ${response.status}).`);
        }

        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) return null;

        return response.json();
      })
      .catch((error) => {
        cache.delete(key);
        throw error;
      });

    cache.set(key, promise);
  }

  return cache.get(key);
}

export function loadGamePokemonIndex() {
  if (!indexPromise) {
    const url = `${import.meta.env.BASE_URL}data/v1/pokemon/index.json`;

    indexPromise = fetch(url)
      .then((response) => {
        if (response.status === 404) return { species: {} };
        if (!response.ok) {
          throw new Error(`No se pudo cargar el índice de versiones (HTTP ${response.status}).`);
        }
        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) return { species: {} };
        return response.json();
      })
      .catch((error) => {
        indexPromise = undefined;
        throw error;
      });
  }

  return indexPromise;
}

export function loadPokemonForms() {
  if (!formsPromise) {
    const url = `${import.meta.env.BASE_URL}data/v1/forms.json`;

    formsPromise = fetch(url)
      .then((response) => {
        if (response.status === 404) return { species: {} };
        if (!response.ok) {
          throw new Error(`No se pudieron cargar las formas (HTTP ${response.status}).`);
        }
        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) return { species: {} };
        return response.json();
      })
      .catch((error) => {
        formsPromise = undefined;
        throw error;
      });
  }

  return formsPromise;
}
