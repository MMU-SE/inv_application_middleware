import { Request } from "express";
import { FirestoreFilter, FirestoreQueryOptions } from "../repositories/inventoryFirestoreRepository";

export interface QueryFilter {
    key: string;
    value: string;
}
export interface QueryOptions {
    filters?: QueryFilter[];
    orderBy?: string;
    cursor?: string;
    limit: number;
}

export const getQueryOptions = (request: Request): QueryOptions => {
    const filters: QueryFilter[] = [];

    const sortByAsc = request.query.sortByAsc?.toString();
    const sortByDesc = request.query.sortByDesc?.toString();
    const orderBy = sortByAsc ? `${sortByAsc}|asc` : sortByDesc ? `${sortByDesc}|desc` : undefined;
    const cursor = request.query.cursor?.toString();
    const limit = request.query.limit ? parseInt(request.query.limit.toString()) : 10;

    const result: QueryOptions = {
        filters: filters.length > 0 ? filters : undefined,
        orderBy: orderBy,
        cursor: cursor,
        limit: limit
    };

    return result;
};

export const parseQueryParams = (request: Request): FirestoreQueryOptions => {
    const filters: FirestoreFilter[] = [];

    if (request.query.field && request.query.text) {
        filters.push({ key: request.query.field.toString(), value: request.query.text.toString(), operator: '>=' });
        filters.push({ key: request.query.field.toString(), value: request.query.text.toString() + '\uf8ff', operator: '<=' });
    }

    const sortByAsc = request.query.sortByAsc?.toString();
    const sortByDesc = request.query.sortByDesc?.toString();
    const orderBy = sortByAsc ? `${sortByAsc}|asc` : sortByDesc ? `${sortByDesc}|desc` : undefined;

    return {
        filters: filters.length > 0 ? filters : undefined,
        orderBy: orderBy,
        cursor: request.query.cursor?.toString(),
        limit: request.query.limit ? parseInt(request.query.limit.toString()) : 10
    };
};
