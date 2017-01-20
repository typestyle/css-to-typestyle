const camelCaseRegex = /([a-z])[- ]([a-z])/ig;

function camelCaseReplacer(match: string, p1: string, p2: string): string {
    return p1 + p2.toUpperCase();
}

export function toCamelCase(value: string | undefined): string {
    return typeof value === 'string' ? (value as string).replace(camelCaseRegex, camelCaseReplacer) : '';
}