# Portfolio Management — CLAUDE.md

## Project Overview

A web application that analyzes GitHub portfolios and presents them with easy-to-understand graphical visualizations. Users input a GitHub username and get a rich, visual breakdown of their coding activity, language proficiency, project quality, and contribution patterns.

**Goal:** Make GitHub portfolios instantly scannable and insightful for developers, recruiters, and teams.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18+ with Next.js 14+ (App Router) |
| **UI Library** | Tailwind CSS + shadcn/ui components |
| **Charts** | Recharts / D3.js for interactive visualizations |
| **Backend** | Next.js API routes (or standalone FastAPI if heavy computation) |
| **Data Source** | GitHub REST API v3 + GraphQL v4 |
| **Auth (optional)** | NextAuth.js for GitHub OAuth (extended quotas) |
| **State Mgmt** | React Query (TanStack Query) for caching API calls |
| **Deployment** | Vercel (frontend) + optional serverless functions |
| **Testing** | Vitest + Playwright for E2E |

---

## Features

### Core Features
- **GitHub Profile Lookup** — Input any GitHub username and fetch public profile data
- **Language Breakdown** — Pie/bar chart showing language distribution across repos
- **Commit Activity** — Heatmap or timeline of commit activity over time
- **Repo Quality Scoring** — Stars, forks, open issues, README quality, last updated
- **Contribution Calendar** — Visual contribution grid (like GitHub's own)
- **Top Repos** — Ranked cards with key stats (stars, forks, language, description)

### AI-Powered Features
- **AI Summary** — LLM-generated one-paragraph summary of the developer's strengths and style (e.g., "Full-stack engineer focused on React and Python, with strong open-source contributions...")
- **Skill Assessment** — AI infers proficiency levels per language based on commit frequency, project complexity, and repo diversity
- **Recommendation Engine** — Personalized suggestions: "You're strongest in TypeScript — try contributing to..." or "Consider writing more README docs"
- **Portfolio Narrative** — Auto-generates a README-style narrative of the developer's journey: "Started with Python scripts → built web apps → contributed to open-source frameworks"
- **Repo Categorizer** — AI groups repos into logical categories (Frontend, Backend, DevOps, ML, Docs) rather than a flat list

### Visualization Examples
- Radar/Spider chart for multi-dimensional skill comparison
- Treemap for repository size/language composition
- Timeline graph showing language adoption over time
- Network graph showing repo dependencies / contributors
- Scorecards with percentile rankings

---

## Architecture (High-Level)

```
User Input (GitHub username)
        │
        ▼
┌─────────────────────┐
│  GitHub API Gateway  │  ← Rate-limited, cached (Redis or in-memory)
│  (REST + GraphQL)    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Data Processing     │  ← Transform raw API data into analytics
│  & Analytics Engine  │     Compute scores, trends, distributions
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  AI Analysis Layer   │  ← LLM calls for summaries & insights
│  (OpenAI / Claude)   │     (streamed, async where possible)
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Visualization Layer │  ← Charts, graphs, cards, scorecards
│  (React + Recharts)  │
└─────────────────────┘
```

---

## API Routes (Next.js)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/analyze?username={user}` | GET | Full portfolio analysis (profile + repos + AI summary) |
| `/api/profile?username={user}` | GET | Basic profile + stats |
| `/api/repos?username={user}` | GET | List of repos with metadata |
| `/api/ai-summary?username={user}` | GET | AI-generated developer summary |
| `/api/ai-categorize?username={user}` | POST | Categorize repos via AI |

---

## Definitions of Done

### Per Feature
- [ ] Feature is accessible via the web UI (not just API)
- [ ] Loading states (skeleton/spinner) shown during data fetch
- [ ] Empty states handled gracefully (no repos? no commits? expired token?)
- [ ] Error states handled (API rate limit, invalid username, network failure)
- [ ] Mobile-responsive layout passes at 375px width
- [ ] Dark and light mode support
- [ ] All charts render with proper labels and legends
- [ ] Data is cached to avoid redundant GitHub API calls

### Project-Wide
- [ ] No hardcoded secrets or tokens in the repo
- [ ] Tests for core data-processing logic
- [ ] Rate-limit handling (GitHub unauthenticated: 60 req/hr)
- [ ] Build passes with zero errors
- [ ] Accessibility: semantic HTML, ARIA labels on interactive charts

---

## Rate Limiting Strategy

| Auth Level | Rate Limit | Strategy |
|-----------|-----------|----------|
| Unauthenticated | 60 req/hr | Aggressive client-side caching; batch where possible |
| Personal Access Token | 5,000 req/hr | Store via env var, use server-side to protect it |
| GitHub OAuth (user) | 5,000 req/hr per user | Implement if high-traffic is expected |

Cache policy: Cache profile/repo data for 1 hour (stale-while-revalidate with React Query).

---

## Performance Considerations

- Use GitHub GraphQL API for batched queries (fetch profile + repos + languages in one call)
- Lazy-load heavy visualizations (d3 network graphs)
- Paginate repos server-side, don't fetch all at once for users with 1000+ repos
- AI features should stream or show progressively (render charts first, AI summary loads after)
- Consider Edge Functions for the initial data fetch, serverless for AI calls

---

## Git & Branching

- `main` — production-ready, deployable
- Feature branches: `feat/<short-description>`
- Prefix commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- PRs require at least a brief description of what was changed and why

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your GitHub token and optionally AI API key

# Run dev server
npm run dev

# Run tests
npm test
```
