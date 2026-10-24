const cache = new Map();

export function loadRoutes(gameId) {
  if (!cache.has(gameId)) {
    const url = `${import.meta.env.BASE_URL}data/v1/routes/${gameId}.json`;

    const promise = fetch(url)
      .then((response) => {
        if (response.status === 404) return null;
        if (!response.ok) {
          throw new Error(`No se pudieron cargar las rutas (HTTP ${response.status}).`);
        }

        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) return null;

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
