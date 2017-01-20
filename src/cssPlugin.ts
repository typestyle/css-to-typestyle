const postcss = require('postcss');
import { clearRules, getImports, getRules, walkRules } from './cssWalkers';

let fileContents = '';
export const cssPlugin = postcss.plugin('css-to-typestyle', function myplugin(options: any) {
    return (css: any) => {
        fileContents = getImports();

        // process regular rules
        clearRules();
        css.walkRules(walkRules);
        fileContents += getRules();      
    }
});

export function getContents() {
    return fileContents;
}