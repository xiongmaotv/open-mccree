'use strict';
const chai = require('chai');
const Mccree = require('../src/index.js').default;
const expect = chai.expect;

describe('Mccree', function() {
  describe('constructor', function() {
    it('No paramters', function() {
      var mccree = new Mccree();
      expect(mccree.TAG).to.equal('Mccree');
      expect(mccree.config).to.deep.equal({});

      expect(mccree.debug).to.be.false;
      expect(mccree.plugins).to.deep.equal([]);
      expect(mccree.url).to.be.null;

      expect(mccree.time).to.equal(0);
      expect(mccree.events).to.be.a.object;
      expect(mccree.logMsgs).to.be.a.object;
      expect(mccree.loaderBuffer).to.be.a.object;
      expect(mccree.remuxBuffer).to.deep.equal({});
      expect(mccree.initSegment).to.deep.equal({});
    });

    it('with config', function() {
      var mccree = new Mccree(undefined, {});
      expect(mccree.config).to.deep.equal({});
    });

    it('with module', function() {
      var loader = {
        init: function() {}
      };
      var mccree = new Mccree({
        loader: loader
      });
      expect(mccree.loader).to.deep.equal(loader);
    });
  });

  describe('destroy', function() {
    it('destroy', function() {
      var mccree = new Mccree();
      mccree.destroy().then(function(res) {
        expect(mccree.observer).to.be.null;
        expect(mccree.timmer).to.be.null;
        expect(mccree.media).to.be.null;
      });
    });
    it('destroy', function() {
      var mccree = new Mccree();
      mccree.destroy().then(function(res) {
        expect(mccree.observer).to.be.null;
        expect(mccree.timmer).to.be.null;
        expect(mccree.media).to.be.null;
      });
    });
    it('destroy', function() {
      var mccree = new Mccree();
      mccree.destroy().then(function(res) {
        expect(mccree.observer).to.be.null;
        expect(mccree.timmer).to.be.null;
        expect(mccree.media).to.be.null;
      });
    });
  });
  describe('load', function() {
    it('load', function() {
      var mccree = new Mccree();
      mccree.loader = {
        load: function(url) {
          expect(url).to.equal('test');
        }
      }

      mccree.logger = {
        log: function(tag, msg) {
          expect(tag).to.equal('Mccree');
          expect(msg).to.equal('loadurl test');
        }
      }

      mccree.load('test');
      expect(mccree.originUrl).to.equal('test');
    });
  });

  describe('attachMediaElement', function() {
    it('attachMediaElement', function() {
      var mccree = new Mccree();
      mccree.attachMediaElement({});
      expect(mccree.mediaElement).to.deep.equal({});
    });
  });

  describe('detachMediaElement', function() {
    it('detachMediaElement', function() {
      var mccree = new Mccree();
      mccree.mediaElement  = "test";
      mccree.detachMediaElement();
      expect(mccree.media).to.be.null;
    });
  });

  describe('unload', function() {
    it('unload', function() {
      var mccree = new Mccree();
      mccree.logger = {
        debug: function(tag, type, msg) {
          expect(tag).to.equal('Mccree');
          expect(type).to.equal('unload');
        }
      }

      mccree.loader = {
        unload: function() {
          return new Promise(function(resolve, reject) {
            resolve('testunload');
          });
        }
      };
      mccree.unload().then(function(res) {
        expect(res).to.equal('testunload');
      }).catch(function(){});

      mccree.loader = {
        unload: function() {
          return new Promise(function(resolve, reject) {
            reject('testunload');
          });
        }
      };
      mccree.unload().then(function() {}).catch(function(){
        expect('testunload').to.equal('testunload');
      });
    });
  });
  describe('_initLogger', function() {
    it('_initLogger with invalid logger', function() {
      var mccree = new Mccree();
      var logger = {}
      mccree._initLogger(null);
      expect(mccree.logger).to.be.a('object');
      mccree._initLogger(logger);
      expect(mccree.logger).to.be.a('object');
    });
    it('_initLogger with valid logger', function() {
      var mccree = new Mccree();
      var logger = {
        info:function(){},
        log:function(){},
        debug:function(){},
        error:function(){},
        warn: function(){}
      }
      mccree._initLogger(logger);
      expect(mccree.logger).to.be.a('object');
    });
  });

  describe('initObserver', function() {
    it('trigger', function() {
      var mccree = new Mccree();
      mccree.observer.emit= function(event, ...data) {
        expect(event).to.equal('test');
      }
      mccree.observer.trigger('test');
      mccree.observer.emit= function(event, ...data) {
        expect(event).to.equal('test');
        expect(data).to.deep.equal(['test1', 'test2']);
      }
      mccree.observer.trigger('test', 'test1', 'test2');
      mccree.observer.emit= function(event, ...data) {
        expect(event).to.equal('internalError');
      }
      mccree.observer.trigger('error');
    });
    it('on', function() {
      var mccree = new Mccree();
      mccree.observer.addListener= function(event, ...data) {
        expect(event).to.equal('test');
      }
      mccree.observer.on('test');

      mccree.observer.addListener= function(event, ...data) {
        expect(event).to.equal('test');
      }
      mccree.observer.on('test');

      mccree.observer.addListener= function(event, ...data) {
        expect(event).to.equal('internalError');
      }
      mccree.observer.on('error');
    });
    it('off', function() {
      var mccree = new Mccree();
      
      mccree.observer.removeListener = function(event, cb) {
        expect(cb()).to.be.undefined;
      }
      mccree.observer.off('test');

      mccree.observer.removeAllListeners = function(event) {
        expect(event).to.be.undefined;
      }
      mccree.observer.off(undefined, function() {});

      mccree.observer.removeListener = function(event, cb) {
        expect(event).to.equal('internalError');
        expect(cb).to.equal('test');
      }
      mccree.observer.off('error', 'test');
    });
  });
  describe('_createModules', function() {
    it('loader', function() {
      var mccree = new Mccree();
      mccree._createModules({
        loader: 'test'
      });
      mccree.logger = {
        debug: function(tag, type, msg) {
          expect(tag).to.equal('Mccree');
          expect(type).to.equal('debug');
        }
      }
      expect(mccree.loader).to.equal('test');
      mccree._createModules({});
      expect(mccree.loader).to.equal('test');
    });

    it('demux', function() {
      var mccree = new Mccree();
      mccree._createModules({
        demux: 'test'
      });
      mccree.logger = {
        debug: function(tag, type, msg) {
          expect(tag).to.equal('Mccree');
          expect(type).to.equal('debug');
        }
      }
      expect(mccree.demux ).to.equal('test');
      mccree._createModules({});
      expect(mccree.demux ).to.equal('test');
    });

    it('remux', function() {
      var mccree = new Mccree();
      mccree._createModules({
        remux: 'test'
      });
      mccree.logger = {
        debug: function(tag, type, msg) {
          expect(tag).to.equal('Mccree');
          expect(type).to.equal('debug');
        }
      }
      expect(mccree.remux ).to.equal('test');
      mccree._createModules({});
      expect(mccree.remux ).to.equal('test');
    });
  });

  describe('_initModules', function() {
    var mccree = new Mccree();
    mccree._createModules({
      loader: {
        init: function(m) {
          expect(m).to.deep.equal(mccree)
        }
      },
      demux: {
        init: function(m) {
          expect(m).to.deep.equal(mccree)
        }
      },
      remux: {
        init: function(m) {
          expect(m).to.deep.equal(mccree)
        }
      }
    });
    mccree._initModules();
  });
});