import { Request, Response, NextFunction } from 'express';
import Card from '../models/cards';
import { RequestCustom } from '../middleware/type';
import RequestError from '../errors/request-error';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const createCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const id = req.user?._id;
  Card.create({ name, link, owner: id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('you sent not correct data'));
      }
      next(err);
    });
};

export const deletedCardById = (req: RequestCustom, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('card ID not found'));
      }
      if (card && card.owner.toString() === req.user?._id.toString()) {
        card.deleteOne();
        return res.status(200).send({ data: card });
      }
      next(new ForbiddenError('you not owner'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('you sent not correct data'));
      }
      next(err);
    });
};

export const likeCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('card ID not found'));
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('you sent not correct data'));
      }
      next(err);
    });
};

export const deleteLikeCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('card ID not found'));
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('you sent not correct data'));
      }
      next(err);
    });
};
