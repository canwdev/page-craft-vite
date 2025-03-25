import {pinyin} from 'pinyin-pro'
import {formatI18nKey} from '@/enum/vue-i18n-tool'
import {copy, textConvertAdvanced, TextConvertMode, textConvertMultipleLine} from './text-convert'
import {
  handleExportFile,
  handleImportJson,
  handleImportTextFile,
  handleReadSelectedFile,
  promptGetFileName,
} from './io'
import {showInputPrompt} from '@/components/CanUI/functions/input-prompt'

export const mcUtils = {
  copy,
  pinyin,
  formatI18nKey,
  textConvertAdvanced,
  textConvertMultipleLine,
  TextConvertMode,
  handleExportFile,
  handleImportTextFile,
  handleImportJson,
  handleReadSelectedFile,
  promptGetFileName,
  showInputPrompt,
}
