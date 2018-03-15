'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ev = {
  UNLOAD: 'unload',
  DESTROY: 'destroy',

  // mccree-core 
  MEDIA_ATTACHING: 'mediaAttaching',
  MEDIA_ATTACHED: 'mediaAttached',
  MEDIA_DETACHING: 'mediaDetaching',
  MEDIA_DETACHED: 'mediaDetached',

  NOT_FOUND: 'notFound',
  FORBIDDEN: 'forbidden',
  CONNECTED: 'connected',
  FRAG_LOADED: 'fragLoaded',
  FRAG_PARSED: 'fragParsed',
  FPS_DROP: 'fpsDrop',
  BUFFER_APPENDING: 'bufferAppending',
  BUFFER_APPENDED: 'bufferAppended',
  BUFFER_EOS: 'bufferEos',
  BUFFER_FLUSHING: 'bufferFlushing',
  BUFFER_FLUSHED: 'bufferFlushed',

  // demuxer
  DEMUXER_MISSMATCH: 'demuxerMissmatch',
  NO_MEDIA_ATTACHED: 'noMeidaAttached',

  // remuxer
  ERROR: 'error'
};

var errorTypes = {
  NETWORK_ERROR: 'NetworkError',
  MEDIA_ERROR: 'MediaError',
  MUX_ERROR: 'MuxError',
  OTHER_ERROR: 'OtherError'
};

var errorDetails = {
  NOT_INITED: 'notInited',

  NOT_FOUND: 'notFound',
  FORBIDDEN: 'forbidden',
  UNKNOWN: 'unknown',

  DATA_LENGTH_MISSMATCH: 'dataLengthMissMatch'
};

var logMessages = {
  NOT_INITED: 'This module is not init yet',

  CONNECTED: 'Connected to the source',

  //Error Messages
  NOT_FOUND: 'The source is not founded',
  FORBIDDEN: 'forbidden',
  UNKNOWN: 'unknown',

  DESTROY: 'Destroy mccree',
  UNLOADING: 'Unloading',

  INIT_OBSERVER: 'Observer initialized',

  INIT_LOGGER_CUSTOM: 'Logger initialized, use the customer logger',
  INIT_LOGGER_INTERNAL: 'Logger initialized, use the internal logger',

  INIT_LOADER: 'Loader initialized',
  INIT_LOADER_FAIL: 'Loader can not be initialized',

  INIT_DEMUXER: 'Demuxer initialized',
  INIT_DEMUXER_FAILED: 'Demuxer can not be initialized',

  INIT_REMUXER: 'Remuxer initialized',
  INIT_REMUXER_FAILED: 'Remuxer can not be initialized'
};

var events = {
  events: ev,
  errorTypes: errorTypes,
  errorDetails: errorDetails,
  logMsgs: logMessages
};

exports.default = events;