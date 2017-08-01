import * as postcss from 'postcss';
import { Properties } from '../types';
export declare class RuleWalker {
    private _rules;
    clearRules(): void;
    getRules(): {
        [selector: string]: Properties;
    };
    walk: (rule: postcss.Rule) => void;
}
