'use strict';
const chai = require('chai');
const Utils = require('../src/index.js').default;
const expect = chai.expect;

describe('getUint', function() {
  it('unit8 array 0', function() {
    expect(Utils.getUint(new Uint8Array([0]))).to.be.equal(0);
  });
  it('unit8 array 257', function() {
    expect(Utils.getUint(new Uint8Array([1, 1]))).to.be.equal(257);
  });
  it('Large number', function() {
    expect(Utils.getUint(new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]))).to.be.equal(1208925819614629174706177);
  });
});

describe('Init mccree', function() {

  it('mccree to be null', function() {
    var that = new Object();
    try {
      Utils.initMccree.call(that, null);
    } catch (e) {
      expect(e).to.be.an('error');
    }
  });

  it('mccree to be null', function() {
    var that = new Object();
    try {
      Utils.initMccree.call(that, {
        logger: {},
        observer: {}
      });
    } catch (e) {
      expect(e).to.be.an('error');
    }
  });

  it('mccree to be an object', function() {
    let result = {
      mccree: {
        logger: {},
        observer: {},
        events: {
          events: {},
          errorTypes: {},
          errorDetails: {},
          logMsgs: {}
        },
      },
      logger: {},
      observer: {},
      events: {
      },
      errorTypes: {},
      errorDetails: {},
      logMsgs: {}
    };
    var that = new Object();

    Utils.initMccree.call(that, {
      logger: {},
      observer: {},
      events: {
        events: {},
        errorTypes: {},
        errorDetails: {},
        logMsgs: {}
      }
    });
    expect(that).to.deep.equal(result)
  });
});

describe('extend', function() {
  it('null extend', function() {
    var a = undefined;
    Utils.extend(a);
    expect(Utils.extend()).to.be.undefined;
    expect(a).to.be.undefined;
  });

  it('extend {}', function() {
    var a = {};
    Utils.extend(a)
    expect(a).to.deep.equal({});
  });

  it('extend multiple objects', function() {
    var a = {a:1,b:2};
    var b = {a:3,c:4};
    Utils.extend(a,b);
    expect(a).to.deep.equal({a:3,b:2,c:4});
  });
});