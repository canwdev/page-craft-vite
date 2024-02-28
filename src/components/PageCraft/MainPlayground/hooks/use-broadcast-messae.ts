/**
 * 多窗口通信（包括iframe）
 * @param name 频道名
 * @param cb 回调函数
 */
export const useBroadcastMessage = (name = 'my_channel', cb?: (event: MessageEvent) => any) => {
  const channelRef = shallowRef<BroadcastChannel>()

  onMounted(() => {
    // 创建一个 Broadcast Channel
    const channel = new BroadcastChannel(name)
    if (typeof cb === 'function') {
      channel.onmessage = (event) => {
        cb(event)
      }
    }
    channelRef.value = channel

    // 向频道发送消息
    // channel.postMessage('Hello, other windows!')
  })

  onBeforeUnmount(() => {
    if (channelRef.value) {
      channelRef.value.close()
    }
  })

  return {
    channelRef,
  }
}
