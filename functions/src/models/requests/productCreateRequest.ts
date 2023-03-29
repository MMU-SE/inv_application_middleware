export interface ProductCreateRequest {
    sku: string;
    productName: string;
    description: string;
    category: string;
    quantity: number;
    unitPrice: number;
}
