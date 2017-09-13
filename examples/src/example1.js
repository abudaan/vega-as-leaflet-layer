import { View, parse } from 'vega';
import vegaAsLeafletLayer from '../../src/index';

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
    height: 600,
    padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
    },
};

const view = new View(parse(spec));

vegaAsLeafletLayer({
    // view,
    spec,
    // mapContainer: 'map',
    // container: document.body,
});
