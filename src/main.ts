import * as postcss from 'postcss';
import { cssPlugin, getContents } from './cssPlugin';

// typings on postcss don't appear to be correct
const postcss2 = postcss as Function;

export function convertCss(contents: string): Promise<string> {
  return new Promise((resolve, reject) => {
    postcss2([cssPlugin])
      .process(contents, {})
      .then(() => resolve(getContents()), (err: any) => reject(err));
  });
};

