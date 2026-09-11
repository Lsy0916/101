import { ref } from 'vue'

/** 命令面板全局开关（模块级单例：Navbar 触发 / CommandPalette 消费） */
const open = ref(false)

export function useCommandPalette() {
  const toggle = () => {
    open.value = !open.value
  }
  const close = () => {
    open.value = false
  }
  return { open, toggle, close }
}
