import type { Directive } from 'vue'

interface RevealBindingValue {
  delay?: number
  direction?: string
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement
        const delay = Number(el.dataset.revealDelay) || 0
        setTimeout(() => el.classList.add('is-revealed'), delay)
        observer.unobserve(el)
      }
    })
  },
  { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
)

export const revealDirective: Directive<HTMLElement, number | RevealBindingValue | undefined> = {
  mounted(el, binding) {
    el.classList.add('reveal')
    const val = binding.value
    if (typeof val === 'number') {
      el.dataset.revealDelay = String(val)
    } else if (val && typeof val === 'object' && val.delay) {
      el.dataset.revealDelay = String(val.delay)
    }
    if (val && typeof val === 'object' && val.direction) {
      el.classList.add('reveal-' + val.direction)
    }
    observer.observe(el)

    // Fallback: 如果 IntersectionObserver 未在 1.2s 内触发，强制显示
    setTimeout(() => {
      if (!el.classList.contains('is-revealed')) {
        el.classList.add('is-revealed')
      }
    }, 1200)
  },
  unmounted(el) {
    observer.unobserve(el)
  },
}
