import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { getGeneration } from '../data/generations';
import { getGameTheme } from '../data/gameThemes';
import { METHOD_LABELS, METHOD_ORDER, formatDexNumber } from '../data/gameMeta';
import { TYPES, TYPE_ORDER } from '../data/types';
import { useGamePokedex } from '../hooks/useGamePokedex';
import SearchBar from '../components/SearchBar';
import TypeBadge from '../components/TypeBadge';
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  GamepadIcon,
  MapPinIcon,
  Pokeball,
} from '../components/icons';

const PAGE_SIZE = 48;

function SkeletonDexCard() {
  return (
    <div className="dex-card dex-card--skeleton" aria-hidden="true">
      <span className="skeleton skeleton-id" />
      <span className="skeleton dex-skeleton-art" />
      <div className="dex-card-body">
        <span className="skeleton skeleton-line skeleton-line--sm" />
        <span className="skeleton skeleton-line skeleton-line--xs" />
      </div>
    </div>
  );
}

export default function GamePokedex() {
  const { gameId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectGame } = useGame();
  const { status, data, error, retry } = useGamePokedex(gameId);

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [onlyExclusive, setOnlyExclusive] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const versionParam = searchParams.get('version') ?? 'all';
  const dexParam = searchParams.get('dex') ?? 'all';

  const currentVersion =
    data?.versions.some((version) => version.id === versionParam) ? versionParam : 'all';
  const currentDex = data?.pokedexes.some((dex) => String(dex.id) === dexParam)
    ? dexParam
    : 'all';

  const versionNameById = useMemo(
    () =>
      Object.fromEntries((data?.versions ?? []).map((version) => [version.id, version.name])),
    [data],
  );

  const selectedDex = data?.pokedexes.find((dex) => String(dex.id) === currentDex) ?? null;

  useEffect(() => {
    if (gameId) selectGame(gameId);
  }, [gameId, selectGame]);

  useEffect(() => {
    if (data) {
      document.title = `Pokédex de ${data.shortName} · PokeNuzlockePlanner`;
    }
  }, [data]);

  useEffect(() => {
    setQuery('');
    setTypeFilter('all');
    setMethodFilter('all');
    setOnlyExclusive(false);
    setOnlyAvailable(false);
  }, [gameId]);

  useEffect(() => {
    if (data && !data.encounterDataAvailable) {
      setOnlyAvailable(false);
      setMethodFilter('all');
    }
  }, [data]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [currentVersion, currentDex, query, typeFilter, methodFilter, onlyExclusive, onlyAvailable]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  }

  function methodsFor(entry, version = currentVersion) {
    if (version === 'all') return entry.methods;
    return entry.availability[version]?.methods ?? [];
  }

  function isAvailable(entry) {
    if (currentVersion === 'all') return entry.hasConfirmedAvailability;
    return Boolean(entry.availability[currentVersion]?.locationCount);
  }

  function dexNumberFor(entry) {
    if (currentDex !== 'all') {
      const regional = entry.regionalNumbers.find(
        (number) => String(number.dexId) === currentDex,
      );
      return regional?.number ?? null;
    }
    return entry.regionalNumbers[0]?.number ?? null;
  }

  function resetFilters() {
    setQuery('');
    setTypeFilter('all');
    setMethodFilter('all');
    setOnlyExclusive(false);
    setOnlyAvailable(false);
    const next = new URLSearchParams(searchParams);
    next.delete('version');
    next.delete('dex');
    setSearchParams(next, { replace: true });
  }

  const scopedEntries = useMemo(() => {
    if (!data) return [];

    return data.entries.filter((entry) => {
      if (
        currentDex !== 'all' &&
        !entry.regionalNumbers.some((number) => String(number.dexId) === currentDex)
      ) {
        return false;
      }

      // Al mirar una versión concreta, no mostramos las exclusivas de la otra.
      if (
        currentVersion !== 'all' &&
        entry.exclusiveTo.length > 0 &&
        !entry.exclusiveTo.includes(currentVersion)
      ) {
        return false;
      }

      return true;
    });
  }, [data, currentDex, currentVersion]);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return scopedEntries
      .filter((entry) => {
        if (typeFilter !== 'all' && !entry.types.includes(typeFilter)) return false;
        if (methodFilter !== 'all' && !methodsFor(entry).includes(methodFilter)) return false;
        if (onlyExclusive && entry.exclusiveTo.length === 0) return false;
        if (onlyAvailable && !isAvailable(entry)) return false;

        if (normalizedQuery) {
          const haystack = [
            entry.name,
            entry.slug,
            String(entry.nationalNumber),
            ...entry.regionalNumbers.map((number) => String(number.number)),
          ]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(normalizedQuery)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aNumber = dexNumberFor(a) ?? 9999;
        const bNumber = dexNumberFor(b) ?? 9999;
        return aNumber - bNumber || a.nationalNumber - b.nationalNumber;
      });
  }, [
    scopedEntries,
    currentDex,
    currentVersion,
    typeFilter,
    methodFilter,
    onlyExclusive,
    onlyAvailable,
    query,
  ]);

  const viewEntryCount = scopedEntries.length;
  const availableCount = data?.encounterDataAvailable
    ? scopedEntries.filter((entry) =>
        currentVersion === 'all'
          ? entry.hasConfirmedAvailability
          : Boolean(entry.availability[currentVersion]?.locationCount),
      ).length
    : null;
  const exclusiveCount = scopedEntries.filter((entry) =>
    currentVersion === 'all'
      ? entry.exclusiveTo.length > 0
      : entry.exclusiveTo.includes(currentVersion),
  ).length;

  if (status === 'loading') {
    return (
      <div className="page container game-dex-page">
        <span className="skeleton skeleton-line skeleton-line--sm" />
        <div className="game-dex-hero game-dex-hero--loading">
          <div>
            <span className="skeleton skeleton-line skeleton-line--xs" />
            <span className="skeleton skeleton-line skeleton-line--xl" />
            <span className="skeleton skeleton-line skeleton-line--md" />
          </div>
        </div>
        <div className="dex-grid" aria-busy="true" aria-label="Cargando Pokédex">
          {Array.from({ length: 12 }, (_, index) => (
            <SkeletonDexCard key={index} />
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
          <h3>No pudimos cargar la Pokédex del juego</h3>
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
          <h3>Pokédex en preparación</h3>
          <p>
            Este juego todavía no tiene una Pokédex generada. Vuelve a la ficha del juego para
            consultar el catálogo y las versiones disponibles.
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
  const availableLabel = data.encounterDataAvailable
    ? 'con método confirmado'
    : 'encuentros pendientes';
  const availableValue = data.encounterDataAvailable ? availableCount : '—';
  const visibleEntries = filteredEntries.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEntries.length;
  const filtersActive =
    query.trim() ||
    typeFilter !== 'all' ||
    methodFilter !== 'all' ||
    onlyExclusive ||
    onlyAvailable ||
    currentVersion !== 'all' ||
    currentDex !== 'all';

  return (
    <div
      className="page container game-dex-page"
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
            Pokédex regional · Generación {generation.roman}
          </span>
          <h1>
            Pokédex de <span>{data.shortName}</span>
          </h1>
          <p className="game-dex-subtitle">
            <MapPinIcon size={16} />
            {data.region.name}
            <span>·</span>
            {data.versions.map((version) => version.name).join(' / ')}
            {data.dlc.length > 0 && (
              <>
                <span>·</span>
                {data.dlc.map((expansion) => expansion.shortName).join(' · ')}
              </>
            )}
          </p>

          {data.versions.length > 1 ? (
            <div className="version-selector" role="group" aria-label="Filtrar por versión">
              <button
                type="button"
                className={currentVersion === 'all' ? 'is-active' : ''}
                onClick={() => updateParam('version', 'all')}
                aria-pressed={currentVersion === 'all'}
              >
                Ambas
              </button>
              {data.versions.map((version) => (
                <button
                  key={version.id}
                  type="button"
                  className={currentVersion === version.id ? 'is-active' : ''}
                  onClick={() => updateParam('version', version.id)}
                  aria-pressed={currentVersion === version.id}
                >
                  {version.name}
                </button>
              ))}
            </div>
          ) : (
            <span className="version-pill">{data.versions[0]?.name}</span>
          )}

          {data.encounterDataAvailable && (
            <Link to={`/juegos/${data.gameId}/rutas`} className="btn btn-ghost btn-sm">
              Rutas y encuentros
              <ChevronRightIcon size={16} />
            </Link>
          )}
        </div>

        <div className="game-dex-mark" aria-hidden="true">
          <Pokeball size={160} />
        </div>
      </header>

      <div className="game-dex-stats">
        <div>
          <strong>{viewEntryCount.toLocaleString('es-ES')}</strong>
          <span>especies</span>
        </div>
        <div>
          <strong>
            {typeof availableValue === 'number'
              ? availableValue.toLocaleString('es-ES')
              : availableValue}
          </strong>
          <span>{availableLabel}</span>
        </div>
        <div>
          <strong>{exclusiveCount.toLocaleString('es-ES')}</strong>
          <span>exclusivas de versión</span>
        </div>
        <div>
          <strong>{data.encounterDataAvailable ? 'PokéAPI' : 'Parcial'}</strong>
          <span>cobertura de encuentros</span>
        </div>
      </div>

      <div className="dex-notice">
        {data.encounterDataAvailable ? (
          <span className="tag">Encuentros disponibles</span>
        ) : (
          <span className="tag tag--warning">Encuentros pendientes</span>
        )}
        <p>
          {data.encounterDataAvailable
            ? 'La disponibilidad se deriva de los encuentros de PokéAPI. El detalle de rutas y niveles está disponible cuando la cobertura del juego lo permite.'
            : 'PokéAPI no publica encuentros de este juego. Mostramos la dex y las exclusividades curadas; las rutas y fichas contextuales no están disponibles por ahora.'}
          {data.encounterDataAvailable && data.availableCount < data.entryCount
            ? ` ${data.availableCount} de ${data.entryCount} especies tienen método confirmado en PokéAPI; el resto queda sin disponibilidad publicada.`
            : ''}
        </p>
      </div>

      {data.versions.length > 1 && (
        <div className="exclusive-legend">
          <span className="exclusive-badge">Exclusiva de versión</span>
          <p>
            {data.exclusivitySource === 'curated'
              ? `Exclusividades curadas para ${data.shortName}.${
                  data.encounterDataAvailable
                    ? ' La disponibilidad se complementa con los encuentros de PokéAPI.'
                    : ' PokéAPI no publica encuentros de este juego; las rutas llegarán cuando haya datos.'
                }`
              : 'Exclusividades calculadas comparando la disponibilidad confirmada en ambas versiones. Pueden faltar evoluciones o métodos que PokéAPI no registra como encuentro.'}
          </p>
        </div>
      )}

      {data.pokedexes.length > 1 && (
        <div className="dex-section-tabs" role="tablist" aria-label="Dex del juego">
          <button
            type="button"
            className={currentDex === 'all' ? 'is-active' : ''}
            onClick={() => updateParam('dex', 'all')}
            role="tab"
            aria-selected={currentDex === 'all'}
          >
            Todas
          </button>
          {data.pokedexes.map((dex) => (
            <button
              key={dex.id}
              type="button"
              className={String(dex.id) === currentDex ? 'is-active' : ''}
              onClick={() => updateParam('dex', String(dex.id))}
              role="tab"
              aria-selected={String(dex.id) === currentDex}
            >
              {dex.name}
              <span>{dex.entryCount}</span>
            </button>
          ))}
        </div>
      )}

      <div className="dex-toolbar">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Busca por nombre o número…"
          showHint={false}
        />

        <label className="dex-select">
          <span>Tipo</span>
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="all">Todos</option>
            {TYPE_ORDER.map((type) => (
              <option key={type} value={type}>
                {TYPES[type].label}
              </option>
            ))}
          </select>
        </label>

        <label className="dex-select">
          <span>Método</span>
          <select
            value={methodFilter}
            onChange={(event) => setMethodFilter(event.target.value)}
            disabled={!data.encounterDataAvailable}
          >
            <option value="all">Todos</option>
            {METHOD_ORDER.map((method) => (
              <option key={method} value={method}>
                {METHOD_LABELS[method]}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className={`dex-toggle${onlyExclusive ? ' is-active' : ''}`}
          onClick={() => setOnlyExclusive((value) => !value)}
          aria-pressed={onlyExclusive}
        >
          Solo exclusivos
        </button>

        <button
          type="button"
          className={`dex-toggle${onlyAvailable ? ' is-active' : ''}`}
          onClick={() => setOnlyAvailable((value) => !value)}
          aria-pressed={onlyAvailable}
          disabled={!data.encounterDataAvailable}
          title={
            data.encounterDataAvailable
              ? 'Mostrar solo Pokémon con un método de obtención confirmado'
              : 'PokéAPI todavía no tiene encuentros de este juego'
          }
        >
          Solo disponibles
        </button>
      </div>

      <div className="dex-results-head">
        <p className="result-count" aria-live="polite">
          {filteredEntries.length.toLocaleString('es-ES')} de{' '}
          {viewEntryCount.toLocaleString('es-ES')} especies
          {selectedDex ? ` · ${selectedDex.name}` : ''}
          {currentVersion !== 'all' ? ` · ${versionNameById[currentVersion]}` : ''}
        </p>
        {filtersActive && (
          <button type="button" className="dex-clear" onClick={resetFilters}>
            Limpiar filtros
          </button>
        )}
      </div>

      {filteredEntries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-ball">
            <Pokeball size={64} />
          </div>
          <h3>No encontramos Pokémon con esos filtros</h3>
          <p>Prueba con otro nombre, tipo, método o versión.</p>
          <button type="button" className="btn btn-primary" onClick={resetFilters}>
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <h2 className="sr-only">Especies de la Pokédex</h2>
          <div className="dex-grid">
            {visibleEntries.map((entry) => {
              const methods = methodsFor(entry);
              const dexNumber = dexNumberFor(entry);
              const selectedAvailability =
                currentVersion === 'all' ? null : entry.availability[currentVersion];
              const noData =
                currentVersion !== 'all' && selectedAvailability && !selectedAvailability.known;
              const exclusiveNames = entry.exclusiveTo
                .map((versionId) => versionNameById[versionId])
                .filter(Boolean);
              const primaryType = entry.types[0];
              const typeColor = TYPES[primaryType]?.color ?? '#7c8aa5';
              const locationCount =
                currentVersion === 'all'
                  ? Object.values(entry.availability).reduce(
                      (total, version) => total + version.locationCount,
                      0,
                    )
                  : (selectedAvailability?.locationCount ?? 0);

              return (
                <Link
                  key={`${entry.speciesId}-${dexNumber ?? 'x'}`}
                  to={`/juegos/${data.gameId}/pokemon/${entry.speciesId}${
                    currentVersion !== 'all' ? `?version=${currentVersion}` : ''
                  }`}
                  className={`dex-card${entry.exclusiveTo.length ? ' is-exclusive' : ''}`}
                  style={{ '--type-color': typeColor }}
                >
                  <span className="dex-card-number">
                    {dexNumber == null ? '—' : `#${formatDexNumber(dexNumber)}`}
                  </span>

                  <div className="dex-card-art">
                    <span className="dex-card-glow" aria-hidden="true" />
                    <img
                      src={entry.image}
                      alt={entry.name}
                      loading="lazy"
                      width="150"
                      height="150"
                    />
                  </div>

                  <div className="dex-card-body">
                    <h3>{entry.name}</h3>
                    <div className="dex-card-types">
                      {entry.types.map((type) => (
                        <TypeBadge key={type} type={type} />
                      ))}
                    </div>

                    <div className="dex-card-badges">
                      {methods.length > 0 ? (
                        methods.map((method) => (
                          <span
                            className={`method-badge method-badge--${method}`}
                            key={method}
                          >
                            {METHOD_LABELS[method]}
                          </span>
                        ))
                      ) : noData ? (
                        <span className="method-badge method-badge--muted">Sin datos</span>
                      ) : data.encounterDataAvailable ? (
                        <span className="method-badge method-badge--muted">
                          Dex solamente
                        </span>
                      ) : (
                        <span className="method-badge method-badge--muted">
                          Encuentros pendientes
                        </span>
                      )}

                      {exclusiveNames.length > 0 && (
                        <span
                          className="exclusive-badge"
                          title={entry.exclusiveNote ?? undefined}
                        >
                          Solo {exclusiveNames.join(' / ')}
                        </span>
                      )}
                    </div>

                    {locationCount > 0 && (
                      <span className="dex-location-count">
                        {locationCount} {locationCount === 1 ? 'zona' : 'zonas'}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {hasMore && (
            <div className="load-more">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  setVisibleCount((current) =>
                    Math.min(current + PAGE_SIZE, filteredEntries.length),
                  )
                }
              >
                Cargar más Pokémon
              </button>
            </div>
          )}

          {!hasMore && filteredEntries.length > PAGE_SIZE && (
            <p className="end-note">
              Has visto las {filteredEntries.length.toLocaleString('es-ES')} especies de este
              filtro.
            </p>
          )}
        </>
      )}

      <div className="game-dex-actions">
        <Link to={`/juegos/${data.gameId}`} className="btn btn-ghost">
          <ArrowLeftIcon size={16} />
          Ficha del juego
        </Link>
        {data.encounterDataAvailable && (
          <Link to={`/juegos/${data.gameId}/rutas`} className="btn btn-ghost">
            Rutas y encuentros
            <ChevronRightIcon size={16} />
          </Link>
        )}
        <Link to={`/juegos/${data.gameId}/pokedex`} className="btn btn-ghost">
          Reiniciar vista
          <ChevronRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
}
