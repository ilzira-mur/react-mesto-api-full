const { JWT_SECRET = 'PrivateKey' } = process.env;
const { NODE_ENV = 'production' } = process.env;

module.exports = {
  JWT_SECRET, NODE_ENV,
};
