'use strict';
const chai = require('chai');
const Track = require('../src/index.js').default;
const AudioTrack = require('../src/index.js').AudioTrack;
const VideoTrack = require('../src/index.js').VideoTrack;
const expect = chai.expect;

describe('Track', function() {
  var track = new Track();
  it('constructor', function() {
    expect(track.TAG).to.be.equal("Track");
    expect(track.id).to.be.equal(-1);
    expect(track.sequenceNumber).to.deep.equal(0);
    expect(track.samples).to.deep.equal([]);
    expect(track.length).to.be.equal(0);
  });

  it('reset', function() {
    track.reset();
    expect(track.sequenceNumber).to.be.equal(0);
    expect(track.samples).to.deep.equal([]);
    expect(track.length).to.be.equal(0);
  });

  it('distroy', function() {
    track.distroy();
    expect(track.id).to.be.equal(-1);
    expect(track.sequenceNumber).to.be.equal(0);
    expect(track.samples).to.deep.equal([]);
    expect(track.length).to.be.equal(0);
  });
});


describe('AudioTrack', function() {
  var track = new AudioTrack();
  it('constructor', function() {
    expect(track.TAG).to.be.equal("AudioTrack");
    expect(track.type).to.be.equal('audio');
    expect(track.id).to.be.equal(-1);
    expect(track.sequenceNumber).to.be.equal(0);
    expect(track.samples).to.deep.equal([]);
    expect(track.length).to.be.equal(0);
  });
  
});

describe('VideoTrack', function() {
  var track = new VideoTrack();
  it('constructor', function() {
    expect(track.TAG).to.be.equal("VideoTrack");
    expect(track.type).to.be.equal('video');
    expect(track.id).to.be.equal(-1);
    expect(track.sequenceNumber).to.be.equal(0);
    expect(track.samples).to.deep.equal([]);
    expect(track.length).to.be.equal(0);
  });

  it('reset', function() {
    track.reset();
    expect(track.sequenceNumber).to.be.equal(0);
    expect(track.samples).to.deep.equal([]);
    expect(track.length).to.be.equal(0);
    expect(track.dropped).to.be.equal(0);
  });
});