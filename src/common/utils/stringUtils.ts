//capitalize only the first letter of the string.
export function capitalizeFirstLetter(value?: string): string {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
