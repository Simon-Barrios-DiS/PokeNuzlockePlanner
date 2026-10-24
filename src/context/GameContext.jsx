import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'pokenuzlockeplanner:selected-game:v1';
const LEGACY_STORAGE_KEY = 'poke-biblioteca:selected-game:v1';
const GameContext = createContext(null);

function readSelectedGame() {
  try {
    return (
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY)
    );
  } catch {
    return null;
  }
}

export function GameProvider({ children }) {
  const [selectedGameId, setSelectedGameId] = useState(readSelectedGame);

  useEffect(() => {
    try {
      if (selectedGameId) {
        localStorage.setItem(STORAGE_KEY, selectedGameId);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    } catch {
      // La selección funciona igual en memoria si el almacenamiento está bloqueado.
    }
  }, [selectedGameId]);

  const selectGame = useCallback((gameId) => setSelectedGameId(gameId), []);
  const clearSelectedGame = useCallback(() => setSelectedGameId(null), []);

  const value = useMemo(
    () => ({ selectedGameId, selectGame, clearSelectedGame }),
    [selectedGameId, selectGame, clearSelectedGame],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGame debe usarse dentro de GameProvider');
  }

  return context;
}
