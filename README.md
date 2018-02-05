# Vega as Leaflet layer

Render a Vega specification as layer on a Leaflet map, based on <https://github.com/nyurik/leaflet-vega>.

## Table of Contents

   * [Vega as Leaflet layer](#vega-as-leaflet-layer)
      * [Table of Contents](#table-of-contents)
      * [Introduction](#introduction)
      * [API](#api)
      * [How it works](#how-it-works)
         * [Adding the map to the DOM](#adding-the-map-to-the-dom)
         * [Add the Leaflet css file](#add-the-leaflet-css-file)
         * [Applying styles](#applying-styles)
         * [Responsive maps](#responsive-maps)
      * [Examples](#examples)
         * [example 1](#example-1)
         * [example 2](#example-2)
         * [example 3](#example-3)
         * [example 4](#example-4)
         * [example 5](#example-5)
         * [example 6](#example-6)
         * [example 7](#example-7)
      * [TODO](#todo)

<sub>(toc created by [gh-md-toc](https://github.com/ekalinin/github-markdown-toc))</sub>

## Introduction

In `leaflet-vega` an extra function is added to the global `L` variable; you create a Vega layer by calling `L.vega(spec)`. You pass the specification (spec) as argument and it gets rendered into a Vega view in the constructor function of the layer.

In `vega-as-leaflet-layer` I have separated Vega and Leaflet; it consists a two parts, the first part is a class `VegaLayer` that is very much based on `leaflet-vega`, but it takes an instance of a Vega view as parameter so it has no dependencies on Vega.

The second part is a pre-processing function that returns a promise. It is the default export of the module, so you can import it with any name you want. The function either takes a Vega spec or a Vega view as argument. First the function checks if the mandatory signals `zoom` and `latitude` and `longitude` are defined, if not the promise rejects. In `leaflet-vega` the mandatory signals are added to the Vega view automatically if they are missing but that can yield weird results if you accidentally try to add a spec that is or does not need a map.

After the spec has passed the check, the DOM gets prepared for the Leaflet map, see [Adding the map to the DOM](#adding-the-map-to-the-dom), and the map gets rendered with the Vega view in a Layer. The promise returns an array that contains the div element that holds the map as first element, and the Vega view as second element. You can use these references for further manipulation, for instance if you want to remove the map from the DOM at a certain point in time ([example 5](#example-5)), or if you want to add event listeners to the view ([example 6](#example-6)).

## API
```javascript
// @flow
import vegaAsLeafletLayer from 'vega-as-leaflet-layer';

type OptionsType = {
    spec?: 'string | object',
    view?: 'VegaViewType',
    mapContainer?: 'false | string | HTMLElement',
    container?: 'string | HTMLElement',
    cssClassVegaLayer?: 'string | Array<string>',
    overruleVegaPadding?: 'boolean',
};

vegaAsLeafletLayer(options: OptionsType): Promise<any>
    .then([HTMLElement, VegaViewType])
    .catch(Error);

```
You have to set either `spec` or `view`, the other arguments are optional.

* `spec`: The Vega specification in one of the following formats
    * javascript object
    * JSON string
    * uri of a file that contains the specification in one of these formats
        * JSON
        * BSON
        * CSON
        * YAML
* `view`: An instance of a Vega view
* `mapContainer`: An id or a HTML element where the Leaflet map will be rendered to. Pass `false` if you don't want the Leaflet map to be rendered in a mapContainer, see below.
* `container`: An id or a HTML element that will contain the mapContainer, defaults to document.body
* `cssClassVegaLayer`: The css class or array of classes that will be applied to the div that contains the Vega layer in Leaflet.
* `overruleVegaPadding`: Set to `true` if you want to set the padding of the element that contains the Leaflet map by adding a css class or inline styling to that element. Defaults to `false` which means that the padding will be set as defined in the Vega spec.

## How it works

### Adding the map to the DOM

Leaflet can't render a map to an element that has not been added to the DOM. Therefor either `mapContainer` or `container` have to refer to a live HTML element (i.e. a HTML element that has been added to the DOM). If you omit both parameters a `mapContainer` div with a unique id will be created, the Leaflet map will be rendered in this `mapContainer` and the `mapContainer` itself will be added to the document's body.

Although the map will be rendered anyway, setting values for `mapContainer` and/or `container` gives you better control over where the map will be rendered on your page.

In most cases you will set either `mapContainer` or `container`; set `mapContainer` if you want to add a Leaflet map to an existing element, and set `container` if you want to add one or more Leaflet maps to a specific container element.

1. If you set an id for `mapContainer` and there is no element with that id added to the DOM, a new div with that id will be created and added to the element set by `container`.

2. If you set an HTML element for `mapContainer` and that element has not been added to the DOM, it will be added to `container`.

3. If you set `mapContainer` to false the Leaflet map will be added directly to the `container`. In this case you need to set `container` to a live HTML element because Leaflet can not add maps to the document's body.

4. If you set an id for `container` and there is no element with that id, a new div with that id will be created and added to the document's body.

5. If you set a HTML element for `container` and this element is not added to the DOM, it will be added to the document's body.

6. If you don't set a value for `container` and the provided `mapContainer` has not been added to the DOM, the `mapContainer` will be added to the document's body.

7. If the `mapContainer` is live and `container` is not set then `container` is not necessary and will be discarded.

8. If you don't set a value for `container` and `mapElement` is set to `false`, an error will be thrown.


### Add the Leaflet css file

Leaflet comes with a css file that takes care of the positioning of the tiles of a map so you should include this file in your HTML page or compile it into your own custom css files. You can add it to your page using unpkg:

```html
<link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"
    integrity="sha512-M2wvCLH6DSRazYeZRIm1JnYyh22purTM+FDB5CsyxtQJYeKq83arPe5wgbNmcFXGqiSH2XR8dT/fJISVA1r/zQ=="
    crossorigin=""/>
```

If you install `vega-as-leaflet-layer` using `npm` of `yarn` you can find the css file in the folder `node_modules/leaflet/dist` as well.


### Applying styles

In a Vega specification you can set the width and the height as well as the padding. The width and the height are applied to the Leaflet map element and the padding is applied to the `mapContainer`, or to the `container` if `mapContainer` is set to `false`. The reason for this is that if you apply the padding to the Leaflet map element directly, the Vega layer will be padded inside the Leaflet map which means that it won't appear at position 0,0 and thus the Vega layer is not well-aligned with the map.

Therefor the Leaflet map always needs a containing element if you want to apply padding. This containing element is by default the value set for `mapContainer` but if you set `mapContainer` to `false` the containing element is the `container`.

The existing padding of the containing element will be overruled by the padding as set in the Vega specification. If you want to keep the element's own padding you can set `overruleVegaPadding` to true.

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

### Responsive maps

If you want a responsive map and thus a responsive Vega layer, you have set these values in the spec:

```yaml
autosize: none # other values can yield weird results
width: 0 # don't define width at all or set it to 0
height: 0 # don't define height at all or set it to 0

# in your sigals array add these two:
signals:
- name: width
  on:
  - events:
    source: window
    type: resize
    update: "containerSize()[0] - padding.left - padding.right"
- name: height
  on:
  - events:
    source: window
    type: resize
    update: "containerSize()[1] - padding.top - padding.bottom"
```

This will make your Vega view responsive. The width and height of the `mapContainer` will be set to 100% so it resizes automatically together with the `container` element, which makes the Leaflet layer responsive as well.


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

## TODO

Add examples for Common JS and add support and examples for UMD (for coding like it's 1999).
