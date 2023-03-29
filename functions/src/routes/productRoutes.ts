import { ProductFirestoreRepository } from "../repositories/product/productFirestoreRepository";
import { ProductService } from "../services/productService";
import * as express from 'express';
import { cors } from '../mappings/corsResponseMapper';
import { Endpoints } from "../models/common/endpoints";
import { getQueryOptions } from "./routeHelpers";
import { HttpStatusCode } from "../constants";
import { FirebaseService } from "../firebase/firebaseService";

const deps = {
    service: () => new ProductService(new ProductFirestoreRepository()),
    auth: () => new FirebaseService()
}

const router = express.Router();

router.get('/products', async (request, response) => {
    if (request.method === 'OPTIONS') {
       return cors(Endpoints.Product, request, response) 
    }

    const queryOptions = getQueryOptions(request); 
    const result = await deps.service().getPaginated(queryOptions.limit, queryOptions.cursor,  queryOptions.orderBy, queryOptions.filters);

    if (result.statusCode === HttpStatusCode.OK) {
        return cors(Endpoints.Product, request, response, result.statusCode, result.data);
    }
    return cors(Endpoints.Product, request, response, result.statusCode, result.errorMessage);
}
)


export default router;
