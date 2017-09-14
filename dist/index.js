'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.VegaLayer = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _vega = require('vega');

var _leaflet = require('leaflet');

var _fetchHelpers = require('fetch-helpers');

var _vegaLayer = require('./vega-layer');

var _vegaLayer2 = _interopRequireDefault(_vegaLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-underscore-dangle: 0 */
/* eslint no-plusplus: 0 */

console.log('vega-as-leaflet-layer 1.1.3');
var divIdIndex = 0;

var getPadding = function getPadding(view) {
    var padding = view.padding();
    var _padding$top = padding.top,
        top = _padding$top === undefined ? 0 : _padding$top,
        _padding$bottom = padding.bottom,
        bottom = _padding$bottom === undefined ? 0 : _padding$bottom,
        _padding$right = padding.right,
        right = _padding$right === undefined ? 0 : _padding$right,
        _padding$left = padding.left,
        left = _padding$left === undefined ? 0 : _padding$left;

    var result = {
        top: top,
        bottom: bottom,
        right: right,
        left: left
    };
    if (typeof padding.top === 'undefined' && typeof padding.bottom === 'undefined' && typeof padding.right === 'undefined' && typeof padding.left === 'undefined') {
        return null;
    }
    return result;
};

var vegaAsLeafletLayer = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(config) {
        var spec, view, _config$renderer, renderer, _config$container, container, _config$mapElement, mapElement, _config$maxZoom, maxZoom, _config$cssClassVegaL, cssClassVegaLayer, error, vegaView, padding, s, _ref2, zoom, latitude, longitude, divMapContainer, containerNeeded, _padding, top, right, bottom, left, divMap, divContainer, leafletMap, classes;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        spec = config.spec, view = config.view, _config$renderer = config.renderer, renderer = _config$renderer === undefined ? 'canvas' : _config$renderer, _config$container = config.container, container = _config$container === undefined ? document.body : _config$container, _config$mapElement = config.mapElement, mapElement = _config$mapElement === undefined ? 'vega-leaflet-' + divIdIndex++ : _config$mapElement, _config$maxZoom = config.maxZoom, maxZoom = _config$maxZoom === undefined ? 18 : _config$maxZoom, _config$cssClassVegaL = config.cssClassVegaLayer, cssClassVegaLayer = _config$cssClassVegaL === undefined ? ['leaflet-vega-container'] : _config$cssClassVegaL;
                        error = void 0;

                        if (!(typeof spec === 'undefined' && typeof view === 'undefined')) {
                            _context.next = 6;
                            break;
                        }

                        error = 'please provide at least spec or a Vega view instance';
                        console.error(error);
                        return _context.abrupt('return', new Error(error));

                    case 6:
                        vegaView = view;
                        padding = void 0;

                        if (!(typeof view === 'undefined')) {
                            _context.next = 33;
                            break;
                        }

                        s = void 0;
                        _context.prev = 10;
                        _context.next = 13;
                        return (0, _fetchHelpers.load)(spec);

                    case 13:
                        s = _context.sent;
                        _context.next = 20;
                        break;

                    case 16:
                        _context.prev = 16;
                        _context.t0 = _context['catch'](10);

                        console.error(_context.t0);
                        return _context.abrupt('return', _context.t0);

                    case 20:
                        _context.prev = 20;

                        vegaView = new _vega.View((0, _vega.parse)(s));
                        _context.next = 29;
                        break;

                    case 24:
                        _context.prev = 24;
                        _context.t1 = _context['catch'](20);

                        error = 'not a valid spec ' + _context.t1;
                        console.error(error);
                        return _context.abrupt('return', new Error(error));

                    case 29:
                        delete spec.vmvConfig;
                        padding = getPadding(vegaView);
                        _context.next = 42;
                        break;

                    case 33:
                        _context.prev = 33;

                        padding = getPadding(vegaView);
                        _context.next = 42;
                        break;

                    case 37:
                        _context.prev = 37;
                        _context.t2 = _context['catch'](33);

                        error = 'not a valid view ' + _context.t2;
                        console.error(error);
                        return _context.abrupt('return', new Error(error));

                    case 42:
                        _ref2 = vegaView._runtime.signals || [], zoom = _ref2.zoom, latitude = _ref2.latitude, longitude = _ref2.longitude;

                        if (!(typeof zoom === 'undefined' || typeof latitude === 'undefined' || typeof longitude === 'undefined')) {
                            _context.next = 47;
                            break;
                        }

                        error = 'incomplete map spec; if you want to add Vega as a Leaflet layer you should provide signals for zoom, latitude and longitude';
                        console.error(error);
                        return _context.abrupt('return', new Error(error));

                    case 47:
                        divMapContainer = null;
                        containerNeeded = true;

                        if (typeof mapElement === 'string') {
                            divMapContainer = document.getElementById(mapElement);
                            containerNeeded = document.getElementById(mapElement) === null;
                        } else if (mapElement instanceof HTMLElement) {
                            divMapContainer = mapElement;
                            containerNeeded = document.getElementById(mapElement.id) === null;
                        }
                        if (divMapContainer === null) {
                            divMapContainer = document.createElement('div');
                            divMapContainer.id = mapElement;
                        }
                        if (padding !== null) {
                            _padding = padding, top = _padding.top, right = _padding.right, bottom = _padding.bottom, left = _padding.left;

                            divMapContainer.style.padding = top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px';
                        }
                        vegaView.padding({
                            top: 0,
                            bottom: 0,
                            right: 0,
                            left: 0
                        });

                        divMap = document.createElement('div');

                        divMap.id = divMapContainer.id + '-map';
                        divMap.style.width = vegaView.width() + 'px';
                        divMap.style.height = vegaView.height() + 'px';
                        divMapContainer.appendChild(divMap);

                        divContainer = null;

                        if (typeof container === 'string') {
                            divContainer = document.getElementById(container);
                            if (divContainer === null) {
                                divContainer = document.createElement('div');
                                divContainer.id = container;
                            }
                        } else if (container instanceof HTMLElement) {
                            divContainer = container;
                        }
                        if (divContainer === null) {
                            divContainer = document.body;
                        }
                        if (containerNeeded === true) {
                            divContainer.appendChild(divMapContainer);
                        }
                        leafletMap = new _leaflet.Map(divMap.id, {
                            zoomAnimation: false
                        }).setView([latitude.value, longitude.value], zoom.value);


                        new _leaflet.TileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                            attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                            maxZoom: maxZoom
                        }).addTo(leafletMap);

                        classes = cssClassVegaLayer;

                        if (typeof cssClassVegaLayer === 'string') {
                            classes = [cssClassVegaLayer];
                        }
                        new _vegaLayer2.default(vegaView, {
                            renderer: renderer,
                            // Make sure the legend stays in place
                            delayRepaint: true,
                            cssClassVegaLayer: classes
                        }).addTo(leafletMap);

                        return _context.abrupt('return', [divMapContainer, vegaView]);

                    case 68:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[10, 16], [20, 24], [33, 37]]);
    }));

    return function vegaAsLeafletLayer(_x) {
        return _ref.apply(this, arguments);
    };
}();

exports.default = vegaAsLeafletLayer;
exports.VegaLayer = _vegaLayer2.default;