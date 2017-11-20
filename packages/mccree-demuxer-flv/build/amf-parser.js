'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AmfParser = function () {
  function AmfParser(data) {
    _classCallCheck(this, AmfParser);

    this.offset = 0;
    this.data = data;
  }

  _createClass(AmfParser, [{
    key: 'parseMetadata',
    value: function parseMetadata() {
      var metadata = {};
      try {
        var scriptData = this.parseAMF();
        for (var i = 0; i < scriptData.length - 1; i++) {
          if (typeof scriptData[i] === 'string' && scriptData[i] === 'onMetaData' && _typeof(scriptData[i + 1]) === 'object') {
            metadata = scriptData[i + 1];
          }
        }
      } catch (e) {
        // TODO: 异常处理
      }
      return metadata;
    }
  }, {
    key: 'parseAMF',
    value: function parseAMF() {
      var result = [];

      // find on metadata 
      while (this.offset < this.data.length) {
        var type = this.data[this.offset];
        this.offset++;
        var value = this._switchAmfType(type);
        result.push(value);
      }
      return result;
    }
    // TODO: implement XML etc.

  }, {
    key: '_switchAmfType',
    value: function _switchAmfType(type) {
      var value = null;
      switch (type) {
        case 0x00:
          value = this._parseNum();
          break;
        case 0x01:
          value = this._parseBoolean();
          break;
        case 0x02:
          value = this._parseString();
          break;
        case 0x03:
          value = this._parseObject();
          break;
        case 0x04:
          value = 'MovieClip'; //reserved, not supported
          this.offset++;
          break;
        case 0x05:
          value = null; //reserved, not supported
          this.offset++;
          break;
        case 0x06:
          value = undefined; //reserved, not supported
          this.offset++;
          break;
        case 0x08:
          value = this._parseECMAArrary();
          break;
      }
      return value;
    }
  }, {
    key: '_parseNum',
    value: function _parseNum() {
      var numData = this.data.slice(this.offset, this.offset + 8);
      this.offset += 8;
      return new DataView(numData.buffer).getFloat64(0);
    }
  }, {
    key: '_parseString',
    value: function _parseString() {
      var lengthData = this.data.slice(this.offset, this.offset + 2);
      var length = lengthData[0] * 256 + lengthData[1];
      this.offset += 2;
      var stringData = this.data.slice(this.offset, this.offset + length);
      this.offset += length;
      var string = new TextDecoder("utf-8").decode(stringData);
      return string;
    }
  }, {
    key: '_parseObject',
    value: function _parseObject() {
      var val = {};
      while (this.offset < this.data.length - 2 && this.data[this.offset + 2] !== 0x09) {
        var key = this._parseString();
        var valueType = this.data[this.offset];
        this.offset++;
        var value = this._switchAmfType(valueType);
        val[key] = value;
      }
      this.offset += 3;
      return val;
    }
  }, {
    key: '_parseECMAArrary',
    value: function _parseECMAArrary() {
      // let lengthData = this.data.slice(this.offset, this.offset + 4);
      // let length = new DataView(lengthData.buffer).getUint32(0);
      this.offset += 4;
      return this._parseObject();
    }
  }, {
    key: '_parseBoolean',
    value: function _parseBoolean() {
      this.offset++;
      return !(this.data[0] === 0x00);
    }
  }]);

  return AmfParser;
}();

exports.default = AmfParser;