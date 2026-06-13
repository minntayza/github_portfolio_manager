"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, GitFork, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import type { GitHubRepo } from "@/types";

interface TopReposProps {
  repos: GitHubRepo[];
  loading?: boolean;
}

export function TopRepos({ repos, loading }: TopReposProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">{t("repos.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!repos.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">{t("repos.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            {t("repos.noData")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base">{t("repos.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {repos.map((repo, index) => (
          <a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <h3 className="font-medium text-sm truncate">{repo.name}</h3>
                </div>
                {repo.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {repo.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              {repo.language && (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {repo.language}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {repo.stargazers_count}
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="h-3 w-3" />
                {repo.forks_count}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(repo.updated_at).toLocaleDateString()}
              </span>
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
