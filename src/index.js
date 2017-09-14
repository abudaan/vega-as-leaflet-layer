/* eslint no-underscore-dangle: 0 */
/* eslint no-plusplus: 0 */

import { View, parse } from 'vega';
import { TileLayer, Map } from 'leaflet';
import { load } from 'fetch-helpers';
import VegaLayer from './vega-layer';

console.log('vega-as-leaflet-layer 1.1.3');
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
        return null;
    }
    return result;
};

const vegaAsLeafletLayer = async (config) => {
    const {
        spec,
        view,
        renderer = 'canvas',
        container = document.body,
        mapElement = `vega-leaflet-${divIdIndex++}`,
        maxZoom = 18,
        cssClassVegaLayer = ['leaflet-vega-container'],
        overruleVegaPadding = false,
    } = config;

    let error;

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
    let containerNeeded = true;
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
        const {
            top,
            right,
            bottom,
            left,
        } = padding;
        divMapContainer.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
    }
    vegaView.padding({
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    });


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
    if (containerNeeded === true) {
        divContainer.appendChild(divMapContainer);
    }
    const leafletMap = new Map(divMap.id, {
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
