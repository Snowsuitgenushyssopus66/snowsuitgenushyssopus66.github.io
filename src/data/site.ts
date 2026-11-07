// Site-wide content: profile, experience, skills, education.
// Edit this file to change anything outside the project pages.
// Sources: LinkedIn profile (experience, dates, education, certifications)
// and Project_Points.md (skills must be used in at least one project, except Power BI).

export const profile = {
  name: 'Melvin Mathew',
  roles: 'Data Scientist and AI/ML Engineer',
  location: 'Bengaluru, India',
  email: 'melvinmathew9991@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mathew-melvin',
  github: 'https://github.com/melvinmathew9991',
  resume: '/resume.pdf',
  // Update this date whenever public/resume.pdf is replaced.
  resumeUpdated: '2026-11-06',
  description:
    'Data Scientist and AI/ML Engineer in Bengaluru. Fraud detection, forecasting, credit risk and RAG systems, each audited until the numbers held up. Available now for full-time and freelance work.',
};

// The "correction ledger" on the home page: figures that looked good, and what they were after checking.
// Every number here is from Project_Points.md.
export const corrections = [
  {
    project: 'Credit default model',
    measure: 'Gini',
    before: '0.927',
    after: '0.2914',
    note: '85% of the reported Gini came from data not available at application time.',
    href: '/projects/credit-default-model-audit/',
  },
  {
    project: 'ICU mortality model (MIMIC-III)',
    measure: 'ROC-AUC',
    before: '0.770',
    after: '0.606',
    note: 'Whole-stay features and repeat patients across the split were inflating my own first result.',
    href: 'https://github.com/melvinmathew9991/emr-sql-pipeline',
  },
  {
    project: 'Bike-taxi demand forecast',
    measure: 'MASE vs naive',
    before: '0.999',
    after: '0.804',
    note: 'The inherited model tied a seasonal-naive baseline. The rebuild beats it on all 50 clusters.',
    href: '/projects/bike-taxi-demand-forecast/',
  },
  {
    project: 'MEDBOT medical RAG',
    measure: 'False refusals',
    before: '18 / 46',
    after: '0 / 46',
    note: 'Fixed without loosening the guard: all 120 unanswerable questions are still refused.',
    href: '/projects/medbot-medical-rag/',
  },
];

// Experience follows LinkedIn wording. Freelance entry wording and dates confirmed by Melvin.
export const experience = [
  {
    role: 'Independent Data Scientist (Freelance)',
    org: 'Self-employed',
    dates: 'Jan 2026 – Present',
    // Left out of the "years of experience" figure in the About section.
    countsTowardYears: false,
    points: [
      'Freelance data science and AI work for clients, alongside portfolio projects. All project code is public on GitHub.',
    ],
  },
  {
    role: 'Data Scientist',
    org: 'upGrad School of Technology',
    dates: 'Sep 2025 – Dec 2025',
    note: "Promoted from Aimerz.ai after upGrad's acquisition; same team, expanded production-facing role.",
    // Tool row: only tools named in the LinkedIn bullets for this role.
    tools: ['Python', 'SQL', 'pandas', 'scikit-learn', 'LangChain', 'FAISS', 'ChromaDB', 'OpenAI', 'Ollama'],
    points: [
      'Engineered end-to-end ML pipelines (Python, SQL, Pandas, scikit-learn) covering ingestion, preprocessing, feature engineering and deployment, reducing data preparation time by about 30%.',
      'Built and deployed RAG-based LLM applications (LangChain, FAISS, ChromaDB, OpenAI, Ollama) on PubMed and Wikipedia knowledge bases, supporting 3+ stakeholder-facing proof-of-concept use cases.',
      'Designed NLP workflows (semantic search, text classification, embedding-based retrieval) for production-facing proof-of-concept systems.',
      'Applied anomaly detection, classification and risk-scoring models to structured data, surfacing actionable insights through EDA and statistical analysis.',
      'Delivered model documentation, dashboards and stakeholder reporting on schedule using Agile/Scrum, across technical and business teams.',
    ],
  },
  {
    role: 'Data Science Content Strategist Associate',
    org: 'Aimerz.ai',
    dates: 'Aug 2024 – Aug 2025',
    tools: ['Python', 'SQL', 'LangChain', 'Vector databases'],
    points: [
      'Designed and built 20+ Python machine learning projects covering regression, classification, NLP and RAG pipelines.',
      'Developed data preprocessing pipelines and EDA frameworks, applying feature engineering, statistical modelling and anomaly detection to real-world datasets.',
      'Built and documented RAG systems, semantic search workflows and LLM integrations with LangChain and vector databases as reference implementations.',
      'Ran model evaluation, bias analysis and data validation across 10+ ML projects, with documentation and reports used by 500+ learners.',
      'Standardised SQL and Python coding practices across curriculum deliverables.',
    ],
  },
];

// "1.5 years" in the About section, worked out from the roles above at build time so it never goes
// stale. Roles marked countsTowardYears: false are skipped; overlapping months count once;
// "Present" means the build date. Rounded to the nearest half year.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function monthIndex(text: string, now: Date) {
  const s = text.trim();
  if (s === 'Present') return now.getFullYear() * 12 + now.getMonth();
  const [mon, year] = s.split(' ');
  const m = MONTHS.indexOf(mon);
  if (m < 0 || !Number(year)) throw new Error(`Unrecognised experience date "${s}" (expected e.g. "Sep 2025")`);
  return Number(year) * 12 + m;
}

export function experienceLabel(now = new Date()) {
  const months = new Set<number>();
  for (const job of experience) {
    if ('countsTowardYears' in job && job.countsTowardYears === false) continue;
    const [from, to] = job.dates.split('–');
    for (let i = monthIndex(from, now); i <= monthIndex(to, now); i++) months.add(i);
  }
  const years = Math.round(months.size / 6) / 2;
  return `${years} year${years === 1 ? '' : 's'}`;
}

// Grouped skills. Rules: no Kafka, microservices, ELK or AWS; ChromaDB is not a skill;
// Power BI appears only here.
export const skills = [
  {
    group: 'Machine learning',
    items: ['scikit-learn', 'XGBoost', 'LightGBM', 'Random forests', 'Time-series forecasting', 'Classification', 'Anomaly detection', 'Recommender systems', 'SHAP', 'Optuna', 'Hyperopt'],
  },
  {
    group: 'Deep learning and NLP',
    items: ['PyTorch', 'TensorFlow / Keras', 'LSTM', 'Hugging Face Transformers', 'Fine-tuning (LoRA, PEFT, QLoRA)', 'Embeddings', 'NLTK'],
  },
  {
    group: 'LLM applications',
    items: ['RAG', 'LangChain', 'FAISS', 'Qdrant', 'OpenAI', 'Google Gemini', 'Ollama', 'Tool-calling agents', 'RAGAS', 'Golden-set evaluation', 'Langfuse'],
  },
  {
    group: 'Statistics and experimentation',
    items: ['A/B testing', 'Power and MDE', 'Hypothesis testing', 'Bayesian modelling (PyMC)', 'statsmodels', 'SciPy', 'Leakage detection', 'Cross-validation'],
  },
  {
    group: 'Deployment and MLOps',
    items: ['FastAPI', 'Docker', 'Google Cloud Run', 'GitHub Actions CI/CD', 'MLflow', 'PSI drift monitoring', 'pytest', 'Prefect'],
  },
  {
    group: 'Data and analytics',
    items: ['Python', 'SQL', 'pandas', 'NumPy', 'DuckDB', 'Streamlit', 'Plotly', 'Tableau', 'Power BI', 'Excel'],
  },
];

export const education = [
  { title: 'BSc Mathematics', org: 'Amrita Vishwa Vidyapeetham', dates: 'Apr 2017 – Feb 2020' },
  { title: 'Data Science bootcamp', org: 'Brototype', dates: 'Apr 2023 – Jun 2024' },
];

// Certifications as listed on the resume, each with its Coursera verification link (Melvin's choice, 2026-11-06).
export const certifications: { name: string; issuer?: string; url?: string }[] = [
  { name: 'Databases and SQL for Data Science with Python', issuer: 'IBM (Coursera)', url: 'https://coursera.org/verify/RJN3DQWG2JDE' },
  { name: 'Machine Learning with Python', issuer: 'IBM (Coursera)', url: 'https://coursera.org/verify/ETYX27CE2ARN' },
  { name: 'Exploratory Data Analysis for Machine Learning', issuer: 'IBM (Coursera)', url: 'https://coursera.org/verify/8SV2A67PGCPF' },
  { name: 'Data Analysis with Python', issuer: 'IBM (Coursera)', url: 'https://coursera.org/verify/NSGRGQLUJA79' },
  { name: 'Python Packages for Data Science', issuer: 'University of Colorado Boulder (Coursera)', url: 'https://coursera.org/verify/N9GV9H32RMER' },
];
