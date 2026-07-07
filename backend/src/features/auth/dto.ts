import { AuthResponseDTO, GetProfileResponseDTO } from "./types.js";
import { User } from "@prisma/client/wasm";

export const toAuthResponseDTO = (user: User): AuthResponseDTO => {
    return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

export const toGetProfileResponseDTO = (user: User): GetProfileResponseDTO => {
    return {
        id: user.id,
        email: user.email,
    };
}

