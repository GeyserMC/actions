export function formatString(input: string, variables: Record<string, any>): string {
    for (const key in variables) {
        input = input.replaceAll(`\${${key}}`, variables[key]);
    }
    return input;
}
