import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { getGeneration } from '../data/generations';
import { getGameTheme } from '../data/gameThemes';
import { useGames } from '../hooks/useGames';
import LevelCapsPanel from '../components/LevelCapsPanel';
import { ArrowLeftIcon, ChevronRightIcon, GamepadIcon, MapPinIcon, Pokeball } from '../components/icons';

export default function GameDetail() {
  const { gameId } = useParams();
  const { games, status, error, retry } = useGames();
  const { selectGame } = useGame();
  const game = games.find((item) => item.id === gameId);

  useEffect(() => {
    if (!game) return;
    selectGame(game.id);
    document.title = `${game.name} · PokeNuzlockePlanner`;
  }, [game, selectGame]);

  if (status === 'loading') {
    return (
      <div className="page container game-detail-page">
        <span className="skeleton skeleton-line skeleton-line--sm" />
        <div className="game-detail-hero game-detail-hero--loading" aria-busy="true">
          <div>
            <span className="skeleton skeleton-line skeleton-line--xs" />
            <span className="skeleton skeleton-line skeleton-line--xl" />
            <span className="skeleton skeleton-line skeleton-line--md" />
          </div>
          <span className="skeleton skeleton-art-large" />
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
          <h3>No pudimos cargar el juego</h3>
          <p>{error}</p>
          <button type="button" className="btn btn-primary" onClick={retry}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="page container">
        <div className="empty-state">
          <div className="empty-ball">
            <Pokeball size={64} />
          </div>
          <h3>Ese juego no está en el catálogo</h3>
          <p>Quizá la dirección está mal escrita o el juego queda fuera del alcance actual.</p>
          <Link to="/juegos" className="btn btn-primary">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const generation = getGeneration(game.generation);
  const theme = getGameTheme(game);
  const dlcCount = game.dlc.length;
  const hasRoutes = Boolean(game.routesAvailable);
  const routesPaused = game.id === 'scarlet-violet';
  const routesUnavailable = game.pilot && !hasRoutes && !routesPaused;

  return (
    <div
      className="page container game-detail-page"
      style={{ '--gen-color': theme.primary, '--gen-color-2': theme.secondary }}
    >
      <Link to="/juegos" className="back-btn">
        <ArrowLeftIcon size={18} />
        Catálogo de juegos
      </Link>

      <header className="game-detail-hero">
        <div className="game-detail-copy">
          <span className="eyebrow">
            <GamepadIcon size={16} />
            Generación {generation.roman} · Juego principal
          </span>
          <h1>{game.name}</h1>

          <p className="game-detail-meta">
            <MapPinIcon size={16} />
            {game.region.name}
            <span>·</span>
            {game.releaseYear}
            <span>·</span>
            {game.versions.length} {game.versions.length === 1 ? 'versión' : 'versiones'}
          </p>

          <div className="game-detail-versions">
            {game.versions.map((version) =>
              game.pilot ? (
                <Link
                  className="version-pill version-pill--link"
                  key={version.id}
                  to={`/juegos/${game.id}/pokedex?version=${version.id}`}
                >
                  {version.name}
                </Link>
              ) : (
                <span className="version-pill" key={version.id}>
                  {version.name}
                </span>
              ),
            )}
            {dlcCount > 0 && (
              <span className="version-pill version-pill--dlc">
                + {dlcCount} DLC
              </span>
            )}
          </div>

          <div className="game-detail-status">
            <span className={`tag${game.pilot ? '' : ' tag--muted'}`}>
              {game.pilot ? (hasRoutes ? 'Piloto · Fase 4' : 'Piloto · Fase 2') : 'Catálogo base'}
            </span>
            <span className="game-detail-status-note">
              {game.pilot
                ? hasRoutes
                  ? 'Pokédex, exclusividades, rutas y fichas disponibles.'
                  : 'Pokédex regional y exclusividades disponibles.'
                : 'Datos de esta fase: identidad, dex y versiones.'}
            </span>
          </div>

          {game.pilot && (
            <div className="game-detail-cta-row">
              <Link to={`/juegos/${game.id}/pokedex`} className="btn btn-primary">
                Abrir Pokédex
                <ChevronRightIcon size={16} />
              </Link>
              {hasRoutes && (
                <Link to={`/juegos/${game.id}/rutas`} className="btn btn-ghost">
                  Rutas y encuentros
                  <ChevronRightIcon size={16} />
                </Link>
              )}
              {hasRoutes && (
                <Link
                  to={`/equipos?game=${game.id}&version=${game.versions[0]?.id ?? ''}`}
                  className="btn btn-ghost"
                >
                  Crear equipo
                  <ChevronRightIcon size={16} />
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="game-detail-mark" aria-hidden="true">
          <Pokeball size={180} />
        </div>
      </header>

      <div className="game-detail-stats">
        <div>
          <strong>{game.speciesCount.toLocaleString('es-ES')}</strong>
          <span>especies</span>
        </div>
        <div>
          <strong>{game.pokedexes.length}</strong>
          <span>{game.pokedexes.length === 1 ? 'dex' : 'dex incluidas'}</span>
        </div>
        <div>
          <strong>{game.versions.length}</strong>
          <span>{game.versions.length === 1 ? 'versión' : 'versiones'}</span>
        </div>
        <div>
          <strong>{dlcCount}</strong>
          <span>DLC</span>
        </div>
      </div>

      <LevelCapsPanel gameId={game.id} />

      <div className="game-detail-grid">
        <section className="panel">
          <h2>Pokédex del juego</h2>
          <p className="panel-note">
            {game.pilot
              ? hasRoutes
                ? 'La Pokédex regional, la disponibilidad y las rutas ya están disponibles.'
                : 'La Pokédex regional y las exclusividades ya están disponibles. Las rutas de SV quedan en pausa.'
              : 'Estas son las dex que componen el juego. La lista de especies y su disponibilidad se habilitará en una próxima fase.'}
          </p>

          <ul className="dex-list">
            {game.pokedexes.map((dex) => (
              <li key={dex.id}>
                <span>{dex.name}</span>
                <strong>{dex.entryCount.toLocaleString('es-ES')} entradas</strong>
              </li>
            ))}
          </ul>

          <div className="game-source-note">
            <span className="tag">Catálogo</span>
            <span>
              {hasRoutes
                ? 'Datos base generados desde PokéAPI. Rutas, fichas, learnsets y evoluciones disponibles para los juegos con datos completos.'
                : routesUnavailable
                  ? 'Datos base generados desde PokéAPI. Este juego no tiene encuentros publicados: mostramos dex y exclusividades.'
                  : 'Datos base generados desde PokéAPI. Las rutas y los learnsets llegarán en próximas fases.'}
            </span>
          </div>
        </section>

        <section className="panel">
          <h2>Versiones</h2>
          <ul className="version-list">
            {game.versions.map((version) => (
              <li key={version.id}>
                <span className="version-number">V</span>
                <span>{version.name}</span>
              </li>
            ))}
          </ul>

          {dlcCount > 0 && (
            <>
              <div className="divider" />
              <h2>Contenido DLC</h2>
              <ul className="dlc-list">
                {game.dlc.map((expansion) => (
                  <li key={expansion.id}>
                    <div>
                      <strong>{expansion.name}</strong>
                      <span>
                        {expansion.releaseYear} ·{' '}
                        {expansion.pokedexes.map((dex) => dex.name).join(' · ')}
                      </span>
                    </div>
                    <span className="tag">DLC</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      <section className="panel game-next-panel">
        <div className="section-head">
          <div>
            <h2>Capas de datos</h2>
            <p className="panel-note">
              Estas son las capas disponibles en esta ficha y las que faltan por completar.
            </p>
          </div>
        </div>

        <div className="phase-grid">
          <article className="phase-card">
            <span className="phase-number">Fase 2</span>
            <h3>Pokédex y disponibilidad</h3>
            <p>Lista regional, tipos, exclusividades y métodos de obtención por versión.</p>
            <span className={`phase-state${game.pilot ? ' is-ready' : ''}`}>
              {game.pilot ? 'Disponible' : 'Próximamente'}
            </span>
          </article>
          <article className="phase-card">
            <span className="phase-number">Fase 3</span>
            <h3>Rutas y encuentros</h3>
            <p>Áreas, niveles, probabilidades, regalos y condiciones especiales.</p>
            <span
              className={`phase-state${
                hasRoutes ? ' is-ready' : routesPaused || routesUnavailable ? ' is-paused' : ''
              }`}
            >
              {hasRoutes
                ? 'Disponible'
                : routesPaused
                  ? 'En pausa'
                  : routesUnavailable
                    ? 'Sin datos'
                    : 'Próximamente'}
            </span>
          </article>
          <article className="phase-card">
            <span className="phase-number">Fase 4</span>
            <h3>Learnsets y evoluciones</h3>
            <p>Movimientos por nivel, requisitos de evolución y desarrollo en el juego.</p>
            <span
              className={`phase-state${
                hasRoutes ? ' is-ready' : routesPaused || routesUnavailable ? ' is-paused' : ''
              }`}
            >
              {hasRoutes
                ? 'Disponible'
                : routesPaused
                  ? 'En pausa'
                  : routesUnavailable
                    ? 'Sin datos'
                    : 'Próximamente'}
            </span>
          </article>
        </div>
      </section>

      <div className="game-detail-actions">
        <Link to="/juegos" className="btn btn-ghost">
          <ArrowLeftIcon size={16} />
          Cambiar de juego
        </Link>
        {hasRoutes && (
          <Link to={`/juegos/${game.id}/rutas`} className="btn btn-ghost">
            Rutas y encuentros
            <ChevronRightIcon size={16} />
          </Link>
        )}
        {game.pilot ? (
          <Link to={`/juegos/${game.id}/pokedex`} className="btn btn-primary">
            Abrir la Pokédex del juego
            <ChevronRightIcon size={16} />
          </Link>
        ) : (
          <Link to="/" className="btn btn-primary">
            Explorar la Pokédex nacional
            <ChevronRightIcon size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
