import { useEffect, useRef, useState } from 'react';
import { getPokemon } from '../api/pokeapi';

/**
 * Carga detalles de Pokémon en lote, solo para los nombres que aún no tenemos.
 * Mantiene las tarjetas visibles actualizadas sin bloquear la interfaz.
 */
export function usePokemonDetails(names) {
  const [details, setDetails] = useState({});
  const pending = useRef(new Set());
  const alive = useRef(true);
  const namesKey = names.join(',');

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    const requested = namesKey ? namesKey.split(',') : [];
    const missing = requested.filter((name) => !details[name] && !pending.current.has(name));

    if (missing.length === 0) return undefined;

    missing.forEach((name) => pending.current.add(name));

    Promise.allSettled(
      missing.map((name) => getPokemon(name).then((data) => ({ name, data }))),
    )
      .then((results) => {
        if (!alive.current) return;

        setDetails((previous) => {
          const next = { ...previous };
          results.forEach((result) => {
            if (result.status === 'fulfilled') {
              next[result.value.name] = result.value.data;
            }
          });
          return next;
        });
      })
      .finally(() => {
        missing.forEach((name) => pending.current.delete(name));
      });

    return undefined;
  }, [namesKey, details]);

  return details;
}
