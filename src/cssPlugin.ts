const postcss = require('postcss');
import { clearDecls, clearRules, getDecls, getImports, getRules, walkDecls, walkRules } from './cssWalkers';

let fileContents = '';
export const cssPlugin = postcss.plugin('css-to-typestyle', function myplugin(options: any) {
    return (css: any) => {
        fileContents = getImports();

        // process regular rules
        clearRules();
        css.walkRules((rule: any) => {
            const parentType = rule.parent && rule.parent.type;
            if (parentType === 'atrule') {
                return;
            }
            walkRules(rule);
        });
        const normalRules = getRules();
        fileContents += Object.keys(normalRules)
            .map(r => `\ncssRule('${r}',${JSON.stringify(normalRules[r])});`)
            .join('');
              
        // process at rules
        css.walkAtRules((atRule: any) => {
            // process keyframes, use cssRule to avoid breaking css
            if (atRule.name === 'keyframes') {
                clearRules();
                atRule.walkRules(walkRules);
                fileContents += `\ncssRule('@keyframes ${atRule.params}',` + JSON.stringify({ $nest: getRules() }) + ');';
                return;
            }

            if (atRule.name === 'font-face') {
                clearDecls();
                atRule.walkDecls(walkDecls);
                fileContents += `\nfontFace(` + JSON.stringify(getDecls()) + ');';
                return;
            } else {

            }
        });
    }
});

export function getContents() {
    return fileContents;
}