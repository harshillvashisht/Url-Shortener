import { api } from "./axios";
import type { GetAnalyticsResponse } from "../types/analytics";

export const getAnalyticsapi = async (id: string) => {
    const response = await api.get(`/analytics/${id}`);
    return response.data as GetAnalyticsResponse;
}