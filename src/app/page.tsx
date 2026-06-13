"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import { ProfileCard } from "@/components/profile-card";
import { LanguageChart } from "@/components/language-chart";
import { TopRepos } from "@/components/top-repos";
import { CommitChart } from "@/components/commit-chart";
import { AiSummary } from "@/components/ai-summary";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import type { AnalysisResult, ViewRange } from "@/types";

export default function Home() {
  const { t } = useTranslation();
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<ViewRange>("30d");
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(
    async (username: string) => {
      setLoading(true);
      setError(null);
      setSearched(true);

      try {
        const res = await fetch(`/api/analyze?username=${encodeURIComponent(username)}&range=${range}`);

        if (res.status === 404) {
          setError(t("errors.notFound"));
          setData(null);
          return;
        }
        if (res.status === 429) {
          setError(t("errors.rateLimited"));
          setData(null);
          return;
        }
        if (!res.ok) {
          setError(t("errors.generic"));
          setData(null);
          return;
        }

        const result: AnalysisResult = await res.json();
        setData(result);
      } catch {
        setError(t("errors.networkError"));
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [range, t]
  );

  const handleRangeChange = useCallback(
    async (newRange: ViewRange) => {
      setRange(newRange);
      if (data) {
        setLoading(true);
        try {
          const res = await fetch(
            `/api/analyze?username=${encodeURIComponent(data.profile.login)}&range=${newRange}`
          );
          if (res.ok) {
            const result: AnalysisResult = await res.json();
            setData(result);
          }
        } catch {
          // keep existing data
        } finally {
          setLoading(false);
        }
      }
    },
    [data]
  );

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("app.subtitle")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("search.placeholder")}
          </p>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setError(null);
                if (data) handleSearch(data.profile.login);
              }}
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              {t("errors.retry")}
            </Button>
          </div>
        )}

        {/* Results */}
        {data && !error && (
          <div className="space-y-6">
            {/* Profile Card */}
            <ProfileCard profile={data.profile} totalStars={data.totalStars} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LanguageChart data={data.languages} loading={loading} />
              <TopRepos repos={data.topRepos} loading={loading} />
            </div>

            {/* Commit Activity */}
            <CommitChart
              data={data.commits}
              range={data.range}
              onRangeChange={handleRangeChange}
              loading={loading}
            />

            {/* AI Summary */}
            <AiSummary data={data} />
          </div>
        )}

        {/* Initial State (no search yet, no error) */}
        {!searched && !error && (
          <div className="text-center py-16">
            <p className="text-sm text-muted-foreground">
              Enter a GitHub username above to get started
            </p>
          </div>
        )}

        {/* Empty State (searched but no results) */}
        {searched && !data && !loading && !error && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              {t("empty.noRepos")}
            </p>
          </div>
        )}
      </main>
    </>
  );
}
