"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function _inherits(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.PandaMccreeLive=void 0;var _createClass=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),_mccreeCore=require("mccree-core"),_mccreeCore2=_interopRequireDefault(_mccreeCore),_mccreeLoaderFetch=require("mccree-loader-fetch"),_mccreeLoaderFetch2=_interopRequireDefault(_mccreeLoaderFetch),_mccreeLoaderMozXhr=require("mccree-loader-moz-xhr"),_mccreeLoaderMozXhr2=_interopRequireDefault(_mccreeLoaderMozXhr),_mccreeHelperBrowser=require("mccree-helper-browser"),_mccreeHelperBrowser2=_interopRequireDefault(_mccreeHelperBrowser),_mccreeDemuxerFlv=require("mccree-demuxer-flv"),_mccreeDemuxerFlv2=_interopRequireDefault(_mccreeDemuxerFlv),_mccreeRemuxerHevc=require("mccree-remuxer-hevc"),_mccreeRemuxerHevc2=_interopRequireDefault(_mccreeRemuxerHevc),_mccreeRemuxerMp4live=require("mccree-remuxer-mp4live"),_mccreeRemuxerMp4live2=_interopRequireDefault(_mccreeRemuxerMp4live),_mccreePluginMse=require("mccree-plugin-mse"),_mccreePluginMse2=_interopRequireDefault(_mccreePluginMse),_mccreePluginMseHevc=require("mccree-plugin-mse-hevc"),_mccreePluginMseHevc2=_interopRequireDefault(_mccreePluginMseHevc),PandaMccreeLive=exports.PandaMccreeLive=function(e){function r(e,t){_classCallCheck(this,r);var o=_mccreeHelperBrowser2.default.uaMatch(navigator.userAgent),i=null;i=o.mozilla?new _mccreeLoaderMozXhr2.default:new _mccreeLoaderFetch2.default;var n=new _mccreeDemuxerFlv2.default,c=null;c=t.useHEVC?new _mccreeRemuxerHevc2.default:new _mccreeRemuxerMp4live2.default,t=t||{},t.autoReload||(t.autoReload=6e3),t.loaderBufferLimit=t.loaderBufferLimit||5e7;var l=null;e.logger&&(l=e.logger);var a=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,{logger:l,loader:i,demux:n,remux:c},t));a.TAG="panda-mccree-live",a.logger.debug(a.TAG,"Live initialization");var u=a;return a.observer.on("METADATA_CHANGED",function(){u.reloading||u.reload.call(u)}),a.initStatistic(),a.version="1.1.1-0",a.logger.info(a.TAG,"Current version: "+a.version),a.config.useHEVC?a.mseController=new _mccreePluginMseHevc2.default:a.mseController=new _mccreePluginMse2.default,a.mseController.init(a),a.on=a.observer.on,a}return _inherits(r,e),_createClass(r,[{key:"isSupport",value:function(){return!0}},{key:"checkState",value:function(){this.reloading||this.mseController.checkState()}},{key:"clearBuffer",value:function(){this.mseController.clearBuffer()}},{key:"load",value:function(e){this.logger.info(this.TAG,"loadurl "+e),this.originUrl=e,this.loader.load(e)}},{key:"play",value:function(){this.mediaElement.play()}},{key:"destroy",value:function(){var e=this,r=this;this.logger.debug(r.TAG,"Live destroying"),this.off();var t=new Promise(function(t,o){clearInterval(r.statisticTimmer),r.statisticTimmer=null,r.unload().then(function(o){return e.mediaSource&&e.asourceBuffer&&e.vsourceBuffer?(r.mseController.destroy(),r.detachMedia(),e.media=null,r.cdnip=null,r.loader=null,r.remux=null,r.demux=null,r.logger.debug(r.TAG,"Live destroyed"),void t("destroyed")):void t("already destroyed")}).catch(function(e){t("destroyed")})});return t}},{key:"pause",value:function(){this.mseController.pause()}},{key:"reload",value:function(){var e=this.originUrl,r=this.getMediaElement(),t=this;return t.reloading=!0,new Promise(function(o,i){t.loader.unload().then(function(i){t.mseController.detachMediaElement(),t.media.tracks={},t.remuxBuffer={audio:[],video:[]},t.loaderBuffer.clear(),t.demux.reset(),t.remux.destroy(),t.mseController.removeSourceBuffer(),t.mseController.attachMediaElement(r),t.loader.load(e),t.reloading=!1,o()}).catch(function(e){t.reloading=!1,o()})})}},{key:"getMediaElement",value:function(){return this.mseController.mediaElement}},{key:"initStatistic",value:function(){this.loadbytes=0,this.droppedFrames=0,this.decodedFrames=0;var e=this;this.observer.on(this.events.events.FRAG_LOADED,function(r){e.loadbytes+=r}),this.observer.on("MEDIA_SEGMENT_REMUXED",function(r){r&&(e.decodedFrames+=r)}),this.observer.on("FRAME_DROPPED",function(r){r&&(e.droppedFrames+=r)}),this.statisticTimmer=setInterval(this._onStatistic.bind(this),1e3)}},{key:"_onStatistic",value:function(){try{this.statisticTimmer&&(this.observer.trigger("statistics_info",{droppedFrames:this.droppedFrames,decodedFrames:this.decodedFrames+this.droppedFrames,speed:Math.floor(this.loadbytes/1e3)}),this.loadbytes=0)}catch(e){}}},{key:"attachMediaElement",value:function(e){e&&this.mseController.attachMediaElement(e)}},{key:"recordStartTime",value:function(){this.startTime||(this.startTime=(new Date).getTime())}},{key:"detachMediaElement",value:function(){this.mseController.detachMediaElement()}}]),r}(_mccreeCore2.default);exports.default=PandaMccreeLive;