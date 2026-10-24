import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useFavorites } from '../context/FavoritesContext';
import { getGeneration } from '../data/generations';
import { getGameTheme } from '../data/gameThemes';
import { METHOD_LABELS, getMoveCategory } from '../data/gameMeta';
import { STAT_LABELS, TYPES } from '../data/types';
import { useGamePokemon } from '../hooks/useGamePokemon';
import { useGamePokemonVersions } from '../hooks/useGamePokemonVersions';
import { usePokemonForms } from '../hooks/usePokemonForms';
import { useGames } from '../hooks/useGames';
import TypeBadge from '../components/TypeBadge';
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  Pokeball,
  SparklesIcon,
} from '../components/icons';
import { formatMeasure } from '../utils/format';

const DAMAGE_CLASS_LABELS = {
  physical: 'Físico',
  special: 'Especial',
  status: 'Otros',
};

const FORM_KIND_LABELS = {
  regional: 'Forma regional',
  mega: 'Mega Evolución',
  gmax: 'Gigamax',
  totem: 'Totem',
};

function methodReady(method, level) {
  const match = method.match(/Nivel\s+(\d+)/);
  return match ? Number(match[1]) <= level : false;
}

function EvolutionNode({ node, currentSpeciesId, level, gameId }) {
  const isCurrent = node.speciesId === currentSpeciesId;
  const href = node.inGameDex
    ? `/juegos/${gameId}/pokemon/${node.speciesId}`
    : `/pokemon/${node.pokemonId}`;

  return (
    <div className={`evo-branch${isCurrent ? ' is-current' : ''}`}>
      {node.methods?.length > 0 && (
        <div className="evo-methods">
          {node.methods.map((method) => (
            <span
              className={`evo-method${methodReady(method, level) ? ' is-ready' : ''}`}
              key={method}
            >
              {method}
            </span>
          ))}
        </div>
      )}

      <Link to={href} className="evo-node" title={node.name}>
        <img src={node.image} alt={node.name} loading="lazy" />
        <span>{node.name}</span>
        {!node.inGameDex && <small>Ficha nacional</small>}
      </Link>

      {node.children?.length > 0 && (
        <div className="evo-children">
          {node.children.map((child) => (
            <EvolutionNode
              key={child.speciesId}
              node={child}
              currentSpeciesId={currentSpeciesId}
              level={level}
              gameId={gameId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function GamePokemonDetail() {
  const { gameId, speciesId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectGame } = useGame();
  const { games } = useGames();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { status, data, error, retry } = useGamePokemon(gameId, speciesId);
  const { versions: gameVersions } = useGamePokemonVersions(speciesId);
  const { forms: pokemonForms } = usePokemonForms(speciesId);
  const [level, setLevel] = useState(50);
  const [shiny, setShiny] = useState(false);
  const [moveTab, setMoveTab] = useState('level');

  const game = games.find((item) => item.id === gameId);
  const versions = game?.versions ?? [];
  const versionParam = searchParams.get('version') ?? 'all';
  const currentVersion = versions.some((version) => version.id === versionParam)
    ? versionParam
    : 'all';

  const versionNames = useMemo(
    () => Object.fromEntries(versions.map((version) => [version.id, version.name])),
    [versions],
  );

  useEffect(() => {
    if (gameId) selectGame(gameId);
  }, [gameId, selectGame]);

  useEffect(() => {
    if (data) document.title = `${data.name} · ${data.gameShortName} · PokeNuzlockePlanner`;
  }, [data]);

  useEffect(() => {
    setMoveTab('level');
  }, [data?.gameId, data?.speciesId]);

  function updateVersion(value) {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') next.delete('version');
    else next.set('version', value);
    setSearchParams(next, { replace: true });
  }

  if (status === 'loading') {
    return (
      <div className="page container game-pokemon-page">
        <span className="skeleton skeleton-line skeleton-line--sm" />
        <div className="detail-hero game-pokemon-hero game-pokemon-hero--loading">
          <div className="detail-info">
            <span className="skeleton skeleton-line skeleton-line--xs" />
            <span className="skeleton skeleton-line skeleton-line--xl" />
            <span className="skeleton skeleton-line skeleton-line--md" />
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

  if (status === 'error') {
    return (
      <div className="page container">
        <div className="empty-state error-state">
          <div className="empty-ball">
            <Pokeball size={64} />
          </div>
          <h3>No pudimos cargar la ficha del Pokémon</h3>
          <p>{error}</p>
          <button type="button" className="btn btn-primary" onClick={retry}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (status === 'missing' || !data) {
    return (
      <div className="page container">
        <div className="empty-state">
          <div className="empty-ball">
            <Pokeball size={64} />
          </div>
          <h3>Ficha en preparación</h3>
          <p>Este Pokémon no tiene una ficha contextual para el juego seleccionado.</p>
          <Link to={`/juegos/${gameId}/pokedex`} className="btn btn-primary">
            Volver a la Pokédex
          </Link>
        </div>
      </div>
    );
  }

  const generation = getGeneration(data.generation);
  const theme = getGameTheme({ id: data.gameId, generation: data.generation });
  const supportsAbilities = data.generation >= 3;
  const supportsHiddenAbilities = data.generation >= 5;
  const supportsShiny = data.generation >= 2;
  const usesModernDamageSplit = data.generation >= 4;
  const visibleAbilities = data.abilities.filter(
    (ability) => supportsHiddenAbilities || !ability.hidden,
  );
  const primaryType = data.types[0] ?? 'normal';
  const secondaryType = data.types[1] ?? primaryType;
  const typeColor = TYPES[primaryType]?.color ?? '#7c8aa5';
  const typeColor2 = TYPES[secondaryType]?.color ?? typeColor;
  const favorite = isFavorite(data.pokemonId);
  const image = shiny && supportsShiny && data.shinyImage ? data.shinyImage : data.image;
  const nationalLink = `/pokemon/${data.slug ?? data.pokemonId}`;

  const availabilityEntries = Object.entries(data.availability ?? {}).filter(
    ([versionId]) => currentVersion === 'all' || versionId === currentVersion,
  );
  const methods = [
    ...new Set(
      availabilityEntries.flatMap(([, availability]) => availability.methods ?? []),
    ),
  ];
  const hasKnownAvailability = availabilityEntries.some(([, availability]) => availability.known);
  const locationMap = new Map();
  availabilityEntries.forEach(([, availability]) => {
    for (const location of availability.locations ?? []) {
      locationMap.set(location.areaId, location.areaName);
    }
  });
  const locationNames = [...new Set(locationMap.values())];
  const exclusiveNames = data.exclusiveTo
    .map((versionId) => versionNames[versionId] ?? versionId)
    .filter(Boolean);
  const learnedMoves = data.learnset.filter((move) => move.level <= level);
  const tmMoves = data.tmMoves ?? [];
  const tutorMoves = data.tutorMoves ?? [];
  const activeMoves =
    moveTab === 'tm' ? tmMoves : moveTab === 'tutor' ? tutorMoves : data.learnset;
  const totalStats = data.stats.reduce((total, stat) => total + stat.value, 0);
  const unavailableInVersion =
    currentVersion !== 'all' &&
    data.exclusiveTo.length > 0 &&
    !data.exclusiveTo.includes(currentVersion);

  function handleToggleFavorite() {
    toggleFavorite({
      id: data.pokemonId,
      name: data.slug ?? String(data.pokemonId),
      image: data.image,
      types: data.types,
    });
  }

  return (
    <div
      className="page container detail-page game-pokemon-page"
      style={{
        '--gen-color': theme.primary,
        '--gen-color-2': theme.secondary,
        '--type-color': typeColor,
        '--type-color-2': typeColor2,
      }}
    >
      <Link to={`/juegos/${data.gameId}/pokedex${currentVersion !== 'all' ? `?version=${currentVersion}` : ''}`} className="back-btn">
        <ArrowLeftIcon size={18} />
        Pokédex de {data.gameShortName}
      </Link>

      <section className="detail-hero game-pokemon-hero">
        <div className="detail-hero-wash" aria-hidden="true" />

        <div className="detail-info">
          <span className="game-pokemon-context">
            Generación {generation.roman} · {data.gameShortName}
          </span>
          <span className="detail-id">#{data.nationalNumber.toString().padStart(4, '0')}</span>
          <h1>{data.name}</h1>
          {data.genus && <p className="detail-genus">{data.genus}</p>}

          <div className="detail-types">
            {data.types.map((type) => (
              <TypeBadge key={type} type={type} size="lg" />
            ))}
            {exclusiveNames.length > 0 && (
              <span className="exclusive-badge" title={data.exclusiveNote ?? undefined}>
                Solo {exclusiveNames.join(' / ')}
              </span>
            )}
          </div>

          {versions.length > 1 && (
            <div className="version-selector" role="group" aria-label="Filtrar por versión">
              <button
                type="button"
                className={currentVersion === 'all' ? 'is-active' : ''}
                onClick={() => updateVersion('all')}
                aria-pressed={currentVersion === 'all'}
              >
                Ambas
              </button>
              {versions.map((version) => (
                <button
                  key={version.id}
                  type="button"
                  className={currentVersion === version.id ? 'is-active' : ''}
                  onClick={() => updateVersion(version.id)}
                  aria-pressed={currentVersion === version.id}
                >
                  {version.name}
                </button>
              ))}
            </div>
          )}

          {data.flavor && <p className="detail-flavor">{data.flavor}</p>}

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

            <Link to={nationalLink} className="btn btn-ghost">
              Ficha nacional
              <ChevronRightIcon size={16} />
            </Link>

            {hasKnownAvailability && (
              <Link
                to={`/juegos/${data.gameId}/rutas${currentVersion !== 'all' ? `?version=${currentVersion}` : ''}`}
                className="btn btn-ghost"
              >
                Rutas del juego
                <ChevronRightIcon size={16} />
              </Link>
            )}
          </div>

          <div className="game-pokemon-availability-tags">
            {methods.map((method) => (
              <span className={`method-badge method-badge--${method}`} key={method}>
                {METHOD_LABELS[method] ?? method}
              </span>
            ))}
            {methods.length === 0 && (
              <span className="method-badge method-badge--muted">
                {hasKnownAvailability ? 'Sin método confirmado' : 'Encuentros pendientes'}
              </span>
            )}
            {hasKnownAvailability && locationNames.length > 0 && (
              <span className="game-pokemon-zone-count">
                {locationNames.length} {locationNames.length === 1 ? 'zona' : 'zonas'}
              </span>
            )}
            {unavailableInVersion && (
              <span className="tag tag--warning">
                No disponible en {versionNames[currentVersion] ?? currentVersion}
              </span>
            )}
          </div>
        </div>

        <div className="detail-art-wrap">
          <span className="detail-art-glow" aria-hidden="true" />
          <span className="detail-watermark" aria-hidden="true">
            #{data.nationalNumber.toString().padStart(4, '0')}
          </span>
          <img
            src={image}
            alt={`${data.name}${shiny && supportsShiny ? ' en su variante shiny' : ''}`}
            className="detail-art-img"
          />
          {supportsShiny && (
            <button
              type="button"
              className={`shiny-toggle${shiny ? ' is-active' : ''}`}
              onClick={() => setShiny((value) => !value)}
              aria-pressed={shiny}
            >
              <SparklesIcon size={16} />
              {shiny ? 'Vista normal' : 'Variante shiny'}
            </button>
          )}
        </div>
      </section>

      {gameVersions.length > 1 && (
        <section className="panel game-versions-panel">
          <h2>Versiones del Pokémon</h2>
          <p className="panel-note">
            La misma especie puede tener learnsets, evoluciones y disponibilidad distintas según
            el juego. Cambia de ficha para compararlas.
          </p>

          <div className="game-versions-grid">
            {gameVersions.map((version) => {
              const versionGeneration = getGeneration(version.generation);
              const versionTheme = getGameTheme({
                id: version.gameId,
                generation: version.generation,
              });
              const isCurrent = version.gameId === data.gameId;

              return (
                <Link
                  key={version.gameId}
                  to={`/juegos/${version.gameId}/pokemon/${data.speciesId}`}
                  className={`game-version-card${isCurrent ? ' is-current' : ''}`}
                  style={{
                    '--gen-color': versionTheme.primary,
                    '--gen-color-2': versionTheme.secondary,
                  }}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  <span className="game-version-generation">
                    Generación {versionGeneration.roman}
                  </span>
                  <strong>{version.shortName}</strong>
                  <span className="game-version-dex">
                    {version.regionalNumbers
                      .map((number) => `#${String(number.number).padStart(3, '0')}`)
                      .join(' · ')}
                  </span>
                  <span className="game-version-action">
                    {isCurrent ? 'Viendo ahora' : 'Abrir esta versión'}
                    <ChevronRightIcon size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {pokemonForms.length > 0 && (
        <section className="panel game-forms-panel">
          <h2>Formas</h2>
          <p className="panel-note">
            La forma base va separada de sus variantes regionales, Mega, Gigamax y Totem. La
            ficha base no garantiza que esa forma concreta aparezca en el juego: revisa la
            etiqueta de cada variante.
          </p>

          <div className="game-forms-grid">
            <article className="game-form-card is-base is-current">
              <span className="game-form-kind">Forma base</span>
              <img src={data.image} alt={data.name} loading="lazy" />
              <div className="game-form-copy">
                <strong>{data.name}</strong>
                <div className="game-form-types">
                  {data.types.map((type) => (
                    <TypeBadge key={type} type={type} />
                  ))}
                </div>
                <span className="game-form-state">Ficha base</span>
              </div>
            </article>

            {pokemonForms.map((form) => {
              const inGame = form.games?.includes(data.gameId);
              return (
                <article
                  className={`game-form-card${inGame ? ' is-available' : ''}`}
                  key={`${form.kind}-${form.slug}`}
                >
                  <span className="game-form-kind">{FORM_KIND_LABELS[form.kind] ?? 'Forma'}</span>
                  <img src={form.image} alt={form.name} loading="lazy" />
                  <div className="game-form-copy">
                    <strong>{form.name}</strong>
                    <div className="game-form-types">
                      {form.types.map((type) => (
                        <TypeBadge key={type} type={type} />
                      ))}
                    </div>
                    <span className="game-form-state">
                      {inGame
                        ? form.kind === 'totem'
                          ? 'Encuentro especial en este juego'
                          : 'Disponible en este juego'
                        : 'No disponible en este juego'}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <div className="detail-grid">
        <section className="panel">
          <h2>Datos y disponibilidad</h2>
          <div className="facts">
            <div className="fact">
              <span>Altura</span>
              <strong>{formatMeasure(data.height, 'm')}</strong>
            </div>
            <div className="fact">
              <span>Peso</span>
              <strong>{formatMeasure(data.weight, 'kg')}</strong>
            </div>
            <div className="fact">
              <span>Exp. base</span>
              <strong>{data.baseExperience ?? '—'}</strong>
            </div>
            <div className="fact">
              <span>Nº regional</span>
              <strong>
                {data.regionalNumbers.map((number) => `#${number.number}`).join(' · ')}
              </strong>
            </div>
          </div>

          <div className="divider" />
          <h2>Habilidades</h2>
          {supportsAbilities ? (
            <>
              <ul className="ability-list">
                {visibleAbilities.map((ability) => (
                  <li className="ability-item" key={`${ability.name}-${ability.hidden}`}>
                    <span>{ability.name}</span>
                    {ability.hidden && <span className="tag">Oculta</span>}
                  </li>
                ))}
              </ul>
              {!supportsHiddenAbilities && (
                <p className="game-pokemon-note">
                  Las habilidades ocultas se introdujeron en la Generación V; no se muestran en
                  este juego.
                </p>
              )}
            </>
          ) : (
            <p className="panel-note">
              Las habilidades se introdujeron en la Generación III. En {data.gameShortName} no
              existen.
            </p>
          )}

          <div className="divider" />
          <h2>Dónde encontrarlo</h2>
          {unavailableInVersion ? (
            <p className="panel-note">
              Este Pokémon es exclusivo de {exclusiveNames.join(' / ')} y no está disponible en
              la versión seleccionada.
            </p>
          ) : hasKnownAvailability ? (
            <>
              <div className="game-availability-list">
                {availabilityEntries.map(([versionId, availability]) => {
                  const zoneCount = new Set(
                    (availability.locations ?? []).map((location) => location.areaName),
                  ).size;

                  return (
                    <div className="game-availability-row" key={versionId}>
                      <div>
                        <strong>{versionNames[versionId] ?? versionId}</strong>
                        <span>
                          {availability.methods
                            .map((method) => METHOD_LABELS[method] ?? method)
                            .join(' · ') || 'Sin método confirmado'}
                        </span>
                      </div>
                      <span className="game-availability-count">
                        {zoneCount} {zoneCount === 1 ? 'zona' : 'zonas'}
                      </span>
                    </div>
                  );
                })}
              </div>
              {locationNames.length > 0 && (
                <div className="game-zone-chips">
                  {locationNames.slice(0, 8).map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                  {locationNames.length > 8 && (
                    <Link
                      to={`/juegos/${data.gameId}/rutas${currentVersion !== 'all' ? `?version=${currentVersion}` : ''}`}
                      className="game-zone-more"
                    >
                      +{locationNames.length - 8} zonas
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="panel-note">
              No hay encuentros publicados para este juego en la fuente actual. La dex y las
              evoluciones siguen disponibles.
            </p>
          )}

          {data.exclusiveNote && <p className="game-pokemon-note">{data.exclusiveNote}</p>}
        </section>

        <section className="panel">
          <h2>Estadísticas base</h2>
          <div className="stats-list">
            {data.stats.map((stat) => (
              <div className="stat-row" key={stat.name}>
                <span className="stat-label">{STAT_LABELS[stat.name] ?? stat.name}</span>
                <div className="stat-track">
                  <span
                    className="stat-fill"
                    style={{ width: `${Math.min(100, (stat.value / 180) * 100)}%` }}
                  />
                </div>
                <span className="stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
          <div className="stats-total">
            <span>Total</span>
            <strong>{totalStats}</strong>
          </div>
          {data.generation === 1 && (
            <p className="game-pokemon-note">
              En la Generación I existía una única estadística Especial. Mostramos la referencia
              moderna de Sp. Atk. y Sp. Def.
            </p>
          )}
        </section>
      </div>

      <section className="panel game-learnset-panel">
        <div className="game-panel-head">
          <div>
            <h2>Desarrollo en {data.gameShortName}</h2>
            <p className="panel-note">
              Movimientos por nivel, MT/MO y tutor de este juego. Ajusta el nivel para ver qué
              tiene aprendido.{' '}
              {usesModernDamageSplit
                ? 'Desde la Generación IV cada movimiento tiene su propia categoría: Físico, Especial u Otros (estado).'
                : 'Hasta la Generación III la categoría se deduce del tipo del movimiento: Físico, Especial u Otros (estado).'}
              {data.generation < 4 && (
                <>
                  {' '}
                  Los tipos, la potencia y la precisión son la referencia moderna de PokéAPI;
                  algunos movimientos cambiaron en juegos posteriores.
                </>
              )}
            </p>
          </div>
          <span className="level-pill">
            {moveTab === 'level' ? `Nivel ${level}` : `${activeMoves.length} movimientos`}
          </span>
        </div>

        <div className="learnset-tabs" role="tablist" aria-label="Método de aprendizaje">
          <button
            type="button"
            role="tab"
            aria-selected={moveTab === 'level'}
            className={moveTab === 'level' ? 'is-active' : ''}
            onClick={() => setMoveTab('level')}
          >
            Nivel <span>{data.learnset.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={moveTab === 'tm'}
            className={moveTab === 'tm' ? 'is-active' : ''}
            onClick={() => setMoveTab('tm')}
          >
            MT/MO <span>{tmMoves.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={moveTab === 'tutor'}
            className={moveTab === 'tutor' ? 'is-active' : ''}
            onClick={() => setMoveTab('tutor')}
          >
            Tutor <span>{tutorMoves.length}</span>
          </button>
        </div>

        {moveTab === 'level' && (
          <div className="level-control">
            <label htmlFor="pokemon-level">Nivel de la aventura</label>
            <input
              id="pokemon-level"
              type="range"
              min="1"
              max="100"
              value={level}
              onChange={(event) => setLevel(Number(event.target.value))}
            />
            <div className="level-scale">
              <span>1</span>
              <span>50</span>
              <span>100</span>
            </div>
            <p>
              {learnedMoves.length} de {data.learnset.length} movimientos aprendidos.
            </p>
          </div>
        )}

        {activeMoves.length === 0 ? (
          <p className="panel-note">
            {moveTab === 'level'
              ? 'No hay movimientos por nivel registrados para este juego.'
              : moveTab === 'tm'
                ? 'No hay movimientos de MT/MO registrados para este juego.'
                : 'No hay movimientos de tutor registrados para este juego.'}
          </p>
        ) : (
          <div className="learnset-list">
            {activeMoves.map((move) => {
              const learned = moveTab !== 'level' || move.level <= level;
              return (
                <div
                  className={`learnset-row${learned ? ' is-learned' : ' is-locked'}`}
                  key={`${moveTab}-${move.moveId}-${move.level ?? ''}`}
                >
                  <span className="learnset-level">
                    {moveTab === 'level'
                      ? move.level === 0
                        ? 'Inicial'
                        : `Nv. ${move.level}`
                      : moveTab === 'tm'
                        ? 'MT/MO'
                        : 'Tutor'}
                  </span>
                  <span className="learnset-name">{move.name}</span>
                  <TypeBadge type={move.type} />
                  <span className="learnset-meta">
                    <span>
                      {DAMAGE_CLASS_LABELS[getMoveCategory(move, data.generation)] ?? '—'}
                    </span>
                    <span>Poder {move.power ?? '—'}</span>
                    <span>Prec. {move.accuracy ?? '—'}</span>
                    <span>PP {move.pp ?? '—'}</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel game-evolution-panel">
        <h2>Evoluciones en {data.gameShortName}</h2>
        {data.gameId === 'firered-leafgreen' ? (
          <p className="panel-note">
            Rojo Fuego / Verde Hoja no tienen reloj interno, así que no mostramos evoluciones que
            dependan de la hora del día.
          </p>
        ) : data.generation === 1 ? (
          <p className="panel-note">
            En la Generación I no existían evoluciones por hora, felicidad ni objetos equipados.
            Solo mostramos los métodos compatibles con este juego.
          </p>
        ) : data.generation === 4 ? (
          <p className="panel-note">
            Las evoluciones por localización solo aparecen si el lugar existe en este juego. Las
            ramas de generaciones posteriores no se muestran.
          </p>
        ) : (
          <p className="panel-note">
            Requisitos aplicables a este juego. Las ramas de generaciones posteriores no se
            muestran.
          </p>
        )}

        {data.evolutions && data.evolutions.children.length > 0 ? (
          <div className="evo-tree">
            <EvolutionNode
              node={data.evolutions}
              currentSpeciesId={data.speciesId}
              level={level}
              gameId={data.gameId}
            />
          </div>
        ) : (
          <p className="panel-note">Este Pokémon no evoluciona en este juego.</p>
        )}
      </section>

      <div className="game-dex-actions">
        <Link
          to={`/juegos/${data.gameId}/pokedex${currentVersion !== 'all' ? `?version=${currentVersion}` : ''}`}
          className="btn btn-ghost"
        >
          <ArrowLeftIcon size={16} />
          Volver a la Pokédex
        </Link>
        <Link to={nationalLink} className="btn btn-ghost">
          Ver ficha nacional
          <ChevronRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
}
