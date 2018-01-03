'use strict';

import Mccree from 'mccree-core';
import FetchLoader from 'mccree-loader-fetch';
import MozLoader from 'mccree-loader-moz-xhr';
import TcLoader from 'mccree-loader-tencentp2p';
import MSEController from 'mccree-plugin-mse';
import Browser from 'mccree-helper-browser';
import Demux from 'mccree-demuxer-flv';
import Remux from 'mccree-remuxer-mp4live';
export class PandaMccreeLive extends Mccree {
  constructor(modules, config) {
    let browser = Browser.uaMatch(navigator.userAgent);
    let loader = null;
    if (browser.mozilla) {
      loader = new MozLoader();
    } else {
      loader = new FetchLoader();
    }
    let demuxer = new Demux();
    let remuxer = new Remux();

    config = config || {};
    if (!config.autoReload) {
      config.autoReload = 6e3;
    }
    config.loaderBufferLimit = config.loaderBufferLimit || 5e7;
    let logger = null;
    if (modules.logger) {
      logger = modules.logger;
    }
    super({
      logger: logger,
      loader: loader,
      demux: demuxer,
      remux: remuxer
    }, config);
    this.logger.debug('PandaMccreeLive', 'mccree', '正在启动播放装置。');
    this.initStatistic();
    this.version = '1.1.0-0';
    this.mseController = new MSEController();
    this.mseController.init(this);
    this.on = this.observer.on;
  }

  // 抹平flvjs接口，并不能用
  isSupport() {
    return true;
  }

  checkState() {
    if (this.reloading) {
      return;
    }
    this.mseController.checkState();
  }

  clearBuffer() {
    this.mseController.clearBuffer();
  }

  load(url) {
    this.logger.log(this.TAG, `loadurl ${url}`);
    this.originUrl = url;
    this.loader.load(url);
  }

  play() {
    this.mediaElement.play();
  }

  destroy() {
    let that = this;
    this.logger.debug(that.TAG, 'destroy', '正在销毁播放装置。');
    this.off();
    let promise = new Promise((resolve, reject) => {
      clearInterval(that.statisticTimmer);
      that.statisticTimmer = null;
      that.unload().then(res => {
        if (!this.mediaSource || !this.asourceBuffer || !this.vsourceBuffer) {
          resolve('already destroyed');
          return;
        }

        that.mseController.destroy();
        that.detachMedia();
        this.media = null;
        that.cdnip = null;
        that.loader = null;
        that.remux = null;
        that.demux = null;
        that.logger.debug(that.TAG, 'unload', '正在播放装置完全解除。');
        resolve('destroyed');
      }).catch(err => {
        resolve('destroyed');
      });
    });
    return promise;
  }

  pause() {
    this.mseController.pause();
  }

  reload() {
    let tempurl = this.originUrl;
    let that = this;
    return new Promise((resolve, reject) => {
      that.reloading = true;
      that.loader.unload().then(res => {
        that.observer.trigger('error', this.events.errorTypes.NETWORK_ERROR, {});
        that.observer.off('FRAME_DROPPED');
        that.media.tracks = {};
        that.remuxBuffer = {
          audio: [],
          video: []
        };
        that.loaderBuffer.clear();
        that.demux.reset();
        that.remux.destroy();
        that.mseController.destroy();
        resolve();
      }).catch(err => {
        that.reloading = false;
        resolve();
      });
    });

  }

  getMediaElement() {
    return this.mseController.mediaElement;
  }

  initStatistic() {
    this.loadbytes = 0;
    this.droppedFrames = 0;
    this.decodedFrames = 0;
    let that = this;
    this.observer.on(this.events.events.FRAG_LOADED, function(bytes) {
      that.loadbytes += bytes;
    });

    this.observer.on('MEDIA_SEGMENT_REMUXED', function(num) {
      if (num) {
        that.decodedFrames += num;
      }
    });
    this.observer.on('FRAME_DROPPED', function(num) {
      if (num) {
        that.droppedFrames += num;
      }
    });
    this.statisticTimmer = setInterval(this._onStatistic.bind(this), 1e3);
  }

  _onStatistic() {
    try {
      if (this.statisticTimmer) {
        this.observer.trigger('statistics_info', {
          droppedFrames: this.droppedFrames,
          decodedFrames: this.decodedFrames + this.droppedFrames,
          speed: Math.floor(this.loadbytes / 1e3)
        });
        this.loadbytes = 0;
      }
    } catch (e) {}
  }

  attachMediaElement(mediaElement) {
    if (!mediaElement) {
      return;
    }
    this.mseController.attachMediaElement(mediaElement);
  }

  recordStartTime() {
    if (!this.startTime) {
      this.startTime = new Date().getTime();
    }
  }
  detachMediaElement() {
    this.mseController.detachMediaElement();
  }
}

export default PandaMccreeLive;
