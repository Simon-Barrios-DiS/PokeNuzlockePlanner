import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPokemonIndex, getType } from '../api/pokeapi';
import { SUGGESTED_SEARCHES, TYPES } from '../data/types';
import { usePokemonDetails } from '../hooks/usePokemonDetails';
import { artworkUrl, formatName, idFromUrl } from '../utils/format';
import PokemonCard from '../components/PokemonCard';
import PokemonCardSkeleton from '../components/PokemonCardSkeleton';
import SearchBar from '../components/SearchBar';
import TypeFilter from '../components/TypeFilter';
import { ChevronRightIcon, GamepadIcon, Pokeball, SparklesIcon } from '../components/icons';

const PAGE_SIZE = 24;

export default function Pokedex() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [indexStatus, setIndexStatus] = useState('loading');
  const [selectedType, setSelectedType] = useState('');
  const [typePokemon, setTypePokemon] = useState([]);
  const [typeStatus, setTypeStatus] = useState('idle');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('id-asc');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [reloadToken, setReloadToken] = useState(0);
  const searchRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    document.title = 'PokeNuzlockePlanner · Explora la Pokédex';
  }, []);

  // Índice completo de Pokémon (una sola petición, luego todo se filtra en cliente).
  useEffect(() => {
    let active = true;
    setIndexStatus('loading');

    getPokemonIndex()
      .then((data) => {
        if (!active) return;
        setAllPokemon(data.results ?? []);
        setIndexStatus('success');
      })
      .catch(() => {
        if (active) setIndexStatus('error');
      });

    return () => {
      active = false;
    };
  }, [reloadToken]);

  // Lista del tipo seleccionado.
  useEffect(() => {
    if (!selectedType) {
      setTypePokemon([]);
      setTypeStatus('idle');
      return undefined;
    }

    let active = true;
    setTypeStatus('loading');

    getType(selectedType)
      .then((data) => {
        if (!active) return;
        setTypePokemon(data.pokemon.map((entry) => entry.pokemon));
        setTypeStatus('success');
      })
      .catch(() => {
        if (active) setTypeStatus('error');
      });

    return () => {
      active = false;
    };
  }, [selectedType, reloadToken]);

  // Atajo de teclado: "/" enfoca el buscador.
  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, selectedType, sort]);

  const baseList = selectedType ? typePokemon : allPokemon;

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const isIdSearch = normalizedQuery.startsWith('#');
    const idQuery = isIdSearch ? normalizedQuery.slice(1) : '';

    let list = baseList.map((item) => ({
      id: idFromUrl(item.url),
      name: item.name,
    }));

    if (normalizedQuery) {
      list = list.filter((item) => {
        if (isIdSearch) return idQuery !== '' && String(item.id) === idQuery;
        return item.name.includes(normalizedQuery) || String(item.id) === normalizedQuery;
      });
    }

    list.sort((a, b) => {
      if (sort === 'name-asc') return a.name.localeCompare(b.name);
      if (sort === 'id-desc') return b.id - a.id;
      return a.id - b.id;
    });

    return list;
  }, [baseList, query, sort]);

  const visibleItems = filtered.slice(0, visibleCount);
  const visibleNames = useMemo(() => visibleItems.map((item) => item.name), [visibleItems]);
  const details = usePokemonDetails(visibleNames);

  const hasMore = visibleCount < filtered.length;
  const isLoading =
    indexStatus === 'loading' || (Boolean(selectedType) && typeStatus === 'loading');
  const hasError =
    indexStatus === 'error' || (Boolean(selectedType) && typeStatus === 'error');

  // Scroll infinito.
  useEffect(() => {
    if (!hasMore || isLoading || hasError) return undefined;

    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((current) => Math.min(current + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: '500px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoading, hasError, filtered.length, visibleCount]);

  const totalLabel = allPokemon.length
    ? allPokemon.length.toLocaleString('es-ES')
    : '1.000+';

  return (
    <div className="page">
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow">
            <SparklesIcon size={16} />
            Tu biblioteca Pokémon
          </span>

          <h1>
            Explora el mundo
            <span className="gradient-text"> Pokémon</span>
          </h1>

          <p className="hero-subtitle">
            Busca entre {totalLabel} especies, descubre sus estadísticas, habilidades y
            evoluciones, y guarda tus favoritos en tu biblioteca personal.
          </p>

          <SearchBar
            ref={searchRef}
            value={query}
            onChange={setQuery}
            placeholder="Pikachu, Charizard, #25…"
          />

          <div className="suggestions">
            <span>Prueba con</span>
            {SUGGESTED_SEARCHES.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setQuery(name)}
                className="suggestion-chip"
              >
                {formatName(name)}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-halo" />
          <div className="hero-ring hero-ring--outer" />
          <div className="hero-ring hero-ring--inner" />
          <Pokeball size={190} className="hero-ball" />

          <span className="floating-pill floating-pill--one">
            <span className="dot dot--fire" /> 18 tipos
          </span>
          <span className="floating-pill floating-pill--two">
            <span className="dot dot--water" /> Stats y evoluciones
          </span>
          <span className="floating-pill floating-pill--three">
            <span className="dot dot--electric" /> Favoritos
          </span>

          <span className="spark spark--one" />
          <span className="spark spark--two" />
          <span className="spark spark--three" />
        </div>
      </section>

      <Link to="/juegos" className="adventure-banner container">
        <span className="adventure-banner-icon">
          <GamepadIcon size={26} />
        </span>
        <span className="adventure-banner-copy">
          <span className="adventure-banner-label">Nuevo · Compañero de aventura</span>
          <strong>Elige un juego y descubre su Pokédex</strong>
          <span>
            Rojo Fuego / Verde Hoja, Esmeralda y Escarlata / Púrpura + DLC ya están en el
            catálogo.
          </span>
        </span>
        <span className="adventure-banner-action">
          Ver juegos
          <ChevronRightIcon size={18} />
        </span>
      </Link>

      <section className="pokedex container" aria-labelledby="pokedex-title">
        <div className="section-head">
          <div>
            <h2 id="pokedex-title">
              {selectedType ? `Pokémon de tipo ${TYPES[selectedType].label}` : 'Pokédex Nacional'}
            </h2>
            <p className="result-count" aria-live="polite">
              {isLoading
                ? 'Cargando Pokémon…'
                : `${filtered.length.toLocaleString('es-ES')} ${
                    filtered.length === 1 ? 'Pokémon' : 'Pokémon'
                  }${query.trim() ? ` para “${query.trim()}”` : ''}`}
            </p>
          </div>

          <label className="sort-control">
            <span>Ordenar</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="id-asc">Número ↑</option>
              <option value="id-desc">Número ↓</option>
              <option value="name-asc">Nombre A-Z</option>
            </select>
          </label>
        </div>

        <TypeFilter value={selectedType} onChange={setSelectedType} />

        {hasError ? (
          <div className="empty-state error-state">
            <div className="empty-ball">
              <Pokeball size={64} />
            </div>
            <h3>No pudimos conectar con la PokéAPI</h3>
            <p>Revisa tu conexión a internet e inténtalo de nuevo.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setReloadToken((token) => token + 1)}
            >
              Reintentar
            </button>
          </div>
        ) : isLoading ? (
          <div className="pokemon-grid" aria-busy="true" aria-label="Cargando Pokémon">
            {Array.from({ length: 12 }, (_, index) => (
              <PokemonCardSkeleton key={index} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-ball">
              <Pokeball size={64} />
            </div>
            <h3>No encontramos resultados</h3>
            <p>Prueba con otro nombre, número o tipo. La Pokédex es enorme.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setQuery('');
                setSelectedType('');
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="pokemon-grid">
              {visibleItems.map((item, index) => {
                const pokemon = details[item.name];
                const types = pokemon?.types?.map((slot) => slot.type.name);

                return (
                  <PokemonCard
                    key={`${item.id}-${item.name}`}
                    id={item.id}
                    name={item.name}
                    image={
                      pokemon?.sprites?.other?.['official-artwork']?.front_default ??
                      artworkUrl(item.id)
                    }
                    types={types}
                    index={index}
                  />
                );
              })}
            </div>

            {hasMore && (
              <div className="load-more">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    setVisibleCount((current) => Math.min(current + PAGE_SIZE, filtered.length))
                  }
                >
                  Cargar más Pokémon
                </button>
                <div ref={sentinelRef} className="sentinel" aria-hidden="true" />
              </div>
            )}

            {!hasMore && filtered.length > PAGE_SIZE && (
              <p className="end-note">Has visto los {filtered.length} resultados. ¡Buen viaje!</p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
