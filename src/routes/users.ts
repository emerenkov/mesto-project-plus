import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUser,
} from '../controllers/users';
import {
  validateUpdateAvatar,
  validateUpdateProfile,
  validateUserById,
} from '../validator/validator';

const userRouter = Router();

userRouter.get('/me', getUser);

userRouter.get('/', getUsers);

userRouter.get('/:userId', validateUserById, getUserById);

userRouter.patch('/me', validateUpdateProfile, updateProfile);

userRouter.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

export default userRouter;
