import { api } from "./axios";
import type { LinkRequest } from "../types/links";

export const createLinkapi = async (linkRequest: LinkRequest) => {
  const response = await api.post("/links", linkRequest);
  return response.data;
}

export const getLinksapi = async (page: number, limit: number) => {
  const response = await api.get("/links", {
    params: {
      page,
      limit
    }
  });
  return response.data;
}

export const deleteLinkapi = async (id: string) => {
  const response = await api.delete(`/links/${id}`);
  return response.data;
}