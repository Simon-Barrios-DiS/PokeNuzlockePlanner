import { TYPES, TYPE_ORDER } from '../data/types';

export default function TypeFilter({ value, onChange }) {
  return (
    <div className="type-filter" role="group" aria-label="Filtrar por tipo">
      <button
        type="button"
        className={`type-chip${!value ? ' is-active' : ''}`}
        onClick={() => onChange('')}
        aria-pressed={!value}
      >
        Todos
      </button>

      {TYPE_ORDER.map((type) => {
        const info = TYPES[type];
        const active = value === type;

        return (
          <button
            key={type}
            type="button"
            className={`type-chip${active ? ' is-active' : ''}`}
            style={{ '--type-color': info.color }}
            onClick={() => onChange(active ? '' : type)}
            aria-pressed={active}
          >
            {info.label}
          </button>
        );
      })}
    </div>
  );
}
