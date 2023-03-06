import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SessionRequest } from './type';
import AuthorizedError from '../errors/authorized-error';

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizedError('you need authorization'));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new AuthorizedError('problem with token'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};
