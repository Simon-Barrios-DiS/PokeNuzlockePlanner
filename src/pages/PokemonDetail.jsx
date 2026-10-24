import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getEvolutionChain, getPokemon, getSpecies } from '../api/pokeapi';
import { getEvolutionStages, getFlavorText, getGenus } from '../api/helpers';
import { STAT_LABELS, TYPES } from '../data/types';
import { useFavorites } from '../context/FavoritesContext';
import {
  artworkShinyUrl,
  artworkUrl,
  formatHabitat,
  formatMeasure,
  formatName,
  padId,
  spriteUrl,
} from '../utils/format';
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  Pokeball,
  SparklesIcon,
  VolumeIcon,
} from '../components/icons';
import TypeBadge from '../components/TypeBadge';

function Fact({ label, value }) {
  return (
    <div className="fact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [stages, setStages] = useState([]);
  const [shiny, setShiny] = useState(false);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setError('');
    setPokemon(null);
    setSpecies(null);
    setStages([]);
    setShiny(false);

    async function load() {
      try {
        const data = await getPokemon(name);
        if (!active) return;

        setPokemon(data);
        setStatus('success');
        document.title = `${formatName(data.name)} · PokeNuzlockePlanner`;

        // Los datos de especie y evolución son complementarios: si fallan, la ficha sigue visible.
        try {
          const speciesData = await getSpecies(data.species?.name ?? data.id);
          if (!active) return;
          setSpecies(speciesData);

          const chainUrl = speciesData.evolution_chain?.url;
          if (chainUrl) {
            const chain = await getEvolutionChain(chainUrl);
            if (active) setStages(getEvolutionStages(chain.chain));
          }
        } catch {
          // Silencioso: la información principal ya está cargada.
        }
      } catch (requestError) {
        if (!active) return;
        setError(requestError.message);
        setStatus('error');
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [name]);

  if (status === 'loading') {
    return (
      <div className="page container detail-page">
        <span className="skeleton skeleton-line skeleton-line--sm" />
        <div className="detail-hero detail-hero--loading" aria-busy="true">
          <div className="detail-info">
            <span className="skeleton skeleton-line skeleton-line--xs" />
            <span className="skeleton skeleton-line skeleton-line--xl" />
            <span className="skeleton skeleton-line skeleton-line--md" />
            <div className="skeleton-badges">
              <span className="skeleton skeleton-badge" />
              <span className="skeleton skeleton-badge skeleton-badge--short" />
            </div>
            <span className="skeleton skeleton-line" />
            <span className="skeleton skeleton-line" />
          </div>
          <div className="detail-art-wrap">
            <span className="skeleton skeleton-art-large" />
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error' || !pokemon) {
    return (
      <div className="page container">
        <div className="empty-state error-state">
          <div className="empty-ball">
            <Pokeball size={64} />
          </div>
          <h3>No encontramos a “{formatName(name)}”</h3>
          <p>
            {error || 'Ese Pokémon no existe en la Pokédex o el nombre está mal escrito.'}
          </p>
          <Link to="/" className="btn btn-primary">
            Volver a la Pokédex
          </Link>
        </div>
      </div>
    );
  }

  const types = pokemon.types.map((slot) => slot.type.name);
  const primaryType = types[0] ?? 'normal';
  const typeColor = TYPES[primaryType]?.color ?? '#7c8aa5';
  const secondaryColor = TYPES[types[1]]?.color ?? typeColor;
  const favorite = isFavorite(pokemon.id);
  const displayName = formatName(pokemon.name);
  const image = shiny
    ? artworkShinyUrl(pokemon.id)
    : (pokemon.sprites?.other?.['official-artwork']?.front_default ?? artworkUrl(pokemon.id));
  const cryUrl = pokemon.cries?.latest ?? pokemon.cries?.legacy;
  const flavor = getFlavorText(species);
  const genus = getGenus(species);
  const statsTotal = pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
  const moves = [...new Set(pokemon.moves.map((entry) => entry.move.name))].slice(0, 16);
  const generation = species?.generation?.name?.split('-')[1]?.toUpperCase();

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: pokemon.id,
      name: pokemon.name,
      image: artworkUrl(pokemon.id),
      types,
    });
  };

  const handlePlayCry = () => {
    if (!cryUrl) return;
    const audio = new Audio(cryUrl);
    audio.volume = 0.6;
    audio.play().catch(() => {
      // Algunos navegadores bloquean el audio sin interacción; aquí ya hubo un clic.
    });
  };

  return (
    <div
      className="page container detail-page"
      style={{ '--type-color': typeColor, '--type-color-2': secondaryColor }}
    >
      <button
        type="button"
        className="back-btn"
        onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
      >
        <ArrowLeftIcon size={18} />
        Volver
      </button>

      <section className="detail-hero">
        <div className="detail-hero-wash" aria-hidden="true" />

        <div className="detail-info">
          <span className="detail-id">{padId(pokemon.id)}</span>
          <h1>{displayName}</h1>
          {genus && <p className="detail-genus">{genus}</p>}

          <div className="detail-types">
            {types.map((type) => (
              <TypeBadge key={type} type={type} size="lg" />
            ))}
          </div>

          {flavor && <p className="detail-flavor">{flavor}</p>}

          <div className="detail-actions">
            <button
              type="button"
              className={`btn ${favorite ? 'btn-saved' : 'btn-primary'}`}
              onClick={handleToggleFavorite}
              aria-pressed={favorite}
            >
              <HeartIcon size={18} filled={favorite} />
              {favorite ? 'En mi biblioteca' : 'Guardar en biblioteca'}
            </button>

            {cryUrl && (
              <button type="button" className="btn btn-ghost" onClick={handlePlayCry}>
                <VolumeIcon size={18} />
                Escuchar grito
              </button>
            )}
          </div>
        </div>

        <div className="detail-art-wrap">
          <span className="detail-art-glow" aria-hidden="true" />
          <span className="detail-watermark" aria-hidden="true">
            {padId(pokemon.id)}
          </span>
          <img
            src={image}
            alt={`${displayName}${shiny ? ' en su variante shiny' : ''}`}
            className="detail-art-img"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = shiny
                ? artworkUrl(pokemon.id)
                : (pokemon.sprites?.front_default ?? spriteUrl(pokemon.id));
            }}
          />

          <button
            type="button"
            className={`shiny-toggle${shiny ? ' is-active' : ''}`}
            onClick={() => setShiny((value) => !value)}
            aria-pressed={shiny}
          >
            <SparklesIcon size={16} />
            {shiny ? 'Vista normal' : 'Variante shiny'}
          </button>
        </div>
      </section>

      <div className="detail-grid">
        <section className="panel">
          <h2>Datos básicos</h2>
          <div className="facts">
            <Fact label="Altura" value={formatMeasure(pokemon.height, 'm')} />
            <Fact label="Peso" value={formatMeasure(pokemon.weight, 'kg')} />
            <Fact label="Exp. base" value={pokemon.base_experience ?? '—'} />
            <Fact
              label="Hábitat"
              value={formatHabitat(species?.habitat?.name)}
            />
          </div>

          <div className="divider" />

          <h2>Estadísticas base</h2>
          <div className="stats-list">
            {pokemon.stats.map((stat) => {
              const label = STAT_LABELS[stat.stat.name] ?? formatName(stat.stat.name);
              return (
                <div className="stat-row" key={stat.stat.name}>
                  <span className="stat-label">{label}</span>
                  <div className="stat-track">
                    <span
                      className="stat-fill"
                      style={{ width: `${Math.min(100, (stat.base_stat / 180) * 100)}%` }}
                    />
                  </div>
                  <span className="stat-value">{stat.base_stat}</span>
                </div>
              );
            })}
          </div>

          <div className="stats-total">
            <span>Total</span>
            <strong>{statsTotal}</strong>
          </div>
        </section>

        <section className="panel">
          <h2>Habilidades</h2>
          <ul className="ability-list">
            {pokemon.abilities.map((entry) => (
              <li className="ability-item" key={entry.ability.name}>
                <span>{formatName(entry.ability.name)}</span>
                {entry.is_hidden && <span className="tag">Oculta</span>}
              </li>
            ))}
          </ul>

          <div className="divider" />

          <h2>Movimientos</h2>
          <p className="panel-note">Algunos de los movimientos que puede aprender.</p>
          <div className="move-cloud">
            {moves.map((move) => (
              <span className="move-chip" key={move}>
                {formatName(move)}
              </span>
            ))}
          </div>
        </section>
      </div>

      {stages.length > 1 && (
        <section className="panel evolution-panel">
          <h2>Línea evolutiva</h2>
          <div className="evolution-chain">
            {stages.map((stage, stageIndex) => (
              <Fragment key={stageIndex}>
                {stageIndex > 0 && (
                  <ChevronRightIcon size={26} className="evo-arrow" aria-hidden="true" />
                )}
                <div className="evo-stage">
                  {stage.map((evolution) => (
                    <Link
                      key={evolution.name}
                      to={`/pokemon/${evolution.name}`}
                      className={`evo-item${
                        evolution.name === pokemon.name ? ' is-current' : ''
                      }`}
                    >
                      <img
                        src={artworkUrl(evolution.id)}
                        alt={formatName(evolution.name)}
                        loading="lazy"
                      />
                      <span>{formatName(evolution.name)}</span>
                    </Link>
                  ))}
                </div>
              </Fragment>
            ))}
          </div>
        </section>
      )}

      <section className="panel meta-panel">
        <h2>Ficha de la Pokédex</h2>
        <dl className="meta-grid">
          <div>
            <dt>Generación</dt>
            <dd>{generation ? `Generación ${generation}` : '—'}</dd>
          </div>
          <div>
            <dt>Hábitat</dt>
            <dd>{formatHabitat(species?.habitat?.name)}</dd>
          </div>
          <div>
            <dt>Ratio de captura</dt>
            <dd>{species?.capture_rate ?? '—'}</dd>
          </div>
          <div>
            <dt>Felicidad base</dt>
            <dd>{species?.base_happiness ?? '—'}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
