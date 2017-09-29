'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _vega = require('vega');

var _fetchHelpers = require('fetch-helpers');

var _getPadding = require('./get-padding');

var _getPadding2 = _interopRequireDefault(_getPadding);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkView = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(spec, view) {
        var error, vegaView, padding, s, _ref2, zoom, latitude, longitude;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        error = void 0;

                        if (!((typeof spec === 'undefined' || spec === null) && (typeof view === 'undefined' || view === null))) {
                            _context.next = 4;
                            break;
                        }

                        error = 'Please provide at least spec or a Vega view instance.';
                        throw new Error(error);

                    case 4:

                        // check if the provided view or spec is valid
                        vegaView = view;
                        padding = void 0;

                        if (!(typeof view === 'undefined')) {
                            _context.next = 28;
                            break;
                        }

                        s = void 0;
                        _context.prev = 8;
                        _context.next = 11;
                        return (0, _fetchHelpers.load)(spec);

                    case 11:
                        s = _context.sent;
                        _context.next = 17;
                        break;

                    case 14:
                        _context.prev = 14;
                        _context.t0 = _context['catch'](8);
                        throw _context.t0;

                    case 17:
                        _context.prev = 17;

                        vegaView = new _vega.View((0, _vega.parse)(s));
                        _context.next = 25;
                        break;

                    case 21:
                        _context.prev = 21;
                        _context.t1 = _context['catch'](17);

                        error = 'Not a valid spec: ' + _context.t1;
                        throw new Error(error);

                    case 25:
                        padding = (0, _getPadding2.default)(vegaView);
                        _context.next = 36;
                        break;

                    case 28:
                        _context.prev = 28;

                        padding = (0, _getPadding2.default)(vegaView);
                        _context.next = 36;
                        break;

                    case 32:
                        _context.prev = 32;
                        _context.t2 = _context['catch'](28);

                        error = 'Not a valid view: ' + _context.t2;
                        throw new Error(error);

                    case 36:

                        // check for the mandatory signals
                        _ref2 = vegaView._runtime.signals || [], zoom = _ref2.zoom, latitude = _ref2.latitude, longitude = _ref2.longitude;

                        if (!(typeof zoom === 'undefined' || typeof latitude === 'undefined' || typeof longitude === 'undefined')) {
                            _context.next = 40;
                            break;
                        }

                        error = 'Incomplete specification; if you want to add Vega as a Leaflet layer you defined provide signals for zoom, latitude and longitude';
                        throw new Error(error);

                    case 40:
                        return _context.abrupt('return', {
                            zoom: zoom,
                            latitude: latitude,
                            longitude: longitude,
                            padding: padding,
                            vegaView: vegaView
                        });

                    case 41:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[8, 14], [17, 21], [28, 32]]);
    }));

    return function checkView(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}(); /* eslint no-underscore-dangle: 0 */

exports.default = checkView;