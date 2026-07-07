type AuthResponseDTO = {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
};

type GetProfileResponseDTO = {
    id: string;
    email: string;
};


export { AuthResponseDTO, GetProfileResponseDTO };