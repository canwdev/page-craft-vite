import {pinyin} from 'pinyin-pro'
import {formatI18nKey} from '@/enum/vue-i18n-tool'
import {textConvertAdvanced, TextConvertMode, textConvertMultipleLine} from './text-convert'
import {handleExportFile, handleImportJson, handleReadSelectedFile, promptGetFileName} from './io'
import {showInputPrompt} from '@/components/CanUI/functions/input-prompt'

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
