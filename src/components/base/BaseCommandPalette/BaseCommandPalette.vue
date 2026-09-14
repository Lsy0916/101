<template>
  <Transition name="palette">
    <div v-if="open" class="cmd-backdrop" @click="close()">
      <div class="cmd-panel" @click.stop>
        <!-- 搜索输入 -->
        <div class="cmd-input-row">
          <span class="cmd-prompt">›</span>
          <input
            ref="inputRef"
            v-model="query"
            class="cmd-input"
            :placeholder="placeholder"
            @keydown.down.prevent="moveSel(1)"
            @keydown.up.prevent="moveSel(-1)"
            @keydown.enter.prevent="execSel"
            @keydown.esc.prevent="close()"
          />
          <kbd class="cmd-esc">ESC</kbd>
        </div>

        <!-- 结果分组 -->
        <div v-if="flatResults.length" ref="resultsRef" class="cmd-results">
          <template v-for="group in groupedResults" :key="group.label">
            <div v-if="group.items.length" class="cmd-group">
              <div class="cmd-group-label">{{ group.label }}</div>
              <button
                v-for="item in group.items"
                :key="item.id"
                :class="['cmd-item', { active: flatResults[selIndex]?.id === item.id }]"
                @mouseenter="selIndex = flatResults.findIndex((f) => f.id === item.id)"
                @click="onSelect(item)"
              >
                <span class="cmd-item-num">{{ item.num }}</span>
                <span class="cmd-item-body">
                  <span class="cmd-item-title" v-html="highlight(item.title)"></span>
                  <span v-if="item.desc" class="cmd-item-desc">{{ item.desc }}</span>
                </span>
                <span v-if="item.tag" class="cmd-item-tag">{{ item.tag }}</span>
                <span class="cmd-item-arrow">→</span>
              </button>
            </div>
          </template>
        </div>

        <!-- 空状态（可通过 empty 插槽覆盖） -->
        <div v-else class="cmd-empty">
          <slot name="empty" :query="query">
            <span class="cmd-empty-eyebrow">— No Match</span>
            <p class="cmd-empty-text">没有找到「{{ query }}」相关内容</p>
          </slot>
        </div>

        <!-- 底部提示 -->
        <div class="cmd-footer">
          <span class="cmd-footer-hint"><kbd>↑</kbd><kbd>↓</kbd> 导航</span>
          <span class="cmd-footer-hint"><kbd>↵</kbd> 选择</span>
          <span class="cmd-footer-hint"><kbd>ESC</kbd> 关闭</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
/**
 * 【base】BaseCommandPalette —— 命令面板纯 UI 组件
 * - 受控组件：显隐经 v-model:open 控制，条目由 items 传入
 * - 选中行为通过 select 事件上抛，跳转由业务层/页面处理
 * - 分组按 items 首现顺序展示，显示名经 groupLabels 映射
 * - 分层约束：禁止依赖 @/api、@/stores、@/realtime、@/events、vue-router
 */
import { ref, computed, watch, nextTick } from 'vue'
import type { PaletteItem } from './types'

const props = withDefaults(
  defineProps<{
    /** 是否打开 */
    open?: boolean
    /** 面板条目（顺序即展示顺序） */
    items?: PaletteItem[]
    /** 搜索框占位文案 */
    placeholder?: string
    /** 分组键 → 显示名；未映射时直接展示分组键 */
    groupLabels?: Record<string, string>
  }>(),
  {
    open: false,
    items: () => [],
    placeholder: '搜索…',
    groupLabels: () => ({}),
  },
)

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'select', item: PaletteItem): void
}>()

const query = ref('')
const selIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const resultsRef = ref<HTMLElement | null>(null)

const close = () => emit('update:open', false)

// 模糊匹配（子序列匹配，保持原有行为）
const fuzzyMatch = (text: string, q: string): boolean => {
  if (!q) return true
  const lower = text.toLowerCase()
  const ql = q.toLowerCase()
  let qi = 0
  for (let i = 0; i < lower.length && qi < ql.length; i++) {
    if (lower[i] === ql[qi]) qi++
  }
  return qi === ql.length
}

const filtered = computed(() => {
  const q = query.value.trim()
  if (!q) return props.items
  return props.items.filter(
    (it) => fuzzyMatch(it.title, q) || (it.desc && fuzzyMatch(it.desc, q))
  )
})

// 分组：按 items 首现顺序，避免 base 内置业务分组知识
const groupedResults = computed(() => {
  const order: string[] = []
  const buckets = new Map<string, PaletteItem[]>()
  filtered.value.forEach((it) => {
    let list = buckets.get(it.group)
    if (!list) {
      list = []
      buckets.set(it.group, list)
      order.push(it.group)
    }
    list.push(it)
  })
  return order.map((g) => ({
    label: props.groupLabels[g] ?? g,
    items: buckets.get(g)!,
  }))
})

const flatResults = computed(() =>
  groupedResults.value.flatMap((g) => g.items)
)

const highlight = (text: string): string => {
  const q = query.value.trim()
  if (!q) return text
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(re, '<mark>$1</mark>')
}

const moveSel = (dir: number) => {
  const len = flatResults.value.length
  if (!len) return
  selIndex.value = (selIndex.value + dir + len) % len
  nextTick(scrollIntoView)
}

const execSel = () => {
  const item = flatResults.value[selIndex.value]
  if (item) emit('select', item)
}

const onSelect = (item: PaletteItem) => emit('select', item)

const scrollIntoView = () => {
  const el = resultsRef.value?.querySelector('.cmd-item.active')
  el?.scrollIntoView({ block: 'nearest' })
}

watch(query, () => {
  selIndex.value = 0
})

// 打开时重置输入并聚焦输入框
watch(
  () => props.open,
  (v) => {
    if (v) {
      query.value = ''
      selIndex.value = 0
      nextTick(() => inputRef.value?.focus())
    }
  }
)
</script>

<style scoped>
.cmd-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: color-mix(in srgb, var(--navy-950) 40%, transparent);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
}

.cmd-panel {
  width: 92%;
  max-width: 640px;
  background: white;
  border: 1px solid var(--ink-200);
  box-shadow: 0 24px 64px color-mix(in srgb, var(--navy-950) 18%, transparent);
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  overflow: hidden;
}

.cmd-input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--mist-050);
}

.cmd-prompt {
  font-size: 22px;
  color: var(--brand-primary);
  font-weight: 300;
  line-height: 1;
}

.cmd-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 17px;
  color: var(--navy-950);
  background: transparent;
  font-family: inherit;
}

.cmd-input::placeholder {
  color: #b0b8c4; /* stylelint-disable-line color-no-hex, function-allowed-list */
}

.cmd-esc {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--ink-400);
  border: 1px solid var(--ink-200);
  padding: 3px 7px;
  border-radius: 3px;
}

.cmd-results {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.cmd-group {
  padding: 8px 0;
}

.cmd-group-label {
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--ink-400);
  font-weight: 700;
  text-transform: uppercase;
  padding: 6px 24px 4px;
}

.cmd-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 11px 24px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background 0.15s ease;
}

.cmd-item:hover,
.cmd-item.active {
  background: var(--brand-primary-wash);
}

.cmd-item.active {
  border-left: 2px solid var(--brand-primary);
  padding-left: 22px;
}

.cmd-item-num {
  font-size: 10px;
  font-weight: 600;
  color: #c0c8d4; /* stylelint-disable-line color-no-hex, function-allowed-list */
  font-variant-numeric: tabular-nums;
  width: 20px;
  flex-shrink: 0;
}

.cmd-item.active .cmd-item-num {
  color: var(--brand-primary);
}

.cmd-item-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.cmd-item-title {
  font-size: 14px;
  color: var(--ink-900);
  font-weight: 500;
  line-height: 1.3;
}

.cmd-item-title :deep(mark) {
  background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
  color: var(--brand-primary);
  border-radius: 2px;
  padding: 0 1px;
}

.cmd-item-desc {
  font-size: 11px;
  color: var(--ink-400);
  letter-spacing: 0.2px;
}

.cmd-item-tag {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--brand-primary);
  text-transform: uppercase;
  flex-shrink: 0;
}

.cmd-item-arrow {
  font-size: 14px;
  color: var(--ink-300);
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s ease;
}

.cmd-item.active .cmd-item-arrow {
  opacity: 1;
  transform: none;
  color: var(--brand-primary);
}

.cmd-empty {
  padding: 48px 24px;
  text-align: center;
}

.cmd-empty-eyebrow {
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--ink-400);
  font-weight: 600;
  text-transform: uppercase;
  display: block;
  margin-bottom: 12px;
}

.cmd-empty-text {
  font-size: 14px;
  color: var(--ink-500);
}

.cmd-footer {
  display: flex;
  gap: 20px;
  padding: 12px 24px;
  border-top: 1px solid var(--mist-050);
  background: var(--mist-025);
}

.cmd-footer-hint {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--ink-400);
}

.cmd-footer-hint kbd {
  font-size: 10px;
  font-weight: 600;
  border: 1px solid var(--ink-200);
  padding: 2px 5px;
  border-radius: 3px;
  background: white;
  color: var(--ink-500);
}

/* 过渡 */
.palette-enter-active,
.palette-leave-active {
  transition: opacity 0.2s ease;
}

.palette-enter-active .cmd-panel {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease;
}

.palette-leave-active .cmd-panel {
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.palette-enter-from,
.palette-leave-to {
  opacity: 0;
}

.palette-enter-from .cmd-panel,
.palette-leave-to .cmd-panel {
  transform: translateY(-16px) scale(0.98);
  opacity: 0;
}

@media (width <= 576px) {
  .cmd-backdrop {
    padding-top: 8vh;
  }

  .cmd-panel {
    max-height: 80vh;
  }

  .cmd-item-desc {
    display: none;
  }
}
</style>
