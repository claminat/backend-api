// BACKEND-API/src/shared/helpers/logger.helper.js

const chalk = require('chalk');

class Logger {
  static _getTimestamp() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    return `${date} ${time}`;
  }

  static d(message, name = 'DEBUG') {
    const time = this._getTimestamp();
    console.debug(`${chalk.gray(`[${time}]`)} ${chalk.cyan(`[${name}]`)} ${message}`);
  }

  static i(message, name = 'INFO') {
    const time = this._getTimestamp();
    console.info(`${chalk.gray(`[${time}]`)} ${chalk.green(`[${name}]`)} ${message}`);
  }

  static w(message, name = 'WARNING') {
    const time = this._getTimestamp();
    console.warn(`${chalk.gray(`[${time}]`)} ${chalk.yellow(`[${name}]`)} ${message}`);
  }

  static e(message, name = 'ERROR', error = null, stackTrace = null) {
    const time = this._getTimestamp();
    console.error(`${chalk.gray(`[${time}]`)} ${chalk.red(`[${name}]`)} ${message}`);
    if (error) console.error(chalk.red('⛔ Error:'), error);
    if (stackTrace) console.error(chalk.red('📍 StackTrace:'), stackTrace);
  }
}

module.exports = Logger;
