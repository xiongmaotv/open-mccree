'use strict';
const chai = require('chai');
const MediaInfo = require('../src/media-info.js').default;
const expect = chai.expect;
describe('MediaInfo', function() {
  var mi = new MediaInfo();
  it('constructor', function() {
    expect(mi.TAG).to.equal('MccreeMediaInfo');
    expect(mi.mimeType).to.be.null;
    expect(mi.duration).to.be.null;
    expect(mi.hasAudio).to.be.null;
    expect(mi.audioCodec).to.be.null;
    expect(mi.audioDataRate).to.be.null;
    expect(mi.audioSampleRate).to.be.null;
    expect(mi.hasVideo).to.be.null;
    expect(mi.videoCodec).to.be.null;
    expect(mi.videoDataRate).to.be.null;
    expect(mi.height).to.be.null;
    expect(mi.width).to.be.null;
    expect(mi.fps).to.be.null;
    expect(mi.profile).to.be.null;
    expect(mi.level).to.be.null;
    expect(mi.metadata).to.be.null;
  });
});