import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { FavoritesProvider } from './context/FavoritesContext';
import { GameProvider } from './context/GameContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GameProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </GameProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
