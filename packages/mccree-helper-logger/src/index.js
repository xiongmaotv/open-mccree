'use strict';
class Logger {
  /**
   * A class to manage logger.
   * 
   * @class Logger
   * @param {Object} logger - The customer logger object. 
   * @param {boolean} disable - If the logger is disabled by default 
   */
  constructor(logger, disable, debuging) {
    this.disabled = disable;
    this.debuging = debuging;
    this._logger = logger;
  }

  /**
   * The log function, it will use window.console.log() by default.
   * 
   * @param {string} tag - The tag string. 
   * @param {string} type - The log type.
   * @param {string} message - The log message.
   */
  log(tag, type, message) {
    if (this.disabled) {
      return;
    }

    if (this._logger) {
      this._logger.log(tag, type, message);
    } else {
      let time = new Date().toLocaleString();
      window && window.console && window.console.log(`[${time}][${tag}] ${type}: `, message);
    }
  }

  /**
   * The info function, it will use window.console.info() by default.
   * 
   * @param {string} tag - The tag string. 
   * @param {string} type - The info type.
   * @param {string} message - The info message.
   */
  info(tag, type, message) {
    
    if (this.disabled) {
      return;
    }
    if (this._logger) {
      this._logger.info(tag, type, message);
    } else {
      let time = new Date().toLocaleString();
      window && window.console && window.console.info(`[${time}][${tag}] ${type}: ${message}`);
    }
  }

  warn(tag, type, message) {
    if (this.disabled) {
      return;
    }

    if (this._logger) {
      this._logger.warn(tag, type, message);
    } else {
      let time = new Date().toLocaleString();
      window && window.console && window.console.warn(`[${time}][${tag}] ${type}: ${message}`);
    }
  }

  /**
   * The debug function, it will use window.console.debug() by default.
   * 
   * @param {string} tag - The tag string. 
   * @param {string} type - The debug type.
   * @param {string} message - The debug message.
   */
  debug(tag, type, message) {

    if (this.disabled) {
      return;
    }

    if (!this.debuging) {
      return;
    }

    if (this._logger) {
      this._logger.debug(tag, type, message);
    } else {
      let time = new Date().toLocaleString();
      window && window.console && window.console.debug(`[${time}][${tag}] ${type}: `, message);
    }
  }

  /**
   * The error function, it will use window.console.error() by default.
   * 
   * @param {string} tag - The tag string. 
   * @param {string} type - The error type.
   * @param {string} message - The error message.
   */
  error(tag, type, message) {
    if (this.disabled) {
      return;
    }
        
    if (this._logger) {
      this._logger.error(tag, type, message);
    } else {
      let time = new Date().toLocaleString();
      window && window.console && window.console.debug(`[${time}][${tag}] ${type}: ${message}`);
    }
  }

  /**
   * The function to see if the customer logger is valid.
   * 
   * @return {boolean} -  If the logger is valid return true, otherwise return false. 
   */
  static isValid(logger) {
    return !!logger && !!logger.info && !!logger.log && !!logger.debug && !!logger.error && !!logger.warn;
  }
}

export default Logger;