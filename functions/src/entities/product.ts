import { DatabaseEntity } from "./baseEntitiy";

export interface Product extends DatabaseEntity {
    sku: string;
    productName: string;
    description: string;
    category: string;
    quantity: number;
    unitPrice: number;
}
