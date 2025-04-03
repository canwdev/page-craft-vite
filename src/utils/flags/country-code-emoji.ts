/**
 * country-code-emoji
 * https://www.npmjs.com/package/country-code-emoji
 * https://github.com/thekelvinliu/country-code-emoji/blob/main/src/index.js
 */
import {countries} from '@/utils/flags/countries'

// country code regex
const CC_REGEX = /^[a-z]{2}$/i

// flag emoji use 2 regional indicator symbols, and each symbol is 2 chars
const FLAG_LENGTH = 4

// offset between uppercase ascii and regional indicator symbols
const OFFSET = 127397

/**
 * convert country code to corresponding flag emoji
 * @param {string} cc - country code string
 * @returns {string} flag emoji
 */
export function countryCodeEmoji(cc) {
  if (!CC_REGEX.test(cc)) {
    const type = typeof cc
    throw new TypeError(
      `cc argument must be an ISO 3166-1 alpha-2 string, but got '${
        type === 'string' ? cc : type
      }' instead.`,
    )
  }

  const codePoints = [...cc.toUpperCase()].map((c) => c.codePointAt() + OFFSET)
  return String.fromCodePoint(...codePoints)
}

/**
 * convert flag emoji to corresponding country code
 * @param {string} flag - flag emoji
 * @returns {string} country code string
 */
export function emojiCountryCode(flag) {
  if (flag.length !== FLAG_LENGTH) {
    const type = typeof flag
    throw new TypeError(
      `flag argument must be a flag emoji, but got '${type === 'string' ? flag : type}' instead.`,
    )
  }

  const codePoints = [...flag].map((c) => c.codePointAt() - OFFSET)
  return String.fromCodePoint(...codePoints)
}

export default countryCodeEmoji

const countryMap = {}
countries.forEach((i) => {
  countryMap[i.iso2] = i
})
export function countryCodeSvg(cc) {
  return countryMap[cc.toUpperCase()]?.flag
}
