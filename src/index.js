/* eslint no-underscore-dangle: 0 */
/* eslint no-plusplus: 0 */

import { View, parse } from 'vega';
import { TileLayer, Map } from 'leaflet';
import { load } from 'fetch-helpers';
import VegaLayer from './vega-layer';

let divIdIndex = 0;

const getPadding = (view) => {
    const padding = view.padding();
    const {
        top = 0,
        bottom = 0,
        right = 0,
        left = 0,
    } = padding;
    const result = {
        top,
        bottom,
        right,
        left,
    };
    if (
        typeof padding.top === 'undefined' &&
        typeof padding.bottom === 'undefined' &&
        typeof padding.right === 'undefined' &&
        typeof padding.left === 'undefined'
    ) {
        view.padding(result);
    }
    return result;
};

const vegaAsLeafletLayer = async (config) => {
    const {
        spec,
        view,
        renderer = 'canvas',
        container = document.body,
        mapContainer = `vega-leaflet-${divIdIndex++}`,
        maxZoom = 18,
        cssClassMap = 'leaflet-vega-container',
    } = config;

    if (typeof spec === 'undefined' && typeof view === 'undefined') {
        console.error('please provide at least spec or a Vega view instance');
        return;
    }

    let vegaView = view;
    let padding;
    if (typeof view === 'undefined') {
        let s;
        try {
            s = await load(spec);
        } catch (e) {
            console.error(e);
            return;
        }
        try {
            vegaView = new View(parse(s));
        } catch (e) {
            console.error('not a valid spec', e);
            return;
        }
        delete spec.vmvConfig;
        padding = getPadding(vegaView);
    } else {
        try {
            padding = getPadding(vegaView);
        } catch (e) {
            console.error('not a valid view');
            return;
        }
    }

    const {
        zoom,
        latitude,
        longitude,
    } = vegaView._runtime.signals || [];

    if (typeof zoom === 'undefined' || typeof latitude === 'undefined' || typeof longitude === 'undefined') {
        console.error('incomplete map spec; if you want to add Vega as a Leaflet layer you should provide signals for zoom, latitude and longitude');
        return;
    }

    let divMap = null;
    if (typeof mapContainer === 'string') {
        divMap = document.getElementById(mapContainer);
    } else if (mapContainer instanceof HTMLElement) {
        divMap = mapContainer;
    }
    if (divMap === null) {
        divMap = document.createElement('div');
        divMap.id = mapContainer;
    }
    const map = document.createElement('div');
    const mapId = `${divMap.id}-map`;
    map.id = mapId;
    map.style.width = `${vegaView.width() || vegaView._runtime.width}px`;
    map.style.height = `${vegaView.height() || vegaView._runtime.height}px`;


    let divContainer = null;
    if (typeof container === 'string') {
        divContainer = document.getElementById(container);
        if (divContainer === null) {
            divContainer = document.createElement('div');
            divContainer.id = container;
        }
    } else if (mapContainer instanceof HTMLElement) {
        divContainer = container;
    }
    if (divContainer === null) {
        divContainer = document.body;
    }
    const {
        top,
        right,
        bottom,
        left,
    } = padding;
    divMap.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;

    divMap.appendChild(map);
    divContainer.appendChild(divMap);

    const leafletMap = new Map(mapId, {
        zoomAnimation: false,
    }).setView([latitude.value, longitude.value], zoom.value);

    new TileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom,
    }).addTo(leafletMap);

    new VegaLayer(vegaView, {
        renderer,
        // Make sure the legend stays in place
        delayRepaint: true,
    }).addTo(leafletMap);
};

export default vegaAsLeafletLayer;
