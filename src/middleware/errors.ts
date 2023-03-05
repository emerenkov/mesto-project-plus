import { Request, Response, NextFunction } from 'express';

export const errorHandler = (req: Request, res: Response, next: NextFunction) => {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next();
  }
};
