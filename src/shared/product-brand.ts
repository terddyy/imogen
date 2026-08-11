export const PRODUCT_NAME = 'Imogen'

export function applyProductBrand(value: string): string {
  return value.replace(/(?<!GNOME )\b(?:ImogenAI|Orca)\b/g, PRODUCT_NAME)
}
