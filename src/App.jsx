import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Pokedex from './pages/Pokedex';
import PokemonDetail from './pages/PokemonDetail';
import Library from './pages/Library';
import Games from './pages/Games';
import GameDetail from './pages/GameDetail';
import GamePokedex from './pages/GamePokedex';
import GameRoutes from './pages/GameRoutes';
import GameRouteDetail from './pages/GameRouteDetail';
import GamePokemonDetail from './pages/GamePokemonDetail';
import TeamBuilder from './pages/TeamBuilder';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Pokedex />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
        <Route path="/juegos" element={<Games />} />
        <Route path="/juegos/:gameId" element={<GameDetail />} />
        <Route path="/juegos/:gameId/pokedex" element={<GamePokedex />} />
        <Route path="/juegos/:gameId/rutas" element={<GameRoutes />} />
        <Route path="/juegos/:gameId/rutas/:locationId" element={<GameRouteDetail />} />
        <Route path="/juegos/:gameId/pokemon/:speciesId" element={<GamePokemonDetail />} />
        <Route path="/equipos" element={<TeamBuilder />} />
        <Route path="/biblioteca" element={<Library />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
