import * as postcss from 'postcss';
import { Properties } from '../types';
export declare class DeclarationWalker {
    private _props;
    clearProperties(): void;
    getProperties(): Properties;
    walk: (dec: postcss.Declaration) => void;
}
