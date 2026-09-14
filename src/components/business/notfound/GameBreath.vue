<template>
  <div class="nf-game-body">
    <div class="nf-game-stats">
      <div class="nf-game-stat">
        <span class="nf-game-stat-label">CYCLES</span>
        <span class="nf-game-stat-value">{{ breathCycle }}</span>
      </div>
      <div class="nf-game-stat">
        <span class="nf-game-stat-label">STREAK</span>
        <span class="nf-game-stat-value">{{ breathStreak }}</span>
      </div>
      <div v-if="breathBestStreak > 0" class="nf-game-stat">
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

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

// 空格键同步
function handleKey(e: KeyboardEvent) {
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault()
    handleBreathTap()
  }
}

onMounted(() => {
  initBreath()
})

onBeforeUnmount(() => {
  stopBreathing()
})

defineExpose({ handleKey })
</script>

<style scoped>
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
  background: radial-gradient(circle at center, color-mix(in srgb, var(--color-info) 28%, transparent) 0%, color-mix(in srgb, var(--navy-800) 15%, transparent) 70%, transparent 100%);
  border: 1px solid color-mix(in srgb, var(--color-info) 35%, transparent);
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
  background: radial-gradient(circle at center, color-mix(in srgb, var(--color-info) 50%, transparent) 0%, color-mix(in srgb, var(--navy-800) 25%, transparent) 70%, transparent 100%);
  border-color: color-mix(in srgb, var(--color-info) 70%, transparent);
  transition: transform 4s cubic-bezier(0.45, 0, 0.55, 1),
              background 4s ease,
              border-color 4s ease;
}

.nf-breath-circle.breath-hold {
  transform: scale(1.3);
  background: radial-gradient(circle at center, color-mix(in srgb, var(--color-info) 50%, transparent) 0%, color-mix(in srgb, var(--navy-800) 25%, transparent) 70%, transparent 100%);
  border-color: color-mix(in srgb, var(--color-info) 70%, transparent);
  transition: none;
}

.nf-breath-circle.breath-exhale {
  transform: scale(0.85);
  background: radial-gradient(circle at center, color-mix(in srgb, var(--color-info) 22%, transparent) 0%, color-mix(in srgb, var(--navy-800) 10%, transparent) 70%, transparent 100%);
  border-color: color-mix(in srgb, var(--color-info) 22%, transparent);
  transition: transform 6s cubic-bezier(0.45, 0, 0.55, 1),
              background 6s ease,
              border-color 6s ease;
}

.nf-breath-phase {
  font-family: var(--font-serif);
  font-size: 18px;
  letter-spacing: 8px;
  color: var(--dark-text);
  text-shadow: 0 0 20px color-mix(in srgb, var(--color-info) 80%, transparent);
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
  animation: nfSyncPulse 0.6s ease;
}

@keyframes nfSyncPulse {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@media (height <= 760px) {
  .nf-breath-circle {
    width: 170px;
    height: 170px;
  }

  .nf-breath-phase {
    font-size: 15px;
    letter-spacing: 6px;
  }
}
</style>
