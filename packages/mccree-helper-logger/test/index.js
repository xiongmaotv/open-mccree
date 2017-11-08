'use strict';
const chai = require('chai');
const Logger = require('../src/index.js').default;
const expect = chai.expect;

// munk window 
global.window = {
  console: {
    log: null,
    debug: null,
    warn: null,
    info: null,
    error: null
  }
};

describe('constructor', function() {
  it('no params', function() {
    var logger = new Logger();
    expect(logger.disabled).to.be.undefined;
    expect(logger.debuging).to.be.undefined;
    expect(logger._logger).to.be.undefined;
  });

  it('with customer logger', function() {
    var logger = new Logger({});
    expect(logger.disabled).to.be.undefined;
    expect(logger.debuging).to.be.undefined;
    expect(logger._logger).to.be.a('object');
  });

  it('logger is disabled', function() {
    var logger = new Logger(undefined, true);
    expect(logger.disabled).to.be.true;
  });

  it('logger mode is debuging', function() {
    var logger = new Logger(undefined, false, true);
    expect(logger.debuging).to.be.true;
  });
});

describe('log', function() {
  var logger = new Logger();
  it('default', function() {
    window.console.log = function(a, b) {
      expect(a).to.match(/^\[(.+)\]\[testtag\] testtype\:\ $/);
      expect(b).to.be.equal('testmsg');
    }
    logger.log('testtag', 'testtype', 'testmsg');
  });

  it('disabled', function() {
    logger.disabled = true;
    expect(logger.log()).to.be.undefined;
  });

  var logger2 = new Logger({
    log: function(a, b, c) {
      expect(a).to.be.equal('testtag');
      expect(b).to.be.equal('testtype');
      expect(c).to.be.equal('testmsg');
    }
  });
  it('customer logger', function() {
    logger2.log('testtag', 'testtype', 'testmsg');
  });
});

describe('info', function() {
  var logger = new Logger();
  it('default', function() {
    window.console.info = function(a) {
      expect(a).to.match(/^\[(.+)\]\[testtag\] testtype\:\ testmsg$/);
    }
    logger.info('testtag', 'testtype', 'testmsg');
  });

  it('disabled', function() {
    logger.disabled = true;
    expect(logger.info()).to.be.undefined;
  });

  var logger2 = new Logger({
    info: function(a, b, c) {
        expect(a).to.be.equal('testtag');
        expect(b).to.be.equal('testtype');
        expect(c).to.be.equal('testmsg');
    }
  });
  it('customer logger', function() {
    logger2.info('testtag', 'testtype', 'testmsg');
  });
});

describe('warn', function() {
  var logger = new Logger();
  it('default', function() {
    window.console.warn = function(a) {
      expect(a).to.match(/^\[(.+)\]\[testtag\] testtype\:\ testmsg$/);
    }
    logger.warn('testtag', 'testtype', 'testmsg');
  });

  it('disabled', function() {
    logger.disabled = true;
    expect(logger.warn()).to.be.undefined;
  });

  var logger2 = new Logger({
    warn: function(a, b, c) {
        expect(a).to.be.equal('testtag');
        expect(b).to.be.equal('testtype');
        expect(c).to.be.equal('testmsg');
    }
  });

  it('customer logger', function() {
    logger2.warn('testtag', 'testtype', 'testmsg');
  });
});

describe('debug', function() {
  var logger = new Logger();
  it('default', function() {
    expect(logger.debug()).to.be.undefined;
    
  });

  it('disabled', function() {
    logger.disabled = true;
    expect(logger.debug()).to.be.undefined;
  });

  it('debuging', function() {
    logger.disabled = false;
    logger.debuging = true;
    window.console.debug = function(a, b) {
      expect(a).to.match(/^\[(.+)\]\[testtag\] testtype\:\ $/);
      expect(b).to.be.equal('testmsg');
    }
    logger.debug('testtag', 'testtype', 'testmsg');
  });

  var logger2 = new Logger({
    debug: function(a, b, c) {
        expect(a).to.be.equal('testtag');
        expect(b).to.be.equal('testtype');
        expect(c).to.be.equal('testmsg');
    }
  }, false, true);

  it('customer logger', function() {
    logger2.debug('testtag', 'testtype', 'testmsg');
  });
});

describe('error', function() {
  var logger = new Logger();
  it('default', function() {
    window.console.debug = function(a) {
      expect(a).to.match(/^\[(.+)\]\[testtag\] testtype\:\ testmsg$/);
    }
    logger.error('testtag', 'testtype', 'testmsg');
  });

  it('disabled', function() {
    logger.disabled = true;
    expect(logger.error()).to.be.undefined;
  });

  var logger2 = new Logger({
    error: function(a, b, c) {
        expect(a).to.be.equal('testtag');
        expect(b).to.be.equal('testtype');
        expect(c).to.be.equal('testmsg');
    }
  });

  it('customer logger', function() {
    logger2.error('testtag', 'testtype', 'testmsg');
  });
});

describe('isValid', function() {
  it('isValid', function() {
    expect(Logger.isValid()).to.be.false;
    expect(Logger.isValid({})).to.be.false;
    expect(Logger.isValid({
      info:function(){}
    })).to.be.false;
    expect(Logger.isValid({
      info:function(){},
      log:function(){}
    })).to.be.false;
    expect(Logger.isValid({
      info:function(){},
      log:function(){},
      debug:function(){}
    })).to.be.false;
    expect(Logger.isValid({
      info:function(){},
      log:function(){},
      debug:function(){},
      error:function(){}
    })).to.be.false;
    expect(Logger.isValid({
      info:function(){},
      log:function(){},
      debug:function(){},
      error:function(){},
      warn: function(){}
    })).to.be.true;
  });
});