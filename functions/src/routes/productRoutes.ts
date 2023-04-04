import { ProductFirestoreRepository } from "../repositories/product/productFirestoreRepository";
import { ProductService } from "../services/productService";
import * as express from 'express';
import { cors } from '../mappings/corsResponseMapper';
import { Endpoints } from "../models/common/endpoints";
import { getQueryOptions } from "./routeHelpers";
import { HttpStatusCode } from "../constants";
import { FirebaseService } from "../firebase/firebaseService";
import { CategoryFirestoreRepository } from "../repositories/categories/categoryFirestoreRepository";

const deps = {
    service: () => new ProductService(new ProductFirestoreRepository(), new CategoryFirestoreRepository()),
    auth: () => new FirebaseService()
}

const router = express.Router();

router.get('/products', async (request, response) => {
       if (request.method === 'OPTIONS') {
       return cors(Endpoints.Product, request, response) 
    }
    const auth = await deps.auth().isAuthorized(request);
    if (auth.data === false) {
        return cors(Endpoints.Product, request, response, auth.statusCode, auth.errorMessage);
    }

    const queryOptions = getQueryOptions(request); 
    const result = await deps.service().getPaginated(queryOptions.limit, queryOptions.cursor,  queryOptions.orderBy, queryOptions.filters);

    if (result.statusCode === HttpStatusCode.OK) {
        return cors(Endpoints.Product, request, response, result.statusCode, result.data);
    }
    return cors(Endpoints.Product, request, response, result.statusCode, result.errorMessage);
}
)

router.post('/products', async (request, response) => {
    if (request.method === 'OPTIONS') {
        return cors(Endpoints.Product, request, response)
    }

    const result = await deps.service().create(request.body);

    if (result.statusCode === HttpStatusCode.Created) {
        return cors(Endpoints.Product, request, response, result.statusCode, result.data);
    }
    return cors(Endpoints.Product, request, response, result.statusCode, result.errorMessage);
});

router.get('/products/:id', async (request, response) => {
    if (request.method === 'OPTIONS') {
        return cors(Endpoints.Product, request, response)
    }

    const result = await deps.service().getById(request.params.id);
    if (result.statusCode === HttpStatusCode.OK) {
        return cors(Endpoints.ProductId, request, response, result.statusCode, result.data);
    }
    return cors(Endpoints.ProductId, request, response, result.statusCode, result.errorMessage);
});

router.put('/products/:id', async (request, response) => {
    if (request.method === 'OPTIONS') {
        return cors(Endpoints.Product, request, response)
    }

    const result = await deps.service().update(request.body, request.params.id);
    if (result.statusCode === HttpStatusCode.OK) {
        return cors(Endpoints.ProductId, request, response, result.statusCode, result.data);
    }
    return cors(Endpoints.ProductId, request, response, result.statusCode, result.errorMessage);
});

router.delete('/products/:id', async (request, response) => {
    if (request.method === 'OPTIONS') {
        return cors(Endpoints.Product, request, response)
    }

    const result = await deps.service().delete(request.params.id);
    if (result.statusCode === HttpStatusCode.OK) {
        return cors(Endpoints.ProductId, request, response, result.statusCode, result.data);
    }
    return cors(Endpoints.ProductId, request, response, result.statusCode, result.errorMessage);
});

export default router;
