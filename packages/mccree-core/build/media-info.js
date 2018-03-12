'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MediaInfo =
/**
 * Media informations .
 * 
 * @class MediaInfo
 * @param {Object} mccree - mccree object. 
 * @param {Object} config - the configurations
 */
function MediaInfo(mccree, config) {
    _classCallCheck(this, MediaInfo);

    this.TAG = 'MccreeMediaInfo';
    this.mimeType = null;
    this.duration = null;

    this.hasAudio = null;
    this.audioCodec = null;
    this.audioDataRate = null;
    this.audioSampleRate = null;

    this.hasVideo = null;
    this.videoCodec = null;
    this.videoDataRate = null;
    this.height = null;
    this.width = null;
    this.fps = null;
    this.profile = null;
    this.level = null;

    this.metadata = null;
};

exports.default = MediaInfo;