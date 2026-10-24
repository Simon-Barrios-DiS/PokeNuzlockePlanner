import { useCallback, useEffect, useState } from 'react';
import { loadPokedex } from '../services/pokedex';

export function useGamePokedex(gameId) {
  const [state, setState] = useState({
    status: 'loading',
    data: null,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    setState((previous) => ({ ...previous, status: 'loading', error: null }));

    loadPokedex(gameId)
      .then((data) => {
        if (!active) return;
        setState({
          status: data ? 'success' : 'missing',
          data,
          error: null,
        });
      })
      .catch((error) => {
        if (!active) return;
        setState({ status: 'error', data: null, error: error.message });
      });

    return () => {
      active = false;
    };
  }, [gameId, reloadToken]);

  const retry = useCallback(() => setReloadToken((token) => token + 1), []);

  return { ...state, retry };
}
