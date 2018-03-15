'use strict';
import Logger from 'mccree-helper-logger';

import EventEmitter from 'events';

import Media from './media.js';

import events from './events.js';

import LoaderBuffer from 'mccree-core-loaderbuffer';

import Utils from 'mccree-helper-utils';

/**
 * The main class to create an decoder.
 */
class Mccree {
  /**
   * The constructor.
   */
  constructor(modules, config, plugins) {
    if(!modules) {
      modules = {};
    }

    this.TAG = 'Mccree-core';
    
    this.config = config ? config : {};
    
    this.debug = config && config.debug || false;
    
    this.plugins = plugins || [];

    this.url = null;
    
    this.time = 0;

    this.events = events;
    
    this.logMsgs = events.logMsgs;

    Object.assign(this.logMsgs, this.config.logMessages || {});

    this._initLogger(modules.logger);

    this.initObserver();

    // Use default when options do not defined.
    this.loaderBuffer = new LoaderBuffer();
    this.remuxBuffer = {};
    this.initSegment = {};

    this._createModules(modules);
    this._initModules();

    let media = new Media();

    this.attachMedia(media);    
  }

 /**
   * The function to destroy mccree.
   */
  destroy() {
    // Destroy timer
    clearInterval(this.timmer);
    this.timmer = null;
    return this.unload().then(res => {
      this.observer = null;
      this.detachMedia();
      this.media = null;
      this.logger.debug(this.TAG, this.logMsgs.DESTROY);
    });
  }

  /**
   * Use to attach the media profile.
   */
  attachMedia(media) {
    this.detachMedia();
    this.media = media;
  }

  /** 
   * Use to detach the Media.
   */
  detachMedia() {
    this.media = null;
  }

  /**
   * Use to attach media element.
   */
  attachMediaElement(media) {
    this.detachMedia();
    this.mediaElement = media;
  }

  /** 
   * Use to detach  the Media Element.
   */
  detachMediaElement() {
    this.mediaElement = null;
  }
  /** 
   * Load the resource.
   *
   * @param {string} url - The resource url.
   */
  load(url) {
    this.logger.inf(this.TAG, `loadurl ${url}`);
    this.originUrl = url;
    this.loader.load(url);
  }

  /**
   * Unload the resource.
   */
  unload() {
    return new Promise((resolve, reject) => {
      if(this.loader) {
        this.logger.debug(this.TAG, this.logMsgs.UNLOADING);
        this.loader.unload().then(res => {
          resolve();
        }).catch(res => {
          reject(res);
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Initialize the logger for mccree.
   * 
   * @param {object} logger - The js object which has required functions for recording logs.
   */
  _initLogger(logger) {
    // init the logger;
    if (logger && Logger.isValid(logger)) {
      this.logger = new Logger(logger, false, this.debug);
      this.logger.debug(this.TAG, this.logMsgs.INIT_LOGGER_CUSTOM);
    } else {
      this.logger = new Logger(null, false, this.debug);
      this.logger.debug(this.TAG, this.logMsgs.INIT_LOGGER_INTERNAL);
    }
  }

  /**
   * Initialize the eventemitter for the mccree.
   */
  initObserver() {
    // init eventEmitter;
    var that = this;
    this.observer = new EventEmitter();

    this.observer.trigger = function trigger(event, ...data) {
      if(event !== 'error') {
        that.observer.emit(event, ...data);
      } else {
        that.observer.emit('internalError', ...data);
      }
    };

    this.observer.on = function on(event, listener) {
      if(event !== 'error') {
        that.observer.addListener(event, listener);
      } else {
        that.observer.addListener('internalError', listener);
      }
    };

    this.observer.off = function off(event, cb) {
      if(!cb) {
        cb = () => {};
      }
      if(!event){
        that.observer.removeAllListeners();
        cb();
      } else if(event !== 'error') {
        that.observer.removeListener(event, cb);
      } else {
        that.observer.removeListener('internalError', cb);
      }
    };

    this.logger.debug(this.TAG, this.logMsgs.INIT_OBSERVER);

    this.on = this.observer.on.bind(this.observer);
    this.off = this.observer.off.bind(this.observer);
    this.trigger = this.observer.trigger.bind(this.observer);
  }

  /**
   * Load and check the loader, demux and remux modules for mccree.
   *
   * @params {Object} modules - The js object contains loader, demux and remux objects.
   */
  _createModules(modules) {
    if (modules.loader) {
      this.loader = modules.loader;
      this.logger.debug(this.TAG, this.logMsgs.INIT_LOADER);
    } else {
      this.logger.error(this.TAG, this.logMsgs.INIT_LOADER_FAIL);
    }

    if (modules.demux) {
      this.demux = modules.demux;
      this.logger.debug(this.TAG, this.logMsgs.INIT_DEMUXER);
    } else {
      this.logger.error(this.TAG, this.logMsgs.INIT_DEMUXER_FAILED);
    }

    if (modules.remux) {
      this.remux = modules.remux;
      this.logger.debug(this.TAG, this.logMsgs.INIT_REMUXER);
    } else {
      this.logger.error(this.TAG, this.logMsgs.INIT_REMUXER_FAILED);
    }
  }

  /**
   * Call the init functions of loader, demux, remux.
   */
  _initModules() {
    this.loader && this.loader.init(this);
    this.demux && this.demux.init(this);
    this.remux && this.remux.init(this);
  }
}

export default Mccree;