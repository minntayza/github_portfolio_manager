"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "@/hooks/use-translation";
import type { CommitDay, ViewRange } from "@/types";

interface CommitChartProps {
  data: CommitDay[];
  range: ViewRange;
  onRangeChange: (range: ViewRange) => void;
  loading?: boolean;
}

export function CommitChart({
  data,
  range,
  onRangeChange,
  loading,
}: CommitChartProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">
            {t("commits.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const totalCommits = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm sm:text-base">
            {t("commits.title")}
          </CardTitle>
          {totalCommits > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {totalCommits} {t("commits.commits")}
            </p>
          )}
        </div>
        <Tabs
          value={range}
          onValueChange={(v) => onRangeChange(v as ViewRange)}
        >
          <TabsList className="grid grid-cols-2 h-8">
            <TabsTrigger value="30d" className="text-xs px-3">
              {t("commits.last30d")}
            </TabsTrigger>
            <TabsTrigger value="6mo" className="text-xs px-3">
              {t("commits.last6mo")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {data.length === 0 || totalCommits === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {t("commits.noData")}
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(val: string) => {
                  if (range === "30d") {
                    const d = new Date(val);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }
                  return val.slice(2);
                }}
                interval="preserveStartEnd"
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
              <Tooltip
                labelFormatter={(label) => String(label)}
                formatter={(value) => [value, "commits"]}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
