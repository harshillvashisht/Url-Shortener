import { Click } from "@prisma/client";

export type ClickStats = {
  totalClicks: number;
  todayClicks: number;
  lastClicked: Click | null;
  recentClicks: Click[];
};

export type AnalyticsClickDTO = {
    createdAt: Date;
    browser: string | null;
    os: string | null;
    ipAddress: string | null;
};

export type GetAnalyticsDTO = {
    totalClicks: number;
    todayClicks: number;
    lastClicked: AnalyticsClickDTO | null;
    recentClicks: AnalyticsClickDTO[];
};