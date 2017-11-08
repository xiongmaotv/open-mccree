'use strict';

class MediaInfo {
  /**
   * Media informations .
   * 
   * @class MediaInfo
   * @param {Object} mccree - mccree object. 
   * @param {Object} config - the configurations
   */
  constructor (mccree, config) {
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
    this.height =  null;
    this.width =  null;
    this.fps = null;
    this.profile = null;
    this.level = null;

    this.metadata = null;
  }
}

export default MediaInfo;