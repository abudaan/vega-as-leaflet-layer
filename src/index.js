/* eslint no-underscore-dangle: 0 */
/* eslint no-plusplus: 0 */

import { View, parse } from 'vega';
import { TileLayer, Map } from 'leaflet';
import { load } from 'fetch-helpers';
import VegaLayer from './vega-layer';

console.log('vega-as-leaflet-layer 1.1.4');
let divIdIndex = 0;

const getPadding = (view) => {
    const padding = view.padding();
    // check if the spec has defined a valid padding object
    if (
        typeof padding.top === 'undefined' &&
        typeof padding.bottom === 'undefined' &&
        typeof padding.right === 'undefined' &&
        typeof padding.left === 'undefined'
    ) {
        return null;
    }
    // fill empty slots with 0
    const {
        top = 0,
        bottom = 0,
        right = 0,
        left = 0,
    } = padding;
    // this is the padding
    const result = {
        top,
        bottom,
        right,
        left,
    };
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
        cssClassVegaLayer = ['leaflet-vega-container'],
        overruleVegaPadding = false,
    } = config;

    let error;

    if (mapContainer === null && (container === null || typeof container === 'undefined')) {
        error = 'If you set mapContainer to null, you have to provide a value for container';
        console.error(error);
        return new Error(error);
    }

    if (typeof spec === 'undefined' && typeof view === 'undefined') {
        error = 'please provide at least spec or a Vega view instance';
        console.error(error);
        return new Error(error);
    }

    let vegaView = view;
    let padding;
    if (typeof view === 'undefined') {
        let s;
        try {
            s = await load(spec);
        } catch (e) {
            console.error(e);
            return e;
        }
        try {
            vegaView = new View(parse(s));
        } catch (e) {
            error = `not a valid spec ${e}`;
            console.error(error);
            return new Error(error);
        }
        delete spec.vmvConfig;
        padding = getPadding(vegaView);
    } else {
        try {
            padding = getPadding(vegaView);
        } catch (e) {
            error = `not a valid view ${e}`;
            console.error(error);
            return new Error(error);
        }
    }

    const {
        zoom,
        latitude,
        longitude,
    } = vegaView._runtime.signals || [];

    if (typeof zoom === 'undefined' || typeof latitude === 'undefined' || typeof longitude === 'undefined') {
        error = 'incomplete map spec; if you want to add Vega as a Leaflet layer you should provide signals for zoom, latitude and longitude';
        console.error(error);
        return new Error(error);
    }

    let divMapContainer = null;
    if (mapContainer !== null) {
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
            const {
                top,
                right,
                bottom,
                left,
            } = padding;
            divMapContainer.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
        }
    }
    // padding of Vega view must always be 0
    vegaView.padding({
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    });

    // create a div for the Leaflet map
    const divMap = document.createElement('div');
    divMap.id = `${divMapContainer.id}-map`;
    divMap.style.width = `${vegaView.width()}px`;
    divMap.style.height = `${vegaView.height()}px`;
    divMapContainer.appendChild(divMap);

    let divContainer = null;
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

    // We need at least one live HTML element
    if (
        mapContainer !== null &&
        document.getElementById(mapContainer.id) === null
    ) {
        divContainer.appendChild(divMapContainer);
    }

    let leafletMapId;
    if (mapContainer === null) {
        leafletMapId = divContainer.id;
    } else {
        leafletMapId = divMap.id;
    }

    const leafletMap = new Map(leafletMapId, {
        zoomAnimation: false,
    }).setView([latitude.value, longitude.value], zoom.value);

    new TileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom,
    }).addTo(leafletMap);

    let classes = cssClassVegaLayer;
    if (typeof cssClassVegaLayer === 'string') {
        classes = [cssClassVegaLayer];
    }
    new VegaLayer(vegaView, {
        renderer,
        // Make sure the legend stays in place
        delayRepaint: true,
        cssClassVegaLayer: classes,
    }).addTo(leafletMap);

    return [divMapContainer, vegaView];
};

export default vegaAsLeafletLayer;
export VegaLayer from './vega-layer';
