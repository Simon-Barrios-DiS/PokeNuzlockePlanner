import { Link, NavLink } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { GamepadIcon, HeartIcon, Pokeball, SearchIcon } from './icons';

export default function Navbar() {
  const { count } = useFavorites();

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="brand" aria-label="PokeNuzlockePlanner, ir al inicio">
          <span className="brand-ball">
            <Pokeball size={30} />
          </span>
          <span className="brand-text">
            PokeNuzlocke<span>Planner</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Navegación principal">
          <NavLink
            to="/"
            end
            aria-label="Ir a la Pokédex"
            className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
          >
            <SearchIcon size={18} />
            <span>Pokédex</span>
          </NavLink>

          <NavLink
            to="/juegos"
            aria-label="Ver catálogo de juegos"
            className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
          >
            <GamepadIcon size={18} />
            <span>Juegos</span>
          </NavLink>

          <NavLink
            to="/equipos"
            aria-label="Crear equipos por versión"
            className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
          >
            <Pokeball size={18} />
            <span>Equipos</span>
          </NavLink>

          <NavLink
            to="/biblioteca"
            aria-label={`Ir a mi biblioteca, ${count} Pokémon guardados`}
            className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
          >
            <HeartIcon size={18} />
            <span>Mi biblioteca</span>
            {count > 0 && <span className="nav-badge">{count}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
