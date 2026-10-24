import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { GENERATIONS } from '../data/generations';
import { useGames } from '../hooks/useGames';
import GameCard from '../components/GameCard';
import GameCardSkeleton from '../components/GameCardSkeleton';
import SearchBar from '../components/SearchBar';
import { ChevronRightIcon, GamepadIcon, Pokeball } from '../components/icons';

function formatDate(value) {
  if (!value) return null;

  try {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value));
  } catch {
    return null;
  }
}

function matchesQuery(game, query) {
  if (!query) return true;

  const haystack = [
    game.name,
    game.shortName,
    game.region.name,
    ...game.versions.map((version) => version.name),
    ...game.dlc.flatMap((expansion) => [
      expansion.name,
      expansion.shortName,
      ...expansion.pokedexes.map((dex) => dex.name),
    ]),
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}

export default function Games() {
  const { games, status, error, generatedAt, retry } = useGames();
  const { selectedGameId } = useGame();
  const [query, setQuery] = useState('');
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    document.title = 'Juegos · PokeNuzlockePlanner';
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const selectedGame = games.find((game) => game.id === selectedGameId);

  const filteredGames = useMemo(
    () =>
      games
        .filter((game) => (generation ? game.generation === generation : true))
        .filter((game) => matchesQuery(game, normalizedQuery)),
    [games, generation, normalizedQuery],
  );

  const generationSections = useMemo(() => {
    const groups = new Map();

    filteredGames.forEach((game) => {
      if (!groups.has(game.generation)) groups.set(game.generation, []);
      groups.get(game.generation).push(game);
    });

    return [...groups.entries()].sort(([a], [b]) => a - b);
  }, [filteredGames]);

  const dlcCount = games.reduce((total, game) => total + game.dlc.length, 0);
  const isLoading = status === 'loading';
  const hasError = status === 'error';

  return (
    <div className="page games-page">
      <section className="games-hero container">
        <div className="games-hero-copy">
          <span className="eyebrow">
            <GamepadIcon size={16} />
            Compañero de aventura
          </span>
          <h1>
            Elige tu <span className="gradient-text">juego</span>
          </h1>
          <p>
            Consulta la Pokédex de cada juego principal y sus DLC. Gen I–VIII ya tienen rutas,
            encuentros, learnsets y evoluciones; SV y BDSP muestran la dex y sus exclusividades.
          </p>

          <div className="games-hero-stats">
            <span>
              <strong>{isLoading ? '—' : games.length}</strong> juegos
            </span>
            <span>
              <strong>{isLoading ? '—' : dlcCount}</strong> DLC
            </span>
            <span>
              <strong>9</strong> generaciones
            </span>
          </div>
        </div>

        {selectedGame && (
          <Link to={`/juegos/${selectedGame.id}`} className="games-continue">
            <span className="games-continue-label">Continuar aventura</span>
            <strong>{selectedGame.shortName}</strong>
            <span className="games-continue-meta">{selectedGame.region.name}</span>
            <ChevronRightIcon size={20} />
          </Link>
        )}
      </section>

      <section className="games-catalog container" aria-labelledby="games-title">
        <div className="section-head">
          <div>
            <h2 id="games-title">Catálogo de juegos</h2>
            <p className="result-count" aria-live="polite">
              {isLoading
                ? 'Cargando catálogo…'
                : `${filteredGames.length} ${
                    filteredGames.length === 1 ? 'juego' : 'juegos'
                  } disponibles`}
            </p>
          </div>

          <Link to="/" className="games-national-link">
            Pokédex nacional
            <ChevronRightIcon size={16} />
          </Link>
        </div>

        <div className="games-toolbar">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Busca un juego, región o versión…"
            showHint={false}
          />

          <div className="generation-filter" role="group" aria-label="Filtrar por generación">
            <button
              type="button"
              className={`type-chip${generation === 0 ? ' is-active' : ''}`}
              onClick={() => setGeneration(0)}
              aria-pressed={generation === 0}
            >
              Todas
            </button>
            {GENERATIONS.map((item) => (
              <button
                key={item.number}
                type="button"
                className={`type-chip${generation === item.number ? ' is-active' : ''}`}
                style={{ '--type-color': item.color }}
                onClick={() => setGeneration(item.number)}
                aria-pressed={generation === item.number}
                aria-label={`Generación ${item.roman}`}
              >
                {item.roman}
              </button>
            ))}
          </div>
        </div>

        {hasError ? (
          <div className="empty-state error-state">
            <div className="empty-ball">
              <Pokeball size={64} />
            </div>
            <h3>No pudimos cargar el catálogo</h3>
            <p>{error}</p>
            <button type="button" className="btn btn-primary" onClick={retry}>
              Reintentar
            </button>
          </div>
        ) : isLoading ? (
          <div className="games-grid" aria-busy="true" aria-label="Cargando juegos">
            {Array.from({ length: 8 }, (_, index) => (
              <GameCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="empty-state">
            <div className="empty-ball">
              <Pokeball size={64} />
            </div>
            <h3>No encontramos ese juego</h3>
            <p>Prueba con otro nombre, región o generación.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setQuery('');
                setGeneration(0);
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="generation-sections">
              {generationSections.map(([generationNumber, items]) => {
                const item = GENERATIONS.find((entry) => entry.number === generationNumber);
                return (
                  <section className="generation-section" key={generationNumber}>
                    <div className="generation-head">
                      <h3>
                        <span
                          className="generation-dot"
                          style={{ '--gen-color': item?.color ?? '#7c8aa5' }}
                        />
                        Generación {item?.roman ?? generationNumber}
                      </h3>
                      <span>{items.length} juegos</span>
                    </div>

                    <div className="games-grid">
                      {items.map((game, index) => (
                        <GameCard key={game.id} game={game} index={index} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            <p className="catalog-note">
              Catálogo base generado desde PokéAPI
              {formatDate(generatedAt) ? ` · actualizado el ${formatDate(generatedAt)}` : ''}. La
              Pokédex regional, las rutas y los learnsets se incorporan en las próximas fases.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
