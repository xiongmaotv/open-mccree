'use strict';
const chai = require('chai');
const Browser = require('../src/index.js').default;
const expect = chai.expect;
describe('brower parse test', function(){
  it('chrome 67 win', function(){
    var ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36';
    expect(Browser.uaMatch(ua).versionNumber).to.be.equal(67);
    expect(Browser.uaMatch(ua).version).to.be.equal('67.0.3396.62');
    expect(Browser.uaMatch(ua).name).to.be.equal('chrome');
    expect(Browser.uaMatch(ua).platform).to.be.equal('win');
    expect(Browser.uaMatch(ua).chrome).to.be.equal(true);
    expect(Browser.uaMatch(ua).win).to.be.equal(true);
  })
});