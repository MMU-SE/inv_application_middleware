export interface ServiceResponse<T> {
    data?: T | T[];
    errorMessage: string;
    statusCode: number;
}
