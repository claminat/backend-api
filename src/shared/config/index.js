
const env = process.env.NODE_ENV || 'development';

let config;
switch (env) {
  case 'production':
    config = require('./config.prod');
    break;
  case 'development':
  default:
    config = require('./config.dev');
    break;
}

module.exports = config;