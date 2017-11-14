'use strict';
/**
 * The data struct
 */

class Media {
  /**
   * Media include trucks and media informations.
   * 
   * @class Media
   * @param {Object} mccree - mccree object. 
   * @param {Object} tracks - tracks.
   */
  constructor(config, tracks) {
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
  initTracks() {
    for (let i = 0; i < this.tracks.length; i++) {
      this.tracks[Object.keys(this.tracks)[i]].reset();
    }
  }
 /**
  * reset all tracks.
  */
  resetTracks() {
    for (let i = 0; i < this.tracks.length; i++) {
      this.tracks[Object.keys(this.tracks)[i]].reset();
    }
  }

  /**
   * get a track.
   *
   * @param {number} key - the key of track.
   */
  getTrack(key) {
    return this.tracks[key];
  }

  /**
   * destory all tracks.
   */
  destoryTracks() {
    for (let i = 0; i < this.tracks.length; i++) {
      this.tracks[Object.keys(this.tracks)[i]].destroy();
    }
  }
}

export default Media;
