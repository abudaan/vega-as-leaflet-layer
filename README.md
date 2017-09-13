# Vega as Leaflet layer

Render Vega3 spec as layer on a Leaflet map, based on <https://github.com/nyurik/leaflet-vega>

## API
```javascript
import vegaAsLeafletLayer from 'vega-as-leaflet-layer';

vegaAsLeafletLayer({
    spec: '<string> | <object> | undefined',
    view: '<VegaView> | undefined',
    mapContainer: '<string> | undefined',
    container: '<string> | undefined',
});
```
You have to set either `spec` or `view`, the other 2 arguments are optional.

- `mapContainer`: id or HTML element that will contain the Leaflet map instance
- `container`: id or HTML element that will contain the mapContainer, defaults to document.body

## Examples

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

vegaAsLeafletLayer({
    spec,
});
```

Or pass the uri of Vega specification:

```javascript
import vegaAsLeafletLayer from 'vega-as-leaflet-layer';

vegaAsLeafletLayer({
    spec: '../specs/spec3b.yaml',
});
```
