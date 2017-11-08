'use strict';
const chai = require('chai');
const e = require('../src/events.js').default;
const expect = chai.expect;

describe('events', function() {
  it('events', function() {
    var evts = e.events;
    expect(evts.UNLOAD).to.equal('unload');
    expect(evts.DESTROY).to.equal('destroy');
    expect(evts.MEDIA_ATTACHING).to.equal('mediaAttaching');
    expect(evts.MEDIA_ATTACHED).to.equal('mediaAttached');
    expect(evts.MEDIA_DETACHING).to.equal('mediaDetaching');
    expect(evts.MEDIA_DETACHED).to.equal('mediaDetached');
    expect(evts.NOT_FOUND).to.equal('notFound');
    expect(evts.FORBIDDEN).to.equal('forbidden');

    expect(evts.CONNECTED).to.equal('connected');
    expect(evts.FRAG_LOADED).to.equal('fragLoaded');
    expect(evts.FRAG_PARSED).to.equal('fragParsed');
    expect(evts.FPS_DROP).to.equal('fpsDrop');
    expect(evts.BUFFER_APPENDING).to.equal('bufferAppending');
    expect(evts.BUFFER_APPENDED).to.equal('bufferAppended');
    expect(evts.BUFFER_EOS).to.equal('bufferEos');
    expect(evts.BUFFER_FLUSHING).to.equal('bufferFlushing');

    expect(evts.BUFFER_FLUSHED).to.equal('bufferFlushed');
    expect(evts.DEMUXER_MISSMATCH).to.equal('demuxerMissmatch');
    expect(evts.NO_MEDIA_ATTACHED).to.equal('noMeidaAttached');
    expect(evts.ERROR).to.equal('error');
  });

  it('errorTypes', function() {
    var et = e.errorTypes;
    expect(et.NETWORK_ERROR).to.equal('NetworkError');
    expect(et.MEDIA_ERROR).to.equal('MediaError');
    expect(et.MUX_ERROR).to.equal('MuxError');
    expect(et.OTHER_ERROR).to.equal('OtherError');
  });

  it('errorDetails', function() {
    var ed = e.errorDetails;
    expect(ed.NOT_INITED).to.equal('notInited');
    expect(ed.NOT_FOUND).to.equal('notFound');
    expect(ed.FORBIDDEN).to.equal('forbidden');
    expect(ed.UNKNOWN).to.equal('unknown');
    expect(ed.DATA_LENGTH_MISSMATCH).to.equal('dataLengthMissMatch');
  });

  it('logMsgs', function() {
    var msg = e.logMsgs;
    expect(msg.NOT_INITED).to.be.ok;
    expect(msg.NOT_FOUND).to.be.ok;
    expect(msg.FORBIDDEN).to.be.ok;
    expect(msg.UNKNOWN).to.be.ok;
    expect(msg.CONNECTED).to.be.ok;
    expect(msg.DESTROY).to.be.ok;
    expect(msg.UNLOADING).to.be.ok;
    expect(msg.INIT_LOGGER_CUSTOM).to.be.ok;
    expect(msg.INIT_LOGGER_INTERNAL).to.be.ok;
    expect(msg.INIT_LOADER).to.be.ok;
    expect(msg.INIT_LOADER_FAIL).to.be.ok;
    expect(msg.INIT_DEMUXER).to.be.ok;
    expect(msg.INIT_DEMUXER_FAILED).to.be.ok;
    expect(msg.INIT_REMUXER).to.be.ok;
    expect(msg.INIT_REMUXER_FAILED).to.be.ok;
  });
});