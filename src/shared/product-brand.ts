export const PRODUCT_NAME = 'ImogenAI'

export function applyProductBrand(value: string): string {
  return value.replace(/(?<!GNOME )\bOrca\b/g, PRODUCT_NAME)
}
