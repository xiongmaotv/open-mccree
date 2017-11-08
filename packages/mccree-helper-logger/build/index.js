'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = function () {
  /**
   * A class to manage logger.
   * 
   * @class Logger
   * @param {Object} logger - The customer logger object. 
   * @param {boolean} disable - If the logger is disabled by default 
   */
  function Logger(logger, disable, debuging) {
    _classCallCheck(this, Logger);

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


  _createClass(Logger, [{
    key: 'log',
    value: function log(tag, type, message) {
      if (this.disabled) {
        return;
      }

      if (this._logger) {
        this._logger.log(tag, type, message);
      } else {
        var time = new Date().toLocaleString();
        window && window.console && window.console.log('[' + time + '][' + tag + '] ' + type + ': ', message);
      }
    }

    /**
     * The info function, it will use window.console.info() by default.
     * 
     * @param {string} tag - The tag string. 
     * @param {string} type - The info type.
     * @param {string} message - The info message.
     */

  }, {
    key: 'info',
    value: function info(tag, type, message) {

      if (this.disabled) {
        return;
      }
      if (this._logger) {
        this._logger.info(tag, type, message);
      } else {
        var time = new Date().toLocaleString();
        window && window.console && window.console.info('[' + time + '][' + tag + '] ' + type + ': ' + message);
      }
    }
  }, {
    key: 'warn',
    value: function warn(tag, type, message) {
      if (this.disabled) {
        return;
      }

      if (this._logger) {
        this._logger.warn(tag, type, message);
      } else {
        var time = new Date().toLocaleString();
        window && window.console && window.console.warn('[' + time + '][' + tag + '] ' + type + ': ' + message);
      }
    }

    /**
     * The debug function, it will use window.console.debug() by default.
     * 
     * @param {string} tag - The tag string. 
     * @param {string} type - The debug type.
     * @param {string} message - The debug message.
     */

  }, {
    key: 'debug',
    value: function debug(tag, type, message) {

      if (this.disabled) {
        return;
      }

      if (!this.debuging) {
        return;
      }

      if (this._logger) {
        this._logger.debug(tag, type, message);
      } else {
        var time = new Date().toLocaleString();
        window && window.console && window.console.debug('[' + time + '][' + tag + '] ' + type + ': ', message);
      }
    }

    /**
     * The error function, it will use window.console.error() by default.
     * 
     * @param {string} tag - The tag string. 
     * @param {string} type - The error type.
     * @param {string} message - The error message.
     */

  }, {
    key: 'error',
    value: function error(tag, type, message) {
      if (this.disabled) {
        return;
      }

      if (this._logger) {
        this._logger.error(tag, type, message);
      } else {
        var time = new Date().toLocaleString();
        window && window.console && window.console.debug('[' + time + '][' + tag + '] ' + type + ': ' + message);
      }
    }

    /**
     * The function to see if the customer logger is valid.
     * 
     * @return {boolean} -  If the logger is valid return true, otherwise return false. 
     */

  }], [{
    key: 'isValid',
    value: function isValid(logger) {
      return !!logger && !!logger.info && !!logger.log && !!logger.debug && !!logger.error && !!logger.warn;
    }
  }]);

  return Logger;
}();

exports.default = Logger;