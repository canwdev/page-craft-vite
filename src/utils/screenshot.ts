/**
 * Code from: https://github.com/xataio/screenshot
 * Reference: https://juejin.cn/post/7157151914667442207
 */

import {sleep} from '@/utils/index'

/**
 * Checks if the current browser supports the MediaDevices API.
 */
const checkIfBrowserSupported = () => Boolean(navigator.mediaDevices?.getDisplayMedia)

const createVideoElementToCaptureFrames = (mediaStream: MediaStream) => {
  const video = document.createElement('video')
  video.autoplay = true
  video.muted = true
  video.playsInline = true
  video.srcObject = mediaStream
  video.setAttribute('style', 'position:fixed;top:0;left:0;pointer-events:none;visibility:hidden;')

  return video
}

const paintVideoFrameOnCanvas = (video: HTMLVideoElement) => {
  // Get the video settings
  // @ts-ignore because getTracks is very much valid in modern browsers
  const videoTrackSettings = video.srcObject?.getTracks()[0].getSettings()

  // Create a canvas with the video's size and draw the video frame on it
  const canvas = document.createElement('canvas')
  canvas.width = videoTrackSettings?.width ?? 0
  canvas.height = videoTrackSettings?.height ?? 0
  const ctx = canvas.getContext('2d')
  ctx?.drawImage(video, 0, 0)

  return canvas
}

const playCameraClickSound = (url: string) => {
  const audio = document.createElement('audio')
  audio.loop = false
  audio.src = url
  audio.play()
  audio.remove()
}

const stopCapture = (video: HTMLVideoElement) => {
  // @ts-ignore because getTracks is very much valid in modern browsers
  const tracks = video.srcObject?.getTracks()
  tracks?.forEach((track: {stop: () => void}) => track.stop())

  // This is the only way to clean up a video stream in the browser so...
  // eslint-disable-next-line no-param-reassign
  video.srcObject = null
  video.remove()
}

const waitForFocus = async (result: MediaStream): Promise<MediaStream> => {
  await sleep(300)
  if (document.hasFocus()) {
    return result
  }
  return waitForFocus(result)
}

type Options = {
  /**
   * The quality between 0-1 of your final image. 1 is uncompressed, 0 is lowest quality.
   * @default 0.7
   */
  quality?: number

  /**
   * What should we do when capture starts? This is usually a good time to `hideModal()` or similar.
   */
  onCaptureStart?: () => Promise<void>

  /**
   * What should we do when capture ends? This is usually a good time to clean stuff up.
   */
  onCaptureEnd?: (canvas: HTMLCanvasElement, options: Options) => Promise<any>

  /**
   * What format of image would you like?
   * @default image/jpeg
   */
  type?: 'image/jpeg' | 'image/png' | 'image/webp'

  /**
   * Why not play a little audio camera click sound effect when your screenshot is being taken?
   * @optional
   */
  soundEffectUrl?: string
}

/**
 * Takes a screenshot of the current page using a the native browser [`MediaDevices`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) API.
 */
export const takeScreenshot = async (options: Options = {}) => {
  const {onCaptureEnd, onCaptureStart, quality = 0.7, type = 'image/png', soundEffectUrl} = options
  await onCaptureStart?.()
  return navigator.mediaDevices
    .getDisplayMedia({
      // This is actually supported, but only in Chrome so not yet part of the TS typedefs, so
      // @ts-ignore
      preferCurrentTab: true,
      video: {frameRate: 30},
    })
    .then(waitForFocus) // We can only proceed if our tab is in focus.
    .then(async (result) => {
      // So we mount the screen capture to a video element...
      const video = createVideoElementToCaptureFrames(result)

      // ...which needs to be in the DOM but invisible so we can capture it.
      document.body.appendChild(video)

      // Now, we need to wait a bit to capture the right moment...
      // Hide this modal...

      // Play camera click sound, because why not
      if (soundEffectUrl) {
        playCameraClickSound(soundEffectUrl)
      }

      // Wait for the video feed...
      await sleep(300)

      // Paint the video frame on a canvas...
      const canvas = paintVideoFrameOnCanvas(video)

      // Set the data URL in state
      const screenshot = canvas.toDataURL(type, quality)

      // Stop sharing screen.
      stopCapture(video)

      // Clean up
      canvas.remove()

      if (typeof onCaptureEnd === 'function') {
        return await onCaptureEnd(canvas, options)
      }

      return screenshot
    })
}

export const pasteImage = async () => {
  const clipboardData = await navigator.clipboard.read()
  // console.log(clipboardData)
  const item = clipboardData.find((i) => i.types.find((t) => /^image/i.test(t)))
  if (!item) {
    throw new Error('No image found in clipboard')
  }
  const blob = await item.getType('image/png')
  return URL.createObjectURL(blob)
}

export const getBase64FromImageUrl = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error getting base64 from image:', error)
    return null // 或者抛出错误，根据你的需求
  }
}
