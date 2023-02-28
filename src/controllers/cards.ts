import { Request, Response } from 'express';
import Card from '../models/cards';
import { RequestCustom } from '../middleware/type';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'server error' }));
};

export const createCard = (req: RequestCustom, res: Response) => {
  const { name, link } = req.body;
  const id = req.user?._id;
  Card.create({ name, link, owner: id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send('you sent not correct data');
      }
      return res.status(500).send({ message: 'server error' });
    });
};

export const deletedCardById = (req: RequestCustom, res: Response) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send('card ID not found');
      }
      if (card && card.owner.toString() === req.user?._id.toString()) {
        card.deleteOne();
        res.send('card deleted');
      } res.send('you can not delete');
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('you sent not correct data');
      }
      return res.status(500).send({ message: 'server error' });
    });
};

export const likeCard = (req: RequestCustom, res: Response) => {
  const id = req.user?._id;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send('card ID not found');
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('you sent not correct data');
      }
      return res.status(500).send({ message: 'server error' });
    });
};

export const deleteLikeCard = (req: RequestCustom, res: Response) => {
  const id = req.user?._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send('card ID not found');
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('you sent not correct data');
      }
      return res.status(500).send({ message: 'server error' });
    });
};
