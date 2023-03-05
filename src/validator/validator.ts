import { celebrate, Joi } from 'celebrate';

export const correctLink = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;

export const validateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(200).default('Исследователь'),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').regex(correctLink),
  }).unknown(true), // валидируем заголовки
});

export const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),
  }).unknown(true), // валидируем заголовки
});

export const validateUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

export const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }).unknown(true), // валидируем заголовки
});

export const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(correctLink),
  }).unknown(true), // валидируем заголовки
});

export const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(correctLink),
  }).unknown(true), // валидируем заголовки
});

export const validateCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});
