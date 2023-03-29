import { Firestore } from '@google-cloud/firestore';
import { DatabaseEntity } from '../entities/baseEntitiy';

export interface FilterCondition {
    key: string;
    value: string;
}

export interface FirestoreFilter {
    key: string;
    value: string;
    operator: FirebaseFirestore.WhereFilterOp;
}

export interface FirestoreQueryOptions {
    filters?: FirestoreFilter[];
    orderBy?: string;
    cursor?: string;
    limit: number;
}

export abstract class InventoryFirebaseRepository <T extends DatabaseEntity > extends Firestore {
    private collectionName: string;
    constructor(collectionName: string) {
        super();
        this.collectionName = collectionName;
        this.settings({ ignoreUndefinedProperties: true });
    }

    protected async getFiltered(cursor: string, limit: number, filters: FirestoreFilter[], orderBy?: string): Promise<T[]> {
        const query = await this.applyFirestoreFilters(cursor, limit, filters, orderBy);
        const result = await query.get();

        if (result.docs.length > 0) {
            const docs = result.docs.map((doc) => doc.data() as T);
            return docs;
        }
        return [] as T[];
    }

    protected async get(limit: number, cursor?: string, filters?: FilterCondition[], orderBy?: string): Promise<T[]> {
        const query = await this.applyFilters(cursor, limit, filters, orderBy);
        const result = await query.get();

        if (result.docs.length > 0) {
            const docs = result.docs.map((doc) => doc.data() as T);
            return docs;
        }

        return [] as T[];
    }

    protected async getById(id: string): Promise<T | undefined> {
        const result = await this.collection(this.collectionName).doc(id).get();

        if (result.exists) {
            return result.data() as T;
        }
        return undefined;
    }

    protected async create(item: T): Promise<T> {
        const dataToCreate = {
            ...item
        };
        await this.collection(this.collectionName).doc(item.id).set(dataToCreate);
        return dataToCreate;
    }

    protected async update(item: T, mergeChanges?: string): Promise<T> {
        const dataToCreate = {
            ...item
        };

        // if mergeChanges is any string value, then merge is true
        const mergeFlag = mergeChanges ? false : true;

        await this.collection(this.collectionName).doc(item.id).set(dataToCreate, { merge: mergeFlag });
        return dataToCreate;
    }

    protected async delete(id: string): Promise<void> {
        await this.collection(this.collectionName).doc(id).delete();
    }

    protected async getCollection<T>(): Promise<T[]> {
        const result = await this.collection(this.collectionName).get();
        if (result.docs.length > 0) {
            const docs = result.docs.map((doc) => doc.data() as T);
            return docs;
        }

        return [] as T[];
    }
    protected async startsWith(field: string, text: string): Promise<T[]> {
        const query =
            !field || !text
                ? this.collection(this.collectionName)
                : this.collection(this.collectionName)
                      .where(field, '>=', text)
                      .where(field, '<=', text + '\uf8ff');

        const result = await query.get();

        if (result.docs.length > 0) {
            const docs = result.docs.map((doc) => doc.data() as T);
            return docs;
        }

        return [] as T[];
    }

    private async applyFirestoreFilters(cursor: string, limit: number = 5, filters?: FirestoreFilter[], orderBy?: string): Promise<FirebaseFirestore.Query<FirebaseFirestore.DocumentData>> {
        // get a snapshot of where to start from
        let snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> = undefined as unknown as FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;
        if (cursor) {
            const docRef = this.collection(this.collectionName).doc(cursor);
            snapshot = await docRef.get();
        }

        if (!filters || filters.length === 0) {
            if (orderBy) {
                const key = orderBy.split('|')[0];
                const dir = orderBy.split('|')[1];
                let query = this.collection(this.collectionName).orderBy(`${key}`, dir === 'asc' ? 'asc' : 'desc');
                return snapshot ? query.startAfter(snapshot).limit(limit) : query.limit(limit);
            }
            return snapshot ? this.collection(this.collectionName).startAfter(snapshot).limit(limit) : this.collection(this.collectionName).limit(limit);
        }

        const inValues = filters[0].value.split(',');
        let query =
            inValues.length > 1
                ? this.collection(this.collectionName).where(filters[0].key, 'in', inValues)
                : this.collection(this.collectionName).where(filters[0].key, filters[0].operator, filters[0].value);

        for (let i = 1; i < filters.length; i++) {
            query = query.where(filters[i].key, filters[i].operator, filters[i].value);
        }

        if (orderBy) {
            const key = orderBy.split('|')[0];
            const dir = orderBy.split('|')[1];
            query = query.orderBy(`${key}`, dir === 'asc' ? 'asc' : 'desc');
        }

        return snapshot ? query.startAfter(snapshot).limit(limit) : query.limit(limit);
    }

    private async applyFilters(cursor?: string, limit: number = 5, filters?: FilterCondition[], orderBy?: string): Promise<FirebaseFirestore.Query<FirebaseFirestore.DocumentData>> {
        // get a snapshot of where to start from
        let snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> = undefined as unknown as FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;
        if (cursor) {
            const docRef = this.collection(this.collectionName).doc(cursor);
            snapshot = await docRef.get();
        }

        if (!filters || filters.length === 0) {
            if (orderBy) {
                const key = orderBy.split('|')[0];
                const dir = orderBy.split('|')[1];
                return snapshot
                    ? this.collection(this.collectionName)
                          .orderBy(`${key}`, dir === 'asc' ? 'asc' : 'desc')
                          .startAfter(snapshot)
                          .limit(limit)
                    : this.collection(this.collectionName)
                          .orderBy(`${key}`, dir === 'asc' ? 'asc' : 'desc')
                          .limit(limit);
            }
            return snapshot ? this.collection(this.collectionName).startAfter(snapshot).limit(limit) : this.collection(this.collectionName).limit(limit);
        }

        if (filters.length === 1) {
            let query = await this._parseFilters(filters);

            if (orderBy) {
                const key = orderBy.split('|')[0];
                const dir = orderBy.split('|')[1];
                return snapshot
                    ? query
                          .orderBy(`${key}`, dir === 'asc' ? 'asc' : 'desc')
                          .startAfter(snapshot)
                          .limit(limit)
                    : query.orderBy(`${key}`, dir === 'asc' ? 'asc' : 'desc').limit(limit);
            }

            return snapshot ? query.startAfter(snapshot).limit(limit) : query.limit(limit);
        }

        let query = this.collection(this.collectionName).where(
            filters[0].key,
            'in',
            filters[0].value.split(',').filter((x) => x !== '')
        );

        // Only a single 'IN', 'NOT_IN', or 'ARRAY_CONTAINS_ANY' filter allowed per query.
        for (let i = 1; i < filters.length; i++) {
            query = query.where(filters[i].key, '==', filters[i].value);
        }

        return snapshot ? query.startAfter(snapshot).limit(limit) : query.limit(limit);
    }

    private async _parseFilters(filters: FilterCondition[]): Promise<FirebaseFirestore.Query<FirebaseFirestore.DocumentData>> {
        // If the filter had multiple values, use the 'IN' operator
        const filterValues = filters[0].value.split(',').filter((x) => x !== '');
        if (filterValues.length > 1) {
            return this.collection(this.collectionName).where(filters[0].key, 'in', filterValues);
        }

        const val = filters[0].value;

        // If the filter value is a 'boolean', convert it to a boolean
        switch (val) {
            case 'true':
                return this.collection(this.collectionName).where(filters[0].key, '==', true);
            case 'false':
                return this.collection(this.collectionName).where(filters[0].key, '==', false);
            default:
                return this.collection(this.collectionName).where(filters[0].key, '==', val);
        }
    }
}
