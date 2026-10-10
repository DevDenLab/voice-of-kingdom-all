import React from 'react';
import './Team.css';
import { teamUrl } from '../../lib/imageUrl';
import { useSiteContent } from '../../lib/siteContent';

const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

const Team = () => {
  const { content, status } = useSiteContent();
  const members = content.team;

  return (
    <div className="team">
      <h1 className="team-heading">Meet the VOKIM Team</h1>
      <p className="team-intro">
        The voices and hands behind VOKIM — gifted worshippers, musicians and servants
        united by one focus: Jesus Christ.
      </p>

      {status === 'error' && (
        <div className="team-error">Unable to load the team. Please refresh the page.</div>
      )}

      {status === 'loading' && (
        <div className="team-loading">
          <div className="team-spinner"></div>
        </div>
      )}

      {status === 'ready' && members.length === 0 && (
        <p className="team-empty">Our team page is coming soon.</p>
      )}

      <div className="team-grid">
        {members.map((m) => (
          <div className="team-card" key={m.id}>
            <div className="team-photo">
              {m.photo ? (
                <img src={teamUrl(m.photo)} alt={m.name} loading="lazy" />
              ) : (
                <span className="team-initials" aria-hidden="true">{initials(m.name)}</span>
              )}
            </div>
            <h3 className="team-name">{m.name}</h3>
            {m.role && <p className="team-role">{m.role}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
