import { NextRequest, NextResponse } from "next/server";
import type {
  GitHubProfile,
  GitHubRepo,
  LanguageStat,
  CommitDay,
  ViewRange,
} from "@/types";

const GITHUB_API = "https://api.github.com";

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "DevStats",
    },
  });
  if (res.status === 404) {
    throw new Error("NOT_FOUND");
  }
  if (res.status === 403) {
    throw new Error("RATE_LIMITED");
  }
  if (!res.ok) {
    throw new Error(`GITHUB_ERROR: ${res.status}`);
  }
  return res.json();
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Scala: "#c22d40",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

function getLanguageColor(lang: string): string {
  return LANGUAGE_COLORS[lang] || "#6b7280";
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");
  const range = (searchParams.get("range") || "30d") as ViewRange;

  if (!username || typeof username !== "string") {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const [profile, repos] = await Promise.all([
      fetchJson(`${GITHUB_API}/users/${username}`) as Promise<GitHubProfile>,
      fetchJson(
        `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`
      ) as Promise<GitHubRepo[]>,
    ]);

    // Calculate total stars
    const totalStars = repos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );

    // Language aggregate across all repos
    const langMap = new Map<string, number>();
    for (const repo of repos) {
      if (repo.language) {
        langMap.set(
          repo.language,
          (langMap.get(repo.language) || 0) + 1
        );
      }
    }
    const languages: LanguageStat[] = Array.from(langMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
        color: getLanguageColor(name),
      }));

    // Top 5 repos by stars
    const topRepos = [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5);

    // Fetch commit activity
    const commits: CommitDay[] = [];

    if (range === "30d") {
      // Daily commits for last 30 days
      const since = new Date();
      since.setDate(since.getDate() - 30);
      const sinceStr = since.toISOString();

      for (const repo of topRepos.slice(0, 3)) {
        try {
          const commitsData = await fetchJson(
            `${GITHUB_API}/repos/${username}/${repo.name}/commits?since=${sinceStr}&per_page=100`
          );
          if (Array.isArray(commitsData)) {
            for (const c of commitsData) {
              const dateStr = c.commit?.author?.date?.slice(0, 10);
              if (dateStr) {
                commits.push({ date: dateStr, count: 1 });
              }
            }
          }
        } catch {
          // Skip repos with no commits
        }
      }

      // Aggregate by day
      const dayMap = new Map<string, number>();
      for (const c of commits) {
        dayMap.set(c.date, (dayMap.get(c.date) || 0) + c.count);
      }

      commits.length = 0;
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        commits.push({ date: key, count: dayMap.get(key) || 0 });
      }
    } else {
      // Monthly commits for last 6 months
      const since = new Date();
      since.setMonth(since.getMonth() - 6);
      const sinceStr = since.toISOString();

      for (const repo of topRepos.slice(0, 3)) {
        try {
          const commitsData = await fetchJson(
            `${GITHUB_API}/repos/${username}/${repo.name}/commits?since=${sinceStr}&per_page=100`
          );
          if (Array.isArray(commitsData)) {
            for (const c of commitsData) {
              const dateStr = c.commit?.author?.date?.slice(0, 7);
              if (dateStr) {
                commits.push({ date: dateStr, count: 1 });
              }
            }
          }
        } catch {
          // Skip repos with no commits
        }
      }

      // Aggregate by month
      const monthMap = new Map<string, number>();
      for (const c of commits) {
        monthMap.set(c.date, (monthMap.get(c.date) || 0) + c.count);
      }

      commits.length = 0;
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = d.toISOString().slice(0, 7);
        commits.push({ date: key, count: monthMap.get(key) || 0 });
      }
    }

    return NextResponse.json({
      profile,
      topRepos,
      languages,
      commits,
      range,
      totalStars,
    });
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    if (error.message === "RATE_LIMITED") {
      return NextResponse.json(
        { error: "Rate limited" },
        { status: 429 }
      );
    }
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
