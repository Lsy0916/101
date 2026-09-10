import { ref } from 'vue'

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
