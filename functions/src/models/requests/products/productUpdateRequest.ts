export interface ProductUpdateRequest {
    id: string;
    sku?: string;
    productName?: string;
    description?: string;
    category?: string;
    quantity?: number;
    unitPrice?: number;
}

