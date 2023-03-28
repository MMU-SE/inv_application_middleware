import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import { authMiddleware } from "./util/authMiddleware";
import defaultRouter from "./routes/defaultRoutes";
import productRouter from "./routes/productRouter";


admin.initializeApp(functions.config().firebase);
const middleware = express();
middleware.use(bodyParser.json());
middleware.use(bodyParser.urlencoded({ extended: false }));

// Unauthenticated routes
middleware.get("/openHealthCheck", (request, response) => {
	response.status(200).send("The request you just made does not require authentication!");
});

middleware.use(authMiddleware);

// Authenticated routes

middleware.get("/authHealthCheck", (request, response) => {
    response.status(200).send("This request has been authenticated successfully!");
});

middleware.use('/default', defaultRouter);
middleware.use('/product', productRouter);



export const api = functions.https.onRequest(middleware);
