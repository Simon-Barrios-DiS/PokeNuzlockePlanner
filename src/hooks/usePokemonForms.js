import { useEffect, useState } from 'react';
import { loadPokemonForms } from '../services/gamePokemon';

export function usePokemonForms(speciesId) {
  const [forms, setForms] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');

    loadPokemonForms()
      .then((index) => {
        if (!active) return;
        setForms(index.species?.[speciesId] ?? []);
        setStatus('success');
      })
      .catch(() => {
        if (!active) return;
        setForms([]);
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [speciesId]);

  return { forms, status };
}
