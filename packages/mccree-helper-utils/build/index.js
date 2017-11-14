/**
 * Copyright [2017] [Shanghai Panda Interactive Entertainment And Culture Company Limited]
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = exports.Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: 'getUint',

    /**
     * returns a number which is equal to the input.
     * 返回一个数字，值与输入的UInt8Array相等。
     * 
     * @param {Uint8array} uint8array - the Uint8array object.
     *
     * @return {Number} - the value of the input. 
     */
    value: function getUint(uint8array) {
      var total = 0;
      var i = 0;
      while (i < uint8array.length) {
        total = total * 256 + uint8array[i];
        i++;
      }

      return total;
    }

    /**
     * This function is called when loader intializing, must bind(this).
     * 当loader初始化的时候进行调用。必须将this指向绑定。
     * 
     * @param {Object} mccree - the mccree core.
     */

  }, {
    key: 'initMccree',
    value: function initMccree(mccree) {
      if (!mccree) {
        throw new Error('mccree is not defined');
      }
      if (!mccree.events) {
        throw new Error('mccree events is not defined');
      }
      this.mccree = mccree;
      this.logger = mccree.logger;
      this.observer = mccree.observer;
      this.events = mccree.events.events;
      this.errorTypes = mccree.events.errorTypes;
      this.errorDetails = mccree.events.errorDetails;
      this.logMsgs = mccree.events.logMsgs;
    }

    /**
     * The first object will be extend by the following objects.
     * 将第一个对象，根据后传入的对象进行扩展。
     * 
     * @param {Object} objects - one or more objects.
     */

  }, {
    key: 'extend',
    value: function extend() {
      for (var _len = arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
        objects[_key] = arguments[_key];
      }

      if (objects.length < 1) {
        return;
      }

      for (var i = 1, len = objects.length; i < len; i++) {
        var objectKeys = Object.keys(objects[i]);
        for (var j = 0, length = objectKeys.length; j < length; j++) {
          objects[0][objectKeys[j]] = objects[i][objectKeys[j]];
        }
      }
    }
  }]);

  return Utils;
}();

exports.default = Utils;