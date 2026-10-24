import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { GENERATION_ROMANS } from '../data/generations';
import { getGameTheme } from '../data/gameThemes';
import { ChevronRightIcon } from './icons';

export default function GameCard({ game, index = 0 }) {
  const { selectGame } = useGame();
  const generationRoman = GENERATION_ROMANS[game.generation - 1] ?? game.generation;
  const theme = getGameTheme(game);

  return (
    <Link
      to={`/juegos/${game.id}`}
      className="game-card"
      style={{
        '--gen-color': theme.primary,
        '--gen-color-2': theme.secondary,
        '--delay': `${Math.min(index, 12) * 35}ms`,
      }}
      onClick={() => selectGame(game.id)}
    >
      <div className="game-card-head">
        <span className="game-gen">Gen. {generationRoman}</span>
        <span className="game-year">{game.releaseYear}</span>
      </div>

      <h3>{game.shortName}</h3>
      <p className="game-meta">{game.region.name}</p>

      <div className="game-card-tags">
        {game.pilot && (
          <span className="game-pilot">
            {game.routesAvailable ? 'Rutas y fichas' : 'Solo dex'}
          </span>
        )}
        {game.versions.map((version) => (
          <span className="game-version" key={version.id}>
            {version.name}
          </span>
        ))}
      </div>

      {game.dlc.length > 0 && (
        <p className="game-dlc">
          <span>DLC</span>
          {game.dlc.map((expansion) => expansion.shortName).join(' · ')}
        </p>
      )}

      <div className="game-card-footer">
        <span>{game.speciesCount.toLocaleString('es-ES')} especies</span>
        <span className="game-card-action">
          Abrir juego
          <ChevronRightIcon size={16} />
        </span>
      </div>
    </Link>
  );
}
