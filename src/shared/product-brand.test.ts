import { describe, expect, it } from 'vitest'
import { applyProductBrand } from './product-brand'

describe('applyProductBrand', () => {
  it('rebrands product copy without changing the GNOME screen reader or wire scheme', () => {
    expect(applyProductBrand('Restart Orca; GNOME Orca and orca:// stay compatible.')).toBe(
      'Restart ImogenAI; GNOME Orca and orca:// stay compatible.'
    )
  })
})
