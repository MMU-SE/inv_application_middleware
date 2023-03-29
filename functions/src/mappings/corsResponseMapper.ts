import { Request, Response } from 'express';
import { Endpoints } from '../models/common/endpoints';

export const cors = (endpoint: Endpoints, req: Request, res: Response, statusCode?: number, data?: any) => {
    const origin = req.get('Origin');
    res.append('Access-Control-Allow-Headers', ['Authorization', 'Content-Type', 'Content-Length']);

    if (!origin) {
        res.append('Access-Control-Allow-Origin', '*');
        return res.status(statusCode ?? 200).send(data);
    }

    let allowedOrigins: string[] = []; 

        if (process.env.ALLOWED_CORS_ORIGINS) {
            allowedOrigins = process.env.ALLOWED_CORS_ORIGINS.split(',');
        } else {
            console.log('No allowed origins found in environment variables.');
        }
            
    const originComparisons = allowedOrigins.map((allowedOrigin) => origin?.startsWith(allowedOrigin));

    if (originComparisons.includes(true)) {
        res.append('Access-Control-Allow-Origin', origin);
        if (req.method === 'OPTIONS') {
            switch (endpoint) {
                case Endpoints.Product:
                    res.append('Access-Control-Allow-Methods', ['GET', 'POST', 'PUT', 'OPTIONS']);
                    break;
                case Endpoints.ProductId:
                    res.append('Access-Control-Allow-Methods', ['GET', 'DELETE', 'OPTIONS']);
                    break;
            }
        }

        return res.status(statusCode ?? 200).send(data);
    }

    return res.status(403).send('Access forbidden from this origin.');
};
