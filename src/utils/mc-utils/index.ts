import {pinyin} from 'pinyin-pro'
import {formatI18nKey} from '@/enum/vue-i18n-tool'
import {showInputPrompt} from '@/components/CommonUI/input-prompt'
import {textConvertAdvanced, TextConvertMode, textConvertMultipleLine} from './text-convert'
import {handleExportFile, handleImportJson, handleReadSelectedFile, promptGetFileName} from './io'

export const mcUtils = {
  pinyin,
  formatI18nKey,
  textConvertAdvanced,
  textConvertMultipleLine,
  TextConvertMode,
  handleExportFile,
  handleImportJson,
  handleReadSelectedFile,
  promptGetFileName,
  showInputPrompt,
}
