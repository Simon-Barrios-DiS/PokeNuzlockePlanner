import { Pokeball } from './icons';
import { APP_VERSION } from '../data/appMeta';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <span className="footer-brand">
          <Pokeball size={20} />
          PokeNuzlockePlanner
          <span className="footer-version">v{APP_VERSION}</span>
        </span>
        <p>
          Datos de{' '}
          <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">
            PokéAPI
          </a>
          . Hecho con React, con cariño por los Pokémon.
        </p>
      </div>
    </footer>
  );
}
