import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'pokenuzlockeplanner:favorites:v2';
const LEGACY_STORAGE_KEY = 'poke-biblioteca:favorites:v2';
const LEGACY_V1_STORAGE_KEY = 'poke-biblioteca:favorites:v1';
const FavoritesContext = createContext(null);

function normalizeFavorite(item) {
  return {
    id: item.id,
    name: item.name,
    image: item.image,
    types: Array.isArray(item.types) ? item.types : [],
    addedAt: item.addedAt ?? Date.now(),
    gameIds: Array.isArray(item.gameIds) ? item.gameIds : [],
    status: item.status ?? 'saved',
  };
}

function readStoredFavorites() {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY) ??
      localStorage.getItem(LEGACY_V1_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.id === 'number' &&
          typeof item.name === 'string' &&
          Number.isFinite(item.id),
      )
      .map(normalizeFavorite);
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(readStoredFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem(LEGACY_V1_STORAGE_KEY);
    } catch {
      // Si el almacenamiento está lleno o bloqueado, la app sigue funcionando en memoria.
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (id) => favorites.some((pokemon) => pokemon.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback((pokemon) => {
    if (!pokemon?.id) return;

    setFavorites((previous) => {
      const exists = previous.some((item) => item.id === pokemon.id);
      if (exists) return previous.filter((item) => item.id !== pokemon.id);

      return [
        normalizeFavorite({
          ...pokemon,
          addedAt: Date.now(),
          gameIds: pokemon.gameIds ?? [],
          status: pokemon.status ?? 'saved',
        }),
        ...previous,
      ];
    });
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites((previous) => previous.filter((item) => item.id !== id));
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const value = useMemo(
    () => ({
      favorites,
      count: favorites.length,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      clearFavorites,
    }),
    [favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  }

  return context;
}
