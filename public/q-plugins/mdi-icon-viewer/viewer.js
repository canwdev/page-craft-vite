const {addPlugin, copy, ref, computed, watch, useDebounceFn} = window.$qlUtils

let metaList = []
addPlugin(
  (valRef) => {
    return {
      label: 'Material Design Icons Viewer',
      iconClass: 'mdi mdi-material-design',
      children: async () => {
        if (!metaList.length) {
          metaList = await fetch('./q-plugins/mdi-icon-viewer/meta-lite.json').then(res => res.json())
          console.log({ metaList })
        }

        const getDefaultResult = () => {
          return [
            {
              html: `Please input filter keywords.
<a href="https://pictogrammers.com/library/mdi/" target="_blank">Material Design Icons</a>`,
              props: {
                onClick: () => {}
              }
            }]
        };
        const resultList = ref(getDefaultResult());

        const updateResultList = useDebounceFn(() => {
          if (!valRef.value) {
            resultList.value = getDefaultResult()
            return
          }

          resultList.value = [
            ...metaList
              .filter((v) => {
                if (!valRef.value) {
                  return true
                }
                const sVal = valRef.value.trim().toLowerCase()
                return v.name.toLowerCase().includes(sVal) ||
                  (v.tags_str ?
                  v.tags_str.toLowerCase().includes(sVal)
                  : false)
              })
              .map((v) => {
                const iconClass = `mdi mdi-${v.name}`
                const htmlText = `<span class="${iconClass}"></span>`
                return {
                  html: `<div class="flex-row-center-gap" style="white-space: normal;">
<span class="${iconClass}" style="font-size: 32px;
    color: var(--primary);"></span>
<div>
  <div style="line-height: 1.4;">${v.name}</div>
  <div style="
    font-size: 12px;
    opacity: .7;
    line-height: 1;
  ">${v.tags_str||''}</div>
</div>
</div>`,
                  props: {
                    onClick: () => {
                      copy(v.name, true)
                    },
                    onContextmenu: () => {
                      copy(htmlText, true)
                    }
                  },
                }
              })
              .slice(0, 800)
          ]
          // console.log('updateResultList', valRef.value, resultList.value)
        }, 300)

        watch(valRef, (value) => {
          if (!valRef.value) {
            resultList.value = getDefaultResult()
            return
          }
          updateResultList()
        })

        // 支持直接返回vue3计算属性
        return resultList
      },
    }
  },
  {
    isStaticPlugin: true,
    isPresetPlugin: true,
  }
)