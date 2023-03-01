import { Request, Response } from 'express';
import User from '../models/user';
import { RequestCustom } from '../middleware/type';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'server error' }));
};

export const getUserById = (req: Request, res: Response) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'user not found' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'you sent not correct data' });
      }
      return res.status(500).send({ message: 'server error' });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'you sent not correct data' });
      }
      return res.status(500).send({ message: 'server error' });
    });
};

export const updateProfile = (req: RequestCustom, res: Response) => {
  const { name, about } = req.body;
  const profile = req.user?._id;
  User.findByIdAndUpdate(profile, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'user not found' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'you sent not correct data' });
      }
      return res.status(500).send({ message: 'server error' });
    });
};

export const updateAvatar = (req: RequestCustom, res: Response) => {
  const { avatar } = req.body;
  const profile = req.user?._id;
  User.findByIdAndUpdate(profile, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'user not found' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'you sent not correct data' });
      }
      return res.status(500).send({ message: 'server error' });
    });
};
