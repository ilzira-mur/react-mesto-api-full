const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/NotFoundError');
const FaultRequest = require('../errors/FaultRequest');
const InternalServerError = require('../errors/InternalServerError');
const ConflicRequest = require('../errors/ConflicRequest');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = require('../configs/index');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch((err) => {
      throw new InternalServerError(`Ошибка - ${err.message}`);
    });
};

const getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else {
        return res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new FaultRequest('Переданы некорректные данные при создании пользователя.');
      } else {
        throw new InternalServerError(`Ошибка - ${err.message}`);
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new FaultRequest('Email или пароль отсутсвует');
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new ConflicRequest('Пользователь с таким email есть в системе'));
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }))
        // eslint-disable-next-line no-shadow
        .then((user) => res.status(200).send({
          email: user.email,
          _id: user._id,
        }))
        .catch((err) => {
          throw new InternalServerError(`Ошибка - ${err.message}`);
        })
        .catch(next);
    })
    .catch((err) => {
      throw new InternalServerError(`Ошибка - ${err.message}`);
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new FaultRequest('Переданы некорректные данные при обновлении профиля.');
      } else {
        throw new InternalServerError(`Ошибка - ${err.message}`);
      }
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.name === 'ValidationError' || err.name === 'CastError') {
        throw new FaultRequest('Переданы некорректные данные при обновлении аватара.');
      } else {
        throw new InternalServerError(`Ошибка - ${err.message}`);
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'PrivateKey', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.name === 'Validation') {
        throw new FaultRequest('Переданы некорректные данные');
      }
      next(err);
    });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else {
        return res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new FaultRequest('Переданы некорректные данные.');
      } else {
        throw new InternalServerError(`Ошибка - ${err.message}`);
      }
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
  getUser,
};
