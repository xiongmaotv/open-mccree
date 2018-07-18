'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mccreeCoreTrack = require('mccree-core-track');

var _mccreeHelperSpsparser = require('mccree-helper-spsparser');

var _mccreeHelperSpsparser2 = _interopRequireDefault(_mccreeHelperSpsparser);

var _defaultVideoConfig = require('./default-video-config.js');

var _defaultVideoConfig2 = _interopRequireDefault(_defaultVideoConfig);

var _defaultAudioConfig = require('./default-audio-config.js');

var _defaultAudioConfig2 = _interopRequireDefault(_defaultAudioConfig);

var _amfParser = require('./amf-parser.js');

var _amfParser2 = _interopRequireDefault(_amfParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FLVDemuxer = function () {
  /**
   * Constructor
   */
  function FLVDemuxer(config) {
    _classCallCheck(this, FLVDemuxer);

    this.TAG = 'mccree-demuxer-flv:index';
    this.type = 'demuxer';
    this._isFlv = false;
    this._config = config || {};
    this._firstFragLoaded = false;
    this._hasScript = false;
    this._hasAudioSequence = false;
    this._hasVideoSequence = false;
    this._tracknum = 0;
  }

  _createClass(FLVDemuxer, [{
    key: 'reset',
    value: function reset() {
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

  }, {
    key: 'init',
    value: function init(mccree) {
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

  }, {
    key: '_fragLoaded',
    value: function _fragLoaded() {
      if (!this._firstFragLoaded) {
        if (this.mccree.loaderBuffer.length < 13) {
          return;
        }
        var playType = this._config.playType;
        var data = this.mccree.loaderBuffer.shift(13);
        this._parseFlvHeader(data, playType);
        this._fragLoaded();
      } else {
        if (this.mccree.loaderBuffer.length < 11) {
          return;
        }
        var chunk = this._parseFlvTag();
        if (chunk) {
          if (chunk !== -1) {
            this.logger.error(this.TAG, 'chunk error');
          }
          this._fragLoaded();
        }
      }
    }

    /**
     * Parse the flv header.
     */

  }, {
    key: '_parseFlvHeader',
    value: function _parseFlvHeader(data, playType) {
      var offset = 0;
      if (data[0] !== 0x46 || data[1] !== 0x4C || data[2] !== 0x56 || data[3] !== 0x01) {
        this.observer.trigger(this.events.demux.DEMUXER_MISSMATCH, data);
        this._fragLoaded();
      } else {
        this._firstFragLoaded = true;
        offset += 4;
        var trackInfo = this._switchPlayType(data[offset], playType);
        if (trackInfo & 0x01 > 0) {
          this._tracknum++;
          var videoTrack = new _mccreeCoreTrack.VideoTrack();
          this.mccree.media.tracks.videoTrack = videoTrack;
          this._setDefaultVideoConfig();
        }

        if (trackInfo & 0x04 > 0) {
          this._tracknum++;
          var audioTrack = new _mccreeCoreTrack.AudioTrack();
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

  }, {
    key: '_switchPlayType',
    value: function _switchPlayType(streamFlag, playType) {
      var trackInfo = 0x05;
      switch (playType) {
        case 'audio':
          trackInfo = 0x04;
          break;
        case 'video':
          trackInfo = 0x05;
          break;
        default:
          streamFlag ? trackInfo = streamFlag : trackInfo = 0x05;
          break;
      }
      return trackInfo;
    }

    /** 
     * Set the default video configurations. 
     */

  }, {
    key: '_setDefaultVideoConfig',
    value: function _setDefaultVideoConfig() {
      var videoTrack = this.mccree.media.tracks.videoTrack;
      videoTrack.meta = _defaultVideoConfig2.default;
      videoTrack.id = videoTrack.meta.id = this._tracknum;
    }

    /** 
     * Set the default video configurations. 
     */

  }, {
    key: '_setDefaultAudioConfig',
    value: function _setDefaultAudioConfig() {
      var audioTrack = this.mccree.media.tracks.audioTrack;
      audioTrack.meta = _defaultAudioConfig2.default;
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

  }, {
    key: '_parseFlvTag',
    value: function _parseFlvTag() {
      if (this.mccree.loaderBuffer.length < 11) {
        return null;
      }
      var chunk = this._parseFlvTagHeader();
      if (chunk) {
        this._processChunk(chunk);
      }
    }

    /** 
     * Parse the 11 byte tag Header
     */

  }, {
    key: '_parseFlvTagHeader',
    value: function _parseFlvTagHeader() {
      var chunk = {};
      var tagType = this.mccree.loaderBuffer.toInt(0, 1);

      // 2 bit FMS reserved, 1 bit filtered, 5 bit tag type
      chunk.filtered = (tagType & 32) >>> 5;
      chunk.tagType = tagType & 31;

      // 3 Byte datasize
      chunk.datasize = this.mccree.loaderBuffer.toInt(1, 3);
      if (chunk.tagType !== 8 && chunk.tagType !== 9 && chunk.tagType !== 11 && chunk.tagType !== 18 || this.mccree.loaderBuffer.toInt(8, 3) !== 0) {
        if (this.loaderBuffer && this.loaderBuffer.length > 0) {
          this.loaderBuffer.shift(1);
        }
        this.logger.warn(this.TAG, 'tagType ' + chunk.tagType);
        return null;
      }

      if (this.mccree.loaderBuffer.length < chunk.datasize + 15) {
        return null;
      }

      // read the data.
      this.mccree.loaderBuffer.shift(4);

      // 3 Byte timestamp
      var timestamp = this.mccree.loaderBuffer.toInt(0, 3);
      this.mccree.loaderBuffer.shift(3);

      // 1 Byte timestampExt
      var timestampExt = this.mccree.loaderBuffer.shift(1)[0];
      if (timestampExt > 0) {
        timestamp += timestampExt * 0x1000000;
      }

      chunk.timestamp = timestamp;

      // streamId 
      this.mccree.loaderBuffer.shift(3);
      return chunk;
    }
  }, {
    key: '_processChunk',
    value: function _processChunk(chunk) {
      switch (chunk.tagType) {
        case 18:
          this._parseScriptData(chunk);
          break;
        case 8:
          this._parseAACData(chunk);
          break;
        case 9:
          this._parseHevcData(chunk);
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
  }, {
    key: '_clearBuffer',
    value: function _clearBuffer() {
      this.logger.debug(this.TAG, 'Cache clear');
    }
  }, {
    key: '_parseScriptData',
    value: function _parseScriptData(chunk) {
      var audioTrack = this.mccree.media.tracks.audioTrack;
      var videoTrack = this.mccree.media.tracks.videoTrack;

      var data = this.mccree.loaderBuffer.shift(chunk.datasize);
      var mediaInfo = this.mccree.media.mediaInfo = new _amfParser2.default(data).parseMetadata();
      var validate = this._datasizeValidator(chunk.datasize);
      if (validate) {
        this._hasScript = true;
      }

      // Edit default meta.
      if (audioTrack && !audioTrack.hasSpecificConfig) {
        var meta = audioTrack.meta;
        if (mediaInfo.audiosamplerate) {
          meta.audioSampleRate = mediaInfo.audiosamplerate;
        }

        if (mediaInfo.audiochannels) {
          meta.channelCount = mediaInfo.audiochannels;
        }

        switch (mediaInfo.audiosamplerate) {
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
      if (videoTrack && !videoTrack.hasSpecificConfig) {
        var _meta = videoTrack.meta;
        if (typeof mediaInfo.framerate === 'number') {
          var fps_num = Math.floor(mediaInfo.framerate * 1000);
          if (fps_num > 0) {
            var fps = fps_num / 1000;
            if (!_meta.frameRate) {
              _meta.frameRate = {};
            }
            _meta.frameRate.fixed = true;
            _meta.frameRate.fps = fps;
            _meta.frameRate.fps_num = fps_num;
            _meta.frameRate.fps_den = 1000;
          }
        }
      }
    }
  }, {
    key: '_parseAACData',
    value: function _parseAACData(chunk) {
      var track = this.mccree.media.tracks.audioTrack;
      if (!track) {
        return;
      }

      var meta = track.meta;

      if (!meta) {
        meta = _defaultAudioConfig2.default;
      }

      var info = this.mccree.loaderBuffer.shift(1)[0];

      chunk.data = this.mccree.loaderBuffer.shift(chunk.datasize - 1);

      var format = (info & 240) >>> 4;

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

      var audioSampleRate = meta.audioSampleRate;
      var audioSampleRateIndex = meta.sampleRateIndex;
      var refSampleDuration = meta.refSampleDuration;

      delete chunk.tagType;
      var validate = this._datasizeValidator(chunk.datasize);

      if (chunk.data[0] === 0) {
        var ret = this._aacSequenceHeaderParser(chunk.data);
        audioSampleRate = ret.audiosamplerate || meta.audioSampleRate;
        audioSampleRateIndex = ret.sampleRateIndex || meta.sampleRateIndex;
        refSampleDuration = Math.floor(1024 / audioSampleRate * meta.timescale);
        meta.channelCount = ret.channelCount;
        meta.audioSampleRate = audioSampleRate;
        meta.sampleRateIndex = audioSampleRateIndex;
        meta.refSampleDuration = refSampleDuration;
        if (this._hasScript && !this._hasAudioSequence && (!this.mccree.media.tracks.videoTrack || this._hasVideoSequence)) {
          this.observer.trigger('METADATA_PARSED');
        } else if (this._hasScript && this._hasAudioSequence) {
          this.observer.trigger('METADATA_CHANGED');
        }
        ;
        this._hasAudioSequence = true;
      } else {
        chunk.data = chunk.data.slice(1, chunk.data.length);
        this.observer.trigger('AUDIODATA_PARSED');
        track.samples.push(chunk);
      }

      if (!validate) {
        this.logger.warn(this.TAG, 'TAG length error at ' + chunk.datasize);
      }
    }
  }, {
    key: '_parseHevcData',
    value: function _parseHevcData(chunk) {
      // header
      var info = this.mccree.loaderBuffer.shift(1)[0];
      chunk.frameType = (info & 0xf0) >>> 4;
      var tempCodecID = this.mccree.media.tracks.videoTrack.codecID;
      var codecID = info & 0x0f;
      this.mccree.media.tracks.videoTrack.codecID = codecID;

      //hevc和avc的header解析方式一样
      chunk.avcPacketType = this.mccree.loaderBuffer.shift(1)[0];
      chunk.compositionTime = this.mccree.loaderBuffer.toInt(0, 3);
      this.mccree.loaderBuffer.shift(3);

      // hevc is 12, avc is 7
      if (codecID === 12) {
        var data = this.mccree.loaderBuffer.shift(chunk.datasize - 5);
        chunk.data = data;

        if (chunk.avcPacketType != 0) {
          if (!this._datasizeValidator(chunk.datasize)) {
            this.logger.warn(this.TAG, this.logMsgs.TAG_LENGTH_ERROR + chunk.datasize);
          }
          var nalu = {};
          var r = 0;
          nalu.compositionTime = chunk.compositionTime;
          nalu.timestamp = chunk.timestamp;
          while (chunk.data.length > r) {
            var sizes = chunk.data.slice(0 + r, 4 + r);
            nalu.size = sizes[3];
            nalu.size += sizes[2] * 256;
            nalu.size += sizes[1] * 256 * 256;
            nalu.size += sizes[0] * 256 * 256 * 256;
            r += 4;
            nalu.data = chunk.data.slice(0 + r, nalu.size + r);
            r += nalu.size;
            this.mccree.media.tracks.videoTrack.samples.push(nalu);
            this.observer.trigger('VIDEO_PARSED');
          }
        } else if (chunk.avcPacketType == 0) {
          if (!this._datasizeValidator(chunk.datasize)) {
            this.logger.warn(this.TAG, this.logMsgs.TAG_LENGTH_ERROR + chunk.datasize);
          } else {
            this.observer.trigger('METADATA_PARSED');
          }
        }
      } else if (codecID === 7) {
        var data = this.mccree.loaderBuffer.shift(chunk.datasize - 5);
        if (data[4] === 0 && data[5] === 0 && data[6] === 0 && data[7] === 1) {
          var avcclength = 0;
          for (var i = 0; i < 4; i++) {
            avcclength = avcclength * 256 + data[i];
          }
          avcclength -= 4;
          data = data.slice(4, data.length);
          data[3] = avcclength % 256;
          avcclength = (avcclength - data[3]) / 256;
          data[2] = avcclength % 256;
          avcclength = (avcclength - data[2]) / 256;
          data[1] = avcclength % 256;
          data[0] = (avcclength - data[1]) / 256;
        }

        chunk.data = data;
        // If it is AVC sequece Header.
        if (chunk.avcPacketType === 0) {
          this._avcSequenceHeaderParser(chunk.data);
          var validate = this._datasizeValidator(chunk.datasize);
          if (validate) {
            if (this._hasScript && !this._hasVideoSequence && (!this.mccree.media.tracks.audioTrack || this._hasAudioSequence)) {
              this.observer.trigger('METADATA_PARSED');
            } else if (this._hasScript && this._hasVideoSequence) {
              this.observer.trigger('METADATA_CHANGED');
            }
            this._hasVideoSequence = true;
          }
        } else {
          if (!this._datasizeValidator(chunk.datasize)) {
            this.logger.warn(this.TAG, this.logMsgs.TAG_LENGTH_ERROR + chunk.datasize);
          }
          this.observer.trigger('VIDEODATA_PARSED');
          this.mccree.media.tracks.videoTrack.samples.push(chunk);
        }
      } else {
        this.logger.warn(this.TAG, 'codeid is ' + codecID);
        chunk.data = this.mccree.loaderBuffer.shift(chunk.datasize - 1);
        if (!this._datasizeValidator(chunk.datasize)) {
          this.logger.warn(this.TAG, this.logMsgs.TAG_LENGTH_ERROR + chunk.datasize);
        }
        this.observer.trigger('VIDEODATA_PARSED');
        this.mccree.media.tracks.videoTrack.samples.push(chunk);
      }
      delete chunk.tagType;
    }
  }, {
    key: '_datasizeValidator',
    value: function _datasizeValidator(datasize) {
      var datasizeConfirm = this.mccree.loaderBuffer.toInt(0, 4);
      this.mccree.loaderBuffer.shift(4);
      var validate = datasizeConfirm === datasize + 11;
      return validate;
    }
  }, {
    key: '_switchAudioSamplingFrequency',
    value: function _switchAudioSamplingFrequency(info) {
      var samplingFrequencyIndex = (info & 12) >>> 2;
      var samplingFrequencyList = [5500, 11025, 22050, 44100];
      return samplingFrequencyList[samplingFrequencyIndex];
    }
  }, {
    key: '_switchAudioChannel',
    value: function _switchAudioChannel(info) {
      var sampleTrackNumIndex = info & 1;
      var sampleTrackNumList = [1, 2];
      return sampleTrackNumList[sampleTrackNumIndex];
    }
  }, {
    key: '_aacSequenceHeaderParser',
    value: function _aacSequenceHeaderParser(data) {
      var ret = {};
      ret.hasSpecificConfig = true;
      ret.objectType = data[1] >>> 3;
      ret.sampleRateIndex = (data[1] & 7) << 1 | data[2] >>> 7;
      ret.audiosamplerate = this._switchAudioSampleRate(ret.sampleRateIndex);
      ret.channelCount = (data[2] & 120) >>> 3;
      ret.frameLength = (data[2] & 4) >>> 2;
      ret.dependsOnCoreCoder = (data[2] & 2) >>> 1;
      ret.extensionFlagIndex = data[2] & 1;
      return ret;
    }
  }, {
    key: '_switchAudioSampleRate',
    value: function _switchAudioSampleRate(samplingFrequencyIndex) {
      var samplingFrequencyList = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
      return samplingFrequencyList[samplingFrequencyIndex];
    }
  }, {
    key: '_avcSequenceHeaderParser',
    value: function _avcSequenceHeaderParser(data) {
      var track = this.mccree.media.tracks.videoTrack;

      if (!track) {
        return;
      }

      var offset = 0;

      if (!track.meta) {
        track.meta = _defaultVideoConfig2.default;
      }
      var meta = track.meta;

      meta.configurationVersion = data[0];
      meta.avcProfileIndication = data[1];
      meta.profileCompatibility = data[2];
      meta.avcLevelIndication = data[3] / 10;
      meta.nalUnitLength = (data[4] & 0x03) + 1;

      var numOfSps = data[5] & 0x1f;
      offset = 6;
      var config = {};

      // parse SPS
      for (var i = 0; i < numOfSps; i++) {
        var size = data[offset] * 255 + data[offset + 1];
        offset += 2;

        var sps = new Uint8Array(size);
        for (var _j = 0; _j < size; _j++) {
          sps[_j] = data[offset + _j];
        }

        // codec string
        var codecString = 'avc1.';
        for (var j = 1; j < 4; j++) {
          var h = sps[j].toString(16);
          if (h.length < 2) {
            h = '0' + h;
          }
          codecString += h;
        }

        meta.codec = codecString;

        offset += size;
        config = _mccreeHelperSpsparser2.default.parseSPS(sps);
      }

      var numOfPps = data[offset];
      offset++;
      for (var _i = 0; _i < numOfPps; _i++) {
        var _size = data[offset] * 255 + data[offset + 1];
        offset += 2;
        var pps = new Uint8Array(_size);
        for (var _j2 = 0; _j2 < _size; _j2++) {
          pps[_j2] = data[offset + _j2];
        }
        offset += _size;
        this.mccree.media.tracks.videoTrack.pps = pps;
      }

      if (config && config.codec_size) {
        meta.codecWidth = config.codec_size.width;
        meta.codecHeight = config.codec_size.height;
        meta.presentWidth = config.present_size.width;
        meta.presentHeight = config.present_size.height;
      }

      meta.profile = config.profile_string || meta.profile;
      meta.level = config.level_string || meta.level;
      meta.bitDepth = config.bit_depth || meta.bitDepth;
      meta.chromaFormat = config.chroma_format || meta.chromaFormat;

      if (meta.sarRatio) {
        meta.sarRatio.width = config.sar_ratio.width;
        meta.sarRatio.height = config.sar_ratio.height;
      }

      if (meta.frameRate && config.frame_rate.fixed && config.frame_rate.fps_num > 0 && config.frame_rate.fps_den > 0) {
        meta.frameRate = config.frame_rate;
      }

      var fps_den = meta.frameRate.fps_den;
      var fps_num = meta.frameRate.fps_num;
      meta.refSampleDuration = Math.floor(meta.timescale * (fps_den / fps_num));

      meta.avcc = new Uint8Array(data.length);
      meta.avcc.set(data);
      track.meta = meta;
    }
  }]);

  return FLVDemuxer;
}();

exports.default = FLVDemuxer;