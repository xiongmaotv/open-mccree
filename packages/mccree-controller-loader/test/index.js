'use strict';
const chai = require('chai');
const LoaderController = require('../src/index.js').default;
const expect = chai.expect;
describe('Loader Controller', function() {
  let loader = {
    TAG: 'test',
    type: 'loader',
    init: function(data) {},
    load: function(source, opt, ranges) {},
    unload: function() {}
  };
  let mccree = {
    observer: {
      trigger:  function() {},
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
      debug: function() {},
      log:function() {},
      error: function() {},
      info: function() {}
    },
    loaderBuffer: {
      push: function(data) {},
      clear: function() {}
    }
  };
  describe('#constructor()', function() {
    it('LoaderController is a class.', function() {
      expect(LoaderController).to.be.a('function');
      expect(LoaderController.prototype).to.be.a('Object');
      try {
        LoaderController();
      } catch (e) {
        expect(e.message).not.to.be.null;
      }
    });
  });

  let loaderController = new LoaderController(loader);
  describe('#init()', function() {
    it('Init without mccree.', function() {
      try {
        loaderController.init();
      } catch(e) {
         expect(loaderController.mccree).to.be.undefined;
      }
    });

    it('Init with mccree.', function() {
      loaderController.init(mccree);
      expect(loaderController).to.be.a('Object');
      expect(loaderController.observer).to.be.a('Object');
      expect(loaderController.events).to.be.a('Object');
      expect(loaderController.errorTypes).to.be.a('Object');
      expect(loaderController.errorDetails).to.be.a('Object');
      expect(loaderController.logMsgs).to.be.a('Object');
    });
  });

  describe('#onConnected()', function() {
    it('On connected', function() {
      loaderController.connected = true;
      loaderController.onConnected({});
      expect(loaderController.connected).to.be.true;
    });

    it('On notConnected', function() {
      loaderController.connected = false;
      loaderController.onConnected({});
      expect(loaderController.connected).to.be.true;
    });
  });

  describe('#onForbidden()', function() {
    it('On connected', function() {
      loaderController.connected = true;
      loaderController.loading = true;
      loaderController.onForbidden({});
      expect(loaderController.connected).to.be.false;
      expect(loaderController.loading).to.be.false;
    });

    it('On notConnected', function() {
      loaderController.connected = false;
      loaderController.onConnected({});
      expect(loaderController.connected).to.be.true;
    });
  });

  describe('#onLoadData()', function() {
    it('On load data', function() {
      loaderController.onLoadData({});
      expect(loaderController.connected).to.be.true;
      expect(loaderController.loading).to.be.true;
    });
  });
  describe('#onNotfound()', function() {
    it('On load data', function() {
      loaderController.onNotfound({});
      expect(loaderController.connected).to.be.false;
      expect(loaderController.loading).to.be.false;
    });
  });
  describe('#onUnknownError()', function() {
    it('On unknown error', function() {
      loaderController.connected = true;
      loaderController.loading = true;
      loaderController.onUnknownError({});
      expect(loaderController.connected).to.be.false;
      expect(loaderController.loading).to.be.false;
    });
  });
});
