# DevStats – GitHub Portfolio Visualizer

**Analyze any GitHub profile with beautiful charts and AI-powered insights.**

Type in a GitHub username and get an instant visual breakdown of their coding activity — language distribution, commit history, top repos, and an optional AI-generated summary.

![DevStats Screenshot](public/og-image.png)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Profile Lookup** | Enter any GitHub username and fetch public profile data instantly |
| 🥧 **Language Pie Chart** | Visual breakdown of programming languages across all repos |
| 📊 **Commit Activity** | Bar chart with toggle between last 30 days (daily) and 6 months (monthly) |
| ⭐ **Top 5 Repos** | Ranked cards sorted by stars with key stats |
| 🤖 **AI Summary** | User-provided API key for OpenAI, Claude, or Gemini → generates a developer profile summary |
| 🌙 **Dark Mode** | Light/dark theme toggle with system preference detection |
| 🇲🇲 **Bilingual** | Full English and Burmese (မြန်မာ) language support |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Charts** | Recharts (PieChart + BarChart) |
| **Data** | GitHub REST API v3 |
| **Font** | Noto Sans Myanmar (Burmese) |
| **Deploy** | Vercel-ready |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts   # Server-side GitHub data API
│   ├── globals.css             # Global styles + dark mode
│   ├── layout.tsx              # Root layout + fonts
│   └── page.tsx                # Main dashboard page
├── components/
│   ├── header.tsx              # Nav bar with theme + language toggles
│   ├── search-bar.tsx          # Username input + analyze button
│   ├── profile-card.tsx        # Avatar, bio, stats
│   ├── language-chart.tsx      # Pie chart
│   ├── top-repos.tsx           # Top 5 sorted cards
│   ├── commit-chart.tsx        # Bar chart with range tabs
│   └── ai-summary.tsx          # API key input + provider selector
├── hooks/
│   ├── use-local-storage.ts    # Persistent client-side storage
│   ├── use-theme.ts            # Dark/light mode hook
│   └── use-translation.ts      # i18n hook (EN + MY)
├── locales/
│   ├── en.json                 # English strings
│   └── my.json                 # Burmese strings (မြန်မာဘာသာ)
└── types/index.ts              # TypeScript interfaces
```

---

## 🔑 AI Summary Setup

The AI Summary feature uses your own API key — nothing is stored on our server.

1. Select your provider: **OpenAI**, **Claude**, or **Gemini**
2. Enter your API key (stored in `localStorage`)
3. Click **Generate Summary**

The summary is generated client-side in your browser and respects the selected UI language.

---

## 🌐 API

```
GET /api/analyze?username={user}&range={30d|6mo}
```

Returns structured JSON: profile, top 5 repos, language breakdown, and commit activity.

---

## 📝 License

MIT

---

Built by [Min Tayza](https://github.com/minntayza)
