import * as entities from '../entities/databaseEntities';
import * as models from '../models/apiModels';

export const toModel = (product: entities.Product): models.Product => {
    const result: models.Product = {
        id: product.id,
        sku: product.sku,
        productName: product.productName,
        description: product.description,
        category: product.category,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
    };

    return result;
};

export const createRequestToEntity = (product: models.ProductCreateRequest, id: string): entities.Product => {
    const result: entities.Product = {
        id,
        sku: product.sku,
        productName: product.productName,
        description: product.description,
        category: product.category,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
    };

    return result;
}

export const updateRequestToEntity = (product: models.ProductUpdateRequest, id: string): entities.Product => {
    const result: entities.Product = {
        id: product.id,
        sku: product.sku!,
        productName: product.productName!,
        description: product.description!,
        category: product.category!,
        quantity: product.quantity!,
        unitPrice: product.unitPrice!,
    };

    return result;
}
