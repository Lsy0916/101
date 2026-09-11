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
            placeholder="搜索页面、文章、测评…"
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
                @click="run(item)"
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

        <!-- 空状态 -->
        <div v-else class="cmd-empty">
          <span class="cmd-empty-eyebrow">— No Match</span>
          <p class="cmd-empty-text">没有找到「{{ query }}」相关内容</p>
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
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCommandPalette } from '@/composables/useCommandPalette'

const router = useRouter()
const { open, close } = useCommandPalette()
const query = ref('')
const selIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const resultsRef = ref<HTMLElement | null>(null)

interface CmdItem {
  id: string
  title: string
  desc: string
  group: 'navigation' | 'articles' | 'assessment'
  to: string
  num?: string
  tag?: string // 原模板渲染保留位（当前数据未使用）
}

// 导航条目
const navItems: CmdItem[] = [
  { id: 'nav-home', title: '首页', desc: '生涯心旅主页', group: 'navigation', to: '/' },
  { id: 'nav-articles', title: '文章中心', desc: '阅读 · 看见更广阔的自己', group: 'navigation', to: '/articles' },
  { id: 'nav-article-list', title: '文章列表', desc: '全部文章', group: 'navigation', to: '/articles/list' },
  { id: 'nav-assessment', title: '测评中心', desc: '专业心理量表', group: 'navigation', to: '/assessment' },
  { id: 'nav-counseling', title: '心理咨询', desc: '专业咨询师预约', group: 'navigation', to: '/counseling' },
  { id: 'nav-capsule', title: '时光胶囊', desc: '写给未来的自己', group: 'navigation', to: '/time-capsule' },
]

// 文章条目（模拟）
const articleItems: CmdItem[] = [
  { id: 'art-1', title: '如何在焦虑中找到内心的锚点', desc: '精选推荐', group: 'articles', to: '/articles' },
  { id: 'art-2', title: '大学生职业规划的五步法', desc: '职业发展', group: 'articles', to: '/articles' },
  { id: 'art-3', title: '正念冥想：从呼吸开始', desc: '心理健康', group: 'articles', to: '/articles' },
  { id: 'art-4', title: '拖延症背后的心理机制', desc: '心理健康', group: 'articles', to: '/articles' },
]

// 测评条目（模拟）
const assessItems: CmdItem[] = [
  { id: 'asm-1', title: 'SDS 抑郁自评量表', desc: '20题 · 约10分钟', group: 'assessment', to: '/assessment' },
  { id: 'asm-2', title: 'SAS 焦虑自评量表', desc: '20题 · 约10分钟', group: 'assessment', to: '/assessment' },
  { id: 'asm-3', title: 'MBTI 人格类型测试', desc: '93题 · 约15分钟', group: 'assessment', to: '/assessment' },
]

const allItems: CmdItem[] = [...navItems, ...articleItems, ...assessItems]

// 编号
allItems.forEach((it, i) => {
  it.num = String(i + 1).padStart(2, '0')
})

// 模糊匹配
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
  if (!q) return allItems
  return allItems.filter(
    (it) => fuzzyMatch(it.title, q) || (it.desc && fuzzyMatch(it.desc, q))
  )
})

const groupedResults = computed(() => {
  const groups: Array<{ label: string; items: CmdItem[] }> = [
    { label: '— Navigate', items: [] },
    { label: '— Articles', items: [] },
    { label: '— Assessment', items: [] },
  ]
  const map = { navigation: 0, articles: 1, assessment: 2 }
  filtered.value.forEach((it) => {
    const gi = map[it.group]
    if (gi !== undefined) groups[gi].items.push(it)
  })
  return groups
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
  if (item) run(item)
}

const run = (item: CmdItem) => {
  close()
  if (item.to) router.push(item.to)
}

const scrollIntoView = () => {
  const el = resultsRef.value?.querySelector('.cmd-item.active')
  el?.scrollIntoView({ block: 'nearest' })
}

watch(query, () => {
  selIndex.value = 0
})

watch(open, (v) => {
  if (v) {
    query.value = ''
    selIndex.value = 0
    nextTick(() => inputRef.value?.focus())
  }
})

const onKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value = !open.value
  } else if (e.key === '/' && !open.value && !isTyping(e)) {
    e.preventDefault()
    open.value = true
  } else if (e.key === 'Escape' && open.value) {
    close()
  }
}

const isTyping = (e: KeyboardEvent): boolean => {
  const target = e.target as HTMLElement | null
  const tag = target?.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable === true
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.cmd-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(10, 15, 26, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
}

.cmd-panel {
  width: 92%;
  max-width: 640px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 24px 64px rgba(10, 15, 26, 0.18);
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
  border-bottom: 1px solid #eef2f6;
}

.cmd-prompt {
  font-size: 22px;
  color: #0052d9;
  font-weight: 300;
  line-height: 1;
}

.cmd-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 17px;
  color: #0a0f1a;
  background: transparent;
  font-family: inherit;
}

.cmd-input::placeholder {
  color: #b0b8c4;
}

.cmd-esc {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #9ca3af;
  border: 1px solid #e5e7eb;
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
  color: #9ca3af;
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
  background: #f8fbff;
}

.cmd-item.active {
  border-left: 2px solid #0052d9;
  padding-left: 22px;
}

.cmd-item-num {
  font-size: 10px;
  font-weight: 600;
  color: #c0c8d4;
  font-variant-numeric: tabular-nums;
  width: 20px;
  flex-shrink: 0;
}

.cmd-item.active .cmd-item-num {
  color: #0052d9;
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
  color: #111827;
  font-weight: 500;
  line-height: 1.3;
}

.cmd-item-title :deep(mark) {
  background: rgba(0, 82, 217, 0.12);
  color: #0052d9;
  border-radius: 2px;
  padding: 0 1px;
}

.cmd-item-desc {
  font-size: 11px;
  color: #9ca3af;
  letter-spacing: 0.2px;
}

.cmd-item-tag {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #0052d9;
  text-transform: uppercase;
  flex-shrink: 0;
}

.cmd-item-arrow {
  font-size: 14px;
  color: #d1d5db;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s ease;
}

.cmd-item.active .cmd-item-arrow {
  opacity: 1;
  transform: none;
  color: #0052d9;
}

.cmd-empty {
  padding: 48px 24px;
  text-align: center;
}

.cmd-empty-eyebrow {
  font-size: 11px;
  letter-spacing: 3px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  display: block;
  margin-bottom: 12px;
}

.cmd-empty-text {
  font-size: 14px;
  color: #6b7280;
}

.cmd-footer {
  display: flex;
  gap: 20px;
  padding: 12px 24px;
  border-top: 1px solid #eef2f6;
  background: #fafbfc;
}

.cmd-footer-hint {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #9ca3af;
}

.cmd-footer-hint kbd {
  font-size: 10px;
  font-weight: 600;
  border: 1px solid #e5e7eb;
  padding: 2px 5px;
  border-radius: 3px;
  background: #fff;
  color: #6b7280;
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

@media (max-width: 576px) {
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
