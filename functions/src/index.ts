import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import bodyParser = require("body-parser");
import { cors } from "./mappings/corsResponseMapper";
import { Endpoints } from "./models/common/endpoints";
import { getQueryOptions } from "./routes/routeHelpers";
import { ProductService } from "./services/productService";
import { ProductFirestoreRepository } from "./repositories/product/productFirestoreRepository";
import { FirebaseService } from "./firebase/firebaseService";
import { HttpStatusCode } from "./constants";

// Routers
const middleware = express();

const deps = {
    service: () => new ProductService(new ProductFirestoreRepository()),
    auth: () => new FirebaseService()
}

admin.initializeApp(functions.config().firebase, 'middleware');

middleware.use(bodyParser.json());
middleware.use(bodyParser.urlencoded({ extended: false }));

middleware.get('/products', async (request, response) => {
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

middleware.post('/products', async (request, response) => {
    if (request.method === 'OPTIONS') {
        return cors(Endpoints.Product, request, response)
    }

    const result = await deps.service().create(request.body);

    if (result.statusCode === HttpStatusCode.Created) {
        return cors(Endpoints.Product, request, response, result.statusCode, result.data);
    }
    return cors(Endpoints.Product, request, response, result.statusCode, result.errorMessage);
});


export const api = functions.https.onRequest(middleware);
