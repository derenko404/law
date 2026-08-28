import type { FieldHook } from 'payload'
import slugify from 'slugify'

/** URL slug from an arbitrary (Ukrainian) title: transliterated, lowercase, dash-separated. */
export const toSlug = (value: string): string =>
  slugify(value, { lower: true, strict: true, locale: 'uk' })

/**
 * beforeValidate field hook: fills the slug from another field when left empty,
 * so editors only type one when they want to override the generated value.
 */
export const slugFrom =
  (source: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.trim() !== '') return value
    const src = data?.[source]
    return typeof src === 'string' && src.trim() !== '' ? toSlug(src) : value
  }
