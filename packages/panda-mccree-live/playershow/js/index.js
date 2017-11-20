// 一些固定直播间。主要是放映厅类的.可以加一些经常出问题的房间，和大型活动房间
var roomlist = [17273, 253877, 489382, 264144, 959893, 54091, 401901, 1468569, 556105, 1405302, 13745, 1272265];
var roomnum = 0;
var m = null;
var timmer = null;
analyser();

$('#changeroombtn').click(function() {
    var roomid = parseInt($('#changerm').val());
    $('#changerm').val('');
    $.get('https://www.panda.tv/api_room_v2?roomid=' + roomid + '&_=' + (new Date().getTime()),
  init);
});
$.get('https://www.panda.tv/api_room_v2?roomid=' + roomlist[roomnum] + '&_=' + (new Date().getTime()),
  init);
var videoElement = document.getElementById('player');
videoElement.addEventListener('end', function() {
  roomnum++;
  if(roomnum >= roomlist.length) roomnum = 0;
  $.get('https://www.panda.tv/api_room_v2?roomid=' + roomlist[roomnum] + '&_=' + (new Date().getTime()),
    init);
});
function init(data) {
  var videoInfo = data.data.videoinfo;
  var roominfo = data.data.roominfo;
  var hostinfo = data.data.hostinfo;
  // 判断开播状态;
  if (parseInt(videoInfo.status) === 2) {
    var videoStreams = JSON.parse(videoInfo.plflag_list);
    var streamaddress = parseStreamAddr(videoInfo, videoStreams);
    $('.roominfo').html('<p>当前房间：' + roominfo.name + '</p><p>房间号：' + roominfo.id + '&nbsp;主播：' + hostinfo.name + '</p>');
    playstream(streamaddress);
    // 15分钟换房间
    setTimeout(function() {
      roomnum++;
      if(roomnum >= roomlist.length) roomnum = 0;
      $.get('https://www.panda.tv/api_room_v2?roomid=' + roomlist[roomnum] + '&_=' + (new Date().getTime()),
        init);
    }, 30e3);
  } else if (roomnum < roomlist.length) {
    roomnum++;
    setTimeout(function() {
      $.get('https://www.panda.tv/api_room_v2?roomid=' + roomlist[roomnum] + '&_=' + (new Date().getTime()), init);
    }, 2500);
  } else {
    roomnum = 0;
    setTimeout(function() {
      $.get('https://www.panda.tv/api_room_v2?roomid=' + roomlist[roomnum] + '&_=' + (new Date().getTime()), init);
    }, 2500);
  }
}

function parseStreamAddr(videoInfo, videoStreams) {
  var plflag = videoStreams.main.match(/(\d+)_(\d+)/)[2];
  var roomkey = videoInfo.room_key;
  var ts = videoStreams.auth.time;
  var sign = videoStreams.auth.sign;
  var rid = videoStreams.auth.rid;
  return `https://pl${plflag}.live.panda.tv/live_panda/${roomkey}.flv?sign=${sign}&ts=${ts}&rid=${rid}`;
}

function playstream(addr) {
  if (m) {
    m.destroy().then(function() {
      m = new PandaMccreeLive({}, {
        debug: true,
        useTencentP2P: false,
        videoId: 'player',
      });
      m.attachMediaElement(videoElement);
      m.load(addr);
      m.on('statistics_info', function(data) {
        var str = '';
        $.each(m.media.mediaInfo, function(index, value) {
          str += `<p>${index}:${value}</p>`
        })
        $.each(data, function(index, value) {
          str += `<p>${index}:${value}</p>`
        });
        $('.stat').html(str);
      });
    });
  } else {
    m = new PandaMccreeLive({}, {
      debug: true,
      useTencentP2P: false,
    });
    m.attachMediaElement(videoElement);
    m.load(addr);
    m.on('statistics_info', function(data) {
      var str = '';
      $.each(m.media.mediaInfo, function(index, value) {
        str += `<p>${index}:${value}</p>`
      })
      $.each(data, function(index, value) {
        str += `<p>${index}:${value}</p>`
      });
      $('.stat').html(str);
    })
  }
}

function analyser() {
  var videoElement = document.getElementById('player');
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var source = audioCtx.createMediaElementSource(videoElement);
  // 创建分析器
  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = 64;
  var bufferLength = analyser.fftSize;
  var dataArray1 = new Uint8Array(bufferLength);
  var dataArray2 = new Uint8Array(bufferLength);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  setInterval(function() {
    checkBuffer();
    analyser.getByteTimeDomainData(dataArray1);
    analyser.getByteFrequencyData(dataArray2);
    eqcharts(dataArray1, dataArray2);
  }, 250);

}

function checkBuffer() {
  if (m && m.loaderBuffer) {
    $('.loaderBuffer .inner').css('width', (m.loaderBuffer.length / 2e3) + '%');
    $('.loaderBuffer .inner').text(m.loaderBuffer.length);
  }

  if (m && m.media && m.media.tracks && m.media.tracks.audioTrack && m.media.tracks.audioTrack && m.media.tracks.audioTrack.samples.length) {
    $('.daBuffer .inner').css('width', m.media.tracks.audioTrack.samples.length * 1.5 + '%');
    $('.daBuffer .inner').text(m.media.tracks.audioTrack.samples.length);
  }

  if (m && m.media && m.media.tracks && m.media.tracks.videoTrack && m.media.tracks.videoTrack && m.media.tracks.videoTrack.samples.length) {
    $('.dvBuffer .inner').css('width', m.media.tracks.videoTrack.samples.length * 1.5 + '%');
    $('.dvBuffer .inner').text(m.media.tracks.videoTrack.samples.length);
  }

  if (m && m.remuxBuffer && m.remuxBuffer.audio) {
    $('.raBuffer .inner').css('width', m.remuxBuffer.audio.length * 3 + '%');
    $('.raBuffer .inner').text(m.remuxBuffer.audio.length);
  }

  if (m && m.remuxBuffer && m.remuxBuffer.video) {
    $('.rvBuffer .inner').css('width', m.remuxBuffer.video.length * 3 + '%');
    $('.rvBuffer .inner').text(m.remuxBuffer.video.length);
  }
}