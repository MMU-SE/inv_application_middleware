import * as express from 'express';
import { cors } from '../mappings/corsResponseMapper';
import { Endpoints } from "../models/common/endpoints";
import { getQueryOptions } from "./routeHelpers";
import { HttpStatusCode } from "../constants";
import { FirebaseService } from "../firebase/firebaseService";
import { CategoryFirestoreRepository } from "../repositories/categories/categoryFirestoreRepository";
import { CategoryService } from "../services/categoryService";
import { ProductFirestoreRepository } from '../repositories/product/productFirestoreRepository';

const deps = {
    service: () => new CategoryService(new CategoryFirestoreRepository(), new ProductFirestoreRepository()),
    auth: () => new FirebaseService()
}

const router = express.Router();

router.get('/categories', async (request, response) => {
       if (request.method === 'OPTIONS') {
       return cors(Endpoints.Category, request, response) 
    }
    const auth = await deps.auth().isAuthorized(request);
    if (auth.data === false) {
        return cors(Endpoints.Category, request, response, auth.statusCode, auth.errorMessage);
    }

    const queryOptions = getQueryOptions(request); 
    const result = await deps.service().getPaginated(queryOptions.limit, queryOptions.cursor,  queryOptions.orderBy, queryOptions.filters);

    if (result.statusCode === HttpStatusCode.OK) {
        return cors(Endpoints.Category, request, response, result.statusCode, result.data);
    }
    return cors(Endpoints.Category, request, response, result.statusCode, result.errorMessage);
}
)

router.post('/categories', async (request, response) => {
    if (request.method === 'OPTIONS') {
        return cors(Endpoints.Category, request, response)
    }

    const result = await deps.service().create(request.body);

    if (result.statusCode === HttpStatusCode.Created) {
        return cors(Endpoints.Category, request, response, result.statusCode, result.data);
    }
    return cors(Endpoints.Category, request, response, result.statusCode, result.errorMessage);
});

router.get('/categories/:id', async (request, response) => {
    if (request.method === 'OPTIONS') {
        return cors(Endpoints.Category, request, response)
    }

    const result = await deps.service().getById(request.params.id);
    if (result.statusCode === HttpStatusCode.OK) {
        return cors(Endpoints.CategoryId, request, response, result.statusCode, result.data);
    }
    return cors(Endpoints.CategoryId, request, response, result.statusCode, result.errorMessage);
});

router.put('/categories/:id', async (request, response) => {
    if (request.method === 'OPTIONS') {
        return cors(Endpoints.Category, request, response)
    }

    const result = await deps.service().update(request.body, request.params.id);
    if (result.statusCode === HttpStatusCode.OK) {
        return cors(Endpoints.CategoryId, request, response, result.statusCode, result.data);
    }
    return cors(Endpoints.CategoryId, request, response, result.statusCode, result.errorMessage);
});

router.delete('/categories/:id', async (request, response) => {
    if (request.method === 'OPTIONS') {
        return cors(Endpoints.Category, request, response)
    }

    const result = await deps.service().delete(request.params.id);
    if (result.statusCode === HttpStatusCode.OK) {
        return cors(Endpoints.CategoryId, request, response, result.statusCode, result.data);
    }
    return cors(Endpoints.CategoryId, request, response, result.statusCode, result.errorMessage);
});

export default router;
