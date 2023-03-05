import express, {NextFunction, Request, Response} from 'express';
import mongoose from "mongoose";
import * as dotenv from 'dotenv';
import routes from "./routes";
import {createUser, login} from "./controllers/users";
import auth from "./middleware/auth";
import {errorLogger, requestLogger} from "./middleware/logger";
import {errorHandler} from "./middleware/errors";
import {errors} from "celebrate";
import {validateLogin, validateUserBody} from "./validator/validator";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

dotenv.config();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

const limitedRequest = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 request for one window
});

app.use(requestLogger);

app.use(helmet());

app.use(express.json());
app.use(limitedRequest);

app.post('/signin', validateLogin, login);
app.post('/signup', validateUserBody, createUser);

// app.use(express.static(path.join(__dirname, 'public')));

app.use(auth);

app.use(routes);

app.use(errorLogger);

app.use(errors()); // celebrate

app.use(errorHandler);

async function connect() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URL);
    await app.listen(PORT);
    console.log(`App listening on port ${PORT}`, MONGO_URL);

  } catch (err) {
    console.log('error on server', err);
  }
}

connect();
