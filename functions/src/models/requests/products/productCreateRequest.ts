export interface ProductCreateRequest {
    sku: string;
    productName: string;
    description: string;
    categoryId: string;
    quantity: number;
    unitPrice: number;
}
