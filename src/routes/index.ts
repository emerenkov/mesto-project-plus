import { Request, Response, Router } from 'express';
import userRouter from './users';
import cardRouter from './cards';
import NotFoundError from '../errors/not-found-error';

const routes = Router();

routes.use('/users', userRouter);

routes.use('/cards', cardRouter);

routes.use((req:Request, res:Response, next) => next(new NotFoundError('page not found')));

export default routes;
