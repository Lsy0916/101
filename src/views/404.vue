<template>
  <div class="nf-page" :class="{ 'is-dark-slide': isDarkSlide }">
    <!-- 自定义光标 -->
    <div ref="cursorDotRef" class="cursor-dot" :class="{ 'is-hover': cursorHover }" aria-hidden="true"></div>

    <!-- 固定导航栏 -->
    <nav class="nf-nav" :class="{ scrolled: currentSlide > 0 }">
      <div class="nf-nav-inner">
        <span class="nf-nav-logo" @click="goTo('/')">生涯心旅</span>
        <div class="nf-nav-links">
          <a
            v-for="link in navLinks"
            :key="link.key"
            class="nf-nav-link"
            @click="goTo(link.route)"
          >{{ t('notFound.nav.' + link.key) }}</a>
        </div>
      </div>
    </nav>

    <!-- 翻页指示器 -->
    <div class="nf-dots" aria-hidden="true">
      <button
        v-for="(dot, i) in slideCount"
        :key="i"
        class="nf-dot"
        :class="{ active: currentSlide === i }"
        :aria-label="`Slide ${i + 1}`"
        @click="goToSlide(i)"
      ></button>
    </div>

    <!-- 翻页提示（仅首页 · 非游戏模式） -->
    <transition name="fade">
      <div v-if="currentSlide === 0 && !activeGame" class="nf-flip-hint" @click="nextSlide">
        <span class="nf-flip-text">{{ t('notFound.hero.scroll') }}</span>
        <span class="nf-flip-mouse">
          <span class="nf-flip-wheel"></span>
        </span>
      </div>
    </transition>

    <!-- 翻页容器 -->
    <div class="nf-slides">
      <div
        class="nf-slides-track"
        :style="{ transform: `translateY(-${currentSlide * 100}vh)` }"
      >
        <!-- Slide 0：Hero 杂志封面（深蓝渐变） -->
        <section class="nf-slide nf-slide-hero">
          <div class="nf-hero-grid-bg" aria-hidden="true"></div>

          <div class="nf-hero-stage">
            <!-- 404 内容（可切换隐藏） -->
            <div class="nf-hero-content" :class="{ 'stage-out': activeGame }">
              <div class="nf-hero-inner">
                <div class="nf-hero-number hero-anim">{{ t('notFound.hero.number') }}</div>
                <div class="nf-hero-rule hero-anim"></div>
                <h1 class="nf-hero-title hero-anim">{{ t('notFound.hero.title') }}</h1>
                <p class="nf-hero-quote hero-anim">{{ t('notFound.hero.quote') }}</p>
              </div>
              <!-- 小游戏选择器 -->
              <div class="nf-game-list hero-anim">
                <button
                  v-for="(g, i) in games"
                  :key="g.id"
                  class="nf-game-entry"
                  @click="enterGame(g.id)"
                >
                  <span class="nf-game-entry-no">{{ String(i + 1).padStart(2, '0') }}</span>
                  <span class="nf-game-entry-name">{{ g.name }}</span>
                  <span class="nf-game-entry-en">{{ g.en }}</span>
                  <span class="nf-game-entry-arrow">→</span>
                </button>
              </div>
            </div>

            <!-- 游戏舞台 -->
            <transition name="stage-game">
              <div v-if="activeGame" class="nf-game-stage">
                <div class="nf-game-header">
                  <button class="nf-game-back" @click="exitGame">
                    <span class="nf-game-back-arrow">←</span>
                    <span>返回</span>
                  </button>
                  <span class="nf-game-title">{{ currentGameName }}</span>
                </div>

                <!-- 迷途寻路 · 迷宫 -->
                <div v-if="activeGame === 'maze'" class="nf-game-body">
                  <div class="nf-game-stats">
                    <div class="nf-game-stat">
                      <span class="nf-game-stat-label">LEVEL</span>
                      <span class="nf-game-stat-value">{{ gameLevel }}</span>
                    </div>
                    <div class="nf-game-stat">
                      <span class="nf-game-stat-label">STEPS</span>
                      <span class="nf-game-stat-value">{{ gameSteps }}</span>
                    </div>
                    <div class="nf-game-stat" v-if="gameBestSteps > 0">
                      <span class="nf-game-stat-label">BEST</span>
                      <span class="nf-game-stat-value">{{ gameBestSteps }}</span>
                    </div>
                  </div>
                  <div class="nf-game-canvas-wrap">
                    <canvas ref="gameCanvasRef" class="nf-game-canvas"></canvas>
                    <transition name="fade">
                      <div v-if="gameClear" class="nf-game-clear">
                        <span class="nf-game-clear-text">通关</span>
                        <span class="nf-game-clear-hint">进入下一关</span>
                      </div>
                    </transition>
                  </div>
                  <div class="nf-game-hint">
                    <span class="nf-game-key">↑</span>
                    <span class="nf-game-key">↓</span>
                    <span class="nf-game-key">←</span>
                    <span class="nf-game-key">→</span>
                    <span class="nf-game-hint-text">方向键移动 · 寻找蓝色出口</span>
                  </div>
                </div>

                <!-- 星轨连珠 · 连星座 -->
                <div v-else-if="activeGame === 'star'" class="nf-game-body">
                  <div class="nf-game-stats">
                    <div class="nf-game-stat">
                      <span class="nf-game-stat-label">LEVEL</span>
                      <span class="nf-game-stat-value">{{ starLevel }}</span>
                    </div>
                    <div class="nf-game-stat">
                      <span class="nf-game-stat-label">LINKED</span>
                      <span class="nf-game-stat-value">{{ starConnected }}/{{ starTotal }}</span>
                    </div>
                  </div>
                  <div class="nf-game-canvas-wrap">
                    <canvas ref="starCanvasRef" class="nf-game-canvas" @click="handleStarClick"></canvas>
                    <transition name="fade">
                      <div v-if="starClear" class="nf-game-clear">
                        <span class="nf-game-clear-text">连珠</span>
                        <span class="nf-game-clear-hint">进入下一关</span>
                      </div>
                    </transition>
                  </div>
                  <div class="nf-game-hint">
                    <span class="nf-game-hint-text">按序号依次点击星辰 · 连成星轨</span>
                  </div>
                </div>

                <!-- 心流共振 · 呼吸 -->
                <div v-else-if="activeGame === 'breath'" class="nf-game-body">
                  <div class="nf-game-stats">
                    <div class="nf-game-stat">
                      <span class="nf-game-stat-label">CYCLES</span>
                      <span class="nf-game-stat-value">{{ breathCycle }}</span>
                    </div>
                    <div class="nf-game-stat">
                      <span class="nf-game-stat-label">STREAK</span>
                      <span class="nf-game-stat-value">{{ breathStreak }}</span>
                    </div>
                    <div class="nf-game-stat" v-if="breathBestStreak > 0">
                      <span class="nf-game-stat-label">BEST</span>
                      <span class="nf-game-stat-value">{{ breathBestStreak }}</span>
                    </div>
                  </div>
                  <div class="nf-breath-wrap" @click="handleBreathTap">
                    <div class="nf-breath-circle" :class="'breath-' + breathPhase">
                      <span class="nf-breath-phase">{{ breathPhaseLabel }}</span>
                      <span class="nf-breath-sync" :class="{ show: breathJustSynced }">SYNC</span>
                    </div>
                  </div>
                  <div class="nf-game-hint">
                    <span class="nf-game-key">SPACE</span>
                    <span class="nf-game-hint-text">于相位切换瞬间敲击 · 同步心流</span>
                  </div>
                </div>

                <!-- 拾光记忆 · 翻牌 -->
                <div v-else-if="activeGame === 'memory'" class="nf-game-body nf-memory-body">
                  <div class="nf-game-stats">
                    <div class="nf-game-stat">
                      <span class="nf-game-stat-label">MOVES</span>
                      <span class="nf-game-stat-value">{{ memoryMoves }}</span>
                    </div>
                    <div class="nf-game-stat">
                      <span class="nf-game-stat-label">PAIRS</span>
                      <span class="nf-game-stat-value">{{ memoryMatches }}/6</span>
                    </div>
                  </div>
                  <div class="nf-memory-grid">
                    <button
                      v-for="(card, i) in memoryCards"
                      :key="i"
                      class="nf-memory-card"
                      :class="{ flipped: card.flipped, matched: card.matched }"
                      @click="flipCard(i)"
                    >
                      <span class="nf-memory-card-inner">
                        <span class="nf-memory-back">?</span>
                        <span class="nf-memory-face">{{ card.symbol }}</span>
                      </span>
                    </button>
                  </div>
                  <transition name="fade">
                    <div v-if="memoryClear" class="nf-game-clear nf-memory-clear">
                      <span class="nf-game-clear-text">圆满</span>
                      <span class="nf-game-clear-hint">再玩一局</span>
                    </div>
                  </transition>
                  <div class="nf-game-hint">
                    <span class="nf-game-hint-text">翻开两张相同的符号 · 配对拾光</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <div class="nf-hero-foot">
            <div class="nf-hero-meta-left">
              <span>{{ t('notFound.hero.issue') }}</span>
              <span>{{ t('notFound.hero.volume') }}</span>
            </div>
            <span class="nf-hero-page">{{ t('notFound.hero.page') }}</span>
          </div>
        </section>

        <!-- Slide 1：专题选择区（浅蓝 · 杂志网格） -->
        <section class="nf-slide nf-slide-topics">
          <div class="nf-slide-inner">
            <div class="nf-section-head">
              <span class="nf-section-label reveal-anim" data-anim="0">{{ t('notFound.topics.label') }}</span>
              <h2 class="nf-section-title reveal-anim" data-anim="1">{{ t('notFound.topics.title') }}</h2>
            </div>
            <div class="nf-topics-rule reveal-anim" data-anim="1"></div>
            <div class="nf-topics-grid">
              <article
                v-for="(item, i) in topicItems"
                :key="i"
                class="nf-topic reveal-anim"
                :data-anim="i"
                @click="goTo(item.route)"
              >
                <div class="nf-topic-meta">
                  <span class="nf-topic-no">{{ item.no }}</span>
                  <span class="nf-topic-en">{{ item.en }}</span>
                </div>
                <div class="nf-topic-image-wrap">
                  <img :src="item.image" :alt="item.zh" class="nf-topic-img" loading="lazy">
                </div>
                <h3 class="nf-topic-zh">{{ item.zh }}</h3>
                <p class="nf-topic-desc">{{ item.desc }}</p>
                <div class="nf-topic-cta">
                  <span>{{ t('notFound.topics.explore') }}</span>
                  <span class="nf-topic-arrow">→</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <!-- Slide 2：Pull Quote 引语区（深蓝渐变） -->
        <section class="nf-slide nf-slide-quote">
          <div class="nf-quote-inner reveal-anim" data-anim="0">
            <span class="nf-quote-mark" aria-hidden="true">"</span>
            <p class="nf-quote-text">{{ t('notFound.quote.text') }}</p>
            <span class="nf-quote-author">{{ t('notFound.quote.author') }}</span>
          </div>
        </section>

        <!-- Slide 3：社区笔记区（浅蓝 · 杂志专栏） -->
        <section class="nf-slide nf-slide-community">
          <div class="nf-slide-inner nf-community-inner">
            <div class="nf-community-head">
              <span class="nf-section-label reveal-anim" data-anim="0">{{ t('notFound.community.label') }}</span>
              <h2 class="nf-community-title reveal-anim" data-anim="1">{{ t('notFound.community.title') }}</h2>
              <p class="nf-community-sub reveal-anim" data-anim="2">{{ t('notFound.community.subtitle', { n: '3,247' }) }}</p>
            </div>

            <div class="nf-notes-list">
              <article
                v-for="(note, i) in visibleNotes"
                :key="note.id"
                class="nf-note reveal-anim"
                :class="{ 'nf-note-featured': note.featured }"
                :data-anim="i % 3"
              >
                <span v-if="note.featured" class="nf-note-tag">{{ t('notFound.community.featured') }}</span>
                <p class="nf-note-text">{{ note.content }}</p>
                <div class="nf-note-meta">
                  <span class="nf-note-author-line">— {{ note.user }}</span>
                  <span class="nf-note-time">{{ note.time }}</span>
                  <button
                    class="nf-note-action"
                    :class="{ liked: note.liked }"
                    @click="toggleLike(note)"
                  >
                    <span class="nf-heart">{{ note.liked ? '♥' : '♡' }}</span>
                    <span class="nf-like-count">{{ note.likes }}</span>
                  </button>
                </div>
              </article>
            </div>

            <div class="nf-write reveal-anim" data-anim="0">
              <textarea
                v-model="writeText"
                class="nf-write-input"
                :placeholder="t('notFound.community.writePlaceholder')"
                rows="1"
                @keydown="handleWriteKey"
              ></textarea>
              <button class="nf-write-submit" :disabled="!writeText.trim()" @click="submitNote">
                <span>{{ t('notFound.community.writeLabel') }}</span>
                <span class="nf-write-arrow">→</span>
              </button>
            </div>

            <div class="nf-footline">
              <span class="nf-footline-slogan">{{ t('notFound.footer.slogan') }}</span>
              <span class="nf-footline-copy">{{ t('notFound.footer.copyright') }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface NoteItem {
  id: number
  user: string
  time: string
  content: string
  likes: number
  liked: boolean
  featured: boolean
}

interface MemoryCard {
  symbol: string
  flipped: boolean
  matched: boolean
}

interface MazeCell {
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean }
  visited: boolean
}

interface CellPos {
  x: number
  y: number
}

interface StarPoint {
  x: number
  y: number
  no: number
}

const router = useRouter()
const { t, tm } = useI18n()

/* ---------- 导航数据 ---------- */
const navLinks = [
  { key: 'home', route: '/' },
  { key: 'career', route: '/assessment' },
  { key: 'treehole', route: '/square' },
  { key: 'about', route: '/' }
]

/* ---------- 翻页控制 ---------- */
const slideCount = 4
const currentSlide = ref(0)
const isAnimating = ref(false)
let animTimer: ReturnType<typeof setTimeout> | null = null

function lockAnim() {
  isAnimating.value = true
  if (animTimer) clearTimeout(animTimer)
  animTimer = setTimeout(() => {
    isAnimating.value = false
  }, 800)
}

function nextSlide() {
  if (isAnimating.value || currentSlide.value >= slideCount - 1) return
  lockAnim()
  currentSlide.value++
}

function prevSlide() {
  if (isAnimating.value || currentSlide.value <= 0) return
  lockAnim()
  currentSlide.value--
}

function goToSlide(index: number) {
  if (isAnimating.value || index === currentSlide.value) return
  lockAnim()
  currentSlide.value = index
}

/* ---------- 滚轮 / 触摸 / 键盘 ---------- */
function handleWheel(e: WheelEvent) {
  if (activeGame.value) {
    // 游戏模式下不翻页
    return
  }
  if (isAnimating.value) {
    e.preventDefault()
    return
  }
  if (e.deltaY > 30) {
    e.preventDefault()
    nextSlide()
  } else if (e.deltaY < -30) {
    e.preventDefault()
    prevSlide()
  }
}

let touchStartY = 0
function handleTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
}
function handleTouchEnd(e: TouchEvent) {
  if (activeGame.value) return
  const dy = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(dy) > 50) {
    if (dy > 0) nextSlide()
    else prevSlide()
  }
}

function handleKeydown(e: KeyboardEvent) {
  // 游戏模式下：方向键 / WASD 移动玩家（迷宫），Spacebar 呼吸同步，Esc 退出
  if (activeGame.value) {
    if (activeGame.value === 'maze') {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        movePlayer(0, -1)
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault()
        movePlayer(0, 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        movePlayer(-1, 0)
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        movePlayer(1, 0)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        exitGame()
      }
    } else if (activeGame.value === 'breath') {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        handleBreathTap()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        exitGame()
      }
    } else {
      if (e.key === 'Escape') {
        e.preventDefault()
        exitGame()
      }
    }
    return
  }

  // 非游戏模式：方向键 / 空格翻页
  if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
    e.preventDefault()
    nextSlide()
  } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
    e.preventDefault()
    prevSlide()
  } else if (e.key === 'Home') {
    e.preventDefault()
    goToSlide(0)
  } else if (e.key === 'End') {
    e.preventDefault()
    goToSlide(slideCount - 1)
  }
}

/* ---------- 深色 slide 判定 ---------- */
const darkSlides = [0, 2]
const isDarkSlide = computed(() => darkSlides.includes(currentSlide.value))

/* ---------- 专题数据 ---------- */
const topicImages = [
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'
]
const topicRoutes = ['/counseling', '/assessment', '/articles']

const topicItems = computed(() => {
  const items = tm('notFound.topics.items') as Array<{ no: string; en: string; zh: string; desc: string }>
  if (!Array.isArray(items)) return []
  return items.map((item, i) => ({
    no: item.no,
    en: item.en,
    zh: item.zh,
    desc: item.desc,
    image: topicImages[i] || topicImages[0],
    route: topicRoutes[i] || '/'
  }))
})

/* ---------- 社区笔记数据 ---------- */
let noteIdCounter = 100
const notes = reactive<NoteItem[]>([
  {
    id: 1,
    user: '林同学',
    time: '2 小时前',
    content: '在这里迷路的第三天，我开始享受这种没有目的的游荡。以前总想着要赶快找到方向，现在才明白，方向不是找出来的，是走出来的。',
    likes: 42,
    liked: false,
    featured: true
  },
  {
    id: 2,
    user: '小溪',
    time: '3 小时前',
    content: '今晚的月亮很亮，突然觉得迷路也没那么可怕。',
    likes: 18,
    liked: false,
    featured: false
  },
  {
    id: 3,
    user: '阿明',
    time: '5 小时前',
    content: '考研失败后一直很迷茫，在这里找到了共鸣。',
    likes: 27,
    liked: false,
    featured: false
  }
])

const visibleNotes = computed(() => notes.slice(0, 3))

function toggleLike(note: NoteItem) {
  note.liked = !note.liked
  note.likes += note.liked ? 1 : -1
}

/* ---------- 输入区 ---------- */
const writeText = ref('')
function handleWriteKey(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submitNote()
  }
}
function submitNote() {
  const text = writeText.value.trim()
  if (!text) return
  notes.unshift({
    id: ++noteIdCounter,
    user: '你',
    time: '刚刚',
    content: text,
    likes: 0,
    liked: false,
    featured: false
  })
  writeText.value = ''
}

/* ---------- 路由跳转 ---------- */
function goTo(route: string) {
  router.push(route)
}

/* ---------- 翻页后触发动画 ---------- */
watch(currentSlide, async () => {
  await nextTick()
  const slideEl = document.querySelectorAll('.nf-slide')[currentSlide.value]
  if (!slideEl) return
  slideEl.querySelectorAll('.reveal-anim').forEach((el) => {
    const node = el as HTMLElement
    node.classList.remove('in-view')
    void node.offsetWidth
    node.classList.add('in-view')
  })
})

/* ========== 小游戏系统 ========== */
const games = [
  { id: 'maze', name: '迷途寻路', en: 'LABYRINTH' },
  { id: 'star', name: '星轨连珠', en: 'CONSTELLATION' },
  { id: 'breath', name: '心流共振', en: 'BREATHING' },
  { id: 'memory', name: '拾光记忆', en: 'MEMORY' }
]
const activeGame = ref<string | null>(null)
const currentGameName = computed(() => {
  const g = games.find((x) => x.id === activeGame.value)
  return g ? `${g.name} · ${g.en}` : ''
})

function enterGame(id: string) {
  exitGame()
  activeGame.value = id
  nextTick(() => {
    if (id === 'maze') initMaze()
    else if (id === 'star') initStar()
    else if (id === 'breath') initBreath()
    else if (id === 'memory') initMemory()
  })
}

function exitGame() {
  activeGame.value = null
  gameClear.value = false
  starClear.value = false
  memoryClear.value = false
  if (clearTimer) { clearTimeout(clearTimer); clearTimer = null }
  if (moveAnimRaf) { cancelAnimationFrame(moveAnimRaf); moveAnimRaf = null }
  if (starClearTimer) { clearTimeout(starClearTimer); starClearTimer = null }
  stopBreathing()
  if (memoryFlipTimer) { clearTimeout(memoryFlipTimer); memoryFlipTimer = null }
  if (memoryAutoTimer) { clearTimeout(memoryAutoTimer); memoryAutoTimer = null }
}

/* ---------- 迷途寻路 · 迷宫 ---------- */
const gameCanvasRef = ref<HTMLCanvasElement | null>(null)
const gameLevel = ref(1)
const gameSteps = ref(0)
const gameBestSteps = ref(0)
const gameClear = ref(false)

// 迷宫运行时状态（非响应式，避免性能问题）
let mazeCols = 7
let mazeRows = 7
let mazeCells: MazeCell[][] = []
let playerCell: CellPos = { x: 0, y: 0 }
let playerRender: CellPos = { x: 0, y: 0 }
let exitCell: CellPos = { x: 0, y: 0 }
let canvasCtx: CanvasRenderingContext2D | null = null
let canvasSize = 480
let cellSize = 0
let mazeOffset = 0
let clearTimer: ReturnType<typeof setTimeout> | null = null
let moveAnimRaf: number | null = null

function initMaze() {
  gameLevel.value = 1
  gameSteps.value = 0
  gameBestSteps.value = 0
  mazeCols = 7
  mazeRows = 7
  initMazeCanvas()
  generateMaze(mazeCols, mazeRows)
  playerCell = { x: 0, y: 0 }
  playerRender = { x: 0, y: 0 }
  exitCell = { x: mazeCols - 1, y: mazeRows - 1 }
  gameClear.value = false
  drawMaze()
}

function initMazeCanvas() {
  const canvas = gameCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  canvasSize = Math.max(280, Math.min(rect.width || 480, rect.height || 480))
  const dpr = window.devicePixelRatio || 1
  canvas.width = canvasSize * dpr
  canvas.height = canvasSize * dpr
  canvas.style.width = canvasSize + 'px'
  canvas.style.height = canvasSize + 'px'
  canvasCtx = canvas.getContext('2d')
  if (!canvasCtx) return
  canvasCtx.scale(dpr, dpr)
  const padding = 14
  cellSize = (canvasSize - padding * 2) / Math.max(mazeCols, mazeRows)
  mazeOffset = (canvasSize - cellSize * mazeCols) / 2
}

// 递归回溯 DFS 生成迷宫
function generateMaze(cols: number, rows: number) {
  mazeCells = []
  for (let y = 0; y < rows; y++) {
    const row = []
    for (let x = 0; x < cols; x++) {
      row.push({
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false
      })
    }
    mazeCells.push(row)
  }

  const stack = []
  mazeCells[0][0].visited = true
  stack.push({ x: 0, y: 0 })

  while (stack.length > 0) {
    const current = stack[stack.length - 1]
    const neighbors = getUnvisitedNeighbors(current.x, current.y, cols, rows)
    if (neighbors.length === 0) {
      stack.pop()
    } else {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)]
      removeWall(current, next)
      mazeCells[next.y][next.x].visited = true
      stack.push(next)
    }
  }
}

function getUnvisitedNeighbors(x: number, y: number, cols: number, rows: number) {
  const result = []
  if (y > 0 && !mazeCells[y - 1][x].visited) result.push({ x, y: y - 1 })
  if (x < cols - 1 && !mazeCells[y][x + 1].visited) result.push({ x: x + 1, y })
  if (y < rows - 1 && !mazeCells[y + 1][x].visited) result.push({ x, y: y + 1 })
  if (x > 0 && !mazeCells[y][x - 1].visited) result.push({ x: x - 1, y })
  return result
}

function removeWall(a: CellPos, b: CellPos) {
  if (a.x === b.x) {
    if (a.y < b.y) {
      mazeCells[a.y][a.x].walls.bottom = false
      mazeCells[b.y][b.x].walls.top = false
    } else {
      mazeCells[a.y][a.x].walls.top = false
      mazeCells[b.y][b.x].walls.bottom = false
    }
  } else {
    if (a.x < b.x) {
      mazeCells[a.y][a.x].walls.right = false
      mazeCells[b.y][b.x].walls.left = false
    } else {
      mazeCells[a.y][a.x].walls.left = false
      mazeCells[b.y][b.x].walls.right = false
    }
  }
}

function drawMaze() {
  if (!canvasCtx) return
  const ctx = canvasCtx
  ctx.clearRect(0, 0, canvasSize, canvasSize)

  // 墙线（半透明白色，细线杂志风）
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)'
  ctx.lineWidth = 1.2
  ctx.lineCap = 'round'

  for (let y = 0; y < mazeRows; y++) {
    for (let x = 0; x < mazeCols; x++) {
      const cell = mazeCells[y][x]
      const px = mazeOffset + x * cellSize
      const py = mazeOffset + y * cellSize
      if (cell.walls.top) {
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(px + cellSize, py)
        ctx.stroke()
      }
      if (cell.walls.right) {
        ctx.beginPath()
        ctx.moveTo(px + cellSize, py)
        ctx.lineTo(px + cellSize, py + cellSize)
        ctx.stroke()
      }
      if (cell.walls.bottom) {
        ctx.beginPath()
        ctx.moveTo(px, py + cellSize)
        ctx.lineTo(px + cellSize, py + cellSize)
        ctx.stroke()
      }
      if (cell.walls.left) {
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(px, py + cellSize)
        ctx.stroke()
      }
    }
  }

  // 出口（蓝色发光圆点）
  const exitPx = mazeOffset + exitCell.x * cellSize + cellSize / 2
  const exitPy = mazeOffset + exitCell.y * cellSize + cellSize / 2
  const exitR = Math.max(4, cellSize * 0.26)
  const exitGlow = ctx.createRadialGradient(exitPx, exitPy, 0, exitPx, exitPy, exitR * 2.8)
  exitGlow.addColorStop(0, 'rgba(24, 144, 255, 0.95)')
  exitGlow.addColorStop(0.5, 'rgba(24, 144, 255, 0.35)')
  exitGlow.addColorStop(1, 'rgba(24, 144, 255, 0)')
  ctx.fillStyle = exitGlow
  ctx.beginPath()
  ctx.arc(exitPx, exitPy, exitR * 2.8, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#1890ff'
  ctx.beginPath()
  ctx.arc(exitPx, exitPy, exitR, 0, Math.PI * 2)
  ctx.fill()

  // 玩家（白色发光圆点）
  const playerPx = mazeOffset + playerRender.x * cellSize + cellSize / 2
  const playerPy = mazeOffset + playerRender.y * cellSize + cellSize / 2
  const playerR = Math.max(3, cellSize * 0.2)
  const playerGlow = ctx.createRadialGradient(playerPx, playerPy, 0, playerPx, playerPy, playerR * 2.8)
  playerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
  playerGlow.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)')
  playerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = playerGlow
  ctx.beginPath()
  ctx.arc(playerPx, playerPy, playerR * 2.8, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(playerPx, playerPy, playerR, 0, Math.PI * 2)
  ctx.fill()
}

function movePlayer(dx: number, dy: number) {
  if (gameClear.value || activeGame.value !== 'maze') return
  const cell = mazeCells[playerCell.y][playerCell.x]
  if (dx === 1 && cell.walls.right) return
  if (dx === -1 && cell.walls.left) return
  if (dy === 1 && cell.walls.bottom) return
  if (dy === -1 && cell.walls.top) return

  const newX = playerCell.x + dx
  const newY = playerCell.y + dy
  if (newX < 0 || newX >= mazeCols || newY < 0 || newY >= mazeRows) return

  playerCell = { x: newX, y: newY }
  gameSteps.value++

  animatePlayerMove()

  if (playerCell.x === exitCell.x && playerCell.y === exitCell.y) {
    handleClear()
  }
}

function animatePlayerMove() {
  if (moveAnimRaf) cancelAnimationFrame(moveAnimRaf)
  const startX = playerRender.x
  const startY = playerRender.y
  const targetX = playerCell.x
  const targetY = playerCell.y
  const duration = 130
  const startTime = performance.now()
  function step(now: number) {
    const t = Math.min(1, (now - startTime) / duration)
    const ease = 1 - Math.pow(1 - t, 3)
    playerRender.x = startX + (targetX - startX) * ease
    playerRender.y = startY + (targetY - startY) * ease
    drawMaze()
    if (t < 1) {
      moveAnimRaf = requestAnimationFrame(step)
    } else {
      moveAnimRaf = null
    }
  }
  moveAnimRaf = requestAnimationFrame(step)
}

function handleClear() {
  gameClear.value = true
  if (gameBestSteps.value === 0 || gameSteps.value < gameBestSteps.value) {
    gameBestSteps.value = gameSteps.value
  }
  clearTimer = setTimeout(() => {
    nextLevel()
  }, 1500)
}

function nextLevel() {
  gameClear.value = false
  gameLevel.value++
  mazeCols = Math.min(30, 7 + (gameLevel.value - 1))
  mazeRows = mazeCols
  initMazeCanvas()
  generateMaze(mazeCols, mazeRows)
  playerCell = { x: 0, y: 0 }
  playerRender = { x: 0, y: 0 }
  exitCell = { x: mazeCols - 1, y: mazeRows - 1 }
  gameSteps.value = 0
  drawMaze()
}

/* ---------- 星轨连珠 · 连星座 ---------- */
const starCanvasRef = ref<HTMLCanvasElement | null>(null)
const starLevel = ref(1)
const starConnected = ref(0)
const starTotal = ref(0)
const starClear = ref(false)
let starCtx: CanvasRenderingContext2D | null = null
let starCanvasSize = 480
let starPoints: StarPoint[] = [] // {x, y, no} 坐标存为 0-1 比例，resize 安全
let starClearTimer: ReturnType<typeof setTimeout> | null = null

function initStar() {
  starLevel.value = 1
  starClear.value = false
  initStarCanvas()
  generateStars(5)
  drawStars()
}

function initStarCanvas() {
  const canvas = starCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  starCanvasSize = Math.max(280, Math.min(rect.width || 480, rect.height || 480))
  const dpr = window.devicePixelRatio || 1
  canvas.width = starCanvasSize * dpr
  canvas.height = starCanvasSize * dpr
  canvas.style.width = starCanvasSize + 'px'
  canvas.style.height = starCanvasSize + 'px'
  starCtx = canvas.getContext('2d')
  if (!starCtx) return
  starCtx.scale(dpr, dpr)
}

function generateStars(count: number) {
  starTotal.value = count
  starConnected.value = 0
  starPoints = []
  const padding = 0.12
  const minDist = Math.max(0.08, 0.7 / Math.sqrt(count))
  let attempts = 0
  while (starPoints.length < count && attempts < 500) {
    attempts++
    const x = padding + Math.random() * (1 - padding * 2)
    const y = padding + Math.random() * (1 - padding * 2)
    let ok = true
    for (const p of starPoints) {
      if (Math.hypot(p.x - x, p.y - y) < minDist) { ok = false; break }
    }
    if (ok) starPoints.push({ x, y, no: starPoints.length + 1 })
  }
}

function drawStars() {
  if (!starCtx) return
  const ctx = starCtx
  const size = starCanvasSize
  ctx.clearRect(0, 0, size, size)

  // 已连接的星轨连线（蓝色发光）
  if (starConnected.value > 1) {
    ctx.strokeStyle = 'rgba(24, 144, 255, 0.75)'
    ctx.lineWidth = 1.4
    ctx.lineCap = 'round'
    ctx.shadowColor = 'rgba(24, 144, 255, 0.85)'
    ctx.shadowBlur = 10
    ctx.beginPath()
    for (let i = 0; i < starConnected.value; i++) {
      const p = starPoints[i]
      const px = p.x * size
      const py = p.y * size
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  // 星辰
  for (let i = 0; i < starPoints.length; i++) {
    const p = starPoints[i]
    const px = p.x * size
    const py = p.y * size
    const isLinked = i < starConnected.value
    const isNext = i === starConnected.value
    const r = isNext ? 6 : 4.5

    const glow = ctx.createRadialGradient(px, py, 0, px, py, r * 4)
    if (isLinked) {
      glow.addColorStop(0, 'rgba(24, 144, 255, 0.95)')
      glow.addColorStop(0.5, 'rgba(24, 144, 255, 0.3)')
      glow.addColorStop(1, 'rgba(24, 144, 255, 0)')
    } else if (isNext) {
      glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
      glow.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)')
      glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
    } else {
      glow.addColorStop(0, 'rgba(255, 255, 255, 0.5)')
      glow.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)')
      glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
    }
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(px, py, r * 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = isLinked ? '#1890ff' : (isNext ? '#ffffff' : 'rgba(255, 255, 255, 0.6)')
    ctx.beginPath()
    ctx.arc(px, py, r, 0, Math.PI * 2)
    ctx.fill()

    // 序号
    ctx.fillStyle = isLinked ? 'rgba(24, 144, 255, 0.9)' : (isNext ? '#ffffff' : 'rgba(255, 255, 255, 0.5)')
    ctx.font = '10px "Noto Sans SC", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(p.no), px, py - r - 10)
  }
}

function handleStarClick(e: MouseEvent) {
  if (starClear.value) return
  const canvas = starCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const xRatio = (e.clientX - rect.left) / rect.width
  const yRatio = (e.clientY - rect.top) / rect.height

  const nextIdx = starConnected.value
  if (nextIdx >= starPoints.length) return
  const next = starPoints[nextIdx]
  if (Math.hypot(next.x - xRatio, next.y - yRatio) < 0.08) {
    starConnected.value++
    drawStars()
    if (starConnected.value >= starTotal.value) {
      starClear.value = true
      starClearTimer = setTimeout(() => nextStarLevel(), 1500)
    }
  }
}

function nextStarLevel() {
  starClear.value = false
  starLevel.value++
  initStarCanvas()
  generateStars(Math.min(15, 5 + (starLevel.value - 1)))
  drawStars()
}

/* ---------- 心流共振 · 呼吸 ---------- */
const BREATH = [
  { phase: 'inhale', duration: 4000, label: '吸 气' },
  { phase: 'hold', duration: 4000, label: '屏 息' },
  { phase: 'exhale', duration: 6000, label: '呼 气' }
]
const SYNC_WINDOW = 800 // 相位切换前后 400ms 内敲击算同步

const breathPhase = ref('inhale')
const breathCycle = ref(0)
const breathStreak = ref(0)
const breathBestStreak = ref(0)
const breathJustSynced = ref(false)
let breathRaf: number | null = null
let breathPhaseStart = 0
let breathPhaseIdx = 0
let breathSyncTimer: ReturnType<typeof setTimeout> | null = null

const breathPhaseLabel = computed(() => {
  const item = BREATH.find((b) => b.phase === breathPhase.value)
  return item ? item.label : ''
})

function initBreath() {
  breathPhase.value = 'inhale'
  breathCycle.value = 0
  breathStreak.value = 0
  breathJustSynced.value = false
  breathPhaseIdx = 0
  breathPhaseStart = performance.now()
  startBreathLoop()
}

function startBreathLoop() {
  if (breathRaf) cancelAnimationFrame(breathRaf)
  const step = (now: number) => {
    const elapsed = now - breathPhaseStart
    const current = BREATH[breathPhaseIdx]
    if (elapsed >= current.duration) {
      breathPhaseIdx = (breathPhaseIdx + 1) % BREATH.length
      breathPhase.value = BREATH[breathPhaseIdx].phase
      breathPhaseStart = now
      if (breathPhaseIdx === 0) breathCycle.value++
    }
    breathRaf = requestAnimationFrame(step)
  }
  breathRaf = requestAnimationFrame(step)
}

function handleBreathTap() {
  if (!breathRaf) return
  const now = performance.now()
  const elapsed = now - breathPhaseStart
  const current = BREATH[breathPhaseIdx]
  const remaining = current.duration - elapsed
  // 在相位切换前 400ms 或后 400ms 内敲击算同步
  const isNearStart = elapsed < SYNC_WINDOW / 2
  const isNearEnd = remaining < SYNC_WINDOW / 2
  if (isNearStart || isNearEnd) {
    breathStreak.value++
    if (breathStreak.value > breathBestStreak.value) {
      breathBestStreak.value = breathStreak.value
    }
    breathJustSynced.value = true
    if (breathSyncTimer) clearTimeout(breathSyncTimer)
    breathSyncTimer = setTimeout(() => {
      breathJustSynced.value = false
    }, 600)
  } else {
    breathStreak.value = 0
  }
}

function stopBreathing() {
  if (breathRaf) { cancelAnimationFrame(breathRaf); breathRaf = null }
  if (breathSyncTimer) { clearTimeout(breathSyncTimer); breathSyncTimer = null }
  breathJustSynced.value = false
}

/* ---------- 拾光记忆 · 翻牌 ---------- */
const MEMORY_SYMBOLS = ['◯', '△', '□', '◇', '✦', '⬡']

const memoryCards = ref<MemoryCard[]>([])
const memoryMoves = ref(0)
const memoryMatches = ref(0)
const memoryClear = ref(false)
let memoryFlippedIdx = -1
let memoryLock = false
let memoryFlipTimer: ReturnType<typeof setTimeout> | null = null
let memoryAutoTimer: ReturnType<typeof setTimeout> | null = null

function initMemory() {
  memoryMoves.value = 0
  memoryMatches.value = 0
  memoryClear.value = false
  memoryFlippedIdx = -1
  memoryLock = false
  const pairs = [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS]
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
  }
  memoryCards.value = pairs.map((symbol) => ({
    symbol,
    flipped: false,
    matched: false
  }))
}

function flipCard(idx: number) {
  if (memoryLock) return
  const card = memoryCards.value[idx]
  if (card.flipped || card.matched) return

  card.flipped = true

  if (memoryFlippedIdx === -1) {
    memoryFlippedIdx = idx
    return
  }

  memoryMoves.value++
  const firstCard = memoryCards.value[memoryFlippedIdx]
  const secondCard = card

  if (firstCard.symbol === secondCard.symbol) {
    firstCard.matched = true
    secondCard.matched = true
    memoryMatches.value++
    memoryFlippedIdx = -1
    if (memoryMatches.value >= MEMORY_SYMBOLS.length) {
      memoryClear.value = true
      memoryAutoTimer = setTimeout(() => {
        initMemory()
      }, 2200)
    }
  } else {
    memoryLock = true
    memoryFlipTimer = setTimeout(() => {
      firstCard.flipped = false
      secondCard.flipped = false
      memoryFlippedIdx = -1
      memoryLock = false
    }, 800)
  }
}

/* ---------- 自定义光标 cursor-dot ---------- */
const cursorDotRef = ref<HTMLDivElement | null>(null)
const cursorHover = ref(false)
let cursorRaf: number | null = null
let cursorX = 0
let cursorY = 0
let dotX = 0
let dotY = 0
let cursorVisible = false

function handleMouseMove(e: MouseEvent) {
  cursorX = e.clientX
  cursorY = e.clientY
  if (!cursorVisible) {
    cursorVisible = true
    dotX = cursorX
    dotY = cursorY
    if (cursorDotRef.value) cursorDotRef.value.style.opacity = '1'
  }
  if (!cursorRaf) {
    cursorRaf = requestAnimationFrame(updateCursorDot)
  }
  // 检测是否悬停在可交互元素上 → 光标点放大为圆环（替代系统手指样式）
  const target = e.target as HTMLElement
  const interactive = target.closest && target.closest(
    'a, button, .nf-topic, .nf-nav-link, .nf-nav-logo, .nf-dot, .nf-flip-hint, .nf-game-entry, .nf-game-back, .nf-memory-card, .nf-breath-wrap, .nf-note-action, .nf-write-submit, .nf-footer-link'
  )
  cursorHover.value = !!interactive
}

function updateCursorDot() {
  cursorRaf = null
  dotX += (cursorX - dotX) * 0.32
  dotY += (cursorY - dotY) * 0.32
  if (cursorDotRef.value) {
    cursorDotRef.value.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`
  }
  if (Math.abs(cursorX - dotX) > 0.3 || Math.abs(cursorY - dotY) > 0.3) {
    cursorRaf = requestAnimationFrame(updateCursorDot)
  }
}

function handleMouseLeave() {
  cursorVisible = false
  if (cursorDotRef.value) cursorDotRef.value.style.opacity = '0'
}

/* ---------- 生命周期 ---------- */
onMounted(async () => {
  window.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchend', handleTouchEnd, { passive: true })
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  document.addEventListener('mouseleave', handleMouseLeave)
  window.addEventListener('resize', handleResize)

  await nextTick()

  const firstSlide = document.querySelector('.nf-slide-hero')
  firstSlide?.querySelectorAll('.reveal-anim').forEach((el) => el.classList.add('in-view'))
})

function handleResize() {
  if (activeGame.value === 'maze') {
    initMazeCanvas()
    drawMaze()
  } else if (activeGame.value === 'star') {
    initStarCanvas()
    drawStars()
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseleave', handleMouseLeave)
  window.removeEventListener('resize', handleResize)
  if (animTimer) clearTimeout(animTimer)
  if (clearTimer) clearTimeout(clearTimer)
  if (moveAnimRaf) cancelAnimationFrame(moveAnimRaf)
  if (cursorRaf) cancelAnimationFrame(cursorRaf)
  stopBreathing()
  if (starClearTimer) clearTimeout(starClearTimer)
  if (memoryFlipTimer) clearTimeout(memoryFlipTimer)
  if (memoryAutoTimer) clearTimeout(memoryAutoTimer)
})
</script>

<style scoped>
/* ========== 色彩与字体变量（品牌蓝主题） ========== */
.nf-page {
  --brand-primary: #0052d9;
  --brand-light: #1890ff;
  --brand-dark: #0a2a6b;
  --brand-gradient: linear-gradient(135deg, #0a2a6b 0%, #0052d9 50%, #1890ff 100%);

  --bg-primary: #f8fbff;
  --bg-secondary: #ffffff;
  --bg-tint: #f0f7ff;

  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;

  --border: #e5e7eb;
  --border-light: #f1f5f9;
  --border-blue: #d0e7ff;

  --dark-text: #ffffff;
  --dark-text-soft: rgba(255, 255, 255, 0.78);
  --dark-text-mute: rgba(255, 255, 255, 0.5);

  --font-display: 'Playfair Display', 'Noto Serif SC', Georgia, serif;
  --font-serif: 'Noto Serif SC', 'Playfair Display', Georgia, serif;
  --font-sans: 'Noto Sans SC', -apple-system, sans-serif;

  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-weight: 300;
  line-height: 1.6;
  height: 100vh;
  overflow: hidden;
  cursor: none;
}

/* 桌面端：强制隐藏所有系统光标（含 a/button 等 UA 默认 pointer），
   由 cursor-dot 接管 hover 反馈 */
.nf-page,
.nf-page * {
  cursor: none !important;
}

/* 自定义光标 cursor-dot：默认小圆点，hover 可交互元素时放大为圆环 */
.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
  mix-blend-mode: difference;
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  border: 1.5px solid transparent;
  box-sizing: border-box;
  transition: width 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              height 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              background 0.28s ease,
              border-color 0.28s ease,
              opacity 0.3s ease;
}

.cursor-dot.is-hover {
  width: 42px;
  height: 42px;
  background: transparent;
  border-color: #ffffff;
}

/* 触控设备：隐藏自定义光标，恢复系统光标（用 !important 覆盖桌面端强制隐藏） */
@media (hover: none), (max-width: 768px) {
  .cursor-dot {
    display: none;
  }
  .nf-page,
  .nf-page * {
    cursor: auto !important;
  }
  .nf-page :is(.nf-nav-logo, .nf-nav-link, .nf-dot, .nf-flip-hint, .nf-topic, .nf-note-action, .nf-write-submit, .nf-footer-link, .nf-game-entry, .nf-game-back, .nf-memory-card, .nf-breath-wrap, a, button) {
    cursor: pointer !important;
  }
  .nf-write-input {
    cursor: text !important;
  }
}

/* ========== 翻页容器 ========== */
.nf-slides {
  height: 100vh;
  overflow: hidden;
}

.nf-slides-track {
  transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.nf-slide {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 80px 56px 40px;
  box-sizing: border-box;
}

.nf-slide-inner {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

/* ========== 固定导航栏 ========== */
.nf-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: transparent;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.4s ease;
  border-bottom: 1px solid transparent;
}

.nf-page:not(.is-dark-slide) .nf-nav {
  background: rgba(248, 251, 255, 0.85);
}

.nf-page.is-dark-slide .nf-nav {
  background: transparent;
}

.nf-nav.scrolled {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.nf-page:not(.is-dark-slide) .nf-nav.scrolled {
  border-bottom-color: var(--border);
}

.nf-nav-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nf-nav-logo {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 2px;
  color: var(--text-primary);
  cursor: pointer;
  transition: color 0.3s ease;
}

.nf-page.is-dark-slide .nf-nav-logo {
  color: var(--dark-text);
}

.nf-nav-links {
  display: flex;
  gap: 40px;
}

.nf-nav-link {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
  padding-bottom: 4px;
  transition: color 0.3s ease;
}

.nf-page.is-dark-slide .nf-nav-link {
  color: var(--dark-text-soft);
}

.nf-nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--brand-light);
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.nf-nav-link:hover {
  color: var(--brand-primary);
}

.nf-page.is-dark-slide .nf-nav-link:hover {
  color: var(--dark-text);
}

.nf-nav-link:hover::after {
  width: 100%;
}

/* ========== 翻页指示器 ========== */
.nf-dots {
  position: fixed;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 14px;
  z-index: 100;
}

.nf-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid var(--text-tertiary);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
}

.nf-page.is-dark-slide .nf-dot {
  border-color: var(--dark-text-mute);
}

.nf-dot.active {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  transform: scale(1.3);
}

.nf-page.is-dark-slide .nf-dot.active {
  background: var(--dark-text);
  border-color: var(--dark-text);
}

.nf-dot:hover {
  border-color: var(--brand-primary);
}

.nf-page.is-dark-slide .nf-dot:hover {
  border-color: var(--dark-text);
}

/* ========== 翻页提示 ========== */
.nf-flip-hint {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  z-index: 90;
}

.nf-flip-text {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--dark-text-soft);
}

.nf-flip-mouse {
  width: 22px;
  height: 36px;
  border: 1px solid var(--dark-text-soft);
  border-radius: 12px;
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}

.nf-flip-wheel {
  width: 3px;
  height: 8px;
  background: var(--dark-text);
  border-radius: 2px;
  animation: flipWheel 1.8s ease-in-out infinite;
}

@keyframes flipWheel {
  0% { transform: translateY(0); opacity: 1; }
  60% { transform: translateY(12px); opacity: 0; }
  100% { transform: translateY(0); opacity: 0; }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* ========== Slide 0：Hero（深蓝渐变） ========== */
.nf-slide-hero {
  background: var(--brand-gradient);
  color: var(--dark-text);
  text-align: center;
}

.nf-hero-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

.nf-hero-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
}

.nf-hero-number {
  font-family: var(--font-display);
  font-size: clamp(100px, 20vw, 240px);
  font-weight: 400;
  line-height: 0.9;
  color: var(--dark-text);
  letter-spacing: -0.02em;
  text-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
}

.nf-hero-rule {
  width: 60px;
  height: 1px;
  background: var(--dark-text);
  margin: 20px auto 28px;
  opacity: 0.6;
}

.nf-hero-title {
  font-family: var(--font-serif);
  font-size: clamp(22px, 3.5vw, 42px);
  font-weight: 400;
  letter-spacing: 12px;
  color: var(--dark-text);
  margin: 0 0 28px;
  padding-left: 12px;
}

.nf-hero-quote {
  font-size: 15px;
  font-weight: 300;
  line-height: 1.8;
  color: var(--dark-text-soft);
  max-width: 420px;
  margin: 0 auto;
}

.hero-anim {
  opacity: 0;
  transform: translateY(-30px);
  animation: fadeInDown 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.nf-hero-number { animation-delay: 0s; }
.nf-hero-rule { animation-delay: 0.1s; }
.nf-hero-title { animation-delay: 0.2s; }
.nf-hero-quote { animation-delay: 0.35s; }
.nf-game-list { animation-delay: 0.5s; }

@keyframes fadeInDown {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nf-hero-foot {
  position: absolute;
  bottom: 32px;
  left: 56px;
  right: 56px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  z-index: 2;
}

.nf-hero-meta-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nf-hero-meta-left span {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--dark-text-soft);
}

.nf-hero-page {
  font-family: var(--font-display);
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--dark-text-soft);
}

/* ========== Hero 舞台切换（404 ↔ 迷宫游戏） ========== */
.nf-hero-stage {
  position: relative;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nf-hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  transition: opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}

.nf-hero-content.stage-out {
  opacity: 0;
  transform: translateY(-28px) scale(0.96);
  filter: blur(10px);
  pointer-events: none;
}

/* 小游戏选择器 · 杂志风纵向列表 */
.nf-game-list {
  margin: 40px auto 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 380px;
}

.nf-game-entry {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 18px;
  padding: 16px 4px;
  background: transparent;
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  color: var(--dark-text);
  font-family: var(--font-sans);
  text-align: left;
  cursor: pointer;
  transition: padding-left 0.45s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
  width: 100%;
}

.nf-game-entry:last-child {
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}

.nf-game-entry-no {
  font-family: var(--font-display);
  font-size: 13px;
  color: var(--dark-text-mute);
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.nf-game-entry-name {
  font-family: var(--font-serif);
  font-size: 18px;
  letter-spacing: 2px;
  color: var(--dark-text);
}

.nf-game-entry-en {
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--dark-text-mute);
}

.nf-game-entry-arrow {
  font-size: 16px;
  color: var(--dark-text-soft);
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
}

.nf-game-entry:hover {
  padding-left: 20px;
}

.nf-game-entry:hover .nf-game-entry-no,
.nf-game-entry:hover .nf-game-entry-arrow {
  color: var(--brand-light);
}

.nf-game-entry:hover .nf-game-entry-arrow {
  transform: translateX(8px);
}

/* 舞台切换动画 · 404 退出 / 游戏进入 */
.stage-game-enter-active {
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.18s,
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.18s,
              filter 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.18s;
}
.stage-game-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.stage-game-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.96);
  filter: blur(10px);
}
.stage-game-leave-to {
  opacity: 0;
  transform: translateY(-24px) scale(0.96);
  filter: blur(10px);
}

/* ========== 迷途寻路 · 迷宫游戏 ========== */
.nf-game-stage {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  width: 100%;
}

.nf-game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 460px;
  padding: 0 8px;
}

.nf-game-back {
  background: transparent;
  border: none;
  color: var(--dark-text-soft);
  font-family: var(--font-sans);
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  transition: color 0.3s ease, gap 0.3s ease;
}

.nf-game-back:hover {
  color: var(--dark-text);
  gap: 14px;
}

.nf-game-back-arrow {
  font-size: 14px;
}

.nf-game-stats {
  display: flex;
  gap: 26px;
}

.nf-game-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.nf-game-stat-label {
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--dark-text-mute);
  font-family: var(--font-sans);
}

.nf-game-stat-value {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--dark-text);
  letter-spacing: 1px;
  line-height: 1;
}

.nf-game-canvas-wrap {
  position: relative;
  width: 100%;
  max-width: 460px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nf-game-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* 通关遮罩 */
.nf-game-clear {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: radial-gradient(circle at center, rgba(24, 144, 255, 0.32) 0%, rgba(10, 42, 107, 0.62) 100%);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  pointer-events: none;
  border-radius: 4px;
}

.nf-game-clear-text {
  font-family: var(--font-display);
  font-size: 56px;
  color: var(--dark-text);
  letter-spacing: 8px;
  text-shadow: 0 4px 30px rgba(24, 144, 255, 0.8);
  animation: clearPop 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.nf-game-clear-hint {
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--dark-text-soft);
  animation: clearHintFade 0.6s ease 0.3s both;
}

@keyframes clearPop {
  0% { opacity: 0; transform: scale(0.6); }
  60% { transform: scale(1.08); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes clearHintFade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.nf-game-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--dark-text-soft);
  font-family: var(--font-sans);
  flex-wrap: wrap;
  justify-content: center;
}

.nf-game-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--dark-text-soft);
  border-radius: 4px;
  font-size: 12px;
  font-family: var(--font-sans);
}

.nf-game-hint-text {
  margin-left: 10px;
  letter-spacing: 2px;
}

.nf-game-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
}

.nf-game-title {
  font-family: var(--font-sans);
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--dark-text-mute);
}

/* ========== 心流共振 · 呼吸 ========== */
.nf-breath-wrap {
  width: 100%;
  max-width: 460px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.nf-breath-circle {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(24, 144, 255, 0.28) 0%, rgba(10, 42, 107, 0.15) 70%, transparent 100%);
  border: 1px solid rgba(24, 144, 255, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transform: scale(0.85);
  transition: transform 6s cubic-bezier(0.45, 0, 0.55, 1),
              background 6s ease,
              border-color 6s ease;
}

.nf-breath-circle.breath-inhale {
  transform: scale(1.3);
  background: radial-gradient(circle at center, rgba(24, 144, 255, 0.5) 0%, rgba(10, 42, 107, 0.25) 70%, transparent 100%);
  border-color: rgba(24, 144, 255, 0.7);
  transition: transform 4s cubic-bezier(0.45, 0, 0.55, 1),
              background 4s ease,
              border-color 4s ease;
}

.nf-breath-circle.breath-hold {
  transform: scale(1.3);
  background: radial-gradient(circle at center, rgba(24, 144, 255, 0.5) 0%, rgba(10, 42, 107, 0.25) 70%, transparent 100%);
  border-color: rgba(24, 144, 255, 0.7);
  transition: none;
}

.nf-breath-circle.breath-exhale {
  transform: scale(0.85);
  background: radial-gradient(circle at center, rgba(24, 144, 255, 0.22) 0%, rgba(10, 42, 107, 0.1) 70%, transparent 100%);
  border-color: rgba(24, 144, 255, 0.22);
  transition: transform 6s cubic-bezier(0.45, 0, 0.55, 1),
              background 6s ease,
              border-color 6s ease;
}

.nf-breath-phase {
  font-family: var(--font-serif);
  font-size: 18px;
  letter-spacing: 8px;
  color: var(--dark-text);
  text-shadow: 0 0 20px rgba(24, 144, 255, 0.8);
}

.nf-breath-sync {
  font-family: var(--font-sans);
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--brand-light);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nf-breath-sync.show {
  opacity: 1;
  animation: syncPulse 0.6s ease;
}

@keyframes syncPulse {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

/* ========== 拾光记忆 · 翻牌 ========== */
.nf-memory-body {
  position: relative;
}

.nf-memory-grid {
  width: 100%;
  max-width: 460px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  aspect-ratio: 4 / 3;
}

.nf-memory-card {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  perspective: 700px;
}

.nf-memory-card-inner {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.nf-memory-card.flipped .nf-memory-card-inner {
  transform: rotateY(180deg);
}

.nf-memory-back,
.nf-memory-face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-family: var(--font-display);
}

.nf-memory-back {
  background: rgba(255, 255, 255, 0.06);
  color: var(--dark-text-soft);
  font-size: 22px;
  letter-spacing: 2px;
}

.nf-memory-face {
  transform: rotateY(180deg);
  background: rgba(24, 144, 255, 0.15);
  color: var(--dark-text);
  font-size: 30px;
  border-color: rgba(24, 144, 255, 0.5);
}

.nf-memory-card.matched .nf-memory-face {
  background: rgba(24, 144, 255, 0.35);
  border-color: rgba(24, 144, 255, 0.9);
  box-shadow: 0 0 20px rgba(24, 144, 255, 0.4);
}

.nf-memory-clear {
  position: absolute;
  inset: 0;
  z-index: 2;
}

/* ========== Slide 1：专题选择区（杂志网格 · 无卡片） ========== */
.nf-slide-topics {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.nf-section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 24px;
}

.nf-section-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--brand-primary);
  white-space: nowrap;
  font-weight: 500;
}

.nf-section-title {
  font-family: var(--font-serif);
  font-size: clamp(26px, 3.5vw, 38px);
  font-weight: 400;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: 2px;
}

.nf-topics-rule {
  width: 100%;
  height: 1px;
  background: var(--border);
  margin-bottom: 40px;
}

.nf-topics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  flex: 1;
  align-content: center;
}

/* 杂志风：列之间用竖线分隔，无卡片 */
.nf-topic {
  cursor: pointer;
  padding: 0 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: opacity 0.3s ease;
}

.nf-topic:first-child {
  padding-left: 0;
}

.nf-topic:last-child {
  padding-right: 0;
}

.nf-topic:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 1px;
  background: var(--border);
}

.nf-topic-meta {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 18px;
}

.nf-topic-no {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 400;
  color: var(--brand-primary);
  line-height: 1;
}

.nf-topic-en {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--text-tertiary);
  font-weight: 500;
}

.nf-topic-image-wrap {
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  margin-bottom: 20px;
}

.nf-topic-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: grayscale(15%) contrast(1.02);
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease;
}

.nf-topic:hover .nf-topic-img {
  transform: scale(1.04);
  filter: grayscale(0%) contrast(1.05);
}

.nf-topic-zh {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 10px;
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.nf-topic:hover .nf-topic-zh {
  color: var(--brand-primary);
}

.nf-topic-desc {
  font-size: 13px;
  font-weight: 300;
  line-height: 1.75;
  color: var(--text-secondary);
  margin: 0 0 18px;
  flex: 1;
}

.nf-topic-cta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-primary);
  font-weight: 500;
  transition: gap 0.3s ease, color 0.3s ease;
}

.nf-topic:hover .nf-topic-cta {
  gap: 14px;
  color: var(--brand-primary);
}

.nf-topic-arrow {
  font-size: 14px;
}

/* ========== Slide 2：Pull Quote（深蓝渐变） ========== */
.nf-slide-quote {
  background: var(--brand-gradient);
  color: var(--dark-text);
}

.nf-quote-inner {
  text-align: center;
  max-width: 760px;
  position: relative;
  z-index: 1;
}

.nf-quote-mark {
  font-family: var(--font-display);
  font-size: 120px;
  color: var(--dark-text);
  opacity: 0.3;
  line-height: 1;
  display: block;
  margin-bottom: -20px;
}

.nf-quote-text {
  font-family: var(--font-serif);
  font-size: clamp(20px, 2.8vw, 32px);
  font-weight: 400;
  line-height: 1.8;
  color: var(--dark-text);
  margin: 0 0 36px;
}

.nf-quote-author {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--dark-text-soft);
}

/* ========== Slide 3：社区笔记（杂志专栏 · 无卡片） ========== */
.nf-slide-community {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.nf-community-inner {
  justify-content: flex-start;
  padding-top: 20px;
}

.nf-community-head {
  text-align: center;
  margin-bottom: 28px;
}

.nf-community-head .nf-section-label {
  display: block;
  margin-bottom: 10px;
}

.nf-community-title {
  font-family: var(--font-serif);
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 400;
  color: var(--text-primary);
  margin: 0 0 8px;
  letter-spacing: 2px;
}

.nf-community-sub {
  font-size: 12px;
  font-weight: 300;
  color: var(--text-secondary);
  margin: 0;
  letter-spacing: 1px;
}

/* 杂志风笔记列表：细线分隔，无卡片 */
.nf-notes-list {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.nf-note {
  padding: 22px 0;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nf-note:last-child {
  border-bottom: 1px solid var(--border);
}

.nf-note-tag {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--brand-primary);
  font-weight: 500;
  align-self: flex-start;
}

.nf-note-text {
  font-family: var(--font-serif);
  font-size: 15px;
  line-height: 1.85;
  margin: 0;
  color: var(--text-primary);
}

/* 精选笔记：大号衬线引言，无背景 */
.nf-note-featured .nf-note-text {
  font-size: clamp(18px, 2vw, 22px);
  font-style: italic;
  line-height: 1.7;
  color: var(--text-primary);
  font-weight: 400;
}

.nf-note-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 12px;
}

.nf-note-author-line {
  font-family: var(--font-serif);
  color: var(--text-primary);
  font-weight: 500;
}

.nf-note-time {
  color: var(--text-tertiary);
  letter-spacing: 0.5px;
}

.nf-note-action {
  background: none;
  border: none;
  font-size: 13px;
  color: var(--text-tertiary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  margin-left: auto;
  transition: color 0.3s ease;
  font-family: var(--font-sans);
}

.nf-note-action .nf-heart {
  font-size: 15px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nf-note-action.liked {
  color: #ef4444;
}

.nf-note-action.liked .nf-heart {
  animation: heartBounce 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes heartBounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
}

/* 输入区：极简底线 */
.nf-write {
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid var(--text-primary);
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.nf-write-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 8px 0;
  font-family: var(--font-serif);
  font-size: 15px;
  color: var(--text-primary);
  resize: none;
  outline: none;
}

.nf-write-input::placeholder {
  color: var(--text-tertiary);
  font-style: italic;
}

.nf-write-submit {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 500;
  font-family: var(--font-sans);
  transition: color 0.3s ease, gap 0.3s ease;
}

.nf-write-arrow {
  font-size: 14px;
}

.nf-write-submit:hover:not(:disabled) {
  color: var(--brand-primary);
  gap: 14px;
}

.nf-write-submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 底部页脚线（合并到最后一个 slide） */
.nf-footline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.nf-footline-slogan {
  font-family: var(--font-serif);
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 1px;
}

.nf-footline-copy {
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

/* ========== 滚动显现动画 ========== */
.reveal-anim {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal-anim.in-view {
  opacity: 1;
  transform: translateY(0);
}

.reveal-anim[data-anim="0"] { transition-delay: 0s; }
.reveal-anim[data-anim="1"] { transition-delay: 0.1s; }
.reveal-anim[data-anim="2"] { transition-delay: 0.2s; }
.reveal-anim[data-anim="3"] { transition-delay: 0.3s; }

/* ========== 响应式 ========== */
@media (max-width: 1024px) {
  .nf-topics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px 0;
  }

  .nf-topic:nth-child(2)::after {
    display: none;
  }

  .nf-topic-no {
    font-size: 34px;
  }
}

@media (max-width: 768px) {
  .nf-nav-inner {
    padding: 16px 20px;
  }

  .nf-nav-links {
    display: none;
  }

  .nf-slide {
    padding: 80px 24px 30px;
  }

  .nf-hero-title {
    letter-spacing: 6px;
  }

  .nf-hero-foot {
    left: 24px;
    right: 24px;
    bottom: 20px;
  }

  .nf-flip-hint {
    display: none;
  }

  .nf-dots {
    right: 16px;
    gap: 10px;
  }

  .nf-section-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 16px;
  }

  .nf-topics-rule {
    margin-bottom: 24px;
  }

  .nf-topics-grid {
    grid-template-columns: 1fr;
    gap: 24px 0;
  }

  .nf-topic {
    padding: 24px 0;
    border-top: 1px solid var(--border);
  }

  .nf-topic:first-child {
    padding-top: 0;
    border-top: none;
  }

  .nf-topic::after {
    display: none !important;
  }

  .nf-footline {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}

/* 低高度屏幕：进一步压缩 */
@media (max-height: 760px) {
  .nf-slide {
    padding: 70px 56px 24px;
  }

  .nf-hero-number {
    font-size: clamp(70px, 14vw, 160px);
  }

  .nf-hero-title {
    font-size: clamp(20px, 3vw, 32px);
    margin-bottom: 16px;
  }

  .nf-hero-quote {
    font-size: 13px;
  }

  .nf-hero-stage {
    min-height: 360px;
  }

  .nf-game-list {
    margin-top: 26px;
  }

  .nf-game-canvas-wrap {
    max-width: 360px;
  }

  .nf-game-clear-text {
    font-size: 42px;
    letter-spacing: 6px;
  }

  .nf-breath-circle {
    width: 170px;
    height: 170px;
  }

  .nf-breath-phase {
    font-size: 15px;
    letter-spacing: 6px;
  }

  .nf-memory-grid {
    gap: 8px;
  }

  .nf-memory-face {
    font-size: 24px;
  }

  .nf-memory-back {
    font-size: 18px;
  }

  .nf-section-head {
    margin-bottom: 14px;
  }

  .nf-topics-rule {
    margin-bottom: 24px;
  }

  .nf-section-title,
  .nf-community-title {
    font-size: clamp(22px, 3vw, 30px);
  }

  .nf-topic-meta {
    margin-bottom: 12px;
  }

  .nf-topic-no {
    font-size: 30px;
  }

  .nf-topic-image-wrap {
    margin-bottom: 14px;
  }

  .nf-topic-zh {
    font-size: 17px;
    margin-bottom: 8px;
  }

  .nf-topic-desc {
    font-size: 12px;
    margin-bottom: 12px;
  }

  .nf-community-head {
    margin-bottom: 20px;
  }

  .nf-note {
    padding: 16px 0;
    gap: 8px;
  }

  .nf-note-text {
    font-size: 13px;
  }

  .nf-note-featured .nf-note-text {
    font-size: 16px;
  }

  .nf-write {
    margin-bottom: 14px;
    padding-bottom: 8px;
  }

  .nf-footline {
    padding-top: 12px;
  }

  .nf-quote-mark {
    font-size: 90px;
  }
}
</style>
