import * as postcss from 'postcss';
import { DeclarationWalker, RuleWalker } from './walkers';

export function convertCss(contents: string): Promise<string> {
  let fileContents = '';

  // create a css plugin for post css to parse and walk the document
  const cssPlugin = postcss.plugin('css-to-typestyle', (options: postcss.ProcessOptions): postcss.Transformer => {
    return (root: postcss.Root) => {
      fileContents = `import{cssRule,fontFace}from'typestyle';`;

      const ruleWalker = new RuleWalker();
      const declarationWalker = new DeclarationWalker();

      // process regular rules
      root.walkRules((rule: postcss.Rule) => {
        const parentType = rule.parent && rule.parent.type;
        if (parentType === 'atrule') {
          return;
        }
        ruleWalker.walk(rule);
      });
      const normalRules = ruleWalker.getRules();
      fileContents += Object.keys(normalRules)
        .map((r: string) => `\ncssRule('${r}',${JSON.stringify(normalRules[r])});`)
        .join('');

      // process at rules
      root.walkAtRules((atRule: postcss.AtRule) => {
        // process keyframes and media
        if (atRule.name === 'keyframes' || atRule.name.indexOf('media') === 0) {
          ruleWalker.clearRules();
          atRule.walkRules(ruleWalker.walk);
          fileContents += `\ncssRule('@${atRule.name} ${atRule.params}',` + JSON.stringify({ $nest: ruleWalker.getRules() }) + ');';
          return;
        }
        // process font-face
        if (atRule.name === 'font-face') {
          declarationWalker.clearProperties();
          atRule.walkDecls(declarationWalker.walk);
          fileContents += `\nfontFace(` + JSON.stringify(declarationWalker.getProperties()) + ');';
          return;
        }
        // process page
        if (atRule.name === 'page') {
          declarationWalker.clearProperties();
          atRule.walkDecls(declarationWalker.walk);
          fileContents += `\ncssRule('@page',` + JSON.stringify(declarationWalker.getProperties()) + ');';
          return;
        }
      });
    };
  });

  return new Promise((resolve, reject) => {
    const postcss2 = postcss as Function;
    postcss2([cssPlugin])
      .process(contents, {})
      .then(() => resolve(fileContents), (err: string) => reject(err));
  });
};
