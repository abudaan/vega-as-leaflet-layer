# Vega as Leaflet layer

Render Vega3 spec as layer on a Leaflet map, based on <https://github.com/nyurik/leaflet-vega>

## API
```javascript
// @flow
import vegaAsLeafletLayer from 'vega-as-leaflet-layer';

type OptionsType = {
    spec?: 'string | object',
    view?: 'VegaViewType',
    mapElement?: 'string | HTMLElement',
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
* `mapElement`: id or HTML element where the Leaflet map will be rendered to
* `container`: id or HTML element that will contain the mapElement, defaults to document.body
* `cssClassVegaLayer`: the css class or array of classes that will be applied to the div that contains the Vega layer in Leaflet.

## How it works

### Adding the map to the DOM

Leaflet can't render a map to an element that has not been added to the DOM. Therefor either `mapElement` or `container` have to refer to a live HTML element. Because `container` defaults to `document.body` the map will be rendered even if you omit both parameters. In that case a new div will be created for the map; this div has a unique id and will be added to the document's body.

Although the map will be rendered anyway, setting values for `mapElement` and/or `container` give you better control over where the map will be rendered on your page.

In most case you will set either `mapElement` or `container`; set `mapElement` if you want to add the Leaflet map to an existing element, and set `container` if you want to add one or more Leaflet maps to a specific container element.

1. If you set an id for `mapElement` and there is no element with that id added to the DOM, a new div with that id will be created and added to the element set by `container`.

2. If you set an HTML element for `mapElement` and that element has not been added to the DOM, it will be added to `container`.

3. If you set an id for `container` and there is no element with that id, a new div with that id will be created and added to the document's body.

4. If you set a HTML element for `container` and this element is not added to the DOM, it will be added to the document's body.

5. If you don't set a value for `container` and the provided `mapElement` has not been added to the DOM, the `mapElement` will be added to the document's body.

6. If the `mapElement` is live and `container` is not set then `container` is not necessary and will be discarded.

Note that in situation 3 and 4 you will get a an extra containing div around your Leaflet element.

### Applying styles

In a Vega specification you can set the width and the height as well as the padding. These values are not applied to the rendered Vega view but to the Leaflet map element instead; this will automatically set the dimensions of the Leaflet layer. Padding can't be applied to the Vega layer directly, but by applying the padding to the Leaflet map we achieve the same visual result.

In pseudo HTML:

```html
<div id="mapElement"
     padding="paddingFromVegaSpecification"
     width="widthFromVegaSpecification"
     height="heightFromVegaSpecification"
     class="leaflet-container ..."
>
    <div class="leaflet-pane leaflet-map-pane">
        <!-- rest of Leaflet map-->
    </div>
</div>
```

Note that this complete div will be added to the `container` (or ultimately to the document's body).

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

Add to an existing and live HTML element:

```javascript
import vegaAsLeafletLayer from 'vega-as-leaflet-layer';

const elem = document.getElementById('divid');

vegaAsLeafletLayer({
    spec: '../specs/spec3b.yaml',
    mapElement: elem,
});
```

Add and remove again:

```javascript
import vegaAsLeafletLayer from 'vega-as-leaflet-layer';

vegaAsLeafletLayer({
    spec: '../specs/spec3b.yaml',
})
.then(map => {
    setTimeout(() => {
        const parent = map.parentNode;
        parent.removeChild(map);
    }, 1000);
})
.catch(e => console.error(e));

```
