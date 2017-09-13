import { View, parse } from 'vega';
import { TileLayer, Map } from 'leaflet';
import VegaLayer from './vega-layer';

let divIdIndex = 0;

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
    let error = 'not a valid view';
    let padding;
    try {
        if (typeof view === 'undefined') {
            error = 'not a valid spec';
            vegaView = new View(parse(spec));
        }
        padding = vegaView.padding();
    } catch (e) {
        console.error(error);
        return;
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

    let div = null;
    if (typeof element === 'string') {
        div = document.getElementById(element);
        if (div === null) {
            div = document.createElement('div');
            div.id = element;
        }
    } else if (element instanceof HTMLElement) {
        div = element;
    }
    const map = document.createElement('div');
    const mapId = `${div.id}-map`
    map.id = mapId;
    map.style.width = `${vegaView.width()}px`;
    map.style.height = `${vegaView.height()}px`;

    const {
        top,
        right,
        bottom,
        left,
    } = padding;
    div.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;

    div.appendChild(map);
    container.appendChild(div);

    const leafletMap = new Map(mapId, {
        zoomAnimation: false,
    }).setView([latitude.value, longitude.value], zoom.value);

    new TileLayer(
        'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom,
        },
    ).addTo(leafletMap);

    new VegaLayer(vegaView, {
        renderer: renderer,
        // Make sure the legend stays in place
        delayRepaint: true,
    }).addTo(leafletMap);
};

export default vegaAsLeafletLayer;
