export interface PaginatedResponse<T> {
    total: number;
    limit: number;
    cursor: string;
    data: T[];
}
