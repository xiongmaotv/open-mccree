'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mccreeHelperLogger = require('mccree-helper-logger');

var _mccreeHelperLogger2 = _interopRequireDefault(_mccreeHelperLogger);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _media = require('./media.js');

var _media2 = _interopRequireDefault(_media);

var _events3 = require('./events.js');

var _events4 = _interopRequireDefault(_events3);

var _mccreeCoreLoaderbuffer = require('mccree-core-loaderbuffer');

var _mccreeCoreLoaderbuffer2 = _interopRequireDefault(_mccreeCoreLoaderbuffer);

var _mccreeHelperUtils = require('mccree-helper-utils');

var _mccreeHelperUtils2 = _interopRequireDefault(_mccreeHelperUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The main class to create an decoder.
 */
var Mccree = function () {
  /**
   * The constructor.
   */
  function Mccree(modules, config, plugins) {
    _classCallCheck(this, Mccree);

    if (!modules) {
      modules = {};
    }

    this.TAG = 'Mccree-core';

    this.config = config ? config : {};

    this.debug = config && config.debug || false;

    this.plugins = plugins || [];

    this.url = null;

    this.time = 0;

    this.events = _events4.default;

    this.logMsgs = _events4.default.logMsgs;

    Object.assign(this.logMsgs, this.config.logMessages || {});

    this._initLogger(modules.logger);

    this.initObserver();

    // Use default when options do not defined.
    this.loaderBuffer = new _mccreeCoreLoaderbuffer2.default();
    this.remuxBuffer = {};
    this.initSegment = {};

    this._createModules(modules);
    this._initModules();

    var media = new _media2.default();

    this.attachMedia(media);
  }

  /**
    * The function to destroy mccree.
    */


  _createClass(Mccree, [{
    key: 'destroy',
    value: function destroy() {
      var _this = this;

      // Destroy timer
      clearInterval(this.timmer);
      this.timmer = null;
      return this.unload().then(function (res) {
        _this.observer = null;
        _this.detachMedia();
        _this.media = null;
        _this.logger.debug(_this.TAG, _this.logMsgs.DESTROY);
      });
    }

    /**
     * Use to attach the media profile.
     */

  }, {
    key: 'attachMedia',
    value: function attachMedia(media) {
      this.detachMedia();
      this.media = media;
    }

    /** 
     * Use to detach the Media.
     */

  }, {
    key: 'detachMedia',
    value: function detachMedia() {
      this.media = null;
    }

    /**
     * Use to attach media element.
     */

  }, {
    key: 'attachMediaElement',
    value: function attachMediaElement(media) {
      this.detachMedia();
      this.mediaElement = media;
    }

    /** 
     * Use to detach  the Media Element.
     */

  }, {
    key: 'detachMediaElement',
    value: function detachMediaElement() {
      this.mediaElement = null;
    }
    /** 
     * Load the resource.
     *
     * @param {string} url - The resource url.
     */

  }, {
    key: 'load',
    value: function load(url) {
      this.logger.inf(this.TAG, 'loadurl ' + url);
      this.originUrl = url;
      this.loader.load(url);
    }

    /**
     * Unload the resource.
     */

  }, {
    key: 'unload',
    value: function unload() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (_this2.loader) {
          _this2.logger.debug(_this2.TAG, _this2.logMsgs.UNLOADING);
          _this2.loader.unload().then(function (res) {
            resolve();
          }).catch(function (res) {
            reject(res);
          });
        } else {
          resolve();
        }
      });
    }

    /**
     * Initialize the logger for mccree.
     * 
     * @param {object} logger - The js object which has required functions for recording logs.
     */

  }, {
    key: '_initLogger',
    value: function _initLogger(logger) {
      // init the logger;
      if (logger && _mccreeHelperLogger2.default.isValid(logger)) {
        this.logger = new _mccreeHelperLogger2.default(logger, false, this.debug);
        this.logger.debug(this.TAG, this.logMsgs.INIT_LOGGER_CUSTOM);
      } else {
        this.logger = new _mccreeHelperLogger2.default(null, false, this.debug);
        this.logger.debug(this.TAG, this.logMsgs.INIT_LOGGER_INTERNAL);
      }
    }

    /**
     * Initialize the eventemitter for the mccree.
     */

  }, {
    key: 'initObserver',
    value: function initObserver() {
      // init eventEmitter;
      var that = this;
      this.observer = new _events2.default();

      this.observer.trigger = function trigger(event) {
        for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          data[_key - 1] = arguments[_key];
        }

        if (event !== 'error') {
          var _that$observer;

          (_that$observer = that.observer).emit.apply(_that$observer, [event].concat(data));
        } else {
          var _that$observer2;

          (_that$observer2 = that.observer).emit.apply(_that$observer2, ['internalError'].concat(data));
        }
      };

      this.observer.on = function on(event, listener) {
        if (event !== 'error') {
          that.observer.addListener(event, listener);
        } else {
          that.observer.addListener('internalError', listener);
        }
      };

      this.observer.off = function off(event, cb) {
        if (!cb) {
          cb = function cb() {};
        }
        if (!event) {
          that.observer.removeAllListeners();
          cb();
        } else if (event !== 'error') {
          that.observer.removeListener(event, cb);
        } else {
          that.observer.removeListener('internalError', cb);
        }
      };

      this.logger.debug(this.TAG, this.logMsgs.INIT_OBSERVER);

      this.on = this.observer.on.bind(this.observer);
      this.off = this.observer.off.bind(this.observer);
      this.trigger = this.observer.trigger.bind(this.observer);
    }

    /**
     * Load and check the loader, demux and remux modules for mccree.
     *
     * @params {Object} modules - The js object contains loader, demux and remux objects.
     */

  }, {
    key: '_createModules',
    value: function _createModules(modules) {
      if (modules.loader) {
        this.loader = modules.loader;
        this.logger.debug(this.TAG, this.logMsgs.INIT_LOADER);
      } else {
        this.logger.error(this.TAG, this.logMsgs.INIT_LOADER_FAIL);
      }

      if (modules.demux) {
        this.demux = modules.demux;
        this.logger.debug(this.TAG, this.logMsgs.INIT_DEMUXER);
      } else {
        this.logger.error(this.TAG, this.logMsgs.INIT_DEMUXER_FAILED);
      }

      if (modules.remux) {
        this.remux = modules.remux;
        this.logger.debug(this.TAG, this.logMsgs.INIT_REMUXER);
      } else {
        this.logger.error(this.TAG, this.logMsgs.INIT_REMUXER_FAILED);
      }
    }

    /**
     * Call the init functions of loader, demux, remux.
     */

  }, {
    key: '_initModules',
    value: function _initModules() {
      this.loader && this.loader.init(this);
      this.demux && this.demux.init(this);
      this.remux && this.remux.init(this);
    }
  }]);

  return Mccree;
}();

exports.default = Mccree;