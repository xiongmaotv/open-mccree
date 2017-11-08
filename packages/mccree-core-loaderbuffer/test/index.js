'use strict';
const chai = require('chai');
const LoaderBuffer = require('../src/index.js').default;
const expect = chai.expect;

describe('constructor', function() {
  
  it('constructor', function() {
    var loaderBuffer = new LoaderBuffer();
    expect(loaderBuffer.length).to.be.equal(0);
    expect(loaderBuffer.array).to.deep.equal([]);
    expect(loaderBuffer.offset).to.be.equal(0);
    var loaderBuffer1 = new LoaderBuffer(20);
    expect(loaderBuffer1.length).to.be.equal(20);
  });
});

describe('push', function() {
  it('push', function() {
    var loaderBuffer = new LoaderBuffer();
    var uint8array1 = new Uint8Array([0,0,0]);
    loaderBuffer.push(uint8array1);
    expect(loaderBuffer.length).to.be.equal(3);
    expect(loaderBuffer.array).to.deep.equal([uint8array1]);
    var uint8array2 = new Uint8Array([1,0,0,0]);
    loaderBuffer.push(uint8array2);
    expect(loaderBuffer.length).to.be.equal(7);
    expect(loaderBuffer.array).to.deep.equal([uint8array1, uint8array2]);
  });
});
describe('shift', function() {
  it('empty', function() {
    var loaderBuffer = new LoaderBuffer();
    var a = loaderBuffer.shift(1);
    expect(a).to.deep.equal(new Uint8Array([]));
  });

  it('first array shift', function() {
    var loaderBuffer = new LoaderBuffer();
    loaderBuffer.push(new Uint8Array([1,0,0,0]));
    var a = loaderBuffer.shift(4);
    expect(a).to.deep.equal(new Uint8Array([1,0,0,0]));
    expect(loaderBuffer.length).to.be.equal(0);
    expect(loaderBuffer.offset).to.be.equal(0);
  });

  it('first array shift', function() {
    var loaderBuffer = new LoaderBuffer();
    loaderBuffer.push(new Uint8Array([1,0,0,0]));
    var a = loaderBuffer.shift(1);
    expect(a).to.deep.equal(new Uint8Array([1]));
    expect(loaderBuffer.length).to.be.equal(3);
    expect(loaderBuffer.offset).to.be.equal(1);
  });

  it('multiple array shift', function() {
    var loaderBuffer = new LoaderBuffer();
    loaderBuffer.push(new Uint8Array([1,0,0,0]));
    loaderBuffer.push(new Uint8Array([2,3,1]));
    var a = loaderBuffer.shift(5);
    expect(a).to.deep.equal(new Uint8Array([1,0,0,0,2]));
    expect(loaderBuffer.length).to.be.equal(2);
    expect(loaderBuffer.offset).to.be.equal(1);
  });

});
describe('clear', function() {
  it('clear', function() {
    var loaderBuffer = new LoaderBuffer();
    loaderBuffer.push(new Uint8Array([0,0,0]));
    loaderBuffer.clear();
    expect(loaderBuffer.length).to.be.equal(0);
    expect(loaderBuffer.array).to.deep.equal([]);
    expect(loaderBuffer.offset).to.be.equal(0);
  });
});
describe('shift', function() {
  it('empty', function() {
    var loaderBuffer = new LoaderBuffer();
    var a = loaderBuffer.shiftBuffer();
    expect(a).to.be.undefined;

  });
  it('shiftBuffer', function() {
    var loaderBuffer = new LoaderBuffer();
    loaderBuffer.push(new Uint8Array([1,0,0,0]));
    loaderBuffer.push(new Uint8Array([2,3,1]));
    var a = loaderBuffer.shiftBuffer();
    expect(loaderBuffer.length).to.be.equal(3);
    expect(loaderBuffer.offset).to.be.equal(0);
  });
});
describe('toInt', function() {
  it('toInt', function() {
    var loaderBuffer = new LoaderBuffer();
    loaderBuffer.push(new Uint8Array([1,0,0,0]));
    expect(loaderBuffer.toInt(0,5)).to.be.equal(16777216);

    loaderBuffer.push(new Uint8Array([2,3,1]));
    expect(loaderBuffer.toInt(0,2)).to.be.equal(256);
    expect(loaderBuffer.toInt(0,5)).to.be.equal(4294967298);
  });
});