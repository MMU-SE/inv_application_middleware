import {CategoryModel} from "./categoryModels";

export type ProductModel = {
  id: string,
  sku: string,
  productName: string,
  category: CategoryModel,
  quantity: number,
  unitPrice: number,
}

export type DetailedProductModel = {
    id: string,
    sku: string,
    productName: string,
    description: string,
    category: CategoryModel,
    quantity: number,
    unitPrice: number,
    createdAt: string,
    updatedAt: string,
    }

export type PaginatedProductResponseModel = {
    total: number,
    limit: number,
    cursor: string,
    products: ProductModel[],
}

export type ProductCreateRequestModel = {
    sku: string,
    productName: string,
    description: string,
    categoryId: string,
    quantity: number,
    unitPrice: number,
}

export type ProductUpdateRequestModel = {
    sku?: string,
    productName?: string,
    description?: string,
    categoryId?: string,
    quantity?: number,
    unitPrice?: number,
}
