<!--https://github.com/kostyfisik/transition-height-vue3-ts/blob/main/TransitionHeight.vue-->

<script setup lang="ts">
// import { nextTick } from "vue";
interface Props {
  duration?: number
  easingEnter?: string
  easingLeave?: string

  opacityClosed?: number
  opacityOpened?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 250,
  easingEnter: 'ease-in-out',
  easingLeave: 'ease-in-out',
  opacityClosed: 0,
  opacityOpened: 1,
})

const closed = '0px'

interface initialStyle {
  height: string
  width: string
  position: string
  visibility: string
  overflow: string
  paddingTop: string
  paddingBottom: string
  borderTopWidth: string
  borderBottomWidth: string
  marginTop: string
  marginBottom: string
}

function getElementStyle(element: HTMLElement) {
  return {
    height: element.style.height,
    width: element.style.width,
    position: element.style.position,
    visibility: element.style.visibility,
    overflow: element.style.overflow,
    paddingTop: element.style.paddingTop,
    paddingBottom: element.style.paddingBottom,
    borderTopWidth: element.style.borderTopWidth,
    borderBottomWidth: element.style.borderBottomWidth,
    marginTop: element.style.marginTop,
    marginBottom: element.style.marginBottom,
  }
}

function prepareElement(element: HTMLElement, initialStyle: initialStyle) {
  const {width} = getComputedStyle(element)
  element.style.width = width
  element.style.position = 'absolute'
  element.style.visibility = 'hidden'
  element.style.height = ''

  let {height} = getComputedStyle(element)
  element.style.width = initialStyle.width
  element.style.position = initialStyle.position
  element.style.visibility = initialStyle.visibility
  element.style.height = closed
  element.style.overflow = 'hidden'
  return initialStyle.height && initialStyle.height != closed ? initialStyle.height : height
}

function animateTransition(
  element: HTMLElement,
  initialStyle: initialStyle,
  done: () => void,
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  options?: number | KeyframeAnimationOptions,
) {
  const animation = element.animate(keyframes, options)
  // Set height to 'auto' to restore it after animation
  element.style.height = initialStyle.height
  animation.onfinish = () => {
    element.style.overflow = initialStyle.overflow
    done()
  }
}

function getEnterKeyframes(height: string, initialStyle: initialStyle) {
  return [
    {
      height: closed,
      opacity: props.opacityClosed,
      paddingTop: closed,
      paddingBottom: closed,
      borderTopWidth: closed,
      borderBottomWidth: closed,
      marginTop: closed,
      marginBottom: closed,
    },
    {
      height,
      opacity: props.opacityOpened,
      paddingTop: initialStyle.paddingTop,
      paddingBottom: initialStyle.paddingBottom,
      borderTopWidth: initialStyle.borderTopWidth,
      borderBottomWidth: initialStyle.borderBottomWidth,
      marginTop: initialStyle.marginTop,
      marginBottom: initialStyle.marginBottom,
    },
  ]
}

function enterTransition(element: Element, done: () => void) {
  const HTMLElement = element as HTMLElement
  const initialStyle = getElementStyle(HTMLElement)
  const height = prepareElement(HTMLElement, initialStyle)
  const keyframes = getEnterKeyframes(height, initialStyle)
  const options = {duration: props.duration, easing: props.easingEnter}
  animateTransition(HTMLElement, initialStyle, done, keyframes, options)
}

function leaveTransition(element: Element, done: () => void) {
  const HTMLElement = element as HTMLElement
  const initialStyle = getElementStyle(HTMLElement)
  const {height} = getComputedStyle(HTMLElement)
  HTMLElement.style.height = height
  HTMLElement.style.overflow = 'hidden'

  const keyframes = getEnterKeyframes(height, initialStyle).reverse()
  const options = {duration: props.duration, easing: props.easingLeave}

  animateTransition(HTMLElement, initialStyle, done, keyframes, options)
}
</script>

<template>
  <Transition :css="false" @enter="enterTransition" @leave="leaveTransition">
    <slot />
  </Transition>
</template>
