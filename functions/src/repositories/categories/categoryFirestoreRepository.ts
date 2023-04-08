import { Category } from "../../entities/databaseEntities";
import { FilterCondition, InventoryFirebaseRepository } from "../inventoryFirestoreRepository";


export class CategoryFirestoreRepository extends InventoryFirebaseRepository<Category> {
    constructor() {
        super('categories');
    }

    public async getById(id: string): Promise<Category | undefined> {
        const result = await super.getById(id);
        if (result) {
            return result;
        }
        return undefined;
    }

    public async create(item: Category): Promise<Category> {
        const result = await super.create(item);
        if (result) {
            return result;
        }
        return {} as Category;
    }

    public async update(item: Category): Promise<Category> {
        const result = await super.update(item);
        if (result) {
            return result;
        }
        return {} as Category;
    }

    public async delete(id: string): Promise<void> {
        await super.delete(id);
    }

    public async get(limit: number, cursor?: string, filters?: FilterCondition[], orderBy?: string, ): Promise<Category[]> {
        try {
            const result = await super.get(limit, cursor, filters, orderBy);
            return result.map((item) => item as Category);
        } catch (error) {
            console.error('ERROR!', error);
            return [] as Category[];
        }
    }
}
