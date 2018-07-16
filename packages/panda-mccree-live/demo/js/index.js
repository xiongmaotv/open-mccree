'use strict';
var m = null;
var timmer = null;
function _checkBuffer () {
  if(m && m.loaderBuffer) {
    $('.loaderBuffer .inner').css('width', (m.loaderBuffer.length / 2e3) + '%');
    $('.loaderBuffer .inner').text(m.loaderBuffer.length);
  }

  if(m && m.media && m.media.tracks && m.media.tracks.audioTrack && m.media.tracks.audioTrack && m.media.tracks.audioTrack.samples.length) {
    $('.daBuffer .inner').css('width', m.media.tracks.audioTrack.samples.length + '%');
    $('.daBuffer .inner').text(m.media.tracks.audioTrack.samples.length);
  }

  if(m && m.media && m.media.tracks && m.media.tracks.videoTrack && m.media.tracks.videoTrack && m.media.tracks.videoTrack.samples.length) {
    $('.dvBuffer .inner').css('width', m.media.tracks.videoTrack.samples.length + '%');
    $('.dvBuffer .inner').text(m.media.tracks.videoTrack.samples.length);
  }

  if(m && m.remuxBuffer && m.remuxBuffer.audio) {
    $('.raBuffer .inner').css('width', m.remuxBuffer.audio.length + '%');
    $('.raBuffer .inner').text( m.remuxBuffer.audio.length);
  }

  if(m && m.remuxBuffer && m.remuxBuffer.video) {
    $('.rvBuffer .inner').css('width',  m.remuxBuffer.video.length + '%');
    $('.rvBuffer .inner').text(m.remuxBuffer.video.length);
  }
}
$('#stream').val(window.localStorage['flvaddress']);

var logMsg = {
  //debug information when the live is initialized
  INIT_LIVE: '直播装置启动',
  
  //error infromation when the the mccree-core is not initialized 
  NOT_INITED: '核心组件加载失败',
  
  //debug information when the observer is initialized
  INIT_OBSERVER: '观察者号启动',
  
  //debug information when the customer logger is initialized
  INIT_LOGGER_CUSTOM: '客户版日志号启动',
  
  //debug information when the customer logger is initialized
  INIT_LOGGER_INTERNAL: '内部版日志号启动',
  
  //debug information when the loader is initialized
  INIT_LOADER: 'fetch load号启动',

  //debug information when the demuxer is initialized
  INIT_DEMUXER: 'demux号启动',

  //debug information when the remuxer is initialized
  INIT_REMUXER: 'remux号启动',
  
  //debug information when connectting to the net source
  CONNECTED_INFO: '连接资源',

  //debug information when the mccree-core is destroyed
  CORE_DESTROY: '核心组件销毁',
  
  //debug information when unloading the mccree-core
  CORE_UNLOADING: '核心组件退出',
  
  //debug information when finishing the load
  LOAD_FINISHED: '组件加载成功',  

  //debug information when the metadata is changed
  METADATA_CHANGED: '数据切换',
  
  //debug information when clearing the cache
  CLEAR_CACHE: "正在清洗能量槽",
  
  //debug information when clearing the live
  LIVE_CLEAR: '直播已清除',
  
  //debug inormation when the live is destoyed
  LIVE_DESTROY: '直播已销毁',
    
  //debug information when clearing the buffer(in fetch)
  BUFFER_CLEAR: '正在清洗Demux号能量槽',
  
  //error information when a tag length error occurs
  TAG_LENGTH_ERROR: 'Tag length(error):',
    
  //error information when the loader is not initialized
  INIT_LOADER_FAIL: 'fetch load号启动失败',
  
  //error information when the demuxer is not initialized
  INIT_DEMUXER_FAILED:'Demuxer号启动失败',
  
  //error information when a fregment error occurs
  FREGMENT_ERROR: 'fregment error',
    
  //error information when the net source can not be found
  NOT_FOUND: '啊咧咧，资源找不到了',
  
  //error information when the connect is forbidden
  FORBIDDEN_ERROR: '啊咧咧，资源遗弃了',
  
  //error information when an unknown error occurs
  UNKNOWN_ERROR: '未知错误，呜呜呜',

  //error information when the remuxer is not initialized
  INIT_REMUXER_FAILED: 'Remuxer号启动失败',
  
  //error information when a cache error occurs
  CACHE_ERROR: '能量槽爆炸惹',
  
  // Error information when the element.readyState is not closed when initialization.
  ELEMENT_UNDESTROYED: '啊咧咧，video标签好像状态不对啊',
  
  // Error information when SourceUrl is not be pushed into element well.
  SOURCE_URL_ERROR: '啊咧咧，资源放不进飞船'
};

$('#submit').click(function(){
    if(timmer) {
      clearInterval(timmer);
    }
    if(m) {
      m.destroy().then(function(){
      var videoElement = document.getElementById('videoElement');
      //var videoElement = document.getElementById('audioElement');
      m = new PandaMccreeLive({},{useHEVC:false, autoReload:60e3, debug: true, usep2p: false, videoId: 'videoElement', canvasid: 'canvas1', src: $('#stream').val(),logMsg:logMsg});
      m.attachMediaElement(videoElement);
      m.load($('#stream').val());
      window.localStorage['flvaddress'] = $('#stream').val();
      });
    } else {
      var videoElement = document.getElementById('videoElement');
      //var videoElement = document.getElementById('audioElement');
      m = new PandaMccreeLive({},{useHEVC:false, autoReload:60e3, debug: true, usep2p: false, videoId: 'videoElement', canvasid: 'canvas1', src: $('#stream').val(),logMsg:logMsg});
      m.attachMediaElement(videoElement);
      m.load($('#stream').val());
      window.localStorage['flvaddress'] = $('#stream').val();
    }

    m.on('error', function(a){console.log(a);})
    timmer = setInterval (_checkBuffer, 1e3);
});