'use strict';

/**
 * This class is to provide a controller for loaders.
 */
class LoaderController {
  /**
   * @constructs
   */
  constructor(loader) {
    this.loader = loader;
    this.loader.loading = false;
    this.loader.connected = false;

    this.loader.source = null;
    this.loader.responseUrl = null;
    this.loader.cdnip = null;
  }

  /**
   * This function is called when loader intializing, must bind(this).
   * 当loader初始化的时候进行调用。必须将this指向绑定。
   * 
   * @param {Object} mccree - the mccree core.
   */
  init (mccree) {
    this.mccree = mccree;
    this.logger = mccree.logger;
    this.observer = mccree.observer;
    this.events = mccree.events.events;
    this.errorTypes = mccree.events.errorTypes;
    this.errorDetails = mccree.events.errorDetails;
    this.logMsgs = mccree.events.logMsgs;
  }
  
  /**
   * This function is called when connected.
   */
  onConnected() {
    if(!this.connected) {
      this.logger.debug(this.TAG, this.type, this.logMsgs.CONNECTED);
    }
    this.connected = true;
  }

  /**
   * This function is called when data loaded.
   *
   * @param {data} the server response.
   */
  onLoadData(data) {
    this.connected = true;
    this.loading = true;
    this.observer.trigger(this.events.FRAG_LOADED, data);
  }

  /**
   * This function is called when the resource is not found.
   *
   * @param {response} the server response.
   */
  onNotfound(response) {
    this.connected = false;
    this.loading = false;
    this.logger.debug(this.TAG, this.type, this.logMsgs.NOT_FOUND);
    this.observer.trigger('error', this.errorTypes.NETWORK_ERROR, this.errorDetails.NOTFOUND, response);
  }

  /**
   * This function is called when return forbidden.
   *
   * @param {response} the server response.
   */
  onForbidden(response) {
    this.connected = false;
    this.loading = false;
    this.logger.debug(this.TAG, this.type, this.logMsgs.FORBIDDEN);
    this.observer.trigger('error', this.errorTypes.NETWORK_ERROR, this.errorDetails.NOTFOUND, response);
  }
  /**
   * This function is called when can not conneced.
   *
   * @param {response} the server response.
   */
  onUnknownError(response) {
    this.connected = false;
    this.loading = false;
    this.logger.debug(this.loader.TAG, this.loader.type, this.logMsgs.NOT_FOUND);
    this.observer.trigger('error', this.errorTypes.NETWORK_ERROR, this.errorDetails.NOTFOUND, response);
  }
}

export default LoaderController;
