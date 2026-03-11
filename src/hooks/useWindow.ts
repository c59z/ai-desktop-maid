import { invoke } from '@tauri-apps/api/core'

export const useWindow = () => {
  // 拖拽窗口
  const dragWindow = async () => {
    try {
      console.log('开始拖拽窗口')
      await invoke('drag_window')
    } catch (error) {
      console.error('拖拽窗口失败:', error)
    }
  }

  // 关闭窗口
  const closeWindow = async () => {
    try {
      console.log('尝试关闭窗口')
      await invoke('close_window')
      console.log('关闭窗口命令已发送')
    } catch (error) {
      console.error('关闭窗口失败:', error)
    }
  }

  // 最小化窗口
  const minimizeWindow = async () => {
    try {
      console.log('尝试最小化窗口')
      await invoke('minimize_window')
      console.log('最小化窗口命令已发送')
    } catch (error) {
      console.error('最小化窗口失败:', error)
    }
  }

  // 设置窗口大小
  const setWindowSize = async (width: number, height: number) => {
    try {
      await invoke('set_window_size', { width, height })
    } catch (error) {
      console.error('设置窗口大小失败:', error)
    }
  }

  return {
    dragWindow,
    closeWindow,
    minimizeWindow,
    setWindowSize,
  }
}
