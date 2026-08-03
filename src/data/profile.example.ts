/**
 * ─────────────────────────────────────────────────────────────
 *  EXAMPLE CONTENT — this is the file the public repo ships.
 *
 *  To run the site:  cp src/data/profile.example.ts src/data/profile.ts
 *  `profile.ts` is gitignored, so your real details never enter
 *  git history. Both files satisfy the same types in schema.ts,
 *  so they cannot drift apart without a typecheck failure.
 * ─────────────────────────────────────────────────────────────
 */

import type { Certification, Education, Job, Profile, Project, SkillGroup, Stat } from './schema'

const EMAIL_USER = 'hello'
const EMAIL_DOMAIN = 'example.com'
const EMAIL = [EMAIL_USER, EMAIL_DOMAIN].join('@')

export const profile: Profile = {
  name: 'Alex Rivera',
  known: 'Alex',
  initials: 'AR',
  handle: 'alex.dev',
  hero: { line1: 'Alex', line2: 'Rivera' },
  role: 'Staff Software Engineer — Platform & Reliability',
  roles: ['Platform Engineer', 'Site Reliability Engineer', 'Cloud Architect', 'Systems Builder'],
  location: 'Remote · UTC+0',
  status: 'Staff Engineer at Northwind',
  emailUser: EMAIL_USER,
  emailDomain: EMAIL_DOMAIN,
  email: EMAIL,
  resumeUrl: '',
  tagline:
    'I design and operate the platforms other engineers ship on — architecture, reliability, and the automation that keeps both honest.',
  bio: [
    'Eight years building and running cloud platform and reliability infrastructure for regulated, high-traffic systems.',
    'I own architecture and delivery for a portfolio of interconnected services, and I lead migrations that finish without anyone noticing they happened.',
    'Lately most of my leverage comes from automation: agent-assisted triage, drift detection, and making the safe path the easy one.',
  ],
  socials: [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/example', handle: '/in/example' },
    { label: 'Email', href: `mailto:${EMAIL}`, handle: EMAIL },
  ],
}

export const stats: Stat[] = [
  { value: 8, suffix: '+', decimals: 0, label: 'Years engineering' },
  { value: 99.95, suffix: '%', decimals: 2, label: 'Platform availability' },
  { value: 60, suffix: '%', decimals: 0, label: 'MTTR reduction' },
  { value: 250, suffix: '+', decimals: 0, label: 'Eng hours saved / quarter' },
]

export const projects: Project[] = [
  {
    id: 'triage',
    title: 'Agentic Triage & Remediation',
    tagline: 'A multi-agent chain that investigates tickets and opens reviewed PRs',
    year: '2025 — Present',
    role: 'Architect & builder',
    org: 'Northwind',
    category: 'AI Systems',
    access: 'internal',
    accessNote:
      'Built and hosted on internal systems. No public deployment — the approach and outcomes below are what can be shared.',
    stack: ['Agent orchestration', 'MCP', 'Python', 'Cloud agent runtime'],
    cover: ['#7c3aed', '#22d3ee'],
    summary:
      'A hosted multi-agent assistant that reads delivery history, engineering knowledge and source repositories, then chains specialised agents to triage a ticket, locate the responsible code, and draft a remediation an engineer reviews and merges.',
    highlights: [
      'Triage split into discrete, auditable steps so each stage cites its evidence rather than asserting a conclusion',
      'Scoped, read-mostly access to internal systems; nothing reaches production without an approved pull request',
      'Recurring investigation patterns packaged as reusable skills so the team invokes one workflow',
    ],
    metrics: [
      { label: 'Eng hours saved / quarter', value: '250+' },
      { label: 'Ticket cycle time', value: '2w → 4d' },
      { label: 'Human review', value: 'Always' },
    ],
    featured: true,
  },
  {
    id: 'migration',
    title: 'Zero-Outage Infrastructure Migration',
    tagline: 'New infrastructure and network, no client impact',
    year: '2025',
    role: 'Technical lead',
    org: 'Northwind',
    category: 'Platform & Cloud',
    access: 'internal',
    accessNote: 'Internal platform. Approach described here; systems are not publicly reachable.',
    stack: ['Cloud infrastructure', 'Kubernetes', 'Terraform', 'CI/CD'],
    cover: ['#ec4899', '#7c3aed'],
    summary:
      'Led the production cutover of a multi-service infrastructure and network migration — sequencing, a rollback position at every step, and monitoring live before traffic moved.',
    highlights: [
      'Zero client-facing outage, with a defined rollback point at every stage',
      'Monitoring coverage restored as part of the migration rather than deferred',
      'Architecture and network design documentation produced up front',
    ],
    metrics: [
      { label: 'Client-facing outage', value: '0' },
      { label: 'Rollback points', value: 'Every stage' },
      { label: 'Monitoring coverage', value: 'Restored' },
    ],
    featured: true,
  },
  {
    id: 'sre',
    title: 'SRE & Observability Practice',
    tagline: 'SLI/SLO instrumentation across a service portfolio',
    year: '2024 — Present',
    role: 'Owner',
    org: 'Northwind',
    category: 'Reliability',
    access: 'internal',
    accessNote: 'Internal dashboards and alerting. Outcomes below are what can be shared publicly.',
    stack: ['Prometheus', 'Grafana', 'Kubernetes', 'Synthetic monitoring'],
    cover: ['#22d3ee', '#84cc16'],
    summary:
      'Defined SLIs and SLOs for availability, latency, error rate and health, then built the instrumentation to make them real — metrics, dashboards, alerting, synthetic monitoring and structured logging.',
    highlights: [
      'Availability raised to 99.95%, MTTR cut ~60%, incident volume down 55%',
      'Runbooks written so on-call is repeatable rather than tribal',
      'Synthetic monitoring catches user-visible failures before clients report them',
    ],
    metrics: [
      { label: 'Availability', value: '99.95%' },
      { label: 'MTTR', value: '−60%' },
      { label: 'Incident volume', value: '−55%' },
    ],
  },
  {
    id: 'drift',
    title: 'Config Drift Detection',
    tagline: 'Cross-repository checks that keep related services in step',
    year: '2024',
    role: 'Builder',
    org: 'Northwind',
    category: 'Platform & Cloud',
    access: 'internal',
    accessNote: 'Internal tooling on self-hosted runners.',
    stack: ['GitHub Actions', 'Self-hosted runners', 'Python'],
    cover: ['#f59e0b', '#ec4899'],
    summary:
      'Related codebases had to stay in lockstep, and drift between them caused most failed releases. Automated cross-repository checks now detect drift and enforce synchronisation before a release can proceed.',
    highlights: [
      'Release failures cut by half by catching divergence at PR time',
      'Runners stay inside the network boundary',
      'Deployment frequency improved once releases stopped being risky',
    ],
    metrics: [
      { label: 'Release failures', value: '−50%' },
      { label: 'Deploy frequency', value: '2w → 1w' },
      { label: 'Drift caught at', value: 'PR time' },
    ],
  },
  {
    id: 'gov',
    title: 'Public Sector Digital Platforms',
    tagline: 'Citizen-facing services on government cloud',
    year: '2020 — 2023',
    role: 'Technical lead',
    org: 'Kern Digital',
    category: 'Government',
    access: 'restricted',
    accessNote:
      'Citizen-facing systems delivered under client agreements. Named agencies and URLs are not publishable — happy to talk through the architecture in an interview.',
    stack: ['.NET', 'React', 'TypeScript', 'Azure', 'Government cloud'],
    cover: ['#06b6d4', '#7c3aed'],
    summary:
      'Led end-to-end delivery of secure, citizen-facing digital platforms — solution architecture, hands-on development, review, release planning and stakeholder coordination.',
    highlights: [
      'Shipped services and applications with identity, CMS and reusable component libraries',
      'Ran production across multiple clouds under government compliance baselines',
      'Sustained 99.99% uptime on services citizens depend on',
    ],
    metrics: [
      { label: 'Uptime sustained', value: '99.99%' },
      { label: 'Clouds operated', value: '3' },
      { label: 'Years leading', value: '3' },
    ],
  },
  {
    id: 'pipelines',
    title: 'Delivery Automation Rebuild',
    tagline: 'Three-hour manual releases down to thirty minutes',
    year: '2022',
    role: 'Builder',
    org: 'Kern Digital',
    category: 'Platform & Cloud',
    access: 'restricted',
    accessNote: 'Internal delivery tooling for client engagements.',
    stack: ['CI/CD', 'PowerShell', 'Configuration management'],
    cover: ['#84cc16', '#06b6d4'],
    summary:
      'Rebuilt CI/CD pipelines with release controls, automation and environment configuration management — turning a three-hour manual ritual into a repeatable thirty-minute run.',
    highlights: [
      'Manual deployment effort cut 80%',
      'Approval gates made compliance auditable rather than reconstructed',
      'Removed the per-environment hand edits that caused most failures',
    ],
    metrics: [
      { label: 'Manual effort', value: '−80%' },
      { label: 'Release time', value: '3h → 30m' },
      { label: 'Repeatable', value: 'Yes' },
    ],
  },
]

export const jobs: Job[] = [
  {
    company: 'Northwind',
    role: 'Staff Engineer — Cloud, SRE & Platform',
    period: '2023 — Present',
    location: 'Remote',
    blurb: 'Platform ownership across a service portfolio.',
    points: [
      'Own architecture and delivery for a portfolio of interconnected services',
      'Guide 6 engineers on architecture, prioritisation, standards and risk management',
      'Defined SLIs and SLOs and built the supporting instrumentation; availability 99.95%, MTTR −60%',
      'Led a multi-service infrastructure migration to production with zero client-facing outage',
      'Built a multi-agent engineering assistant saving 250+ engineering hours per quarter',
    ],
    stack: ['Cloud infrastructure', 'Kubernetes', 'Terraform', 'Prometheus', 'CI/CD'],
  },
  {
    company: 'Kern Digital',
    role: 'Senior Software Developer / Technical Lead',
    period: '2020 — 2023',
    location: 'Remote',
    blurb: 'Secure, citizen-facing public sector platforms.',
    points: [
      'Led delivery end to end — architecture, development, review, release planning, stakeholder coordination',
      'Ran production across multiple clouds, sustaining 99.99% uptime',
      'Rebuilt CI/CD pipelines, cutting manual deployment effort 80%',
    ],
    stack: ['.NET', 'React', 'Azure', 'CI/CD'],
  },
  {
    company: 'Meridian Commerce',
    role: 'Web Developer',
    period: '2018 — 2020',
    location: 'Remote',
    blurb: 'B2B and B2C commerce platforms.',
    points: [
      'Built and supported commerce platforms — inventory, orders, pricing, payment and analytics',
      'Supported production operations and performance tuning',
    ],
    stack: ['React', '.NET', 'SQL Server'],
  },
]

export const education: Education[] = [
  { school: 'Example University', degree: 'BSc (Hons) Software Engineering', period: '2017', note: '' },
]

export const skills: SkillGroup[] = [
  {
    group: 'Cloud & Infrastructure',
    items: [
      { name: 'AWS / Azure / GCP', level: 94 },
      { name: 'Cloud & network architecture', level: 92 },
      { name: 'Kubernetes / Docker', level: 88 },
      { name: 'Terraform & configuration mgmt', level: 84 },
    ],
  },
  {
    group: 'Reliability & Delivery',
    items: [
      { name: 'SRE — SLI / SLO / SLA', level: 94 },
      { name: 'Observability (Prometheus, Grafana)', level: 92 },
      { name: 'Incident response & runbooks', level: 90 },
      { name: 'CI/CD & secure SDLC', level: 90 },
    ],
  },
  {
    group: 'Engineering & AI',
    items: [
      { name: '.NET · Java', level: 90 },
      { name: 'React · TypeScript', level: 86 },
      { name: 'SQL · search infrastructure', level: 88 },
      { name: 'Multi-agent orchestration · MCP', level: 88 },
    ],
  },
]

export const toolbelt = [
  'AWS',
  'Azure',
  'Kubernetes',
  'Terraform',
  'Docker',
  'Prometheus',
  'Grafana',
  'GitHub Actions',
  'Kafka',
  'PostgreSQL',
  '.NET',
  'React',
  'TypeScript',
  'MCP',
]

export const certifications: Certification[] = [
  { name: 'AWS Certified Solutions Architect — Associate', year: '', note: '' },
  { name: 'Certified Kubernetes Administrator', year: '', note: '' },
  { name: 'Azure Solutions Architect Expert', year: '', note: '' },
]
