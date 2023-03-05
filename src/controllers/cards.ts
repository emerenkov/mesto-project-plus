import { Request, Response, NextFunction } from 'express';
import Card from '../models/cards';
import { RequestCustom } from '../middleware/type';
import RequestError from '../errors/request-error';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';
import mongoose from "mongoose";

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .populate(['owner'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const createCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const id = req.user?._id;
  Card.create({ name, link, owner: id })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new RequestError('you sent not correct data'));
      }
      next(err);
    });
};

export const deletedCardById = (req: RequestCustom, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('card ID not found'));
      }
      if (card?.owner.toString() === req.user?._id.toString()) {
        card?.delete();
      } next(new ForbiddenError('you not owner'));
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new RequestError('you sent not correct data'));
      }
      next(err);
    });
};

export const likeCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: id } }, { new: true })
    .populate(['owner'])
    .then((card) => {
      if (!card) {
        next(new NotFoundError('card ID not found'));
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new RequestError('you sent not correct data'));
      }
      next(err);
    });
};

export const deleteLikeCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: id } }, { new: true })
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('card ID not found'));
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new RequestError('you sent not correct data'));
      }
      next(err);
    });
};
