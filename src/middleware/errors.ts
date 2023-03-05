import { Request, Response, NextFunction } from 'express';

export interface IError extends Error {
  statusCode: number;
}

export const errorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
  try {
    const { statusCode = 500, message } = err;
    res
      .status(statusCode)
      .send({
        // проверяем статус и выставляем сообщение в зависимости от него
        message: statusCode === 500
          ? 'Something failed!'
          : message,
      });
  } catch {
    next();
  }
};
