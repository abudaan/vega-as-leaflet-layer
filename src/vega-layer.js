/* eslint no-underscore-dangle: 0 */
/* eslint no-bitwise: 0 */

/*
    based on: https://github.com/nyurik/leaflet-vega
*/

import { Layer, Class, Util, DomUtil } from 'leaflet';

const VegaLayer = (Layer || Class).extend({
    options: {
        // If true, graph will be repainted only after the map has finished moving (faster)
        delayRepaint: true,
        cssClassVegaLayer: [''],
    },

    initialize: function initialize(view, options) {
        Util.setOptions(this, options);
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
        this.map = map;
        this.vegaContainer = DomUtil.create('div', this.options.cssClassVegaLayer.join(' '));
        map._panes.overlayPane.appendChild(this.vegaContainer);

        this.view
            .initialize(this.vegaContainer);

        const onSignal = (sig, value) => this.onSignalChange(sig, value);

        this.view
            .addSignalListener('latitude', onSignal)
            .addSignalListener('longitude', onSignal)
            .addSignalListener('zoom', onSignal);

        map.on(this.options.delayRepaint ? 'moveend' : 'move', () => this.update());
        map.on('zoomend', () => this.update());

        return this.update(true);
    },

    onRemove: function onRemove() {
        if (this.view) {
            this.view.finalize();
            this.view = null;
        }

        DomUtil.empty();
    },

    onSignalChange: function onSignalChange(sig, value) {
        const center = this.map.getCenter();
        let zoom = this.map.getZoom();

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
        const topLeft = this.map.containerPointToLayerPoint([0, 0]);
        DomUtil.setPosition(this.vegaContainer, topLeft);

        const size = this.map.getSize();
        const center = this.map.getCenter();
        const zoom = this.map.getZoom();

        // console.log('size', size);
        // console.log('zoom', zoom);
        // console.log('center', center);

        const sendSignal = (sig, value) => {
            if (this.view.signal(sig) !== value) {
                this.view.signal(sig, value);
                return 1;
            }
            return 0;
        };

        // Only send changed signals to Vega. Detect if any of the signals have changed before calling run()
        let changed = 0;
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
    },
});

export default VegaLayer;
