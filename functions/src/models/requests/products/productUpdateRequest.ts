export interface ProductUpdateRequest {
    id: string;
    sku?: string;
    productName?: string;
    description?: string;
    categoryId?: string;
    quantity?: number;
    unitPrice?: number;
}

