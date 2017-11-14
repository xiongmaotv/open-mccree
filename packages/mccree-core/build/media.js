'use strict';
/**
 * The data struct
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Media = function () {
  /**
   * Media include trucks and media informations.
   * 
   * @class Media
   * @param {Object} mccree - mccree object. 
   * @param {Object} tracks - tracks.
   */
  function Media(config, tracks) {
    _classCallCheck(this, Media);

    this.TAG = 'MccreeMedia';

    this.config = config || {};

    this.level = null;

    this.tracks = tracks || {};

    this.mediaInfo = {};
    this.videoDuration = 0;
    this.audioDuration = 0;
  }

  /**
   * Initailize all tracks.
   */


  _createClass(Media, [{
    key: 'initTracks',
    value: function initTracks() {
      for (var i = 0; i < this.tracks.length; i++) {
        this.tracks[Object.keys(this.tracks)[i]].reset();
      }
    }
    /**
     * reset all tracks.
     */

  }, {
    key: 'resetTracks',
    value: function resetTracks() {
      for (var i = 0; i < this.tracks.length; i++) {
        this.tracks[Object.keys(this.tracks)[i]].reset();
      }
    }

    /**
     * get a track.
     *
     * @param {number} key - the key of track.
     */

  }, {
    key: 'getTrack',
    value: function getTrack(key) {
      return this.tracks[key];
    }

    /**
     * destory all tracks.
     */

  }, {
    key: 'destoryTracks',
    value: function destoryTracks() {
      for (var i = 0; i < this.tracks.length; i++) {
        this.tracks[Object.keys(this.tracks)[i]].destroy();
      }
    }
  }]);

  return Media;
}();

exports.default = Media;