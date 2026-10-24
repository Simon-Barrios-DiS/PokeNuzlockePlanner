import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { getGeneration } from '../data/generations';
import { getGameTheme } from '../data/gameThemes';
import {
  KIND_LABELS,
  KIND_ORDER,
  METHOD_LABELS,
  METHOD_ORDER,
  getMethodLabel,
} from '../data/gameMeta';
import { useGameRoutes } from '../hooks/useGameRoutes';
import { HGSS_CHAPTERS, HGSS_RED } from '../data/hgssProgress';
import SearchBar from '../components/SearchBar';
import TypeBadge from '../components/TypeBadge';
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  GamepadIcon,
  MapPinIcon,
  Pokeball,
} from '../components/icons';

function RouteCardSkeleton() {
  return (
    <article className="route-card route-card--skeleton" aria-hidden="true">
      <div className="route-card-head">
        <span className="skeleton skeleton-line skeleton-line--xs" />
        <span className="skeleton skeleton-line skeleton-line--xs" />
      </div>
      <span className="skeleton skeleton-line skeleton-line--md" />
      <span className="skeleton skeleton-line skeleton-line--sm" />
      <span className="skeleton skeleton-badge" />
    </article>
  );
}

export default function GameRoutes() {
  const { gameId } = useParams();
  const { selectGame } = useGame();
  const [searchParams, setSearchParams] = useSearchParams();
  const { status, data, error, retry } = useGameRoutes(gameId);
  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const versionParam = searchParams.get('version') ?? 'all';
  const currentVersion =
    data?.versions.some((version) => version.id === versionParam) ? versionParam : 'all';

  const versionNames = useMemo(
    () =>
      Object.fromEntries((data?.versions ?? []).map((version) => [version.id, version.name])),
    [data],
  );

  useEffect(() => {
    if (gameId) selectGame(gameId);
  }, [gameId, selectGame]);

  useEffect(() => {
    if (data) document.title = `Rutas de ${data.shortName} · PokeNuzlockePlanner`;
  }, [data]);

  useEffect(() => {
    setQuery('');
    setKindFilter('all');
    setMethodFilter('all');
  }, [gameId]);

  function updateVersion(value) {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') next.delete('version');
    else next.set('version', value);
    setSearchParams(next, { replace: true });
  }

  function resetFilters() {
    setQuery('');
    setKindFilter('all');
    setMethodFilter('all');
    const next = new URLSearchParams(searchParams);
    next.delete('version');
    setSearchParams(next, { replace: true });
  }

  const filteredLocations = useMemo(() => {
    if (!data) return [];
    const normalizedQuery = query.trim().toLowerCase();

    return data.locations.filter((location) => {
      if (currentVersion !== 'all' && !location.versions.includes(currentVersion)) {
        return false;
      }
      if (kindFilter !== 'all' && location.kind !== kindFilter) return false;
      if (methodFilter !== 'all' && !location.methods.includes(methodFilter)) return false;

      if (normalizedQuery) {
        const haystack = [location.name, location.locationId, location.kind]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }

      return true;
    });
  }, [data, currentVersion, kindFilter, methodFilter, query]);

  const groupedLocations = useMemo(() => {
    const groups = new Map();

    filteredLocations.forEach((location) => {
      if (!groups.has(location.kind)) groups.set(location.kind, []);
      groups.get(location.kind).push(location);
    });

    return KIND_ORDER.filter((kind) => groups.has(kind)).map((kind) => [
      kind,
      groups.get(kind),
    ]);
  }, [filteredLocations]);

  if (status === 'loading') {
    return (
      <div className="page container game-routes-page">
        <span className="skeleton skeleton-line skeleton-line--sm" />
        <div className="game-dex-hero game-dex-hero--loading">
          <div>
            <span className="skeleton skeleton-line skeleton-line--xs" />
            <span className="skeleton skeleton-line skeleton-line--xl" />
            <span className="skeleton skeleton-line skeleton-line--md" />
          </div>
        </div>
        <div className="routes-grid">
          {Array.from({ length: 9 }, (_, index) => (
            <RouteCardSkeleton key={index} />
          ))}
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
          <h3>No pudimos cargar las rutas</h3>
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
          <h3>Rutas en preparación</h3>
          <p>
            Por ahora las tablas de encuentros están disponibles para los juegos con datos
            completos. El resto de juegos se incorporará más adelante.
          </p>
          <Link to={`/juegos/${gameId}`} className="btn btn-primary">
            Volver a la ficha del juego
          </Link>
        </div>
      </div>
    );
  }

  const generation = getGeneration(data.generation);
  const theme = getGameTheme({ id: data.gameId, generation: data.generation });
  const encounterCount = data.locations.reduce(
    (total, location) => total + location.encounterCount,
    0,
  );
  const hgssProgress =
    data.gameId === 'heartgold-soulsilver'
      ? HGSS_CHAPTERS.map((chapter) => {
          const locations = data.locations.filter(
            (location) =>
              chapter.matches(location.locationId) &&
              (chapter.id === 'mt-silver' || location.kind === 'route'),
          );
          const routeCount = locations.filter((location) => location.kind === 'route').length;
          const chapterEncounters = locations.reduce(
            (total, location) => total + location.encounterCount,
            0,
          );
          const levels = locations.filter((location) => location.minLevel != null);

          return {
            ...chapter,
            routeCount,
            encounterCount: chapterEncounters,
            locationCount: locations.length,
            minLevel: levels.length
              ? Math.min(...levels.map((location) => location.minLevel))
              : null,
            maxLevel: levels.length
              ? Math.max(...levels.map((location) => location.maxLevel))
              : null,
          };
        })
      : [];
  const hgssRouteCount = hgssProgress.reduce((total, chapter) => total + chapter.routeCount, 0);
  const hgssRouteEncounters = hgssProgress.reduce(
    (total, chapter) => total + chapter.encounterCount,
    0,
  );
  const fallbackCount = data.locations.filter((location) => location.nameFallback).length;
  const filtersActive =
    query.trim() || kindFilter !== 'all' || methodFilter !== 'all' || currentVersion !== 'all';

  return (
    <div
      className="page container game-routes-page"
      style={{ '--gen-color': theme.primary, '--gen-color-2': theme.secondary }}
    >
      <Link to={`/juegos/${data.gameId}`} className="back-btn">
        <ArrowLeftIcon size={18} />
        {data.shortName}
      </Link>

      <header className="game-dex-hero">
        <div className="game-dex-copy">
          <span className="eyebrow">
            <GamepadIcon size={16} />
            Rutas y encuentros · Generación {generation.roman}
          </span>
          <h1>
            Rutas de <span>{data.shortName}</span>
          </h1>
          <p className="game-dex-subtitle">
            <MapPinIcon size={16} />
            {data.region.name}
            <span>·</span>
            {data.versions.map((version) => version.name).join(' / ')}
          </p>

          {data.versions.length > 1 && (
            <div className="version-selector" role="group" aria-label="Filtrar por versión">
              <button
                type="button"
                className={currentVersion === 'all' ? 'is-active' : ''}
                onClick={() => updateVersion('all')}
                aria-pressed={currentVersion === 'all'}
              >
                Ambas
              </button>
              {data.versions.map((version) => (
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
        </div>

        <div className="game-dex-mark" aria-hidden="true">
          <Pokeball size={150} />
        </div>
      </header>

      <div className="game-dex-stats">
        <div>
          <strong>{data.numberedRouteCount}</strong>
          <span>rutas numeradas</span>
        </div>
        <div>
          <strong>{data.locationCount}</strong>
          <span>zonas con encuentros</span>
        </div>
        <div>
          <strong>{data.areaCount}</strong>
          <span>áreas de juego</span>
        </div>
        <div>
          <strong>{encounterCount}</strong>
          <span>encuentros registrados</span>
        </div>
      </div>

      {data.gameId === 'heartgold-soulsilver' && (
        <section className="panel hgss-progress-panel">
          <div className="section-head">
            <div>
              <h2>Progreso hasta Red</h2>
              <p className="panel-note">
                Cálculo sobre las rutas principales y Monte Plata. No suma ciudades, cuevas
                secundarias ni regalos; sirve para situar la recta final de la aventura.
              </p>
            </div>
            <span className="tag">Objetivo · Nv. {HGSS_RED.targetLevel}</span>
          </div>

          <div className="hgss-progress-grid">
            {hgssProgress.map((chapter) => (
              <article className="hgss-chapter-card" key={chapter.id}>
                <span className="hgss-chapter-eyebrow">{chapter.eyebrow}</span>
                <h3>{chapter.name}</h3>
                <p>{chapter.description}</p>
                <div className="hgss-chapter-stats">
                  <span>
                    <strong>{chapter.routeCount || chapter.locationCount}</strong>{' '}
                    {chapter.routeCount ? 'rutas' : 'zona'}
                  </span>
                  <span>
                    <strong>{chapter.encounterCount.toLocaleString('es-ES')}</strong> encuentros
                  </span>
                  <span>
                    Niv. {chapter.minLevel ?? '—'}–{chapter.maxLevel ?? '—'}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <article className="hgss-red-card">
            <div className="hgss-red-copy">
              <span className="hgss-chapter-eyebrow">Combate final · Monte Plata</span>
              <h3>Red</h3>
              <p>
                El último combate de HGSS. El objetivo práctico es llegar cerca del nivel{' '}
                {HGSS_RED.targetLevel}; su equipo completo está entre Nv. 80 y Nv. 88.
              </p>
              <Link
                to={`/juegos/${data.gameId}/rutas/mt-silver${
                  currentVersion !== 'all' ? `?version=${currentVersion}` : ''
                }`}
                className="btn btn-ghost"
              >
                Ver encuentros de Monte Plata
                <ChevronRightIcon size={16} />
              </Link>
            </div>

            <div className="hgss-red-team">
              {HGSS_RED.team.map((member) => (
                <div className="hgss-red-member" key={member.name}>
                  <div>
                    <span>{member.name}</span>
                    <strong>Nv. {member.level}</strong>
                  </div>
                  <div className="hgss-red-types">
                    {member.types.map((type) => (
                      <TypeBadge key={type} type={type} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <p className="hgss-progress-total">
            {hgssRouteCount} rutas principales · {hgssRouteEncounters.toLocaleString('es-ES')}{' '}
            encuentros de ruta · final en Monte Plata.
          </p>
        </section>
      )}

      <div className="dex-notice">
        <span className="tag">PokéAPI</span>
        <p>
          Niveles, métodos y probabilidades provienen de los encuentros de PokéAPI.{' '}
          {data.region.id === 'johto'
            ? 'En los juegos de Johto las rutas de esta región aparecen antes que las de Kanto, que son post-game.'
            : 'Las rutas siguen el orden de la aventura y las zonas secundarias se agrupan por tipo.'}
          {fallbackCount > 0
            ? ` ${fallbackCount} nombres de zona están pendientes de traducción y se marcan con “EN”.`
            : ''}
          {data.coverageNote ? ` ${data.coverageNote}` : ''}
        </p>
      </div>

      <div className="dex-toolbar">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Busca una ruta o zona…"
          showHint={false}
        />

        <label className="dex-select">
          <span>Tipo</span>
          <select value={kindFilter} onChange={(event) => setKindFilter(event.target.value)}>
            <option value="all">Todas</option>
            {KIND_ORDER.map((kind) => (
              <option key={kind} value={kind}>
                {KIND_LABELS[kind]}
              </option>
            ))}
          </select>
        </label>

        <label className="dex-select">
          <span>Método</span>
          <select
            value={methodFilter}
            onChange={(event) => setMethodFilter(event.target.value)}
          >
            <option value="all">Todos</option>
            {METHOD_ORDER.map((method) => (
              <option key={method} value={method}>
                {METHOD_LABELS[method]}
              </option>
            ))}
          </select>
        </label>

        {filtersActive && (
          <button type="button" className="dex-clear" onClick={resetFilters}>
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="dex-results-head">
        <p className="result-count" aria-live="polite">
          {filteredLocations.length} de {data.locationCount} zonas
          {currentVersion !== 'all' ? ` · ${versionNames[currentVersion]}` : ''}
        </p>
      </div>

      {filteredLocations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-ball">
            <Pokeball size={64} />
          </div>
          <h3>No encontramos zonas con esos filtros</h3>
          <p>Prueba con otro nombre, tipo o método.</p>
          <button type="button" className="btn btn-primary" onClick={resetFilters}>
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="route-sections">
          {groupedLocations.map(([kind, locations]) => (
            <section className="route-section" key={kind}>
              <div className="route-section-head">
                <h2>{KIND_LABELS[kind]}</h2>
                <span>{locations.length} zonas</span>
              </div>

              <div className="routes-grid">
                {locations.map((location) => {
                  const versionNamesForCard = location.versions
                    .map((versionId) => versionNames[versionId])
                    .filter(Boolean);
                  const href = `/juegos/${data.gameId}/rutas/${location.locationId}${
                    currentVersion !== 'all' ? `?version=${currentVersion}` : ''
                  }`;

                  return (
                    <Link to={href} className="route-card" key={location.locationId}>
                      <div className="route-card-head">
                        <span className={`route-kind route-kind--${kind}`}>
                          {kind === 'route' && location.order != null
                            ? `Ruta ${location.order}`
                            : KIND_LABELS[kind]}
                        </span>
                        {location.nameFallback && (
                          <span className="name-fallback" title="Nombre pendiente de traducción">
                            EN
                          </span>
                        )}
                      </div>

                      <h3>{location.name}</h3>

                      <p className="route-meta">
                        {location.speciesCount} especies ·{' '}
                        {location.minLevel != null
                          ? `Niv. ${location.minLevel}–${location.maxLevel}`
                          : 'Nivel sin datos'}
                      </p>

                      <div className="route-card-badges">
                        {location.methods.map((method) => (
                          <span
                            className={`method-badge method-badge--${method}`}
                            key={method}
                          >
                            {METHOD_LABELS[method]}
                          </span>
                        ))}
                      </div>

                      <div className="route-card-footer">
                        <span>{versionNamesForCard.join(' / ') || 'Todas las versiones'}</span>
                        <span className="route-card-action">
                          Ver encuentros
                          <ChevronRightIcon size={15} />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="game-dex-actions">
        <Link to={`/juegos/${data.gameId}`} className="btn btn-ghost">
          <ArrowLeftIcon size={16} />
          Ficha del juego
        </Link>
        <Link to={`/juegos/${data.gameId}/pokedex`} className="btn btn-ghost">
          Pokédex del juego
          <ChevronRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
}
