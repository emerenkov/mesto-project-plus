import mongoose, { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import AuthorizedError from '../errors/authorized-error';
import { correctLink } from '../validator/validator';

export interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    // eslint-disable-next-line no-unused-vars
    email: string,
    // eslint-disable-next-line no-unused-vars
    password: string
  ) => Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => correctLink.test(v),
      message: 'Некорректная ссылка',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user: {password: string}) => {
      if (!user) {
        return Promise.reject(new AuthorizedError('not correct email or password'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizedError('not correct email or password'));
          }
          return user;
        });
    });
});

export default model<IUser, UserModel>('user', userSchema);
