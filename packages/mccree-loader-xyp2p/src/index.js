/*
 * Copyright (C) 2017 Shenzhen Onething Technologies Co., Ltd. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import LoaderController from 'mccree-controller-loader';
class XYVPLoader {
  static isSupported() {
    return !!window.xyvp;
  }

  constructor(config) {
    this.TAG = 'XYVPLoader';
    this.type = 'loader';
    this.config = config || {};
    this.xyLive = null;
  }

  init(mccree) {
    this.mccree = mccree;
    this.controller = new LoaderController(this);
    this.controller.init.call(this, mccree);
    this.events.XY_ERROR = window.xyvp.XYLiveEvent.ERROR;
    this.events.FLV_DATA = window.xyvp.XYLiveEvent.FLV_DATA;
  }

  load(source, opt, range) {
    let that = this;
    this.xyLive = new window.xyvp.XYLive({url:source,
      video:this.mccree.getMediaElement()
    });
    this.xyLive.open();
    this.xyLive.on(this.events.FLV_DATA, function(data) {
      that.mccree.loaderBuffer.push(new Uint8Array(data));
      that.observer.trigger(that.events.FRAG_LOADED, data.byteLength);
    });
    this.xyLive.on(that.events.XY_ERROR, function(data) {
      this.observer.trigger('error', 'p2p_rollback', data);
    });
  }

  unload() {
    let that = this;
    return new Promise(function(resolve,reject) {
      that.xyLive.close();
      that.observer.trigger('error', that.errorTypes.NETWORK_ERROR, 'unload');
      resolve();
    });
  }

  destory() {
    this.xyLive.close();
  }
}

export default XYVPLoader;