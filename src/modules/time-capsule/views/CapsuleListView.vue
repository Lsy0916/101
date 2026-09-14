<template>
  <div class="capsule-list-page" @click="closeAll">
    <!-- 装饰性背景水印 -->
    <span class="watermark" aria-hidden="true">CAPSULE</span>

    <!-- 顶部编辑式标题区 -->
    <CapsuleListHeader />

    <!-- 统计 / 筛选 / 档案列表 / 空状态 -->
    <CapsuleListArchive ref="archiveRef" @open="viewCapsule" @create="createCapsule" />

    <!-- 右下角新建按钮 -->
    <button class="fab-button" @click.stop="createCapsule">
      <span class="fab-plus">+</span>
      <span class="fab-label">{{ $t('capsule.list.fab') }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CapsuleListHeader from '../components/CapsuleListHeader.vue'
import CapsuleListArchive from '../components/CapsuleListArchive.vue'

const router = useRouter()

const archiveRef = ref<InstanceType<typeof CapsuleListArchive>>()

// 点击页面空白处收起左滑删除面板
const closeAll = () => {
  archiveRef.value?.closeAll()
}

const viewCapsule = (id: number) => {
  router.push(`/time-capsule/${id}`)
}

const createCapsule = () => {
  router.push('/time-capsule/create')
}
</script>

<style scoped>
/* ============================================================
   时光邮局 · 我的胶囊列表页
   设计语言：黑白编辑式 + 邮戳信封 + 档案编号
   ============================================================ */

.capsule-list-page {
  min-height: 100vh;
  background: #f8fbff;
  background-image:
    radial-gradient(circle at 20% 10%, rgba(0,82,217,0.015) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0,82,217,0.012) 0%, transparent 50%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'PingFang SC', sans-serif;
  color: #111827;
  padding-bottom: 140px;
  position: relative;
  overflow-x: hidden;
}

/* 背景水印 */
.watermark {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(200px, 32vw, 420px);
  font-weight: 900;
  color: var(--brand-primary);
  opacity: 0.035;
  letter-spacing: -10px;
  line-height: 0.8;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  font-family: 'Georgia', serif;
  white-space: nowrap;
}

/* ============================================================
   浮动新建按钮
   ============================================================ */
.fab-button {
  position: fixed;
  right: 40px;
  bottom: 80px;
  height: 52px;
  padding: 0 28px;
  background: var(--brand-primary);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(0, 82, 217, 0.25);
  z-index: 100;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.fab-button:hover {
  background: #0040b0;
  color: #fff;
  box-shadow: 0 16px 40px rgba(0, 82, 217, 0.35);
  gap: 14px;
  transform: translateY(-2px);
}

.fab-button:active {
  transform: scale(0.97);
}

.fab-plus {
  font-size: 24px;
  color: #fff;
  font-weight: 300;
  line-height: 1;
}

.fab-button:hover .fab-plus {
  color: #fff;
}

.fab-label {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.fab-button:hover .fab-label {
  color: #fff;
}

@media (max-width: 768px) {
  .fab-button {
    right: 16px;
    bottom: 32px;
    height: 48px;
    padding: 0 22px;
  }

  .fab-plus {
    font-size: 22px;
  }

  .fab-label {
    font-size: 11px;
  }
}
</style>
