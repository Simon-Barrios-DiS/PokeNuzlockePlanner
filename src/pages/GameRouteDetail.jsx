import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { getGeneration } from '../data/generations';
import { getGameTheme } from '../data/gameThemes';
import {
  KIND_LABELS,
  METHOD_LABELS,
  METHOD_ORDER,
  formatCondition,
  getMethodLabel,
} from '../data/gameMeta';
import { useGameRoutes } from '../hooks/useGameRoutes';
import TypeBadge from '../components/TypeBadge';
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  GamepadIcon,
  MapPinIcon,
  Pokeball,
} from '../components/icons';

export default function GameRouteDetail() {
  const { gameId, locationId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectGame } = useGame();
  const { status, data, error, retry } = useGameRoutes(gameId);
  const [methodFilter, setMethodFilter] = useState('all');

  const versionParam = searchParams.get('version') ?? 'all';
  const currentVersion =
    data?.versions.some((version) => version.id === versionParam) ? versionParam : 'all';

  const location = data?.locations.find((item) => item.locationId === locationId);

  const versionNames = useMemo(
    () =>
      Object.fromEntries((data?.versions ?? []).map((version) => [version.id, version.name])),
    [data],
  );

  useEffect(() => {
    if (gameId) selectGame(gameId);
  }, [gameId, selectGame]);

  useEffect(() => {
    if (data && location) {
      document.title = `${location.name} · ${data.shortName} · PokeNuzlockePlanner`;
    }
  }, [data, location]);

  useEffect(() => {
    setMethodFilter('all');
  }, [locationId]);

  function updateVersion(value) {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') next.delete('version');
    else next.set('version', value);
    setSearchParams(next, { replace: true });
  }

  if (status === 'loading') {
    return (
      <div className="page container route-detail-page">
        <span className="skeleton skeleton-line skeleton-line--sm" />
        <div className="game-dex-hero game-dex-hero--loading">
          <div>
            <span className="skeleton skeleton-line skeleton-line--xs" />
            <span className="skeleton skeleton-line skeleton-line--xl" />
            <span className="skeleton skeleton-line skeleton-line--md" />
          </div>
        </div>
        <div className="panel">
          <span className="skeleton skeleton-line skeleton-line--md" />
          <span className="skeleton skeleton-line" />
          <span className="skeleton skeleton-line" />
          <span className="skeleton skeleton-line" />
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
          <h3>No pudimos cargar la ruta</h3>
          <p>{error}</p>
          <button type="button" className="btn btn-primary" onClick={retry}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (status === 'missing' || !data || !location) {
    return (
      <div className="page container">
        <div className="empty-state">
          <div className="empty-ball">
            <Pokeball size={64} />
          </div>
          <h3>Ruta en preparación</h3>
          <p>Esta zona todavía no tiene una tabla de encuentros disponible.</p>
          <Link to={`/juegos/${gameId}/rutas`} className="btn btn-primary">
            Volver a rutas
          </Link>
        </div>
      </div>
    );
  }

  const generation = getGeneration(data.generation);
  const theme = getGameTheme({ id: data.gameId, generation: data.generation });

  const versionEncounters = location.encounters.filter(
    (encounter) =>
      currentVersion === 'all' || encounter.versions.includes(currentVersion),
  );

  const availableMethods = METHOD_ORDER.filter((method) =>
    versionEncounters.some((encounter) => encounter.methodGroup === method),
  );

  const filteredEncounters = versionEncounters.filter(
    (encounter) => methodFilter === 'all' || encounter.methodGroup === methodFilter,
  );

  const groupedEncounters = METHOD_ORDER.map((method) => [
    method,
    filteredEncounters.filter((encounter) => encounter.methodGroup === method),
  ]).filter(([, encounters]) => encounters.length > 0);

  const subAreaLabel = `${location.subAreas.length} ${
    location.subAreas.length === 1 ? 'área' : 'áreas'
  }`;
  const routesHref = `/juegos/${data.gameId}/rutas${
    currentVersion !== 'all' ? `?version=${currentVersion}` : ''
  }`;

  return (
    <div
      className="page container route-detail-page"
      style={{ '--gen-color': theme.primary, '--gen-color-2': theme.secondary }}
    >
      <Link to={routesHref} className="back-btn">
        <ArrowLeftIcon size={18} />
        Rutas de {data.shortName}
      </Link>

      <header className="game-dex-hero">
        <div className="game-dex-copy">
          <span className="eyebrow">
            <GamepadIcon size={16} />
            {KIND_LABELS[location.kind]} · Generación {generation.roman}
          </span>
          <h1>
            {location.name}
            {location.nameFallback && (
              <span className="name-fallback name-fallback--large" title="Nombre pendiente de traducción">
                EN
              </span>
            )}
          </h1>
          <p className="game-dex-subtitle">
            <MapPinIcon size={16} />
            {data.region.name}
            <span>·</span>
            {data.versions.map((version) => version.name).join(' / ')}
            <span>·</span>
            {location.minLevel != null
              ? `Niveles ${location.minLevel}–${location.maxLevel}`
              : 'Niveles sin datos'}
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
          <Pokeball size={130} />
        </div>
      </header>

      <div className="game-dex-stats route-detail-stats">
        <div>
          <strong>{location.speciesCount}</strong>
          <span>especies</span>
        </div>
        <div>
          <strong>{filteredEncounters.length}</strong>
          <span>encuentros visibles</span>
        </div>
        <div>
          <strong>{location.subAreas.length}</strong>
          <span>{location.subAreas.length === 1 ? 'área' : 'áreas'}</span>
        </div>
        <div>
          <strong>{availableMethods.length}</strong>
          <span>métodos</span>
        </div>
      </div>

      <div className="dex-toolbar route-detail-toolbar">
        <label className="dex-select">
          <span>Método</span>
          <select
            value={methodFilter}
            onChange={(event) => setMethodFilter(event.target.value)}
          >
            <option value="all">Todos</option>
            {availableMethods.map((method) => (
              <option key={method} value={method}>
                {METHOD_LABELS[method]}
              </option>
            ))}
          </select>
        </label>

        <span className="route-subareas-note">{subAreaLabel} de esta localización.</span>
      </div>

      {filteredEncounters.length === 0 ? (
        <div className="empty-state">
          <div className="empty-ball">
            <Pokeball size={64} />
          </div>
          <h3>Sin encuentros con esos filtros</h3>
          <p>Prueba con otra versión o método.</p>
        </div>
      ) : (
        <div className="encounter-groups">
          {groupedEncounters.map(([method, encounters]) => (
            <section className="panel encounter-panel" key={method}>
              <h2>
                {METHOD_LABELS[method]}
                <span>{encounters.length} registros</span>
              </h2>

              <div className="encounter-table-wrap">
                <table className="encounter-table">
                  <caption className="sr-only">
                    Encuentros de {location.name}, método {METHOD_LABELS[method]}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Pokémon</th>
                      <th scope="col">Método</th>
                      <th scope="col">Niveles</th>
                      <th scope="col">Prob.</th>
                      <th scope="col">Versiones</th>
                      <th scope="col">Condiciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {encounters.map((encounter, index) => (
                      <tr
                        key={`${encounter.speciesId}-${encounter.method}-${encounter.minLevel}-${encounter.maxLevel}-${index}`}
                      >
                        <td data-label="Pokémon">
                          <Link
                            to={`/juegos/${data.gameId}/pokemon/${encounter.speciesId}${
                              currentVersion !== 'all' ? `?version=${currentVersion}` : ''
                            }`}
                            className="encounter-species"
                          >
                            <img src={encounter.image} alt="" loading="lazy" />
                            <span>
                              <strong>{encounter.name}</strong>
                              <small>#{String(encounter.nationalNumber).padStart(4, '0')}</small>
                            </span>
                          </Link>
                          <div className="encounter-types">
                            {encounter.types.map((type) => (
                              <TypeBadge key={type} type={type} />
                            ))}
                          </div>
                        </td>
                        <td data-label="Método">
                          {getMethodLabel(encounter.method)}
                        </td>
                        <td data-label="Niveles">
                          {encounter.minLevel === encounter.maxLevel
                            ? encounter.minLevel
                            : `${encounter.minLevel}–${encounter.maxLevel}`}
                        </td>
                        <td data-label="Probabilidad">
                          {encounter.chance != null ? `${encounter.chance}%` : '—'}
                        </td>
                        <td data-label="Versiones">
                          <div className="encounter-versions">
                            {(currentVersion === 'all'
                              ? encounter.versions
                              : encounter.versions.filter(
                                  (versionId) => versionId === currentVersion,
                                )
                            ).map((versionId) => (
                              <span className="encounter-version" key={versionId}>
                                {versionNames[versionId] ?? versionId}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td data-label="Condiciones">
                          {encounter.conditions.length > 0 ? (
                            <div className="encounter-conditions">
                              {encounter.conditions.map((condition) => (
                                <span key={condition}>{formatCondition(condition)}</span>
                              ))}
                            </div>
                          ) : (
                            '—'
                          )}
                          {encounter.exclusiveTo.length > 0 && (
                            <span className="exclusive-badge encounter-exclusive">
                              Solo{' '}
                              {encounter.exclusiveTo
                                .map((versionId) => versionNames[versionId] ?? versionId)
                                .join(' / ')}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="game-dex-actions">
        <Link to={routesHref} className="btn btn-ghost">
          <ArrowLeftIcon size={16} />
          Todas las rutas
        </Link>
        <Link to={`/juegos/${data.gameId}/pokedex`} className="btn btn-ghost">
          Pokédex del juego
          <ChevronRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
}
