const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/NotFoundError');
const FaultRequest = require('../errors/FaultRequest');
const InternalServerError = require('../errors/InternalServerError');
const ConflicRequest = require('../errors/ConflicRequest');
const Unauthorized = require('../errors/Unauthorized');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = require('../configs/index');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      throw new InternalServerError(`Ошибка - ${err.message}`);
    });
};

const getUserId = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else {
        res.status(200).send({ data: user });
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
  User.findOne({
    email,
  })
  // eslint-disable-next-line consistent-return
    .then((user) => {
      if (user) {
        next(new ConflicRequest('Пользователь с таким email есть в системе'));
      }

      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }))
        // eslint-disable-next-line no-shadow
        .then(({ _id, email }) => res.status(200).send({ _id, email }))
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
  const { id } = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else {
        res.status(200).send({ data: user });
      }
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
  const { id } = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else {
        res.status(200).send({ data: user });
      }
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
  if (!email || !password) {
    throw new FaultRequest('Email или пароль отсутсвует');
  }
  User.findOne({
    email,
  })
  // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        next(new Unauthorized('Пользователя не существует'));
      }
      bcrypt.compare(password, user.password)
      // eslint-disable-next-line consistent-return
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Некоректный пароль');
          }
          // eslint-disable-next-line consistent-return
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'PrivateKey',
            { expiresIn: '7d' },
          );
          res.send({ token });
          })  
        .catch((err) => {
          throw new InternalServerError(`Ошибка - ${err.message}`);
        });
    })
    .catch((err) => {
      throw new InternalServerError(`Ошибка - ${err.message}`);
    });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else {
        res.status(200).send({ data: user });
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
