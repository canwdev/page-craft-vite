import {createI18n} from 'vue-i18n' // import from runtime only
import {autoMatchLanguage, FALLBACK_LOCALE, getLanguage, languages} from './languages'

const messages = {}
languages.forEach((item) => {
  messages[item.locale] = item.messages
})

export const autoGetLocale = () => {
  const cookieLanguage = getLanguage()
  if (cookieLanguage && messages[cookieLanguage]) {
    return cookieLanguage
  }

  return autoMatchLanguage()
}

const i18n = createI18n({
  locale: autoGetLocale(),
  fallbackLocale: FALLBACK_LOCALE,
  legacy: false,
  messages,
})

export default i18n
