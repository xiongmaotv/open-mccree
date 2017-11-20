(function (root, factory) {
    if (typeof root.define === 'function' && root.define.amd) {
        root.define(['PandaMccreeLive'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(root.PandaMccreeLive);
    } else {
        root.PandaMccreeLive  = factory(root.PandaMccreeLive);
    }
    root.PandaMccreeLive  = factory(root.PandaMccreeLive);
}((typeof window === 'undefined') ? global : window, function(PandaMccreeLive) {
  PandaMccreeLive = require('./pandamccreelive.js')['default'];
  return PandaMccreeLive;
}));
