
export function parseBoolean(value: string | boolean): boolean {
  return typeof value === 'string' ? value.toLowerCase() === 'true' : value;
}

export function parseNumeric(value: string | number | undefined) {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  return value;
}

/**
 * @description
 * Transform function to parse csv of number into an array of numbers
 */
export function parseNumericCsv(value: string | number[]): number[] {
  if (typeof value === 'string') {
    value = value.split(',').map(parseFloat);
  }
  return value;
}
