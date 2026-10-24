import { LEVEL_CAPS } from '../data/levelCaps';

export default function LevelCapsPanel({ gameId }) {
  const data = LEVEL_CAPS[gameId];
  if (!data) return null;

  return (
    <section className="panel level-caps-panel">
      <div className="game-panel-head">
        <div>
          <h2>{data.title}</h2>
          <p className="panel-note">{data.note}</p>
        </div>
        <span className="tag">Level caps</span>
      </div>

      <div className="level-caps-groups">
        {data.groups.map((group) => (
          <div className="level-caps-group" key={group.id}>
            <h3>{group.name}</h3>
            <div className="level-caps-list">
              {group.leaders.map((leader, index) => (
                <div className="level-cap-row" key={`${group.id}-${leader.name}`}>
                  <span className="level-cap-index">{String(index + 1).padStart(2, '0')}</span>
                  <div className="level-cap-copy">
                    <strong>{leader.name}</strong>
                    <span>
                      {leader.city} · Medalla {leader.badge}
                    </span>
                  </div>
                  <span className="level-cap-level">Nv. {leader.level}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {data.groups.length === 0 && (
        <p className="panel-note">
          Este juego no tiene gimnasios, así que no se definen level caps de gimnasio.
        </p>
      )}

      {data.final && (
        <div className="level-cap-final">
          <div>
            <span>Meta final</span>
            <strong>{data.final.name}</strong>
            <span>
              {data.final.city} · {data.final.note}
            </span>
          </div>
          <strong>Nv. {data.final.level}</strong>
        </div>
      )}
    </section>
  );
}
