export interface GitHubProfile {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  company: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

export interface LanguageStat {
  name: string;
  value: number;
  color: string;
}

export interface CommitDay {
  date: string;
  count: number;
}

export interface AnalysisResult {
  profile: GitHubProfile;
  topRepos: GitHubRepo[];
  languages: LanguageStat[];
  commits: CommitDay[];
  range: "30d" | "6mo";
  totalStars: number;
}

export type ViewRange = "30d" | "6mo";

export type AiProvider = "openai" | "claude" | "gemini";

export type Language = "en" | "my";
