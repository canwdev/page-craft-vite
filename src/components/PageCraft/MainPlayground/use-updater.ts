import {getPkg} from '@/router/router-utils'
import {useSettingsStore} from '@/store/settings'
import {useMainStore} from '@/store/main'
import {useI18n} from 'vue-i18n'

export function compareVersions(version1, version2) {
  const parts1 = version1.split('.')
  const parts2 = version2.split('.')

  const maxLength = Math.max(parts1.length, parts2.length)

  for (let i = 0; i < maxLength; i++) {
    const num1 = parseInt(parts1[i] || 0)
    const num2 = parseInt(parts2[i] || 0)

    if (num1 < num2) {
      return -1
    } else if (num1 > num2) {
      return 1
    }
  }

  return 0
}

export const useUpdater = (author, name, branch = 'master') => {
  const {t: $t} = useI18n()
  const mainStore = useMainStore()
  const settingsStore = useSettingsStore()

  const check = async () => {
    const packageUrl = `https://raw.githubusercontent.com/${author}/${name}/${branch}/package.json`
    const releasePage = `https://github.com/${author}/${name}/releases`

    const localVersion = getPkg().version

    try {
      const response = await fetch(packageUrl)
      const data = await response.json()
      console.log(data)
      const latestVersion = data.version

      if (compareVersions(localVersion, latestVersion) < 0) {
        mainStore.upgradeInfo = `${$t(
          'msgs.new_version'
        )}: v${latestVersion} | <a style="color:inherit; text-decoration: underline" href="${releasePage}" target="_blank">${$t(
          'actions.download'
        )}</a>`

        // 执行更新操作，例如提示用户或自动更新
        return {
          update: true,
          version: latestVersion,
        }
      } else {
        mainStore.upgradeInfo = `${$t('msgs.up_to_date')}: v${localVersion}`
        return {
          update: false,
          version: localVersion,
        }
      }
    } catch (error: any) {
      console.warn('Check for updates failed', error.message)
      return {
        update: false,
        version: localVersion,
      }
    }
  }

  onMounted(async () => {
    if (settingsStore.autoCheckUpdate) {
      const {update} = await check()
      if (update) {
        window.$notification.info({
          title: $t('msgs.update_avail') + ' 🎆',
          content: () => h('div', {innerHTML: mainStore.upgradeInfo}),
        })
      }
    }
  })
  return {
    check,
  }
}
