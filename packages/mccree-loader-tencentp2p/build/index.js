'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mccreeControllerLoader = require('mccree-controller-loader');

var _mccreeControllerLoader2 = _interopRequireDefault(_mccreeControllerLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Tencent X-P2P loader.
 * Have the same interface as other loader.
 */
var QVBP2PLoader = function () {
    _createClass(QVBP2PLoader, null, [{
        key: 'isSupported',


        /**
         * Make sure your browser supports this loader before instantiating it
         * e.g. QVBP2PLoader.isSupported();
         *
         * @returns {boolean}
         */
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

        /**
         * Constructor
         *
         * @constructs
         * @param {Object} config - please note that we need a 'rollback' configuration in your 'config' param
         * @param {Function} config.rollback - This method is called when our SDK meets an error.
         */

    }]);

    function QVBP2PLoader(config) {
        _classCallCheck(this, QVBP2PLoader);

        this.TAG = 'QVBP2PLoader';
        this.type = 'loader';
        this.config = config || {};
        this._initQVBP2P();
    }

    /**
     * Init X-P2P
     * @private
     */


    _createClass(QVBP2PLoader, [{
        key: '_initQVBP2P',
        value: function _initQVBP2P() {
            if (!window.qvbp2p) {
                window.qvbp2p = new window.QVBP2P();
                window.qvbp2p.rollback = this.config.rollback;
                if (this.player) {
                    window.qvbp2p.player = this.player;
                }
            }
        }

        /**
         * This function is called when loader intializing, must bind(this).
         *
         * @param {Object} mccree - the mccree core.
         */

    }, {
        key: 'init',
        value: function init(mccree) {
            this.player = mccree;
            window.qvbp2p.player = mccree;
            this.controller = new _mccreeControllerLoader2.default(this);
            this.controller.init.call(this, mccree);
        }

        /**
         * Load source through x-p2p sdk
         *
         * @param {String} source - stream url
         * @param opt - load options
         */

    }, {
        key: 'load',
        value: function load(source, opt) {
            if (!window.qvbp2p) {
                this._initQVBP2P();
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

        /**
         * Check and bind
         *
         * @param source
         * @param range
         * @param opts
         */

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

        /**
         * Register callback to x-p2p sdk
         *
         * @private
         */

    }, {
        key: '_bindInterface',
        value: function _bindInterface() {
            var ql = window.qvbp2p,
                QL = window.QVBP2P;
            if (ql && QL) {
                ql.listen(QL.ComEvents.STATE_CHANGE, this._onStateChange.bind(this));
            } else {
                this.observer.trigger('error', this.errorTypes.OtherError, 'No qvbp2p module found'); // TODO
            }
        }

        /**
         * Receive data from x-p2p sdk
         *
         * @param {String} event - Event registered to SDK for this function
         * @param {Object} data - Data that sent from SDK
         * @private
         */

    }, {
        key: '_onStateChange',
        value: function _onStateChange(event, data) {
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

        /**
         * Receive media data
         *
         * @param {Object} data - object contains media data
         * @param {ArrayBuffer} data.payload - media data
         * @private
         */

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

        /**
         * Unload this loader. Release the x-p2p SDK instance.
         *
         * @returns {Promise}
         */

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
                        msg: _this.TAG + ' is destroyed'
                    };
                    that.observer.trigger('error', that.errorTypes.NETWORK_ERROR, errInfo.msg);
                }
                resolve();
            });
        }

        /**
         * Clear loader buffer
         *
         * @private
         */

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