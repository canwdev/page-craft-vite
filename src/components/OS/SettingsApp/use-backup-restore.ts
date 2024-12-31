import {useIDBKeyval} from '@vueuse/integrations/useIDBKeyval'
import {IDBSettingsKey, LS_SettingsKey} from '@/enum/settings'
import {useI18n} from 'vue-i18n'

export interface ISettingsBackup {
  backupSettingsVersion: number
  localStorageData: {
    [key: string]: string | null
  }
  idbKeyValData: {
    [key: string]: any
  }
}

export const useBackupRestore = () => {
  const isLoading = ref(false)
  const {t: $t} = useI18n()

  const idbRestoreData = (key, value) => {
    const {set, data, isFinished} = useIDBKeyval(key, {})
    return new Promise((resolve) => {
      watch(isFinished, (val) => {
        if (val) {
          set(value)
          resolve(data.value)
        }
      })
    })
  }

  const idbBackupData = (key) => {
    const {set, data, isFinished} = useIDBKeyval(key, {})
    return new Promise((resolve) => {
      watch(isFinished, (val) => {
        if (val) {
          resolve(data.value)
        }
      })
    })
  }

  const importAllSettings = async () => {
    try {
      isLoading.value = true
      const data: ISettingsBackup = await window.$mcUtils.handleImportJson()
      if (!data.backupSettingsVersion) {
        throw new Error('Invalid settings json file!')
      }
      for (const key in data.localStorageData) {
        const value = data.localStorageData[key]
        if (value) {
          localStorage.setItem(key, value)
        }
      }
      for (const key in data.idbKeyValData) {
        const value = data.idbKeyValData[key]
        if (value) {
          await idbRestoreData(key, value)
        }
      }

      location.reload()
    } catch (e: any) {
      window.$message.error(e.message)
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const exportAllSettings = async () => {
    try {
      isLoading.value = true
      const allSettings: ISettingsBackup = {
        backupSettingsVersion: 1,
        localStorageData: {},
        idbKeyValData: {},
      }

      Object.values(LS_SettingsKey).forEach((key) => {
        const data = localStorage.getItem(key)
        console.log('[LS_SettingsKey] Backup: ', {key, data})
        allSettings.localStorageData[key] = data
      })

      for (const iKey in IDBSettingsKey) {
        const key = IDBSettingsKey[iKey]
        if (/_handle_history$/.test(key)) {
          console.warn(
            `[IDBSettingsKey] Skip backup ${key} because it contains FileSystemFileHandle`,
          )
        } else {
          const data = await idbBackupData(key)
          console.log('[IDBSettingsKey] Backup: ', {key, data})
          allSettings.idbKeyValData[key] = data
        }
      }

      console.log(allSettings.idbKeyValData)

      window.$mcUtils.handleExportFile(
        await window.$mcUtils.promptGetFileName(undefined, 'PageCraft_Toolbox_All_Settings'),
        JSON.stringify(allSettings, null, 2),
        '.json',
      )
    } catch (e: any) {
      window.$message.error(e.message)
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    idbRestoreData,
    idbBackupData,
    importAllSettings,
    exportAllSettings,
  }
}
