const DATA_URL = `${import.meta.env.BASE_URL}data/v1/games.json`;

let gamesPromise;

export function loadGames() {
  if (!gamesPromise) {
    gamesPromise = fetch(DATA_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`No se pudo cargar el catálogo de juegos (HTTP ${response.status}).`);
        }
        return response.json();
      })
      .catch((error) => {
        gamesPromise = undefined;
        throw error;
      });
  }

  return gamesPromise;
}
