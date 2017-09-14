import vegaAsLeafletLayer, { VegaLayer } from '../../src/index';

vegaAsLeafletLayer({
    spec: '../specs/spec4a.json',
})
    .then(([map, view]) => {
        setTimeout(() => {
            const parent = map.parentNode;
            parent.removeChild(map);
        }, 3000);
    })
    .catch(e => console.error(e));
