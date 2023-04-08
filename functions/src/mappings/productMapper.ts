import { HttpStatusCode } from '../constants';
import * as entities from '../entities/databaseEntities';
import { Category } from '../entities/databaseEntities';
import * as models from '../models/apiModels';
import { validateObject, ValidateSchema, ValidationResponse } from '../services/util';

export const entitytoResponseModel = (product: entities.Product, category: Partial<Category> ): models.Product => {
    const result: models.Product = {
        id: product.id,
        sku: product.sku,
        productName: product.productName,
        description: product.description,
        category: {
            id: category.id!,
            name: category.name!,
        },
        quantity: product.quantity,
        unitPrice: product.unitPrice,
    };

    return result;
};

export const createRequestToEntity = (product: models.ProductCreateRequest, id: string): ValidationResponse<entities.Product> => {
    const response: ValidationResponse<entities.Product> = {
        data: undefined, 
        errorMessage: '',
        statusCode: 0,
    };
const schema: ValidateSchema<models.ProductCreateRequest> = {
        sku: 'string',
        productName: 'string',
        description: 'string',
        categoryId: 'string',
        quantity: 'number',
        unitPrice: 'number',
    };

    const valid = validateObject(product, schema);

    if (valid.statusCode !== HttpStatusCode.OK) {
        response.statusCode = HttpStatusCode.BadRequest;
        response.errorMessage = valid.errorMessage;
        return response;
    }

    const result: entities.Product = {
        id,
        sku: product.sku,
        productName: product.productName,
        description: product.description,
        categoryId: product.categoryId,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
    };

    response.data = result;
    response.statusCode = HttpStatusCode.OK;
    return response;

}

export const updateRequestToEntity = (product: models.ProductUpdateRequest, oldProduct: entities.Product, id: string): entities.Product => {
    const result: entities.Product = {
        id, 
        sku: product.sku ?? oldProduct.sku,
        productName: product.productName ?? oldProduct.productName,
        description: product.description ?? oldProduct.description,
        categoryId: product.categoryId ?? oldProduct.categoryId,
        quantity: product.quantity ?? oldProduct.quantity,
        unitPrice: product.unitPrice ?? oldProduct.unitPrice,
    };

    return result;
}
