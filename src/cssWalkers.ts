import { isNumber, toCamelCase } from './strings';

type Properties = { [key: string]: (string | number | (string | number)[]); };

let detectedRules: { [selector: string]: Properties; } = {};

export function walkRules(rule: any) {
    // find all rules and collect the properties
    const props: Properties = {};
    rule.walkDecls((dec: any) => {
        // get property name
        const propName = dec.prop;
        const prop = propName.indexOf('-') === 0 ? propName : toCamelCase(propName);

        const objValue = dec.value;     
        let value: string | number;
        if (typeof isNumber(objValue)) {
            value = parseFloat(objValue); 
        } else {
            value = objValue; 
        }

        if (!props.hasOwnProperty(prop)) {
            // set the value directly            
            props[prop] = value; 
        }
        // if property has been collected, convert to an array for fallback                
        else {
            const propValue = props[prop];
            if (typeof propValue === 'string' || typeof propValue === 'number') {
                props[prop] = [propValue];
            }
            // add to the list of values
            (props[prop] as (string | number)[]).push(value)
        }
    });

    // convert to string and add to file
    detectedRules[rule.selector] = props;
}

export function getImports() {
    return `import{cssRule}from'typestyle';`;
}

export function clearRules() {
    detectedRules = {};
}

export function getRules() {
    return detectedRules;
}
