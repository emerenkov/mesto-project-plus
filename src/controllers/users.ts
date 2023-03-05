import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { RequestCustom } from '../middleware/type';
import NotFoundError from '../errors/not-found-error';
import RequestError from '../errors/request-error';
import ConflictError from '../errors/conflict-error';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('user not found'));
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new RequestError('you sent not correct data'));
      }
      next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
    avatar,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('this email used'));
      }
      if (err.name === 'ValidationError') {
        return next(new RequestError('you sent not correct data'));
      }
      next(err);
    });
};

export const updateProfile = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const profile = req.user?._id;
  User.findByIdAndUpdate(profile, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('user not found'));
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new RequestError('you sent not correct data'));
      }
      next(err);
    });
};

export const updateAvatar = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const profile = req.user?._id;
  User.findByIdAndUpdate(profile, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('user not found'));
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new RequestError('you sent not correct data'));
      }
      next(err);
    });
};

export const login = (req: RequestCustom, res: Response, next: NextFunction) => {
  const {
    email,
    password,
  } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

export const getUser = (req: RequestCustom, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('user not found'));
      }
      return res.status(200).send({ data: user });
    })
    .catch(next);
};
