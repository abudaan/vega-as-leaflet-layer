# Vega as Leaflet layer

Render a Vega specification as layer on a Leaflet map, based on <https://github.com/nyurik/leaflet-vega>.

## Table of Contents

   * [Vega as Leaflet layer](#vega-as-leaflet-layer)
      * [Table of Contents](#table-of-contents)
      * [Introduction](#introduction)
      * [API](#api)
      * [How it works](#how-it-works)
         * [Adding the map to the DOM](#adding-the-map-to-the-dom)
         * [Applying styles](#applying-styles)
      * [Examples](#examples)
         * [example 1](#example-1)
         * [example 2](#example-2)
         * [example 3](#example-3)
         * [example 4](#example-4)
         * [example 5](#example-5)
         * [example 6](#example-6)
         * [example 7](#example-7)

<sub>(toc created by [gh-md-toc](https://github.com/ekalinin/github-markdown-toc))</sub>

## Introduction

In `leaflet-vega` extra functionality is added to the global `L` variable. A Vega layer is created by calling `L.vega(spec)`; you pass the specification and it gets rendered into a view in the constructor function of the layer.

In `vega-as-leaflet-layer` I have separated Vega and Leaflet; it consists a two parts, the first part is a class `VegaLayer` that is very much based on `leaflet-vega`, but it takes an instance of a Vega view as parameter so it has not dependencies on Vega.

The second part is a pre-processing function that returns a promise. It is the default export of the module, so you can import it with any name you want. The function either takes a Vega specification or a Vega view as argument. First the function checks if the mandatory signals `zoom` and `latitude` and `longitude` are defined, if not the promise rejects. In `leaflet-vega` the mandatory signals are added to the spec automatically if they are missing but that can yield weird results if you accidentally try to add a spec that is or does not need a map.

After the spec has passed the check, the DOM gets prepared for the Leaflet map, see [Adding the map to the DOM](#adding-the-map-to-the-dom), and the map gets rendered with the Vega view in a Layer. The promise returns an array that contains the div element that holds the map as first element, and the Vega view as second element. You can use these references for further manipulation, for instance if you want to remove the map from the DOM at a certain point in time ([example 5](#example-5)), or if you want to add event listeners to the view ([example 6](#example-6)).

## API
```javascript
// @flow
import vegaAsLeafletLayer from 'vega-as-leaflet-layer';

type OptionsType = {
    spec?: 'string | object',
    view?: 'VegaViewType',
    mapContainer?: 'string | HTMLElement',
    container?: 'string | HTMLElement',
    cssClassVegaLayer?: 'string | Array<string>',
};

vegaAsLeafletLayer(options: OptionsType): Promise<any>
    .then(null | HTMLElement)
    .catch(Error);

```
You have to set either `spec` or `view`, the other 2 arguments are optional.

* `spec`: is the Vega specification in one of the following formats
    * javascript object
    * JSON string
    * uri of a file that contains the specification in one of these formats
        * JSON
        * BSON
        * CSON
        * YAML
* `view`: an instance of a Vega view
* `mapContainer`: id or HTML element where the Leaflet map will be rendered to
* `container`: id or HTML element that will contain the mapContainer, defaults to document.body
* `cssClassVegaLayer`: the css class or array of classes that will be applied to the div that contains the Vega layer in Leaflet.

## How it works

### Adding the map to the DOM

Leaflet can't render a map to an element that has not been added to the DOM. Therefor either `mapContainer` or `container` have to refer to a live HTML element. Because `container` defaults to `document.body` the map will be rendered even if you omit both parameters. In that case a new div will be created for the map; this div has a unique id and will be added to the document's body.

Although the map will be rendered anyway, setting values for `mapContainer` and/or `container` give you better control over where the map will be rendered on your page.

In most case you will set either `mapContainer` or `container`; set `mapContainer` if you want to add the Leaflet map to an existing element, and set `container` if you want to add one or more Leaflet maps to a specific container element.

1. If you set an id for `mapContainer` and there is no element with that id added to the DOM, a new div with that id will be created and added to the element set by `container`.

2. If you set an HTML element for `mapContainer` and that element has not been added to the DOM, it will be added to `container`.

3. If you set an id for `container` and there is no element with that id, a new div with that id will be created and added to the document's body.

4. If you set a HTML element for `container` and this element is not added to the DOM, it will be added to the document's body.

5. If you don't set a value for `container` and the provided `mapContainer` has not been added to the DOM, the `mapContainer` will be added to the document's body.

6. If the `mapContainer` is live and `container` is not set then `container` is not necessary and will be discarded.

Note that in situation 3 and 4 you will get a an extra containing div around your Leaflet element.

### Applying styles

In a Vega specification you can set the width and the height as well as the padding. The width and the height are applied to the Leaflet map element and the padding is applied to the `mapContainer`. This is because if you apply the padding to the Leaflet map element, the Vega layer will be padded.

In pseudo HTML:

```html
<div id="mapContainer"
    padding="paddingFromVegaSpecification"
>
    <div id="mapContainer-map">
        width="widthFromVegaSpecification"
        height="heightFromVegaSpecification"
        class="leaflet-container ..."
    >
        <div class="leaflet-pane leaflet-map-pane">
            <!-- rest of Leaflet map-->
        </div>
    </div>
</div>
```

Note that this complete div will be added to the `container` (or ultimately to the document's body).

## Examples

In all examples I have named the default export `vegaAsLeafletLayer`, but you can import it with any name you want.

### example 1

Pass a Vega view instance:

```javascript
import { View, parse } from 'vega';
import vegaAsLeafletLayer from 'vega-as-leaflet-layer';

const view = new View(parse(spec));
vegaAsLeafletLayer({
    view,
});
```

### example 2

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

### example 3

Or pass the uri of Vega specification:

```javascript
import vegaAsLeafletLayer from 'vega-as-leaflet-layer';

vegaAsLeafletLayer({
    spec: '../specs/spec3b.yaml',
});
```

### example 4

Add to an existing and live HTML element:

```javascript
import vegaAsLeafletLayer from 'vega-as-leaflet-layer';

const elem = document.getElementById('divid');

vegaAsLeafletLayer({
    spec: '../specs/spec3b.yaml',
    mapContainer: elem,
});
```

### example 5

Add and remove again:

```javascript
import vegaAsLeafletLayer from 'vega-as-leaflet-layer';

vegaAsLeafletLayer({
    spec: '../specs/spec3b.yaml',
})
.then([map, view] => {
    setTimeout(() => {
        const parent = map.parentNode;
        parent.removeChild(map);
    }, 1000);
})
.catch(e => console.error(e));

```

### example 6

Add signal listener to Vega view:

```javascript
import vegaAsLeafletLayer from 'vega-as-leaflet-layer';

vegaAsLeafletLayer({
    spec: '../specs/spec3b.yaml',
})
.then([map, view] => {
    view.addSignalListener('someSignal', (name, value) => {
        console.log(`signal ${name} now has value ${value}`);
    });
})
.catch(e => console.error(e));

```

### example 7

Exotic example creating a `VegaLayer` instance first and then add it to a Leaflet map manually. As you can see you have to perform a lot of pre-processing: all this is taken care of by the library for you in the examples above. I have just added this example to show you the flexibility of this library.

```javascript
/* eslint no-underscore-dangle: 0 */

import { View, parse } from 'vega';
import { TileLayer, Map } from 'leaflet';
import { load } from 'fetch-helpers';
import { VegaLayer } from 'vega-as-leaflet-layer';

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

```
