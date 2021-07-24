export function parseStringAsString(arrayAsString: string) {
  return arrayAsString.split(',').map((tech: string) => tech.trim());
}