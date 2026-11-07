// One project card: role, status, title, outcome, headline metrics, stack and links.
// Used statically on the home page and inside the interactive ProjectBrowser on /projects/.
// Featured projects link to their case study; archive projects link straight to the repo.
import '../styles/projects.css';

const STATUS = { 'in-progress': 'In progress', 'not-deployed': 'Not deployed' };

// The heading serif has no arrow glyph, so "before → after" values set the arrow in the body font.
function Value({ text }) {
  const parts = text.split('→');
  if (parts.length === 1) return text;
  return (
    <>
      {parts[0].trim()}
      <span className="arrow" aria-hidden="true"> → </span>
      <span className="visually-hidden"> to </span>
      {parts[1].trim()}
    </>
  );
}

// headingLevel keeps the page outline valid: h3 under the home page's h2, h2 on /projects/.
export default function ProjectCard({ project, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const { slug, title, outcome, role, stack, metrics, repo, demo, tier, status } = project;
  const featured = tier === 'featured';
  const href = featured ? `/projects/${slug}/` : repo || demo[0]?.url;

  return (
    <article className="project">
      <div className="project-text">
        <p className="project-meta">
          <span>{role}</span>
          {STATUS[status] && <span className="project-status">{STATUS[status]}</span>}
        </p>
        <Heading className="project-title">
          <a href={href}>{title}</a>
        </Heading>
        <p className="project-outcome">{outcome}</p>
        <p className="project-stack">
          <span className="visually-hidden">Stack: </span>
          {stack.join(', ')}
        </p>
        <p className="project-links">
          {featured && (
            <a href={href}>
              Read the case study<span className="visually-hidden">: {title}</span>
            </a>
          )}
          {repo && (
            <a href={repo}>
              Code<span className="visually-hidden"> for {title}</span>
            </a>
          )}
          {demo.map((d) => (
            <a key={d.url} href={d.url}>
              {d.label}
            </a>
          ))}
        </p>
      </div>
      {metrics.length > 0 && (
        <dl className="project-metrics">
          {metrics.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd className="num"><Value text={m.value} /></dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}
