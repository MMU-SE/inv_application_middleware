import { createId } from "@paralleldrive/cuid2";
import { HttpStatusCode } from "../constants";
import { Product } from "../entities/databaseEntities";
import { createRequestToEntity, toModel, updateRequestToEntity } from "../mappings/productMapper";
import { PaginatedResponse, ProductCreateRequest, ProductUpdateRequest, ServiceResponse } from "../models/apiModels";
import { FilterCondition } from "../repositories/inventoryFirestoreRepository";
import { ProductFirestoreRepository } from "../repositories/product/productFirestoreRepository";
import { ServiceBase } from "./baseService";

export class ProductService extends ServiceBase<Product> {
    _productRepo: ProductFirestoreRepository; 

    constructor(productRepository: ProductFirestoreRepository) {
        super();
        this._productRepo = productRepository;
    }

    public async create(request: ProductCreateRequest): Promise<ServiceResponse<Product>> {
        const response: ServiceResponse<Product> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };

        try {
            const id = createId();

            const entity = createRequestToEntity(request, id);

            const result = await this._productRepo.create(entity);

            if (result) {
                const data = toModel(result);
                response.data = data;
                response.statusCode = HttpStatusCode.Created;
                return response;
            }

            response.errorMessage = 'Product not created';
            response.statusCode = HttpStatusCode.InternalServerError;
            return response;
        } catch (error: any) {
            response.errorMessage = error ? error.message : 'Product not created';
            response.statusCode = HttpStatusCode.InternalServerError;
            return response;
        }
    }

    public async update(request: ProductUpdateRequest): Promise<ServiceResponse<Product>> {
        const response: ServiceResponse<Product> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };

        try {
            // for validation later, use this to get the existing branch
            await this._productRepo.getById(request.id);

            const branch = updateRequestToEntity(request, request.id);
            const result = await this._productRepo.update(branch);

            if (result) {
                const updated = await this._productRepo.getById(request.id);
                if (updated) {
                    response.data = toModel(updated);
                    response.statusCode = HttpStatusCode.OK;
                    return response;
                }
                response.errorMessage = 'Product not found';
                response.statusCode = HttpStatusCode.InternalServerError;
                return response;
            }

            response.errorMessage = 'Product not found';
            response.statusCode = HttpStatusCode.InternalServerError;
            return response;
        } catch (error: any) {
            response.errorMessage = error ? error.message : 'Product not updated';
            response.statusCode = HttpStatusCode.InternalServerError;
            return response;
        }
    }

    public async delete(id: string): Promise<ServiceResponse<Product>> {
        const response: ServiceResponse<Product> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };

        try {
            // await this._productRepo.getById(id);

            await this._productRepo.delete(id);

            // Make sure to delete cascading values from other entities 

            response.statusCode = HttpStatusCode.NoContent;
            return response;
        } catch (error: any) {
            response.errorMessage = error ? error.message : 'Product not deleted';
            response.statusCode = HttpStatusCode.InternalServerError;
            return response;
        }
    }

    public async getById(id: string): Promise<ServiceResponse<Product>> {
        const response: ServiceResponse<Product> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };

        try {
            const result = await this._productRepo.getById(id);
            if (result) {
                let product: Product = undefined as unknown as Product;

                    product = toModel(result);

                if (!product) {
                    response.errorMessage = 'Product not found';
                    response.statusCode = HttpStatusCode.NotFound;
                    return response;
                }

                response.data = toModel(result);
                response.statusCode = HttpStatusCode.OK;
                return response;
            }

            response.errorMessage = 'Product not found';
            response.statusCode = HttpStatusCode.NotFound;
            return response;
        } catch (error: any) {
            response.errorMessage = error ? error.message : 'Product not found';
            response.statusCode = HttpStatusCode.InternalServerError;
            return response;
        }
    }

    public async getPaginated( limit: number, cursor?: string, orderBy?: string, filters?: FilterCondition[]): Promise<ServiceResponse<PaginatedResponse<Product>>> {
        const response: ServiceResponse<PaginatedResponse<Product>> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };

        const all = await this._productRepo.get(100000, undefined, filters, orderBy);
        const result = await this._productRepo.get(limit, cursor, filters, orderBy);

        if (all && result && result.length > 0) {
                const limitResults = result.map((branch) => {
                        return branch;
                })

            const paginatedResponse: PaginatedResponse<Product> = {
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
