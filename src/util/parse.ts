import crypto from 'crypto';

export function parseMultiInput(input: string): string[] {
    let result: string[];

    if (input.includes('\n')) {
        result = input.split('\n');
    } else {
        result = input.split(',');
    }

    return result.map(s => s.trim()).filter(s => s !== '');
}

export function parseBooleanInput(input: string): boolean | undefined {
    if (input === 'true') {
        return true;
    } else if (input === 'false') {
        return false;
    } else {
        return undefined;
    }
}

export function removePrefix(input: string | undefined, prefix: string): string {
    if (input === undefined) {
        return '';
    } else if (input.startsWith(prefix)) {
        return input.substring(prefix.length);
    } else {
        return input;
    }
}

export function sanitizeVariableName(name: string): string {
    return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

export function isInteger(value: string): boolean {
    return value.match(/^[0-9]+$/) !== null;
}

export function stringHash(string: string): string {
    return crypto.createHash('sha256').update(string).digest('hex').slice(0, 7);
}