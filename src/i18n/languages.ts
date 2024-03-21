import enUS from './locales/en-US/index.json'
import zhCN from './locales/zh-CN/index.json'
import {LsKeys} from '@/enum/page-craft'

export const FALLBACK_LOCALE = 'en-US'
export const languages = [
  {
    locale: 'en',
    name: 'English',
    messages: enUS,
  },
  {
    locale: 'zh-CN',
    name: '中文(简体)',
    messages: zhCN,
  },
]

export const autoMatchLanguage = () => {
  // 获取用户浏览器的语言信息
  const userLanguage = navigator.language

  // 支持的语言列表
  const supportedLanguages = languages.map((item) => item.locale)

  // 查找匹配的语言
  let matchedLanguage = ''

  // 先尝试找到完全匹配的语言
  for (const lang of supportedLanguages) {
    if (userLanguage === lang) {
      matchedLanguage = lang
      break
    }
  }

  // 辅助函数：计算两个语言字符串的匹配度
  function getMatchCount(lang1, lang2) {
    const parts1 = lang1.split('-')
    const parts2 = lang2.split('-')
    let matchCount = 0

    for (let i = 0; i < Math.min(parts1.length, parts2.length); i++) {
      if (parts1[i] === parts2[i]) {
        matchCount++
      } else {
        break
      }
    }

    return matchCount
  }

  // 如果没有完全匹配的语言，尝试找到最接近的语言
  if (!matchedLanguage) {
    let maxMatchCount = 0
    for (const lang of supportedLanguages) {
      const matchCount = getMatchCount(userLanguage, lang)
      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount
        matchedLanguage = lang
      }
    }
  }

  // 如果没有找到匹配的语言，则使用默认语言（例如英语）
  if (!matchedLanguage) {
    matchedLanguage = FALLBACK_LOCALE // 这里使用英语作为默认语言
  }

  // 输出匹配的语言
  console.log(`[autoMatchLanguage]：${matchedLanguage}`)

  return matchedLanguage
}

export const getLanguage = () => localStorage.getItem(LsKeys.LANGUAGE)
export const setLanguage = (language: string) => localStorage.setItem(LsKeys.LANGUAGE, language)
