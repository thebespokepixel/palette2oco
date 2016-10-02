# palette2oco converter 
> Load or convert files or directories of various palette formats to structured Open Color data or .oco files.
>
> [![Build Status][build-badge]][travis]
> [![Dependency Status][david-badge]][david]
> [![Code Climate][code-climate-badge]][code-climate]
> [![Known Vulnerabilities][snyk-badge]][snyk]
> [![npm Status][npm-badge]][npm]
> [![Chat on Gitter][gitter-badge]][gitter]  
> ![Project status][project-badge]
> [![devDependency Status][david-dev-badge]][david-dev]
> [![Coverage][coverage-badge]][coverage]
> [![Inline docs][inch-badge]][inch]
> [![ES support][es-badge]][es]

## Load structured palette data from various tools into Open Color format.

```js
import {paletteReader, paletteWriter, console} from 'palette2oco'

paletteReader(pathRoot).load(pathArray)
  .then(palette => palette.render(ocoPath))
  .then(oco => paletteWriter(destinationFile, oco))
  .catch(err => {
    console.error(err)
  })

```

## Convert palette data from a variety of sources into Open Color .oco format.

Allows structured directories of pallette data to be converted into nested oco palette data.

###Formats supported:

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


[gitter-badge]: https://img.shields.io/gitter/room/MarkGriffiths/help.svg?style=flat
[project-badge]: http://img.shields.io/badge/status-experimental-red.svg?style=flat
[build-badge]: http://img.shields.io/travis/MarkGriffiths/palette2oco.svg?branch=master&style=flat
[david-badge]: http://img.shields.io/david/MarkGriffiths/palette2oco.svg?branch=master&style=flat
[david-dev-badge]: http://img.shields.io/david/dev/MarkGriffiths/palette2oco.svg?branch=master&style=flat
[npm-badge]: https://img.shields.io/npm/v/@thebespokepixel/palette2oco.svg?style=flat&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU%2BbnBtPC90aXRsZT48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxyZWN0IGZpbGwtb3BhY2l0eT0iLjMiIGZpbGw9IiMwMDAiIHg9IjIiIHk9IjExIiB3aWR0aD0iMTAiIGhlaWdodD0iMiIgcng9IjEiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMiAyaDEwdjEwSDJ6Ii8%2BPHBhdGggZmlsbD0iI0MxMjEyNyIgZD0iTTMgMTFoNFY1aDJ2NmgyVjNIM3oiLz48L2c%2BPC9zdmc%2B
[es-badge]: https://img.shields.io/badge/es2015-jsnext%3Amain_%E2%9C%94-64CA39.svg?style=flat&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABGdBTUEAALGPC%2FxhBQAAAgxJREFUKBVjZEAC%2F%2F%2F%2FZ3nx4oXNnz9%2FKjk4OGS%2BfPny4fv37yFaWlrPkZSBmUwwgR8%2Ffqi%2BefPmAVDh6rVr1%2FImJyffePDggaiEhMQ1oIGcMHUodH5%2Bvg%2FQ9O%2BfP3%2F%2B5uzsPBMoKQnETG5ubtW3b99%2BWVVVJY6iASQJEpg4cSJfeHj4trNnzz4NDAz8CRQCOe1fdHT0n79AcOzYsa8gdbgAf1FR0cYLFy48AjqNEeh0dZALysvLdwM1wL0E08wCYwDpj79%2F%2F94BtED%2Fzp070qysrEcvX758d8qUKcVAuX9I6sBMFJO4ublfGBgYyLKxsZ29du3aK6BTS79%2B%2FXoJ6H%2BPp0%2BfLgO6RBBmALKNjO%2FevbMASjIAbfxobGwsffXqVQ9g4HABDVwLDO3Pz58%2FdwTKSzMyMv5DtvE%2FMOjPXb9%2B%2FXlQUFBmcHDwDqCi2Fu3bpW9ffv2y%2B7du68B45Zn5syZQSBbkTUyACPaBRggPz9%2B%2FLjvyJEjkd3d3addXFwUd%2B7ceRsYTRrAMPh748YNOQyNcnJyTvv3738ClPgPxP%2FOnDnTz8PDwy4rK%2Fu4ra1tLwsLCzMw1D%2BCNMJBQkKC6sOHD1%2BHhYVlwwUZGFiANq4CpqjPwMB5B4yuXUA5ESR5BpAz806fPv1AQUHBAkWCgYGDi4urTVpaej5QXABNDsw1AJKB2CSAYoxQDJcGADWj9%2Fy2a%2BooAAAAAElFTkSuQmCC
[snyk-badge]: https://snyk.io/test/github/markgriffiths/palette2oco/badge.svg?style=flat
[inch-badge]: http://inch-ci.org/github/MarkGriffiths/palette2oco.svg?branch=master&style=shields
[code-climate-badge]: https://codeclimate.com/github/MarkGriffiths/palette2oco/badges/gpa.svg
[coverage-badge]: https://codeclimate.com/github/MarkGriffiths/palette2oco/badges/coverage.svg

[travis]: https://travis-ci.org/MarkGriffiths/palette2oco
[david]: https://david-dm.org/MarkGriffiths/palette2oco/master
[david-dev]: https://david-dm.org/MarkGriffiths/palette2oco/master#info=devDependencies
[npm]: https://www.npmjs.com/package/@thebespokepixel/palette2oco
[snyk]: https://snyk.io/test/github/markgriffiths/palette2oco
[code-climate]: https://codeclimate.com/github/MarkGriffiths/palette2oco
[coverage]: https://codeclimate.com/github/MarkGriffiths/palette2oco/coverage
[inch]: http://inch-ci.org/github/MarkGriffiths/palette2oco
[es]: https://github.com/rollup/rollup/wiki/jsnext:main
[gitter]: https://gitter.im/MarkGriffiths/help?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
