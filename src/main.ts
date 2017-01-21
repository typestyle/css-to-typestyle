import * as postcss from 'postcss';
import { DeclarationWalker, RuleWalker } from './walkers';

function prettyPrint(obj: any): string {
  return JSON.stringify(obj, undefined, 2);
}

export function convertCss(contents: string): Promise<string> {
  let fileContents = '';

  // create a css plugin for post css to parse and walk the document
  const cssPlugin = postcss.plugin('css-to-typestyle', (options: postcss.ProcessOptions): postcss.Transformer => {
    return (root: postcss.Root) => {
      fileContents = `import { cssRule, fontFace } from 'typestyle;\n`;

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
      const normalRulesContents = Object.keys(normalRules)
        .map((r: string) => `cssRule('${r}', ${prettyPrint(normalRules[r])});`);

      if (normalRulesContents) {
        fileContents += normalRulesContents.join('\n') + '\n';
      }

      // process at rules
      root.walkAtRules((atRule: postcss.AtRule) => {
        // process keyframes and media
        if (atRule.name === 'keyframes' || atRule.name.indexOf('media') === 0) {
          // todo: separate media out and use media() instead
          ruleWalker.clearRules();
          atRule.walkRules(ruleWalker.walk);
          fileContents += `cssRule('@${atRule.name} ${atRule.params}', ` + prettyPrint({ $nest: ruleWalker.getRules() }) + ');\n';
          return;
        }
        // process font-face
        if (atRule.name === 'font-face') {
          declarationWalker.clearProperties();
          atRule.walkDecls(declarationWalker.walk);
          fileContents += `fontFace(` + prettyPrint(declarationWalker.getProperties()) + ');\n';
          return;
        }
        // process page
        if (atRule.name === 'page') {
          declarationWalker.clearProperties();
          atRule.walkDecls(declarationWalker.walk);
          fileContents += `cssRule('@page', ` + prettyPrint(declarationWalker.getProperties()) + ');\n';
          return;
        }
      });
    };
  });

  return new Promise((resolve: (val: string) => void, reject: (val: string) => void) => {
    const postcss2 = postcss as Function;
    postcss2([cssPlugin])
      .process(contents, {})
      .then(() => resolve(fileContents), (err: string) => reject(err));
  });
};
