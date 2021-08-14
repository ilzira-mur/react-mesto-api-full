const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = require('../configs/index');
const Unauthorized = require('../errors/Unauthorized');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new Unauthorized('Необходима авторизация');
    }
    let payload;
    const token = authorization.replace('Bearer ', '');
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'PrivateKey');
    } catch (err) {
      throw new Unauthorized('Необходима авторизация');
    }
    req.user = payload;
  } catch (err) {
    next(err);
  }
  next();
};

module.exports = auth;
