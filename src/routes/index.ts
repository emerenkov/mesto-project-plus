import { Request, Response, Router } from 'express';
import userRouter from './users';
import cardRouter from './cards';

const routes = Router();

routes.use('/users', userRouter);

routes.use('/cards', cardRouter);

routes.use((req:Request, res:Response) => res.status(404).send({ message: 'page not found' }));

export default routes;
