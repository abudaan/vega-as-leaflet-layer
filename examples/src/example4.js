/* eslint no-underscore-dangle: 0 */

import { View, parse } from 'vega';
import { TileLayer, Map } from 'leaflet';
import { load } from 'fetch-helpers';
import { VegaLayer } from '../../src/index';

const mapDiv = document.createElement('div');
mapDiv.id = 'mapDiv';
mapDiv.style.width = '500px';
mapDiv.style.height = '300px';
document.body.appendChild(mapDiv);
const leafletMap = new Map(mapDiv, {
    zoomAnimation: false,
});

new TileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(leafletMap);

load('../specs/spec4a.json', 'json')
    .then((spec) => {
        spec.padding = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };
        const view = new View(parse(spec));
        const {
            zoom,
            latitude,
            longitude,
        } = view._signals;
        leafletMap.setView([latitude.value, longitude.value], zoom.value);
        const vegaLayer = new VegaLayer(view);
        vegaLayer.addTo(leafletMap);
    })
    .catch((e) => {
        console.error(e);
    });
