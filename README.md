# Vega as Leaflet layer

Render Vega3 spec as layer on a Leaflet map, based on https://github.com/nyurik/leaflet-vega

## Basic usage

Pass a Vega view instance:

```javascript
import { View, parse } from 'vega';
import vegaAsLeafletLayer from 'vega-as-leaflet-layer';

const view = new View(parse(spec));
vegaAsLeafletLayer({
    view,
});
```

Or just pass a Vega specification:

```javascript
import vegaAsLeafletLayer from 'vega-as-leaflet-layer';

const spec = {
    ...
};

const view = new View(parse(spec));
vegaAsLeafletLayer({
    spec,
});
```

Either `spec` of `view`  are mandatory, other arguments are optional:

- mapContainer: id or HTML element that will contain the Leaflet map instance
- container: id or HTML element that will contain the mapContainer, defaults to document.body
