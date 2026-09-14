<template>
  <div class="nf-game-stage">
    <div class="nf-game-header">
      <button class="nf-game-back" @click="emit('exit')">
        <span class="nf-game-back-arrow">←</span>
        <span>返回</span>
      </button>
      <span class="nf-game-title">{{ currentGameName }}</span>
    </div>

    <!-- 迷途寻路 · 迷宫 -->
    <GameMaze v-if="game === 'maze'" ref="mazeRef" />

    <!-- 星轨连珠 · 连星座 -->
    <GameStar v-else-if="game === 'star'" />

    <!-- 心流共振 · 呼吸 -->
    <GameBreath v-else-if="game === 'breath'" ref="breathRef" />

    <!-- 拾光记忆 · 翻牌 -->
    <GameMemory v-else-if="game === 'memory'" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { games } from './games'
import GameMaze from './GameMaze.vue'
import GameStar from './GameStar.vue'
import GameBreath from './GameBreath.vue'
import GameMemory from './GameMemory.vue'

const props = defineProps<{
  /** 当前游戏 id */
  game: string
}>()

const emit = defineEmits<{ exit: [] }>()

const mazeRef = ref<InstanceType<typeof GameMaze>>()
const breathRef = ref<InstanceType<typeof GameBreath>>()

const currentGameName = computed(() => {
  const g = games.find((x) => x.id === props.game)
  return g ? `${g.name} · ${g.en}` : ''
})

// 游戏模式键盘分发：Esc 退出，其余交给具体游戏
function handleKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    emit('exit')
    return
  }
  if (props.game === 'maze') {
    mazeRef.value?.handleKey(e)
  } else if (props.game === 'breath') {
    breathRef.value?.handleKey(e)
  }
}

defineExpose({ handleKey })
</script>

<style scoped>
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

.nf-game-title {
  font-family: var(--font-sans);
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--dark-text-mute);
}
</style>

<!-- 四个游戏共用的舞台元素样式（非 scoped，加 .nf-game-stage 前缀防污染） -->
<style>
.nf-game-stage .nf-game-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
}

.nf-game-stage .nf-game-stats {
  display: flex;
  gap: 26px;
}

.nf-game-stage .nf-game-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.nf-game-stage .nf-game-stat-label {
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--dark-text-mute);
  font-family: var(--font-sans);
}

.nf-game-stage .nf-game-stat-value {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--dark-text);
  letter-spacing: 1px;
  line-height: 1;
}

.nf-game-stage .nf-game-canvas-wrap {
  position: relative;
  width: 100%;
  max-width: 460px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nf-game-stage .nf-game-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.nf-game-stage .nf-game-clear {
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

.nf-game-stage .nf-game-clear-text {
  font-family: var(--font-display);
  font-size: 56px;
  color: var(--dark-text);
  letter-spacing: 8px;
  text-shadow: 0 4px 30px rgba(24, 144, 255, 0.8);
  animation: nfClearPop 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.nf-game-stage .nf-game-clear-hint {
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--dark-text-soft);
  animation: nfClearHintFade 0.6s ease 0.3s both;
}

@keyframes nfClearPop {
  0% { opacity: 0; transform: scale(0.6); }
  60% { transform: scale(1.08); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes nfClearHintFade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.nf-game-stage .nf-game-hint {
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

.nf-game-stage .nf-game-key {
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

.nf-game-stage .nf-game-hint-text {
  margin-left: 10px;
  letter-spacing: 2px;
}

.nf-game-stage .fade-enter-active,
.nf-game-stage .fade-leave-active {
  transition: opacity 0.5s ease;
}
.nf-game-stage .fade-enter-from,
.nf-game-stage .fade-leave-to {
  opacity: 0;
}

@media (max-height: 760px) {
  .nf-game-stage .nf-game-canvas-wrap {
    max-width: 360px;
  }

  .nf-game-stage .nf-game-clear-text {
    font-size: 42px;
    letter-spacing: 6px;
  }
}
</style>
