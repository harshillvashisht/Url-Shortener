import { useEffect, useState } from "react";
import { Pagination, links } from "../types/links";
import {createLinkapi , getLinksapi , deleteLinkapi} from "../api/links";

export default function useLinks(page: number) {

    const [links, setLinks] = useState<links[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState<Pagination>({
        totalItems: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });

    const fetchLinks = async (page: number) => {
        setIsLoading(true);

        try {
            const response = await getLinksapi(page, pagination.limit);
            setLinks(response.links);
            setPagination(response.pagination);
        } catch (error) {
            console.error("Error fetching links:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks(page);
    },[page]);

    const createLink = async (originalUrl: string) => {

        try {
            const response = await createLinkapi({ originalUrl });
            await fetchLinks(page);
            return response;
        } catch (error) {
            console.error("Error creating link:", error);
        } 
    };

    const deleteLink = async (id: string) => {

        try {
            await deleteLinkapi(id);
            await fetchLinks(page);
        } catch (error) {
            console.error("Error deleting link:", error);
        } 
    };

    return {
        links,
        isLoading,
        pagination,
        createLink,
        deleteLink
    }
}