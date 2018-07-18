import MP4 from './mp4-generator';
import Browser from 'mccree-helper-browser';
// Fragmented mp4 remuxer
class MP4Remuxer {
  constructor(config) {
    this.TAG = 'Mccree-remuxer-mp4live:index';

    this.type = 'remuxer';

    this._config = config || {};
    this._isLive = this._config.isLive;

    this._dtsBase = 0;
    this._dtsBaseInited = false;
    this._audioDtsBase = Infinity;
    this._videoDtsBase = Infinity;
    this._audioNextDts = undefined;
    this._videoNextDts = undefined;

    this._audioMeta = null;
    this._videoMeta = null;
    this._browser = Browser.uaMatch();
  }

  init(mccree) {
    this.mccree = mccree;
    this.logger = mccree.logger;
    this.observer = mccree.observer;
    this.events = mccree.events;
    this.onMediaSegment = mccree.onMediaSegment;
    this.mccree.initSegment = {};
    this.mccree.remuxBuffer = {
      audio: [],
      video: []
    };
  }
  
  remux() {
    this.observer.on('METADATA_PARSED', this._generateInitailSegment.bind(this));
    this.observer.on('VIDEODATA_PARSED',this.timmerCallback.bind(this));
  }

  destroy() {
    this._dtsBase = 0;
    this._dtsBaseInited = false;
    this._audioDtsBase = Infinity;
    this._videoDtsBase = Infinity;
    this._audioNextDts = undefined;
    this._videoNextDts = undefined;

    this._audioMeta = null;
    this._videoMeta = null;
  }

  timmerCallback() {
    this.mccree.media.tracks.videoTrack && this.mccree.media.tracks.audioTrack && this._generateBoxes();
  }

  _generateInitailSegment() {
    MP4.init();
    this._fixRatio();
    let audioTrack = this.mccree.media.tracks.audioTrack,
      videoTrack = this.mccree.media.tracks.videoTrack;
    audioTrack.isAAC = (audioTrack.format === 10);
    this._generateConfig();
    // 视频处理
    if (videoTrack.meta) {
      let vmovie = MP4.initSegment([videoTrack]);
      this.mccree.initSegment.video = vmovie;
      let amovie = MP4.initSegment([audioTrack]);
      this.mccree.initSegment.audio = amovie;
      this.observer.trigger('INIT_SEGMENT_REMUXED');
      this._generateBoxes();
    }
  }

  _fixRatio() {
    // SPS 错误兼容 / SPS宽高信息错误。转成16:9
    var mediaInfo = this.mccree.media.mediaInfo || {},
      videoTrack = this.mccree.media.tracks.videoTrack || {},
      meta = videoTrack.meta || {},
      height = meta.codecHeight,
      width = meta.codecWidth;

    if(mediaInfo.width === meta.codecWidth && mediaInfo.height === meta.codecHeight) {
        return;
    } 
    if(meta.height !== meta.width * 9 / 16) {
      width = mediaInfo.width ? mediaInfo.width : parseInt(meta.height * 16 / 9);
      height = mediaInfo.height ? mediaInfo.height : parseInt(meta.width * 9 / 16);
      meta.codecHeight = height;
      meta.codecWidth = width;
      meta.presentHeight = height;
      meta.presentWidth = width;
    }
  }

  _generateConfig() {
    let audioTrack = this.mccree.media.tracks.audioTrack,
      meta = audioTrack.meta;
    let config = [],
      audioObjectType = audioTrack.objectType,
      samplingIndex = meta.sampleRateIndex,
      extensionSamplingIndex,
      channelConfig = meta.channelCount;
    let userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('firefox') !== -1) {
      if (samplingIndex >= 6) {
        audioObjectType = 5;
        extensionSamplingIndex = samplingIndex - 3;
      } else {
        audioObjectType = 2;
        config = new Array(2);
        extensionSamplingIndex = samplingIndex;
      }
    } else if (userAgent.indexOf('android') !== -1) {
      audioObjectType = 2;
      extensionSamplingIndex = samplingIndex;
    } else {
      audioObjectType = 5;
      extensionSamplingIndex = samplingIndex;
      if (samplingIndex >= 6) {
        extensionSamplingIndex = samplingIndex - 3;
      } else if (channelConfig === 1) {
        audioObjectType = 2;
        extensionSamplingIndex = samplingIndex;
      }
    }
    config[0] = audioObjectType << 3;
    config[0] |= (samplingIndex & 0x0F) >>> 1;
    config[1] = (samplingIndex & 0x0F) << 7;
    config[1] |= (channelConfig & 0x0F) << 3;
    if (audioObjectType === 5) {
      config[1] |= (samplingIndex & 0x0F) >>> 1;
      config[2] = (samplingIndex & 0x01) << 7;
      config[2] |= 2 << 2;
      config[3] = 0;
    }
    meta.config = config;
    meta.codec = 'mp4a.40.' + audioObjectType;
  }

  _generateBoxes() {
    let videoTrack = this.mccree.media.tracks.videoTrack,
      audioTrack = this.mccree.media.tracks.audioTrack,
      nextIframe = -1,
      gop = null,
      nextDts = -1;

    let i = 0;

    if (!this._dtsBaseInited && videoTrack.samples.length > 1 && audioTrack.samples.length > 1) {
      this._calculateDtsBase(audioTrack, videoTrack);
    }

    if (!videoTrack.meta || !audioTrack.meta) {
      return;
    }


    if (videoTrack.samples.length < 15) {
      return;
    }

    let lastPts = videoTrack.samples[0].timestamp + videoTrack.samples[0].compositionTime;
    let index = 0;
    nextIframe = 10;

    if (nextIframe < 1) {
      return;
    }

    if (videoTrack.samples.length <= nextIframe + 1) {
      return;
    }

    let audioLengthLimit = Math.ceil((nextIframe + 1) * videoTrack.meta.refSampleDuration / audioTrack.meta.refSampleDuration) + 1;

    if (audioTrack.samples.length <= audioLengthLimit || audioTrack.samples.length < nextIframe) {
      return;
    }

    if (videoTrack.samples.length > nextIframe) {
      nextDts = videoTrack.samples[nextIframe].timestamp;
      gop = videoTrack.samples.splice(0, nextIframe);
    }

    if (gop) {
      if ((this._browser.chrome && this._browser.versionNumber <= 50) || this._browser.mozilla) {
        gop[0].frameType = 1;
      }
      this._generateGop(gop, gop[0].timestamp, nextDts);
      this._generateBoxes();
    } 
  }

  _generateGop(gop, baseDts, nextDts) {
    let base = baseDts,
      next = baseDts;
    let videoTrack = this.mccree.media.tracks.videoTrack,
      sampleDuration = videoTrack.meta.refSampleDuration;
    let sampleSize = 0;
    let mp4Samples = [];
    // 数据处理
    for (let i = 0; i < gop.length; i++) {
      sampleSize += gop[i].data.length;
    }
    let bytes = 8 + sampleSize;
    let mdatbox = new Uint8Array(bytes);
    mdatbox[0] = bytes >>> 24 & 0xFF;
    mdatbox[1] = bytes >>> 16 & 0xFF;
    mdatbox[2] = bytes >>> 8 & 0xFF;
    mdatbox[3] = bytes & 0xFF;
    mdatbox.set(MP4.types.mdat, 4);
    let offset = 8;
    // metadata处理
    for (let i = 0; i < gop.length; i++) {
      let frame = gop[i];
      if (gop[i + 1]) {
        next = gop[i + 1].timestamp;
        sampleDuration = next - base;
        base = next;
      } else {
        next = nextDts;
        sampleDuration = next - base;
        base = next;
      }

      // 掉帧检测 音频抽帧
      if (sampleDuration > videoTrack.meta.refSampleDuration + 1) {
        this.observer.trigger('FRAME_DROPPED', Math.floor(sampleDuration / videoTrack.meta.refSampleDuration));
        this.logger.warn(this.TAG, this.type, 'Video jump frame to '+ base);
      }

      this.mccree.media.videoDuration += sampleDuration;
      let mp4Sample = {
        dts: frame.timestamp - this._dtsBase,
        pts: frame.compositionTime + frame.timestamp - this._dtsBase,
        cts: frame.compositionTime,
        size: frame.data.length,
        isKeyframe: (frame.frameType === 1),
        duration: sampleDuration + 1,
        originalDts: base,
        flags: {
          isLeading: 0,
          dependsOn: (frame.frameType === 1) ? 2 : 1,
          isDependedOn: (frame.frameType === 1) ? 1 : 0,
          hasRedundancy: 0,
          isNonSync: (frame.frameType === 1) ? 0 : 1
        }
      };
      mdatbox.set(frame.data, offset);
      offset += frame.data.length;
      mp4Samples.push(mp4Sample);
      this.mccree.remuxBuffer.lastDts = mp4Sample.dts;
    }
    let track = {
      id: videoTrack.id,
      samples: mp4Samples,
    };
    videoTrack.sequenceNumber++;
    let moofbox = MP4.moof(videoTrack.sequenceNumber, baseDts - this._dtsBase, track);
    this.mccree.remuxBuffer.video.push({
      type: 'video',
      seekable: mp4Samples[0].isKeyframe,
      timestamp: mp4Samples[0].dts,
      data: this._mergeBoxes(moofbox, mdatbox)
    });
    this.observer.trigger('MEDIA_SEGMENT_REMUXED', gop.length);
    this._remuxAudio(baseDts, nextDts);
  }

  _remuxAudio(baseDts, nextDts) {
    let base = baseDts,
      next = baseDts;
    let videoTrack = this.mccree.media.tracks.videoTrack;
    let audioTrack = this.mccree.media.tracks.audioTrack,
      sampleDuration = audioTrack.meta.refSampleDuration,
      audioSamples = audioTrack.samples;
    let sampleSize = 0;
    let mp4data = [],
      mp4Samples = [];
    // 如果音视频总时长差出一个音频片段长度，则该音频片段废弃。
    while (audioSamples[0] && (audioSamples[0].timestamp + sampleDuration < baseDts)) {
      this.logger.warn(this.TAG, 'Audio chase frame to ' + audioSamples[0].timestamp);
      audioSamples.shift();
    }

    baseDts = audioSamples[0].timestamp;
    let audioSample = audioSamples[0];
    let tep = audioSamples[0].timestamp;
    while (audioSamples.length > 0
      && audioSamples[0].timestamp <= nextDts // 音频片段起始时间小于下一个gop的时间
    ) {

      audioSample = audioSamples.shift();

      if (audioSamples[0]) {
        base = audioSample.timestamp;
        next = audioSamples[0].timestamp;
      } else {
        base = audioSample.timestamp;
        next = audioSample.timestamp + sampleDuration;
      }

      audioSample.sampleDuration = next - base;

      this.mccree.media.audioDuration += audioSample.sampleDuration;
      let mp4Sample = {
        dts: audioSample.timestamp - this._dtsBase,
        pts: audioSample.timestamp - this._dtsBase,
        cts: 0,
        size: audioSample.data.length,
        duration: audioSample.sampleDuration,
        originalDts: base - this._dtsBase,
        flags: {
          isLeading: 0,
          dependsOn: 1,
          isDependedOn: 0,
          hasRedundancy: 0
        }
      };
      mp4Samples.push(mp4Sample);
      sampleSize += audioSample.data.length;
      mp4data.push(audioSample.data);
    }

    while (this.mccree.media.videoDuration - this.mccree.media.audioDuration > audioTrack.meta.refSampleDuration + 1) {
      this.logger.debug(this.TAG, 'Audio fill the frame of ' + base + ' 补偿时间点：' + next);
      base = next;
      next = base + audioSample.sampleDuration;
      let mp4Sample = {
        dts: base - this._dtsBase,
        pts: base - this._dtsBase,
        cts: 0,
        size: audioSample.data.length,
        duration: audioSample.sampleDuration,
        originalDts: base - this._dtsBase,
        flags: {
          isLeading: 0,
          dependsOn: 1,
          isDependedOn: 0,
          hasRedundancy: 0
        }
      };
      this.mccree.media.audioDuration += audioSample.sampleDuration;
      mp4Samples.push(mp4Sample);
      sampleSize += audioSample.data.length;
      mp4data.push(audioSample.data);
    }

    let bytes = sampleSize + 8;
    let offset = 8;
    let mdatbox = new Uint8Array(bytes);
    mdatbox[0] = bytes >>> 24 & 0xFF;
    mdatbox[1] = bytes >>> 16 & 0xFF;
    mdatbox[2] = bytes >>> 8 & 0xFF;
    mdatbox[3] = bytes & 0xFF;
    mdatbox.set(MP4.types.mdat, 4);
    for (let i = 0; i < mp4data.length; i++) {
      mdatbox.set(mp4data[i], offset);
      offset += mp4data[i].length;
    }
    let track = {
      id: audioTrack.id,
      samples: mp4Samples,
    };

    audioTrack.sequenceNumber++;
    let moofbox = MP4.moof(audioTrack.sequenceNumber, baseDts - this._dtsBase, track);
    this.mccree.remuxBuffer.audio.push({
      type: 'audio',
      data: this._mergeBoxes(moofbox, mdatbox)
    });
  }

  _calculateDtsBase(audioTrack, videoTrack) {
    if (this._dtsBaseInited) {
      return;
    }

    if (audioTrack.samples && audioTrack.samples.length) {
      this._audioDtsBase = audioTrack.samples[0].timestamp;
    }
    if (videoTrack.samples && videoTrack.samples.length) {
      this._videoDtsBase = videoTrack.samples[0].timestamp;
    }

    this._dtsBase = Math.min(this._audioDtsBase, this._videoDtsBase);
    this._dtsBaseInited = true;
  }

  _mergeBoxes(moof, mdat) {
    let result = new Uint8Array(moof.byteLength + mdat.byteLength);
    result.set(moof, 0);
    result.set(mdat, moof.byteLength);
    return result;
  }
}

export default MP4Remuxer;