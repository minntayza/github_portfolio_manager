# DevStats — Design Spec

## Overview
One-page web app. Type any GitHub username → get a rich visual portfolio analysis.

## Tech Stack
- Next.js 14 (App Router) — frontend + API routes
- Tailwind CSS — styling
- shadcn/ui — component library (buttons, cards, inputs, skeletons)
- Recharts — pie charts + bar charts
- GitHub MCP + REST API — data source

## 💬 Bilingual Support (Burmese + English)
All UI text is bilingual — Burmese + English. Implementation approaches (pick one):
1. **i18n JSON files** — `locales/en.json` + `locales/my.json` with a language toggle 🇲🇲/🇺🇸
2. **Inline bilingual text** — Display both languages together (e.g., "Search · ရှာဖွေပါ") for a simpler dev experience
3. **Default English, toggle to Burmese** — Language switcher button in the header

**Recommendation:** Option 1 (i18n with language toggle) — cleanest UX and easiest to maintain.

Labels, placeholders, error messages, and AI summary section headers all use i18n keys.
Language preference saved in `localStorage`.

## Layout

```
┌──────────────────────────────────────────────────────────┐
│            🔍 [Enter username]  [Analyze]                │
├──────────────────────────────────────────────────────────┤
│  ┌──────┬──────────────────────────────────────────────┐ │
│  │Avatar│  @username  ·  Name                          │ │
│  │ 128  │  Bio line                                    │ │
│  │      │  📍 Location  ·  🏢 Company                   │ │
│  │      │  📦 X repos  ·  👥 X followers  ·  ⭐ X total │ │
│  └──────┴──────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────┐  ┌──────────────────────────┐  │
│  │   Language Breakdown │  │   Top Repos by Stars     │  │
│  │   ┌─────────────┐   │  │   ┌──────────────────┐   │  │
│  │   │   Pie Chart  │   │  │   │ Repo card 1      │   │  │
│  │   │             │   │  │   │ ⭐ 142  🍴 34     │   │  │
│  │   │             │   │  │   ├──────────────────┤   │  │
│  │   │             │   │  │   │ Repo card 2      │   │  │
│  │   └─────────────┘   │  │   │ ⭐ 89   🍴 12     │   │  │
│  │   Legend below       │  │   ├──────────────────┤   │  │
│  └─────────────────────┘  │   │ Repo card 3      │   │  │
│                            │   │ ⭐ 45   🍴 8      │   │  │
│  ┌─────────────────────┐  │   └──────────────────┘   │  │
│  │   Commit Activity    │  └──────────────────────────┘  │
│  │   ┌─────────────┐   │                                 │
│  │   │  Bar Chart   │   │  ┌──────────────────────────┐  │
│  │   │ (last 12 mo) │   │  │   🔑 AI Summary          │  │
│  │   │             │   │  │  ┌──────────────────┐    │  │
│  │   │             │   │  │  │ [Enter API Key]  │    │  │
│  │   └─────────────┘   │  │  ├──────────────────┤    │  │
│  │   Monthly commits    │  │  │@username is a     │    │  │
│  └─────────────────────┘  │  │full-stack dev...  │    │  │
│                            │  └──────────────────┘    │  │
└──────────────────────────────────────────────────────────┘
```

## AI Summary — API Key Flow
- The AI Summary section shows an input field for the user's own API key
- Supports **OpenAI** or **Anthropic Claude** API keys
- Key is stored in `localStorage` — never sent to our server
- Summary is generated client-side by calling the LLM API directly
- If no key is entered, the section shows a prompt: "Enter your API key to generate an AI summary"
- Language of the AI summary follows the selected UI language (English or Burmese)

## Pages
- **`/`** — Search bar (hero section), then results below
- **`/api/analyze?username={user}`** — Full analysis endpoint

## Data Flow
1. User types username → clicks "Analyze"
2. Frontend calls `/api/analyze?username={user}`
3. API route fetches:
   - Profile (avatar, bio, followers, etc.) — GitHub MCP or REST
   - Repos list with languages, stars, forks — GitHub MCP or REST
   - Commit activity per repo (last 12 months) — REST
4. Backend processes and returns structured JSON
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
