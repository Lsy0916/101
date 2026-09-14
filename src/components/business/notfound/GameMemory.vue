<template>
  <div class="nf-game-body nf-memory-body">
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
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface MemoryCard {
  symbol: string
  flipped: boolean
  matched: boolean
}

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

onMounted(() => {
  initMemory()
})

onBeforeUnmount(() => {
  if (memoryFlipTimer) clearTimeout(memoryFlipTimer)
  if (memoryAutoTimer) clearTimeout(memoryAutoTimer)
})
</script>

<style scoped>
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

@media (max-height: 760px) {
  .nf-memory-grid {
    gap: 8px;
  }

  .nf-memory-face {
    font-size: 24px;
  }

  .nf-memory-back {
    font-size: 18px;
  }
}
</style>
