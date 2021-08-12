const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

const { PORT = 3001 } = process.env;

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
const ALLOWED_CORS = [
  'http://localhost:3000'
];

app.use((req, res, next) => {
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const { origin } = req.headers;

  if (ALLOWED_CORS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
    return res.status(200).send();
  }

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(authRouter);
app.use(userRouter);
app.use(cardRouter);

app.get('*', (req) => { throw new NotFoundError(`По адресу ${req.path} ничего не найдено`); });

app.use(errorHandler);

app.listen(PORT, () => {
});