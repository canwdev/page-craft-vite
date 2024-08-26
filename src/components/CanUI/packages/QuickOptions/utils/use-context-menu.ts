import {QuickOptionItem} from '@/components/CanUI/packages/QuickOptions/enum'

export const useContextMenu = (options: any = {}) => {
  const {getExtraSize} = options

  const isShow = ref(false)
  const xRef = ref(0)
  const yRef = ref(0)

  const menuWidth = ref(0)
  const menuHeight = ref(0)

  const menuRef = ref()
  const updateCardSize = () => {
    setTimeout(() => {
      if (!menuRef.value || !menuRef.value.quickRootRef) {
        return
      }
      let w = menuRef.value.quickRootRef.offsetWidth
      let h = menuRef.value.quickRootRef.offsetHeight

      // 获取额外的宽高
      if (getExtraSize) {
        const {width: ew, height: eh} = getExtraSize()
        w += ew
        h += eh
      }
      menuWidth.value = w
      menuHeight.value = h

      // console.log(menuWidth.value, menuHeight.value)
    }, 10)
  }
  watch(isShow, (val) => {
    if (val) {
      updateCardSize()
    }
  })

  const ctxMenuStyle = computed(() => {
    let mx = xRef.value
    let my = yRef.value
    const wWidth = window.innerWidth
    const wHeight = window.innerHeight

    // 使其始终显示在屏幕内部而不超出
    const offset_left = wWidth - (mx + menuWidth.value)
    if (offset_left < 0) {
      mx += offset_left
    }
    if (mx < xRef.value) {
      mx = xRef.value - menuWidth.value
    }

    const offset_top = wHeight - (my + menuHeight.value)
    if (offset_top < 0) {
      my += offset_top
    }
    if (my < yRef.value) {
      my = yRef.value - menuHeight.value
    }

    return {
      position: 'fixed',
      left: mx + 'px',
      top: my + 'px',
      transform: 'none',
    }
  })

  const showMenu = (event: MouseEvent) => {
    isShow.value = false
    setTimeout(() => {
      xRef.value = event.clientX
      yRef.value = event.clientY
      event.preventDefault()
      isShow.value = true
    })
  }

  const showMenuByPoint = (x, y) => {
    xRef.value = x
    yRef.value = y
    isShow.value = true
  }

  return {
    isShow,
    ctxMenuStyle,
    xRef,
    yRef,
    menuWidth,
    menuHeight,
    menuRef,
    updateCardSize,
    showMenu,
    showMenuByPoint,
  }
}

// 鼠标悬浮显示子菜单
export const useHoverSubMenu = (props, emit) => {
  const {item, isStatic} = toRefs(props)

  const subMenuRef = ref()
  const isMouseOver = ref(false)
  const isMouseOverSub = ref(false)

  watch(isMouseOver, (val) => {
    if (!isStatic.value && hasChildren.value) {
      if (!val) {
        emit('onSubMenuHide')
      } else {
        setTimeout(() => {
          calculateEdge()
        })
      }
    }
  })

  // 屏幕边缘自动适应
  const calculateEdge = () => {
    const menuEl = subMenuRef.value
    console.log(menuEl)
    // TODO
  }

  const hasChildren = computed(() => {
    if (Array.isArray(item.value.children)) {
      return item.value.children.length > 0
    }
    return !!item.value.children
  })
  const subChildren = computed<QuickOptionItem[]>(() => {
    if (!hasChildren.value) {
      return []
    }
    if (Array.isArray(item.value.children)) {
      return item.value.children
    }
    return item.value.children!()
  })

  return {
    subMenuRef,
    isMouseOver,
    isMouseOverSub,
    hasChildren,
    subChildren,
  }
}
