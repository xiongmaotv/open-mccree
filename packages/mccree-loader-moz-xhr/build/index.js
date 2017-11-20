'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mccreeControllerLoader = require('mccree-controller-loader');

var _mccreeControllerLoader2 = _interopRequireDefault(_mccreeControllerLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MozXhrLoader = function () {
  _createClass(MozXhrLoader, null, [{
    key: 'isSupported',
    value: function isSupported() {}
  }]);

  function MozXhrLoader(config) {
    _classCallCheck(this, MozXhrLoader);

    this.TAG = 'MozXhrLoader';
    this.type = 'loader';
    this.config = config || {};
  }

  _createClass(MozXhrLoader, [{
    key: 'init',
    value: function init(mccree) {
      this.controller = new _mccreeControllerLoader2.default(this);
      this.controller.init.call(this, mccree);
    }
  }, {
    key: 'load',
    value: function load(source, opt) {
      this._cleanLoaderBuffer();
      this.loadPartail(source, {
        start: -1,
        end: -1
      }, opt);
    }
  }, {
    key: 'loadPartail',
    value: function loadPartail(source, range, opts) {
      var _this = this;

      if (!this.mccree) {
        this.logger.debug(this.TAG, 'Uninitailized', 'this module is not init yet');
        return;
      }

      this.source = source;
      this._loading = false;

      this.xhr = new XMLHttpRequest();
      var that = this;
      this.xhr.open("get", source, true);
      this.xhr.responseType = 'moz-chunked-arraybuffer';
      this.xhr.onreadystatechange = function (e) {
        if (_this.status === 200) {
          that.controller.onConnected.call(that, e);
        } else if (_this.status === 404) {
          that.controller.onNotfound.call(that, e);
        }
      };
      this.xhr.onprogress = function (e) {
        that.mccree.url = _this.xhr.response.url || that.mccree.url;
        var chunk = e.target.response;
        that.mccree.loaderBuffer.push(new Uint8Array(chunk));
        that.observer.trigger(that.events.FRAG_LOADED, chunk.byteLength);
      };
      this.xhr.send();
    }
  }, {
    key: 'unload',
    value: function unload() {
      var _this2 = this;

      var that = this;
      return new Promise(function (resolve, reject) {
        that._loading = false;
        that._cleanLoaderBuffer();
        _this2.xhr.onprogress = null;
        _this2.xhr.abort();
        resolve();
      });
    }
  }, {
    key: '_cleanLoaderBuffer',
    value: function _cleanLoaderBuffer() {
      this.mccree.loaderBuffer.clear();
    }
  }]);

  return MozXhrLoader;
}();

window.MozXhrLoader = MozXhrLoader;
exports.default = MozXhrLoader;