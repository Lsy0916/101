<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import SquareListHeader from '../components/SquareListHeader.vue'
import SquareDailyPrompt from '../components/SquareDailyPrompt.vue'
import SquareFeedList from '../components/SquareFeedList.vue'
import SquareCommunitySidebar from '../components/SquareCommunitySidebar.vue'

const router = useRouter()

const onlineCount = ref(23)
const todayNewCount = ref(5)
const interactions = ref(0)

const openDetail = (id: number) => {
  router.push(`/square/${id}`)
}

const goCreate = () => {
  router.push('/square/create')
}
</script>

<template>
  <div class="square-page">
    <!-- 编辑式标题区 -->
    <SquareListHeader
      :online-count="onlineCount"
      :today-new-count="todayNewCount"
      :interactions="interactions"
    />

    <!-- 今日话题 -->
    <SquareDailyPrompt @join="goCreate" />

    <!-- 主体：双栏 -->
    <div class="community-body">
      <SquareFeedList
        @open="openDetail"
        @create="goCreate"
        @stats-change="interactions = $event"
      />
      <SquareCommunitySidebar :online-count="onlineCount" />
    </div>

    <!-- FAB 发布按钮 -->
    <button class="fab-btn" :aria-label="$t('square.list.fab')" @click="goCreate">
      <el-icon><Plus /></el-icon>
      <span class="fab-text">{{ $t('square.list.fab') }}</span>
    </button>
  </div>
</template>

<style scoped>
.square-page {
  min-height: 100vh;
  background: #f8fbff;
  padding-top: 28px;
  padding-bottom: 120px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
  color: #111827;
  position: relative;
  overflow-x: hidden;
}

.square-page::before {
  content: 'SQUARE';
  position: absolute;
  top: 60px;
  right: -40px;
  font-size: clamp(140px, 22vw, 280px);
  font-weight: 900;
  color: var(--brand-primary);
  opacity: 0.04;
  letter-spacing: -8px;
  line-height: 0.8;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

/* ===== 主体双栏 ===== */
.community-body {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 56px 0;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 40px;
  position: relative;
  z-index: 1;
}

/* ===== FAB ===== */
.fab-btn {
  position: fixed;
  right: 48px;
  bottom: 48px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 28px;
  background: linear-gradient(135deg, #0052d9, #1890ff);
  color: #fff;
  border: none;
  border-radius: 32px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  z-index: 50;
  transition: all 0.3s ease;
  font-family: inherit;
  box-shadow: 0 8px 24px rgba(0, 82, 217, 0.3);
  animation: fab-pulse 2.4s ease-out infinite;
}

@keyframes fab-pulse {
  0% { box-shadow: 0 8px 24px rgba(0, 82, 217, 0.3), 0 0 0 0 rgba(0, 82, 217, 0.4); }
  100% { box-shadow: 0 8px 24px rgba(0, 82, 217, 0.3), 0 0 0 20px rgba(0, 82, 217, 0); }
}

.fab-btn:hover {
  background: linear-gradient(135deg, #0040b0, #0077e6);
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(0, 82, 217, 0.4);
  animation: none;
}

.fab-btn .el-icon {
  font-size: 18px;
}

/* ===== 响应式 ===== */
@media (max-width: 1100px) {
  .community-body {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .community-body {
    padding-left: 32px;
    padding-right: 32px;
  }
}

@media (max-width: 768px) {
  .community-body {
    padding: 24px 20px 0;
  }
  .fab-btn {
    right: 20px;
    bottom: 24px;
    padding: 14px 22px;
  }
  .fab-text {
    display: none;
  }
}
</style>
