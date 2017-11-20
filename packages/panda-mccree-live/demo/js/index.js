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
$('#submit').click(function(){

    if(timmer) {
      clearInterval(timmer);
    }
    if(m) {

      m.destroy().then(function(){
            var videoElement = document.getElementById('videoElement');
    m = new PandaMccreeLive({},{autoReload: 30e3, debug: true, useTencentP2P: true, videoId: 'videoElement', src: $('#stream').val()});
    m.attachMediaElement(videoElement);
    m.load($('#stream').val());
    window.localStorage['flvaddress'] = $('#stream').val();
      });
    } else {
      var videoElement = document.getElementById('videoElement');
      m = new PandaMccreeLive({},{autoReload: 30e3, debug: true, useTencentP2P: true, videoId: 'videoElement', src: $('#stream').val()});
      m.attachMediaElement(videoElement);
      m.load($('#stream').val());
      window.localStorage['flvaddress'] = $('#stream').val();
    }


    // m.mediaElement.addEventListener('canplay',function(){
    //   videoElement.play();
    //   console.log('canplay');
    // });
    // m.mediaElement.addEventListener('stalled',function(){
    //   console.log('stalled');
    // });
    // m.mediaElement.addEventListener('readystatechange',function(){
    //   console.log(m.mediaElement.readyState);
    // });
    // m.mediaElement.addEventListener('suspend',function(){
    //   console.log(m.mediaElement.readyState);
    // });
    // m.on('statistics_info',function(d) {
    //   // console.log(d);
    // });
    // m.on('media_info',function(d) {
    //   console.log(d);
    // });
    // m.on('error',function(a, b) {
    //   console.warn(a);
    //   console.warn(b);
    // });

    timmer = setInterval (_checkBuffer, 1e3);
});

