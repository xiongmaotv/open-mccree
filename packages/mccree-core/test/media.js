'use strict';
const chai = require('chai');
const Media = require('../src/media.js').default;
const expect = chai.expect;
describe('Media', function() {
  describe('constructor', function() {
    it('No paramter', function() {
      var m = new Media();
      expect(m.TAG).to.equal('MccreeMedia');
      expect(m.config).to.deep.equal({});
      expect(m.level).to.be.null;
      expect(m.tracks).to.deep.equal({});
      expect(m.videoDuration).to.equal(0);
      expect(m.audioDuration).to.equal(0);
    });

    it('Construct with config only', function() {
      var m = new Media({
        test: 'test'
      });
      expect(m.TAG).to.equal('MccreeMedia');
      expect(m.config).to.deep.equal({
        test: 'test'
      });
      expect(m.level).to.be.null;
      expect(m.tracks).to.deep.equal({});
      expect(m.videoDuration).to.equal(0);
      expect(m.audioDuration).to.equal(0);
    });

    it('Construct with tracks only', function() {
      var m = new Media(null, {
        test: 'test'
      });
      expect(m.TAG).to.equal('MccreeMedia');
      expect(m.config).to.deep.equal({});
      expect(m.level).to.be.null;
      expect(m.tracks).to.deep.equal({
        test: 'test'
      });
      expect(m.videoDuration).to.equal(0);
      expect(m.audioDuration).to.equal(0);
    });

    it('Construct with configs and tracks', function() {
      var m = new Media({
        test1: 'test1'
      }, {
        test2: 'test2'
      });
      expect(m.TAG).to.equal('MccreeMedia');
      expect(m.config).to.deep.equal({
        test1: 'test1'
      });
      expect(m.level).to.be.null;
      expect(m.tracks).to.deep.equal({
        test2: 'test2'
      });
      expect(m.videoDuration).to.equal(0);
      expect(m.audioDuration).to.equal(0);
    });
  });

  describe('initTracks', function() {
    var tracks1 = {
      reset: function(here) {
        expect(here).to.be.undefined;

      }
    };

    var tracks2 = {
      reset: function(here) {
        expect(here).to.be.undefined;
      }
    };

    it('no tracks', function() {
      var m = new Media();
      m.initTracks();
    });

    it('one track', function() {
      var m = new Media(null, [tracks1]);
      m.initTracks();
    });

    it('multi tracks', function() {
      var m = new Media(null, [tracks1, tracks2]);
      m.initTracks();
    });
  });

  describe('resetTracks', function() {
    var tracks1 = {
      reset: function(here) {
        expect(here).to.be.undefined;

      }
    };

    var tracks2 = {
      reset: function(here) {
        expect(here).to.be.undefined;
      }
    };

    it('no tracks', function() {
      var m = new Media();
      m.resetTracks();
    });

    it('one track', function() {
      var m = new Media(null, [tracks1]);
      m.resetTracks();
    });

    it('multi tracks', function() {
      var m = new Media(null, [tracks1, tracks2]);
      m.resetTracks();
    });
  });

  describe('getTrack', function() {
    it('getTrack', function() {
      var tracks1 = {};

      var m = new Media(null, [tracks1]);
      expect(m.getTrack(0)).to.deep.equal(tracks1);
    });
  });

  describe('distoryTracks', function() {
    var tracks1 = {
      destroy: function(here) {
        expect(here).to.be.undefined;

      }
    };

    var tracks2 = {
      destroy: function(here) {
        expect(here).to.be.undefined;
      }
    };

    it('no tracks', function() {
      var m = new Media();
      m.destoryTracks();
    });

    it('one track', function() {
      var m = new Media(null, [tracks1]);
      m.destoryTracks();
    });

    it('multi tracks', function() {
      var m = new Media(null, [tracks1, tracks2]);
      m.destoryTracks();
    });
  });
});