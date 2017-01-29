# CSS to TypeStyle converter

> Convert your raw CSS to TypeScript

[![npm version](https://badge.fury.io/js/css-to-typestyle.svg)](https://badge.fury.io/js/css-to-typestyle) 
[![Build Status](https://travis-ci.org/typestyle/css-to-typestyle.svg?branch=master)](https://travis-ci.org/typestyle/css-to-typestyle)
[![Downloads](https://img.shields.io/npm/dm/css-to-typestyle.svg)](https://www.npmjs.com/package/css-to-typestyle)

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
