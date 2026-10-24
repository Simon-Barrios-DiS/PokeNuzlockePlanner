import { TYPES } from '../data/types';

export default function TypeBadge({ type, size = 'md' }) {
  const info = TYPES[type] ?? { label: type, color: '#8b9bb4' };

  return (
    <span
      className={`type-badge type-badge--${size}`}
      style={{ '--type-color': info.color }}
      title={info.label}
    >
      {info.label}
    </span>
  );
}
