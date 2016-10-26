#### Load structured palette data from various tools into Open Color format.

```js
import {paletteReader, paletteWriter, console} from 'palette2oco'

paletteReader(pathRoot).load(pathArray)
  .then(palette => palette.render(ocoPath))
  .then(oco => paletteWriter(destinationFile, oco))
  .catch(err => {
    console.error(err)
  })

```

#### Convert palette data from a variety of sources into Open Color .oco format.

Allows structured directories of pallette data to be converted into nested oco palette data.

##### Formats supported:

- Sip (http://sipapp.io): Supports .sippalette and .json exports.

- Abobe Swatch Exchange (ASE): Full support of RGB, CMYK and Lab colorspaces.

- Vanilla JSON: File signature must match the following...

```js
{
  "name" : "Palette name",
  "colors" : [
    {
      name: "Color name",
      red: (0.0 - 1.0 | 0 - 255)
      green: (0.0 - 1.0 | 0 - 255)
      blue: (0.0 - 1.0 | 0 - 255)
      alpha: (0.0 - 1.0 | 0 - 255)
    }
    ...
  ]
}
```
