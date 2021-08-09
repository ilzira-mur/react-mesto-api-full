const NotFoundError = require('../errors/NotFoundError');
const FaultRequest = require('../errors/FaultRequest');
const InternalServerError = require('../errors/InternalServerError');
const Card = require('../models/card');
const Forbidden = require('../errors/Forbidden');

const getCards = (req, res) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      throw new InternalServerError(`Ошибка - ${err.message}`);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new FaultRequest('Переданы некорректные данные при создании карточки.');
      } else {
        throw new InternalServerError(`Ошибка - ${err.message}`);
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    })
    .then((card) => {
      if (card.owner._id.toString() === req.user.id) {
        Card.findByIdAndRemove(req.params.id)
        // eslint-disable-next-line no-shadow
          .then((card) => {
            res.status(200).send({ data: card });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              throw new NotFoundError('Карточка с указанным _id не найдена.');
            }
            throw new InternalServerError(`Ошибка - ${err.message}`);
          })
          .catch(next);
      } else {
        throw new Forbidden('Недостаточно прав');
      }
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError('Переданы некорректные данные для постановки/снятии лайка.');
    })
    // eslint-disable-next-line no-unused-vars
    .then((card) => {
      Card.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likes: req.user } },
        { new: true },
      )
        // eslint-disable-next-line no-shadow
        .then((card) => res.status(200).send({ data: card }))
        .catch((err) => {
          if (err.name === 'CastError') {
            throw new FaultRequest('Переданы некорректные данные для постановки/снятии лайка.');
          }
        })
        .catch(next);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError('Переданы некорректные данные для постановки/снятии лайка.');
    })
    // eslint-disable-next-line no-unused-vars
    .then((card) => {
      Card.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.user._id } },
        { new: true },
      )
        // eslint-disable-next-line no-shadow
        .then((card) => res.status(200).send({ data: card }))
        .catch((err) => {
          if (err.name === 'CastError') {
            throw new FaultRequest('Переданы некорректные данные для постановки/снятии лайка.');
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
