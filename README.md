# Vega as Leaflet layer

Render Vega3 spec as layer on a Leaflet map, based on https://github.com/nyurik/leaflet-vega

## Basic usage

```javascript
import vegaAsLeafletLayer from 'vega-as-leaflet-layer';

const view = new View(parse(spec));
vegaAsLeafletLayer({
    view,
    elementId: 'map',
});
```
