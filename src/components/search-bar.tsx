"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface SearchBarProps {
  onSearch: (username: string) => void;
  loading: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-lg gap-2 mx-auto"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("search.placeholder")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="pl-10"
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading || !username.trim()}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("search.analyzing")}
          </>
        ) : (
          t("search.button")
        )}
      </Button>
    </form>
  );
}
