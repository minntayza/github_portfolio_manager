"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { AiProvider, AnalysisResult } from "@/types";
import { Loader2, Sparkles, Key } from "lucide-react";

interface AiSummaryProps {
  data: AnalysisResult | null;
}

const PROVIDER_ENDPOINTS: Record<AiProvider, string> = {
  openai: "https://api.openai.com/v1/chat/completions",
  claude: "https://api.anthropic.com/v1/messages",
  gemini:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
};

async function callAI(
  provider: AiProvider,
  apiKey: string,
  prompt: string,
  lang: "en" | "my"
): Promise<string> {
  const languageInstruction =
    lang === "my"
      ? "Respond in Burmese (Myanmar language). Use the Pyidaungsu font style."
      : "Respond in English.";

  switch (provider) {
    case "openai": {
      const res = await fetch(PROVIDER_ENDPOINTS.openai, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a GitHub portfolio analyst. ${languageInstruction} Keep it concise (2-3 paragraphs).`,
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 500,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "API error");
      return data.choices[0].message.content;
    }

    case "claude": {
      const res = await fetch(PROVIDER_ENDPOINTS.claude, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system: `You are a GitHub portfolio analyst. ${languageInstruction} Keep it concise (2-3 paragraphs).`,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "API error");
      return data.content[0].text;
    }

    case "gemini": {
      const res = await fetch(`${PROVIDER_ENDPOINTS.gemini}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${languageInstruction}\n\nYou are a GitHub portfolio analyst. Keep it concise (2-3 paragraphs).\n\n${prompt}`,
                },
              ],
            },
          ],
          generationConfig: { maxOutputTokens: 500 },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "API error");
      return data.candidates[0].content.parts[0].text;
    }
  }
}

export function AiSummary({ data }: AiSummaryProps) {
  const { t, lang } = useTranslation();
  const [provider, setProvider] = useLocalStorage<AiProvider>(
    "devstats-ai-provider",
    "openai"
  );
  const [apiKey, setApiKey] = useLocalStorage<string>("devstats-ai-key", "");
  const [keyInput, setKeyInput] = useState(apiKey);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keySaved, setKeySaved] = useState(false);

  const handleSaveKey = () => {
    setApiKey(keyInput);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleGenerate = async () => {
    if (!apiKey || !data) return;

    setLoading(true);
    setError(null);
    setSummary(null);

    const prompt = `Analyze this GitHub developer profile and provide insights:

Username: ${data.profile.login}
Name: ${data.profile.name || "N/A"}
Bio: ${data.profile.bio || "N/A"}
Location: ${data.profile.location || "N/A"}
Company: ${data.profile.company || "N/A"}
Total Repos: ${data.profile.public_repos}
Followers: ${data.profile.followers}
Total Stars: ${data.totalStars}

Top Languages: ${data.languages
      .slice(0, 5)
      .map((l) => `${l.name} (${l.value} repos)`)
      .join(", ")}

Top Repos: ${data.topRepos
      .map(
        (r) =>
          `${r.name} (${r.stargazers_count} stars, ${r.forks_count} forks)`
      )
      .join(", ")}

Total commits (recent): ${data.commits.reduce((s, c) => s + c.count, 0)}

Provide a concise analysis of this developer's skills, strengths, and areas of focus.`;

    try {
      const result = await callAI(provider, apiKey, prompt, lang);
      setSummary(result);
    } catch (err: any) {
      setError(err.message || t("aiSummary.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Sparkles className="h-4 w-4" />
          {t("aiSummary.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key Input */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Select
              value={provider}
              onValueChange={(v) => setProvider(v as AiProvider)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder={t("aiSummary.selectProvider")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="password"
                placeholder={t("aiSummary.apiKeyPlaceholder")}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveKey}
              disabled={!keyInput}
              className="text-xs"
            >
              {keySaved ? t("aiSummary.keySaved") : t("aiSummary.saveKey")}
            </Button>
          </div>
        </div>

        {/* Generate Button */}
        {apiKey && data && (
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full"
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                {t("aiSummary.generating")}
              </>
            ) : (
              t("aiSummary.generate")
            )}
          </Button>
        )}

        {/* Summary Output */}
        {!apiKey && !summary && (
          <p className="text-xs text-muted-foreground text-center py-4">
            {t("aiSummary.noKey")}
          </p>
        )}

        {error && (
          <p className="text-xs text-destructive text-center">{error}</p>
        )}

        {summary && (
          <div className="p-3 rounded-lg bg-muted/50 border text-sm leading-relaxed whitespace-pre-wrap">
            {summary}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
