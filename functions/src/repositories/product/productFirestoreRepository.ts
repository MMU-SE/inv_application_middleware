import { Product } from "../../entities/databaseEntities";
import { FilterCondition, InventoryFirebaseRepository } from "../inventoryFirestoreRepository";


export class ProductFirestoreRepository extends InventoryFirebaseRepository<Product> {
    constructor() {
        super('products');
    }

    public async getById(id: string): Promise<Product | undefined> {
        const result = await super.getById(id);
        if (result) {
            return result;
        }
        return undefined;
    }

    public async create(item: Product): Promise<Product> {
        const result = await super.create(item);
        if (result) {
            return result;
        }
        return {} as Product;
    }

    public async update(item: Product): Promise<Product> {
        const result = await super.update(item);
        if (result) {
            return result;
        }
        return {} as Product;
    }

    public async delete(id: string): Promise<void> {
        await super.delete(id);
    }

    public async get(limit: number, cursor?: string, filters?: FilterCondition[], orderBy?: string, ): Promise<Product[]> {
        try {
            const result = await super.get(limit, cursor, filters, orderBy);
            return result.map((item) => item as Product);
        } catch (error) {
            console.error('ERROR!', error);
            return [] as Product[];
        }
    }
}
