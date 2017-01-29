# CSS to TypeStyle converter

> Converts CSS to TypeStyle

## Why build this?

CSS comes from all kinds of sources.  Rather than sticking css in cssRaw in TypeStyle, why not convert it to TypeStyle?

## How to use it

```ts
import { convertCss } from 'css-to-typestyle';

convertCss('.redClass{ color: red }')
  .then((typestyleSource) => {
    // write out to file
  });
```
