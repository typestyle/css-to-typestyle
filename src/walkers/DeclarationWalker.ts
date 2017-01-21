import * as postcss from 'postcss';
import { isNumber, toCamelCase } from '../utils/strings';
import { Properties } from '../types';

export class DeclarationWalker {
  private _props: Properties = {};

  public clearProperties(): void {
    this._props = {};
  }

  public getProperties(): Properties {
    return this._props;
  }

  public walk = (dec: postcss.Declaration): void => {
    // get property name
    const declarations = this._props;
    const propName = dec.prop;
    const prop = propName.indexOf('-') === 0 ? propName : toCamelCase(propName);

    const objValue = dec.value;
    let value: string | number;
    if (typeof objValue === 'number') {
      value = objValue as number;
    } else if (isNumber(objValue)) {
      value = parseFloat(objValue);
    } else {
      value = objValue;
    }

    if (!declarations.hasOwnProperty(prop)) {
      // set the value directly
      declarations[prop] = value;
    } else {
      // if property has been collected, convert to an array for fallback
      const propValue = declarations[prop];
      if (typeof propValue === 'string' || typeof propValue === 'number') {
        declarations[prop] = [propValue];
      }
      // add to the list of values
      (declarations[prop] as (string | number)[]).push(value)
    }
  }
}

