import { TileLayer, Map } from 'leaflet';
import VegaLayer from './vega-layer';

const vegaAsLeafletLayer = async (config) => {
    const {
        view,
        renderer = 'canvas',
        elementId,
        maxZoom = 18,
        cssClassMap = 'leaflet-vega-container',
    } = config;

    const {
        zoom,
        latitude,
        longitude,
    } = view._runtime.signals || [];

    if (typeof zoom === 'undefined' || typeof latitude === 'undefined' || typeof longitude === 'undefined') {
        console.error('incomplete map spec; if you want to add Vega as a Leaflet layer you should provide signals for zoom, latitude and longitude');
        return;
    }

    const div = document.getElementById(elementId);
    div.style.width = `${view._width}px`;
    div.style.height = `${view._height}px`;

    const leafletMap = new Map(elementId, {
        zoomAnimation: false,
    }).setView([latitude.value, longitude.value], zoom.value);


    new TileLayer(
        'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom,
        },
    ).addTo(leafletMap);

    new VegaLayer(view, {
        renderer: renderer,
        // Make sure the legend stays in place
        delayRepaint: true,
    }).addTo(leafletMap);

};

export default vegaAsLeafletLayer;
