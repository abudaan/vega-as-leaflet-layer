'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getPadding = function getPadding(view) {
    var padding = view.padding();
    // check if the spec has defined a valid padding object
    if (typeof padding.top === 'undefined' && typeof padding.bottom === 'undefined' && typeof padding.right === 'undefined' && typeof padding.left === 'undefined') {
        return null;
    }
    // fill empty slots with 0
    var _padding$top = padding.top,
        top = _padding$top === undefined ? 0 : _padding$top,
        _padding$bottom = padding.bottom,
        bottom = _padding$bottom === undefined ? 0 : _padding$bottom,
        _padding$right = padding.right,
        right = _padding$right === undefined ? 0 : _padding$right,
        _padding$left = padding.left,
        left = _padding$left === undefined ? 0 : _padding$left;
    // this is the padding

    var result = {
        top: top,
        bottom: bottom,
        right: right,
        left: left
    };
    return result;
};

exports.default = getPadding;