import {createGlobalState, useFileDialog, useStorage} from '@vueuse/core'
import {copy} from './utils'
import moment from 'moment/moment'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import * as changeCase from 'change-case'
import {filterLabel} from './utils'
import {demoPluginTpl} from './demo.json'
import {useI18n} from 'vue-i18n'

export type DynamicPlugin = (key: any) => QuickOptionItem

export type QuickLaunchPlugin = QuickOptionItem[] | DynamicPlugin[]

// 插件实例存储空间
export const usePluginState = createGlobalState(() => {
  // 静态插件
  const staticPlugins = ref<QuickOptionItem[]>([])
  // 动态插件，接收一个ref值，根据值动态返回
  const dynamicPlugins = ref<DynamicPlugin[]>([])

  // 自定义插件
  // 静态插件
  const customStaticPlugins = ref<QuickOptionItem[]>([])
  // 动态插件，接收一个ref值，根据值动态返回
  const customDynamicPlugins = ref<DynamicPlugin[]>([])

  return {
    staticPlugins,
    dynamicPlugins,
    customStaticPlugins,
    customDynamicPlugins,
  }
})

// 自带插件
export const useQuickLaunchPlugins = (update, textRef) => {
  const {
    staticPlugins,
    dynamicPlugins,

    customStaticPlugins,
    customDynamicPlugins,
  } = usePluginState()

  const basePath = `q-plugins`

  // 重新加载所有插件
  const reloadPlugins = async () => {
    dynamicPlugins.value = []
    staticPlugins.value = []

    // 获取插件json
    const res = await fetch(`${basePath}/index.json`)
    const data = await res.json()
    const {plugins} = data
    // console.log('[reloadPlugins] loading plugins...', plugins)
    // 逐个加载js文件
    for (const pluginsKey in plugins) {
      let url = plugins[pluginsKey]

      const outboundUrlRegex = /^(?:http(s)?:\/\/)/
      // 允许相对路径
      if (!outboundUrlRegex.test(url)) {
        url = basePath + '/' + url
      }

      const response = await fetch(url)
      const code = await response.text()

      // 使用闭包执行预设插件代码
      eval(`;(function () {
${code}  
})()`)
    }
  }

  // 添加一个插件
  const addPlugin = (
    plugin: QuickOptionItem | DynamicPlugin,
    {
      // 如果传入此参数，则这个插件可以是静态的（直接展示在列表中而不用输入文字）
      isStaticPlugin = false,
      // 是否为预制插件
      isPresetPlugin = false,
    } = {}
  ) => {
    // 区分预制和自定义插件，提升自定义插件刷新性能
    const addStaticPlugin = (plugin: QuickOptionItem) => {
      if (isPresetPlugin) {
        staticPlugins.value.push(plugin)
      } else {
        customStaticPlugins.value.push(plugin)
      }
    }
    const addDynamicPlugin = (plugin: DynamicPlugin) => {
      if (isPresetPlugin) {
        dynamicPlugins.value.push(plugin)
      } else {
        customDynamicPlugins.value.push(plugin)
      }
    }

    // console.log('[addPlugin]', plugin)
    if (isStaticPlugin && typeof plugin === 'function') {
      addStaticPlugin(plugin(textRef))
    }

    if (typeof plugin === 'function') {
      addDynamicPlugin(plugin)
    } else {
      addStaticPlugin(plugin)
    }
    // 由于update函数使用了防抖，这里可以直接执行
    update()
  }

  onBeforeMount(() => {
    // 挂载全局工具方法
    window.$qlUtils = {
      copy,
      moment,
      useFileDialog,
      changeCase,

      // Vue3功能
      ref,
      computed,
      watch,

      // 过滤列表功能
      filterLabel,
      // 刷新列表
      update,
      // 重新加载所有插件
      reloadPlugins,
      // 添加一个插件
      addPlugin,
    }

    reloadPlugins()
  })
}

export interface ICustomPluginItem {
  // 插件名称(不可重复)
  name: string
  // 插件可执行代码
  code: string
}

// 自定义插件系统
export const useQuickLaunchCustomPlugins = (update) => {
  const {t: $t} = useI18n()
  // 自定义插件
  const customPluginsStorage = useStorage<ICustomPluginItem[]>('quick_launch_custom_plugins', [])
  const findCustomPlugin = (name: string) => {
    const index = customPluginsStorage.value.findIndex((i) => i.name === name)
    if (index !== -1) {
      return {
        index,
        item: customPluginsStorage.value[index],
      }
    }
    return null
  }
  // 编辑中的自定义插件
  const editingCustomPlugin = ref<ICustomPluginItem | null>(null)

  // 保存编辑中的插件
  const saveCustomPlugin = () => {
    if (!editingCustomPlugin.value) {
      return
    }
    const result = findCustomPlugin(editingCustomPlugin.value.name)
    if (result) {
      customPluginsStorage.value.splice(result.index, 1, editingCustomPlugin.value)
    } else {
      customPluginsStorage.value.push(editingCustomPlugin.value)
    }
    editingCustomPlugin.value = null
    reloadCustomPlugins()
  }

  // 使用闭包执行自定义代码
  const evalPluginCode = (code) => {
    try {
      eval(`;(function () {
${code}  
})()`)
    } catch (e: any) {
      window.$message.error(e.message)
    }
  }
  const runCustomPlugin = () => {
    if (!editingCustomPlugin.value) {
      return
    }
    customStaticPlugins.value = []
    customDynamicPlugins.value = []
    evalPluginCode(editingCustomPlugin.value.code)
  }

  const {customStaticPlugins, customDynamicPlugins} = usePluginState()
  const reloadCustomPlugins = () => {
    customStaticPlugins.value = []
    customDynamicPlugins.value = []
    customPluginsStorage.value.forEach((p) => {
      if (p.code) {
        // console.log(`Registering custom plugin: ${p.name}`)
        evalPluginCode(p.code)
      }
    })
    update()
  }

  onMounted(() => {
    reloadCustomPlugins()
  })

  // 插件管理器
  const qLogicManage = {
    label: `🔌 ${$t('common.plugins_manager')} 🧩`,
    children: () => {
      // 支持直接返回vue3计算属性
      return computed(() => {
        return [
          {
            label: `🔄 ${$t('plugins.reload_all_plugins')}`,
            props: {
              isBack: 1,
              onClick: async () => {
                reloadCustomPlugins()
                await window.$qlUtils.reloadPlugins()
                window.$message.success($t('plugins.plugins_reloaded'))
              },
            },
          },
          {
            label: `🔄 ${$t('plugins.reload_custom_plugi')}`,
            props: {
              isBack: 1,
              onClick: async () => {
                reloadCustomPlugins()
                window.$message.success($t('plugins.plugins_reloaded'))
              },
            },
          },
          {
            label: `✨ ${$t('actions.add_plugin')}`,
            props: {
              onClick: async () => {
                const name = await window.$mcUtils.showInputPrompt({
                  title: $t('plugins.input_plugin_name'),
                  value: '',
                  placeholder: $t('plugins.input_demo_to_creat'),
                  validateFn(val) {
                    if (findCustomPlugin(val)) {
                      return $t('msgs.error_name_duplicat')
                    }
                  },
                })
                // 编辑保存后调用 customPluginsStorage.value.push()
                editingCustomPlugin.value = {name, code: ''}
                if (name === 'demo') {
                  editingCustomPlugin.value.code = demoPluginTpl
                }
              },
            },
          },
          {
            label: `🗃️ ${$t('actions.import_export')} ${$t('actions.plugins')}`,
            children: [
              {
                label: `📥 ${$t('actions.import')} ${$t('actions.plugins')}`,
                props: {
                  isBack: 1,
                  onClick: async () => {
                    const list = await window.$mcUtils.handleImportJson()
                    customPluginsStorage.value = list || []
                    window.$message.success($t('msgs.import_success'))
                    reloadCustomPlugins()
                  },
                },
              },
              {
                label: `📤 ${$t('actions.export')} ${$t('actions.plugins')}`,
                props: {
                  onClick: async () => {
                    window.$mcUtils.handleExportFile(
                      await window.$mcUtils.promptGetFileName('QuickLaunchCustomPlugins'),
                      JSON.stringify(customPluginsStorage.value, null, 2),
                      '.json'
                    )
                  },
                },
              },
              {
                label: `🗑️ ${$t('plugins.delete_all_custom_p')}`,
                children: [
                  {
                    label: `☑️ ${$t('actions.confirm')}`,
                    props: {
                      isBack: 2,
                      onClick: () => {
                        customPluginsStorage.value = []
                        reloadCustomPlugins()
                      },
                    },
                  },
                  {
                    label: `🔙 ${$t('actions.cancel')}`,
                    props: {
                      isBack: 1,
                    },
                  },
                ],
              },
            ],
          },
          {split: true},
          ...customPluginsStorage.value.map((p) => {
            return {
              label: '🧩 ' + p.name,
              children: [
                {
                  label: `📝 ${$t('actions.edit')} ${$t('common.code')}`,
                  props: {
                    isBack: 2,
                    onClick: () => {
                      const result = findCustomPlugin(p.name)
                      if (result) {
                        editingCustomPlugin.value = {...result.item}
                      }
                    },
                  },
                },
                {
                  label: `✍️ ${$t('actions.rename')}`,
                  props: {
                    isBack: 1,
                    onClick: async () => {
                      const name = await window.$mcUtils.showInputPrompt({
                        title: `${$t('actions.rename')}: ${p.name}`,
                        value: p.name,
                        validateFn(val) {
                          if (findCustomPlugin(val)) {
                            return $t('msgs.error_name_duplicat')
                          }
                        },
                      })
                      if (name === p.name) {
                        return
                      }
                      const result = findCustomPlugin(p.name)
                      if (result) {
                        customPluginsStorage.value.splice(result.index, 1, {
                          ...result.item,
                          name,
                        })
                      }
                    },
                  },
                },
                {
                  label: `🗑️ ${$t('actions.delete')} [${p.name}]`,
                  children: [
                    {
                      label: `☑️ ${$t('actions.confirm')}`,
                      props: {
                        isBack: 2,
                        onClick: () => {
                          const result = findCustomPlugin(p.name)
                          if (result) {
                            customPluginsStorage.value.splice(result.index, 1)
                          }
                        },
                      },
                    },
                    {
                      label: `🔙 ${$t('actions.cancel')}`,
                      props: {
                        isBack: 1,
                      },
                    },
                  ],
                },
              ],
            }
          }),
        ]
      })
    },
  }

  return {
    qLogicManage,
    editingCustomPlugin,
    saveCustomPlugin,
    runCustomPlugin,
  }
}
