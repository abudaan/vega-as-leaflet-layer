import R from 'ramda';
import { TileLayer, Map } from 'leaflet';
import VegaLayer from './vega-layer';

const vegaAsLeafletLayer = async (config) => {
    const {
        spec,
        view,
        renderer,
        element,
    } = config;
    const signals = spec.signals || [];
    const zoom = R.find(R.propEq('name', 'zoom'))(signals);
    const latitude = R.find(R.propEq('name', 'latitude'))(signals);
    const longitude = R.find(R.propEq('name', 'longitude'))(signals);

    if (R.isNil(zoom) || R.isNil(latitude) || R.isNil(longitude)) {
        console.error('incomplete map spec; if you want to add Vega as a Leaflet layer you should provide signals for zoom, latitude and longitude');
        return;
    }

    const leafletMap = new Map(element, {
        zoomAnimation: false,
    }).setView([latitude.value, longitude.value], zoom.value);

    new TileLayer(
        'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom: 18,
        },
    ).addTo(leafletMap);

    new VegaLayer(view, {
        renderer: renderer,
        // Make sure the legend stays in place
        delayRepaint: true,
    }).addTo(leafletMap);
};

export default vegaAsLeafletLayer;
