<template>
  <div class="nf-game-body">
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
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface StarPoint {
  x: number
  y: number
  no: number
}

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

function handleResize() {
  initStarCanvas()
  drawStars()
}

onMounted(() => {
  initStar()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (starClearTimer) clearTimeout(starClearTimer)
})
</script>
