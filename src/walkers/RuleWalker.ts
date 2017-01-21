import * as postcss from 'postcss';
import { DeclarationWalker } from './DeclarationWalker';
import { Properties } from '../types';


export class RuleWalker {
  private _rules: { [selector: string]: Properties; } = {};

  public clearRules(): void {
    this._rules = {};
  }

  public getRules(): { [selector: string]: Properties; } {
    return this._rules;
  }

  public walk = (rule: postcss.Rule): void => {
    const decWalker = new DeclarationWalker();

    // find all rules and collect the properties
    rule.walkDecls((dec: postcss.Declaration) => {
      decWalker.walk(dec);
    });

    // convert to string and add to file
    this._rules[rule.selector] = decWalker.getProperties();
  }
}
