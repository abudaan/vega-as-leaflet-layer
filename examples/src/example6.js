import vegaAsLeafletLayer, { VegaLayer } from '../../src/index';

vegaAsLeafletLayer({
    spec: '../specs/spec4a.json',
    container: document.getElementById('map'),
    mapContainer: false,
})
    .then(([map, view]) => {
        view.addSignalListener('buurt_hover_naam', (name, value) => {
            console.log(`signal ${name} now has value ${value}`);
        });
    })
    .catch(e => console.error(e));
