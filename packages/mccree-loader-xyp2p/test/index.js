'use strict';
const chai = require('chai');
const xyp2p = require('../src/index.js').default;
const expect = chai.expect;
describe('module dependency', function(){
  let MesNum = 0;
  let logMsg = '';
  let funArr = [];
  let triMes = '';
  let opened = false;
  let config = {};
  let Mccree = {
    observer: {
      trigger:  function(e, m, d) {
        triMes = d;
      },
      on:  function() {},
      off:  function() {}
    },
    events:{
      events: {},
      errorTypes: {},
      errorDetails: {},
      logMsgs: {}
    },
    logger: {
      debug: function(t,m) { logMsg = m; },
      log:function(t,m) { logMsg = m; },
      error: function(t,m) { logMsg = m; },
      info: function(t,m) { logMsg = m; },
      warn: function(t,m) { logMsg = m; }
    },
    loaderBuffer: {
      push: function(data) {},
      clear: function() {}
    },
    getMediaElement: function(){}
  };
  window.xyvp = {
    XYLiveEvent:{
      ERROR: 'xy error',
      FLV_DATA: 'flv data'
    },
    XYLive: function(obj){
      return {
        open: function(){
          opened = true;
        },
        on: function(mes, fun){
          let data = {
            byteLength: 1
          };
          fun.call(this,data);
          MesNum++;
        },
        close: function(){
          opened = false;
        }
      }
    }
  };
  
  describe('isSupported', function(){
    it('isSupported', function(){
      expect(xyp2p.isSupported()).to.be.equal(true);
    });
  });

  describe('constructor check', function(){
    it('constructor is a class', function(){
      expect(xyp2p).to.be.a('function');
      expect(xyp2p.prototype).to.be.a('Object');
    })
  });

  describe('module construction', function(){
    it('with config', function() {
      try {
        xyp2p(config);
      } catch (e) {
        expect(e.message).not.to.be.null;
      }
    });
    it('without config', function() {
      try {
        xyp2p();
      } catch (e) {
        expect(e.message).not.to.be.null;
      }
    });
  });

  let xy = new xyp2p(config);
  describe('module init', function(){
    it('init without Mccree', function(){
      try {
        xy.init();
      } catch(e) {
        expect(xy.mccree).to.be.undefined;
      }
    });
    it('init with Mccree', function(){
      xy.init(Mccree);
      expect(xy).to.be.a('Object');
      expect(xy.controller).to.be.a('Object');
      expect(xy.events).to.be.a('Object');
      expect(xy.events.XY_ERROR).to.be.equal('xy error');
      expect(xy.events.FLV_DATA).to.be.equal('flv data');
    });
  });
  
  describe('load', function(){
    it('load test', function(){
      xy.load('source', 'opt', 'range');
      expect(xy.xyLive).to.be.a('Object');
      expect(opened).to.be.equal(true);
      expect(MesNum).to.be.equal(2);
    });
  });
  
  describe('destory', function(){
    it('destory test', function(){
      xy.destory();
      expect(opened).to.be.equal(false);
    });
  });
  
  describe('unload', function(){
    it('unload test', function(){
      xy.unload();
      expect(opened).to.be.equal(false);
      expect(triMes).to.be.equal('unload');
    });
  });
  
  describe('loadPartail', function(){
    describe('302', function(){
      it('loadPartail with 302 resource', function(done){
        try{
          xy.loadPartail('https://liveapi.videojj.com/api/v1/getUser?platformId=5714b45a46a2c22f00f09fb9&platformUserId=222222&cate=dota2', 'range', 'opts');
          expect(xy.xhr).to.be.a('XMLHttpRequest');
          setTimeout(function(){
            xy.xhr.onprogress = null;
            xy.xhr.onreadystatechange = null;
            done();
          },1500);
        }catch(e){
          expect(e).not.to.be.undefined;
        }
      });
      
      describe('delay', function(){
        it('delay', function(done){
          setTimeout(function(){
            done()
          }, 1500);
        });
      });
    });
    
    describe('404', function(){
      it('loadPartail with 404 resource', function(done){
        try{
          xy.loadPartail('https://pl-p2p3.live.panda.tv/conf/pandaTV/pl4.live.panda.tv/live_panda/fc3ff8fa6b4e4dc6ef86c2a9c0c33250_3000/html5?ctmId=cGFuZGFUVg==&surl=aHR0cHM6Ly9wbDQubGl2ZS5wYW5kYS50di9saXZlX3BhbmRhL2ZjM2ZmOGZhNmI0ZTRkYzZlZjg2YzJhOWMwYzMzMjUwXzMwMDAuZmx2&wsSecret=af855a5003ed5b25c0bf5581e74fc1e2&wsTime=5b7e8f8d', 'range', 'opts');
          expect(xy.xhr).to.be.a('XMLHttpRequest');
          setTimeout(function(){
            expect(xy.xhr.status).to.be.equal(404);
            xy.xhr.onprogress = null;
            xy.xhr.onreadystatechange = null;
            done();
          },1500);
        }catch(e){
          expect(e).not.to.be.undefined;
        }
      });
      
      describe('delay', function(){
        it('delay', function(done){
          setTimeout(function(){
            done()
          }, 1500);
        });
      });
    });
    
    describe('200', function(){
      it('loadPartail with 200 resource', function(done){
        try{
          xy.loadPartail('https://s.h2.pdim.gs/static/686fb8fbbbd6adba/ruc_v2.1.6.css', 'range', 'opts');
          expect(xy.xhr).to.be.a('XMLHttpRequest');
          setTimeout(function(){
            expect(xy.xhr.status).to.be.equal(200);
            xy.xhr.onprogress = null;
            xy.xhr.onreadystatechange = null;
            done();
          },1500);
        }catch(e){
          expect(e).not.to.be.undefined;
        }
      });
      
      describe('delay', function(){
        it('delay', function(done){
          setTimeout(function(){
            done()
          }, 1500);
        });
      });
    });
    
    describe('without mccree', function(){
      it('loadPartail without mccree', function(){
        xy.mccree = null;
        xy.loadPartail('https://www.baidu.com/', 'range', 'opts');
        expect(logMsg).to.be.equal('Live is not init yet');
      });
    });
  });
});
