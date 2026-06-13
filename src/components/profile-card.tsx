"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Building, Users, Archive, Star, Calendar } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import type { GitHubProfile } from "@/types";

interface ProfileCardProps {
  profile: GitHubProfile;
  totalStars: number;
}

export function ProfileCard({ profile, totalStars }: ProfileCardProps) {
  const { t } = useTranslation();

  const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2">
            <AvatarImage src={profile.avatar_url} alt={profile.login} />
            <AvatarFallback>{profile.login[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold">
              {profile.name || profile.login}
            </h2>
            <a
              href={profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:underline"
            >
              @{profile.login}
            </a>
            <p className="text-sm mt-1 text-muted-foreground">
              {profile.bio || t("profile.noBio")}
            </p>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground justify-center sm:justify-start">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </span>
              )}
              {profile.company && (
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5" />
                  {profile.company}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {t("profile.joined")} {joinDate}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm justify-center sm:justify-start">
              <span className="flex items-center gap-1 font-medium">
                <Archive className="h-3.5 w-3.5" />
                {profile.public_repos} {t("profile.repos")}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Users className="h-3.5 w-3.5" />
                {profile.followers} {t("profile.followers")}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Star className="h-3.5 w-3.5" />
                {totalStars} {t("profile.totalStars")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
