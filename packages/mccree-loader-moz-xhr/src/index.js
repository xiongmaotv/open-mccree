import LoaderController from 'mccree-controller-loader';

class MozXhrLoader {
  static isSupported() {}

  constructor(config) {
    this.TAG = 'MozXhrLoader';
    this.type = 'loader';
    this.config = config || {};
  }

  init(mccree) {
    this.controller = new LoaderController(this);
    this.controller.init.call(this, mccree);
  }

  load(source, opt) {
    this._cleanLoaderBuffer();
    this.loadPartail(source, {
      start: -1,
      end: -1
    }, opt);
  }

  loadPartail(source, range, opts) {
    if (!this.mccree) {
      this.logger.debug(this.TAG, 'Uninitailized', 'this module is not init yet');
      return;
    }

    this.source = source;
    this._loading = false;

    this.xhr = new XMLHttpRequest();
    let that = this;
    this.xhr.open("get", source, true);
    this.xhr.responseType = 'moz-chunked-arraybuffer';
    this.xhr.onreadystatechange = e => {
      if(this.status === 200) {
        that.controller.onConnected.call(that, e);
      } else if(this.status === 404){
        that.controller.onNotfound.call(that, e);
      }
    };
    this.xhr.onprogress = e => {
      that.mccree.url = this.xhr.response.url || that.mccree.url;
      let chunk = e.target.response;
      that.mccree.loaderBuffer.push(new Uint8Array(chunk));
      that.observer.trigger(that.events.FRAG_LOADED, chunk.byteLength);
    };
    this.xhr.send();
  }

  unload() {
    let that = this;
    return new Promise((resolve, reject) => {
      that._loading = false;
      that._cleanLoaderBuffer();
      this.xhr.onprogress = null;
      this.xhr.abort();
      resolve();
    });
  }

  _cleanLoaderBuffer() {
    this.mccree.loaderBuffer.clear();
  }
}
window.MozXhrLoader = MozXhrLoader;
export default MozXhrLoader;