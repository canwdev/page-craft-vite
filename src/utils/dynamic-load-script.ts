/**
 * 动态加载 script src，支持并发加载相同url不冲突。
 * @param src
 * @returns {Promise<unknown>}
 */
const loadingScripts = {} // 保存正在加载的 script 的 Promise
function dynamicLoadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 检查是否已经在加载中
    if (loadingScripts[src]) {
      // 已经在加载中，等待 Promise 完成
      // console.warn('[dynamicLoadScript] wait loading:', src)
      loadingScripts[src].then(resolve).catch(reject)
      return
    }

    // 检查是否已经存在该 script
    const existingScript = document.getElementById(src)
    if (existingScript) {
      // console.warn('[dynamicLoadScript] is existed:', src)
      resolve() // script 已经加载，直接 resolve
      return
    }

    // console.log('[dynamicLoadScript] loading:', src)
    // 创建 script 标签并开始加载
    const script = document.createElement('script')
    script.src = src
    script.id = src

    let loadResolver // 保存 resolve 函数，以便在外部访问
    let loadRejecter // 保存 reject 函数，以便在外部访问

    const loadPromise = new Promise((res, rej) => {
      loadResolver = res
      loadRejecter = rej
    })

    loadingScripts[src] = loadPromise // 保存 promise

    script.onload = function () {
      this.onerror = this.onload = null
      delete loadingScripts[src] // 加载完成后删除
      loadResolver() // Resolve 内部的 Promise
      resolve() // Resolve 外部的 Promise
    }

    script.onerror = function (e) {
      this.onerror = this.onload = null
      delete loadingScripts[src] // 加载失败后删除
      const error = new Error(`[dynamicLoadScript] load script error: ${src}`)
      console.error('[dynamicLoadScript] error:', e)
      loadRejecter(error) // Reject 内部的 Promise
      reject(error) // Reject 外部的 Promise
    }

    document.body.appendChild(script)
  })
}

export function batchDynamicLoadScript(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(src => dynamicLoadScript(src)))
}

export default dynamicLoadScript
