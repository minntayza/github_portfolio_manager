# DevStats — Design Spec

## Overview
One-page web app. Type any GitHub username → get a rich visual portfolio analysis.

## Tech Stack
- Next.js 14 (App Router) — frontend + API routes
- Tailwind CSS — styling
- shadcn/ui — component library (buttons, cards, inputs, skeletons)
- Recharts — pie charts + bar charts
- GitHub MCP + REST API — data source
- Pyidaungsu font — Burmese text rendering

## 💬 Bilingual Support (Burmese + English)
- Language toggle button in header: **🇲🇲 / 🇺🇸**
- i18n JSON files: `locales/en.json` + `locales/my.json`
- Preference saved in `localStorage`
- Burmese font: **Pyidaungsu** (loaded via Google Fonts or self-hosted)
- Labels, placeholders, error messages, and AI summary section headers all use i18n keys
- Data values (usernames, repo names, numbers) stay in their original language

## Layout

```
┌──────────────────────────────────────────────────────────┐
│   🇲🇲/🇺🇸    🔍 [Enter username]  [Analyze]              │
├──────────────────────────────────────────────────────────┤
│  ┌──────┬──────────────────────────────────────────────┐ │
│  │Avatar│  @username  ·  Name                          │ │
│  │ 128  │  Bio line                                    │ │
│  │      │  📍 Location  ·  🏢 Company                   │ │
│  │      │  📦 X repos  ·  👥 X followers  ·  ⭐ X total │ │
│  └──────┴──────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────┐  ┌──────────────────────────┐  │
│  │   Language Breakdown │  │   Top 5 Repos            │  │
│  │   ┌─────────────┐   │  │   ┌──────────────────┐   │  │
│  │   │   Pie Chart  │   │  │   │ 1. repo-name     │   │  │
│  │   │             │   │  │   │ ⭐ 142  🍴 34     │   │  │
│  │   │             │   │  │   ├──────────────────┤   │  │
│  │   │             │   │  │   │ 2. repo-name     │   │  │
│  │   └─────────────┘   │  │   │ ⭐ 89   🍴 12     │   │  │
│  │   Legend below       │  │   ├──────────────────┤   │  │
│  └─────────────────────┘  │   │ 3. repo-name     │   │  │
│                            │   │ ⭐ 45   🍴 8      │   │  │
│  ┌─────────────────────┐  │   ├──────────────────┤   │  │
│  │   Commit Activity    │  │   │ 4. repo-name     │   │  │
│  │  [30 days] [6 months] │  │   │ ⭐ 23   🍴 4      │   │  │
│  │   ┌─────────────┐   │  │   ├──────────────────┤   │  │
│  │   │  Bar Chart   │   │  │   │ 5. repo-name     │   │  │
│  │   │             │   │  │   │ ⭐ 12   🍴 2      │   │  │
│  │   │             │   │  │   └──────────────────┘   │  │
│  │   └─────────────┘   │  └──────────────────────────┘  │
│  │   Daily/Monthly      │                                 │
│  │   commits            │  ┌──────────────────────────┐  │
│  └─────────────────────┘  │   🔑 AI Summary          │  │
│                            │  ┌──────────────────┐    │  │
│                            │  │ [Provider ▼]      │    │  │
│                            │  │ [Enter API Key]   │    │  │
│                            │  ├──────────────────┤    │  │
│                            │  │@username is a     │    │  │
│                            │  │full-stack dev...  │    │  │
│                            │  └──────────────────┘    │  │
└──────────────────────────────────────────────────────────┘
```

## AI Summary — API Key Flow
- User selects **provider**: OpenAI / Claude / Gemini
- User enters their own API key for the selected provider
- Key + provider stored in `localStorage` — never sent to our server
- Summary is generated **client-side** (browser calls the LLM API directly via fetch)
- If no key is entered, the section shows a prompt to configure one
- Language of the AI summary follows the selected UI language (English or Burmese)

**API endpoints used (client-side):**
| Provider | Endpoint |
|----------|----------|
| OpenAI | `https://api.openai.com/v1/chat/completions` |
| Claude | `https://api.anthropic.com/v1/messages` |
| Gemini | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent` |

## Pages
- **`/`** — Search bar (hero section), then results below

## API Route
- **`/api/analyze?username={user}&range={30d|6mo}`** — Full analysis endpoint

## Data Flow
1. User types username → clicks "Analyze"
2. Frontend calls `/api/analyze?username={user}&range=30d`
3. API route fetches (server-side, via GitHub MCP or REST):
   - Profile (avatar, bio, followers, etc.)
   - Repos list with languages, stars, forks (all repos)
   - Commit activity per repo for the selected range
4. Backend processes and returns structured JSON:
   - Top 5 repos sorted by stars
   - Language aggregate across all repos
   - Commit data points (daily for 30d, monthly for 6mo)
5. Frontend renders charts + cards
6. If user has entered an API key, AI summary is fetched client-side

## States
- **Initial** — Hero search bar, no results
- **Loading** — Skeleton placeholders for each section
- **Success** — Charts + cards + stats rendered
- **Error** — User not found / rate limited / network error with retry button
- **Empty** — User exists but has no repos / no commits

## Responsive
- Desktop: 2-column layout (charts side by side)
- Mobile: Single column stack, scrollable

## Font
- **Pyidaungsu** for Burmese text — loaded via Google Fonts or bundled
- Fallback: system sans-serif for English
- CSS: `font-family: 'Pyidaungsu', system-ui, sans-serif;`
