import { describe, it, expect, beforeEach, vi } from 'vitest'

/**
 * useCommandPalette 单元测试。
 * 该 composable 内部为模块级单例 ref，用 vi.resetModules + 动态 import 隔离用例间状态。
 */
async function setup() {
  const mod = await import('../useCommandPalette')
  return mod.useCommandPalette()
}

describe('useCommandPalette', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('初始状态为关闭', async () => {
    const { open } = await setup()
    expect(open.value).toBe(false)
  })

  it('toggle 可切换开关状态', async () => {
    const { open, toggle } = await setup()
    toggle()
    expect(open.value).toBe(true)
    toggle()
    expect(open.value).toBe(false)
  })

  it('close 强制关闭面板', async () => {
    const { open, toggle, close } = await setup()
    toggle()
    expect(open.value).toBe(true)
    close()
    expect(open.value).toBe(false)
  })

  it('多个调用方共享同一开关（单例语义）', async () => {
    const mod = await import('../useCommandPalette')
    const a = mod.useCommandPalette()
    const b = mod.useCommandPalette()
    a.toggle()
    expect(b.open.value).toBe(true)
    b.close()
    expect(a.open.value).toBe(false)
  })
})
