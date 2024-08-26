import {QuickOptionItem} from '@/components/CanUI/packages/QuickOptions/enum'

// 获取菜单位置样式，自动处理屏幕边缘
export const getMenuPosStyle = ({x, y, width, height}) => {
  let mx = x
  let my = y

  // 视口宽高
  const vWidth = window.innerWidth
  const vHeight = window.innerHeight

  const style: any = {
    position: 'fixed',
    transform: 'none',
    zIndex: 1000,
  }

  // 使其始终显示在屏幕内部而不超出
  const offset_left = vWidth - (mx + width)
  if (offset_left < 0) {
    mx += offset_left
  }
  if (mx < x) {
    mx = x - width
  }
  // 处理宽度大于视口
  if (width > vWidth) {
    mx = 0
    style.width = '95%'
  }
  style.left = mx + 'px'

  const offset_top = vHeight - (my + height)
  if (offset_top < 0) {
    my += offset_top
  }
  if (my < y) {
    my = y - height
  }
  // 处理高度大于视口
  if (height > vHeight) {
    my = 0
    style.height = '95%'
    style.overflow = 'auto'
  }
  style.top = my + 'px'

  return style
}

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
    return getMenuPosStyle({
      x: xRef.value,
      y: yRef.value,
      width: menuWidth.value,
      height: menuHeight.value,
    })
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
    const menuEl = subMenuRef.value?.$el
    // console.log(menuEl)
    if (!menuEl) {
      return
    }
    const rect = menuEl.getBoundingClientRect()
    // console.log(menuEl, rect)

    const parentMenuEl = menuEl.parentElement
    const parentRect = parentMenuEl.getBoundingClientRect()
    console.log(parentMenuEl, parentRect)

    let offsetLeft = 0
    // 视口宽高
    const vWidth = window.innerWidth
    const vHeight = window.innerHeight
    // TODO: 如果菜单右侧宽度不能容纳子菜单，则将子菜单显示在左边
    if (vWidth - parentRect.left + parentRect.width < rect.width) {
      offsetLeft = -parentRect.width
    }
    console.log(offsetLeft)

    const style = getMenuPosStyle({
      x: rect.left + offsetLeft,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    })

    // 设置样式
    Object.assign(menuEl.style, {
      ...style,
      opacity: 1,
      visibility: 'visible',
    })
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
