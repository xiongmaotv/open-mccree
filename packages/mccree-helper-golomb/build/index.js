'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Exponential-Golomb buffer decoder
var Golomb = function () {
    function Golomb(uint8array) {
        _classCallCheck(this, Golomb);

        this.TAG = 'Golomb';
        this._buffer = uint8array;
        this._bufferIndex = 0;
        this._totalBytes = uint8array.byteLength;
        this._totalBits = uint8array.byteLength * 8;
        this._currentWord = 0;
        this._currentWordBitsLeft = 0;
    }

    _createClass(Golomb, [{
        key: 'destroy',
        value: function destroy() {
            this._buffer = null;
        }
    }, {
        key: '_fillCurrentWord',
        value: function _fillCurrentWord() {
            var bufferBytesLeft = this._totalBytes - this._bufferIndex;
            if (bufferBytesLeft <= 0) {
                // TODO 异常处理
            }

            var bytesRead = Math.min(4, bufferBytesLeft);
            var word = new Uint8Array(4);
            word.set(this._buffer.subarray(this._bufferIndex, this._bufferIndex + bytesRead));
            this._currentWord = new DataView(word.buffer).getUint32(0, false);

            this._bufferIndex += bytesRead;
            this._currentWordBitsLeft = bytesRead * 8;
        }
    }, {
        key: 'readBits',
        value: function readBits(bits) {
            if (bits > 32) {
                // TODO
            }

            if (bits <= this._currentWordBitsLeft) {
                var _result = this._currentWord >>> 32 - bits;
                this._currentWord <<= bits;
                this._currentWordBitsLeft -= bits;
                return _result;
            }

            var result = this._currentWordBitsLeft ? this._currentWord : 0;
            result >>> 32 - this._currentWordBitsLeft;
            var bitsNeedLeft = bits - this._currentWordBitsLeft;

            this._fillCurrentWord();
            var bitsReadNext = Math.min(bitsNeedLeft, this._currentWordBitsLeft);

            var result2 = this._currentWord >>> 32 - bitsReadNext;
            this._currentWord <<= bitsReadNext;
            this._currentWordBitsLeft -= bitsReadNext;

            result = result << bitsReadNext | result2;
            return result;
        }
    }, {
        key: 'readBool',
        value: function readBool() {
            return this.readBits(1) === 1;
        }
    }, {
        key: 'readByte',
        value: function readByte() {
            return this.readBits(8);
        }
    }, {
        key: '_skipLeadingZero',
        value: function _skipLeadingZero() {
            var zeroCount = void 0;
            for (zeroCount = 0; zeroCount < this._currentWordBitsLeft; zeroCount++) {
                if (0 !== (this._currentWord & 0x80000000 >>> zeroCount)) {
                    this._currentWord <<= zeroCount;
                    this._currentWordBitsLeft -= zeroCount;
                    return zeroCount;
                }
            }
            this._fillCurrentWord();
            return zeroCount + this._skipLeadingZero();
        }
    }, {
        key: 'readUEG',
        value: function readUEG() {
            // unsigned exponential golomb
            var leadingZeros = this._skipLeadingZero();
            return this.readBits(leadingZeros + 1) - 1;
        }
    }, {
        key: 'readSEG',
        value: function readSEG() {
            // signed exponential golomb
            var value = this.readUEG();
            if (value & 0x01) {
                return value + 1 >>> 1;
            } else {
                return -1 * (value >>> 1);
            }
        }
    }]);

    return Golomb;
}();

exports.default = Golomb;