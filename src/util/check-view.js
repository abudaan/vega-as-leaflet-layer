/* eslint no-underscore-dangle: 0 */

import { View, parse } from 'vega';
import { load } from 'fetch-helpers';
import getPadding from './get-padding';

const checkView = async (spec, view) => {
    let error;
    if (
        (typeof spec === 'undefined' || spec === null) &&
        (typeof view === 'undefined' || view === null)
    ) {
        error = 'Please provide at least spec or a Vega view instance.';
        throw new Error(error);
    }

    // check if the provided view or spec is valid
    let vegaView = view;
    let padding;
    if (typeof view === 'undefined') {
        let s;
        try {
            s = await load(spec);
        } catch (e) {
            throw e;
        }
        try {
            vegaView = new View(parse(s));
        } catch (e) {
            error = `Not a valid spec: ${e}`;
            throw new Error(error);
        }
        padding = getPadding(vegaView);
    } else {
        try {
            padding = getPadding(vegaView);
        } catch (e) {
            error = `Not a valid view: ${e}`;
            throw new Error(error);
        }
    }

    // check for the mandatory signals
    const {
        zoom,
        latitude,
        longitude,
    } = vegaView._runtime.signals || [];

    if (typeof zoom === 'undefined' || typeof latitude === 'undefined' || typeof longitude === 'undefined') {
        error = 'Incomplete specification; if you want to add Vega as a Leaflet layer you defined provide signals for zoom, latitude and longitude';
        throw new Error(error);
    }

    return {
        zoom,
        latitude,
        longitude,
        padding,
        vegaView,
    };
};

export default checkView;
