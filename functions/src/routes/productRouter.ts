import * as express from 'express';
import * as util from '@firebase/util';
import * as admin from 'firebase-admin';
import { ProductModel } from '../models/productModels';
import { HttpStatusCode } from '../constants';

const productRouter = express.Router();

const mapErrorToStatusCode = (error: CustomErrorType) => {
    const values = Object.values(HttpStatusCode);

    if (values.includes(error.code as unknown as HttpStatusCode)) {
        return error.code as unknown as HttpStatusCode;
    }
    return HttpStatusCode.InternalServerError;
};
        

productRouter.get('/products', (_, response) => {
    getProducts().then((products) => {
        return response.status(HttpStatusCode.OK).send(products);
    }).catch((error) => {
        const statusCode = mapErrorToStatusCode(error);
        return response.status(statusCode).send(error.message);
    });
});

productRouter.post('/products', (request, response) => {
    const product = request.body as ProductModel;
    addProduct(product).then((productId) => {
        return response.status(HttpStatusCode.Created).send(productId);
    }).catch((error) => {
        const statusCode = mapErrorToStatusCode(error);
        return response.status(statusCode).send(error.message);
    });
});

type CustomErrorType = Error & { code?: string };

const isFirebaseError = (error: unknown): CustomErrorType => {
    if (error instanceof util.FirebaseError) {
       return error 
    }
    return { code: '500', message: 'Internal Server Error' } as CustomErrorType;
}

const getProducts = async () => {
    try {
        const productsQuerySnapshot = await admin.firestore().collection('products').get();
        const products: ProductModel[] = [];
        productsQuerySnapshot.forEach((doc) => {
            products.push(doc.data() as ProductModel);
        });
        return products;
    } catch (error) {
        return isFirebaseError(error);
    }
}

const addProduct = async (product: ProductModel) => {
    try {
        const productRef = await admin.firestore().collection('products').add(product);
        return productRef.id;
    } catch (error) {
        return isFirebaseError(error);
    }
}



export default productRouter;
