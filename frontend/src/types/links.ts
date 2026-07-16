export interface LinkRequest {
  originalUrl: string;
}

export interface Pagination {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface links {
    id: string;
    originalUrl: string;
    shortCode: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}