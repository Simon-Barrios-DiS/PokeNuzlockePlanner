export default function PokemonCardSkeleton() {
  return (
    <article className="pokemon-card card-skeleton" aria-hidden="true">
      <div className="card-link">
        <span className="skeleton skeleton-id" />
        <div className="card-art">
          <span className="skeleton skeleton-art" />
        </div>
        <div className="card-body">
          <span className="skeleton skeleton-title" />
          <div className="card-types">
            <span className="skeleton skeleton-badge" />
            <span className="skeleton skeleton-badge skeleton-badge--short" />
          </div>
        </div>
      </div>
    </article>
  );
}
