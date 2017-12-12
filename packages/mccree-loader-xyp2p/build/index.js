'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright (C) 2017 Shenzhen Onething Technologies Co., Ltd. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _mccreeControllerLoader = require('mccree-controller-loader');

var _mccreeControllerLoader2 = _interopRequireDefault(_mccreeControllerLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var XYVPLoader = function () {
  _createClass(XYVPLoader, null, [{
    key: 'isSupported',
    value: function isSupported() {
      return !!window.xyvp;
    }
  }]);

  function XYVPLoader(config) {
    _classCallCheck(this, XYVPLoader);

    this.TAG = 'XYVPLoader';
    this.type = 'loader';
    this.config = config || {};
    this.xyLive = null;
  }

  _createClass(XYVPLoader, [{
    key: 'init',
    value: function init(mccree) {
      this.mccree = mccree;
      this.controller = new _mccreeControllerLoader2.default(this);
      this.controller.init.call(this, mccree);
      this.events.XY_ERROR = window.xyvp.XYLiveEvent.ERROR;
      this.events.FLV_DATA = window.xyvp.XYLiveEvent.FLV_DATA;
    }
  }, {
    key: 'load',
    value: function load(source, opt, range) {
      var that = this;
      this.xyLive = new window.xyvp.XYLive({ url: source,
        video: this.mccree.getMediaElement()
      });
      this.xyLive.open();
      this.xyLive.on(this.events.FLV_DATA, function (data) {
        that.mccree.loaderBuffer.push(new Uint8Array(data));
        that.observer.trigger(that.events.FRAG_LOADED, data.byteLength);
      });
      this.xyLive.on(that.events.XY_ERROR, function (data) {
        this.observer.trigger('error', 'p2p_rollback', data);
      });
    }
  }, {
    key: 'unload',
    value: function unload() {
      var that = this;
      var promise = new Promise(function (resolve, reject) {
        that.xyLive.close();
        that.observer.trigger('error', this.errorTypes.NETWORK_ERROR, errInfo.msg);
      });
    }
  }, {
    key: 'destory',
    value: function destory() {
      this.xyLive.close();
    }
  }]);

  return XYVPLoader;
}();

exports.default = XYVPLoader;