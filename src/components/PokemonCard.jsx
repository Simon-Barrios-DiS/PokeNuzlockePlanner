import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { TYPES } from '../data/types';
import { artworkUrl, formatName, padId, spriteUrl } from '../utils/format';
import TypeBadge from './TypeBadge';
import { HeartIcon } from './icons';

export default function PokemonCard({ id, name, image, types, index = 0 }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const favorite = isFavorite(id);
  const artwork = image ?? artworkUrl(id);
  const primaryType = types?.[0];
  const typeColor = TYPES[primaryType]?.color ?? '#7c8aa5';
  const displayName = formatName(name);

  return (
    <article
      className="pokemon-card"
      style={{
        '--type-color': typeColor,
        '--delay': `${Math.min(index, 12) * 35}ms`,
      }}
    >
      <button
        type="button"
        className={`fav-btn${favorite ? ' is-fav' : ''}`}
        onClick={() => toggleFavorite({ id, name, image: artwork, types })}
        aria-label={
          favorite
            ? `Quitar ${displayName} de la biblioteca`
            : `Guardar ${displayName} en la biblioteca`
        }
        aria-pressed={favorite}
      >
        <HeartIcon size={18} filled={favorite} />
      </button>

      <Link
        className="card-link"
        to={`/pokemon/${name}`}
        aria-label={`Ver la ficha de ${displayName}`}
      >
        <span className="card-id">{padId(id)}</span>

        <div className="card-art">
          <span className="card-glow" aria-hidden="true" />
          <img
            src={artwork}
            alt={displayName}
            loading="lazy"
            width="475"
            height="475"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = spriteUrl(id);
            }}
          />
        </div>

        <div className="card-body">
          <h3>{displayName}</h3>
          <div className="card-types">
            {types?.length ? (
              types.map((type) => <TypeBadge key={type} type={type} />)
            ) : (
              <>
                <span className="skeleton skeleton-badge" />
                <span className="skeleton skeleton-badge skeleton-badge--short" />
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
