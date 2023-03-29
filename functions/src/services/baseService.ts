import { ServiceResponse } from "../models/apiModels";
import { FilterCondition } from "../repositories/inventoryFirestoreRepository";

export abstract class ServiceBase<T> {
    protected async getById(id: string): Promise<ServiceResponse<T>> {
        const response: ServiceResponse<T> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };
        return response;
    }

    protected async getAll(): Promise<ServiceResponse<T[]>> {
        const response: ServiceResponse<T[]> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };
        return response;
    }

    protected async get(cursor: string, limit: number, orderBy?: string, filters?: FilterCondition[]): Promise<ServiceResponse<T[]>> {
        const response: ServiceResponse<T[]> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };

        return response;
    }
}
