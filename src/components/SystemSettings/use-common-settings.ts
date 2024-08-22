import {useSettingsStore} from '@/store/settings'
import {StOptionItem, StOptionType} from '@/components/CanUI/packages/OptionUI/enum'
import {useI18n} from 'vue-i18n'

export const useCommonSettings = () => {
  const {t: $t} = useI18n()
  const settingsStore = useSettingsStore()
  const commonSettingsOptions = computed((): StOptionItem[] => {
    return [
      {
        label: $t('common.common'),
        key: 'common',
        children: [
          {
            label: $t('msgs.focus_auto_action') + ' (ctrl+alt+a)',
            subtitle: $t('msgs.focus_auto_action_desc'),
            tips: `⚡ 搭配AHK脚本使用，效率更佳！<br><pre style="max-height: 300px;overflow: auto;color: greenyellow;box-sizing:border-box;padding:5px;background-color: black">
#Persistent ; 让脚本持续运行
SetTitleMatchMode, 2 ; 设置窗口标题匹配模式为包含模式
; 按F2执行操作
F2::
    ; 按下 Ctrl+C
    Send, ^c
    ; 获取当前活动窗口的句柄
    WinGet, originalWindow, ID, A
    ; 切换到标题包含 "PageCraft" 的窗口
    IfWinExist, PageCraft
    {
        WinActivate ; 激活找到的窗口
        Sleep, 50 ; 等待50毫秒
    }
    ; 切换回原窗口
    If (originalWindow)
    {
        WinActivate, ahk_id %originalWindow% ; 激活之前活动的窗口
    }
    ; 按下 Ctrl+V
    Send, ^v
return
</pre>`,
            key: 'enableFocusAutoAction',
            store: settingsStore,
            type: StOptionType.SWITCH,
          },
        ],
      },
    ]
  })
  return {
    commonSettingsOptions,
  }
}
