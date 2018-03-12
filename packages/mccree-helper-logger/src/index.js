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
   * The debug function, it will use window.console.debug() by default.
   * Level 1
   * 
   * @param {string} tag - The tag string. 
   * @param {string} message - The debug message.
   */
  debug(tag, message) {

    if (this.disabled) {
      return;
    }

    if (!this.debuging) {
      return;
    }

    if (this._logger) {
      this._logger.debug(tag, message);
    } else {
      let time = new Date().toLocaleString();
      window && window.console && window.console.debug(`[${time}][${tag}] debug: ${message}`);
    }
  }

  /**
   * The log function, it will use window.console.log() by default.
   * Level 2
   * 
   * @param {string} tag - The tag string. 
   * @param {string} message - The log message.
   */
  log(tag, message) {
    if (this.disabled) {
      return;
    }

    if (this._logger) {
      this._logger.log(tag, message);
    } else {
      let time = new Date().toLocaleString();
      window && window.console && window.console.log(`[${time}][${tag}] log: ${message}`);
    }
  }

  /**
   * The info function, it will use window.console.info() by default.
   * Level 3
   * 
   * @param {string} tag - The tag string. 
   * @param {string} message - The info message.
   */
  info(tag, message) {
    
    if (this.disabled) {
      return;
    }
    if (this._logger) {
      this._logger.info(tag, message);
    } else {
      let time = new Date().toLocaleString();
      window && window.console && window.console.info(`[${time}][${tag}] info: ${message}`);
    }
  }

  warn(tag, message) {
    if (this.disabled) {
      return;
    }

    if (this._logger) {
      this._logger.warn(tag, message);
    } else {
      let time = new Date().toLocaleString();
      window && window.console && window.console.warn(`[${time}][${tag}] warn: ${message}`);
    }
  }

  /**
   * The error function, it will use window.console.error() by default.
   * Level 4
   * 
   * @param {string} tag - The tag string. 
   * @param {string} message - The error message.
   */
  error(tag, message) {
    if (this.disabled) {
      return;
    }
        
    if (this._logger) {
      this._logger.error(tag, message);
    } else {
      let time = new Date().toLocaleString();
      window && window.console && window.console.debug(`[${time}][${tag}] error: ${message}`);
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