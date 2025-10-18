import type { ServerInfo } from '@server/types/server'
import type { ShortcutItem } from '@/enum/os'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { TaskItem } from '@/enum/os'

export const useSystemStore = defineStore('system', () => {
  // 1. State: 使用 ref 或 reactive 定义
  const serverInfo = ref<ServerInfo | null>(null)
  const tasks = ref<TaskItem[]>([])
  const activeId = ref<string>('')

  // 2. Getters: 使用 computed 定义
  const allApps = computed<ShortcutItem[]>(() => {
    return window.$appList
  })

  const allAppidMap = computed(() => {
    const map: { [appid: string]: ShortcutItem } = {}
    // 注意：在 setup store 中，需要通过 .value 访问 computed 和 ref 的值
    allApps.value.forEach((shortcut) => {
      map[shortcut.appid] = shortcut
    })
    return map
  })

  // 3. Actions: 定义为普通函数
  function createTaskById(appid: string, params?: any) {
    const shortcut = allAppidMap.value[appid] // 使用 .value
    if (shortcut) {
      // 直接调用函数，而不是 this.createTask
      return createTask(shortcut, params)
    }
    window.$message.error(`appid ${appid} not found!`)
  }

  /**
   * 从快捷方式创建任务
   * @param shortcut
   */
  function createTask(shortcut: ShortcutItem, params?: any) {
    if (shortcut.singleInstance) {
      // 查找实例是否已经存在，防止重复启动
      const task = tasks.value.find(i => i.component === shortcut.component)
      if (task) {
        task.params = params
        setTaskActive(task) // 直接调用函数
        return task
      }
    }
    const newTask = new TaskItem({ ...shortcut, params })
    tasks.value = [...tasks.value, newTask] // 修改 ref 的值需要 .value
    activeId.value = newTask.guid // 修改 ref 的值需要 .value
    return newTask
  }

  /**
   * 关闭任务
   * @param guid
   */
  function closeTask(guid: string) {
    const _tasks = [...tasks.value]
    const idx = _tasks.findIndex(i => i.guid === guid)

    const task = _tasks[idx]
    if (task) {
      task.isClosing = true

      setTimeout(() => {
        _tasks.splice(idx, 1)
        tasks.value = _tasks // 赋值给 ref 的 .value

        // 上一个应用的index
        let lastIdx = idx - 1
        if (!_tasks[lastIdx]) {
          // 如果不存在则设置为最后一个
          lastIdx = _tasks.length - 1
          if (!_tasks[lastIdx]) {
            lastIdx = -1
          }
        }
        if (lastIdx > -1) {
          const lastTask = _tasks[lastIdx]
          if (!lastTask.minimized) {
            // 激活上一个窗口
            if (lastTask.windowRef) {
              lastTask.windowRef.setActive()
            }
          }
        }
      }, 300)
    }
  }

  /**
   * 关闭所有程序
   */
  function shutdown() {
    tasks.value.forEach(task => closeTask(task.guid)) // 直接调用函数
  }

  /**
   * 激活任务
   * @param task
   * @param isTaskbar 是否来自任务栏
   */
  function setTaskActive(task: TaskItem, isTaskbar = false) {
    if (isTaskbar) {
      // 控制任务自动显示或隐藏
      if (activeId.value === task.guid) {
        task.minimized = !task.minimized
        return
      }
    }

    // 防止重复操作
    if (activeId.value === task.guid) {
      task.minimized = false
      return
    }

    activeId.value = task.guid
    if (task.windowRef) {
      task.windowRef.setActive()
      task.minimized = false
      setTimeout(() => {
        task.windowRef.focus()
      })
    }
  }

  // 4. 返回所有需要暴露的 state, getters, 和 actions
  return {
    // State
    serverInfo,
    tasks,
    activeId,
    // Getters
    allApps,
    allAppidMap,
    // Actions
    createTaskById,
    createTask,
    closeTask,
    shutdown,
    setTaskActive,
  }
})
