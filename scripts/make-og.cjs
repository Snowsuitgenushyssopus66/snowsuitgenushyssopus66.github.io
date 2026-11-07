// Renders the social preview images (1200x630) and the 180px apple-touch-icon:
//   public/og.png             site-wide card, from scripts/og.html
//   public/og/<slug>.png      one card per featured project, from its frontmatter
//   public/apple-touch-icon.png
// Needs Playwright and yaml (not site dependencies, so not in package.json):
//   npm install --no-save playwright yaml && npx playwright install chromium   (once)
// then: node scripts/make-og.cjs
// Case-study pages use their own card when it exists and fall back to og.png otherwise.
const fs = require('fs');
const path = require('path');

let chromium, yaml;
try {
  ({ chromium } = require('playwright'));
  yaml = require('yaml');
} catch {
  console.error('Missing tools. Run: npm install --no-save playwright yaml && npx playwright install chromium');
  process.exit(1);
}

const root = path.resolve(__dirname, '..');
const projectsDir = path.join(root, 'src/content/projects');
const outDir = path.join(root, 'public/og');

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function featuredProjects() {
  return fs
    .readdirSync(projectsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const src = fs.readFileSync(path.join(projectsDir, f), 'utf8');
      const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      return m ? { slug: f.replace(/\.md$/, ''), ...yaml.parse(m[1]) } : null;
    })
    .filter((p) => p && p.tier === 'featured');
}

// Same palette and type as scripts/og.html, so every card reads as one set.
function projectCard(p, photo) {
  const metrics = (p.metrics || [])
    .slice(0, 3)
    .map((m) => `<div class="item"><div class="v">${esc(m.value)}</div><div class="label">${esc(m.label)}</div></div>`)
    .join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin: 0; width: 1200px; height: 630px; background: #0f1720; color: #e6ebf0;
         font-family: system-ui, 'Segoe UI', Roboto, Arial, sans-serif; display: flex; }
  .wrap { padding: 64px 80px; display: flex; flex-direction: column; justify-content: space-between; width: 100%; box-sizing: border-box; }
  .kicker { font-size: 24px; color: #2dd4bf; margin: 0 0 18px; }
  h1 { font-family: Georgia, 'DejaVu Serif', serif; font-size: 60px; line-height: 1.1; margin: 0; letter-spacing: -1px; max-width: 1000px; }
  .ledger { display: flex; gap: 48px; border-top: 2px solid #2a3747; padding-top: 28px; }
  .item { flex: 1; min-width: 0; }
  .item .v { font-family: Georgia, 'DejaVu Serif', serif; font-size: 44px; font-weight: 700; color: #2dd4bf; white-space: nowrap; }
  .item .label { font-size: 20px; color: #9aa6b5; margin-top: 6px; line-height: 1.3; }
  .foot { display: flex; align-items: center; gap: 18px; font-size: 24px; color: #9aa6b5; }
  .foot img { width: 56px; height: 56px; border-radius: 50%; filter: brightness(0.9); }
  .foot b { color: #e6ebf0; font-weight: 600; }
  .foot .url { margin-left: auto; }
</style></head><body><div class="wrap">
  <div><p class="kicker">${esc(p.role)} case study</p><h1>${esc(p.title)}</h1></div>
  <div class="ledger">${metrics}</div>
  <div class="foot"><img src="${photo}" alt=""><span><b>Melvin Mathew</b>, Data Scientist and AI/ML Engineer</span><span class="url">melvinmathew9991.github.io</span></div>
</div></body></html>`;
}

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });

  await p.goto('file://' + path.join(__dirname, 'og.html'));
  await p.screenshot({ path: path.join(root, 'public/og.png') });

  const photo = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(root, 'public/melvin-mathew.jpg')).toString('base64');
  fs.mkdirSync(outDir, { recursive: true });
  for (const proj of featuredProjects()) {
    await p.setContent(projectCard(proj, photo));
    await p.screenshot({ path: path.join(outDir, `${proj.slug}.png`) });
    console.log(`public/og/${proj.slug}.png`);
  }

  await p.setViewportSize({ width: 180, height: 180 });
  await p.setContent('<body style="margin:0;width:180px;height:180px;background:#0F766E;display:grid;place-items:center;font:700 84px Georgia,serif;color:#fff">MM</body>');
  await p.screenshot({ path: path.join(root, 'public/apple-touch-icon.png') });
  await b.close();
})();
