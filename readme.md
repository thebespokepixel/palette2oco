# palette2oco converter

> Load or convert files or directories of various palette formats to structured Open Color data or .oco files.

##### Status

[![npm](https://img.shields.io/npm/v/@thebespokepixel/palette2oco.svg?style=flat&logo=npm)](https://www.npmjs.com/package/@thebespokepixel/palette2oco "npm") [![Travis](https://img.shields.io/travis/thebespokepixel/palette2oco.svg?branch=master&style=flat&logo=travis)](https://travis-ci.org/thebespokepixel/palette2oco "Travis") [![David](https://img.shields.io/david/thebespokepixel/palette2oco.svg?branch=master&style=flat)](https://david-dm.org/thebespokepixel/palette2oco/master "David")  
 [![Code-climate](https://api.codeclimate.com/v1/badges/d58dd3cdc1459632afa5/maintainability?style=flat)](https://codeclimate.com/github/thebespokepixel/palette2oco/maintainability "Code-climate") [![Coverage](https://api.codeclimate.com/v1/badges/d58dd3cdc1459632afa5/test_coverage?style=flat)](https://codeclimate.com/github/thebespokepixel/palette2oco/test_coverage "Coverage") [![Snyk](https://img.shields.io/snyk/vulnerabilities/github/thebespokepixel/palette2oco.svg?style=flat&logo=npm)](https://snyk.io/test/github/thebespokepixel/palette2oco "Snyk")   

##### Developer

[![Greenkeeper](https://badges.greenkeeper.io/thebespokepixel/palette2oco.svg)](https://greenkeeper.io/ "Greenkeeper") [![David-developer](https://img.shields.io/david/dev/thebespokepixel/palette2oco.svg?branch=master&style=flat)](https://david-dm.org/thebespokepixel/palette2oco/master#info=devDependencies "David-developer") [![Rollup](https://img.shields.io/badge/es6-module%3Amjs_%E2%9C%94-64CA39.svg?style=flat&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPHBhdGggZmlsbD0iI0ZGMzMzMyIgZD0iTTEwLjkwNDI4MjQsMy4wMDkxMDY4MyBDMTEuMjM4NzA1NSwzLjU4MjgzNzEzIDExLjQyODU3MTQsNC4yNDQ4MzM2MyAxMS40Mjg1NzE0LDQuOTUwOTYzMjIgQzExLjQyODU3MTQsNi40MTc4NjM0IDEwLjYwODY5NTcsNy42OTU2MjE3MiA5LjM5MTgyNzM5LDguMzc2NTMyNCBDOS4zMDU1MjQ2OCw4LjQyNDg2ODY1IDkuMjczMTYxMTYsOC41MzIwNDkwNCA5LjMxODQ3MDA5LDguNjE4MjEzNjYgTDExLjQyODU3MTQsMTMgTDUuMjU4NjgyODEsMTMgTDIuMzM5Nzc3MjMsMTMgQzIuMTUyMTIzNDUsMTMgMiwxMi44NDgyNzU3IDIsMTIuNjUzODA0OCBMMiwxLjM0NjE5NTIyIEMyLDEuMTU0OTk2ODggMi4xNDgzMTU0MywxIDIuMzM5Nzc3MjMsMSBMNy42NjAyMjI3NywxIEM3LjcwMTU0MTQ5LDEgNy43NDExMzc2NCwxLjAwNzM1NTg4IDcuNzc3NzY2NTgsMS4wMjA5MDQyOSBDOS4wNjQ1MzgyOCwxLjE0NDU0MDA0IDEwLjE3MzM4ODQsMS44NTM4NTI5MSAxMC44MjIyOTQ5LDIuODcyNTA0MzggQzEwLjc5OTE5NTMsMi44NDQ4NDgwNiAxMC44NDQ0OTkxLDIuOTQ5MTc0NzYgMTAuOTA0MjgyNCwzLjAwOTEwNjgzIFoiLz4KICAgIDxwYXRoIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iLjMxIiBkPSJNOC44NTcxNDI4NiwzLjU3MTQyODU3IEw2LjcxNDI4NTcxLDYuNTcxNDI4NTcgTDkuMjg1NzE0MjksNS4yODU3MTQyOSBDOS4yODU3MTQyOSw1LjI4NTcxNDI5IDkuNzE0Mjg1NzEsNC44NTcxNDI4NiA5LjI4NTcxNDI5LDQuNDI4NTcxNDMgQzkuMjg1NzE0MjksNCA4Ljg1NzE0Mjg2LDMuNTcxNDI4NTcgOC44NTcxNDI4NiwzLjU3MTQyODU3IFoiLz4KICAgIDxwYXRoIGZpbGw9IiNGQkIwNDAiIGQ9Ik0yLjg0Njc0NjAzLDEyLjk5NTg0OTUgQzMuMjY0OTIwNjIsMTIuOTk1ODQ5NSAzLjE4NTkzMDM0LDEyLjk0NjM2NjkgMy4zMTYxMTYzOCwxMi44NzM5MDU0IEMzLjYxODE3NTg3LDEyLjcwNTc3OTMgNS42ODk0NDA5OSw4LjcxMjc4NDU5IDcuNzE3NTU0NzYsNi44MjEzNjYwMiBDOS43NDU2Njg1Miw0LjkyOTk0NzQ2IDEwLjAwNDU3NjcsNS41NjA0MjAzMiA4Ljg4NDc5ODk1LDMuNTAyOTc3MjMgQzguODg0Nzk4OTUsMy41MDI5NzcyMyA5Ljc0NzgyNjA5LDUuMTQyMjA2NjUgOS4wMTQyNTMwMiw1LjI2ODMwMTIzIEM4LjQzODE4MjQxLDUuMzY3MDc1MzEgNy4xMTk5MDg0Nyw0LjEyMjk0MjIxIDcuNjExODMzOTMsMy4wMDQ5MDM2OCBDOC4wOTA4MTM5OSwxLjkxNDE4NTY0IDEwLjAxOTY3OTYsMi4xMjAxNDAxMSAxMC45MDY0NCwzLjAwOTEwNjgzIEMxMC44NzgzOTE2LDIuOTYyODcyMTUgMTAuODUwMzQzMiwyLjkxNjYzNzQ4IDEwLjgyMjI5NDksMi44NzI1MDQzOCBDMTAuMzA0NDc4NiwyLjI1MjUzOTQgOS41MDQwMjA5MiwxLjkwMzY3Nzc2IDguNzEwMDM1OTYsMS45MDM2Nzc3NiBDNy4xOTk3Mzg0OCwxLjkwMzY3Nzc2IDYuODIwMDA2NTQsMi40MjY5NzAyMyAzLjkyMDIzNTM3LDcuNjE5OTY0OTcgQzIuMzg3Nzk5MzQsMTAuMzY1NDA2NyAyLjAxMDgzMTkzLDExLjU3MzUwNzkgMi4wMDYyOTA2OSwxMi4xNjk4MTgyIEMyLDEyLjk5NTg0OTUgMi4wMDYyOTA2OSwxMi45OTU4NDk1IDIuODQ2NzQ2MDMsMTIuOTk1ODQ5NSBaIi8%2BCiAgPC9nPgo8L3N2Zz4K)](https://github.com/rollup/rollup/wiki/pkg.module "Rollup")   

##### Help

[![Inch](https://inch-ci.org/github/thebespokepixel/palette2oco.svg?branch=master&style=shields)](https://inch-ci.org/github/thebespokepixel/palette2oco "Inch")   


## Usage

#### Load structured palette data from various tools into Open Color format.

```js
import {paletteReader, paletteWriter, oco2Object, oco2Vars} from 'palette2oco'

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

-   Sip (<http://sipapp.io>): Supports .sippalette and .json exports.

-   Abobe Swatch Exchange (ASE): Full support of RGB, CMYK and Lab colorspaces.

-   Vanilla JSON: File signature must match the following...

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


## Documentation

Full documentation can be found at [https://thebespokepixel.github.io/palette2oco/][1]

[1]: https://thebespokepixel.github.io/palette2oco/
