import { Router } from 'express';
import {
  createCard,
  deletedCardById,
  deleteLikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';
import {
  validateCardBody,
  validateCardById,
} from '../validator/validator';

const cardRouter = Router();

cardRouter.get('/', getCards);

cardRouter.post('/', validateCardBody, createCard);

cardRouter.delete('/:cardId', validateCardById, deletedCardById);

cardRouter.put('/:cardId/likes', validateCardById, likeCard);

cardRouter.delete('/:cardId/likes', validateCardById, deleteLikeCard);

export default cardRouter;
