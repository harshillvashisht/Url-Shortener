import { ClickStats, GetAnalyticsDTO } from "./types.js";
import { Click } from "@prisma/client";

const toClickDTO = (click: Click) => ({
    createdAt: click.createdAt,
    browser: click.browser,
    os: click.os,
    ipAddress: click.ipAddress
});


export const toGetAnalyticsDTO = (analyticsData: ClickStats): GetAnalyticsDTO => {

    const lastClickedDTO = analyticsData.lastClicked ? toClickDTO(analyticsData.lastClicked) : null;

    const recentClicksDTO = analyticsData.recentClicks.map(toClickDTO);

    return {
        totalClicks: analyticsData.totalClicks,
        todayClicks: analyticsData.todayClicks,
        lastClicked: lastClickedDTO,
        recentClicks: recentClicksDTO
    }
}