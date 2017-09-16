/* eslint no-plusplus: 0 */

import { TileLayer, Map } from 'leaflet';
import VegaLayer from './vega-layer';
import checkView from './util/check-view';

console.info('vega-as-leaflet-layer 1.1.4');
let divIdIndex = 0;

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

    const result = await checkView(spec, view);
    const {
        zoom,
        latitude,
        longitude,
        padding,
        vegaView,
    } = result;

    if (mapContainer === false && (container === null || typeof container === 'undefined')) {
        const msg = 'If you set mapContainer to \'false\', you have to provide a value for container.';
        throw new Error(msg);
    }


    // set up the container element for the map
    let divMapContainer = null;
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
            const {
                top,
                right,
                bottom,
                left,
            } = padding;
            divMapContainer.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
        }
    }


    // create a div for the Leaflet map
    const divMap = document.createElement('div');
    divMap.id = `${divMapContainer.id}-map`;
    divMap.style.width = `${vegaView.width()}px`;
    divMap.style.height = `${vegaView.height()}px`;
    divMapContainer.appendChild(divMap);


    // set up the container element for the container of the map; if mapContainer is set to false
    // the map will be added to the container directly
    let divContainer = null;
    if (typeof container === 'string') {
        divContainer = document.getElementById(container);
        if (divContainer === null) {
            divContainer = document.createElement('div');
            divContainer.id = container;
        }
        document.body.appendChild(divContainer);
    } else if (container instanceof HTMLElement) {
        divContainer = container;
        if (document.getElementById(divContainer === null)) {
            document.body.appendChild(divContainer);
        }
    }
    if (divContainer === null) {
        divContainer = document.body;
    }

    // if the mapContainer has not yet been added to the DOM, add it to the container element
    if (
        mapContainer !== false &&
        document.getElementById(mapContainer.id) === null
    ) {
        divContainer.appendChild(divMapContainer);
    }

    // add the Leaflet map to the mapContainer or to the container; either of them should be
    // a live element by now
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

    // padding of Vega view must always be 0
    vegaView.padding({
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    });

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
