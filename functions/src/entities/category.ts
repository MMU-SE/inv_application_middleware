import { DatabaseEntity } from "./baseEntitiy";

export interface Category extends DatabaseEntity {
    name: string;
    description: string;
}
