export interface ClickDTO {
    createdAt: string;
    browser: string | null;
    os: string | null;
    ipAddress: string | null;
}

export interface GetAnalyticsResponse {
    totalClicks: number;
    todayClicks: number;
    lastClicked: ClickDTO | null;
    recentClicks: ClickDTO[];
}