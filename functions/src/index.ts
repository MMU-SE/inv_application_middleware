import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import bodyParser = require("body-parser");
import productsRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes"

// Routers
const expressAPI = express();

admin.initializeApp(functions.config().firebase, 'expressAPI');

expressAPI.use(bodyParser.json());
expressAPI.use(bodyParser.urlencoded({ extended: false }));

expressAPI.use(productsRoutes);
expressAPI.use(categoryRoutes);

export const api = functions.region('europe-west2').https.onRequest(expressAPI);
