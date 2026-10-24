const cache = new Map();

export function loadPokedex(gameId) {
  if (!cache.has(gameId)) {
    const url = `${import.meta.env.BASE_URL}data/v1/pokedex/${gameId}.json`;

    const promise = fetch(url)
      .then((response) => {
        if (response.status === 404) return null;
        if (!response.ok) {
          throw new Error(`No se pudo cargar la Pokédex del juego (HTTP ${response.status}).`);
        }

        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) {
          // Hosting con fallback SPA: un archivo inexistente devuelve index.html.
          return null;
        }

        return response.json();
      })
      .catch((error) => {
        cache.delete(gameId);
        throw error;
      });

    cache.set(gameId, promise);
  }

  return cache.get(gameId);
}
