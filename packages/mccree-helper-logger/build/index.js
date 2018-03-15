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
   * The debug function, it will use window.console.debug() by default.
   * Level 1
   * 
   * @param {string} tag - The tag string. 
   * @param {string} message - The debug message.
   */


  _createClass(Logger, [{
    key: 'debug',
    value: function debug(tag, message) {

      if (this.disabled) {
        return;
      }

      if (!this.debuging) {
        return;
      }

      if (this._logger) {
        this._logger.debug(tag, message);
      } else {
        var time = new Date().toLocaleString();
        window && window.console && window.console.debug('[' + time + '][' + tag + '] debug: ' + message);
      }
    }

    /**
     * The log function, it will use window.console.log() by default.
     * Level 2
     * 
     * @param {string} tag - The tag string. 
     * @param {string} message - The log message.
     */

  }, {
    key: 'log',
    value: function log(tag, message) {
      if (this.disabled) {
        return;
      }

      if (this._logger) {
        this._logger.log(tag, message);
      } else {
        var time = new Date().toLocaleString();
        window && window.console && window.console.log('[' + time + '][' + tag + '] log: ' + message);
      }
    }

    /**
     * The info function, it will use window.console.info() by default.
     * Level 3
     * 
     * @param {string} tag - The tag string. 
     * @param {string} message - The info message.
     */

  }, {
    key: 'info',
    value: function info(tag, message) {

      if (this.disabled) {
        return;
      }
      if (this._logger) {
        this._logger.info(tag, message);
      } else {
        var time = new Date().toLocaleString();
        window && window.console && window.console.info('[' + time + '][' + tag + '] info: ' + message);
      }
    }
  }, {
    key: 'warn',
    value: function warn(tag, message) {
      if (this.disabled) {
        return;
      }

      if (this._logger) {
        this._logger.warn(tag, message);
      } else {
        var time = new Date().toLocaleString();
        window && window.console && window.console.warn('[' + time + '][' + tag + '] warn: ' + message);
      }
    }

    /**
     * The error function, it will use window.console.error() by default.
     * Level 4
     * 
     * @param {string} tag - The tag string. 
     * @param {string} message - The error message.
     */

  }, {
    key: 'error',
    value: function error(tag, message) {
      if (this.disabled) {
        return;
      }

      if (this._logger) {
        this._logger.error(tag, message);
      } else {
        var time = new Date().toLocaleString();
        window && window.console && window.console.debug('[' + time + '][' + tag + '] error: ' + message);
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