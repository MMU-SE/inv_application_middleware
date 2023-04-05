import * as express from 'express';
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
    const auth = await deps.auth().isAuthorized(request);
    if (auth.data === false) {
        response.status(auth.statusCode).send(auth.errorMessage);
        return
    }

    const queryOptions = getQueryOptions(request); 
    const result = await deps.service().getPaginated(queryOptions.limit, queryOptions.cursor,  queryOptions.orderBy, queryOptions.filters);

    if (result.statusCode === HttpStatusCode.OK) {
        response.status(result.statusCode).send(result.data);
        return

    }
        response.status(auth.statusCode).send(auth.errorMessage);
        return
});

router.post('/categories', async (request, response) => {
    const auth = await deps.auth().isAuthorized(request);
    if (auth.data === false) {
        response.status(auth.statusCode).send(auth.errorMessage);
        return
    }

    const result = await deps.service().create(request.body);

    if (result.statusCode === HttpStatusCode.Created) {
        response.status(result.statusCode).send(result.data);
        return

    }
     response.status(result.statusCode).send(result.errorMessage);
        return

});

router.get('/categories/:id', async (request, response) => {
const auth = await deps.auth().isAuthorized(request);
    if (auth.data === false) {
        response.status(auth.statusCode).send(auth.errorMessage);
        return
    }

    const result = await deps.service().getById(request.params.id);
    if (result.statusCode === HttpStatusCode.OK) {
        response.status(result.statusCode).send(result.data);
        return

    }
        response.status(result.statusCode).send(result.errorMessage);
        return
});

router.put('/categories/:id', async (request, response) => {
const auth = await deps.auth().isAuthorized(request);
    if (auth.data === false) {
        response.status(auth.statusCode).send(auth.errorMessage);
        return
    }

    const result = await deps.service().update(request.body, request.params.id);
    if (result.statusCode === HttpStatusCode.OK) {
        response.status(result.statusCode).send(result.data);
        return

    }
        response.status(result.statusCode).send(result.errorMessage);
        return

});

router.delete('/categories/:id', async (request, response) => {
const auth = await deps.auth().isAuthorized(request);
    if (auth.data === false) {
        response.status(auth.statusCode).send(auth.errorMessage);
        return
    }

    const result = await deps.service().delete(request.params.id);
    if (result.statusCode === HttpStatusCode.OK) {
         response.status(result.statusCode).send(result.data);
        return
   
    }
        response.status(result.statusCode).send(result.errorMessage);
        return

});

export default router;
