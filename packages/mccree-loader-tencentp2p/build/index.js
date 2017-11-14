'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mccreeControllerLoader = require('mccree-controller-loader');

var _mccreeControllerLoader2 = _interopRequireDefault(_mccreeControllerLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QVBP2PLoader = function () {
    _createClass(QVBP2PLoader, null, [{
        key: 'isSupported',
        value: function isSupported() {
            var ql = window.qvbp2p;
            if (ql) {
                return ql.supportLoader;
            } else {
                if (window.QVBP2P) {
                    return window.QVBP2P.isSupported();
                }
                return false;
            }
        }
    }]);

    function QVBP2PLoader(config) {
        _classCallCheck(this, QVBP2PLoader);

        this.TAG = 'QVBP2PLoader';
        this.type = 'loader';
        this.config = config || {};
        this.initQVBP2P();
    }

    _createClass(QVBP2PLoader, [{
        key: 'initQVBP2P',
        value: function initQVBP2P() {
            if (!window.qvbp2p) {
                window.qvbp2p = new window.QVBP2P();
                window.qvbp2p.rollback = this.config.rollback;
                window.qvbp2p.customLoadAndStart = this.config.customLoadAndStart;
                if (this.player) {
                    window.qvbp2p.player = this.player;
                }
            }
        }
    }, {
        key: 'init',
        value: function init(mccree) {
            this.player = mccree;
            window.qvbp2p.player = mccree;
            this.controller = new _mccreeControllerLoader2.default(this);
            this.controller.init.call(this, mccree);
        }
    }, {
        key: 'load',
        value: function load(source, opt) {
            if (!window.qvbp2p) {
                this.initQVBP2P();
            }
            if (!this._onConnected) {
                this.controller.onConnected.call(this, { msg: '' }); // TODO
                this._onConnected = true;
            }
            window.qvbp2p.loadSource({ videoId: this.config.videoId, src: source });
            this._cleanLoaderBuffer();
            this.loadPartail(source, {
                start: -1,
                end: -1
            }, opt);
        }
    }, {
        key: 'loadPartail',
        value: function loadPartail(source, range, opts) {
            // partial
            if (!this.mccree) {
                this.logger.debug(this.TAG, 'Uninitailized', 'this module is not init yet');
                return;
            }
            this._bindInterface();
        }
    }, {
        key: '_bindInterface',
        value: function _bindInterface() {
            var ql = window.qvbp2p,
                QL = window.QVBP2P;
            if (ql && QL) {
                ql.listen(QL.ComEvents.STATE_CHANGE, this.onStateChange.bind(this));
            } else {
                this.observer.trigger('error', this.errorTypes.OtherError, 'No qvbp2p module found'); // TODO
            }
        }
    }, {
        key: 'onStateChange',
        value: function onStateChange(event, data) {
            var CODE = window.QVBP2P.ComCodes;
            var code = data.code;
            switch (code) {
                case CODE.RECEIVE_BUFFER:
                    this._receiveBuffer(data);
                    break;
                case CODE.HTTP_STATUS_CODE_INVALID:
                    break;
                case CODE.BUFFER_EOF:
                    break;
                default:
                    break;
            }
        }
    }, {
        key: '_receiveBuffer',
        value: function _receiveBuffer(data) {
            if (data.payload instanceof ArrayBuffer) {
                this.mccree.loaderBuffer.push(new Uint8Array(data.payload));
                this.observer.trigger(this.events.FRAG_LOADED, data.payload.byteLength);
            } else {
                var errInfo = {
                    code: -1,
                    msg: this.TAG + ' receive buffer is not instanceof ArrayBuffer'
                };
                this.observer.trigger('error', this.errorTypes.NETWORK_ERROR, errInfo.msg);
            }
        }
    }, {
        key: 'unload',
        value: function unload() {
            var _this = this;

            var that = this;
            return new Promise(function (resolve, reject) {
                // that._loading = false;
                that._cleanLoaderBuffer();
                if (window.qvbp2p) {
                    window.qvbp2p.destroy();
                    window.qvbp2p = null;
                    var errInfo = {
                        code: -1,
                        msg: _this.TAG + ' is destroyed.'
                    };
                    that.observer.trigger('error', that.errorTypes.NETWORK_ERROR, errInfo.msg);
                }
                resolve();
            });
        }
    }, {
        key: '_cleanLoaderBuffer',
        value: function _cleanLoaderBuffer() {
            this.mccree.loaderBuffer.clear();
        }
    }]);

    return QVBP2PLoader;
}();

window.QVBP2PLoader = QVBP2PLoader;
exports.default = QVBP2PLoader;