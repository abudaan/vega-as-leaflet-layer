'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.version = exports.VegaLayer = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _leaflet = require('leaflet');

var _vegaLayer = require('./vega-layer');

var _vegaLayer2 = _interopRequireDefault(_vegaLayer);

var _checkView = require('./util/check-view');

var _checkView2 = _interopRequireDefault(_checkView);

var _package = require('../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-plusplus: 0 */

var divIdIndex = 0;
var _window = window,
    protocol = _window.location.protocol;


var vegaAsLeafletLayer = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(config) {
        var spec, view, _config$renderer, renderer, _config$container, container, _config$mapContainer, mapContainer, _config$maxZoom, maxZoom, _config$cssClassVegaL, cssClassVegaLayer, _config$overruleVegaP, overruleVegaPadding, result, zoom, latitude, longitude, padding, vegaView, msg, divMapContainer, top, right, bottom, left, divContainer, divMap, width, height, divMapId, leafletMap, classes;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        spec = config.spec, view = config.view, _config$renderer = config.renderer, renderer = _config$renderer === undefined ? 'canvas' : _config$renderer, _config$container = config.container, container = _config$container === undefined ? document.body : _config$container, _config$mapContainer = config.mapContainer, mapContainer = _config$mapContainer === undefined ? 'vega-leaflet-' + divIdIndex++ : _config$mapContainer, _config$maxZoom = config.maxZoom, maxZoom = _config$maxZoom === undefined ? 18 : _config$maxZoom, _config$cssClassVegaL = config.cssClassVegaLayer, cssClassVegaLayer = _config$cssClassVegaL === undefined ? ['leaflet-vega-container'] : _config$cssClassVegaL, _config$overruleVegaP = config.overruleVegaPadding, overruleVegaPadding = _config$overruleVegaP === undefined ? false : _config$overruleVegaP;
                        _context.next = 3;
                        return (0, _checkView2.default)(spec, view);

                    case 3:
                        result = _context.sent;
                        zoom = result.zoom, latitude = result.latitude, longitude = result.longitude, padding = result.padding, vegaView = result.vegaView;

                        if (!(mapContainer === false && (container === null || typeof container === 'undefined'))) {
                            _context.next = 8;
                            break;
                        }

                        msg = 'If you set mapContainer to \'false\', you have to provide a value for container.';
                        throw new Error(msg);

                    case 8:

                        // set up the container element for the map
                        divMapContainer = null;

                        if (mapContainer !== false) {
                            if (typeof mapContainer === 'string') {
                                divMapContainer = document.getElementById(mapContainer);
                            } else if (mapContainer instanceof HTMLElement) {
                                divMapContainer = mapContainer;
                            }
                            if (divMapContainer === null) {
                                divMapContainer = document.createElement('div');
                                divMapContainer.id = mapContainer;
                            }
                            // apply padding as found in Vega spec unless we want to set the padding
                            // via a css class that may be added to the mapContainer.
                            if (padding !== null && overruleVegaPadding !== true) {
                                top = padding.top, right = padding.right, bottom = padding.bottom, left = padding.left;

                                divMapContainer.style.padding = top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px';
                            }
                        }

                        // set up the container element for the container of the map; if mapContainer is set to false
                        // the map will be added to the container directly
                        divContainer = null;

                        if (typeof container === 'string') {
                            divContainer = document.getElementById(container);
                            if (divContainer === null) {
                                divContainer = document.createElement('div');
                                divContainer.id = container;
                            }
                            document.body.appendChild(divContainer);
                        } else if (container instanceof HTMLElement) {
                            divContainer = container;
                            if (document.getElementById(divContainer.id === null)) {
                                document.body.appendChild(divContainer);
                            }
                        }
                        if (divContainer === null) {
                            divContainer = document.body;
                        }

                        // if the mapContainer has not yet been added to the DOM, add it to the container element
                        if (divMapContainer !== null && document.getElementById(mapContainer.id) === null) {
                            divContainer.appendChild(divMapContainer);
                        }

                        // create a div for the Leaflet map and add the Leaflet map to the mapContainer or to the container;
                        // either of them should be a live element by now
                        divMap = document.createElement('div');
                        width = vegaView.width() ? vegaView.width() + 'px' : '100%';
                        height = vegaView.height() ? vegaView.height() + 'px' : '100%';

                        divMap.style.width = width;
                        divMap.style.height = height;
                        divMapId = void 0;
                        // console.log(divContainer, divMapContainer);

                        if (divMapContainer === null) {
                            divMapId = divContainer.id + '-map';
                            divContainer.appendChild(divMap);
                        } else {
                            if (divMapContainer.style.width === '' || divMapContainer.style.width === 'undefined') {
                                divMapContainer.style.width = width;
                            }
                            if (divMapContainer.style.height === '' || divMapContainer.style.height === 'undefined') {
                                divMapContainer.style.height = height;
                            }
                            divMapId = divMapContainer.id + '-map';
                            divMapContainer.appendChild(divMap);
                        }
                        // console.log('map container', divMapContainer);
                        // console.log('container', divContainer);
                        // console.log('map', divMap);
                        divMap.id = divMapId;
                        leafletMap = new _leaflet.Map(divMapId, {
                            zoomAnimation: false
                        }).setView([latitude.value, longitude.value], zoom.value);


                        new _leaflet.TileLayer(protocol + '//{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                            attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                            maxZoom: maxZoom
                        }).addTo(leafletMap);

                        classes = cssClassVegaLayer;

                        if (typeof cssClassVegaLayer === 'string') {
                            classes = [cssClassVegaLayer];
                        }

                        // padding of Vega view must always be 0
                        vegaView.padding({
                            top: 0,
                            bottom: 0,
                            right: 0,
                            left: 0
                        });

                        new _vegaLayer2.default(vegaView, {
                            renderer: renderer,
                            // Make sure the legend stays in place
                            delayRepaint: true,
                            cssClassVegaLayer: classes
                        }).addTo(leafletMap);

                        return _context.abrupt('return', [divMapContainer, vegaView]);

                    case 29:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function vegaAsLeafletLayer(_x) {
        return _ref.apply(this, arguments);
    };
}();

exports.default = vegaAsLeafletLayer;
exports.VegaLayer = _vegaLayer2.default;

var v = 'vega-as-leaflet-layer ' + _package.version;
exports.version = v;