import { View, parse } from 'vega';
import vegaAsLeafletLayer, { VegaLayer } from '../../src/index';
import createSpec4 from '../specs/spec4';

const config = {
    dataPath: './data/',
    imagePath: './img/',
};
const spec4 = createSpec4(config);

const spec = {
    signals: [
        {
            name: 'zoom',
            value: 13,
        },
        {
            name: 'latitude',
            value: 51.927754415373855,

        },
        {
            name: 'longitude',
            value: 4.38680648803711,
        },
    ],
    marks: [{
        type: 'text',
        encode: {
            enter: {
                align: {
                    value: 'left',
                },
                fontSize: {
                    value: 12,
                },
                x: {
                    value: 60,
                },
                y: {
                    value: 20,
                },
                fill: {
                    value: 'red',
                },
            },
            update: {
                text: {
                    signal: 'zoom',
                },
            },
        },
    }, {
        type: 'text',
        encode: {
            enter: {
                align: {
                    value: 'left',
                },
                fontSize: {
                    value: 12,
                },
                x: {
                    value: 60,
                },
                y: {
                    value: 40,
                },
                fill: {
                    value: 'red',
                },
            },
            update: {
                text: {
                    signal: 'latitude',
                },
            },
        },
    }, {
        type: 'text',
        encode: {
            enter: {
                align: {
                    value: 'left',
                },
                fontSize: {
                    value: 12,
                },
                x: {
                    value: 60,
                },
                y: {
                    value: 60,
                },
                fill: {
                    value: 'red',
                },
            },
            update: {
                text: {
                    signal: 'longitude',
                },
            },
        },
    }],
    width: 300,
    height: 1200,
    padding: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 150,
    },
};

vegaAsLeafletLayer({
    spec,
})
    .then(([map, view]) => {
        // view.addSignalListener('buurt_hover_naam', (name, value) => {
        //     console.log(`signal ${name} now has value ${value}`);
        // });
    })
    .catch(e => console.error(e));
