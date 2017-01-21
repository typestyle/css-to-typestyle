import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import { convertCss } from '../src/main';

describe('basic', () => {
  it('correctly parses .rule declarations', (done) => {
    const testCase =
      `.rule{
        color: rgb(255, 0, 0);
        opacity: 0;
      }`;

    const result =
`import { cssRule, fontFace } from 'typestyle;
cssRule('.rule', {
  "color": "rgb(255, 0, 0)",
  "opacity": 0
});
`;

    expect(convertCss(testCase)).to.eventually.equal(result).notify(done);
  });

  it('correctly parses @font-face', (done) => {
    const testCase =
      `@font-face {
        font-family: 'Roboto';
      }`;

    const result =
`import { cssRule, fontFace } from 'typestyle;

fontFace({
  "fontFamily": "'Roboto'"
});
`;

    expect(convertCss(testCase)).to.eventually.equal(result).notify(done);
  });

  it('correctly parses @keyframes', (done) => {
    const testCase =
`@keyframes fadeOut {
      0% {
          opacity: 1;
      }
      100% {
          opacity: 0
      }
  }`;

    const result =
`import { cssRule, fontFace } from 'typestyle;

cssRule('@keyframes fadeOut', {
  "$nest": {
    "0%": {
      "opacity": 1
    },
    "100%": {
      "opacity": 0
    }
  }
});
`;

    expect(convertCss(testCase)).to.eventually.equal(result).notify(done);
  });

  it('correctly parses @page', (done) => {
    const testCase = `@page {
      margin: 2cm
  }`;

    const result =
`import { cssRule, fontFace } from 'typestyle;

cssRule('@page', {
  "margin": "2cm"
});
`;

    expect(convertCss(testCase)).to.eventually.equal(result).notify(done);
  });
});
