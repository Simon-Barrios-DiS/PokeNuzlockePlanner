import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { usePokemonDetails } from '../hooks/usePokemonDetails';
import { artworkUrl } from '../utils/format';
import PokemonCard from '../components/PokemonCard';
import { HeartIcon, Pokeball, TrashIcon } from '../components/icons';

export default function Library() {
  const { favorites, clearFavorites } = useFavorites();
  const [confirmClear, setConfirmClear] = useState(false);

  const names = useMemo(() => favorites.map((pokemon) => pokemon.name), [favorites]);
  const details = usePokemonDetails(names);

  useEffect(() => {
    document.title = 'Mi biblioteca · PokeNuzlockePlanner';
  }, []);

  useEffect(() => {
    if (favorites.length === 0) setConfirmClear(false);
  }, [favorites.length]);

  return (
    <div className="page container library-page">
      <header className="library-head">
        <div>
          <span className="eyebrow">
            <HeartIcon size={16} />
            Tu colección
          </span>
          <h1>Mi biblioteca</h1>
          <p>
            {favorites.length === 0
              ? 'Guarda tus Pokémon favoritos y tenlos siempre a mano.'
              : `Tienes ${favorites.length} ${
                  favorites.length === 1 ? 'Pokémon guardado' : 'Pokémon guardados'
                }. Todo se conserva en este navegador.`}
          </p>
        </div>

        {favorites.length > 0 &&
          (confirmClear ? (
            <div className="confirm-actions">
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => {
                  clearFavorites();
                  setConfirmClear(false);
                }}
              >
                Sí, vaciar todo
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setConfirmClear(false)}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setConfirmClear(true)}
            >
              <TrashIcon size={16} />
              Vaciar biblioteca
            </button>
          ))}
      </header>

      {favorites.length === 0 ? (
        <div className="empty-state library-empty">
          <div className="empty-ball empty-ball--pulse">
            <Pokeball size={76} />
          </div>
          <h3>Aún no has guardado ningún Pokémon</h3>
          <p>
            Explora la Pokédex y toca el corazón de tus favoritos para empezar tu colección.
          </p>
          <Link to="/" className="btn btn-primary">
            Explorar la Pokédex
          </Link>
        </div>
      ) : (
        <div className="pokemon-grid">
          {favorites.map((favorite, index) => {
            const fetchedTypes = details[favorite.name]?.types?.map((slot) => slot.type.name);
            const types = favorite.types?.length ? favorite.types : fetchedTypes;

            return (
              <PokemonCard
                key={favorite.id}
                id={favorite.id}
                name={favorite.name}
                image={favorite.image ?? artworkUrl(favorite.id)}
                types={types}
                index={index}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
