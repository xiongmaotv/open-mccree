'use strict';
const chai = require('chai');
const xyp2p = require('../src/index.js').default;
const expect = chai.expect;
describe('module dependency', function(){
  let config = {};
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