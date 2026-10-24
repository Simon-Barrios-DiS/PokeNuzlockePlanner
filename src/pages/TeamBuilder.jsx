import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useGamePokedex } from '../hooks/useGamePokedex';
import { useGamePokemon } from '../hooks/useGamePokemon';
import { useGames } from '../hooks/useGames';
import { getGeneration } from '../data/generations';
import { getGameTheme } from '../data/gameThemes';
import { LEVEL_CAPS } from '../data/levelCaps';
import TypeBadge from '../components/TypeBadge';
import { ChevronRightIcon, Pokeball } from '../components/icons';

const STORAGE_KEY = 'pokenuzlockeplanner:teams:v1';
const LEGACY_STORAGE_KEY = 'poke-biblioteca:teams:v1';
const MAX_TEAM = 6;

function readTeams() {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY) ??
      '{}';
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function moveGroups(data) {
  return [
    { id: 'level', label: 'Nivel', moves: data.learnset ?? [] },
    { id: 'tm', label: 'MT/MO', moves: data.tmMoves ?? [] },
    { id: 'tutor', label: 'Tutor', moves: data.tutorMoves ?? [] },
  ].filter((group) => group.moves.length > 0);
}

function buildCapOptions(gameId) {
  const data = LEVEL_CAPS[gameId];
  if (!data) return [{ id: 'free', label: 'Sin cap', level: null }];

  const options = [{ id: 'free', label: 'Sin cap', level: null }];
  data.groups.forEach((group) => {
    group.leaders.forEach((leader, index) => {
      options.push({
        id: `${group.id}-${index}`,
        label: `${group.name} · ${leader.name} · Nv. ${leader.level}`,
        level: leader.level,
      });
    });
  });
  if (data.final) {
    options.push({
      id: 'final',
      label: `${data.final.name} · final · Nv. ${data.final.level}`,
      level: data.final.level,
    });
  }
  return options;
}

function TeamSlot({ slot, entry, gameId, capLevel, onChange, onRemove }) {
  const { status, data } = useGamePokemon(gameId, slot.speciesId);
  const groups = data ? moveGroups(data) : [];
  const allMoves = groups.flatMap((group) =>
    group.moves.map((move) => ({ ...move, method: group.id, methodLabel: group.label })),
  );
  const selectedMoves = slot.moves ?? [];
  const movesTouched = slot.movesTouched ?? false;
  const overCap = capLevel != null && slot.level > capLevel;

  useEffect(() => {
    if (!data || movesTouched || selectedMoves.length > 0) return;
    const defaults = (data.learnset ?? [])
      .filter((move) => move.level <= slot.level)
      .slice(-4)
      .map((move) => move.name);
    if (defaults.length) {
      onChange({
        ...slot,
        moves: defaults,
        movesTouched: false,
      });
    }
  }, [data, movesTouched, selectedMoves.length, slot, onChange]);

  function setMove(index, value) {
    const next = [...selectedMoves];
    if (!value) next.splice(index, 1);
    else next[index] = value;
    onChange({ ...slot, moves: next.filter(Boolean), movesTouched: true });
  }

  function moveSlot(index, direction) {
    const next = [...selectedMoves];
    const target = index + direction;
    if (target < 0 || target >= 4) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange({ ...slot, moves: next.filter(Boolean), movesTouched: true });
  }

  return (
    <article className="team-slot">
      <div className="team-slot-head">
        <img src={entry.image} alt={entry.name} loading="lazy" />
        <div>
          <span className="team-slot-label">#{entry.regionalNumbers?.[0]?.number ?? entry.nationalNumber}</span>
          <h3>{entry.name}</h3>
          <div className="team-slot-types">
            {entry.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
        </div>
        <button type="button" className="team-remove" onClick={onRemove} aria-label="Quitar del equipo">
          ×
        </button>
      </div>

      <div className="team-level-row">
        <label>
          Nivel
          <input
            type="number"
            min="1"
            max="100"
            value={slot.level}
            onChange={(event) =>
              onChange({
                ...slot,
                level: Math.min(100, Math.max(1, Number(event.target.value) || 1)),
              })
            }
          />
        </label>
        {overCap && <span className="team-cap-warning">Por encima del cap</span>}
      </div>

      {status === 'loading' && <span className="team-loading">Cargando movimientos…</span>}
      {status === 'missing' && <span className="team-loading">Sin ficha para este juego.</span>}

      {data && (
        <div className="team-moves">
          <div className="team-moves-head">
            <strong>Movimientos</strong>
            <span>{selectedMoves.length}/4</span>
          </div>
          {[0, 1, 2, 3].map((index) => {
            const value = selectedMoves[index] ?? '';
            const selected = allMoves.find((move) => move.name === value);
            const invalidLevel =
              selected?.method === 'level' && selected.level > slot.level;
            return (
              <div className="team-move-row" key={`${slot.speciesId}-move-${index}`}>
                <span className="team-move-index">{index + 1}</span>
                <select value={value} onChange={(event) => setMove(index, event.target.value)}>
                  <option value="">— elegir movimiento —</option>
                  {groups.map((group) => (
                    <optgroup label={group.label} key={group.id}>
                      {group.moves.map((move) => (
                        <option
                          key={`${group.id}-${move.moveId}`}
                          value={move.name}
                          disabled={move.level > slot.level && group.id === 'level'}
                        >
                          {move.name}
                          {move.level != null && group.id === 'level' ? ` · Nv. ${move.level}` : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {selected && <TypeBadge type={selected.type} />}
                {invalidLevel && <span className="team-move-invalid">Nv.</span>}
                <button
                  type="button"
                  className="team-move-order"
                  onClick={() => moveSlot(index, -1)}
                  disabled={index === 0}
                  aria-label="Mover movimiento arriba"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="team-move-order"
                  onClick={() => moveSlot(index, 1)}
                  disabled={index >= selectedMoves.length - 1}
                  aria-label="Mover movimiento abajo"
                >
                  ↓
                </button>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}

export default function TeamBuilder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { games, status: gamesStatus } = useGames();
  const { selectedGameId, selectGame } = useGame();
  const deepGames = useMemo(
    () => games.filter((game) => game.routesAvailable),
    [games],
  );
  const gameId =
    deepGames.find((game) => game.id === searchParams.get('game'))?.id ??
    deepGames.find((game) => game.id === selectedGameId)?.id ??
    deepGames[0]?.id;
  const game = deepGames.find((item) => item.id === gameId);
  const versionId =
    game?.versions.find((version) => version.id === searchParams.get('version'))?.id ??
    game?.versions[0]?.id;
  const { data: pokedex, status: pokedexStatus } = useGamePokedex(gameId);
  const capOptions = useMemo(() => (gameId ? buildCapOptions(gameId) : []), [gameId]);
  const [team, setTeam] = useState([]);
  const [capId, setCapId] = useState('free');
  const [loadedKey, setLoadedKey] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  const teamKey = gameId && versionId ? `${gameId}:${versionId}` : null;
  const currentCap = capOptions.find((option) => option.id === capId) ?? capOptions[0];
  const capLevel = currentCap?.level ?? null;
  const entries = pokedex?.entries ?? [];

  useEffect(() => {
    if (gameId) selectGame(gameId);
  }, [gameId, selectGame]);

  useEffect(() => {
    if (!teamKey) return;
    const stored = readTeams()[teamKey];
    setTeam(Array.isArray(stored?.slots) ? stored.slots : []);
    setCapId(stored?.capId ?? 'free');
    setLoadedKey(teamKey);
    setPickerOpen(false);
    setQuery('');
  }, [teamKey]);

  useEffect(() => {
    if (!teamKey || loadedKey !== teamKey) return;
    try {
      const all = readTeams();
      all[teamKey] = { slots: team, capId };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // El equipo sigue en memoria si el almacenamiento falla.
    }
  }, [team, capId, teamKey, loadedKey]);

  function updateParam(nextGameId, nextVersionId = versionId) {
    const next = new URLSearchParams(searchParams);
    next.set('game', nextGameId);
    if (nextVersionId) next.set('version', nextVersionId);
    else next.delete('version');
    setSearchParams(next, { replace: true });
  }

  const availableEntries = useMemo(() => {
    const selectedVersion = game?.versions.find((version) => version.id === versionId);
    const normalized = query.trim().toLowerCase();
    return entries
      .filter((entry) => {
        if (onlyAvailable && selectedVersion) {
          const availability = entry.availability?.[selectedVersion.id];
          if (!availability || (!availability.locationCount && !availability.methods?.length)) {
            return false;
          }
        }
        if (!normalized) return true;
        return entry.name.toLowerCase().includes(normalized) || String(entry.speciesId).includes(normalized);
      })
      .slice(0, 48);
  }, [entries, game, versionId, onlyAvailable, query]);

  function addPokemon(entry) {
    if (!entry || team.length >= MAX_TEAM || team.some((slot) => slot.speciesId === entry.speciesId)) {
      return;
    }
    setTeam((previous) => [
      ...previous,
      {
        speciesId: entry.speciesId,
        level: capLevel ?? 50,
        moves: [],
        movesTouched: false,
      },
    ]);
    setPickerOpen(false);
  }

  function updateSlot(index, slot) {
    setTeam((previous) => previous.map((item, itemIndex) => (itemIndex === index ? slot : item)));
  }

  function removeSlot(index) {
    setTeam((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  }

  function applyCap() {
    if (capLevel == null) return;
    setTeam((previous) => previous.map((slot) => ({ ...slot, level: capLevel })));
  }

  if (gamesStatus === 'loading' || pokedexStatus === 'loading') {
    return (
      <div className="page container team-builder-page">
        <span className="skeleton skeleton-line skeleton-line--sm" />
        <span className="skeleton skeleton-line skeleton-line--xl" />
        <div className="team-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <span className="skeleton team-slot-skeleton" key={index} />
          ))}
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
          <h3>No hay juegos con fichas para planificar</h3>
          <Link to="/juegos" className="btn btn-primary">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const generation = getGeneration(game.generation);
  const theme = getGameTheme(game);
  const currentVersion = game.versions.find((version) => version.id === versionId);
  const overCapCount = capLevel == null ? 0 : team.filter((slot) => slot.level > capLevel).length;

  return (
    <div
      className="page container team-builder-page"
      style={{ '--gen-color': theme.primary, '--gen-color-2': theme.secondary }}
    >
      <span className="eyebrow">Planificador de aventura</span>
      <div className="team-builder-heading">
        <div>
          <h1>Equipos por versión</h1>
          <p>
            Elige seis Pokémon de la dex, ajusta su nivel y monta el moveset con movimientos por
            nivel, MT/MO y tutor. Se guarda por juego y versión.
          </p>
        </div>
        <Link to={`/juegos/${game.id}`} className="btn btn-ghost">
          Volver a {game.shortName}
          <ChevronRightIcon size={16} />
        </Link>
      </div>

      <section className="panel team-toolbar">
        <label>
          Juego
          <select value={game.id} onChange={(event) => updateParam(event.target.value, null)}>
            {deepGames.map((item) => (
              <option value={item.id} key={item.id}>
                Gen. {getGeneration(item.generation).roman} · {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Versión
          <select value={versionId} onChange={(event) => updateParam(game.id, event.target.value)}>
            {game.versions.map((version) => (
              <option value={version.id} key={version.id}>
                {version.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Level cap
          <select value={capId} onChange={(event) => setCapId(event.target.value)}>
            {capOptions.map((option) => (
              <option value={option.id} key={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="team-toolbar-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={applyCap} disabled={capLevel == null}>
            Aplicar cap
          </button>
          <span className="team-save-note">
            {overCapCount > 0
              ? `${overCapCount} Pokémon por encima del cap`
              : 'Guardado local por versión'}
          </span>
        </div>
      </section>

      <div className="team-builder-layout">
        <section className="panel team-roster">
          <div className="game-panel-head">
            <div>
              <h2>
                {game.shortName} · {currentVersion?.name}
              </h2>
              <p className="panel-note">
                {capOptions.length > 1
                  ? 'Los caps son el nivel más alto del líder de gimnasio; no incluyen Alto Mando.'
                  : 'Este juego no tiene level caps de gimnasio en la base actual.'}
              </p>
            </div>
            <span className="tag">
              Gen. {generation.roman} · {team.length}/{MAX_TEAM}
            </span>
          </div>

          <div className="team-grid">
            {Array.from({ length: MAX_TEAM }, (_, index) => {
              const slot = team[index];
              if (!slot) {
                return (
                  <button
                    type="button"
                    className="team-empty-slot"
                    key={`empty-${index}`}
                    onClick={() => setPickerOpen(true)}
                  >
                    <span>+</span>
                    Añadir Pokémon
                  </button>
                );
              }
              const entry = entries.find((item) => item.speciesId === slot.speciesId);
              if (!entry) return null;
              return (
                <TeamSlot
                  key={`${slot.speciesId}-${index}`}
                  slot={slot}
                  entry={entry}
                  gameId={game.id}
                  capLevel={capLevel}
                  onChange={(next) => updateSlot(index, next)}
                  onRemove={() => removeSlot(index)}
                />
              );
            })}
          </div>

          <button
            type="button"
            className="btn btn-primary team-add-btn"
            onClick={() => setPickerOpen((value) => !value)}
            disabled={team.length >= MAX_TEAM}
          >
            {team.length >= MAX_TEAM ? 'Equipo completo' : 'Añadir Pokémon'}
          </button>
        </section>

        {pickerOpen && (
          <aside className="panel team-picker">
            <div className="game-panel-head">
              <div>
                <h2>Elegir Pokémon</h2>
                <p className="panel-note">{availableEntries.length} resultados visibles</p>
              </div>
              <button type="button" className="team-remove" onClick={() => setPickerOpen(false)} aria-label="Cerrar selector">
                ×
              </button>
            </div>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busca por nombre o número…"
              className="team-search"
            />
            <label className="team-check">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(event) => setOnlyAvailable(event.target.checked)}
              />
              Solo disponibles en {currentVersion?.name}
            </label>
            <div className="team-picker-list">
              {availableEntries.map((entry) => {
                const alreadyInTeam = team.some((slot) => slot.speciesId === entry.speciesId);
                return (
                  <button
                    type="button"
                    className="team-picker-item"
                    key={entry.speciesId}
                    onClick={() => addPokemon(entry)}
                    disabled={alreadyInTeam || team.length >= MAX_TEAM}
                  >
                    <img src={entry.image} alt="" loading="lazy" />
                    <span>
                      <strong>{entry.name}</strong>
                      <small>{entry.types.join(' · ')}</small>
                    </span>
                    <span>{alreadyInTeam ? 'En equipo' : 'Añadir'}</span>
                  </button>
                );
              })}
              {availableEntries.length === 0 && (
                <p className="panel-note">No hay Pokémon con esos filtros.</p>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
