'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _leaflet = require('leaflet');

var VegaLayer = (_leaflet.Layer || _leaflet.Class).extend({
    options: {
        // If true, graph will be repainted only after the map has finished moving (faster)
        delayRepaint: true,
        cssClassVegaLayer: ['']
    },

    initialize: function initialize(view, options) {
        _leaflet.Util.setOptions(this, options);
        this.view = view;
    },

    /**
     * @param {L.Map} map
     * @return {L.VegaLayer}
     */
    addTo: function addTo(map) {
        map.addLayer(this);
        return this;
    },

    onAdd: function onAdd(map) {
        var _this = this;

        this.map = map;
        this.vegaContainer = _leaflet.DomUtil.create('div', this.options.cssClassVegaLayer.join(' '));
        map._panes.overlayPane.appendChild(this.vegaContainer);

        this.view.initialize(this.vegaContainer);

        var onSignal = function onSignal(sig, value) {
            return _this.onSignalChange(sig, value);
        };

        this.view.addSignalListener('latitude', onSignal).addSignalListener('longitude', onSignal).addSignalListener('zoom', onSignal);

        map.on(this.options.delayRepaint ? 'moveend' : 'move', function () {
            return _this.update();
        });
        map.on('zoomend', function () {
            return _this.update();
        });

        return this.update(true);
    },

    onRemove: function onRemove() {
        if (this.view) {
            this.view.finalize();
            this.view = null;
        }

        _leaflet.DomUtil.empty();
    },

    onSignalChange: function onSignalChange(sig, value) {
        var center = this.map.getCenter();
        var zoom = this.map.getZoom();

        switch (sig) {
            case 'latitude':
                center.lat = value;
                break;
            case 'longitude':
                center.lng = value;
                break;
            case 'zoom':
                zoom = value;
                break;
            default:
                return; // ignore
        }

        this.map.setView(center, zoom);
        this.update();
    },

    update: function update(force) {
        var _this2 = this;

        var topLeft = this.map.containerPointToLayerPoint([0, 0]);
        _leaflet.DomUtil.setPosition(this.vegaContainer, topLeft);

        var size = this.map.getSize();
        var center = this.map.getCenter();
        var zoom = this.map.getZoom();

        // console.log('size', size);
        // console.log('zoom', zoom);
        // console.log('center', center);

        var sendSignal = function sendSignal(sig, value) {
            if (_this2.view.signal(sig) !== value) {
                _this2.view.signal(sig, value);
                return 1;
            }
            return 0;
        };

        // Only send changed signals to Vega. Detect if any of the signals have changed before calling run()
        var changed = 0;
        changed |= sendSignal('width', size.x);
        changed |= sendSignal('height', size.y);
        changed |= sendSignal('latitude', center.lat);
        changed |= sendSignal('longitude', center.lng);
        changed |= sendSignal('zoom', zoom);

        if (changed || force) {
            return this.view.runAsync();
        }
        return 0;

        // this.view.signal('width', size.x);
        // this.view.signal('height', size.y);
        // this.view.signal('latitude', center.lat);
        // this.view.signal('longitude', center.lng);
        // this.view.signal('zoom', zoom);
        // return this.view.run();
    }
}); /* eslint no-underscore-dangle: 0 */
/* eslint no-bitwise: 0 */

/*
    based on: https://github.com/nyurik/leaflet-vega
*/

exports.default = VegaLayer;