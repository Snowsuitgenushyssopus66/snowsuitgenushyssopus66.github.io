// Interactive list on /projects/: filter by target role and search by title or tool.
// Astro renders it to HTML at build time (every project visible without JavaScript),
// then React takes over in the browser so the filters work.
import { useEffect, useMemo, useState } from 'react';
import ProjectCard from './ProjectCard.jsx';
import { ROLES as PROJECT_ROLES } from '../data/roles';

const ROLES = ['All', ...PROJECT_ROLES];

export default function ProjectBrowser({ projects }) {
  const [role, setRole] = useState('All');
  const [query, setQuery] = useState('');
  // False until the URL has been read, so the first render (still 'All', to match the
  // server HTML) doesn't wipe ?role= and ?q= from the address bar.
  const [urlRead, setUrlRead] = useState(false);

  // Read ?role= and ?q= so a filtered view can be shared as a link.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (ROLES.includes(params.get('role'))) setRole(params.get('role'));
    if (params.get('q')) setQuery(params.get('q'));
    setUrlRead(true);
  }, []);

  useEffect(() => {
    if (!urlRead) return;
    const params = new URLSearchParams();
    if (role !== 'All') params.set('role', role);
    if (query.trim()) params.set('q', query.trim());
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [role, query, urlRead]);

  const counts = useMemo(() => {
    const c = { All: projects.length };
    for (const p of projects) c[p.role] = (c[p.role] || 0) + 1;
    return c;
  }, [projects]);

  const q = query.trim().toLowerCase();
  const shown = projects.filter(
    (p) =>
      (role === 'All' || p.role === role) &&
      (!q || [p.title, p.outcome, ...p.stack].some((t) => t.toLowerCase().includes(q))),
  );

  return (
    <div className="browser">
      <div className="browser-controls">
        <div className="role-filter" role="group" aria-label="Filter by role">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={role === r}
              onClick={() => setRole(r)}
            >
              {r} <span className="count num">{counts[r] || 0}</span>
            </button>
          ))}
        </div>
        <label className="search">
          <span className="visually-hidden">Search projects by title or tool</span>
          <input
            type="search"
            placeholder="Search by tool, e.g. LangChain"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <p className="result-count" aria-live="polite">
        Showing {shown.length} of {projects.length} projects
      </p>

      {shown.length > 0 ? (
        <ol className="project-list" role="list">
          {shown.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} headingLevel={2} />
            </li>
          ))}
        </ol>
      ) : (
        <p className="empty">
          No projects match "{query}". Try a broader tool name, or{' '}
          <button type="button" className="linklike" onClick={() => { setQuery(''); setRole('All'); }}>
            clear the filters
          </button>
          .
        </p>
      )}
    </div>
  );
}
