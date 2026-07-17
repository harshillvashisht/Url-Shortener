import { useEffect, useState } from "react";
import { GetAnalyticsResponse } from "../types/analytics";
import { getAnalyticsapi } from "../api/analytics";

export default function useAnalytics(id: string) {
    const [analytics, setAnalytics] = useState<GetAnalyticsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAnalytics = async () => {
        setIsLoading(true);

        try {
            const response = await getAnalyticsapi(id);
            setAnalytics(response);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [id]);

    return {
        analytics,
        isLoading
    };
}