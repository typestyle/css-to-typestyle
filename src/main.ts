const postcss = require('postcss');
import { cssPlugin, getContents } from './cssPlugin';

export const convertCss = (contents: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    postcss([cssPlugin])
      .process(contents, {})
      .then(() => resolve(getContents()), (err: any) => reject(err));
  });
};

