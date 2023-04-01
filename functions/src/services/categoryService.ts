import { createId } from "@paralleldrive/cuid2";
import { HttpStatusCode } from "../constants";
import { Category } from "../entities/databaseEntities";
import { createRequestToEntity, entitytoResponseModel, updateRequestToEntity } from "../mappings/categoryMapper";
import { CategoryCreateRequest, CategoryUpdateRequest, PaginatedResponse, ServiceResponse } from "../models/apiModels";
import { CategoryFirestoreRepository } from "../repositories/categories/categoryFirestoreRepository";
import { FilterCondition } from "../repositories/inventoryFirestoreRepository";
import { ServiceBase } from "./baseService";


export class CategoryService extends ServiceBase<Category> {
    _categoryRepo: CategoryFirestoreRepository;

    constructor(categoryRepository: CategoryFirestoreRepository) {
        super();
        this._categoryRepo= categoryRepository;
    }

    public async create(request: CategoryCreateRequest): Promise<ServiceResponse<Category>> {
        const response: ServiceResponse<Category> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };

        try {
            const id = createId();

            const entity = createRequestToEntity(request, id);

            if (entity.statusCode !== HttpStatusCode.OK) {
                response.errorMessage = entity.errorMessage;
                response.statusCode = entity.statusCode;
                return response;
            }

            const result = await this._categoryRepo.create(entity.data!);

            if (result) {
                const data = entitytoResponseModel(result);
                response.data = data;
                response.statusCode = HttpStatusCode.Created;
                return response;
            }

            response.errorMessage = 'Category not created';
            response.statusCode = HttpStatusCode.InternalServerError;
            return response;
        } catch (error: any) {
            response.errorMessage = error ? error.message : 'Category not created';
            response.statusCode = HttpStatusCode.InternalServerError;
            return response;
        }
    }

    public async update(request: CategoryUpdateRequest, id: string): Promise<ServiceResponse<Category>> {
        const response: ServiceResponse<Category> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };

        try {
            const product = updateRequestToEntity(request, id);
            const result = await this._categoryRepo.update(product);

            if (result) {
                const updated = await this._categoryRepo.getById(id);
                if (updated) {
                    response.data = entitytoResponseModel(updated);
                    response.statusCode = HttpStatusCode.OK;
                    return response;
                }
                response.errorMessage = 'Category not found';
                response.statusCode = HttpStatusCode.InternalServerError;
                return response;
            }

            response.errorMessage = 'Category not found';
            response.statusCode = HttpStatusCode.InternalServerError;
            return response;
        } catch (error: any) {
            response.errorMessage = error ? error.message : 'Category not updated';
            response.statusCode = HttpStatusCode.InternalServerError;
            return response;
        }
    }

    public async delete(id: string): Promise<ServiceResponse<Category>> {
        const response: ServiceResponse<Category> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };

        try {
            // await this._productRepo.getById(id);

            await this._categoryRepo.delete(id);

            // Make sure to delete cascading values from other entities 

            response.statusCode = HttpStatusCode.NoContent;
            return response;
        } catch (error: any) {
            response.errorMessage = error ? error.message : 'Category not deleted';
            response.statusCode = HttpStatusCode.InternalServerError;
            return response;
        }
    }

    public async getById(id: string): Promise<ServiceResponse<Category>> {
        const response: ServiceResponse<Category> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };

        try {
            const result = await this._categoryRepo.getById(id);
            if (result) {
                let product: Category = undefined as unknown as Category;

                    product = entitytoResponseModel(result);

                if (!product) {
                    response.errorMessage = 'Category not found';
                    response.statusCode = HttpStatusCode.NotFound;
                    return response;
                }

                response.data = entitytoResponseModel(result);
                response.statusCode = HttpStatusCode.OK;
                return response;
            }

            response.errorMessage = 'Category not found';
            response.statusCode = HttpStatusCode.NotFound;
            return response;
        } catch (error: any) {
            response.errorMessage = error ? error.message : 'Internal Server Error';
            response.statusCode = HttpStatusCode.InternalServerError;
            return response;
        }
    }

    public async getPaginated(
        limit: number,
        cursor?: string,
        orderBy?: string,
        filters?: FilterCondition[]
    ):Promise<ServiceResponse<PaginatedResponse<Category>>> {
        const response: ServiceResponse<PaginatedResponse<Category>> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };

        const all = await this._categoryRepo.get(100000, undefined, filters, orderBy);
        const result = await this._categoryRepo.get(limit, cursor, filters, orderBy);

        if (all && result && result.length > 0) {
                const limitResults = result.map((branch) => {
                        return branch;
                })

            const paginatedResponse: PaginatedResponse<Category> = {
                total: all.length,
                limit: limit,
                cursor: limitResults[limitResults.length - 1].id,
                data: limitResults
            };
            response.data = paginatedResponse;
            response.statusCode = HttpStatusCode.OK;
            return response;
        } else if (result && result.length === 0) {
            response.data = [];
            response.statusCode = HttpStatusCode.OK;
            return response;
        }

        response.errorMessage = 'Response could not be constructed';
        response.statusCode = HttpStatusCode.InternalServerError;
        return response;
    }
}
