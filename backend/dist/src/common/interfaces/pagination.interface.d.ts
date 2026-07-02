export interface PaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}
export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}
export declare function getPaginationOptions(params: PaginationParams): {
    page: number;
    limit: number;
    skip: number;
};
