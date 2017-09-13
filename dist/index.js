'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _vegaLayer = require('./vega-layer');

var _vegaLayer2 = _interopRequireDefault(_vegaLayer);

var _leaflet = require('leaflet');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addVegaAsLeafletLayer = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(config) {
        var spec, view, renderer, element, signals, zoom, latitude, longitude, leafletMap;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        spec = config.spec, view = config.view, renderer = config.renderer, element = config.element;
                        signals = spec.signals || [];
                        zoom = _ramda2.default.find(_ramda2.default.propEq('name', 'zoom'))(signals);
                        latitude = _ramda2.default.find(_ramda2.default.propEq('name', 'latitude'))(signals);
                        longitude = _ramda2.default.find(_ramda2.default.propEq('name', 'longitude'))(signals);

                        if (!(_ramda2.default.isNil(zoom) || _ramda2.default.isNil(latitude) || _ramda2.default.isNil(longitude))) {
                            _context.next = 8;
                            break;
                        }

                        console.error('incomplete map spec; if you want to add Vega as a Leaflet layer you should provide signals for zoom, latitude and longitude');
                        return _context.abrupt('return');

                    case 8:
                        leafletMap = new _leaflet.Map(element, {
                            zoomAnimation: false
                        }).setView([latitude.value, longitude.value], zoom.value);


                        new _leaflet.TileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                            attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                            maxZoom: 18
                        }).addTo(leafletMap);

                        new _vegaLayer2.default(view, {
                            renderer: renderer,
                            // Make sure the legend stays in place
                            delayRepaint: true
                        }).addTo(leafletMap);

                    case 11:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function addVegaAsLeafletLayer(_x) {
        return _ref.apply(this, arguments);
    };
}();

exports.default = addVegaAsLeafletLayer;