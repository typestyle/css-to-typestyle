import { isNumber, toCamelCase } from './strings';

type Properties = { [key: string]: (string | number | (string | number)[]); };

let currentRules: { [selector: string]: Properties; } = {};
let currentDecls: Properties = {};

export function clearDecls() {
    currentDecls = {};
}

export function clearRules() {
    currentRules = {};
}

export function getDecls() {
    return currentDecls;
}

export function getImports() {
    return `import{cssRule,fontFace}from'typestyle';`;
}

export function getRules() {
    return currentRules;
}

export function walkDecls(dec: any) {
    // get property name
    const propName = dec.prop;
    const prop = propName.indexOf('-') === 0 ? propName : toCamelCase(propName);

    const objValue = dec.value;     
    let value: string | number;
    if (isNumber(objValue)) {
        value = parseFloat(objValue); 
    } else {
        value = objValue; 
    }

    if (!currentDecls.hasOwnProperty(prop)) {
        // set the value directly            
        currentDecls[prop] = value; 
    }
    // if property has been collected, convert to an array for fallback                
    else {
        const propValue = currentDecls[prop];
        if (typeof propValue === 'string' || typeof propValue === 'number') {
            currentDecls[prop] = [propValue];
        }
        // add to the list of values
        (currentDecls[prop] as (string | number)[]).push(value)
    }
}

export function walkRules(rule: any) {
    // find all rules and collect the properties
    rule.walkDecls((dec: any) => {
        clearDecls();
        walkDecls(dec);
    });

    // convert to string and add to file
    currentRules[rule.selector] = getDecls();
}
