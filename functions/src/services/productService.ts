import { createId } from "@paralleldrive/cuid2";
import { HttpStatusCode } from "../constants";
import { Category } from "../entities/databaseEntities";
import { Product as ProductModel } from "../models/apiModels";
import { createRequestToEntity, entitytoResponseModel, updateRequestToEntity } from "../mappings/productMapper";
import { PaginatedResponse, ProductCreateRequest, ProductUpdateRequest, ServiceResponse } from "../models/apiModels";
import { CategoryFirestoreRepository } from "../repositories/categories/categoryFirestoreRepository";
import { FilterCondition } from "../repositories/inventoryFirestoreRepository";
import { ProductFirestoreRepository } from "../repositories/product/productFirestoreRepository";
import { ServiceBase } from "./baseService";

export class ProductService extends ServiceBase<ProductModel> {
    _productRepo: ProductFirestoreRepository; 
    _categoryRepo: CategoryFirestoreRepository;

  constructor(productRepository: ProductFirestoreRepository, categoryRepository: CategoryFirestoreRepository) {
        super();
        this._productRepo = productRepository;
        this._categoryRepo = categoryRepository;

    }

    public async create(request: ProductCreateRequest): Promise<ServiceResponse<ProductModel>> {
        const response: ServiceResponse<ProductModel> = {
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

            const category = await this._categoryRepo.getById(request.categoryId);

            if (!category) {
                response.errorMessage = 'Category not found';
                response.statusCode = HttpStatusCode.NotFound;
                return response;
            }

            const responseCategory: Partial<Category> = {
                id: category.id,
                name: category.name,
            }

            const result = await this._productRepo.create(entity.data!);

            if (result) {
                const data = entitytoResponseModel(result, responseCategory);
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

    public async update(request: ProductUpdateRequest, id: string): Promise<ServiceResponse<ProductModel>> {
        const response: ServiceResponse<ProductModel> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };

        try {
            
            const oldProduct = await this._productRepo.getById(id)

            if(!oldProduct) {
                response.statusCode = HttpStatusCode.NotFound
                response.errorMessage = 'Product not found'
                return response;
            }

            const product = updateRequestToEntity(request, oldProduct, id);

             const category = await this._categoryRepo.getById(product.categoryId);

            if (!category) {
                response.errorMessage = 'Category not found';
                response.statusCode = HttpStatusCode.NotFound;
                return response;
            }

            const responseCategory: Partial<Category> = {
                id: category.id,
                name: category.name,
            }

            const result = await this._productRepo.update(product);

            if (result) {
                const updated = await this._productRepo.getById(id);
                if (updated) {
                    response.data = entitytoResponseModel(updated, responseCategory);
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

    public async delete(id: string): Promise<ServiceResponse<ProductModel>> {
        const response: ServiceResponse<ProductModel> = {
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

    public async getById(id: string): Promise<ServiceResponse<ProductModel>> {
        const response: ServiceResponse<ProductModel> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };

        try {
            const result = await this._productRepo.getById(id);

            const category = await this._categoryRepo.getById(result?.categoryId ?? '');

            if (!category) {
                response.errorMessage = 'Category not found';
                response.statusCode = HttpStatusCode.InternalServerError;
                return response;
            }

            const responseCategory: Partial<Category> = {
                id: category.id,
                name: category.name,
            }

                
            if (result) {
                let product: ProductModel = undefined as unknown as ProductModel;

                    product = entitytoResponseModel(result, responseCategory);

                if (!product) {
                    response.errorMessage = 'Mapping Error';
                    response.statusCode = HttpStatusCode.InternalServerError;
                    return response;
                }

                response.data = product;
                response.statusCode = HttpStatusCode.OK;
                return response;
            }

            response.errorMessage = 'Product not found';
            response.statusCode = HttpStatusCode.NotFound;
            return response;
        } catch (error: any) {
            response.errorMessage = error ? error.message : 'Internal Server Error';
            response.statusCode = HttpStatusCode.InternalServerError;
            return response;
        }
    }

    public async getPaginated( limit: number, cursor?: string, orderBy?: string, filters?: FilterCondition[]): Promise<ServiceResponse<PaginatedResponse<ProductModel>>> {
        const response: ServiceResponse<PaginatedResponse<ProductModel>> = {
            data: undefined,
            errorMessage: '',
            statusCode: 0
        };

        const all = await this._productRepo.get(100000, undefined, filters, orderBy);
        const result = await this._productRepo.get(limit, cursor, filters, orderBy);

        if (all && result && result.length > 0) {
                const limitResults = await Promise.all(
                    result.map(async (product) => {
                        const category = await this._categoryRepo.getById(product.categoryId);
                            const responseProduct: ProductModel = {
                                id: product.id,
                                sku: product.sku,
                                productName: product.productName,
                                description: product.description,
                                quantity: product.quantity,
                                unitPrice: product.unitPrice,
                                category: {
                                    id: category?.id ?? 'none',
                                    name: category?.name ?? 'none',
                                }
                        }
                            return responseProduct;
                    })
            )

            const paginatedResponse: PaginatedResponse<ProductModel> = {
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
