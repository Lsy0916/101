<template>
  <div class="nf-game-body">
    <div class="nf-game-stats">
      <div class="nf-game-stat">
        <span class="nf-game-stat-label">LEVEL</span>
        <span class="nf-game-stat-value">{{ gameLevel }}</span>
      </div>
      <div class="nf-game-stat">
        <span class="nf-game-stat-label">STEPS</span>
        <span class="nf-game-stat-value">{{ gameSteps }}</span>
      </div>
      <div v-if="gameBestSteps > 0" class="nf-game-stat">
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
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface MazeCell {
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean }
  visited: boolean
}

interface CellPos {
  x: number
  y: number
}

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

// 方向键 / WASD 移动玩家
function handleKey(e: KeyboardEvent) {
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
  }
}

function movePlayer(dx: number, dy: number) {
  if (gameClear.value) return
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

function handleResize() {
  initMazeCanvas()
  drawMaze()
}

onMounted(() => {
  initMaze()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (clearTimer) clearTimeout(clearTimer)
  if (moveAnimRaf) cancelAnimationFrame(moveAnimRaf)
})

defineExpose({ handleKey })
</script>
