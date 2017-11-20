'use strict';
import {AudioTrack, VideoTrack} from 'mccree-core-track';
import SPSParser from 'mccree-helper-spsparser';
import defaultVideoConfig from './default-video-config.js';
import defaultAudioConfig from './default-audio-config.js';
import AmfParser from './amf-parser.js';

class FLVDemuxer {
  /**
   * Constructor
   */
  constructor(config) {
    this.TAG = 'FLVDemuxer';
    this.type = 'demuxer';
    this._isFlv = false;
    this._config = config || {};
    this._firstFragLoaded = false;
    this._hasScript = false;
    this._hasAudioSequence = false;
    this._hasVideoSequence = false;
    this._tracknum = 0;
  }

  reset() {
    this._isReseting = true;
    this._isFlv = false;
    this._firstFragLoaded = false;
    this._hasScript = false;
    this._hasAudioSequence = false;
    this._hasVideoSequence = false;
    this._tracknum = 0;
  }

  /**
   * Initailize the demux module.
   */
  init(mccree) {
    this.mccree = mccree;
    this.logger = mccree.logger;
    this.observer = mccree.observer;
    this.events = mccree.events.events;
    this.errorTypes = mccree.events.errorTypes;
    this.errorDetails = mccree.events.errorDetails;
    this.logMsgs = mccree.events.logMsgs;
    this.observer.on(this.events.FRAG_LOADED, this._fragLoaded.bind(this));
  }

  /**
   * Analyse and appand data when the fragment data is arrival.
   */
  _fragLoaded() {
    if (!this._firstFragLoaded) {
      if (this.mccree.loaderBuffer.length < 13) {
        return;
      }
      let playType = this._config.playType;
      let data = this.mccree.loaderBuffer.shift(13);
      this._parseFlvHeader(data, playType);
      this._fragLoaded();
    } else {
      if (this.mccree.loaderBuffer.length < 11) {
        return;
      }
      var chunk = this._parseFlvTag();
      if (chunk) {
        if (chunk !== -1) {
          this.logger.error(this.TAG, this.type, {});
        }
        this._fragLoaded();
      }
    }
  }

  /**
   * Parse the flv header.
   */
  _parseFlvHeader(data, playType) {
    let offset = 0;
    if (data[0] !== 0x46 || data[1] !== 0x4C || data[2] !== 0x56 || data[3] !== 0x01) {
      this.observer.trigger(this.events.demux.DEMUXER_MISSMATCH, data);
      this._fragLoaded();
    } else {
      this._firstFragLoaded = true;
      offset += 4;
      let trackInfo = this._switchPlayType(data[offset], playType);
      if (trackInfo & 0x01 > 0) {
        this._tracknum++;
        let videoTrack = new VideoTrack();
        this.mccree.media.tracks.videoTrack = videoTrack;
        this._setDefaultVideoConfig();
      }

      if (trackInfo & 0x04 > 0) {
        this._tracknum++;
        let audioTrack = new AudioTrack();
        this.mccree.media.tracks.audioTrack = audioTrack;
        this._setDefaultAudioConfig();
      }
      this._fragLoaded();
    }
  }

  /**
   * If the stream has audio or video. 
   * @param {numeber} streamFlag - Data from the stream which is define whether the audio / video track is exist. 
   * @param {String} playType - Defined by the customer. Optional. 
   */
  _switchPlayType(streamFlag, playType) {
    let trackInfo = 0x05;
    switch (playType) {
      case 'audio':
        trackInfo = 0x04;
        break;
      case 'video':
        trackInfo = 0x05;
        break;
      default:
        streamFlag ? (trackInfo = streamFlag) : (trackInfo = 0x05);
        break;
    }
    return trackInfo;
  }

  /** 
   * Set the default video configurations. 
   */
  _setDefaultVideoConfig() {
    let videoTrack = this.mccree.media.tracks.videoTrack;
    videoTrack.meta = defaultVideoConfig;
    videoTrack.id = videoTrack.meta.id = this._tracknum;
  }

  /** 
   * Set the default video configurations. 
   */
  _setDefaultAudioConfig() {
    let audioTrack = this.mccree.media.tracks.audioTrack;
    audioTrack.meta = defaultAudioConfig;
    audioTrack.id = audioTrack.meta.id = this._tracknum;
  }

  /**
   * Package the data as the following data structure
   * {
   *    data: Uint8Array. the Stream data.
   *    info: The first byte info of the Tag.
   *    tagType: 8、9、18
   *    timeStamp: the timestemp;
   * }
   */
  _parseFlvTag() {
    if (this.mccree.loaderBuffer.length < 11) {
      return null;
    }
    let chunk = this._parseFlvTagHeader();
    if(chunk) {
      this._processChunk(chunk);
    }
  }

  /** 
   * Parse the 11 byte tag Header
   */
  _parseFlvTagHeader() {
    let chunk = {};
    let tagType = this.mccree.loaderBuffer.toInt(0, 1);

    // 2 bit FMS reserved, 1 bit filtered, 5 bit tag type
    chunk.filtered = (tagType & 32) >>> 5;
    chunk.tagType = tagType & 31;

    // 3 Byte datasize
    chunk.datasize = this.mccree.loaderBuffer.toInt(1, 3);
    if ((chunk.tagType !== 8 && chunk.tagType !== 9 && chunk.tagType !== 11 && chunk.tagType !== 18)
      || this.mccree.loaderBuffer.toInt(8, 3) !== 0) {
      if(this.loaderBuffer && this.loaderBuffer.length > 0) {
        this.loaderBuffer.shift(1);
      }
      this.logger.warn(this.TAG, this.type, ' tagType' + chunk.tagType);
      return null;
    }

    if (this.mccree.loaderBuffer.length < chunk.datasize + 15) {
      return null;
    }

    // read the data.
    this.mccree.loaderBuffer.shift(4);

    // 3 Byte timestamp
    let timestamp = this.mccree.loaderBuffer.toInt(0, 3);
    this.mccree.loaderBuffer.shift(3);

    // 1 Byte timestampExt
    let timestampExt = this.mccree.loaderBuffer.shift(1)[0];
    if (timestampExt > 0) {
      timestamp += timestampExt * 0x1000000;
    }

    chunk.timestamp = timestamp;

    // streamId 
    this.mccree.loaderBuffer.shift(3);
    return chunk;
  }

  _processChunk(chunk) {
    switch (chunk.tagType) {
      case 18:
        this._parseScriptData(chunk);
        break;
      case 8:
        this._parseAACData(chunk);
        break;
      case 9:
        this._parseAVCData(chunk);
        break;
      case 11:
        // for some CDN that did not process the currect RTMP messages
        this.mccree.loaderBuffer.shift(3);
        break;
      default:
        this.mccree.loaderBuffer.shift(1);
        break;
    }
    this._fragLoaded();
  }

  _clearBuffer() {
    this.logger.debug(this.TAG, this.type, '清除缓存');
  }

  _parseScriptData(chunk) {
    let audioTrack = this.mccree.media.tracks.audioTrack;
    let videoTrack = this.mccree.media.tracks.videoTrack;

    let data = this.mccree.loaderBuffer.shift(chunk.datasize);
    let mediaInfo = this.mccree.media.mediaInfo = new AmfParser(data).parseMetadata();
    let validate = this._datasizeValidator(chunk.datasize);
    if (validate) {
      this._hasScript = true;
    }

    // Edit default meta.
    if(audioTrack && !audioTrack.hasSpecificConfig) {
      let meta = audioTrack.meta;
      if(mediaInfo.audiosamplerate) {
        meta.audioSampleRate = mediaInfo.audiosamplerate;
      } 
       
      if(mediaInfo.audiochannels) {
        meta.channelCount = mediaInfo.audiochannels;
      }

      switch(mediaInfo.audiosamplerate) {
        case 44100:
          meta.sampleRateIndex = 4;
          break;
        case 22050:
          meta.sampleRateIndex = 7;
          break;
        case 11025:
          meta.sampleRateIndex = 10;
          break;
      }
    }
    if(videoTrack && !videoTrack.hasSpecificConfig) { 
      let meta = videoTrack.meta;
      if (typeof mediaInfo.framerate === 'number') {
        let fps_num = Math.floor(mediaInfo.framerate * 1000);
        if (fps_num > 0) {
          let fps = fps_num / 1000;
          if(!meta.frameRate) {
            meta.frameRate = {};
          }
          meta.frameRate.fixed = true;
          meta.frameRate.fps = fps;
          meta.frameRate.fps_num = fps_num;
          meta.frameRate.fps_den = 1000;
        }
      }
    }
  }

  _parseAACData(chunk) {
    let track = this.mccree.media.tracks.audioTrack;
    if(!track) {
      return;
    }

    let meta = track.meta;
    
    if(!meta) {
      meta = defaultAudioConfig;
    }

    let info = this.mccree.loaderBuffer.shift(1)[0];
    chunk.data = this.mccree.loaderBuffer.shift(chunk.datasize - 1);
    let format = (info & 240) >>> 4;

    track.format = format;
    
    if (format !== 10) {
      this.observer.trigger('error', this.mccree.events.MEDIA_ERROR, {});
    }

    if (format === 10 && !this._hasAudioSequence) {
      meta.audioSampleRate = this._switchAudioSamplingFrequency(info);
      meta.sampleRateIndex = (info & 12) >>> 2;
      meta.frameLenth = (info & 2) >>> 1;
      meta.channelCount = info & 1;
      meta.refSampleDuration = Math.floor(1024 / meta.audioSampleRate * meta.timescale);
    }

    let audioSampleRate = meta.audioSampleRate;
    let audioSampleRateIndex = meta.sampleRateIndex;
    let refSampleDuration = meta.refSampleDuration;

    delete chunk.tagType;
    let validate = this._datasizeValidator(chunk.datasize);

    if (chunk.data[0] === 0) {
      let ret = this._aacSequenceHeaderParser(chunk.data);
      audioSampleRate = ret.audiosamplerate || meta.audioSampleRate;
      audioSampleRateIndex = ret.sampleRateIndex || meta.sampleRateIndex;
      refSampleDuration = Math.floor(1024 / audioSampleRate * meta.timescale);
      meta.channelCount = ret.channelCount;
      meta.audioSampleRate = audioSampleRate;
      meta.sampleRateIndex = audioSampleRateIndex;
      meta.refSampleDuration = refSampleDuration;
      this._hasAudioSequence = true;
      if (this._hasScript && (!this.mccree.media.tracks.videoTrack || this._hasVideoSequence)) {
        this.observer.trigger('METADATA_PARSED');
      }
    } else {
      chunk.data = chunk.data.slice(1, chunk.data.length);
      this.observer.trigger('AUDIODATA_PARSED');
      track.samples.push(chunk);
    }

    if (!validate) {
      this.logger.warn(this.TAG, this.type, 'TAG 长度确认有误' + chunk.datasize);
    }
  }

  _parseAVCData(chunk) {

    // header
    let info = this.mccree.loaderBuffer.shift(1)[0];
    chunk.frameType = (info & 0xf0) >>> 4;
    let codecID = info & 0x0f;
    this.mccree.media.tracks.videoTrack.codecID = codecID;

    // AVC or not.
    if (codecID === 7) {
      // AVC header.
      chunk.avcPacketType = this.mccree.loaderBuffer.shift(1)[0];
      chunk.compositionTime = this.mccree.loaderBuffer.toInt(0, 3);
      this.mccree.loaderBuffer.shift(3);
      chunk.data = this.mccree.loaderBuffer.shift(chunk.datasize - 5);
      // If it is AVC sequece Header.
      if (chunk.avcPacketType === 0) {
        this._avcSequenceHeaderParser(chunk.data);
        let validate = this._datasizeValidator(chunk.datasize);
        if (validate) {
          this._hasVideoSequence = true;
          if (this._hasScript && (!this.mccree.media.tracks.audioTrack || this._hasAudioSequence)) {
            this.observer.trigger('METADATA_PARSED');
          }
        }
      } else {
        if (!this._datasizeValidator(chunk.datasize)) {
          this.logger.warn(this.TAG, this.type, 'TAG 长度确认有误' + chunk.datasize);
        }
        this.observer.trigger('VIDEODATA_PARSED');
        this.mccree.media.tracks.videoTrack.samples.push(chunk);
      }
    } else {
      chunk.data = this.mccree.loaderBuffer.shift(chunk.datasize - 1);
      if (!this._datasizeValidator(chunk.datasize)) {
        this.logger.warn(this.TAG, this.type, 'TAG 长度确认有误' + chunk.datasize);
      }
      this.observer.trigger('VIDEODATA_PARSED');
      this.mccree.media.tracks.videoTrack.samples.push(chunk);
    }

    delete chunk.tagType;
  }

  _datasizeValidator(datasize) {
    let datasizeConfirm = this.mccree.loaderBuffer.toInt(0, 4);
    this.mccree.loaderBuffer.shift(4);
    let validate = datasizeConfirm === datasize + 11;
    return validate;
  }
  _switchAudioSamplingFrequency(info) {
    let samplingFrequencyIndex = (info & 12) >>> 2;
    let samplingFrequencyList = [5500, 11025, 22050, 44100];
    return samplingFrequencyList[samplingFrequencyIndex];
  }

  _switchAudioChannel(info) {
    let sampleTrackNumIndex = info & 1;
    let sampleTrackNumList = [1, 2];
    return sampleTrackNumList[sampleTrackNumIndex];
  }

  _aacSequenceHeaderParser(data) {
    let ret = {};
    ret.hasSpecificConfig = true;
    ret.objectType = data[1] >>> 3;
    ret.sampleRateIndex = ((data[1] & 7) << 1) | (data[2] >>> 7);
    ret.audiosamplerate = this._switchAudioSampleRate(ret.sampleRateIndex);
    ret.channelCount = (data[2] & 120) >>> 3;
    ret.frameLength = (data[2] & 4) >>> 2;
    ret.dependsOnCoreCoder = (data[2] & 2) >>> 1;
    ret.extensionFlagIndex = data[2] & 1;
    return ret;
  }

  _switchAudioSampleRate(samplingFrequencyIndex) {
    let samplingFrequencyList = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
    return samplingFrequencyList[samplingFrequencyIndex];
  }

  _avcSequenceHeaderParser(data) {
    let track = this.mccree.media.tracks.videoTrack;
    
    if(!track) {
      return;
    }

    let offset = 0;

    if(!track.meta) {
      track.meta = defaultVideoConfig;
    }
    let meta = track.meta;

    meta.configurationVersion = data[0];
    meta.avcProfileIndication = data[1];
    meta.profileCompatibility = data[2];
    meta.avcLevelIndication = data[3] / 10;
    meta.nalUnitLength = (data[4] & 0x03) + 1;

    let numOfSps = data[5] & 0x1f;
    offset = 6;
    let config = {};

    // parse SPS
    for (let i = 0; i < numOfSps; i++) {
      let size = data[offset] * 255 + data[offset + 1];
      offset += 2;

      let sps = new Uint8Array(size);
      for (let j = 0; j < size; j++) {
        sps[j] = data[offset + j];
      }

      // codec string
      let codecString = 'avc1.';
      for (var j = 1; j < 4; j++) {
        var h = sps[j].toString(16);
        if (h.length < 2) {
          h = '0' + h;
        }
        codecString += h;
      }

      meta.codec = codecString;

      offset += size;
      config = SPSParser.parseSPS(sps);
    }

    let numOfPps = data[offset];
    offset++;
    for (let i = 0; i < numOfPps; i++) {
      let size = data[offset] * 255 + data[offset + 1];
      offset += 2;
      let pps = new Uint8Array(size);
      for (let j = 0; j < size; j++) {
        pps[j] = data[offset + j];
      }
      offset += size;
      this.mccree.media.tracks.videoTrack.pps = pps;
    }

    if(config && config.codec_size) {
      meta.codecWidth = config.codec_size.width;
      meta.codecHeight = config.codec_size.height;
      meta.presentWidth = config.present_size.width;
      meta.presentHeight = config.present_size.height;
    }
    
    meta.profile = config.profile_string || meta.profile;
    meta.level = config.level_string || meta.level;
    meta.bitDepth = config.bit_depth || meta.bitDepth;
    meta.chromaFormat = config.chroma_format || meta.chromaFormat;
    
    if(meta.sarRatio) {
      meta.sarRatio.width = config.sar_ratio.width;
      meta.sarRatio.height = config.sar_ratio.height;
    }
    
    if(meta.frameRate && config.frame_rate.fixed && config.frame_rate.fps_num > 0 && config.frame_rate.fps_den > 0) {
      meta.frameRate = config.frame_rate;
    }

    let fps_den = meta.frameRate.fps_den;
    let fps_num = meta.frameRate.fps_num;
    meta.refSampleDuration = Math.floor(meta.timescale * (fps_den / fps_num));

    meta.avcc = new Uint8Array(data.length);
    meta.avcc.set(data);
    track.meta = meta;
  }
}
export default FLVDemuxer;