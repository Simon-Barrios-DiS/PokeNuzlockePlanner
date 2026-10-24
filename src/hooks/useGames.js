import { useCallback, useEffect, useState } from 'react';
import { loadGames } from '../services/games';

export function useGames() {
  const [state, setState] = useState({
    status: 'loading',
    games: [],
    generatedAt: null,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    setState((previous) => ({ ...previous, status: 'loading', error: null }));

    loadGames()
      .then((dataset) => {
        if (!active) return;
        setState({
          status: 'success',
          games: dataset.games ?? [],
          generatedAt: dataset.generatedAt ?? null,
          error: null,
        });
      })
      .catch((error) => {
        if (!active) return;
        setState({
          status: 'error',
          games: [],
          generatedAt: null,
          error: error.message,
        });
      });

    return () => {
      active = false;
    };
  }, [reloadToken]);

  const retry = useCallback(() => setReloadToken((token) => token + 1), []);

  return { ...state, retry };
}
