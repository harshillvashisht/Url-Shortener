import { LinkResponseDTO } from "./types.js";
import { config } from "../../infrastructure/config/index.js";

export const toLinkResponseDTO = (link: LinkResponseDTO) => {

    const shortUrl = `${config.app.baseUrl}/${link.shortCode}`;

    return {
        id: link.id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        shortUrl: shortUrl,
        createdAt: link.createdAt
    }
};