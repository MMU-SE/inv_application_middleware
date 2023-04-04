import { DatabaseEntity } from "./baseEntitiy";

export interface Product extends DatabaseEntity {
    sku: string;
    productName: string;
    description: string;
    categoryId: string;
    quantity: number;
    unitPrice: number;
}
