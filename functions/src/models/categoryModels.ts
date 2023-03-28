export type CategoryModel = {
    id: string,
    name: string,
}

export type DetailedCategoryModel = {
    id: string,
    name: string,
    description: string,
}

export type PaginatedCategoryResponseModel = {
    total: number,
    limit: number,
    cursor: string,
    categories: CategoryModel[],
}

export type CategoryCreateRequestModel = {
    name: string,
    description: string,
}

export type CategoryUpdateRequestModel = {
    name?: string,
    description?: string,
}
