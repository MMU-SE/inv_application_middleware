import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Request } from 'express';
import { ServiceResponse } from '../models/apiModels';

export class FirebaseService {
    _app: admin.app.App;

    constructor(app?: admin.app.App) {
        // The default Firebase app is created in index.ts
        // It is possible to define other apps that reference a different audience
        // as long as they have a unique name and are created with a service account created in the target project
        const adminApp = app || admin.apps?.find((app) => app?.name === 'middleware');
        this._app =
            adminApp ||
            admin.initializeApp(functions.config().firebase);
    }

    public async isAuthorized(request: Request): Promise<ServiceResponse<boolean>> {
        const response: ServiceResponse<boolean> = {
            data: false,
            errorMessage: '',
            statusCode: 0
        };

        try {
            const token = request.headers.authorization?.split('Bearer ')[1];
            if (!token) {
                response.errorMessage = 'No token provided';
                response.statusCode = 401;
                return response;
            }

            const decodedToken = await this._app.auth().verifyIdToken(token);
            if (!decodedToken) {
                response.errorMessage = 'Invalid token';
                response.statusCode = 401;
                return response;
            }

            response.data = true;
            response.statusCode = 200;
            return response;
        } catch (error: any) {
            response.errorMessage = error ? error.message : 'Invalid token';
            response.statusCode = 401;
            return response;
        }
    }
}
