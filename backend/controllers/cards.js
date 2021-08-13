const NotFoundError = require('../errors/NotFoundError');
const FaultRequest = require('../errors/FaultRequest');
const InternalServerError = require('../errors/InternalServerError');
const Card = require('../models/card');
const Forbidden = require('../errors/Forbidden');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      throw new InternalServerError(`Ошибка - ${err.message}`);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
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
  const owner = req.user._id;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      } else if (card.owner.toString() !== owner) {
        throw new Forbidden('Недостаточно прав');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((removedCard) => res.status(200).send(removedCard));
    })
    .catch((err) => next(err));
};


const likeCard = (req, res, next) => {
      Card.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      )
        .then((card) => res.status(200).send(card))
        .catch((err) => {
          if (err.name === 'CastError') {
            throw new FaultRequest('Переданы некорректные данные для постановки/снятии лайка.');
          }
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
        .then((card) => res.status(200).send(card))
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
