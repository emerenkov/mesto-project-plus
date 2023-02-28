import { Router } from 'express';
import {
  createCard,
  deletedCardById,
  deleteLikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/', getCards);

cardRouter.post('/', createCard);

cardRouter.delete('/:cardId', deletedCardById);

cardRouter.put('/:cardId/likes', likeCard);

cardRouter.delete('/:cardId/likes', deleteLikeCard);

export default cardRouter;
