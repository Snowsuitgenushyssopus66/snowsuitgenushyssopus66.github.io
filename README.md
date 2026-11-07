# melvinmathew9991.github.io

Portfolio site for **Melvin Mathew**, Data Scientist and AI/ML Engineer. Live at https://melvinmathew9991.github.io

Built with [Astro](https://astro.build) (static HTML) and React (the project filter only). Hosted free on GitHub Pages, deployed automatically by GitHub Actions on every push to `main`.

## Run it locally

Needs Node.js 22.23.4 or newer.

```bash
npm install
npm run dev      # live preview at http://localhost:4321
npm run build    # writes the finished site to dist/
npm run preview  # serves dist/ to check the production build
```

## Where the content lives

| What | File |
| --- | --- |
| Name, contact links, resume date, "Numbers I corrected" table, experience, skills, education, certifications | `src/data/site.ts` |
| Projects (one Markdown file each; case-study text goes below the frontmatter) | `src/content/projects/*.md` |
| Rules every project file must follow (checked at build time) | `src/content.config.ts` |
| Resume PDF | `public/resume.pdf` |
| Profile photo | `public/melvin-mathew.webp` and `public/melvin-mathew.jpg` (320×320) |
| Social preview images (LinkedIn/WhatsApp link cards) | `public/og.png` (site-wide, from `scripts/og.html`) and `public/og/<slug>.png` (one per featured project, from its frontmatter) |
| Colours, fonts, spacing, dark/light theme (follows the OS setting until the visitor uses the toggle) | `src/styles/global.css` |
| Project card and filter styles | `src/styles/projects.css` |
| Page `<head>` (SEO tags), header and footer | `src/layouts/Base.astro` |
| Pages | `src/pages/` (`index.astro` home, `projects/index.astro` all projects, `projects/[slug].astro` case studies, `404.astro`) |

## Add a new project (under 10 minutes)

1. Copy an existing file in `src/content/projects/`, e.g. `movie-recommender.md`, and rename it. The file name becomes the URL: `my-project.md` → `/projects/my-project/` (featured projects only).
2. Edit the frontmatter:

   ```yaml
   ---
   title: "My project"
   outcome: "One sentence with the measured result."
   role: Data Science            # or AI/ML Engineering, or Analytics
   stack: ["Python", "XGBoost"]
   metrics:                       # up to three; use only numbers from your reports
     - { value: "0.91", label: "what the number measures" }
   repo: https://github.com/melvinmathew9991/my-project
   demo: []                       # only if a public demo exists: - { label: "Live demo", url: "https://..." }
   tier: archive                  # featured = home page + case-study page
   status: complete               # or in-progress, not-deployed
   order: 25                      # lower numbers appear first
   ---
   ```

3. For a featured project, write the case study in Markdown below the closing `---` (sections used so far: The problem, What I built, Results, Limitations, What I'd do next).
4. Run `npm run build`. A typo in the frontmatter fails with a message naming the file and field.
5. Commit and push on a branch, open a pull request, merge to `main`. The site updates in about 2 minutes.

## Replace the resume

1. Save the new PDF as `public/resume.pdf` (keep the name, so links don't break).
2. Update `resumeUpdated` in `src/data/site.ts` to today's date (`YYYY-MM-DD`).
3. Commit and push.

## Regenerate the social preview images

Needed when the name, roles or headline numbers change, or when a project becomes featured. Edit `scripts/og.html` for the site-wide card (project cards come from frontmatter), then:

```bash
npm install --no-save playwright yaml && npx playwright install chromium
node scripts/make-og.cjs   # writes public/og.png, public/og/<slug>.png for each featured project, and public/apple-touch-icon.png
```

## Deployment

`.github/workflows/deploy.yml` builds and publishes the site whenever `main` changes. One-time setting: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Quality bar

Checked before release with Lighthouse (performance, accessibility, best practices, SEO) and axe in both themes. Every number on the site comes from the project's own report; nothing is estimated.
