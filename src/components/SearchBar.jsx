import { forwardRef } from 'react';
import { CloseIcon, SearchIcon } from './icons';

const SearchBar = forwardRef(function SearchBar(
  {
    value,
    onChange,
    placeholder = 'Busca por nombre o número…',
    showHint = true,
  },
  ref,
) {
  return (
    <form className="search-bar" role="search" onSubmit={(event) => event.preventDefault()}>
      <SearchIcon size={22} className="search-icon" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Buscar Pokémon por nombre o número"
        autoComplete="off"
        spellCheck="false"
      />

      {value ? (
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
        >
          <CloseIcon size={16} />
        </button>
      ) : (
        showHint && <kbd className="search-kbd">/</kbd>
      )}
    </form>
  );
});

export default SearchBar;
