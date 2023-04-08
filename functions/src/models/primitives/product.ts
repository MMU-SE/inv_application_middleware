export interface Product {
    id: string;
    sku: string;
    productName: string;
    description: string;
    category: {
        id: string;
        name: string;
    }
    quantity: number;
    unitPrice: number;
}
