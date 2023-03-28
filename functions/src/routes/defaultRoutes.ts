import * as express from 'express';

const defaultRouter = express.Router();

defaultRouter.get('/healthCheck', (request, response) => {
    response.status(200).send("The request you just made does not require authentication!");
});

export default defaultRouter;
