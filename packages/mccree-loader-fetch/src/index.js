'use strict';
import LoaderController from 'mccree-controller-loader';

class FetchLoader {
  static isSupported() {
    return !!(self.fetch && self.ReadableStream && Uint8Array);
  }

  /**
   * @constructs
   *
   * @param {Object} configs - configs (optional) 设置（可选）。
   */
  constructor(configs) {
    this.TAG = 'Mccree-loader-fetch';
    this.type = 'loader';
    this.configs = configs || {};

    this.status = 0;
    this.error = null;
    this._reader = null;
  }

  /**
   * This function is called when loader intializing.
   * 当loader初始化的时候进行调用。
   * 
   * @param {Object} mccree - the mccree core. 麦克雷内核对象。
   */
  init(mccree) {
    this.controller = new LoaderController(this);
    this.controller.init.call(this, mccree);
  }

  /**
   * This function is to load video stream from a source address.
   * 拉取整段视频流。
   *
   * @param {String} source - the source address. 拉流地址。
   * @param {String} opt - the fetch options. fetch接口拉流属性。
   * @param {String} range - the stream range. 流片段区间。
   */
  load(source, opt, range) {
    // unload if the loader is loading data.
    // 如果loader正在获取数据，先进行unload操作。
    // Declear condition to improve preformance.
    // 声明清楚执行条件，以提高执行效率。
    if (this.loading === true) {
      this.unload();
    }

    // clear the loader buffer
    // 清空loaderbuffer。
    this.mccree.loaderBuffer.clear();
    this.loadPartail(source, {
      start: -1,
      end: -1
    }, opt);
  }

  /**
   * This function is to load video stream partially from a source address.
   * 拉取部分视频流。
   *
   * @param {String} source - the source address. 拉流地址。
   * @param {String} opt - the fetch options. fetch接口拉流属性。
   * @param {String} range - the stream range. 流片段区间。
   */
  loadPartail(source, range, opts) {
    // Declear condition to improve preformance.
    // 声明清楚执行条件，以提高执行效率。
    if (this.mccree === undefined) {
      this.logger.warn(this.TAG, 'Live is not init yet');
      return;
    }

    this.source = source;

    let params = this._getParams(range, opts);
    let fetchPromise = self.fetch(source, params);
    let that = this;
    // fetch is returns a promise in Browsers. resolve when connected or error occured.
    // fetch 返回一个Promise。当拉到流或异常时释放
    fetchPromise.then(function(response) {
      that._status = response.status;
      that.loading = true;
      return that._onFetchResponse.call(that, response);
    }).catch(this._onFetchException.bind(this));
  }

  /**
   * Unload from the current source.
   * 从当前视频源断流。
   * 
   * @return {Promise} - Resolve when disconnected. 断链时释放。
   */
  unload() {
    let that = this;
    return new Promise((resolve, reject) => {
      if (!that.loading) {
        resolve();
      }
      that.loading = false;
      that.mccree.loaderBuffer.clear();

      // declear conditions to improve proformance.
      // 声明清楚条件，有助于提高执行效率
      if (that._reader !== undefined) {
        that._reader.cancel().then(() => {
          that.loading = false;
          resolve();
        });
      } else {
        that.loading = false;
        resolve();
      }

      this.destroyResolve = resolve;
    });
  }

  /**
   * Construct fetch params.
   * 构造fetch参数。
   *
   * @param {String} opt - the fetch options. fetch接口拉流属性。
   * @param {String} range - the stream range. 流片段区间。
   */
  _getParams(range, opts) {
    let options = opts || {};
    let headers = new self.Headers();

    let params = {
      method: 'GET',
      headers: headers,
      mode: 'cors',
      cache: 'default'
    };

    // add custmor headers
    // 添加自定义头
    if (typeof this.configs.headers === 'object') {
      let configHeaders = this.configs.headers;
      for (let key in configHeaders) {
        if (configHeaders.hasOwnProperty(key)) {
          headers.append(key, configHeaders[key]);
        }
      }
    }

    if (options.cors === false) {
      params.mode = 'same-origin';
    }

    // withCredentials is disabled by default
    // withCredentials 在默认情况下不被使用。
    if (options.withCredentials) {
      params.credentials = 'include';
    }

    return params;
  }

  /**
   * Called when fetch has a response.
   * fetch返回时的回调。
   *
   * @param {Object} response - the response. 返回。
   */
  _onFetchResponse(response) {
    this.mccree.url = response.url || this.mccree.url;
    if (response.ok === true) {
      this.controller.onConnected.call(this, response);
      return this._onReader.call(this, response.body.getReader());
    } else if (response.status == 404) {
      this.controller.onNotfound.call(this, response);
    } else if (response.status == 403) {
      this.controller.onForbidden.call(this, response);
    } else {
      this.controller.onUnknownError.call(this, response);
    }
  }

  /**
   * Called when catches excptions.
   * 发生异常时的回调。
   *
   * @param {Object} error - the error. 错误对象。
   */
  _onFetchException(error) {
    this.logger.error(this.TAG, this.logMsgs.UNKNOWN);
    this.observer.trigger('error', this.errorTypes.NETWORK_ERROR, error);
    return;
  }

  /**
   * The data pumper.
   * 数据泵。
   *
   * @param {Object} reader - the reader. reader对象。
   */
  _onReader(reader) {
    this._reader = reader;
    if (this.loading === false) {
      return;
    }

    let that = this;
    // reader read function returns a Promise. get data when callback and has value.done when disconnected.
    // read方法返回一个Promise. 回调中可以获取到数据。当value.done存在时，说明链接断开。
    this._reader && this._reader.read().then(function(val) {
      // IMPORTANT: declear conditions to improve proformance.
      // 重要：声明清楚条件，有助于提高执行效率
      if (that !== undefined && val.done === true) {
        that.loading = false;
        that.logger.debug(that.TAG, 'Loading Finished');
        if(that.destroyResolve !== undefined) {
          that.destroyResolve();
          that.destroyResolve = undefined;
        } else {
          that.observer.trigger('error', that.errorTypes.NETWORK_ERROR, that.errorDetails.NOT_FOUND);
        }
        
        return;
      }

      that.mccree.loaderBuffer.push(val.value);
      that.observer.trigger(that.events.FRAG_LOADED, val.value.byteLength);
      return that._onReader(reader);
    }).catch(function(error) {
      that.observer.trigger('error', that.errorTypes.NETWORK_ERROR, error.message);
    });
  }
}

export default FetchLoader;
