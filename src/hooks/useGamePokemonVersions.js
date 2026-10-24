import { useEffect, useState } from 'react';
import { loadGamePokemonIndex } from '../services/gamePokemon';

export function useGamePokemonVersions(speciesId) {
  const [versions, setVersions] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');

    loadGamePokemonIndex()
      .then((index) => {
        if (!active) return;
        setVersions(index.species?.[speciesId] ?? []);
        setStatus('success');
      })
      .catch(() => {
        if (!active) return;
        setVersions([]);
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [speciesId]);

  return { versions, status };
}
