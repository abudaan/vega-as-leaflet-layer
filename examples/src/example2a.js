import { version } from 'vega';
import vegaAsLeafletLayer, { VegaLayer } from '../../src/index';

console.log(version);

vegaAsLeafletLayer({
    spec: '../specs/spec4b.yaml',
    // container: 'responsible_map',
    // mapContainer: 'responsible_map',
})
    .then(([map, view]) => {
        // view.addSignalListener('buurt_hover_naam', (name, value) => {
        //     console.log(`signal ${name} now has value ${value}`);
        // });
    })
    .catch(e => console.error(e));
