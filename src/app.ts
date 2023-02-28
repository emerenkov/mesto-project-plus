import express, {NextFunction, Request, Response} from 'express';
import mongoose from "mongoose";
import path from "path";
import routes from "./routes";
import {RequestCustom} from "./middleware/type";

const { PORT = 3000 } = process.env;

const app = express();
mongoose.set('strictQuery', false);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as RequestCustom).user = {
    _id:'63fdc1b0ea140282a4c4b787' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
