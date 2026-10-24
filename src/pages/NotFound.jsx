import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pokeball } from '../components/icons';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Página no encontrada · PokeNuzlockePlanner';
  }, []);

  return (
    <div className="page container not-found">
      <div className="not-found-ball">
        <Pokeball size={110} />
      </div>
      <span className="error-code">404</span>
      <h1>Este Pokémon salvaje huyó</h1>
      <p>La página que buscas no existe o cambió de ruta.</p>
      <Link to="/" className="btn btn-primary">
        Volver a la Pokédex
      </Link>
    </div>
  );
}
